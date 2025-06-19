import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import { Fixed } from "../../utils/containers/drawing-area";
import "../bar.scss";

import BarGroup from "../utils/bar-group";
import CircularProgress from "../../utils/circular-progress";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { execAsync } from "astal/process";
import config from "../../../utils/config";
import { ThemeColor } from "../../../styles/themes";
import themeManager from "../../../services/theme-manager";
import { PhosphorIconStyle, PhosphorIcons } from "../../utils/icons/types";

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
  icon: PhosphorIcons;
  command: string;
  iconColor?: string;
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
  const commandResult = new Variable(0).poll(5000, ["bash", "-c", props.command]);
  const resourceLabel = new Variable("");
  const tooltipText = new Variable("");

  const [circprogClassName, textClassName, iconClassName] =
    getResourceClassNames(props.type);

  // Convert command result to percentage
  const percentValue = bind(commandResult).as((v) => {
    const numVal = Number(v) || 0;
    return numVal / 100; // Convert to 0-1 range
  });

  const ResourceCircProgress = () => (
    <CircularProgress
      cssName={circprogClassName}
      percentage={percentValue}
      size={24}
      lineWidth={2}
      backgroundColor={`${props.iconColor}40`} // 25% opacity version of the icon color
      foregroundColor={props.iconColor || themeManager.getColor('foreground')}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
    />
  );

  const ResourceProgress = () => {
    // We need to reference both widgets to position them properly
    let circleWidget: Gtk.DrawingArea;
    let iconWidget: Gtk.Box;

    return (
      <Fixed widthRequest={24} heightRequest={24}>
        {/* First add the circular progress */}
        <CircularProgress
          cssName={circprogClassName}
          percentage={percentValue}
          size={24}
          lineWidth={2}
          backgroundColor={`${props.iconColor}40`} // 25% opacity version of the icon color
          foregroundColor={props.iconColor || themeManager.getColor('foreground')}
        />

        {/* Then add the icon centered on top */}
        <box
          widthRequest={24}
          heightRequest={24}
          baselinePosition={Gtk.BaselinePosition.CENTER}
          baselineChild={11}

        >
          <box
            widthRequest={4}
          ></box>
          <PhosphorIcon
            iconName={props.icon}
            size={16}
            style={PhosphorIconStyle.Duotone}
            color={props.iconColor ? props.iconColor : ThemeColor.Foreground}
          />
        </box>
      </Fixed>
    );
  };

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
    <button

      cssName="sys-resources-btn"
      heightRequest={24}
      widthRequest={24}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      marginStart={6}
      marginEnd={6}
      onClicked={handleClick} tooltipText={bind(tooltipText)}>
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
          icon={PhosphorIcons.Cpu}
          command={RESOURCE_COMMAND.RAM}
          iconColor={themeManager.getColor('info')}
        />
        <revealer
          revealChild={true}
          transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
          transitionDuration={config.animations.durationLarge}
        >
          <box>
            <BarResource
              type={BarResourceType.SWAP}
              icon={PhosphorIcons.ArrowsLeftRight}
              command={RESOURCE_COMMAND.SWAP}
              iconColor={themeManager.getColor('success')}
            />
            <BarResource
              type={BarResourceType.CPU}
              icon={PhosphorIcons.Gauge}
              command={RESOURCE_COMMAND.CPU}
              iconColor={themeManager.getColor('warning')}
            />
          </box>
        </revealer>
      </box>
    </BarGroup>
  );
}
