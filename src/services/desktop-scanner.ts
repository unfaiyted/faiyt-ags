import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { Variable } from "astal";
import { serviceLogger as logger } from "../utils/logger";
import { exec } from "astal/process";

export interface DesktopEntry {
  name: string;
  exec: string;
  icon: string;
  description?: string;
  categories?: string[];
  keywords?: string[];
  path: string;
  isAppImage?: boolean;
}

class DesktopScanner {
  private entries = Variable<DesktopEntry[]>([]);
  private appImageCache = new Map<string, DesktopEntry>();
  private hasFlatpak: boolean = false;

  // Standard locations for desktop files
  private readonly DESKTOP_DIRS = [
    "/usr/share/applications",
    "/usr/local/share/applications",
    GLib.build_filenamev([
      GLib.get_home_dir(),
      ".local",
      "share",
      "applications",
    ]),
    "/var/lib/snapd/desktop/applications",
  ];

  private readonly APPIMAGE_DIR = GLib.build_filenamev([
    GLib.get_home_dir(),
    "Applications",
  ]);

  constructor() {
    this.checkFlatpak();
    this.scan();
  }

  private checkFlatpak(): void {
    try {
      // Check if flatpak command exists
      const result = exec("command -v flatpak");
      this.hasFlatpak = result.trim().length > 0;
      
      if (this.hasFlatpak) {
        logger.debug("Flatpak detected, will scan flatpak applications");
      } else {
        logger.debug("Flatpak not found, skipping flatpak directories");
      }
    } catch (error) {
      this.hasFlatpak = false;
      logger.debug("Flatpak check failed, assuming not installed");
    }
  }

  get applications() {
    return this.entries.get();
  }

  bind() {
    return this.entries.bind();
  }

  private parseDesktopFile(path: string): DesktopEntry | null {
    try {
      const keyFile = new GLib.KeyFile();
      keyFile.load_from_file(path, GLib.KeyFileFlags.NONE);

      if (!keyFile.has_group("Desktop Entry")) {
        return null;
      }

      // Check if it's hidden or not to be shown
      try {
        const hidden = keyFile.get_boolean("Desktop Entry", "Hidden");
        if (hidden) return null;
      } catch {
        /* Hidden field not present */
      }

      try {
        const noDisplay = keyFile.get_boolean("Desktop Entry", "NoDisplay");
        if (noDisplay) return null;
      } catch {
        /* NoDisplay field not present */
      }

      const name = keyFile.get_locale_string("Desktop Entry", "Name", null);
      const exec = keyFile.get_string("Desktop Entry", "Exec");

      if (!name || !exec) return null;

      let icon = "";
      try {
        icon = keyFile.get_string("Desktop Entry", "Icon") || "";
      } catch {
        /* Icon field not present */
      }

      let description = undefined;
      try {
        description =
          keyFile.get_locale_string("Desktop Entry", "Comment", null) ||
          keyFile.get_locale_string("Desktop Entry", "GenericName", null);
      } catch {
        /* Fields not present */
      }

      let categories: string[] = [];
      try {
        const catString = keyFile.get_string("Desktop Entry", "Categories");
        categories = catString ? catString.split(";").filter((c) => c) : [];
      } catch {
        /* Categories field not present */
      }

      let keywords: string[] = [];
      try {
        const keywordString = keyFile.get_locale_string(
          "Desktop Entry",
          "Keywords",
          null,
        );
        keywords = keywordString
          ? keywordString.split(";").filter((k) => k)
          : [];
      } catch {
        /* Keywords field not present */
      }

      return {
        name,
        exec,
        icon,
        description,
        categories,
        keywords,
        path,
      };
    } catch (error) {
      logger.debug(`Failed to parse desktop file ${path}: ${error}`);
      return null;
    }
  }

  private getDesktopDirs(): string[] {
    const dirs = [...this.DESKTOP_DIRS];
    
    // Add flatpak directories only if flatpak is installed
    if (this.hasFlatpak) {
      dirs.push(
        "/var/lib/flatpak/exports/share/applications",
        GLib.build_filenamev([
          GLib.get_home_dir(),
          ".local",
          "share",
          "flatpak",
          "exports",
          "share",
          "applications",
        ])
      );
    }
    
    return dirs;
  }

  private scanDesktopFiles(): DesktopEntry[] {
    const entries: DesktopEntry[] = [];
    const seen = new Set<string>();
    const desktopDirs = this.getDesktopDirs();

    for (const dirPath of desktopDirs) {
      try {
        const dir = Gio.File.new_for_path(dirPath);
        if (!dir.query_exists(null)) continue;

        const enumerator = dir.enumerate_children(
          "standard::name,standard::type",
          Gio.FileQueryInfoFlags.NONE,
          null,
        );

        let info;
        while ((info = enumerator.next_file(null)) !== null) {
          const name = info.get_name();
          if (!name || !name.endsWith(".desktop")) continue;

          const filePath = GLib.build_filenamev([dirPath, name]);

          // Skip if we've already seen this desktop file
          if (seen.has(name)) continue;
          seen.add(name);

          const entry = this.parseDesktopFile(filePath);
          if (entry) {
            entries.push(entry);
          }
        }
      } catch (error) {
        logger.debug(`Failed to scan directory ${dirPath}: ${error}`);
      }
    }

    return entries;
  }

