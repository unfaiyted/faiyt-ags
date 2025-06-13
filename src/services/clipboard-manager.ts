import { Variable } from "astal";
import { execAsync } from "astal/process";
import GLib from "gi://GLib?version=2.0";
import { launcherLogger as log } from "../utils/logger";

export interface ClipboardEntry {
  content: string;
  timestamp: number;
  type: "text" | "image" | "file";
  preview?: string;
  id?: string;
  imagePath?: string; // Path to saved image for image entries
  thumbnailPath?: string; // Path to cached square thumbnail
}

class ClipboardManager {
  private static instance: ClipboardManager;
  private history = Variable<ClipboardEntry[]>([]);
  private pollInterval: number | null = null;
  private lastProcessedId: string | null = null;
  private imageCacheDir: string;
  private thumbnailCacheDir: string;

  private constructor() {
    // Create image cache directory
    this.imageCacheDir = GLib.build_filenamev([
      GLib.get_user_cache_dir(),
      "ags",
      "clipboard-images",
    ]);
    GLib.mkdir_with_parents(this.imageCacheDir, 0o755);

    // Create thumbnail cache directory
    this.thumbnailCacheDir = GLib.build_filenamev([
      GLib.get_user_cache_dir(),
      "ags",
      "clipboard-thumbnails",
    ]);
    GLib.mkdir_with_parents(this.thumbnailCacheDir, 0o755);

    this.ensureCliphistRunning();
    this.startMonitoring();
  }

  private async ensureCliphistRunning() {
    try {
      // Check if cliphist store is running
      const result = await execAsync(["pgrep", "-f", "cliphist store"]);
      if (!result) {
        // Start cliphist store
        execAsync(["sh", "-c", "wl-paste --watch cliphist store &"]);
        log.info("Started cliphist store daemon");
      }
    } catch (error) {
      // pgrep returns error if no process found, so start cliphist
      try {
        execAsync(["sh", "-c", "wl-paste --watch cliphist store &"]);
        log.info("Started cliphist store daemon");
      } catch (startError) {
        log.error("Failed to start cliphist store", startError);
      }
    }
  }

  static getInstance(): ClipboardManager {
    if (!ClipboardManager.instance) {
      ClipboardManager.instance = new ClipboardManager();
    }
    return ClipboardManager.instance;
  }

  private startMonitoring() {
    // Poll cliphist every second for new entries
    this.pollInterval = GLib.timeout_add_seconds(
      GLib.PRIORITY_DEFAULT,
      1,
      () => {
        this.updateHistory();
        return true; // Continue polling
      },
    );

    // Cleanup old images every 5 minutes
    GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 300, () => {
      this.cleanupOldImages();
      return true; // Continue cleanup
    });

