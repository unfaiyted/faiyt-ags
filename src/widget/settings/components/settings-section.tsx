import { Widget, Gtk } from "astal/gtk4";

interface SettingsSectionProps extends Widget.BoxProps {
  title: string;
}

export const SettingsSection = (props: SettingsSectionProps) => (
  <box cssName="settings-section" vertical spacing={8}>
    <label cssName="settings-section-title" halign={Gtk.Align.START}>
      {props.title}
    </label>
    <box cssName="settings-section-content" vertical spacing={4}>
      {props.children || props.child}
    </box>
  </box>
);
