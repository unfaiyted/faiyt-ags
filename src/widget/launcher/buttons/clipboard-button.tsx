import { Gtk, Widget } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import { App } from "astal/gtk4";
import GdkPixbuf from "gi://GdkPixbuf";
import GLib from "gi://GLib?version=2.0";
import { launcherLogger as log } from "../../../utils/logger";
import { c } from "../../../utils/style";
import clipboardManager, { ClipboardEntry } from "../../../services/clipboard-manager";
import { RoundedImageReactive } from "../../utils/rounded-image";

export { ClipboardEntry };

export interface ClipboardButtonProps extends Widget.ButtonProps {
  entry: ClipboardEntry;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

export default function ClipboardButton(props: ClipboardButtonProps) {
  log.debug("ClipboardButton props", {
    hasEntry: !!props?.entry,
    hasSelected: props?.selected !== undefined,
    selectedType: typeof props?.selected,
    index: props?.index
  });

  if (!props) {
    log.error("ClipboardButton: props is undefined");
    return <box />;
  }

  const { entry, index, ref: buttonRef, ...rest } = props;

  if (!entry) {
    log.error("ClipboardButton: entry is undefined");
    return <box />;
  }

  const handleActivate = async () => {
    log.debug("Pasting clipboard entry", { type: entry.type, preview: entry.preview });

    // Close launcher first
    const windows = App.get_windows();
    windows.forEach(win => {
      if (win.name?.startsWith('launcher')) {
        win.hide();
      }
    });

    // Copy to clipboard using clipboard manager
    try {
      await clipboardManager.copyToClipboard(entry);
      log.debug("Clipboard entry pasted");
    } catch (error) {
      log.error("Failed to paste clipboard entry", error);
    }
  };

  const getIcon = () => {
    switch (entry.type) {
      case 'image':
        return 'image-x-generic-symbolic';
      case 'file':
        return 'folder-documents-symbolic';
      default:
        return 'edit-paste-symbolic';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getImageDimensions = (imagePath: string): string => {
    try {
      const pixbuf = GdkPixbuf.Pixbuf.new_from_file(imagePath);
      if (pixbuf) {
        const width = pixbuf.get_width();
        const height = pixbuf.get_height();
        return `${width}×${height}`;
      }
    } catch (error) {
      log.debug("Failed to get image dimensions", { imagePath, error });
    }
    return "Image";
  };

  const createSquareThumbnail = (imagePath: string, size: number = 80): GdkPixbuf.Pixbuf | null => {
    try {
      const originalPixbuf = GdkPixbuf.Pixbuf.new_from_file(imagePath);
      if (!originalPixbuf) return null;

      const width = originalPixbuf.get_width();
      const height = originalPixbuf.get_height();

      // Calculate crop dimensions to create a square from the center
      const minDimension = Math.min(width, height);
      const xOffset = Math.floor((width - minDimension) / 2);
      const yOffset = Math.floor((height - minDimension) / 2);

      // Create a square crop from the center
      const croppedPixbuf = originalPixbuf.new_subpixbuf(xOffset, yOffset, minDimension, minDimension);

      // Scale to desired size
      const scaledPixbuf = croppedPixbuf.scale_simple(size, size, GdkPixbuf.InterpType.BILINEAR);

      return scaledPixbuf;
    } catch (error) {
      log.debug("Failed to create square thumbnail", { imagePath, error });
      return null;
    }
  };

  const getImageInfo = (entry: ClipboardEntry): { dimensions: string; format: string; size?: string } => {
    // If we have preview info from cliphist, extract it
    if (entry.preview && entry.preview.includes('(')) {
      const match = entry.preview.match(/\(([^)]+)\)\s*([^\s]+)?\s*•?\s*(\d+×\d+)?/);
      if (match) {
        const [, format, size, dimensions] = match;
        return {
          format: format || 'Image',
          size: size,
          dimensions: dimensions || (entry.imagePath ? getImageDimensions(entry.imagePath) : 'Unknown')
        };
      }
    }

    // Fallback to getting dimensions from file
    return {
      format: 'Image',
      dimensions: entry.imagePath ? getImageDimensions(entry.imagePath) : 'Unknown',
      size: undefined
    };
  };

  const selected = props.selected || Variable(false);
  const isImage = entry.type === 'image' && entry.imagePath;
  const imageInfo = isImage ? getImageInfo(entry) : null;

  // Store thumbnail path in a variable to handle async loading
  const thumbnailPath = Variable<string | null>(null);

  // Create or load thumbnail asynchronously
  if (isImage && entry.imagePath) {
    // Generate thumbnail file path
    const targetPath = entry.thumbnailPath ||
      GLib.build_filenamev([
        GLib.get_user_cache_dir(),
        "ags",
        "clipboard-thumbnails",
        `${entry.id?.replace(/[^a-zA-Z0-9]/g, '_')}_76.png`
      ]);

    // Use timeout to avoid blocking UI
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 0, () => {
      try {
        // Check if thumbnail already exists
        if (GLib.file_test(targetPath, GLib.FileTest.EXISTS)) {
          thumbnailPath.set(targetPath);
          return false;
        }

        // Create new thumbnail
        const pixbuf = createSquareThumbnail(entry.imagePath!, 76);
        if (pixbuf) {
          // Save thumbnail to file
          try {
            pixbuf.savev(targetPath, "png", [], []);
            thumbnailPath.set(targetPath);
          } catch (e) {
            log.error("Failed to save thumbnail", { error: e, targetPath });
            // Fallback to original image
            thumbnailPath.set(entry.imagePath || "");
          }
        } else {
          // Fallback to original image if thumbnail creation fails
          thumbnailPath.set(entry.imagePath || "");
        }
      } catch (error) {
        log.error("Failed to create thumbnail", { error });
        // Fallback to original image
        thumbnailPath.set(entry.imagePath || "");
      }
      return false; // Don't repeat
    });
  }

  return (
    <button
      cssName="overview-search-result-btn"
      cssClasses={bind(selected).as(s =>
        c`clipboard-entry ${isImage ? 'image-entry' : ''} ${s ? 'selected' : ''} ${props.cssName || ''}`
      )}
      onClicked={handleActivate}
      focusable={false}
      widthRequest={250}
      hexpand={true}
      setup={(self: Gtk.Button) => {
        if (buttonRef) {
          buttonRef(self);
        }
      }}
      {...rest}
    >
      <box spacing={16} valign={Gtk.Align.CENTER} widthRequest={245}>
        {isImage ? (
          <box vertical cssClasses={["clipboard-image-container"]} spacing={0}>
            <box cssClasses={["clipboard-image-frame"]}>
              <RoundedImageReactive
                file={bind(thumbnailPath)}
                size={76}
                radius={12}
                cssClasses={["clipboard-image-preview"]}
              />
            </box>
            <box
              cssClasses={["clipboard-image-badge-container"]}
              halign={Gtk.Align.CENTER}
              valign={Gtk.Align.END}
            >
              <label
                label={imageInfo?.format?.toUpperCase() || "IMG"}
                cssClasses={["clipboard-format-badge"]}
              />
            </box>
          </box>
        ) : (
          <box cssClasses={["launcher-result-icon-container"]}>
            <image
              iconName={getIcon()}
              cssClasses={["launcher-result-icon"]}
            />
          </box>
        )}
        <box vertical valign={Gtk.Align.CENTER} hexpand>
          <box spacing={8}>
            <label
              label={entry.type === 'image' ? 'Clipboard Image' : (entry.preview || entry.content)}
              cssName="overview-search-results-txt"
              cssClasses={["clipboard-content-text"]}
              halign={Gtk.Align.START}
              ellipsize={3} // PANGO_ELLIPSIZE_END
            />
          </box>
          <box spacing={8} cssClasses={["clipboard-metadata"]}>
            <label
              label={formatTimestamp(entry.timestamp)}
              cssClasses={["overview-search-results-txt", "txt-smallie", "txt-subtext"]}
              halign={Gtk.Align.START}
            />
            {isImage && imageInfo ? (
              <>
                <label
                  label="•"
                  cssClasses={["overview-search-results-txt", "txt-smallie", "txt-subtext", "separator"]}
                />
                <label
                  label={imageInfo.dimensions}
                  cssClasses={["overview-search-results-txt", "txt-smallie", "txt-subtext", "image-dimensions"]}
                />
                {imageInfo.size ? (
                  <>
                    <label
                      label="•"
                      cssClasses={["overview-search-results-txt", "txt-smallie", "txt-subtext", "separator"]}
                    />
                    <label
                      label={imageInfo.size}
                      cssClasses={["overview-search-results-txt", "txt-smallie", "txt-subtext", "image-size"]}
                    />
                  </>
                ) : null}
              </>
            ) : null}
          </box>
        </box>
      </box>
    </button>
  );
}