    // Initial load
    this.updateHistory();
  }

  private async updateHistory() {
    try {
      // Get clipboard history from cliphist
      const result = await execAsync(["cliphist", "list"]);

      if (!result) {
        log.debug("No clipboard history available");
        return;
      }

      const lines = result.split("\n").filter((line) => line.trim());
      const entries: ClipboardEntry[] = [];

      for (const line of lines.slice(0, 100)) {
        // Limit to 100 entries
        // cliphist format: <id>\t<content>
        const tabIndex = line.indexOf("\t");
        if (tabIndex === -1) continue;

        const id = line.substring(0, tabIndex);
        const content = line.substring(tabIndex + 1);

        if (!content) continue;

        // Filter out single-letter entries (vim pollution)
        if (content.trim().length === 1) continue;

        // Check if this is image data (PNG/JPEG magic bytes or base64 image)
        const isImageData = this.isImageData(content);
        let type: "text" | "image" | "file" = "text";
        let imagePath: string | undefined;
        let preview: string;

        if (isImageData) {
          type = "image";
          // Save image to cache and get path
          imagePath = await this.saveImageFromClipboard(id);

          // Extract image info from cliphist format if available
          // Format: [[ binary data 2 MiB png 1278x958 ]]
          const match = content.match(
            /\[\[\s*binary data\s+([^\s]+)\s+([^\s]+)\s+(\d+x\d+)?\s*\]\]/,
          );
          if (match) {
            const [, size, format, dimensions] = match;
            preview = `Image (${format.toUpperCase()}) ${size}${dimensions ? ` • ${dimensions}` : ""}`;
          } else {
            preview = "Image";
          }

          // log.debug("Detected image clipboard entry", {
          //   id,
          //   hasImagePath: !!imagePath,
          //   contentLength: content.length,
          //   preview,
          //   imagePath
          // });

          // Skip this entry if we couldn't save the image
          if (!imagePath) {
            log.warn("Skipping image entry without valid image path", { id });
            continue;
          }
        } else if (content.startsWith("file://")) {
          type = "file";
          const fileName =
            content.replace("file://", "").split("/").pop() || content;
          preview =
            fileName.length > 100
              ? fileName.substring(0, 100) + "..."
              : fileName;
        } else if (content.match(/\.(png|jpg|jpeg|gif|bmp|svg)$/i)) {
          type = "image";
          preview = content.split("/").pop() || "Image file";
        } else {
          // Text content
          const firstLine = content.split("\n")[0];
          const maxLength = 80; // Increased from 100 to show more content
          preview =
            firstLine.length > maxLength
              ? firstLine.substring(0, maxLength) + "..."
              : firstLine + (content.includes("\n") ? "..." : "");
        }

        entries.push({
          content,
          timestamp: Date.now() - entries.length * 60000, // Approximate timestamps
          type,
          preview,
          id,
          imagePath,
        });
      }

      this.history.set(entries);
      // log.debug("Updated clipboard history", { count: entries.length });
    } catch (error) {
      log.error("Failed to update clipboard history", error);
    }
  }

  private isImageData(content: string): boolean {
    // Check for cliphist's binary data placeholder format
    // Format: [[ binary data <size> <type> <dimensions> ]]
    if (content.startsWith("[[") && content.includes("binary data")) {
      return true;
    }

    // Check for common image magic bytes (first few characters)
    // PNG: starts with �PNG
    // JPEG: starts with ���� or ����
    // GIF: starts with GIF87a or GIF89a
    // BMP: starts with BM

    // Check if content looks like binary data (has non-printable characters)
    const hasBinaryData = /[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(
      content.substring(0, 100),
    );

    // Check for PNG signature
    if (content.startsWith("\x89PNG") || content.includes("PNG\r\n"))
      return true;

    // Check for JPEG signature
    if (content.startsWith("\xFF\xD8\xFF")) return true;

    // Check for GIF signature
    if (content.startsWith("GIF8")) return true;

    // Check for BMP signature
    if (content.startsWith("BM")) return true;

    // If it has binary data and is reasonably large, assume it's an image
    return hasBinaryData && content.length > 100;
  }

  private async saveImageFromClipboard(
    cliphistId: string,
  ): Promise<string | undefined> {
    try {
      const imagePath = GLib.build_filenamev([
        this.imageCacheDir,
        `${cliphistId.replace(/[^a-zA-Z0-9]/g, "_")}.png`,
      ]);

      // Check if we already have this image cached
      if (GLib.file_test(imagePath, GLib.FileTest.EXISTS)) {
        // log.debug("Image already cached", { imagePath });
        return imagePath;
      }

      // Use cliphist decode to get the actual image data
      // The ID might need to be escaped for shell command
      const escapedId = cliphistId.replace(/'/g, "'\\''");

      // First try direct decode
      const command = `cliphist decode '${escapedId}' > "${imagePath}"`;

      log.debug("Saving image from clipboard", {
        cliphistId,
        escapedId,
        imagePath,
        command,
      });

      try {
        await execAsync(["sh", "-c", command]);
      } catch (e) {
        log.error("Failed to decode image with cliphist", {
          error: e,
          cliphistId,
        });
        // Try alternative: use the ID directly without quotes if it's numeric
        if (/^\d+$/.test(cliphistId)) {
          const altCommand = `cliphist decode ${cliphistId} > "${imagePath}"`;
          log.debug("Trying alternative decode command", { altCommand });
          await execAsync(["sh", "-c", altCommand]);
        } else {
          throw e;
        }
      }

      // Verify the file was created and has content
      if (GLib.file_test(imagePath, GLib.FileTest.EXISTS)) {
        try {
          // Try to verify it's a valid image by getting file info
          const fileInfo = GLib.file_test(imagePath, GLib.FileTest.IS_REGULAR);
          if (fileInfo) {
            log.debug("Image saved successfully", { imagePath });
            return imagePath;
          }
        } catch (e) {
          log.debug("File exists but might not be valid image", { imagePath });
          return imagePath; // Return anyway, let the image widget handle invalid images
        }
      } else {
        log.error("Image file was not created", { imagePath });
        // Try alternative method - direct wl-paste
        try {
          const altCommand = `wl-paste -t image/png > "${imagePath}" 2>/dev/null`;
          await execAsync(["sh", "-c", altCommand]);
          if (GLib.file_test(imagePath, GLib.FileTest.EXISTS)) {
            log.debug("Image saved using wl-paste", { imagePath });
            return imagePath;
          }
        } catch (altError) {
          log.error("Alternative image save also failed", altError);
        }
      }

      return undefined;
    } catch (error) {
      log.error("Failed to save image from clipboard", error);
      return undefined;
    }
  }

  getHistory(): ClipboardEntry[] {
    return this.history.get();
  }

  async copyToClipboard(entry: ClipboardEntry): Promise<void> {
    try {
      if (entry.id && entry.type === "image") {
        // For images, use cliphist decode and pipe to wl-copy with proper mime type
        await execAsync([
          "sh",
          "-c",
          `cliphist decode ${entry.id} | wl-copy -t image/png`,
        ]);
      } else if (entry.id) {
        // For text, decode and copy
        await execAsync(["sh", "-c", `cliphist decode ${entry.id} | wl-copy`]);
      } else {
        // Direct wl-copy
        await execAsync(["wl-copy", entry.content]);
      }
      log.debug("Copied to clipboard", { type: entry.type });
    } catch (error) {
      log.error("Failed to copy to clipboard", error);
      // Fallback to direct wl-copy with entry content
      try {
        await execAsync(["wl-copy", entry.content]);
      } catch (fallbackError) {
        log.error("Fallback copy also failed", fallbackError);
      }
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await execAsync(["cliphist", "wipe"]);
      this.history.set([]);
      log.info("Cleared clipboard history");
    } catch (error) {
      log.error("Failed to clear clipboard history", error);
    }
  }

  private cleanupOldImages() {
    try {
      // Cleanup image cache
      this.cleanupDirectory(this.imageCacheDir);

      // Cleanup thumbnail cache
      this.cleanupDirectory(this.thumbnailCacheDir);
    } catch (error) {
      log.error("Failed to cleanup old images", error);
    }
  }

  private cleanupDirectory(dirPath: string) {
    try {
      const dir = GLib.Dir.open(dirPath, 0);
      const files: string[] = [];
      let filename: string | null;

      while ((filename = dir.read_name()) !== null) {
        files.push(filename);
      }

      // Get current clipboard IDs
      const currentIds = new Set(
        this.history
          .get()
          .map((entry) => entry.id)
          .filter((id) => id),
      );

      // Delete orphaned files
      for (const file of files) {
        const id = file.split("_")[0]; // Extract ID from filename
        if (!currentIds.has(id)) {
          const filePath = GLib.build_filenamev([dirPath, file]);
          try {
            GLib.unlink(filePath);
            log.debug("Cleaned up orphaned file", { file, dir: dirPath });
          } catch (e) {
            log.debug("Failed to delete file", { file, error: e });
          }
        }
      }
    } catch (error) {
      log.debug("Failed to cleanup directory", { dirPath, error });
    }
  }

  destroy() {
    if (this.pollInterval !== null) {
      GLib.source_remove(this.pollInterval);
      this.pollInterval = null;
    }

    // Cleanup cache directory
    this.cleanupOldImages();
  }
}

export default ClipboardManager.getInstance();
