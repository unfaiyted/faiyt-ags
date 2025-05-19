import { Widget, Gtk } from "astal/gtk4";
import { Variable } from "astal";
import Hypr from "gi://AstalHyprland";
import Astal from "gi://Astal";

export interface WindowTitleProps extends Widget.BoxProps { }

export default function WindowTitle() {
  // const { setup, child } = windowTitleProps;

  const hypr = Hypr.get_default();
  const client = new Variable(hypr.get_focused_client());
  const workspace = new Variable(hypr.get_focused_workspace());


  hypr.connect("event", (_source, event, _args) => {
    // print("Hyprland event:", event);
    if (event === "activewindow" || event === "activewindowv2") {
      client.set(hypr.get_focused_client());
    } else if (event === "workspace" || event === "workspacev2") {
      workspace.set(hypr.get_focused_workspace());
    }
  });


  {/* <scrollable */ }
  {/*   {...props} */ }
  {/*   hexpand={true} */ }
  {/*   vexpand={true} */ }
  {/*   hscroll={Gtk.PolicyType.AUTOMATIC} */ }
  {/*   vscroll={Gtk.PolicyType.NEVER} */ }
  {/*   setup={(self) => { */ }
  {/*     setup?.(self); */ }
  {/*   }} */ }
  {/* > */ }

  return (
    <box vertical={true}>
      <label
        xalign={0}
        maxWidthChars={1}
        cssName="txt-smaller bar-wintitle-topdesc txt"
        setup={(self) => {

          const labelVar = Variable.derive([client, workspace], (client, workspace) => {
            // Add null check for client or client.title
            if (!client || !client.title) {
              return `Workspace ${workspace.id}`;
            }
            return client.title.length === 0
              ? `Workspace ${workspace.id}`
              : client.title;
          });

          // Subscribe to the derived variable
          const unsubscribe = labelVar.subscribe(labelText => {
            self.label = labelText;
          });

          // Clean up when widget is destroyed
          self.connect('destroy', () => {
            unsubscribe();
            labelVar.drop(); // Drop the derived variable
          });
        }}
      ></label>
      <label
        xalign={0}

        maxWidthChars={1}
        cssName="txt-smallie bar-wintitle-txt"
        setup={(self) => {

          const labelVar = Variable.derive([client, workspace], (client, workspace) => {
            // Add null check for client or client.title
            if (!client || !client.title) {
              return `Workspace ${workspace.id}`;
            }
            return client.title.length === 0
              ? `Workspace ${workspace.id}`
              : client.title;
          });

          // Subscribe to the derived variable
          const unsubscribe = labelVar.subscribe(labelText => {
            self.label = labelText;
          });

          // Clean up when widget is destroyed
          self.connect('destroy', () => {
            unsubscribe();
            labelVar.drop(); // Drop the derived variable
          });
        }}
      ></label>
    </box>
  );
}
