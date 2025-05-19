import { Widget } from "astal/gtk3";
import { Binding } from "astal";

export interface MaterialIconProps extends Widget.LabelProps {
  size?: "tiny" | "small" | "normal" | "larger" | "big" | "gigantic";
  icon: string | Binding<string>;
}

export const MaterialIcon = (props: MaterialIconProps) => (
  <label
    className={`icon-material txt-${props.size}`}
    label={props.icon}
  ></label>
);

export default MaterialIcon;
