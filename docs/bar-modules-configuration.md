# Bar Modules Configuration

## Overview

The AGS bar supports modular components that can be configured to show or hide based on your system and preferences. The battery module automatically detects if your system has a battery and hides itself on desktop systems.

## Available Modules

- `windowTitle` - Shows the current window title
- `system` - System resource indicators
- `music` - Music player controls
- `workspaces` - Workspace switcher
- `clock` - Time and date display
- `tray` - System tray icons
- `battery` - Battery status (auto-hides on desktops)
- `utilities` - Utility buttons
- `weather` - Weather information
- `statusIndicators` - Status indicators (network, bluetooth, etc)

## Configuration

Bar modules can be configured in your `user-config.json` file located at `~/.config/ags/user-config.json`.

### Example Configuration

```json
{
  "bar": {
    "modules": {
      "left": ["windowTitle"],
      "center": {
        "left": ["system", "music"],
        "middle": ["workspaces"],
        "right": ["utilities"]
      },
      "right": ["battery", "clock", "weather", "statusIndicators", "tray"]
    }
  }
}
```

### Removing Modules

To remove a module, simply exclude it from the arrays. For example, to remove the weather module:

```json
{
  "bar": {
    "modules": {
      "right": ["battery", "clock", "statusIndicators", "tray"]
    }
  }
}
```

### Battery Module Auto-Detection

The battery module automatically detects if your system has a battery:
- On laptops: Shows battery percentage, charging status, and time remaining
- On desktops: Automatically hidden

The detection checks:
1. AstalBattery module for battery presence
2. `/sys/class/power_supply/` for battery devices
3. Hides if only AC adapter is detected or battery shows 0%

## Module Names

When configuring modules, use these exact names (case-insensitive):
- `windowTitle`
- `system`
- `music`
- `workspaces`
- `clock`
- `tray`
- `battery`
- `utilities`
- `weather`
- `statusIndicators`

## Applying Changes

After modifying your `user-config.json`, restart AGS for the changes to take effect:

```bash
ags quit && ags run
```