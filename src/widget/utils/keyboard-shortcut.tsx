import { Widget, Gtk } from "astal/gtk4";

export interface KeyboardShortcutProps extends Widget.BoxProps {
  keys: string[]; // Array of keys like ["Ctrl", "A"] or ["⌘", "K"]
  compact?: boolean;
}

export default function KeyboardShortcut({ keys, compact = false, ...props }: KeyboardShortcutProps) {
  return (
    <box
      {...props}
      spacing={compact ? 2 : 4}
      cssClasses={["keyboard-shortcut"]}
      halign={props.halign || Gtk.Align.CENTER}
      valign={props.valign || Gtk.Align.CENTER}
    >
      {keys.map((key, index) => (
        <>
          {index > 0 && !compact && (
            <label
              cssClasses={["keyboard-shortcut-plus"]}
              label="+"
              valign={Gtk.Align.CENTER}
            />
          )}
          <box
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}

            cssClasses={["keyboard-key", ...(compact ? ["compact"] : [])]}>
            <label
              halign={Gtk.Align.CENTER}
              valign={Gtk.Align.CENTER}
              label={key}
              cssClasses={["keyboard-key-label"]}
            />
          </box>
        </>
      ))}
    </box>
  );
}

// Helper function to format common shortcuts
export function formatShortcut(shortcut: string): string[] {
  return shortcut
    .replace(/\+/g, " ")
    .split(" ")
    .filter(k => k.length > 0)
    .map(k => {
      // Convert common key names to symbols
      switch (k.toLowerCase()) {
        case "ctrl":
        case "control":
          return "Ctrl";
        case "alt":
        case "option":
          return "Alt";
        case "shift":
          return "⇧";
        case "cmd":
        case "command":
        case "super":
        case "meta":
          return "⌘";
        case "enter":
        case "return":
          return "↵";
        case "tab":
          return "⇥";
        case "escape":
        case "esc":
          return "Esc";
        case "space":
          return "␣";
        case "up":
          return "↑";
        case "down":
          return "↓";
        case "left":
          return "←";
        case "right":
          return "→";
        default:
          return k.charAt(0).toUpperCase() + k.slice(1);
      }
    });
}
