import { bind, Variable } from "astal";
import { Gtk, Gdk } from "astal/gtk4";
import Gio from "gi://Gio";
import signalStickersService from "../../../services/signal-stickers-service";
import { launcherLogger as log } from "../../../utils/logger";
import { setupCursorHover } from "../../utils/buttons";

const stickerLog = log.subClass("StickerResults");

export const StickerPackBar = ({ setupLastFocused: setupProps, selectedPackId, packFilter, hasActiveQuery, selectedPackIndex, onPackSelected, entryRef, selectedIndex, focusedZone }: {
  selectedPackId: Variable<string | null>,
  packFilter: Variable<string | null>,
  hasActiveQuery: boolean,
  selectedPackIndex: Variable<number>,
  onPackSelected: (index: number) => void,
  entryRef?: Gtk.Entry,
  selectedIndex?: Variable<number>,
  focusedZone: Variable<string>
  setupLastFocused?: (self: Gtk.Button) => void;
}) => {
  const stickerPacks = signalStickersService.stickerPacks;
  const loadedStickers = signalStickersService.loadedStickers;
  const packButtonRefs = new Map<number, Gtk.Button>();

  stickerLog.debug("StickerPackBar created", { selectedPackId, packFilter, hasActiveQuery, selectedPackIndex, onPackSelected, entryRef, selectedIndex, focusedZone });

  return (
    <box
      cssClasses={["sticker-pack-bar-wrapper"]}
      setup={(self) => {
        log.debug("Setting up StickerPackBar");
        // Add keyboard event controller
        const keyController = new Gtk.EventControllerKey();

        keyController.connect('key-pressed', (_controller, keyval, _keycode, state) => {
          const ctrlPressed = (state & Gdk.ModifierType.CONTROL_MASK) !== 0;

          // if (!ctrlPressed) return false;


          const currentIdx = selectedPackIndex.get();
          const packCount = signalStickersService.stickerPacks.get().length;

          selectedIndex?.set(-1);

          switch (keyval) {
            case Gdk.KEY_h:
            case Gdk.KEY_Left:
              // Move left in pack bar
              if (currentIdx > 0) {
                selectedPackIndex.set(currentIdx - 1);
                onPackSelected(currentIdx - 1);
              }
              return true;

            case Gdk.KEY_l:
            case Gdk.KEY_Right:
              // Move right in pack bar
              if (currentIdx < packCount - 1) {
                selectedPackIndex.set(currentIdx + 1);
                onPackSelected(currentIdx + 1);
              }
              return true;

            case Gdk.KEY_j:

              // Jump down to results
              if (selectedIndex) {
                if (selectedIndex.get() > 0) {
                  selectedIndex.set(-1);
                }


                if (focusedZone) {
                  focusedZone.set("results");
                }
              }
              return true;

            case Gdk.KEY_k:
              // Jump up to entry
              if (entryRef) {
                if (ctrlPressed) {
                  entryRef.grab_focus();
                  entryRef.set_position(-1);
                  focusedZone.set("entry");
                }
              }
              return true;
            case Gdk.KEY_Return:
            case Gdk.KEY_KP_Enter:
              setTimeout(() => {
                selectedIndex?.set(0);
                focusedZone.set("results");
              }, 200);
              break;
          }

          return false;
        });

        self.add_controller(keyController);
      }}
    >
      <Gtk.ScrolledWindow
        cssClasses={["sticker-pack-bar-container"]}
        hscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
        vscrollbarPolicy={Gtk.PolicyType.NEVER}
      >
        <box cssClasses={["sticker-pack-bar"]} spacing={8}>
          {bind(Variable.derive([stickerPacks, loadedStickers], (packs, stickersMap) =>
            packs.map((pack, index) => {
              // Get the first sticker for this pack
              const packStickers = stickersMap.get(pack.meta.id) || [];
              const firstSticker = packStickers[0];
              const coverEmoji = pack.manifest?.cover?.emoji || pack.manifest?.stickers?.[0]?.emoji || "📦";

              return (
                <button
                  cssClasses={bind(Variable.derive([selectedPackId, packFilter, selectedPackIndex], (selectedId, filterId, selectedIdx) => {
                    const classes = ["sticker-pack-button"];
                    if (hasActiveQuery && filterId === pack.meta.id) {
                      classes.push("filtered");
                    } else if (!hasActiveQuery && selectedId === pack.meta.id) {
                      classes.push("selected");
                    }
                    if (selectedIdx === index) {
                      classes.push("focused");
                    }
                    return classes;
                  }))}
                  onClicked={() => {
                    if (hasActiveQuery) {
                      // When there's an active query, toggle pack filter
                      const currentFilter = packFilter.get();
                      if (currentFilter === pack.meta.id) {
                        packFilter.set(null); // Clear filter if clicking same pack
                      } else {
                        packFilter.set(pack.meta.id); // Set new filter
                      }
                    } else {
                      // Normal behavior when no query
                      signalStickersService.selectPack(pack.meta.id);
                      // Load pack details if not already loaded
                      if (pack.meta.key) {
                        signalStickersService.loadStickerPackDetails(pack.meta.id, pack.meta.key);
                      }
                    }
                  }}
                  onFocusLeave={(self) => {
                    setupProps?.(self);
                  }}
                  onKeyPressed={(_self, keyval, _keycode, state) => {
                    const ctrlPressed = (state & Gdk.ModifierType.CONTROL_MASK) !== 0;
                    if (!ctrlPressed) return false;

                    switch (keyval) {
                      case Gdk.KEY_j:
                        // Jump down to results
                        selectedIndex?.set(-1);
                        selectedIndex?.set(0);
                        focusedZone.set("results");
                        return true;

                      case Gdk.KEY_k:
                        // Jump up to entry
                        if (entryRef) {
                          entryRef.grab_focus();
                          entryRef.set_position(-1)
                          focusedZone.set("entry");
                          selectedPackIndex.set(-1);
                        }
                        return true;
                      case Gdk.KEY_Return:
                      case Gdk.KEY_KP_Enter:
                        // Activate pack when Enter is pressed
                        signalStickersService.selectPack(pack.meta.id);
                        setTimeout(() => {
                          selectedIndex?.set(0);
                          focusedZone.set("results");
                        }, 200);
                        break;
                    }
                  }}
                  tooltipText={pack.manifest?.title || pack.meta.id}
                  setup={(self) => {
                    setupCursorHover(self)
                    packButtonRefs.set(index, self);

                    // Subscribe to pack index changes
                    selectedPackIndex.subscribe((idx) => {
                      if (idx === index) {
                        self.grab_focus();
                      }
                    });
                  }}
                >
                  <box cssClasses={["pack-icon-container"]}>
                    {(() => {
                      // Use Gtk.Fixed to layer the image and emoji
                      const fixed = new Gtk.Fixed();
                      fixed.set_size_request(40, 40);

                      // Add sticker image if available
                      if (firstSticker?.imagePath) {
                        const imageFile = Gio.File.new_for_path(firstSticker.imagePath);
                        if (imageFile.query_exists(null)) {
                          fixed.put(<image
                            cssClasses={["pack-sticker-bg"]}
                            file={firstSticker.imagePath}
                            widthRequest={30}
                            heightRequest={30}
                          />, 5, 5);
                        }
                      }

                      // Add emoji on top
                      fixed.put(<label
                        cssClasses={["pack-emoji-overlay"]}
                        label={coverEmoji}
                      />, 0, 0);

                      return fixed;
                    })()}
                  </box>
                </button>
              );
            })
          ))}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  );
};

export default StickerPackBar;
