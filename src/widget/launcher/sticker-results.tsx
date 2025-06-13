import { bind, Variable, Binding } from "astal";
import { Gtk, Gdk, App } from "astal/gtk4";
import Gio from "gi://Gio";
import signalStickersService, { StickerData } from "../../services/signal-stickers-service";
import configManager from "../../services/config-manager";
import { launcherLogger as log } from "../../utils/logger";
import { truncateText } from "../../utils";

const stickerLog = log.subClass("StickerResults");

interface StickerResultsProps {
  query: string;
  selectedIndex: Variable<number>;
  resultsCount: Variable<number>;
  onPackBarFocus?: () => void;
  entryRef?: Gtk.Entry;
}

interface StickerButtonProps {
  sticker: StickerData;
  index: number;
  stickers: Variable<StickerData[]>;
  selectedIndex: Variable<number>;
  entryRef?: Gtk.Entry;
  focusedZone: Variable<string>;
  barRef?: Binding<Gtk.Button>;
  onActivate: () => void;
}

const ITEMS_PER_ROW = 5;

const StickerButton = ({ sticker, index, selectedIndex, focusedZone, stickers, barRef, entryRef, onActivate }: StickerButtonProps) => {
  return (
    <button
      cssClasses={bind(selectedIndex).as(
        (si) => si === index ? ["sticker-button", "selected"] : ["sticker-button"]
      )}
      setup={(self) => {
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
      onKeyPressed={(_self, keyval, _keycode, _state) => {
        if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_KP_Enter) {
          onActivate();
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
              if (newIndex >= 0) {
                selectedIndex.set(newIndex);
              }
              if (newIndex <= 0) {
                selectedIndex.set(-1);
                if (barRef) {
                  log.debug("Focusing pack bar");
                  focusedZone.set("packbar");
                  barRef.get().grab_focus();
                } else {
                  entryRef?.grab_focus();
                }
              }
            } else {
              if (barRef) {

                selectedIndex.set(-1);
                log.debug("Focusing pack bar");
                focusedZone.set("packbar");
                barRef.get().grab_focus();
              } else {
                entryRef?.grab_focus();
              }
            }
            break;
          case Gdk.KEY_Down, Gdk.KEY_j:
            if (selectedIndex.get() < stickers.get().length - 1) {
              selectedIndex.set(selectedIndex.get() + ITEMS_PER_ROW);
            }
            break;
        }
      }}
    >
      <box cssClasses={["sticker-content"]} vertical>
        <box cssClasses={["sticker-image-container"]}>
          {(() => {
            // Check if we have an actual image file
            const imageFile = Gio.File.new_for_path(sticker.imagePath);
            if (imageFile.query_exists(null)) {
              // If image exists, show it using Gtk.Picture with filename
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
              // Otherwise show emoji placeholder
              return (
                <label
                  cssClasses={["sticker-placeholder"]}
                  label={sticker.emoji}
                />
              );
            }
          })()}
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

const StickerPackBar = ({ setupLastFocused: setupProps, selectedPackId, packFilter, hasActiveQuery, selectedPackIndex, onPackSelected, entryRef, selectedIndex, focusedZone }: {
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
                selectedIndex.set(0);
                if (focusedZone) {
                  focusedZone.set("results");
                }
              }
              return true;

            case Gdk.KEY_k:
              // Jump up to entry
              if (entryRef) {
                entryRef.grab_focus();
                if (focusedZone) {
                  focusedZone.set("entry");
                }
                selectedPackIndex.set(-1);
              }
              return true;
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
                  onKeyPressed={(_self, keyval, _keycode, _state) => {
                    switch (keyval) {
                      case Gdk.KEY_j:
                        // Jump down to results
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
                        break;
                    }
                  }}
                  tooltipText={pack.manifest?.title || pack.meta.id}
                  setup={(self) => {
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

// Deprecated - use StickerResults component instead
export const getStickerResults = async (
  query: string,
  selectedIndex: Variable<number>
): Promise<any> => {
  return <StickerResults query={query} selectedIndex={selectedIndex} resultsCount={Variable(0)} />;
};

export const StickerResults = ({ query, selectedIndex, resultsCount, onPackBarFocus, entryRef }: StickerResultsProps) => {
  stickerLog.debug("StickerResults component created", { query });

  // State for UI feedback
  const addStatus = Variable<"idle" | "loading" | "success" | "exists" | "error" | "preview">("idle");
  const statusMessage = Variable<string>("");
  const previewData = Variable<{
    id: string;
    key: string;
    manifest: import("../../services/signal-stickers-service").StickerPackManifest;
    exists: boolean;
  } | null>(null);

  // State for pack filtering when query is active
  const packFilter = Variable<string | null>(null);

  // State for pack bar navigation
  const selectedPackIndex = Variable<number>(-1);
  const focusedZone = Variable<"entry" | "packbar" | "results">("entry");

  // Get entry ref from parent launcher or use provided one
  const getEntryRef = () => {
    if (entryRef) return entryRef;

    const windows = App.get_windows();
    for (const win of windows) {
      if (win.name?.startsWith('launcher')) {
        // Find the entry widget in the launcher window
        const entry = win.get_child()?.get_first_child()?.get_first_child()?.get_last_child()?.get_first_child()?.get_first_child()?.get_first_child()?.get_first_child() as Gtk.Entry | undefined;
        if (entry && entry instanceof Gtk.Entry) {
          return entry;
        }
      }
    }
    return null;
  };

  // Set initial focus zone based on what has focus
  setTimeout(() => {
    focusedZone.set("entry");
  }, 100);

  // Reset pack filter when query changes
  let previousQuery = query;
  if (query !== previousQuery) {
    packFilter.set(null);
    previousQuery = query;
  }

  // State for lazy loading
  const loadedRows = Variable<number>(3); // Start with 3 rows loaded
  const isLoadingMore = Variable<boolean>(false);

  // Check if this is an add command
  if (query.startsWith("add ")) {
    const url = query.substring(4).trim();
    log.debug("Sticker add command detected", { url });

    // Auto-preview the pack when URL is entered
    if (url && addStatus.get() === "idle") {
      addStatus.set("loading");
      statusMessage.set("Loading sticker pack preview...");
      
      signalStickersService.previewStickerPackFromUrl(url).then(preview => {
        if (preview) {
          previewData.set(preview);
          addStatus.set("preview");
          if (preview.exists) {
            statusMessage.set("This pack is already in your collection");
          } else {
            statusMessage.set("");
          }
        } else {
          addStatus.set("error");
          statusMessage.set("Failed to load sticker pack. Check the URL and try again.");
        }
      }).catch(error => {
        log.error("Failed to preview sticker pack", { error });
        addStatus.set("error");
        statusMessage.set("An error occurred while loading the preview");
      });
    }

    // Show UI for adding sticker pack
    return (
      <box cssClasses={["sticker-add-container"]} vexpand vertical spacing={12} margin={20}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >

        <label cssClasses={["sticker-add-title"]} label="Add Sticker Pack" />
        <label cssClasses={["sticker-add-url"]} label={truncateText(url, 100)} wrap />

        {/* Preview Section */}
        {bind(Variable.derive([addStatus, previewData], (status, preview) => {
          if (status === "preview" && preview) {
            return (
              <box cssClasses={["sticker-preview-section"]} vertical spacing={16}>
                <box cssClasses={["sticker-preview-header"]} spacing={12}>
                  <box cssClasses={["sticker-preview-info"]} vertical spacing={8}>
                    <label cssClasses={["sticker-preview-title"]} label={preview.manifest.title} />
                    <label cssClasses={["sticker-preview-author"]} label={`by ${preview.manifest.author}`} />
                    <label cssClasses={["sticker-preview-count"]} label={`${preview.manifest.stickers.length} stickers`} />
                  </box>
                </box>
                
                {/* Sticker Grid Preview */}
                <box cssClasses={["sticker-preview-grid"]} spacing={8}>
                  {preview.manifest.stickers.slice(0, 8).map(sticker => (
                    <box cssClasses={["sticker-preview-item"]}>
                      <label cssClasses={["sticker-preview-emoji"]} label={sticker.emoji} />
                    </box>
                  ))}
                  {preview.manifest.stickers.length > 8 && (
                    <box cssClasses={["sticker-preview-more"]}>
                      <label label={`+${preview.manifest.stickers.length - 8}`} />
                    </box>
                  )}
                </box>
              </box>
            );
          }
          return <box />;
        }))}

        {bind(addStatus).as(status => (status !== "idle" && status !== "preview") && (
          <label
            cssClasses={["sticker-add-status", `status-${status}`]}
            label={bind(statusMessage)}
          />
        ) || <box />)}

        <button
          cssClasses={["sticker-add-button"]}
          sensitive={bind(Variable.derive([addStatus, previewData], (status, preview) => 
            status === "preview" && preview && !preview.exists
          ))}
          visible={bind(addStatus).as(s => s === "preview")}
          onClicked={async () => {
            const preview = previewData.get();
            if (!preview) return;
            
            log.info("Adding sticker pack", { url, packId: preview.id });
            addStatus.set("loading");
            statusMessage.set("Adding sticker pack...");

            try {
              // Add the sticker pack
              const packInfo = await signalStickersService.addStickerPackFromUrl(url);

              if (packInfo) {
                // Get current sticker packs from config
                const currentPacks = configManager.getValue("search.stickers.packs") || [];

                // Check if pack already exists
                const exists = currentPacks.some((pack: any) => pack.id === packInfo.id);

                if (!exists) {
                  // Add to config
                  const updatedPacks = [...currentPacks, packInfo];
                  configManager.setValue("search.stickers.packs", updatedPacks);

                  log.info("Sticker pack added to config", { packInfo });

                  // Reload sticker packs
                  await signalStickersService.loadStickerPacks(updatedPacks);
                  
                  // Force load the new pack details immediately
                  await signalStickersService.loadStickerPackDetails(packInfo.id, packInfo.key);

                  addStatus.set("success");
                  statusMessage.set(`Successfully added "${packInfo.name}"!`);

                  // Auto-close after a delay
                  setTimeout(() => {
                    // Close launcher - would need to pass a reference
                    const windows = App.get_windows();
                    windows.forEach(win => {
                      if (win.name?.startsWith('launcher')) {
                        win.hide();
                      }
                    });
                  }, 1500);
                } else {
                  log.warn("Sticker pack already exists", { packId: packInfo.id });
                  addStatus.set("exists");
                  statusMessage.set(`Pack "${packInfo.name}" is already in your collection`);
                }
              } else {
                addStatus.set("error");
                statusMessage.set("Failed to load sticker pack. Check the URL and try again.");
              }
            } catch (error) {
              log.error("Failed to add sticker pack", { error });
              addStatus.set("error");
              statusMessage.set("An error occurred while adding the pack");
            }
          }}
        >
          <label label={bind(addStatus).as(s => s === "loading" ? "Adding..." : "Add Pack")} />
        </button>
        
        {/* Show different button when preview not loaded or pack exists */}
        {bind(Variable.derive([addStatus, previewData], (status, preview) => {
          if (status === "idle" || status === "loading") {
            return (
              <button
                cssClasses={["sticker-add-button", "loading"]}
                sensitive={false}
              >
                <label label="Loading preview..." />
              </button>
            );
          } else if (status === "preview" && preview?.exists) {
            return (
              <button
                cssClasses={["sticker-add-button", "exists"]}
                sensitive={false}
              >
                <label label="Already in collection" />
              </button>
            );
          } else if (status === "error") {
            return (
              <button
                cssClasses={["sticker-add-button"]}
                onClicked={() => {
                  // Reset and retry
                  addStatus.set("idle");
                  previewData.set(null);
                  statusMessage.set("");
                }}
              >
                <label label="Retry" />
              </button>
            );
          }
          return <box />;
        }))}
      </box>
    );
  }

  // Load sticker packs on first render
  const config = configManager.config;
  if (config.search.stickers?.packs?.length > 0) {
    // Always load packs to ensure we have the latest
    signalStickersService.loadStickerPacks(config.search.stickers.packs).then(() => {
      // After loading packs, load details for each pack
      const packs = signalStickersService.stickerPacks.get();
      log.debug("Loaded packs, now loading details", { packCount: packs.length });

      packs.forEach(pack => {
        if (pack.meta.key) {
          log.debug("Loading details for pack", { packId: pack.meta.id, key: pack.meta.key });
          signalStickersService.loadStickerPackDetails(pack.meta.id, pack.meta.key).then(() => {
            log.debug("Successfully loaded pack details", { packId: pack.meta.id });
          }).catch(err => {
            log.error("Failed to load sticker pack details", {
              packId: pack.meta.id,
              error: err instanceof Error ? err.message : String(err)
            });
          });
        } else {
          log.warn("Pack missing key", { packId: pack.meta.id });
        }
      });
    }).catch(err => {
      log.error("Failed to load sticker packs", {
        error: err instanceof Error ? err.message : String(err)
      });
    });
  } else {
    log.warn("No sticker packs configured");
  }

  const handleCopySticker = async (sticker: StickerData) => {
    log.info("Copying sticker to clipboard", { sticker });

    try {
      // Check if sticker image exists
      const imageFile = Gio.File.new_for_path(sticker.imagePath);
      if (!imageFile.query_exists(null)) {
        log.error("Sticker image file not found", { path: sticker.imagePath });
        return;
      }

      // Use wl-copy to copy the image to clipboard
      const { execAsync } = await import("astal/process");

      // Most applications expect PNG format for clipboard images
      // If it's a WebP, we should convert it to PNG for better compatibility
      let copyCommand: string;

      if (sticker.format === 'webp') {
        // Convert WebP to PNG on the fly using ImageMagick or similar
        // First try with ImageMagick's convert
        try {
          copyCommand = `convert "${sticker.imagePath}" png:- | wl-copy -t image/png`;
          await execAsync(["sh", "-c", copyCommand]);
          log.info("Sticker copied to clipboard using convert (WebP to PNG)");
        } catch (convertError) {
          // If convert fails, try ffmpeg as fallback
          try {
            copyCommand = `ffmpeg -i "${sticker.imagePath}" -f image2pipe -vcodec png - | wl-copy -t image/png`;
            await execAsync(["sh", "-c", copyCommand]);
            log.info("Sticker copied to clipboard using ffmpeg (WebP to PNG)");
          } catch (ffmpegError) {
            // If both fail, try copying as WebP directly
            log.warn("Failed to convert WebP, trying direct copy", { convertError, ffmpegError });
            copyCommand = `cat "${sticker.imagePath}" | wl-copy -t image/webp`;
            await execAsync(["sh", "-c", copyCommand]);
            log.info("Sticker copied to clipboard as WebP");
          }
        }
      } else {
        // For PNG/APNG, copy directly
        copyCommand = `cat "${sticker.imagePath}" | wl-copy -t image/png`;
        await execAsync(["sh", "-c", copyCommand]);
        log.info("Sticker copied to clipboard as PNG");
      }

      // Close launcher after copying
      const windows = App.get_windows();
      windows.forEach(win => {
        if (win.name?.startsWith('launcher')) {
          win.hide();
        }
      });
    } catch (error) {
      log.error("Failed to copy sticker to clipboard", {
        error: error instanceof Error ? error.message : String(error),
        path: sticker.imagePath
      });
    }
  };

  const stickerButtonRefs = Variable<Gtk.Widget[]>([]);

  // Function to load more rows when needed
  const loadMoreRowsIfNeeded = (currentIndex: number) => {
    const currentRow = Math.floor(currentIndex / ITEMS_PER_ROW) + 1;
    const currentLoadedRows = loadedRows.get();

    // If user is on the last loaded row, load 3 more
    if (currentRow >= currentLoadedRows - 2 && !isLoadingMore.get()) {
      // Get total available rows
      let stickers: StickerData[] = [];
      if (query) {
        // Search with query
        let searchResults = signalStickersService.searchStickers(query);

        // Apply pack filter if set
        const filter = packFilter.get();
        if (filter) {
          searchResults = searchResults.filter(s => s.packId === filter);
        }

        stickers = searchResults;
      } else if (signalStickersService.selectedPackId.get()) {
        stickers = signalStickersService.getPackStickers(signalStickersService.selectedPackId.get()!);
      } else {
        stickers = signalStickersService.getAllStickers();
      }

      const totalRows = Math.ceil(stickers.length / ITEMS_PER_ROW);

      if (currentLoadedRows < totalRows) {
        isLoadingMore.set(true);
        // Use timeout to prevent UI freeze
        setTimeout(() => {
          loadedRows.set(Math.min(currentLoadedRows + 3, totalRows));
          isLoadingMore.set(false);
        }, 50);
      }
    }
  };

  // Subscribe to selectedIndex changes to trigger loading
  selectedIndex.subscribe((index) => {
    if (index >= 0) {
      loadMoreRowsIfNeeded(index);
    }
  });

  const lastBarFocusedRef = Variable<Gtk.Button | null>(null);

  return (
    <box cssClasses={["sticker-results-container"]} vertical spacing={12}
      setup={(self) => {
        // Add keyboard controller to handle Ctrl+J from entry
        const keyController = new Gtk.EventControllerKey();
        keyController.set_propagation_phase(Gtk.PropagationPhase.CAPTURE);

        keyController.connect('key-pressed', (_controller, keyval, _keycode, state) => {
          const ctrlPressed = (state & Gdk.ModifierType.CONTROL_MASK) !== 0;

          if (!ctrlPressed) return false;

          // Handle Ctrl+J when focus is on entry
          if (keyval === Gdk.KEY_j && focusedZone.get() === "entry") {
            // Jump to pack bar
            selectedPackIndex.set(0);
            focusedZone.set("packbar");
            // Focus first pack button
            const packs = signalStickersService.stickerPacks.get();
            if (packs.length > 0) {
              onPackBarFocus?.();
            }
            return true;
          }

          return false;
        });

        self.add_controller(keyController);
      }}>
      {/* Sticker pack selection bar */}
      <StickerPackBar
        selectedPackId={signalStickersService.selectedPackId}
        packFilter={packFilter}
        hasActiveQuery={!!query}
        selectedPackIndex={selectedPackIndex}
        onPackSelected={(index) => {
          // Focus on the selected pack
          selectedPackIndex.set(index);
          focusedZone.set("packbar");
        }}
        setupLastFocused={(self) => {
          lastBarFocusedRef.set(self);
        }}
        entryRef={entryRef}
        selectedIndex={selectedIndex}
        focusedZone={focusedZone}
      />

      {/* Sticker grid */}
      <Gtk.ScrolledWindow
        cssClasses={["sticker-grid-scroll"]}
        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
      >
        <box cssClasses={["sticker-grid"]} spacing={8} vertical
          setup={(self) => {
            // Set up scroll detection for loading more after widget is realized
            self.connect('realize', () => {
              const scrollWindow = self.get_parent() as Gtk.ScrolledWindow;
              if (scrollWindow) {
                const adjustment = scrollWindow.get_vadjustment();
                if (adjustment) {
                  adjustment.connect('value-changed', () => {
                    const value = adjustment.get_value();
                    const upper = adjustment.get_upper();
                    const pageSize = adjustment.get_page_size();

                    // Check if we're near the bottom (within 200 pixels)
                    if (value + pageSize > upper - 200 && !isLoadingMore.get()) {
                      const currentRows = loadedRows.get();

                      // Get total available rows
                      let stickers: StickerData[] = [];
                      if (query) {
                        // Search with query
                        let searchResults = signalStickersService.searchStickers(query);

                        // Apply pack filter if set
                        const filter = packFilter.get();
                        if (filter) {
                          searchResults = searchResults.filter(s => s.packId === filter);
                        }

                        stickers = searchResults;
                      } else if (signalStickersService.selectedPackId.get()) {
                        stickers = signalStickersService.getPackStickers(signalStickersService.selectedPackId.get()!);
                      } else {
                        stickers = signalStickersService.getAllStickers();
                      }

                      const totalRows = Math.ceil(stickers.length / ITEMS_PER_ROW);

                      if (currentRows < totalRows) {
                        isLoadingMore.set(true);
                        // Use timeout to prevent UI freeze
                        setTimeout(() => {
                          loadedRows.set(Math.min(currentRows + 3, totalRows));
                          isLoadingMore.set(false);
                        }, 50);
                      }
                    }
                  });
                }
              }
            });
          }}
        >
          {bind(Variable.derive(
            [signalStickersService.loadedStickers, signalStickersService.selectedPackId, loadedRows, packFilter],
            (_loadedStickers, selectedPackId, maxRows, currentPackFilter) => {
              let stickers: StickerData[] = [];

              stickerButtonRefs.set([])

              if (query) {
                // Search with query
                let searchResults = signalStickersService.searchStickers(query);

                // Apply pack filter if set
                if (currentPackFilter) {
                  searchResults = searchResults.filter(s => s.packId === currentPackFilter);
                }

                stickers = searchResults;
              } else if (selectedPackId) {
                stickers = signalStickersService.getPackStickers(selectedPackId);
              } else {
                stickers = signalStickersService.getAllStickers();
              }

              // Reset loaded rows when content changes
              const previousLength = resultsCount.get();
              if (previousLength !== stickers.length && stickers.length > 0) {
                loadedRows.set(3);
              }

              // Update results count
              resultsCount.set(stickers.length);

              const totalRows = Math.ceil(stickers.length / ITEMS_PER_ROW);
              const rowsToRender = Math.min(maxRows, totalRows);

              log.debug("Stickers updated", {
                query,
                stickerCount: stickers.length,
                selectedPackId,
                loadedPacksCount: signalStickersService.stickerPacks.get().length,
                rowsToRender,
                totalRows
              });

              return { stickers, rowsToRender, totalRows };
            }
          )).as(({ stickers, rowsToRender, totalRows }) =>
            stickers.length === 0 ? (
              <box cssClasses={["sticker-empty-state"]}>
                <label label={query ? "No stickers found" : "No stickers loaded"} />
              </box>
            ) : (
              <>
                {Array.from({ length: rowsToRender }).map((_, rowIndex) => (
                  <box cssClasses={["sticker-row"]} spacing={8} homogeneous>
                    {stickers.slice(rowIndex * ITEMS_PER_ROW, (rowIndex + 1) * ITEMS_PER_ROW).map((sticker, colIndex) => {
                      const index = rowIndex * ITEMS_PER_ROW + colIndex;

                      return (
                        <StickerButton
                          sticker={sticker}
                          stickers={Variable(stickers)}
                          index={index}
                          selectedIndex={selectedIndex}
                          entryRef={entryRef}
                          focusedZone={focusedZone}
                          barRef={bind(lastBarFocusedRef)}


                          onActivate={() => handleCopySticker(sticker)}
                        />
                      );
                    })}
                    {/* Fill empty cells to maintain grid alignment */}
                    {Array.from({ length: ITEMS_PER_ROW - (stickers.slice(rowIndex * ITEMS_PER_ROW, (rowIndex + 1) * ITEMS_PER_ROW).length) }).map(() => (
                      <box cssClasses={["sticker-button", "empty"]} />
                    ))}
                  </box>
                ))}
                {/* Show loading indicator if more rows are available */}
                {rowsToRender < totalRows && (
                  <box cssClasses={["sticker-loading-more"]} halign={Gtk.Align.CENTER} marginTop={10} marginBottom={10}>
                    <label label={`Loading more stickers... (${rowsToRender * ITEMS_PER_ROW} of ${stickers.length})`} />
                  </box>
                )}
              </>
            )
          )}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  );
};
