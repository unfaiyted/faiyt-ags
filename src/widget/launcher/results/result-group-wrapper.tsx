import { Widget, Gtk } from "astal/gtk4";
import { Binding } from "astal";
import config from "../../../utils/config";

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
