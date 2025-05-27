import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind, execAsync } from "astal";
import Network from "gi://AstalNetwork";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";
import { c } from "../../../../utils/style";
import { sidebarLogger as log } from "../../../../utils/logger";
import { setupCursorHover } from "../../../utils/buttons";

const network = Network.get_default();

interface WifiNetwork {
  ssid: string;
  strength: number;
  secure: boolean;
  connected: boolean;
  bssid: string;
}

// WiFi status component
const WifiStatus = () => {
  const isConnected = Variable(network.wifi?.ssid ? true : false);
  const currentSSID = Variable(network.wifi?.ssid || "Not connected");
  const strength = Variable(network.wifi?.strength || 0);
  const isEnabled = Variable(network.wifi?.enabled || false);

  // Subscribe to changes
  network.wifi?.connect("notify", () => {
    log.debug("WiFi status changed", {
      ssid: network.wifi?.ssid,
      strength: network.wifi?.strength,
      enabled: network.wifi?.enabled
    });
    isConnected.set(network.wifi?.ssid ? true : false);
    currentSSID.set(network.wifi?.ssid || "Not connected");
    strength.set(network.wifi?.strength || 0);
    isEnabled.set(network.wifi?.enabled || false);
  });

  return (
    <box cssName="wifi-status" vertical>
      <box spacing={12}>
        <box cssName="wifi-icon-wrapper">
          <PhosphorIcon
            cssName="wifi-icon"
            iconName={bind(isConnected).as(c => c ? PhosphorIcons.WifiHigh : PhosphorIcons.WifiSlash)}
            size={24}
          />
        </box>
        <box vertical hexpand>
          <label cssName="wifi-status-title" xalign={0} label="Wi-Fi" />
          <label
            cssName="wifi-status-subtitle"
            xalign={0}
            label={bind(currentSSID)}
          />
        </box>
        <box
          cssName="wifi-switch"
        >
          <switch
            setup={setupCursorHover}
            active={bind(isEnabled)}
            onActivate={(self) => {
              if (self.active) {
                log.info("Enabling WiFi");
                self.set_css_classes(["wifi-active"]);
                execAsync(["nmcli", "radio", "wifi", "on"]);
              } else {
                log.info("Disabling WiFi");
                self.set_css_classes(["wifi-inactive"]);
                execAsync(["nmcli", "radio", "wifi", "off"]);
              }
            }}
          />
        </box>
      </box>
      {bind(isConnected).as(connected =>
        connected ? (
          <box cssName="wifi-info" spacing={8}>
            <PhosphorIcon iconName={PhosphorIcons.CellSignalHigh} size={14} />
            <label label={bind(strength).as(s => `${s}%`)} />
          </box>
        ) : <label />
      )}
    </box>
  );
};

// Individual WiFi network item
const WifiItem = ({ network: wifiNetwork }: { network: WifiNetwork }) => {
  const connecting = Variable(false);

  const handleConnect = async () => {
    connecting.set(true);
    try {
      if (wifiNetwork.connected) {
        // Disconnect
        log.info("Disconnecting from WiFi", { ssid: wifiNetwork.ssid });
        await execAsync(["nmcli", "connection", "down", wifiNetwork.ssid]);
      } else {
        // Connect
        log.info("Connecting to WiFi", {
          ssid: wifiNetwork.ssid,
          secure: wifiNetwork.secure
        });
        if (wifiNetwork.secure) {
          // For secure networks, we'll need to handle password input
          // For now, using nmcli which will prompt for password if needed
          await execAsync(["nmcli", "device", "wifi", "connect", wifiNetwork.ssid]);
        } else {
          await execAsync(["nmcli", "device", "wifi", "connect", wifiNetwork.ssid]);
        }
      }
    } catch (error) {
      log.error(`Failed to connect to ${wifiNetwork.ssid}`, { error });
    }
    connecting.set(false);
  };

  const getStrengthIcon = (strength: number) => {
    if (strength >= 80) return PhosphorIcons.WifiHigh;
    if (strength >= 60) return PhosphorIcons.WifiMedium;
    if (strength >= 40) return PhosphorIcons.WifiLow;
    return PhosphorIcons.WifiNone;
  };

  return (
    <button
      setup={setupCursorHover}
      cssName={"wifi-item"}
      cssClasses={c`wifi-item ${wifiNetwork.connected ? 'connected' : ''}`}
      onClicked={handleConnect}
    >
      <box spacing={12}>
        <box cssName="wifi-item-icon">
          <PhosphorIcon
            iconName={getStrengthIcon(wifiNetwork.strength)}
            size={20}
          />
          {wifiNetwork.secure && (
            <PhosphorIcon
              iconName={PhosphorIcons.Lock}
              size={12}
              cssClasses={["wifi-secure-icon"]}
            />
          )}
        </box>
        <box vertical hexpand>
          <label cssName="wifi-item-name" xalign={0} label={wifiNetwork.ssid} />
          {wifiNetwork.connected && (
            <label cssName="wifi-item-status" xalign={0} label="Connected" />
          )}
        </box>
        <label cssName="wifi-strength" label={`${wifiNetwork.strength}%`} />
        {bind(connecting).as(c =>
          c ? <Gtk.Spinner cssName="wifi-connecting" /> : <label />
        )}
      </box>
    </button>
  );
};

