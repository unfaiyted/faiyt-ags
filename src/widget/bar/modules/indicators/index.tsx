import { Widget } from "astal/gtk4";
import NetworkIndicator from "./network";

export interface StatusIndicatorsProps extends Widget.BoxProps { }

export default function StatusIndicators() {
  return (
    <box cssName="spacing-h-15">
      <NetworkIndicator />
    </box>
  );
}
