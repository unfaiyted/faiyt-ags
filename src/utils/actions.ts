import { exec, execAsync } from "astal/process";
import config from "./config";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import { Variable } from "astal";

const network = Network.get_default();
const bluetooth = Bluetooth.get_default();

const wifiState = Variable(network.get_wifi()?.get_enabled() ?? false);
const bluetoothState = Variable(bluetooth.isPowered);

const wp = Wp.get_default();

const audio = wp ? wp.audio : undefined;

export const actions = {
  ui: {
    // reload: () =>
    // execAsync(["bash", "-c", "hyprctl reload || swaymsg reload &"]),
    reloadAgs: () => {
      // execAsync(["bash", "-c", "ags-reload-ui || ags-reload-ui &"]);
    },
  },
  music: {
    toggle: () => execAsync("playerctl play-pause").catch(print),
    next: () =>
      execAsync([
        "bash",
        "-c",
        'playerctl next || playerctl position `bc <<< "100 * $(playerctl metadata mpris:length) / 1000000 / 100"` &',
      ]).catch(print),
    prev: () => execAsync(["playerctl previous"]).catch(print),
    pause: () => execAsync("playerctl pause").catch(print),
    play: () => execAsync("playerctl play").catch(print),
  },
  network: {
    toggleWifi: () => {
      network.get_wifi()?.set_enabled(!network.get_wifi()?.get_enabled()),
        wifiState.set(!wifiState.get());
    },
    enableWifi: () => {
      network.get_wifi()?.set_enabled(true),
        wifiState.set(true);
    },
    disableWifi: () => {
      network.get_wifi()?.set_enabled(false),
        wifiState.set(false);
    },
    setWifi: (enabled: boolean) => {
      network.get_wifi()?.set_enabled(enabled);
      wifiState.set(enabled);
    },
    // I cant trust the wifi util state...
    getWifiEnabled: () => wifiState,
    ipInfo: () => execAsync("curl ipinfo.io"), // returns JSON with ip info and location
    ipCityInfo: () =>
      execAsync("curl ipinfo.io").then((output) =>
        JSON.parse(output)["city"].toLowerCase(),
      ),
  },
  bluetooth: {
    toggle: () => {
      bluetoothState.set(!bluetoothState.get());
      if (bluetoothState.get()) {
        execAsync("rfkill unblock bluetooth").catch(print)
      } else {
        execAsync("rfkill block bluetooth").catch(print)
      }
    },
    disable: () => {
      execAsync("rfkill block bluetooth").catch(print)
      bluetoothState.set(false);
    },
    enable: () => {
      execAsync("rfkill unblock bluetooth").catch(print)
      bluetoothState.set(true);
    },
    getBluetoothEnabled: () => bluetoothState,
  },
  brightness: {
    // TODO: implement brightness control
    increase: () => execAsync("brightnessctl set +5%").catch(print),
    decrease: () => execAsync("brightnessctl set -5%").catch(print),
  },
  keyboard: {
    backlight: {
      // TODO:
      // increase: () => execAsync("light -A 5").catch(print),
      // decrease: () => execAsync("light -U 5").catch(print),
    },
  },
  system: {
    reload: () =>
      execAsync(["bash", "-c", "hyprctl reload || swaymsg reload &"]),
    has: (command: string) => !!exec(`bash -c 'command -v ${command}'`),
    distroID: () =>
      exec(
        `bash -c 'cat /etc/os-release | grep "^ID=" | cut -d "=" -f 2 | sed "s/\\"//g"'`,
      ).trim(),
    idleInhibitor: {
      // TODO: Look into why this doesn't work acording to the old docs
      // start: execAsync(['bash', '-c', `pidof wayland-idle-inhibitor.py || ${App.configDir}/scripts/wayland-idle-inhibitor.py`]).catch(print)
      // stop: execAsync('pkill -f wayland-idle-inhibitor.py').catch(print);
      start: () => execAsync("hyprctl idle inhibit"),
      stop: () => execAsync("hyprctl idle uninhibit"),
    },
  },
  audio: {
    increase: () => {
      if (!audio || !audio.default_speaker) return;
      if (audio.default_speaker.volume <= 0.09)
        audio.default_speaker.volume += 0.01;
      else audio.default_speaker.volume += 0.03;
      // Indicator.popup(1);
    },
    decrease: () => {
      if (!audio || !audio.default_speaker) return;
      if (audio.default_speaker.volume <= 0.09)
        audio.default_speaker.volume -= 0.01;
      else audio.default_speaker.volume -= 0.03;
      // Indicator.popup(-1);
    },
  },
  weather: {
    update: (city: string) => {
      return execAsync(
        `curl https://wttr.in/${city.replace(/ /g, "%20")}?format=j1`,
      );
    },
  },
  window: {
    toggle: (windowName: string) => {
      execAsync([
        "bash",
        "-c",
        `ags request "window toggle ${windowName}"`,
      ]).catch(print);
    },
    open: (windowName: string) => {
      execAsync([
        "bash",
        "-c",
        `ags request "window open ${windowName}"`,
      ]).catch(print);
    },
    close: (windowName: string) => {
      execAsync([
        "bash",
        "-c",
        `ags request "window close ${windowName}"`,
      ]).catch(print);
    },
  },
  app: {
    bluetooth: () =>
      execAsync(["bash", "-c", `${config.apps.bluetooth}`]).catch(print),
    settings: () => execAsync(["bash", "-c", `${config.apps.settings}`, "&"]),
    wifi: () =>
      execAsync(["bash", "-c", `${config.apps.network}`]).catch(print),
    screenSnip: () => {
      execAsync(`${config.dir.scripts}/screen-capture.sh screenshot selection`);
      // TODO: can we have a notification here? Showing or at least saying that it was copied to clipboard?
    },
    colorPicker: () => {
      execAsync(["bash", "-c", `hyprpicker -a`]);
    },
    record: {
      toggle: () => {
        // Check if recording is active
        const isRecording = actions.app.record.isActive();

        if (isRecording) {
          execAsync(`${config.dir.scripts}/screen-capture.sh record stop`);
        } else {
          execAsync(`${config.dir.scripts}/screen-capture.sh record selection`);
        }
      },
      start: (target: string = "selection") => {
        execAsync(`${config.dir.scripts}/screen-capture.sh record ${target}`);
      },
      stop: () => {
        execAsync(`${config.dir.scripts}/screen-capture.sh record stop`);
      },
      isActive: () => {
        try {
          // Run the status command and check the output
          const result = exec(`${config.dir.scripts}/screen-capture.sh status`);
          // The last line will be the exit code
          const lines = result.trim().split("\n");
          const exitCode = lines[lines.length - 1];
          return exitCode === "true";
        } catch (e) {
          print("Error checking recording status", e);
          // If exec throws, recording is not active
          return false;
        }
      },
    },
  },
};
export default actions;
