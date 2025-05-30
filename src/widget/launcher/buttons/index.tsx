import { Widget, Gtk } from "astal/gtk4";
import { c } from "../../../utils/style";
import { truncateText } from "../../../utils";
import { Variable, Binding, bind } from "astal";
import { setupCursorHover } from "../../utils/buttons";

export interface LauncherButtonProps extends Widget.ButtonProps {
  icon: Gtk.Widget | Widget.ImageProps;
  content: string;
  index?: number;
  selected?: Binding<boolean>;
}

export default function LauncherButton(props: LauncherButtonProps) {


  const name = (props.name) ? truncateText(props.name, 30) : "";
  const content = (props.content) ? truncateText(props.content, 50) : "";
  const selected = props.selected || Variable(false);

  return (
    <button
      {...props}
      cssName="overview-search-result-btn"
      cssClasses={bind(selected).as(s =>
        c`txt ${s ? 'selected' : ''} ${props.cssName || ''}`
      )}
      setup={(self: Gtk.Button) => {
        setupCursorHover(self);
        if (props.setup) {
          props.setup(self);
        }
      }}
      onClicked={props.onClicked}
    >
      <box spacing={12}>
        {props.icon}
        <box vertical valign={Gtk.Align.CENTER} hexpand>
          <label
            halign={Gtk.Align.START}
            label={name}
            cssName="overview-search-results-txt"
            cssClasses={c` txt-norm`}
          />
          {content && content !== name && (
            <label
              halign={Gtk.Align.START}
              label={content}
              cssName="overview-search-results-txt"
              cssClasses={c`txt-smallie txt-subtext`}
            />
          )}
        </box>
      </box>
    </button>
  );
}
