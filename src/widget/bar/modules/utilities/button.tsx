import { Widget, Gtk } from "astal/gtk4";

export interface UtilitiesButtonProps extends Widget.ButtonProps {
  icon: string;
  className?: string;
  name: string;
  onClick: () => void;
}

export default function UtilitiesButton(props: UtilitiesButtonProps) {
  return (
    <button
      valign={Gtk.Align.CENTER}
      tooltipText={props.name}
      onClicked={props.onClick}
      className={`bar-util-btn icon-material txt-norm ${props.className}`}
      label={`${props.icon}`}
      {...props}
    ></button>
  );
}

export { UtilitiesButton };
