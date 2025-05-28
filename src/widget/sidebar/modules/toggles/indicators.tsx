import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import { Variable, bind, } from "astal";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";

const network = Network.get_default();
const bt = Bluetooth.get_default();

export const BluetoothIndicator = () => {
  const iconName = Variable(PhosphorIcons.BluetoothSlash);

  bt.connect("notify", (_bt: Bluetooth.Bluetooth) => {
    iconName.set(_bt.isPowered ? PhosphorIcons.Bluetooth : PhosphorIcons.BluetoothSlash);
  });

  return (
    <PhosphorIcon
      iconName={bind(iconName)}
      size={20}
      cssName="indicator-icon"
    />
  );
};

export const SimpleNetworkIndicator = () => {
  const iconName = network.primary == Network.Primary.WIFI
    ? PhosphorIcons.WifiHigh
    : PhosphorIcons.HardDrives;

  return (
    <PhosphorIcon
      iconName={iconName}
      size={20}
      cssName="indicator-icon"
    />
  );
};

export const NetworkWiredIndicator = () => {
  const iconName = Variable(PhosphorIcons.WifiSlash);

  if (!network.wired) return <PhosphorIcon iconName={PhosphorIcons.WifiSlash} size={20} cssName="indicator-icon" />;

  const updateIcon = () => {
    switch (network.wired.internet) {
      case Network.Internet.CONNECTED:
        iconName.set(PhosphorIcons.HardDrives);
        break;
      case Network.Internet.DISCONNECTED:
        iconName.set(PhosphorIcons.WifiSlash);
        break;
      case Network.Internet.CONNECTING:
        iconName.set(PhosphorIcons.ArrowsClockwise);
        break;
      default:
        iconName.set(PhosphorIcons.WifiSlash);
        break;
    }

    if (network.connectivity !== Network.Connectivity.FULL) {
      iconName.set(PhosphorIcons.WifiSlash);
    }
  };

  network.wired.connect("notify", updateIcon);
  updateIcon();

  return (
    <PhosphorIcon
      iconName={bind(iconName)}
      size={20}
      cssName="indicator-icon"
    />
  );
};
export const NetworkWifiIndicator = () => {
  const iconName = Variable(PhosphorIcons.WifiSlash);

  if (!network.wifi) return <PhosphorIcon iconName={PhosphorIcons.WifiSlash} size={20} cssName="indicator-icon" />;

  const updateIcon = () => {
    switch (network.wifi.internet) {
      case Network.Internet.CONNECTED:
        const strength = network.wifi.strength;
        if (strength >= 80) {
          iconName.set(PhosphorIcons.WifiHigh);
        } else if (strength >= 60) {
          iconName.set(PhosphorIcons.WifiMedium);
        } else if (strength >= 40) {
          iconName.set(PhosphorIcons.WifiLow);
        } else {
          iconName.set(PhosphorIcons.WifiNone);
        }
        break;
      case Network.Internet.DISCONNECTED:
        iconName.set(PhosphorIcons.WifiSlash);
        break;
      case Network.Internet.CONNECTING:
        iconName.set(PhosphorIcons.ArrowsClockwise);
        break;
      default:
        iconName.set(PhosphorIcons.WifiSlash);
        break;
    }
  };

  network.wifi.connect("notify", updateIcon);
  updateIcon();

  return (
    <PhosphorIcon
      iconName={bind(iconName)}
      size={20}
      cssName="indicator-icon"
    />
  );
};

export const NetworkIndicator = () => {
  const isPrimary = Variable(network.primary);

  network.connect("notify::primary", () => {
    isPrimary.set(network.primary);
  });

  return (
    <box>
      {bind(isPrimary).as((primary) => {
        if (primary === Network.Primary.WIFI) {
          return <NetworkWifiIndicator />;
        } else if (primary === Network.Primary.WIRED) {
          return <NetworkWiredIndicator />;
        } else {
          return <SimpleNetworkIndicator />;
        }
      })}
    </box>
  );
};
