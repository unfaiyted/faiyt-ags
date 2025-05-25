import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import { BarMode } from "../types";
import NormalBarContent from "./normal";
import FocusBarContent from "./focus";
import NothingBarContent from "./nothing";
import { barLogger as log } from "../../../utils/logger";

export interface BaseBarContentProps extends Widget.BoxProps {
  mode: Binding<BarMode>;
  monitorIndex?: number;
  gdkmonitor?: Gdk.Monitor;
}

export default function BarModeContent(baseBarProps: BaseBarContentProps) {
  const { setup, child, ...props } = baseBarProps;

  log.debug("BarModeContent created", { monitorIndex: props.monitorIndex });
  const getModeContent = () => {
    switch (props.mode.get()) {
      case BarMode.Normal:
        return <NormalBarContent {...props} />;
      case BarMode.Focus:
        return <FocusBarContent {...props} />;
      case BarMode.Nothing:
      default:
        return <NothingBarContent {...props} />;
    }
  };
  const barContent = new Variable(getModeContent());

  props.mode.subscribe(() => {
    barContent.set(getModeContent());
  });

  return <box>{bind(barContent).as((v) => v)}</box>;
}

export { BarModeContent };
