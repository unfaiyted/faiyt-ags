// const UtilButton = ({ name, icon, onClicked }) =>
//   Button({
//     vpack: "center",
//     tooltipText: name,
//     onClicked: onClicked,
//     className: "bar-util-btn icon-material txt-norm",
//     label: `${icon}`,
//   });

// const Utilities = () =>
//   Box({
//     hpack: "center",
//     className: "spacing-h-4",
//     children: [
//       UtilButton({
//         name: getString("Screen snip"),
//         icon: "screenshot_region",
//         onClicked: () => {
//           Utils.execAsync(
//             `${App.configDir}/scripts/grimblast.sh copy area`,
//           ).catch(print);
//         },
//       }),
//       UtilButton({
//         name: getString("Color picker"),
//         icon: "colorize",
//         onClicked: () => {
//           Utils.execAsync(["hyprpicker", "-a"]).catch(print);
//         },
//       }),
//       UtilButton({
//         name: getString("Toggle on-screen keyboard"),
//         icon: "keyboard",
//         onClicked: () => {
//           toggleWindowOnAllMonitors("osk");
//         },
//       }),
//     ],
//   });
