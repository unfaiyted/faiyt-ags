import { bind, Variable } from "astal";
import { Gtk, Gdk, App } from "astal/gtk4";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import signalStickersService, { StickerData } from "../../../services/signal-stickers-service";
import configManager from "../../../services/config-manager";
import { launcherLogger as log } from "../../../utils/logger";
import { truncateText } from "../../../utils";
import StickerButton from "../buttons/sticker-button";
import StickerPackBar from "../components/sticker-pack-bar";
import GL from "gi://GL?version=1.0";

const stickerLog = log.subClass("StickerResults");

interface StickerResultsProps {
  query: string;
  selectedIndex: Variable<number>;
  resultsCount: Variable<number>;
  onPackBarFocus?: () => void;
  entryRef?: Gtk.Entry;
}


const ITEMS_PER_ROW = 6;
const ROW_HEIGHT = 125; // Approximate height of each sticker row
const VISIBLE_ROWS_BUFFER = 2; // Extra rows to render outside viewport
const IMAGE_CACHE = new Map<string, boolean>(); // Cache file existence checks

// Deprecated - use StickerResults component instead
export const getStickerResults = async (
  query: string,
  selectedIndex: Variable<number>
): Promise<Gtk.Widget> => {
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
    manifest: import("../../../services/signal-stickers-service").StickerPackManifest;
    exists: boolean;
  } | null>(null);

  // State for pack filtering when query is active
  const packFilter = Variable<string | null>(null);

  // State for pack bar navigation
  const selectedPackIndex = Variable<number>(-1);
  const focusedZone = Variable<"entry" | "packbar" | "results">("entry");

  // Get entry ref from parent launcher or use provided one
  // const getEntryRef = () => {
  //   if (entryRef) return entryRef;
  //
  //   const windows = App.get_windows();
  //   for (const win of windows) {
  //     if (win.name?.startsWith('launcher')) {
  //       // Find the entry widget in the launcher window
  //       const entry = win.get_child()?.get_first_child()?.get_first_child()?.get_last_child()?.get_first_child()?.get_first_child()?.get_first_child()?.get_first_child() as Gtk.Entry | undefined;
  //       if (entry && entry instanceof Gtk.Entry) {
  //         return entry;
  //       }
  //     }
  //   }
  //   return null;
  // };

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
  const loadedRows = Variable<number>(5); // Start with more rows for better UX
  const isLoadingMore = Variable<boolean>(false);

  // Debounced stickers for performance
  const debouncedStickers = Variable<StickerData[]>([]);
  let debounceTimeout: GLib.Source | null = null;

  // Preload images for visible stickers
  const preloadVisibleImages = (stickers: StickerData[], startIdx: number, endIdx: number) => {
    const toPreload = stickers.slice(startIdx, Math.min(endIdx, stickers.length));

    // Batch preload checks
    setTimeout(() => {
      toPreload.forEach(sticker => {
        if (!IMAGE_CACHE.has(sticker.imagePath)) {
          try {
            const imageFile = Gio.File.new_for_path(sticker.imagePath);
            const exists = imageFile.query_exists(null);
            IMAGE_CACHE.set(sticker.imagePath, exists);
          } catch (error) {
            IMAGE_CACHE.set(sticker.imagePath, false);
          }
        }
      });
    });
  };

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
                  
                  // Select the newly added pack to ensure it's active
                  signalStickersService.selectPack(packInfo.id);
                  
                  // Force refresh to ensure UI updates
                  signalStickersService.refreshPackInCache(packInfo.id);

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
    signalStickersService.loadStickerPacks(config.search.stickers.packs).then(async () => {
      // After loading packs, load details for each pack
      const packs = signalStickersService.stickerPacks.get();
      log.debug("Loaded packs, now loading details", { packCount: packs.length });

      // Load all pack details in parallel
      const loadPromises = packs.map(pack => {
        if (pack.meta.key) {
          log.debug("Loading details for pack", { packId: pack.meta.id, key: pack.meta.key });
          return signalStickersService.loadStickerPackDetails(pack.meta.id, pack.meta.key).then(() => {
            log.debug("Successfully loaded pack details", { packId: pack.meta.id });
          }).catch(err => {
            log.error("Failed to load sticker pack details", {
              packId: pack.meta.id,
              error: err instanceof Error ? err.message : String(err)
            });
          });
        } else {
          log.warn("Pack missing key", { packId: pack.meta.id });
          return Promise.resolve();
        }
      });
      
      // Wait for all packs to load
      await Promise.all(loadPromises);
      
      // Force a refresh after all packs are loaded
      signalStickersService.refreshPackInCache("");
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

  // Update debounced stickers when dependencies change
  const updateDebouncedStickers = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
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

      // Reset loaded rows when content changes significantly
      const previousLength = debouncedStickers.get().length;
      if (Math.abs(previousLength - stickers.length) > ITEMS_PER_ROW * 2) {
        loadedRows.set(5);
        // Animate revealer for significant changes
        revealStickers.set(false);
        setTimeout(() => revealStickers.set(true), 50);
      }

      debouncedStickers.set(stickers);
      resultsCount.set(stickers.length);

      // Preload first batch of images
      if (stickers.length > 0) {
        preloadVisibleImages(stickers, 0, ITEMS_PER_ROW * 3);
      }
    }, 100); // Reduced debounce for faster response
  };

  // Subscribe to changes
  signalStickersService.loadedStickers.subscribe(() => updateDebouncedStickers());
  signalStickersService.selectedPackId.subscribe(() => updateDebouncedStickers());
  packFilter.subscribe(() => updateDebouncedStickers());

  // Initial update
  updateDebouncedStickers();

  // Show revealer after initial load
  setTimeout(() => {
    revealStickers.set(true);
  }, 100);

  // Optimized function to load more rows when needed
  const loadMoreRowsIfNeeded = (currentIndex: number) => {
    const currentRow = Math.floor(currentIndex / ITEMS_PER_ROW) + 1;
    const currentLoadedRows = loadedRows.get();

    // If user is on the last loaded row, load more
    if (currentRow >= currentLoadedRows - 2 && !isLoadingMore.get()) {
      // Get current stickers without re-filtering
      const stickers = debouncedStickers.get();
      const totalRows = Math.ceil(stickers.length / ITEMS_PER_ROW);

      if (currentLoadedRows < totalRows) {
        isLoadingMore.set(true);
        // Load in smaller batches for smoother experience
        setTimeout(() => {
          const newRows = Math.min(currentLoadedRows + 5, totalRows);
          loadedRows.set(newRows);

          // Preload images for newly visible rows
          const startIdx = currentLoadedRows * ITEMS_PER_ROW;
          const endIdx = newRows * ITEMS_PER_ROW;
          preloadVisibleImages(stickers, startIdx, endIdx);

          isLoadingMore.set(false);
        });
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

  // Virtual scrolling state
  const visibleStartRow = Variable(0);
  const visibleEndRow = Variable(6); // Start with 6 rows visible
  let scrollTimeout: GLib.Source | null = null;
  let scrolledWindow: Gtk.ScrolledWindow | null = null;
  const revealStickers = Variable(false);



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

      {/* Sticker grid with virtual scrolling */}
      <Gtk.ScrolledWindow
        cssClasses={["sticker-grid-scroll"]}
        vscrollbarPolicy={Gtk.PolicyType.EXTERNAL}
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
      >
        {/* <revealer */}
        {/*   transitionDuration={config.animations?.durationLarge || 300} */}
        {/*   revealChild={bind(revealStickers)} */}
        {/*   cssClasses={["sticker-grid-revealer"]} */}
        {/*   halign={Gtk.Align.CENTER} */}
        {/*   valign={Gtk.Align.START} */}
        {/*   transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN} */}
        {/* > */}
        <box cssClasses={["sticker-grid"]}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.START}

          spacing={10} vertical
          setup={(self) => {
            // Set up scroll detection for loading more after widget is realized
            self.connect('realize', () => {
              const scrollWindow = self.get_parent() as Gtk.ScrolledWindow;

              scrolledWindow = scrollWindow;

              if (scrollWindow) {
                const adjustment = scrollWindow.get_vadjustment();
                if (adjustment) {
                  // Virtual scrolling handler
                  adjustment.connect('value-changed', () => {
                    if (scrollTimeout) {
                      clearTimeout(scrollTimeout);
                    }

                    // Debounce scroll updates
                    scrollTimeout = setTimeout(() => {
                      const value = adjustment.get_value();
                      const pageSize = adjustment.get_page_size();

                      // Calculate visible rows based on scroll position
                      const startRow = Math.floor(value / ROW_HEIGHT);
                      const endRow = Math.ceil((value + pageSize) / ROW_HEIGHT);

                      // Update with buffer
                      visibleStartRow.set(Math.max(0, startRow - VISIBLE_ROWS_BUFFER));
                      visibleEndRow.set(endRow + VISIBLE_ROWS_BUFFER);
                    }, 50);

                    const value = adjustment.get_value();
                    const upper = adjustment.get_upper();
                    const pageSize = adjustment.get_page_size();

                    // Check if we're near the bottom (within 200 pixels)
                    if (value + pageSize > upper - 200 && !isLoadingMore.get()) {
                      const currentRows = loadedRows.get();
                      const stickers = debouncedStickers.get();
                      const totalRows = Math.ceil(stickers.length / ITEMS_PER_ROW);

                      if (currentRows < totalRows) {
                        isLoadingMore.set(true);
                        // Batch load for smooth scrolling
                        setTimeout(() => {
                          const newRows = Math.min(currentRows + 5, totalRows);
                          loadedRows.set(newRows);

                          // Preload images for newly visible area
                          const startIdx = currentRows * ITEMS_PER_ROW;
                          const endIdx = newRows * ITEMS_PER_ROW;
                          preloadVisibleImages(stickers, startIdx, endIdx);

                          isLoadingMore.set(false);
                        }, 16);
                      }
                    }
                  });
                }
              }
            });
          }}
        >

          {bind(Variable.derive(
            [debouncedStickers, loadedRows],
            (stickers, maxRows) => {
              stickerButtonRefs.set([])

              // Update results count
              resultsCount.set(stickers.length);

              const totalRows = Math.ceil(stickers.length / ITEMS_PER_ROW);
              const rowsToRender = Math.min(maxRows, totalRows);

              // Debug logging
              stickerLog.debug("Rendering sticker grid", {
                stickersLength: stickers.length,
                rowsToRender,
                totalRows,
                maxRows,
                loadedRowsCount: loadedRows.get()
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
                          scrolledWindow={scrolledWindow}
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
                    <label label={`Loading more stickers... (${Math.min(rowsToRender * ITEMS_PER_ROW, stickers.length)} of ${stickers.length})`} />
                  </box>
                )}

              </>
            )
          )}

        </box>
        {/* </revealer> */}
      </Gtk.ScrolledWindow>
    </box>
  );
};
