import { Widget, Gtk } from "astal/gtk4";

interface SettingRowProps extends Widget.BoxProps {
  label: string;
  description?: string;
  indent?: boolean;
}

export const SettingRow = ({
  label,
  description,
  children,
  child,
  indent = false
}: SettingRowProps) => (
  <box cssName="setting-row" cssClasses={indent ? ["indented"] : []} spacing={12} hexpand>
    <box vertical hexpand>
      <label cssName="setting-label" halign={Gtk.Align.START}>
        {label}
      </label>
      {description && (
        <label cssName="setting-description" halign={Gtk.Align.START}>
          {description}
        </label>
      )}
    </box>
    <box cssName="setting-row-control" valign={Gtk.Align.CENTER} halign={Gtk.Align.END}>
      {children || child}
    </box>
  </box>
);
