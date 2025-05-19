import { Gtk } from "astal/gtk4";
import { Widget } from "astal/gtk4";
import BarGroup from "../utils/bar-group";
import { CircularProgress } from "../../utils/circular-progress";
import { MaterialIcon } from "../../utils/icons/material";
import { Variable } from "astal";
import { bind } from "astal";
import { execAsync } from "astal/process";
import config from "../../../utils/config";

export enum BarResourceType {
  RAM = "ram",
  SWAP = "swap",
  CPU = "cpu",
}

export const RESOURCE_COMMAND = {
  RAM: `LANG=C free | awk '/^Mem/ {printf("%.2f\\n", ($3/$2) * 100)}'`,
  SWAP: `LANG=C free | awk '/^Swap/ {if ($2 > 0) printf("%.2f\\n", ($3/$2) * 100); else print "0";}'`,
  CPU: `LANG=C top -bn1 | grep Cpu | sed 's/\\,/\\./g' | awk '{print $2}'`,
};

export interface SystemModuleProps extends Widget.BoxProps { }

export interface BarResourceProps extends Widget.BoxProps {
  type: BarResourceType;
  icon: string;
  command: string;
}

function getResourceClassNames(type: BarResourceType) {
  switch (type) {
    case BarResourceType.RAM:
      return ["bar-ram-circprog", "bar-ram-txt", "bar-ram-icon"];
    case BarResourceType.SWAP:
      return ["bar-swap-circprog", "bar-swap-txt", "bar-swap-icon"];
    case BarResourceType.CPU:
      return ["bar-cpu-circprog", "bar-cpu-txt", "bar-cpu-icon"];
    default:
      return [];
  }
}

//name, icon, command, circprogClassName = 'bar-batt-circprog', textClassName = 'txt-onSurfaceVariant', iconClassName = 'bar-batt'
const BarResource = (props: BarResourceProps) => {
  const commandResult = Variable(0).poll(5000, ["bash", "-c", props.command]);
  const resourceLabel = Variable("");
  const tooltipText = Variable("");

  const [circprogClassName, textClassName, iconClassName] =
    getResourceClassNames(props.type);

  const ResourceCircProgress = () => (
    <CircularProgress
      cssName={circprogClassName}
      opacity={0.7}
      percentage={bind(commandResult).as((v) => v / 100)}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
    />
  );

  const ResourceProgress = () => (
    <box homogeneous={true}>
      <overlay>
        <MaterialIcon icon={props.icon} size={"small"} />
        <box homogeneous cssName={`${iconClassName}`}>
          <ResourceCircProgress />
        </box>
      </overlay>
    </box>
  );

  commandResult.subscribe((result) => {
    // print("Command result:", result);
    resourceLabel.set(`${Math.round(Number(result))}%`);
    tooltipText.set(
      `${props.type.toUpperCase()} Usage: ${Math.round(Number(result))}%`,
    );
  });

  const ResourceLabel = () => (
    <label cssName={`txt-smallie ${textClassName}`}></label>
  );

  const handleClick = () =>
    execAsync(["bash", "-c", `${config.apps.taskManager}`]).catch(print);

  return (
    <button onClick={handleClick} tooltipText={bind(tooltipText)}>
      <box cssName={`spacing-h-4 ${textClassName}`}>
        <ResourceProgress />
        <ResourceLabel label={bind(resourceLabel).as((v) => v)} />
      </box>
    </button>
  );
};

export default function SystemResources() {
  // const { setup, child, children } = systemModuleProps;

  return (
    <BarGroup>
      <box>
        <BarResource
          type={BarResourceType.RAM}
          icon="memory"
          command={RESOURCE_COMMAND.RAM}
        />
        <revealer
          revealChild={true}
          transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
          transitionDuration={config.animations.durationLarge}
        >
          <box cssName="spacing-h-10 margin-left-10">
            <BarResource
              type={BarResourceType.SWAP}
              icon="swap_horiz"
              command={RESOURCE_COMMAND.SWAP}
            />
            <BarResource
              type={BarResourceType.CPU}
              icon="settings_motion_mode"
              command={RESOURCE_COMMAND.CPU}
            />
          </box>
        </revealer>
      </box>
    </BarGroup>
  );
}
