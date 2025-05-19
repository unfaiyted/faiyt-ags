import { PhosphorIcons, PhosphorWeight, PhosphorIconProps } from "./types";

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
      className={`${className} ${weight}`}
      css={`
        font-size: ${props.size || 100}px;
      `}
      label={iconValue}
      {...props}
    ></label>
  );
}
