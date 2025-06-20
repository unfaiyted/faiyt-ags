# External System Commands Used in AGS

This document lists all external system commands/binaries that are executed throughout the AGS codebase. These need to be installed for full functionality.

## Core Required Commands

### AGS & UI Framework
- `ags` - Astal GTK Shell (the main framework)
- `gjs` - GNOME JavaScript runtime
- `gtk4-launch` - GTK4 runtime

### System Services & Daemons
- `systemctl` - SystemD service manager
- `NetworkManager` - Network management daemon
- `bluetoothctl` - Bluetooth control utility

### Package Managers (at least one required)
- `bun` - JavaScript runtime and package manager (preferred)
- `npm` - Node.js package manager (fallback)

## Audio/Video Tools

### Audio Control
- `wpctl` - WirePlumber control (required)
- `pactl` - PulseAudio control (optional)
- `playerctl` - Media player control (optional)
- `amixer` - ALSA mixer (optional)

### Video/Screenshot Tools
- `grim` - Screenshot tool for Wayland
- `slurp` - Region selector for Wayland
- `wf-recorder` - Screen recorder for Wayland
- `ffmpeg` - Video/audio converter and encoder
- `ffprobe` - Media file analyzer
- `vainfo` - VAAPI hardware acceleration info (optional)
- `montage` - ImageMagick tool for combining images

## System Utilities

### Display & Window Management
- `hyprctl` - Hyprland window manager control
- `hyprlock` - Hyprland screen locker
- `hyprpicker` - Color picker for Hyprland
- `brightnessctl` - Display brightness control
- `nwg-look` - GTK theme switcher

### Clipboard & Notifications
- `wl-copy` - Wayland clipboard copy
- `wl-paste` - Wayland clipboard paste
- `cliphist` - Clipboard history manager
- `notify-send` - Send desktop notifications
- `dunst` - Notification daemon (optional)
- `swaync` - SwayNotificationCenter (optional)
- `mako` - Mako notification daemon (optional)

### Network & System
- `curl` - HTTP client for API calls
- `rfkill` - Radio frequency kill switch (Bluetooth/WiFi)
- `uptime` - System uptime information
- `bc` - Command-line calculator

### Process Management
- `pgrep` - Find process by name
- `pkill` - Kill process by name
- `kill` - Terminate process by PID
- `killall` - Kill processes by name

### Data Processing
- `jq` - JSON processor
- `socat` - Socket relay tool
- `sed` - Stream editor
- `cut` - Text cutting utility
- `awk` - Text processing
- `grep` - Text search (though ripgrep `rg` is preferred)
- `cat` - Concatenate files
- `head` - Display first lines
- `tail` - Display last lines

## X11 Compatibility (for non-Wayland systems)
- `xprop` - X window properties
- `xwininfo` - X window information
- `zenity` - GUI dialog boxes

## Shell & Core Utils
- `bash` - Bash shell (used extensively)
- `sh` - POSIX shell
- `env` - Environment variables
- `command` - Command lookup
- `which` - Command path finder

## Power Management
- `systemctl suspend` - Suspend system
- `systemctl reboot` - Reboot system
- `systemctl poweroff` - Shutdown system

## Development Tools
- `bunx` - Execute packages with Bun
- `tailwindcss` - CSS framework compiler (via bunx)

## Installation by Distribution

### Arch Linux / EndeavourOS
```bash
# Core
sudo pacman -S ags gtk4-layer-shell libnotify

# Audio/Video
sudo pacman -S wireplumber pipewire-pulse playerctl alsa-utils grim slurp wf-recorder ffmpeg imagemagick

# System utilities
sudo pacman -S brightnessctl wl-clipboard cliphist libnotify bc jq socat

# Optional
sudo pacman -S dunst mako sway-notification-center hyprpicker

# Development
sudo pacman -S bun
```

### Fedora / Fedora Asahi
```bash
# Core
sudo dnf install ags gtk4-layer-shell libnotify

# Audio/Video
sudo dnf install wireplumber pipewire-utils playerctl alsa-utils grim slurp wf-recorder ffmpeg ImageMagick

# System utilities
sudo dnf install brightnessctl wl-clipboard cliphist libnotify bc jq socat

# Development
# Install Bun from https://bun.sh
```

### Ubuntu / Debian
```bash
# Core dependencies may need to be built from source or use PPAs
# Audio/Video
sudo apt install wireplumber pipewire-pulse playerctl alsa-utils grim slurp ffmpeg imagemagick

# System utilities
sudo apt install brightnessctl wl-clipboard bc jq socat curl

# cliphist and wf-recorder may need to be built from source
```

## Notes

1. Some commands are optional and only needed for specific features
2. The `uptime` command is part of the `procps` or `procps-ng` package on most distributions
3. Basic commands like `cat`, `grep`, `sed`, etc. are usually part of `coreutils` or similar base packages
4. For Wayland-specific tools, ensure you're running a Wayland session
5. Some tools like `nwg-look` might need to be installed from AUR on Arch-based systems