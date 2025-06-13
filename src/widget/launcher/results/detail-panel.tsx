import { Widget, Gtk } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import { ItemDetails } from "../components/unified-results";
import { RoundedImageReactive } from "../../utils/rounded-image";

export interface DetailPanelProps extends Widget.BoxProps {
  monitorIndex: number;
  focusedItem: Binding<ItemDetails<any> | null>;
}

export default function DetailPanel(props: DetailPanelProps) {

  return (
    <box
      cssClasses={["launcher-detail-panel"]}
      widthRequest={600}
      visible={bind(props.focusedItem).as(item => item !== null)}
    >
      {bind(props.focusedItem).as(item => {
        if (!item) return <box />;

        // Check if it's a Hyprland window with screenshot
        if (item.type === 'hyprland' && item.options.window && item.options.screenshotPath) {
          const window = item.options.window;
          return (
            <box
              vertical
              cssClasses={["detail-panel-content"]}
              halign={Gtk.Align.CENTER}
              valign={Gtk.Align.CENTER}
              spacing={24}
            >
              {/* Large screenshot preview */}
              <box cssClasses={["detail-screenshot-frame"]}>
                <RoundedImageReactive
                  file={Variable(item.options.screenshotPath)()}
                  size={480}
                  radius={16}
                  cssClasses={["detail-screenshot-preview"]}
                />
              </box>

              {/* Window information */}
              <box vertical spacing={12} cssClasses={["detail-window-info"]}>
                <label
                  label={window.title || window.class}
                  cssClasses={["detail-window-title"]}
                  ellipsize={3}
                />
                <box spacing={16} halign={Gtk.Align.CENTER}>
                  <box spacing={8}>
                    <label label="Class:" cssClasses={["detail-label"]} />
                    <label label={window.class} cssClasses={["detail-value"]} />
                  </box>
                  <box spacing={8}>
                    <label label="Workspace:" cssClasses={["detail-label"]} />
                    <label
                      label={window.workspace.name || `${window.workspace.id}`}
                      cssClasses={["detail-value"]}
                    />
                  </box>
                </box>
                {window.floating && (
                  <label
                    label="Floating Window"
                    cssClasses={["detail-badge", "floating"]}
                  />
                )}
                {window.fullscreen && (
                  <label
                    label="Fullscreen"
                    cssClasses={["detail-badge", "fullscreen"]}
                  />
                )}
              </box>
            </box>
          );
        }

        // For other types, return empty box for now
        return <box />;
      })}
    </box>
  );
}
