import { Widget } from "astal/gtk4";

export default function BluetoothModules(props: Widget.BoxProps) {
  const { cssName, ...restProps } = props;
  
  return <box cssName={cssName || ''} {...restProps}>Bluetooth Modules</box>;
}
