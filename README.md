# AGS Desktop Shell Configuration

A modern, feature-rich desktop shell configuration built with [AGS (Astal GTK Shell)](https://github.com/Aylur/ags) for Wayland environments. This configuration provides a complete desktop experience with a customizable bar, application launcher, sidebars, and system overlays.



![Desktop Shell](docs/wallpaper-window-manager.png)

## Features

- 🎨 **Modern UI** - Clean, minimal design with smooth animations
- 🖥️ **Multi-monitor Support** - Automatic bar spawning on all monitors
- 🚀 **Application Launcher** - Fast fuzzy search for installed applications
- 📊 **System Bar** - Workspaces, clock, battery, tray, media controls, and more
- 🎛️ **Control Sidebars** - Quick access to system controls and notifications
- 🤖 **AI Integration** - Built-in Claude AI chat interface
- 🎯 **Hyprland Integration** - Deep integration with Hyprland window manager
- 🎨 **Customizable** - Tailwind CSS styling with SCSS support

## Components

### Top Bar
- Workspace indicators with click/scroll navigation
- Window title display
- Clock with customizable format
- Battery status indicator
- System tray
- Media player controls with progress bar
- Network, Bluetooth, and notification indicators
- Weather display
- Quick utilities menu

### Application Launcher
- Full-screen overlay with search
- Fuzzy matching for applications
- Keyboard navigation
- Click-outside to dismiss
- Signal sticker integration
- List actions for quick access

![Launcher Basic](docs/launcher-basic.png)
![Launcher List Actions](docs/launcher-list-actions.png)
![Launcher Stickers](docs/launcher-stickers.png)

### Sidebars
- Slide-out panels from screen edges
- **Right Sidebar** includes:
  - System information header
  - Quick toggles (Bluetooth, WiFi, Do Not Disturb)
  - Tabbed interface with:
    - AI Chat (Claude integration)
    - Audio controls
    - Bluetooth device management
    - WiFi network selector
    - Notification center
    - Calendar widget
  - Additional system tools

![Side Panels](docs/side-panels.png)

### System Overlays
- On-screen displays for:
  - Volume changes
  - Screen brightness
  - Keyboard backlight
- Popup notifications

## Requirements

### System Dependencies

```bash
# Core requirements
- Wayland compositor (Hyprland recommended)
- GTK4 (>= 4.0)
- GJS (GNOME JavaScript) (>= 1.77.2)
- Aylur's GTK Shell (AGS) with Astal framework

# Build dependencies
- Bun (>= 1.0) or npm/Node.js (>= 18)
- Vite
- TypeScript

# Runtime dependencies
- gtk4-layer-shell
- libgtk-4-1
- gjs
- NetworkManager (for network indicators)
- BlueZ (for Bluetooth support)
- PulseAudio or PipeWire (for audio controls)

# Optional dependencies
- Weather API key (for weather widget)
- Claude API key (for AI chat feature)
- Nerd Fonts (for icons)
```

### Installation

1. **Install AGS (Astal GTK Shell)**
   ```bash
   # Follow AGS installation guide at:
   # https://github.com/Aylur/ags
   ```

2. **Install system dependencies**
   ```bash
   # Arch Linux
   sudo pacman -S gtk4 gtk4-layer-shell gjs networkmanager bluez

   # Fedora
   sudo dnf install gtk4 gtk4-layer-shell gjs NetworkManager bluez

   # Ubuntu/Debian
   sudo apt install libgtk-4-1 gtk-layer-shell gjs network-manager bluez
   ```

3. **Install Bun** (recommended) or use npm
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

4. **Clone and setup**
   ```bash
   git clone <repository-url> ~/.config/ags
   cd ~/.config/ags
   bun install
   ```

5. **Build and run**
   ```bash
   bun build
   bun start
   ```

## Development

### Available Scripts

- `bun dev` - Start development mode with hot reload
- `bun dev:watch` - Development with file watching
- `bun dev:debug` - Debug mode with GTK inspector
- `bun build` - Build for production
- `bun start` - Build and run
- `bun validate:types` - TypeScript type checking

### Project Structure

```
~/.config/ags/
├── src/
│   ├── app.ts          # Main entry point
│   ├── widget/         # UI components
│   │   ├── bar/        # Top bar modules
│   │   ├── launcher/   # App launcher
│   │   ├── sidebar/    # Sidebar panels
│   │   └── overlays/   # System overlays
│   ├── services/       # Core services
│   ├── utils/          # Utility functions
│   └── handlers/       # Command handlers
├── styles/             # SCSS styles
├── user/               # User configuration
└── logs/               # Application logs
```

### Configuration

1. **User Options**
   - Edit `src/user-options.js` for customization
   - Configure colors, fonts, and behavior

2. **Environment Variables**
   ```bash
   # Logging configuration
   AGS_LOG_LEVEL=info      # error, warn, info, debug
   AGS_LOG_FORMAT=pretty   # json, simple, pretty
   AGS_LOG_FILE=true       # Enable file logging
   AGS_LOG_CONSOLE=true    # Enable console logging
   
   # API Keys (optional)
   CLAUDE_API_KEY=your-api-key
   WEATHER_API_KEY=your-api-key
   ```

3. **Styling**
   - Tailwind CSS classes in TSX components
   - SCSS files for complex styling
   - GTK4 CSS theming support

## Troubleshooting

### Common Issues

1. **Bar not appearing**
   - Ensure AGS is running: `ags --quit && ags`
   - Check logs: `~/.config/ags/logs/`
   - Verify Hyprland is running

2. **Missing icons**
   - Install a Nerd Font
   - Set the font in user options

3. **Build errors**
   - Clear cache: `rm -rf dist/ node_modules/`
   - Reinstall dependencies: `bun install`
   - Check TypeScript errors: `bun validate:types`

4. **Performance issues**
   - Disable debug logging
   - Reduce animation durations
   - Check system resource usage

### Debug Mode

Enable debug mode for detailed logging:
```bash
AGS_LOG_LEVEL=debug bun dev:debug
```

## Contributing

Contributions are welcome! Please ensure:
- Code follows existing patterns
- TypeScript types are properly defined
- Components are reactive and efficient

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Aylur's GTK Shell (AGS)](https://github.com/Aylur/ags) - The framework powering this configuration
- [Hyprland](https://hyprland.org/) - The Wayland compositor
- [Astal](https://github.com/Aylur/astal) - The reactive framework for AGS

## Special Thanks

- [end-4/dots-hyprland](https://github.com/end-4/dots-hyprland) - Inspiration for many UI components and design patterns.
- [signalstickers/stickers-client](https://github.com/signalstickers/stickers-client) - Reference implementation for Signal sticker integration logic
