// import { Widget, Gtk, Astal } from "astal/gtk4";
// import { BrightnessIndicator } from "./indicators/brightness";
// import { KBBacklightBrightnessIndicator } from "./indicators/kb-backlight-brightness";
// import { VolumeIndicator } from "./indicators/volume";
// import Indicators from "./indicators/index";
// import PopupNotifications from "./popup-notifications";
// import { createLogger } from "../../utils/logger";
// // import { Notifications } from "./notifications";
// // import { ColorSchemeSwitcher } from "./scheme-switcher";
//
// const log = createLogger("Overlays");
//
// export interface SystemOverlayProps extends Widget.WindowProps { }
//
// export const SystemOverlays = (props: SystemOverlayProps) => {
//   log.debug("Creating system overlays", { monitor: props.monitor });
//
//   return (
//     <window
//       {...props}
//       name={`system-overlays-${props.monitor}`}
//       gdkmonitor={props.gdkmonitor}
//       layer={Astal.Layer.OVERLAY}
//       cssName="system-overlays"
//       visible
//       anchor={Astal.WindowAnchor.TOP}
//     >
//       <box vertical>
//         <PopupNotifications />
//         <box >
//           <Indicators>
//             <BrightnessIndicator />
//             <KBBacklightBrightnessIndicator />
//             <VolumeIndicator />
//           </Indicators>
//
//           {/* <ColorSchemeSwitcher /> */}
//         </box>
//       </box>
//
//     </window>
//   );
// };
//
// export default SystemOverlays;
