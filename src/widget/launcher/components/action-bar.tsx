import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind, Binding } from "astal";
import { evaluatorManager, type EvaluatorResult } from "../../../utils/evaluators";
import KeyboardShortcut from "../../utils/keyboard-shortcut";
import { launcherLogger as log } from "../../../utils/logger";
import { SearchType } from "../types";
import StickerActionBar from "./sticker-action-bar";

export interface ActionBarProps {
  selectedItem: Binding<any>;
  focusedItem: Binding<any>;
  searchType: Binding<SearchType>;
  entryRef?: Gtk.Entry;
  evaluatorResult: Binding<EvaluatorResult | null>;
}
function DefaultActionBar(props: ActionBarProps) {
  return (
    <box cssClasses={["launcher-action-bar"]} spacing={20}>
      {/* Left side - App actions */}
      <box hexpand halign={Gtk.Align.START} spacing={16}>
        {bind(Variable.derive([props.evaluatorResult, props.selectedItem], (evalResult, app) => {
          if (evalResult) {
            return (
              <box spacing={8}>
                <KeyboardShortcut keys={["↵"]} compact />
                <label label={evalResult.hint || "Copy result to clipboard"} cssClasses={["action-label"]} />
              </box>
            );
          } else if (app) {
            return (
              <>
                <box spacing={8}>
                  <KeyboardShortcut keys={["↵"]} compact />
                  <label label="Open" cssClasses={["action-label"]} />
                </box>
                <box spacing={8}>
                  <KeyboardShortcut keys={["Ctrl", "↵"]} compact />
                  <label label="Open in Terminal" cssClasses={["action-label"]} />
                </box>
                <box spacing={8}>
                  <KeyboardShortcut keys={["Alt", "↵"]} compact />
                  <label label="Show in Files" cssClasses={["action-label"]} />
                </box>
              </>
            );
          } else {
            return <label label="Type to search, calculate, or convert units" cssClasses={["action-hint"]} />;
          }
        }))}
      </box>

      {/* Right side - General shortcuts */}
      <box halign={Gtk.Align.END} spacing={16}>
        <box spacing={8}>
          <KeyboardShortcut keys={["Ctrl", "J"]} compact />
          <label label="Next" cssClasses={["action-label"]} />
        </box>
        <box spacing={8}>
          <KeyboardShortcut keys={["Ctrl", "K"]} compact />
          <label label="Previous" cssClasses={["action-label"]} />
        </box>
        <box spacing={8}>
          <KeyboardShortcut keys={["Esc"]} compact />
          <label label="Close" cssClasses={["action-label"]} />
        </box>
      </box>
    </box>
  );
}

export default function ActionBar(props: ActionBarProps) {
  props.selectedItem.subscribe((s) => {
    log.info("Selected item changed", { selectedItem: s });
  });

  props.focusedItem.subscribe((f) => {
    log.info("Focused item changed", { focusedItem: f });
  });

  props.searchType.subscribe((s) => {
    log.info("Search type changed", { searchType: s });
  });



  return (<box>
    {bind(props.searchType).as((searchType) => {
      switch (searchType) {
        case SearchType.STICKERS:
          return <StickerActionBar currentMode="Sticker Mode" />;

        // Add more specific action bars here as needed
        // case SearchType.HYPRLAND:
        //   return <HyprlandActionBar {...props} />;
        // case SearchType.SCREENCAPTURE:
        //   return <ScreenCaptureActionBar {...props} />;

        default:
          return <DefaultActionBar {...props} />;
      }
    })}
  </box>)
}
