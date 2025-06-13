import { Gtk, } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import { RoundedImageReactive } from "../../utils/rounded-image";
import { DetailPanelProps } from "./detail-panel";
import DetailPanel from "./detail-panel";
import { ItemDetails, HyprlandItemOptions } from "./unified-results";


export interface HyprlandDetailPanelProps extends DetailPanelProps {
  item: Binding<ItemDetails<HyprlandItemOptions> | null>;
}

export default function HyperlandDetailPanel(props: HyprlandDetailPanelProps) {
  if (!props.item.get()) return <box />;
  const item = props.item.get();
  if (item == null) return <box />;
  if (item.options == undefined) return <box />;
  if (item.options.window == null) return <box />;
  const window = item.options.window;

  const screenshotPath = Variable<string | null>(null);
  screenshotPath.set(item.options.screenshotPath);

  return (

    <DetailPanel
      {...props}
    >
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
            file={bind(screenshotPath)}
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
    </DetailPanel>
  );
}
