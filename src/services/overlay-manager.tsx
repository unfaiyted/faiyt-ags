// import { App, Widget, Astal, Gdk, Gtk } from "astal/gtk4";
// import { Binding } from "astal";
//
// // Function to create the overlay window
// function ClickOutsideOverlay({
//   name,
//   gdkmonitor,
//   onClickOutside,
// }: {
//   name: string;
//   gdkmonitor: Gdk.Monitor | Binding<Gdk.Monitor> | undefined;
//   onClickOutside: () => void;
// }) {
//   return (
//     <window
//       name={name}
//       gdkmonitor={gdkmonitor}
//       layer={Astal.Layer.TOP}
//       anchor={
//         Astal.WindowAnchor.TOP |
//         Astal.WindowAnchor.BOTTOM |
//         Astal.WindowAnchor.LEFT |
//         Astal.WindowAnchor.RIGHT
//       }
//       visible={true}
//       cssName="click-outside-overlay"
//       keymode={Astal.Keymode.ON_DEMAND}
//       exclusivity={Astal.Exclusivity.NORMAL}
//       setup={(self: Gtk.Window) => {
//         print(`ClickOutsideOverlay: Setting up ${name}`);
//       }}
//     >
//       <box
//         hexpand
//         vexpand
//         setup={(self: Gtk.Box) => {
//           // Add click gesture to the box
//           const clickGesture = new Gtk.GestureClick();
//           clickGesture.connect("pressed", () => {
//             print("OverlayManager: Click outside detected via gesture");
//             onClickOutside();
//           });
//           self.add_controller(clickGesture);
//         }}
//       />
//     </window>
//   );
// }
//
// class OverlayManager {
//   private overlays: Map<string, () => void> = new Map();
//
//   createClickOutsideOverlay(
//     targetWindowName: string,
//     gdkmonitor: Gdk.Monitor | Binding<Gdk.Monitor> | undefined,
//     onClickOutside: () => void
//   ): void {
//     const overlayName = `${targetWindowName}-click-overlay`;
//
//     print(`OverlayManager: Creating overlay ${overlayName}`);
//
//     // Remove existing overlay if any to prevent stacking
//     this.removeOverlay(overlayName);
//
//     // Create overlay immediately (no delay) so it's below the sidebar in z-order
//     // Create overlay window by calling the component function
//     // This properly registers it with the App
//     ClickOutsideOverlay({
//       name: overlayName,
//       gdkmonitor,
//       onClickOutside: () => {
//         print(`OverlayManager: Overlay clicked, removing and calling callback`);
//         // First remove the overlay
//         this.removeOverlay(overlayName);
//         // Then call the callback (which might close the sidebar)
//         onClickOutside();
//       },
//     });
//
//     // Store cleanup function
//     this.overlays.set(overlayName, () => {
//       const window = App.get_window(overlayName);
//       if (window) {
//         print(`OverlayManager: Destroying window ${overlayName}`);
//         window.destroy();
//       }
//     });
//
//     // Verify it was created
//     setTimeout(() => {
//       const overlayWindow = App.get_window(overlayName);
//       if (overlayWindow) {
//         print(`OverlayManager: Overlay ${overlayName} created successfully`);
//       } else {
//         print(`OverlayManager: ERROR - Overlay ${overlayName} not found`);
//       }
//     }, 50);
//   }
//
//   removeOverlay(overlayName: string): void {
//     print(`OverlayManager: Removing overlay ${overlayName}`);
//
//     const cleanupFn = this.overlays.get(overlayName);
//     if (cleanupFn) {
//       cleanupFn();
//     }
//
//     this.overlays.delete(overlayName);
//   }
//
//   removeAllOverlays(): void {
//     for (const [name, _] of this.overlays) {
//       this.removeOverlay(name);
//     }
//   }
// }
//
// // Export singleton instance
// export const overlayManager = new OverlayManager();
