import { Widget } from "astal/gtk3";

export interface ConfigurationModuleProps extends Widget.BoxProps { }


export default function ConfigurationModules(props: ConfigurationModuleProps) {
  return <box>
    <label cssName="config-txt" label="Configuration" />
  </box>;
}
