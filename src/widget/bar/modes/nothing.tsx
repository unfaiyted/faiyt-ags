import { BaseBarContentProps } from "./index";

export interface NothingBarContentProps extends BaseBarContentProps { }

export default function NothingBarMode(barModeProps: NothingBarContentProps) {
  const { setup, child, ...props } = barModeProps;

  return <box cssName="bar-bg-nothing"></box>;
}
