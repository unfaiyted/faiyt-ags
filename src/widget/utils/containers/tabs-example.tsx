import { Gtk, Gdk } from "astal/gtk4";
import TabContainer, { TabContent, TabNavigationKeys } from "./tabs";
import { PhosphorIcons } from "../icons/types";

// Example usage of the enhanced TabContainer with keyboard navigation

export function TabContainerExample() {
  const tabs: TabContent[] = [
    {
      name: "General",
      icon: "gear" as PhosphorIcons,
      content: () => (
        <box vertical spacing={12}>
          <label label="General Settings" />
          <label label="Press Ctrl+h to go to previous tab" />
          <label label="Press Ctrl+l to go to next tab" />
        </box>
      )
    },
    {
      name: "Appearance",
      icon: "palette" as PhosphorIcons,
      content: () => (
        <box vertical spacing={12}>
          <label label="Appearance Settings" />
          <label label="You can customize the navigation keys" />
        </box>
      )
    },
    {
      name: "Advanced",
      icon: "sliders" as PhosphorIcons,
      content: () => (
        <box vertical spacing={12}>
          <label label="Advanced Settings" />
          <label label="Navigation wraps around at the ends" />
        </box>
      )
    }
  ];

  // Example with default navigation (Ctrl+h/l)
  const defaultExample = (
    <TabContainer
      tabs={tabs}
      active={0}
      onTabChange={(index) => {
        console.log(`Tab changed to: ${index}`);
      }}
    />
  );

  // Example with vim-style navigation (Ctrl+j/k)
  const vimStyleExample = (
    <TabContainer
      tabs={tabs}
      active={0}
      navigationKeys={{
        prevKey: Gdk.KEY_k,
        nextKey: Gdk.KEY_j,
        modifierMask: Gdk.ModifierType.CONTROL_MASK
      }}
    />
  );

  // Example with arrow key navigation (Alt+Left/Right)
  const arrowKeyExample = (
    <TabContainer
      tabs={tabs}
      active={0}
      navigationKeys={{
        prevKey: Gdk.KEY_Left,
        nextKey: Gdk.KEY_Right,
        modifierMask: Gdk.ModifierType.ALT_MASK
      }}
    />
  );

  // Example with no modifier required (just h/l keys)
  const noModifierExample = (
    <TabContainer
      tabs={tabs}
      active={0}
      navigationKeys={{
        prevKey: Gdk.KEY_h,
        nextKey: Gdk.KEY_l,
        modifierMask: 0
      }}
    />
  );

  return defaultExample;
}