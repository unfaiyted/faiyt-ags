import GdkPixbuf from "gi://GdkPixbuf";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import { createLogger } from "../utils/logger";
import { ConfigManager } from "./config-manager";

const log = createLogger("WallpaperThumbnailService");

export class WallpaperThumbnailService {
  private static instance: WallpaperThumbnailService;
  private configManager: ConfigManager;
  private thumbnailDir: string;
  private processing: boolean = false;

  private constructor() {
    this.configManager = ConfigManager.getInstance();
    this.thumbnailDir = "/tmp/ags/wallpaper-thumbnails";
    this.ensureThumbnailDirectory();
  }

  public static getInstance(): WallpaperThumbnailService {
    if (!WallpaperThumbnailService.instance) {
      WallpaperThumbnailService.instance = new WallpaperThumbnailService();
    }
    return WallpaperThumbnailService.instance;
  }

  private ensureThumbnailDirectory(): void {
    try {
      const dir = Gio.File.new_for_path(this.thumbnailDir);
      if (!dir.query_exists(null)) {
        dir.make_directory_with_parents(null);
        log.info(`Created thumbnail directory: ${this.thumbnailDir}`);
      }
    } catch (error) {
      log.error("Failed to create thumbnail directory", error);
    }
  }

  private getThumbnailPath(originalPath: string): string {
    const hash = GLib.compute_checksum_for_string(GLib.ChecksumType.MD5, originalPath, -1);
    return GLib.build_filenamev([this.thumbnailDir, `${hash}.jpg`]);
  }

  private async generateThumbnail(wallpaperPath: string): Promise<string | null> {
    try {
      const thumbnailPath = this.getThumbnailPath(wallpaperPath);
      const thumbnailFile = Gio.File.new_for_path(thumbnailPath);
      
      // Check if thumbnail already exists and is newer than original
      if (thumbnailFile.query_exists(null)) {
        const wallpaperFile = Gio.File.new_for_path(wallpaperPath);
        const wallpaperInfo = wallpaperFile.query_info("time::modified", Gio.FileQueryInfoFlags.NONE, null);
        const thumbnailInfo = thumbnailFile.query_info("time::modified", Gio.FileQueryInfoFlags.NONE, null);
        
        const wallpaperMtime = wallpaperInfo.get_modification_date_time();
        const thumbnailMtime = thumbnailInfo.get_modification_date_time();
        
        if (wallpaperMtime && thumbnailMtime && thumbnailMtime.compare(wallpaperMtime) >= 0) {
          return thumbnailPath;
        }
      }

      // Generate thumbnail
      const thumbnailSize = this.configManager.getValue("wallpaper.thumbnailSize") as number;
      const width = Math.round(thumbnailSize * 16 / 9);
      const height = thumbnailSize;

      // Load and scale image
      const pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
        wallpaperPath,
        width,
        height,
        false // Don't preserve aspect ratio to ensure fill
      );

      if (pixbuf) {
        // Save as JPEG with good quality
        pixbuf.savev(thumbnailPath, "jpeg", ["quality"], ["85"]);
        log.debug(`Generated thumbnail: ${thumbnailPath}`);
        return thumbnailPath;
      }
    } catch (error) {
      log.error(`Failed to generate thumbnail for ${wallpaperPath}`, error);
    }
    return null;
  }

  public async generateAllThumbnails(): Promise<void> {
    if (this.processing) {
      log.info("Thumbnail generation already in progress");
      return;
    }

    this.processing = true;
    const startTime = Date.now();

    try {
      const wallpaperDir = this.configManager.getValue("wallpaper.directory") as string;
      const supportedFormats = this.configManager.getValue("wallpaper.supportedFormats") as string[];
      
      const dir = Gio.File.new_for_path(wallpaperDir);
      if (!dir.query_exists(null)) {
        log.warn(`Wallpaper directory does not exist: ${wallpaperDir}`);
        return;
      }

      const enumerator = dir.enumerate_children(
        "standard::*",
        Gio.FileQueryInfoFlags.NONE,
        null
      );

      const wallpapers: string[] = [];
      let fileInfo;

      while ((fileInfo = enumerator.next_file(null)) !== null) {
        const fileName = fileInfo.get_name();
        const extension = fileName.split('.').pop()?.toLowerCase();

        if (extension && supportedFormats.includes(extension)) {
          wallpapers.push(GLib.build_filenamev([wallpaperDir, fileName]));
        }
      }

      log.info(`Found ${wallpapers.length} wallpapers to process`);

      // Process in batches to avoid overwhelming the system
      const batchSize = 5;
      for (let i = 0; i < wallpapers.length; i += batchSize) {
        const batch = wallpapers.slice(i, i + batchSize);
        await Promise.all(batch.map(path => this.generateThumbnail(path)));
        
        // Small delay between batches
        if (i + batchSize < wallpapers.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const elapsed = Date.now() - startTime;
      log.info(`Thumbnail generation completed in ${elapsed}ms`);
    } catch (error) {
      log.error("Failed to generate thumbnails", error);
    } finally {
      this.processing = false;
    }
  }

  public getThumbnailForWallpaper(wallpaperPath: string): string | null {
    const thumbnailPath = this.getThumbnailPath(wallpaperPath);
    const file = Gio.File.new_for_path(thumbnailPath);
    
    if (file.query_exists(null)) {
      return thumbnailPath;
    }
    
    // Generate thumbnail on-demand if not exists
    this.generateThumbnail(wallpaperPath).catch(err => 
      log.error("Failed to generate on-demand thumbnail", err)
    );
    
    return null;
  }

  public clearThumbnails(): void {
    try {
      const dir = Gio.File.new_for_path(this.thumbnailDir);
      const enumerator = dir.enumerate_children(
        "standard::*",
        Gio.FileQueryInfoFlags.NONE,
        null
      );

      let fileInfo;
      while ((fileInfo = enumerator.next_file(null)) !== null) {
        const child = dir.get_child(fileInfo.get_name());
        child.delete(null);
      }

      log.info("Cleared all thumbnails");
    } catch (error) {
      log.error("Failed to clear thumbnails", error);
    }
  }
}