// WiFi list component
const WifiList = () => {
  const networks = Variable<WifiNetwork[]>([]);
  const scanning = Variable(false);

  const scanNetworks = async () => {
    scanning.set(true);
    log.debug("Starting WiFi network scan");
    try {
      // Trigger a scan
      await execAsync(["nmcli", "device", "wifi", "rescan"]);

      // Get list of networks
      const output = await execAsync([
        "nmcli", "-t", "-f",
        "SSID,SIGNAL,SECURITY,ACTIVE,BSSID",
        "device", "wifi", "list"
      ]);

      const networkList: WifiNetwork[] = output
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [ssid, signal, security, active, bssid] = line.split(':');
          return {
            ssid: ssid || "Hidden Network",
            strength: parseInt(signal) || 0,
            secure: security !== "--",
            connected: active === "yes",
            bssid: bssid || "",
          };
        })
        .filter(n => n.ssid !== "")
        .sort((a, b) => {
          // Sort by connected first, then by signal strength
          if (a.connected) return -1;
          if (b.connected) return 1;
          return b.strength - a.strength;
        });

      log.info("WiFi scan completed", { networkCount: networkList.length });
      networks.set(networkList);
    } catch (error) {
      log.error("Failed to scan networks", { error });
    }
    scanning.set(false);
  };

  // Initial scan
  log.debug("Performing initial WiFi scan");
  scanNetworks();

  return (
    <box vertical cssName="wifi-list">
      <box cssName="wifi-list-header" spacing={8}>
        <label label="Available Networks" hexpand />
        <button
          setup={setupCursorHover}
          cssName="wifi-refresh-btn"
          onClicked={scanNetworks}
          tooltip_text="Refresh network list"
        >
          <PhosphorIcon
            iconName={PhosphorIcons.ArrowClockwise}
            size={16}
            cssClasses={bind(scanning).as(s => s ? ["spinning"] : [""])}
          />
        </button>
      </box>
      <Gtk.ScrolledWindow
        cssName="wifi-list-scroll"
        vscrollbar_policy={Gtk.PolicyType.AUTOMATIC}
        hscrollbar_policy={Gtk.PolicyType.NEVER}
        heightRequest={300}
      >
        <box vertical spacing={4}>
          {bind(networks).as(nets =>
            nets.length > 0 ? (
              nets.map(n => <WifiItem network={n} />)
            ) : (
              <box cssName="wifi-empty" vertical spacing={8}>
                <PhosphorIcon iconName={PhosphorIcons.WifiX} size={48} />
                <label label="No networks found" />
              </box>
            )
          )}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  );
};

export default function WifiModule(props: Widget.BoxProps) {
  const { cssName, ...restProps } = props;

  log.debug("WifiModule created");

  return (
    <box cssName="wifi-module" vertical spacing={16} {...restProps}>
      <WifiStatus />
      <WifiList />
    </box>
  );
}
