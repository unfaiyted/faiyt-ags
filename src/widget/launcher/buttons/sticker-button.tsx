import { bind, Variable, Binding } from "astal";
import { Gtk, Gdk } from "astal/gtk4";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import { StickerData } from "../../../services/signal-stickers-service";
import { launcherLogger as log } from "../../../utils/logger";
import { truncateText } from "../../../utils";
import { setupCursorHover } from "../../utils/buttons";

const stickerLog = log.subClass("StickerResults");


interface StickerButtonProps {
  sticker: StickerData;
  index: number;
  stickers: Variable<StickerData[]>;
  selectedIndex: Variable<number>;
  scrolledWindow: Gtk.ScrolledWindow | null;
  entryRef?: Gtk.Entry;
  focusedZone: Variable<string>;
  barRef?: Binding<Gtk.Button | null>;
  onActivate: () => void;
}

const ITEMS_PER_ROW = 6;
const ROW_HEIGHT = 125; // Approximate height of each sticker row
const IMAGE_CACHE = new Map<string, boolean>(); // Cache file existence checks

export const StickerButton = ({ sticker, index, selectedIndex, focusedZone, scrolledWindow, stickers, barRef, entryRef, onActivate }: StickerButtonProps) => {
  const isVisible = Variable(false);
  const imageExists = Variable<boolean | null>(null);

  // Check if image exists (with caching)
  const checkImageExists = () => {
    const cached = IMAGE_CACHE.get(sticker.imagePath);
    if (cached !== undefined) {
      imageExists.set(cached);
      return;
    }

    // Batch async checks for better performance
    requestIdleCallback(() => {
      try {
        const imageFile = Gio.File.new_for_path(sticker.imagePath);
        const exists = imageFile.query_exists(null);
        IMAGE_CACHE.set(sticker.imagePath, exists);
        imageExists.set(exists);
      } catch (error) {
        stickerLog.error("Failed to check image existence", { path: sticker.imagePath, error });
        IMAGE_CACHE.set(sticker.imagePath, false);
        imageExists.set(false);
      }
    });
  };

  // Fallback for environments without requestIdleCallback
  const requestIdleCallback = (callback: () => void) => {
    if (typeof globalThis.requestIdleCallback === 'function') {
      globalThis.requestIdleCallback(callback);
    } else {
      setTimeout(callback, 0);
    }
  };

  return (
    <button
      cssClasses={bind(selectedIndex).as(
        (si) => si === index ? ["sticker-button", "selected"] : ["sticker-button"]
      )}
      setup={(self) => {
        setupCursorHover(self);
        // Defer visibility check to avoid early allocation issues
        let checkVisibilityTimeout: GLib.Source | null = null;

        const checkVisibility = () => {
          if (!isVisible.get()) {
            const allocation = self.get_allocation();

            // Check if widget has valid allocation
            if (allocation && allocation.width > 0 && allocation.height > 0) {
              isVisible.set(true);
              checkImageExists();
            }
          }
        };

        // Check visibility when widget is mapped (visible on screen)
        self.connect('map', () => {
          // Defer check to next idle to ensure proper allocation
          if (checkVisibilityTimeout) {
            clearTimeout(checkVisibilityTimeout);
          }
          checkVisibilityTimeout = setTimeout(() => {
            checkVisibility();
          }, 10);
        });

        selectedIndex.subscribe((s) => {
          if (s === index) {
            self.grab_focus();
          }
        });
      }}
      onClicked={() => {
        selectedIndex.set(index);
        return onActivate()
      }}
      onKeyPressed={(_self, keyval, _keycode, state) => {
        if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_KP_Enter) {
          onActivate();
        }

        const ctrlPressed = (state & Gdk.ModifierType.CONTROL_MASK) !== 0;

        if (ctrlPressed) {
          switch (keyval) {
            case Gdk.KEY_k:
              // Jump up to entry
              if (barRef) {
                log.debug("Focusing pack bar");
                focusedZone.set("packbar");
                const bar = barRef.get();
                if (bar) {
                  bar.grab_focus();
                }
              } else {
                entryRef?.grab_focus();
              }

              return true;
          }
        }


        switch (keyval) {
          case Gdk.KEY_Left, Gdk.KEY_h:

            if (selectedIndex.get() > 0) {
              selectedIndex.set(selectedIndex.get() - 1);
            }
            break;
          case Gdk.KEY_Right, Gdk.KEY_l:
            if (selectedIndex.get() < stickers.get().length - 1) {
              selectedIndex.set(selectedIndex.get() + 1);
            }
            break;
          case Gdk.KEY_Up, Gdk.KEY_k:
            if (selectedIndex.get() > 0) {
              const newIndex = selectedIndex.get() - ITEMS_PER_ROW;
              const currentRow = Math.floor(selectedIndex.get() / ITEMS_PER_ROW);
              if (newIndex >= 0) {
                selectedIndex.set(newIndex);
                if (scrolledWindow) {

                  scrolledWindow.get_vadjustment()?.set_value((currentRow - 1) * ROW_HEIGHT);
                }
              }
              // if (newIndex <= 0) {
              //   selectedIndex.set(-1);
              //   if (barRef) {
              //     log.debug("Focusing pack bar");
              //     focusedZone.set("packbar");
              //     const bar = barRef.get();
              //     if (bar) {
              //       bar.grab_focus();
              //     }
              //   } else {
              //     entryRef?.grab_focus();
              //   }
              // }
            } else {
              // if (barRef) {
              //
              //   selectedIndex.set(-1);
              //   log.debug("Focusing pack bar");
              //   focusedZone.set("packbar");
              //   const bar = barRef.get();
              //   if (bar) {
              //     bar.grab_focus();
              //   }
              // } else {
              //   entryRef?.grab_focus();
              // }
            }
            break;
          case Gdk.KEY_Down, Gdk.KEY_j:

            if (selectedIndex.get() < stickers.get().length - 1) {
              selectedIndex.set(selectedIndex.get() + ITEMS_PER_ROW);
              const currentRow = Math.floor(selectedIndex.get() / ITEMS_PER_ROW);
              if (scrolledWindow) {
                scrolledWindow.get_vadjustment()?.set_value((currentRow - 1) * ROW_HEIGHT);
              }
            }
            break;
        }
      }}
    >
      <box cssClasses={["sticker-content"]} vertical>
        <box cssClasses={["sticker-image-container"]}>
          {bind(Variable.derive([isVisible, imageExists], (visible, exists) => {
            if (!visible) {
              // Show placeholder while not visible
              return (
                <label
                  cssClasses={["sticker-placeholder"]}
                  label={sticker.emoji}
                />
              );
            }

            if (exists === null) {
              // Still checking
              return (
                <label
                  cssClasses={["sticker-placeholder", "loading"]}
                  label={sticker.emoji}
                />
              );
            }

            if (exists) {
              // Image exists, show it
              const fixed = new Gtk.Fixed();
              fixed.set_size_request(65, 65);

              fixed.put(<image
                cssClasses={["sticker-image"]}
                file={sticker.imagePath}
                widthRequest={60}
                heightRequest={60}
              />, 15, 10);

              fixed.put(<label
                cssClasses={["sticker-placeholder"]}
                label={sticker.emoji}
              />, 5, 0);

              return fixed;
            } else {
              // Image doesn't exist, show emoji
              return (
                <label
                  cssClasses={["sticker-placeholder"]}
                  label={sticker.emoji}
                />
              );
            }
          }))}
        </box>
        <label
          cssClasses={["sticker-pack-name"]}
          label={truncateText(sticker.packTitle, 15)}
          marginTop={7}
          maxWidthChars={15}
        />
      </box>
    </button>
  );
};


export default StickerButton;
