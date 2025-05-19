import { Widget } from "astal/gtk4";

export const BarGroup = ({ child, cssName }: Widget.BoxProps) => (
  <box cssName={`bar-group-margin bar-sides ${cssName}`}>
    <box cssName="bar-group bar-group-standalone bar-group-pad-system">
      {child}
    </box>
  </box>
);

export default BarGroup;