  private detectAppImages(): DesktopEntry[] {
    const entries: DesktopEntry[] = [];

    try {
      const dir = Gio.File.new_for_path(this.APPIMAGE_DIR);
      if (!dir.query_exists(null)) return entries;

      const enumerator = dir.enumerate_children(
        "standard::name,standard::type,access::can-execute",
        Gio.FileQueryInfoFlags.NONE,
        null,
      );

      let info;
      while ((info = enumerator.next_file(null)) !== null) {
        const name = info.get_name();
        if (!name) continue;

        // Check if it's an AppImage (case insensitive)
        if (!name.toLowerCase().endsWith(".appimage")) continue;

        // Check if it's executable
        const canExecute = info.get_attribute_boolean("access::can-execute");
        if (!canExecute) continue;

        const filePath = GLib.build_filenamev([this.APPIMAGE_DIR, name]);

        // Check cache first
        if (this.appImageCache.has(filePath)) {
          entries.push(this.appImageCache.get(filePath)!);
          continue;
        }

        // Extract name from filename
        const baseName = name.slice(0, -9); // Remove .AppImage extension
        const cleanName = baseName
          .replace(/[-_]/g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        const entry: DesktopEntry = {
          name: cleanName,
          exec: filePath,
          icon: "application-x-executable", // Default icon
          description: `AppImage: ${baseName}`,
          categories: ["AppImage"],
          keywords: [baseName.toLowerCase(), "appimage"],
          path: filePath,
          isAppImage: true,
        };

        // Try to extract icon from AppImage (this is a simplified approach)
        // In a real implementation, you might want to extract the actual icon
        const possibleIcons = [
          baseName.toLowerCase(),
          baseName.toLowerCase().replace(/[-_]/g, ""),
          baseName.split(/[-_]/)[0].toLowerCase(),
        ];

        for (const iconName of possibleIcons) {
          if (
            Gtk.IconTheme.get_for_display(Gdk.Display.get_default()).has_icon(
              iconName,
            )
          ) {
            entry.icon = iconName;
            break;
          }
        }

        this.appImageCache.set(filePath, entry);
        entries.push(entry);
      }
    } catch (error) {
      logger.debug(`Failed to scan AppImage directory: ${error}`);
    }

    return entries;
  }

  private createDesktopFileForAppImage(entry: DesktopEntry): boolean {
    try {
      const desktopDir = GLib.build_filenamev([
        GLib.get_home_dir(),
        ".local",
        "share",
        "applications",
      ]);

      // Ensure directory exists
      GLib.mkdir_with_parents(desktopDir, 0o755);

      const desktopFileName =
        entry.name.toLowerCase().replace(/\s+/g, "-") + ".desktop";
      const desktopFilePath = GLib.build_filenamev([
        desktopDir,
        desktopFileName,
      ]);

      const keyFile = new GLib.KeyFile();
      keyFile.set_string("Desktop Entry", "Type", "Application");
      keyFile.set_string("Desktop Entry", "Name", entry.name);
      keyFile.set_string("Desktop Entry", "Exec", entry.exec);
      keyFile.set_string("Desktop Entry", "Icon", entry.icon);

      if (entry.description) {
        keyFile.set_string("Desktop Entry", "Comment", entry.description);
      }

      if (entry.categories && entry.categories.length > 0) {
        keyFile.set_string(
          "Desktop Entry",
          "Categories",
          entry.categories.join(";") + ";",
        );
      }

      if (entry.keywords && entry.keywords.length > 0) {
        keyFile.set_string(
          "Desktop Entry",
          "Keywords",
          entry.keywords.join(";") + ";",
        );
      }

      keyFile.set_boolean("Desktop Entry", "Terminal", false);
      keyFile.set_string("Desktop Entry", "StartupNotify", "true");

      const data = keyFile.to_data()[0];
      GLib.file_set_contents(desktopFilePath, data);

      logger.info(`Created desktop file for AppImage: ${desktopFilePath}`);
      return true;
    } catch (error) {
      logger.error(
        `Failed to create desktop file for AppImage ${entry.name}: ${error}`,
      );
      return false;
    }
  }

  scan(): void {
    logger.debug("Scanning for desktop files and AppImages...");

    const desktopEntries = this.scanDesktopFiles();
    const appImageEntries = this.detectAppImages();

    const allEntries = [...desktopEntries, ...appImageEntries];

    // Sort by name
    allEntries.sort((a, b) => a.name.localeCompare(b.name));

    this.entries.set(allEntries);
    logger.info(
      `Found ${desktopEntries.length} desktop files and ${appImageEntries.length} AppImages`,
    );
  }

  createDesktopFilesForAllAppImages(): void {
    const appImages = this.entries.get().filter((e) => e.isAppImage);
    let created = 0;

    for (const appImage of appImages) {
      if (this.createDesktopFileForAppImage(appImage)) {
        created++;
      }
    }

    if (created > 0) {
      logger.info(`Created ${created} desktop files for AppImages`);
      // Rescan to pick up the new desktop files
      setTimeout(() => this.scan(), 1000);
    }
  }

  fuzzySearch(query: string): DesktopEntry[] {
    const lowerQuery = query.toLowerCase();
    const entries = this.entries.get();

    return entries
      .map((entry) => {
        let score = 0;
        const lowerName = entry.name.toLowerCase();

        // Exact match
        if (lowerName === lowerQuery) score += 100;
        // Starts with query
        else if (lowerName.startsWith(lowerQuery)) score += 80;
        // Contains query
        else if (lowerName.includes(lowerQuery)) score += 60;

        // Check keywords
        if (entry.keywords) {
          for (const keyword of entry.keywords) {
            if (keyword.toLowerCase().includes(lowerQuery)) {
              score += 40;
              break;
            }
          }
        }

        // Check description
        if (
          entry.description &&
          entry.description.toLowerCase().includes(lowerQuery)
        ) {
          score += 20;
        }

        // Check exec name
        const execName = entry.exec.split("/").pop()?.toLowerCase() || "";
        if (execName.includes(lowerQuery)) score += 30;

        return { entry, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ entry }) => entry);
  }
}

// Import necessary modules for GTK and Gdk
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";

export default new DesktopScanner();

