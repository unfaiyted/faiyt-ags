import { Widget, Gtk } from "astal/gtk4";

interface SettingRowProps extends Widget.BoxProps {
  label: string;
  description?: string;
}

export const SettingRow = ({
  label,
  description,
  children,
  child
}: SettingRowProps) => (
  <box cssName="setting-row" spacing={12} hexpand>
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
