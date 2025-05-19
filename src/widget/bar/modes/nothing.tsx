import { NothingBarContentProps } from "../types";

export default function NothingBarMode(barModeProps: NothingBarContentProps) {
  const { setup, child, ...props } = barModeProps;

  return <box className="bar-bg-nothing"></box>;
}
