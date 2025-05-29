# Context Menu Usage

This document explains how to use the dynamic context menu system with proper click positioning.

## Basic Usage

### Method 1: Using `handleContextMenu` for Right-Click

```tsx
import { handleContextMenu, ContextMenuItem } from "../utils/context-menu";

const MyWidget = () => {
  const menuItems: ContextMenuItem[] = [
    {
      label: "Copy",
      icon: "copy",
      action: () => console.log("Copy clicked"),
    },
    {
      label: "Paste",
      icon: "clipboard-text",
      action: () => console.log("Paste clicked"),
    },
    {
      separator: true,
    },
    {
      label: "Delete",
      icon: "trash",
      action: () => console.log("Delete clicked"),
      danger: true,
    },
  ];

  return (
    <box
      setup={(self) => {
        // Adds right-click context menu with automatic positioning
        handleContextMenu(self, menuItems);
      }}
    >
      <label label="Right-click me!" />
    </box>
  );
};
```

### Method 2: Using `withContextMenu` Helper

```tsx
import { withContextMenu } from "../utils/context-menu";

const MyButton = () => {
  const menuItems = [
    { label: "Option 1", action: () => {} },
    { label: "Option 2", action: () => {} },
  ];

  return (
    <button {...withContextMenu(
      {
        cssName: "my-button",
        onClicked: () => console.log("Normal click"),
      },
      menuItems
    )}>
      <label label="Right-click for menu" />
    </button>
  );
};
```

### Method 3: Custom Click Handling (Left-Click Menu)

```tsx
const PowerButton = () => {
  return (
    <button
      setup={(self) => {
        const clickGesture = new Gtk.GestureClick();
        clickGesture.set_button(1); // Left click
        
        clickGesture.connect("pressed", (_gesture, _n_press, x, y) => {
          // Calculate absolute position
          const allocation = self.get_allocation();
          const native = self.get_native();
          if (!native) return;
          
          let absoluteX = x;
          let absoluteY = y + allocation.height + 5; // Below button
          
          // Walk up widget tree
          let currentWidget: Gtk.Widget | null = self;
          while (currentWidget && currentWidget !== native) {
            const alloc = currentWidget.get_allocation();
            absoluteX += alloc.x;
            absoluteY += alloc.y;
            currentWidget = currentWidget.get_parent();
          }
          
          // Add window margins if layer shell
          if (native instanceof Gtk.Window) {
            absoluteX += native.get_property("margin_left") || 0;
            absoluteY += native.get_property("margin_top") || 0;
          }
          
          // Show menu at calculated position
          const menu = createContextMenu(
            `menu-${Date.now()}`,
            monitor,
            { x: absoluteX, y: absoluteY },
            menuItems
          );
          menu.show();
        });
        
        self.add_controller(clickGesture);
      }}
    >
      <label label="Click me!" />
    </button>
  );
};
```

## Key Features

1. **Automatic Positioning**: The context menu automatically calculates the absolute screen position based on the click location.

2. **Screen Boundary Detection**: The menu adjusts its position to stay within screen bounds.

3. **Multi-Monitor Support**: Menus appear on the correct monitor.

4. **Widget Tree Traversal**: Properly calculates position even for deeply nested widgets.

5. **Layer Shell Support**: Accounts for window margins in layer shell windows.

## Position Calculation Details

The system calculates absolute screen coordinates by:

1. Getting the click coordinates relative to the widget
2. Walking up the widget tree, adding each parent's allocation offsets
3. Adding window-level margins (for layer shell windows)
4. Adjusting position to keep menu on screen

This ensures the context menu appears exactly where the user clicks, regardless of widget nesting or window positioning.