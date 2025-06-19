import Network from "gi://AstalNetwork";
import config from "../../../../utils/config";
import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";
import { ThemeColor } from "../../../../styles/themes";
const network = Network.get_default();
import { barLogger as log } from "../../../../utils/logger";

const NetworkWiredIndicator = (props: Widget.StackProps) => {
  if (!network.wired) return <box></box>;

  const shown = new Variable(Network.Internet.DISCONNECTED);
  const { internet } = network.wired;

  if (
    [Network.Internet.CONNECTING, Network.Internet.CONNECTED].includes(internet)
  )
    shown.set(internet);

  log.info("Wired network indicator shown", { shown: shown.get() });

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
        color={ThemeColor.Gold}
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

  const shown = Variable(Network.Internet.DISCONNECTED.toString());
  // Generate a unique ID for this instance to avoid duplicate Stack child names
  const instanceId = Math.random().toString(36).substring(7);

  if (network.wifi.internet == Network.Internet.CONNECTED) {
    log.info("WiFi connected", { strength: network.wifi.strength });
    shown.set(String(Math.ceil(network.wifi.strength / 25)) + `-${instanceId}`);
    log.info("WiFi connected as shown", { shown: shown.get() });
  } else {
    shown.set(Network.Internet.DISCONNECTED.toString());
  }

  network.wifi.connect("state-changed", (self, newState) => {
    log.info("Wifi network state changed", { state: network.wifi.state });
    log.info("New WiFi state", { state: newState });
    log.info("WiFi connected", { strength: network.wifi.strength });
    shown.set(String(Math.ceil(network.wifi.strength / 25)) + `-${instanceId}`);
  });


  log.info("WiFi shown", { shown: shown.get() });

  return (
    <stack
      transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
      transitionDuration={config.animations.durationSmall}
      visibleChildName={bind(shown)}
    >
      <PhosphorIcon
        name={`disabled-${instanceId}`}
        style={PhosphorIconStyle.Duotone}
        iconName={PhosphorIcons.WifiSlash}
      />
      <PhosphorIcon
        name={`${Network.Internet.DISCONNECTED.toString()}-${instanceId}`}
        iconName={PhosphorIcons.WifiX}
      />
      <PhosphorIcon
        name={`${Network.Internet.CONNECTING.toString()}-${instanceId}`}
        iconName={PhosphorIcons.Network}
      />
      <PhosphorIcon
        name={`0-${instanceId}`}
        style={PhosphorIconStyle.Regular}
        iconName={PhosphorIcons.WifiNone}
      />
      <PhosphorIcon
        name={`1-${instanceId}`}
        style={PhosphorIconStyle.Regular}
        iconName={PhosphorIcons.WifiLow}
      />
      <PhosphorIcon
        name={`2-${instanceId}`}
        style={PhosphorIconStyle.Regular}
        iconName={PhosphorIcons.WifiMedium}
      />
      <PhosphorIcon
        name={`3-${instanceId}`}
        style={PhosphorIconStyle.Regular}
        iconName={PhosphorIcons.WifiMedium}
      />
      <PhosphorIcon
        name={`4-${instanceId}`}
        style={PhosphorIconStyle.Regular}
        iconName={PhosphorIcons.WifiHigh}
      />
      <PhosphorIcon
        name={`5-${instanceId}`}
        style={PhosphorIconStyle.Regular}
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
