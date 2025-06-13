import { Widget, Gtk } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import ScreenCaptureButton, {
  ScreenCaptureOption,
  generateScreenCaptureOptions
} from "../buttons/screen-capture-button";
import config from "../../../utils/config";
import { SCREEN_TRIGGER_KEYWORDS } from "../types";

export interface ResultGroupWrapperProps extends Widget.BoxProps {
  groupName: string;
  revealed: Binding<boolean> | boolean;
}
export default function ResultGroupWrapper(props: ResultGroupWrapperProps) {
  return (
    <revealer
      transitionDuration={config.animations?.durationLarge || 300}
      revealChild={props.revealed}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      halign={Gtk.Align.START}
      widthRequest={400}
      cssName="result-group-results"
    >
      <box vertical hexpand>
        <label
          label={props.groupName}
          halign={Gtk.Align.START}
          cssClasses={["results-category-label"]}
        />
        <box vertical cssClasses={["launcher-results-list"]}>
          {props.child || props.children}
        </box>
      </box>
    </revealer>
  );
}
