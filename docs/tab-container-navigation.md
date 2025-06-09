# TabContainer Keyboard Navigation

The enhanced TabContainer component now supports configurable keyboard navigation, following the same patterns used in the launcher component.

## Default Navigation

By default, the TabContainer uses:
- **Ctrl+h**: Navigate to the previous tab
- **Ctrl+l**: Navigate to the next tab

## Custom Navigation Keys

You can customize the navigation keys by providing a `navigationKeys` prop:

```tsx
import { Gdk } from "astal/gtk4";
import TabContainer from "../utils/containers/tabs";

// Example: Use Ctrl+j/k for navigation
<TabContainer
  tabs={tabs}
  active={0}
  navigationKeys={{
    prevKey: Gdk.KEY_j,
    nextKey: Gdk.KEY_k,
    modifierMask: Gdk.ModifierType.CONTROL_MASK
  }}
/>

// Example: Use Alt+Left/Right arrows
<TabContainer
  tabs={tabs}
  active={0}
  navigationKeys={{
    prevKey: Gdk.KEY_Left,
    nextKey: Gdk.KEY_Right,
    modifierMask: Gdk.ModifierType.ALT_MASK
  }}
/>

// Example: Use no modifier (just h/l keys)
<TabContainer
  tabs={tabs}
  active={0}
  navigationKeys={{
    prevKey: Gdk.KEY_h,
    nextKey: Gdk.KEY_l,
    modifierMask: 0
  }}
/>
```

## Tab Change Callback

The component now also supports an `onTabChange` callback that fires whenever the active tab changes:

```tsx
<TabContainer
  tabs={tabs}
  active={0}
  onTabChange={(index) => {
    console.log(`Switched to tab ${index}`);
  }}
/>
```

## Implementation Details

The keyboard navigation implementation follows these patterns from the launcher:

1. **Event Controller**: Uses `Gtk.EventControllerKey` attached to the container widget
2. **Modifier Checking**: Properly checks modifier keys using bitwise operations with `Gdk.ModifierType`
3. **Event Handling**: Returns `true` when a key is handled to prevent propagation, `false` otherwise
4. **Circular Navigation**: Wraps around from last to first tab and vice versa

## Available Modifier Keys

Common modifier masks you can use:
- `Gdk.ModifierType.CONTROL_MASK`: Ctrl key
- `Gdk.ModifierType.ALT_MASK`: Alt key
- `Gdk.ModifierType.SHIFT_MASK`: Shift key
- `Gdk.ModifierType.SUPER_MASK`: Super/Windows key
- `0`: No modifier required

## Common Key Constants

Some useful Gdk key constants:
- `Gdk.KEY_h`, `Gdk.KEY_j`, `Gdk.KEY_k`, `Gdk.KEY_l`: Vim-style navigation
- `Gdk.KEY_Left`, `Gdk.KEY_Right`: Arrow keys
- `Gdk.KEY_Tab`: Tab key
- `Gdk.KEY_1` through `Gdk.KEY_9`: Number keys