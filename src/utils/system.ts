import { Widget, Gtk } from "astal/gtk4";
import { Variable } from "astal";
import { exec, execAsync } from "astal/process";
import GLib from "gi://GLib";
import { actions } from "./actions";

const distroID = actions.system.distroID();

export const isDebianDistro =
  distroID == "linuxmint" ||
  distroID == "ubuntu" ||
  distroID == "debian" ||
  distroID == "zorin" ||
  distroID == "popos" ||
  distroID == "raspbian" ||
  distroID == "kali";

export const isArchDistro =
  distroID == "arch" || distroID == "endeavouros" || distroID == "cachyos";

export const hasFlatpak = actions.system.has("flatpak");

// const LIGHTDARK_FILE_LOCATION = `${GLib.get_user_state_dir()}/ags/user/colormode.txt`;
//
// export const darkMode = new Variable(
//   !(readFile(LIGHTDARK_FILE_LOCATION).split("\n")[0].trim() == "light"),
// );

// darkMode.connect("changed", ({ value }) => {
//   let lightdark = value ? "dark" : "light";
//   execAsync([
//     `bash`,
//     `-c`,
//     `mkdir -p ${GLib.get_user_state_dir()}/ags/user && sed -i "1s/.*/${lightdark}/"  ${GLib.get_user_state_dir()}/ags/user/colormode.txt`,
//   ])
//     .then(
//       execAsync([
//         "bash",
//         "-c",
//         `${App.configDir}/scripts/color_generation/switchcolor.sh`,
//       ]),
//     )
//     .then(
//       execAsync([
//         "bash",
//         "-c",
//         `command -v darkman && darkman set ${lightdark}`,
//       ]),
//     ) // Optional darkman integration
//     .catch(print);
// });
// globalThis["darkMode"] = darkMode;

// export const hasPlasmaIntegration = actions.system.has(
//   "plasma-browser-integration-host",
// );

export const getDistroIcon = () => {
  // Arches
  if (distroID == "arch") return "arch-symbolic";
  if (distroID == "endeavouros") return "endeavouros-symbolic";
  if (distroID == "cachyos") return "cachyos-symbolic";
  // Funny flake
  if (distroID == "nixos") return "nixos-symbolic";
  // Cool thing
  if (distroID == "fedora") return "fedora-symbolic";
  if (distroID == "fedora-asahi-remix") return "fedora-symbolic";
  // Debians
  if (distroID == "linuxmint") return "ubuntu-symbolic";
  if (distroID == "ubuntu") return "ubuntu-symbolic";
  if (distroID == "debian") return "debian-symbolic";
  if (distroID == "zorin") return "ubuntu-symbolic";
  if (distroID == "popos") return "ubuntu-symbolic";
  if (distroID == "raspbian") return "debian-symbolic";
  if (distroID == "kali") return "debian-symbolic";

  return "linux-symbolic";
};

export const getDistroName = () => {
  // Arches
  if (distroID == "arch") return "Arch Linux";
  if (distroID == "endeavouros") return "EndeavourOS";
  if (distroID == "cachyos") return "CachyOS";
  // Funny flake
  if (distroID == "nixos") return "NixOS";
  // Cool thing
  if (distroID == "fedora") return "Fedora";
  if (distroID == "fedora-asahi-remix") return "Fedora Asahi";
  // Debians
  if (distroID == "linuxmint") return "Linux Mint";
  if (distroID == "ubuntu") return "Ubuntu";
  if (distroID == "debian") return "Debian";
  if (distroID == "zorin") return "Zorin";
  if (distroID == "popos") return "Pop!_OS";
  if (distroID == "raspbian") return "Raspbian";
  if (distroID == "kali") return "Kali Linux";
  return "Linux";
};

export const getUptime = async () => {
  try {
    await execAsync(["bash", "-c", "uptime -p"]);
    return execAsync([
      "bash",
      "-c",
      `uptime -p | sed -e 's/...//;s/ day\\| days/d/;s/ hour\\| hours/h/;s/ minute\\| minutes/m/;s/,[^,]*//2'`,
    ]);
  } catch {
    return execAsync(["bash", "-c", "uptime"]).then((output) => {
      const uptimeRegex = /up\s+((\d+)\s+days?,\s+)?((\d+):(\d+)),/;
      const matches = uptimeRegex.exec(output);

      if (matches) {
        const days = matches[2] ? parseInt(matches[2]) : 0;
        const hours = matches[4] ? parseInt(matches[4]) : 0;
        const minutes = matches[5] ? parseInt(matches[5]) : 0;

        let formattedUptime = "";

        if (days > 0) {
          formattedUptime += `${days} d `;
        }
        if (hours > 0) {
          formattedUptime += `${hours} h `;
        }
        formattedUptime += `${minutes} m`;

        return formattedUptime;
      } else {
        throw new Error("Failed to parse uptime output");
      }
    });
  }
};
