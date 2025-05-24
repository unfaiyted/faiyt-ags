import { Widget, Gtk, App } from "astal/gtk4";
import { Variable } from "astal";
import { UIWindows } from "../../../types";
// import { bind } from "astal";


export interface PinButtonProps extends Widget.ButtonProps {
  icon: string;
  windowName: UIWindows;
}


// TODO:: Add Icon
export default function PinButton(props: PinButtonProps) {
  const enabled = Variable(false);

  // const currWindow = App.get_window(props.windowName);

  const handleClick = () => {
    enabled.set(!enabled.get());
  };

  return (
    <button
      valign={Gtk.Align.START}
      tooltipText={props.name}
      onClicked={handleClick}
      cssName={`sidebar-pin ${props.cssName}`}
      label={`${props.icon}`}
      {...props}
    >
      {/* <MaterialIcon icon="push_pin" size="larger" /> */}
    </button>
  );
}
