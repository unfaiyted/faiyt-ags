import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind, Binding } from "astal";
import KeyboardShortcut from "../../utils/keyboard-shortcut";
import { launcherLogger as log } from "../../../utils/logger";

export interface StickerActionBarProps {
  currentMode?: string;
}

export default function StickerActionBar(props: StickerActionBarProps) {
  const mode = props.currentMode || "Sticker Mode";

  return (
    <box cssClasses={["launcher-action-bar", "sticker-action-bar"]} spacing={20}>
      {/* Left side - Mode indicator */}
      <box hexpand halign={Gtk.Align.START} spacing={16}>
        <box spacing={8}>
          <label label={`${mode}`} cssClasses={["action-label", "mode-indicator"]} />
        </box>
      </box>

      {/* Center - Navigation hints */}
      <box halign={Gtk.Align.CENTER} spacing={16}>
        <box spacing={8}>
          <KeyboardShortcut keys={["H", "J", "K", "L"]} compact />
          <label label="Navigate stickers" cssClasses={["action-label"]} />
        </box>
        <box spacing={8}>
          <KeyboardShortcut keys={["Ctrl", "J/K"]} compact />
          <label label="Switch between input & results" cssClasses={["action-label"]} />
        </box>
      </box>

      {/* Right side - General shortcuts */}
      <box halign={Gtk.Align.END} spacing={16}>
        <box spacing={8}>
          <KeyboardShortcut keys={["↵"]} compact />
          <label label="Select sticker" cssClasses={["action-label"]} />
        </box>
        <box spacing={8}>
          <KeyboardShortcut keys={["Esc"]} compact />
          <label label="Close" cssClasses={["action-label"]} />
        </box>
      </box>
    </box>
  );
}
