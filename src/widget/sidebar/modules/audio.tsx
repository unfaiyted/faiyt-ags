import { Widget, Gtk } from "astal/gtk4";

export const EmptyContent = (props: Widget.BoxProps) => {
  // TODO: Add icon
  return (
    <box homogeneous {...props}>
      <box cssName="txt spacing-v-10" vertical valign={Gtk.Align.CENTER}>
        <box vertical cssName="spacing-v-5 txt-subtext">
          {/* <MaterialIcon icon="brand_awareness" size="gigantic" /> */}
          <label label="No audio sources." cssName="txt-small" />
        </box>
      </box>
    </box>
  );
};

export const StreamList = (props: Widget.BoxProps) => {
  return <box {...props}>Stream List</box>;
};


export default function AudioModules(props: Widget.BoxProps) {
  return (
    <box cssName={`spacing-v-5`} vertical {...props}>
      <stack visibleChildName={"empty"}></stack>
      <box vertical cssName={`spacing-v-5`}>
        <EmptyContent name="empty" />
        <StreamList name="list" />
      </box>
    </box>
  );
}
