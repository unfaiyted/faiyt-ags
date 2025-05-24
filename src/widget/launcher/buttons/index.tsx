import { Widget, Gtk } from "astal/gtk4";
import { c } from "../../../utils/style";
import { truncateText } from "../../../utils";

export interface LauncherButtonProps extends Widget.ButtonProps {
  icon: Gtk.Widget | Widget.ImageProps;
  content: string;
  index?: number;
}

export default function LauncherButton(props: LauncherButtonProps) {


  const name = (props.name) ? truncateText(props.name) : "";
  const content = (props.content) ? truncateText(props.content) : "";

  return (
    <button
      {...props}
      cssClasses={c`overview-search-result-btn txt ${props.cssName}`}
      onClick={props.onClick}
    >
      <box>
        <box vertical={false}>
          {props.icon}
          <box vertical>
            <label
              halign={Gtk.Align.START}
              label={name}
              cssClasses={c`overview-search-results-txt txt-smallie txt-subtext`}
            />
            <label
              halign={Gtk.Align.START}
              label={content}
              cssClasses={c`overview-search-results-txt txt-norm`}
            />
            <label
              halign={Gtk.Align.END}
              label={props.index?.toString()}
              cssClasses={c`overview-search-results-txt txt-norm`}
            />
          </box>
          <box hexpand></box>
        </box>
      </box>
    </button>
  );
}
