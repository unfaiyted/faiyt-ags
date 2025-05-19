import { Widget, Gtk } from "astal/gtk4";
import Network from "gi://AstalNetwork";
// import GLib from "gi://GLib";
import config from "../../../../utils/config";
import { Variable, bind } from "astal";

const network = Network.get_default();

const NetworkWiredIndicator = (props: Widget.StackProps) => {
  if (!network.wired) return <box></box>;

  const shown = Variable(Network.Internet.DISCONNECTED);
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
      <label
        name="unknown"
        cssName="txt-norm icon-material"
        label="wifi_off"
      />
      <label
        name={Network.Internet.DISCONNECTED.toString()}
        cssName="txt-norm icon-material"
        label="signal_wifi_off"
      />
      <label
        name={Network.Internet.CONNECTED.toString()}
        cssName="txt-norm icon-material"
        label="lan"
      />
      <label
        name={Network.Internet.CONNECTING.toString()}
        cssName="txt-norm icon-material"
        label="settings_ethernet"
      />
      <SimpleNetworkIndicator name="simple" />
    </stack>
  );
};

export interface SimpleNetworkIndicatorProps extends Widget.ImageProps {

}

export const SimpleNetworkIndicator = (props: SimpleNetworkIndicatorProps) => {
  const icon = Variable("");
  const visible = Variable(false);

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
      <label
        name="disabled"
        cssName="txt-norm icon-material"
        label="wifi_off"
      />
      <label
        name={Network.Internet.DISCONNECTED.toString()}
        cssName="txt-norm icon-material"
        label="signal_wifi_off"
      />
      <label
        name={Network.Internet.CONNECTING.toString()}
        cssName="txt-norm icon-material"
        label="settings_ethernet"
      />
      <label
        name="0"
        cssName="txt-norm icon-material"
        label="signal_wifi_0_bar"
      />
      <label
        name="1"
        cssName="txt-norm icon-material"
        label="network_wifi_1_bar"
      />
      <label
        name="2"
        cssName="txt-norm icon-material"
        label="network_wifi_2_bar"
      />
      <label
        name="3"
        cssName="txt-norm icon-material"
        label="network_wifi_3_bar"
      />
      <label
        name="4"
        cssName="txt-norm icon-material"
        label="signal_wifi_4_bar"
      />
    </stack>
  );
};

export default function NetworkIndicator(props: Widget.StackProps) {
  const visible = Variable("simple");

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
