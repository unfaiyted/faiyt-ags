import { Widget, Astal, Gtk } from "astal/gtk4";
import { ClickButtonPressed } from "../../../../types";
import { actions } from "../../../../utils/actions";
import { setupCursorHover } from "../../../utils/buttons";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import { Variable, bind, Binding } from "astal";
import config from "../../../../utils/config";

const network = Network.get_default();
const bt = Bluetooth.get_default();

export const BluetoothIndicator = () => {
  const shown = Variable("disabled");

  bt.connect("notify", (_bt: Bluetooth.Bluetooth) => {
    shown.set(_bt.isPowered ? "enabled" : "disabled");
  });

  return (
    <stack
      transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
      transitionDuration={config.animations.durationSmall}
      visibleChildName={bind(shown)}
    >
      <label
        name="enabled"
        cssName="txt-norm icon-material"
        label="bluetooth"
      />
      <label
        name="disabled"
        cssName="txt-norm icon-material"
        label="bluetooth_disabled"
      />
    </stack>
  );
};

export const SimpleNetworkIndicator = (props: Widget.LabelProps) => {
  const icon = network.primary == Network.Primary.WIFI ? "wifi" : "lan";
  return <image iconName={icon} visible />;
};

export const NetworkWiredIndicator = (props: Widget.StackProps) => {
  const shown = Variable("fallback");

  if (!network.wired) return <stack {...props} />;

  switch (network.wifi.internet) {
    case Network.Internet.CONNECTED:
      shown.set("connected");
      break;
    case Network.Internet.DISCONNECTED:
      shown.set("disconnected");
      break;
    case Network.Internet.CONNECTING:
      shown.set("connecting");
    default:
      shown.set("fallback");
      break;
  }

  if (network.connectivity !== Network.Connectivity.FULL)
    shown.set("disconnected");

  return (
    <stack
      {...props}
      transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
      transitionDuration={config.animations.durationSmall}
      visibleChildName={bind(shown)}
    >
      <SimpleNetworkIndicator name="fallback" />
      <label
        name="unknown"
        cssName="txt-norm icon-material"
        label="wifi_off"
      />
      <label
        name="disconnected"
        cssName="txt-norm icon-material"
        label="signal_wifi_off"
      />
      <label name="connected" cssName="txt-norm icon-material" label="lan" />
      <label
        name="connecting"
        cssName="txt-norm icon-material"
        label="settings_ethernet"
      />
    </stack>
  );
};
export const NetworkWifiIndicator = (props: Widget.StackProps) => {
  const shown = Variable("disabled");

  if (!network.wifi) return <stack {...props} />;

  switch (network.wifi.internet) {
    case Network.Internet.CONNECTED:
      const signalStrength = String(Math.ceil(network.wifi.strength / 25));
      shown.set(signalStrength);
      break;
    case Network.Internet.DISCONNECTED:
      shown.set("disconnected");
      break;
    case Network.Internet.CONNECTING:
      shown.set("connecting");
    default:
      shown.set("disabled");
      break;
  }

  return (
    <stack
      {...props}
      transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
      transitionDuration={config.animations.durationSmall}
      visibleChildName={bind(shown)}
    >
      <label
        name="disabled"
        cssName="txt-norm icon-material"
        label="wifi_off"
      />
      <label
        name="disconnected"
        cssName="txt-norm icon-material"
        label="signal_wifi_off"
      />
      <label
        name="connecting"
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

export const NetworkIndicator = (props: Widget.StackProps) => {
  const shown = Variable("fallback");

  if (network.primary == Network.Primary.WIFI) {
    shown.set("wifi");
  } else if (network.primary == Network.Primary.WIRED) {
    shown.set("wired");
  } else {
    shown.set("fallback");
  }

  return (
    <stack
      transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
      transitionDuration={config.animations.durationSmall}
      visibleChildName={bind(shown)}
    >
      <SimpleNetworkIndicator name="fallback" />
      <NetworkWifiIndicator name="wifi" />
      <NetworkWiredIndicator name="wired" />
    </stack>
  );
};
