import NetworkIndicator from "./network";
import { Widget } from "astal/gtk4";

export interface StatusIndicatorsProps extends Widget.BoxProps { }

export default function StatusIndicators() {
  return (
    <box cssName="spacing-h-15">
      <NetworkIndicator />
    </box>
  );
}
