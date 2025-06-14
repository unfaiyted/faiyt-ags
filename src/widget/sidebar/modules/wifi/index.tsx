import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind, execAsync } from "astal";
import Network from "gi://AstalNetwork";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";
import { c } from "../../../../utils/style";
import { sidebarLogger as log } from "../../../../utils/logger";
import { setupCursorHover } from "../../../utils/buttons";
import { actions } from "../../../../utils/actions";

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
  network.get_wifi()?.connect("notify", () => {
    log.debug("WiFi status changed", {
      ssid: network.wifi?.ssid,
      strength: network.wifi?.strength,
      enabled: network.wifi?.enabled
    });
    isConnected.set(network.get_wifi()?.ssid ? true : false);
    currentSSID.set(network.get_wifi()?.ssid || "Not connected");
    strength.set(network.get_wifi()?.strength || 0);
    isEnabled.set(network.get_wifi()?.enabled || false);
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
            canFocus={true}
            sensitive={true}
            onStateSet={(self, state) => {
              log.debug(`Toggle switch state changed: ${state}`);
              actions.network.setWifi(self.active);
              return false; // Return false to allow default behavior
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

// Password dialog component
const PasswordDialog = ({
  ssid,
  onConnect,
  onCancel
}: {
  ssid: string;
  onConnect: (password: string) => void;
  onCancel: () => void;
}) => {
  const password = Variable("");
  const showPassword = Variable(false);

  return (
    <box cssName="wifi-password-dialog" vertical spacing={12}>
      <box cssName="wifi-password-header" spacing={8}>
        <PhosphorIcon iconName={PhosphorIcons.WifiHigh} size={20} />
        <label label={`Connect to ${ssid}`} />
      </box>

      <box vertical spacing={8}>
        <label cssName="wifi-password-label" xalign={0} label="Enter password:" />
        <box spacing={8}>
          <entry
            cssName="wifi-password-entry"
            placeholder_text="Password"
            visibility={bind(showPassword)}
            text={bind(password)}
            hexpand
            onChanged={(self) => password.set(self.text)}
            onActivate={() => {
              if (password.get().length > 0) {
                onConnect(password.get());
              }
            }}
            setup={(self) => {
              setTimeout(() => self.grab_focus(), 100);
            }}
          />
          <button
            cssName="wifi-password-toggle"
            onClicked={() => showPassword.set(!showPassword.get())}
            tooltip_text={bind(showPassword).as(show => show ? "Hide password" : "Show password")}
          >
            <PhosphorIcon
              iconName={bind(showPassword).as(show =>
                show ? PhosphorIcons.Eye : PhosphorIcons.EyeSlash
              )}
              size={16}
            />
          </button>
        </box>
      </box>

      <box spacing={8} halign={Gtk.Align.END}>
        <button
          cssName="wifi-password-cancel"
          onClicked={onCancel}
        >
          <label label="Cancel" />
        </button>
        <button
          cssName="wifi-password-connect"
          onClicked={() => {
            const pwd = password.get();
            if (pwd.length > 0) {
              onConnect(pwd);
            }
          }}
          sensitive={bind(password).as(p => p.length > 0)}
        >
          <label label="Connect" />
        </button>
      </box>
    </box>
  );
};

// Individual WiFi network item
const WifiItem = ({ network: wifiNetwork }: { network: WifiNetwork }) => {
  const connecting = Variable(false);
  const showPasswordDialog = Variable(false);
  const connectionStatus = Variable<"idle" | "connecting" | "connected" | "failed">("idle");
  const statusMessage = Variable("");

  const checkIfPasswordRequired = async (ssid: string): Promise<boolean> => {
    try {
      // Check if we have a saved connection
      const output = await execAsync([
        "nmcli", "-t", "-f", "NAME", "connection", "show"
      ]);
      const savedConnections = output.split('\n').filter(name => name.trim());
      return !savedConnections.includes(ssid);
    } catch {
      return true; // Assume password is required if check fails
    }
  };

  const connectWithPassword = async (password: string) => {
    showPasswordDialog.set(false);
    connectionStatus.set("connecting");
    statusMessage.set("Authenticating...");

    try {
      await execAsync([
        "nmcli", "device", "wifi", "connect",
        wifiNetwork.ssid, "password", password
      ]);
      connectionStatus.set("connected");
      statusMessage.set("Connected successfully");

      // Reset status after a delay
      setTimeout(() => {
        connectionStatus.set("idle");
        statusMessage.set("");
      }, 3000);
    } catch (error) {
      log.error(`Failed to connect to ${wifiNetwork.ssid}`, { error });
      connectionStatus.set("failed");
      statusMessage.set("Connection failed");

      // Reset status after a delay
      setTimeout(() => {
        connectionStatus.set("idle");
        statusMessage.set("");
      }, 3000);
    }
    connecting.set(false);
  };

  const handleConnect = async () => {
    if (showPasswordDialog.get()) {
      showPasswordDialog.set(false);
      return;
    }

    connecting.set(true);
    connectionStatus.set("connecting");

    try {
      if (wifiNetwork.connected) {
        // Disconnect
        log.info("Disconnecting from WiFi", { ssid: wifiNetwork.ssid });
        statusMessage.set("Disconnecting...");
        await execAsync(["nmcli", "connection", "down", wifiNetwork.ssid]);
        connectionStatus.set("idle");
        statusMessage.set("");
      } else {
        // Connect
        log.info("Connecting to WiFi", {
          ssid: wifiNetwork.ssid,
          secure: wifiNetwork.secure
        });

        if (wifiNetwork.secure) {
          const needsPassword = await checkIfPasswordRequired(wifiNetwork.ssid);
          if (needsPassword) {
            showPasswordDialog.set(true);
            connecting.set(false);
            connectionStatus.set("idle");
            return;
          }
        }

        statusMessage.set("Connecting...");
        await execAsync(["nmcli", "device", "wifi", "connect", wifiNetwork.ssid]);
        connectionStatus.set("connected");
        statusMessage.set("Connected successfully");

        // Reset status after a delay
        setTimeout(() => {
          connectionStatus.set("idle");
          statusMessage.set("");
        }, 3000);
      }
    } catch (error) {
      log.error(`Failed to connect to ${wifiNetwork.ssid}`, { error });

      // Check if it's a password error
      const errorStr = error.toString();
      if (errorStr.includes("secrets were required") || errorStr.includes("no secrets provided")) {
        showPasswordDialog.set(true);
        connectionStatus.set("idle");
      } else {
        connectionStatus.set("failed");
        statusMessage.set("Connection failed");

        // Reset status after a delay
        setTimeout(() => {
          connectionStatus.set("idle");
          statusMessage.set("");
        }, 3000);
      }
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
    <box vertical spacing={0}>
      <button
        setup={setupCursorHover}
        cssName={"wifi-item"}
        cssClasses={c`wifi-item ${wifiNetwork.connected ? 'connected' : ''} ${bind(connectionStatus).as(s => s)}`}
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
            {bind(statusMessage).as(msg =>
              msg ? (
                <label cssName="wifi-item-status" xalign={0} label={msg} />
              ) : wifiNetwork.connected ? (
                <label cssName="wifi-item-status" xalign={0} label="Connected" />
              ) : <box />
            )}
          </box>
          <label cssName="wifi-strength" label={`${wifiNetwork.strength}%`} />
          {bind(connectionStatus).as(status => {
            switch (status) {
              case "connecting":
                return <Gtk.Spinner cssName="wifi-connecting" spinning={true} />;
              case "connected":
                return <PhosphorIcon iconName={PhosphorIcons.CheckCircle} size={20} cssClasses={["wifi-success"]} />;
              case "failed":
                return <PhosphorIcon iconName={PhosphorIcons.XCircle} size={20} cssClasses={["wifi-error"]} />;
              default:
                return <box />;
            }
          })}
        </box>
      </button>

      {bind(showPasswordDialog).as(show =>
        show ? (
          <PasswordDialog
            ssid={wifiNetwork.ssid}
            onConnect={connectWithPassword}
            onCancel={() => showPasswordDialog.set(false)}
          />
        ) : <box />
      )}
    </box>
  );
};

// WiFi list component
const WifiList = () => {
  const networks = Variable<WifiNetwork[]>([]);
  const scanning = Variable(false);
  const isWifiEnabled = Variable(network.wifi?.enabled || false);

  // Monitor WiFi enable/disable state
  network.get_wifi()?.connect("state-changed", () => {
    const enabled = actions.network.getWifiEnabled().get() || false;
    isWifiEnabled.set(enabled);
    // Clear the list when WiFi is disabled
    if (!enabled) {
      log.debug("WiFi disabled, clearing network list");
      networks.set([]);
    } else {
      // Scan networks when WiFi is enabled
      scanNetworks();
    }
  });

  const scanNetworks = async () => {
    // Don't scan if WiFi is disabled
    if (!isWifiEnabled.get()) {
      log.debug("WiFi is disabled, skipping network scan");
      networks.set([]);
      return;
    }

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

  // Initial scan only if WiFi is enabled
  if (network.wifi?.enabled) {
    log.debug("Performing initial WiFi scan");
    scanNetworks();
  }

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
          {bind(networks).as(nets => nets.length > 0 ? (
            nets.map(n => <WifiItem network={n} />)
          ) : <box />)
          }
          {bind(isWifiEnabled).as(enabled => {
            const networkCount = bind(networks).as(nets => nets.length);
            if (enabled && networkCount.get() == 0) {
              return (
                <box cssName="wifi-empty" vertical spacing={8}>
                  <PhosphorIcon iconName={PhosphorIcons.WifiX} size={48} />
                  <label label="No networks found" />
                </box>
              )
            } else if (!enabled) {
              return <box cssName="wifi-empty" vertical spacing={8}>
                <PhosphorIcon iconName={PhosphorIcons.WifiSlash} size={48} />
                <label label="WiFi is disabled" />
              </box>
            }
            return <box />
          }
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
