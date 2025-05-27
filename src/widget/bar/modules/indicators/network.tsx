import Network from "gi://AstalNetwork";
import config from "../../../../utils/config";
import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";
import { c } from "../../../../utils/style"
import { theme } from "../../../../utils/color"
const network = Network.get_default();

const NetworkWiredIndicator = (props: Widget.StackProps) => {
  if (!network.wired) return <box></box>;

  const shown = new Variable(Network.Internet.DISCONNECTED);
  const { internet } = network.wired;

  if (
    [Network.Internet.CONNECTING, Network.Internet.CONNECTED].includes(internet)
  )
    shown.set(internet);

  return (
    <stack
      transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
      transitionDuration={config.animations.durationSmall}
      visibleChildName={"unknown"}
    >
      <PhosphorIcon
        name="unknown"
        style={PhosphorIconStyle.Duotone}
        iconName={PhosphorIcons.Question}
      />
      <PhosphorIcon
        name={Network.Internet.DISCONNECTED.toString()}
        iconName={PhosphorIcons.WifiSlash}
      />
      <PhosphorIcon
        name={Network.Internet.CONNECTED.toString()}
        style={PhosphorIconStyle.Duotone}
        iconName={PhosphorIcons.Network}
      />
      <PhosphorIcon
        name={Network.Internet.CONNECTING.toString()}
        iconName={PhosphorIcons.Network}
        style={PhosphorIconStyle.Duotone}
        color={theme.gold}
      />
      <SimpleNetworkIndicator name="simple" />
    </stack>
  );
};

export interface SimpleNetworkIndicatorProps extends Widget.ImageProps {

}

export const SimpleNetworkIndicator = (props: SimpleNetworkIndicatorProps) => {
  const icon = new Variable("");
  const visible = new Variable(false);

  network.connect("notify", (source: Network.Network, _pspec) => {
    const primary = source.primary as Network.Primary;
    const device =
      primary === Network.Primary.WIFI
        ? source.wifi
        : primary === Network.Primary.WIRED
          ? source.wired
          : null;
    const currIcon = device?.iconName;
    icon.set(currIcon || "");
    visible.set(!!currIcon);
  });

  return <image iconName={bind(icon)} visible={bind(visible)} name={props.name} />;
};

export interface NetworkWifiIndicatorProps extends Widget.StackProps { }

export const NetworkWifiIndicator = (props: NetworkWifiIndicatorProps) => {
  if (!network.wifi) return <box></box>;

  const shown = new Variable(Network.Internet.DISCONNECTED.toString());
  const { internet } = network.wifi;

  if (network.wifi.internet == Network.Internet.CONNECTED) {
    shown.set(String(Math.ceil(network.wifi.strength / 25)));
  }

  if (
    [Network.Internet.CONNECTING, Network.Internet.CONNECTED].includes(internet)
  )
    shown.set(internet.toString());

  return (
    <stack
      transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
      transitionDuration={config.animations.durationSmall}
      visibleChildName={bind(shown).as((v) => v.toString())}
    >

      <PhosphorIcon
        name="disabled"
        style={PhosphorIconStyle.Duotone}
        iconName={PhosphorIcons.WifiSlash}
      />
      <PhosphorIcon
        name={Network.Internet.DISCONNECTED.toString()}
        iconName={PhosphorIcons.WifiX}
      />
      <PhosphorIcon
        name={Network.Internet.CONNECTING.toString()}
        iconName={PhosphorIcons.Network}
      />
      <PhosphorIcon
        name="0"
        style={PhosphorIconStyle.Duotone}
        iconName={PhosphorIcons.WifiNone}
      />
      <PhosphorIcon
        name="1"
        style={PhosphorIconStyle.Duotone}
        iconName={PhosphorIcons.WifiLow}
      />
      <PhosphorIcon
        name="2"
        style={PhosphorIconStyle.Duotone}
        iconName={PhosphorIcons.WifiMedium}
      />
      <PhosphorIcon
        name="3"
        style={PhosphorIconStyle.Duotone}
        iconName={PhosphorIcons.WifiMedium}
      />
      <PhosphorIcon
        name="4"
        style={PhosphorIconStyle.Duotone}
        iconName={PhosphorIcons.WifiHigh}
      />
    </stack>
  );
};

export default function NetworkIndicator(props: Widget.StackProps) {
  const visible = new Variable("simple");

  network.connect("notify", (source: Network.Network, pspec) => {
    if (network.primary == Network.Primary.WIRED) visible.set("wired");
    else if (network.primary == Network.Primary.WIFI) visible.set("wifi");
    else visible.set("simple");
  });

  return (
    <stack
      transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
      transitionDuration={config.animations.durationSmall}
      visibleChildName={bind(visible).as((v) => v.toString())}
    >
      <SimpleNetworkIndicator name="simple" />
      <NetworkWifiIndicator name="wifi" />
      <NetworkWiredIndicator name="wired" />
    </stack>
  );
}
