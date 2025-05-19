import { Widget } from "astal/gtk4";
import { PhosphorIcons, PhosphorWeight, PhosphorIconName } from "./types";


export interface PhosphorIconProps extends Widget.LabelProps {
  className?: string;
  icon: PhosphorIcons | PhosphorIconName;
  size?: number; // pixel font size?
  weight?: PhosphorWeight;
}

export default function PhosphorIcon(phosphorIconProps: PhosphorIconProps) {
  const { setup, icon, ...props } = phosphorIconProps;
  // print("PhosphorIcon:", icon);

  const weight = props.weight || PhosphorWeight.REGULAR;

  // print("PhosphorIcon weight:", weight);
  const className = `${props.className} ph`;
  // print("PhosphorIcon className:", className);

  const iconValue =
    typeof icon === "string" && icon in PhosphorIcons
      ? PhosphorIcons[icon as keyof typeof PhosphorIcons]
      : icon;

  return (
    <label
      cssName={`${className} ${weight}`}
      style={{ fontSize: props.size || 100 }}
      // css={`
      //   font-size: ${props.size || 100}px;
      // `}
      label={iconValue}
      {...props}
    ></label>
  );
}
