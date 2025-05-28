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
      cssClasses={bind(selected).as(s =>
        c`overview-search-result-btn txt ${s ? 'selected' : ''} ${props.cssName || ''}`
      )}
      setup={(self: Gtk.Button) => {
        setupCursorHover(self);
        if (props.setup) {
          props.setup(self);
        }
      }}
      onClicked={props.onClick}
    >
      <box spacing={12}>
        {props.icon}
        <box vertical valign={Gtk.Align.CENTER} hexpand>
          <label
            halign={Gtk.Align.START}
            label={name}
            cssClasses={c`overview-search-results-txt txt-norm`}
          />
          {content && content !== name && (
            <label
              halign={Gtk.Align.START}
              label={content}
              cssClasses={c`overview-search-results-txt txt-smallie txt-subtext`}
            />
          )}
        </box>
      </box>
    </button>
  );
}
