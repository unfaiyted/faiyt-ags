# AGS Desktop Shell Configuration

A modern, feature-rich desktop shell configuration built with [AGS (Astal GTK Shell)](https://github.com/Aylur/ags) for Wayland environments. This configuration provides a complete desktop experience with a customizable bar, application launcher, sidebars, and system overlays.





| | |
|:---:|:---:|
| ![launcher features](docs/launcher-features.gif) | ![wallpaper manager](docs/wallpaper-manager.gif) |
| **launcher integrations** - features in launcher | **wallpaper manager** - manage wallpapers |
| ![sidebars](docs/sidebars.gif) | ![Launcher List Actions](docs/launcher-list-actions.png) |
| **Desktop Shell** - Clean desktop with wallpaper integration | **List Actions** - Quick launcher actions menu |
| ![launcher stickers](docs/launcher-stickers.png) | ![side panels](docs/side-panels.png) |
| **sticker integration** - signal stickers in launcher | **side panels** - system controls and utilities |






## Features

- 🎨 **Modern UI** - Clean, minimal design with smooth animations
- 🖥️ **Multi-monitor Support** - Automatic bar spawning on all monitors with visual configuration
- 🚀 **Advanced Launcher** - Application search, math evaluator, unit converter, clipboard history, and more
- 📊 **System Bar** - Workspaces, clock, battery, tray, media controls, weather, and utilities
- 🎛️ **Control Sidebars** - Quick access to system controls and notifications
- 🤖 **Multi-AI Integration** - Claude, GPT, Gemini, and Ollama support with model selection
- 🎯 **Hyprland Integration** - Deep integration with window/workspace management
- 📹 **Screen Recording** - Built-in recording with YouTube-quality presets
- 📸 **Window Manager** - Screenshot capture and window management
- 💬 **Signal Stickers** - Full Signal sticker pack integration
- 🎨 **Highly Customizable** - JSON configuration with hot reload, Tailwind CSS + SCSS

## Key Features & Components

### Dynamic Multi-Monitor Support
- Automatic bar spawning on all connected monitors
- Visual monitor configuration tool
- Per-monitor wallpaper management
- Monitor-specific settings in configuration

### Top Bar
- Workspace indicators with click/scroll navigation
- Window title display
- Clock with customizable format
- Battery status indicator
- System tray
- Media player controls with progress bar
- Network and Bluetooth status with quick controls
- Notification indicators with grouping
- Weather display with configurable location
- Quick utilities menu with system actions
- Recording indicator when screen recording is active

### Advanced Application Launcher

![Launcher Basic](docs/launcher-basic.png)
- Full-screen overlay with multiple evaluators:
  - **App Search** - Fuzzy matching for installed applications
  - **Math Evaluator** - Calculate expressions, unit conversions, percentages
  - **Unit Converter** - Length, weight, temperature, time, and more
  - **Color Converter** - Between HEX, RGB, HSL formats
  - **Base Converter** - Binary, octal, decimal, hexadecimal
  - **Date/Time Calculator** - Date math and formatting
  - **Constants** - Mathematical and physical constants
- **Additional Features**:
  - Directory search and navigation
  - Clipboard history management
  - Process killer
  - Screen capture tools
  - Hyprland window/workspace switching
  - External web search
  - Signal sticker search and integration
- Keyboard navigation with vim-like bindings
- Click-outside to dismiss
- List actions for quick access

### Sidebars
- Slide-out panels from screen edges
- **Right Sidebar** includes:
  - System information header
  - Quick toggles (Bluetooth, WiFi, Do Not Disturb)
  - Tabbed interface with:
    - **AI Chat** - Multi-provider support (Claude, GPT, Gemini, Ollama)
    - **Audio Controls** - Volume mixer and device selection
    - **Bluetooth Manager** - Device discovery and connection
    - **WiFi Manager** - Network scanning and connection
    - **Notification Center** - Grouped notifications with actions
    - **Calendar Widget** - Interactive calendar
  - System utilities and tools
- **Configurable** - Enable/disable via user config


### System Overlays & Windows
![Music overlay](docs/music.gif)

- **On-Screen Displays**:
  - Volume changes with visual feedback
  - Screen brightness adjustments
  - Keyboard backlight control
- **Popup Notifications** - Grouped by application
- **Settings Window** - GUI configuration interface
- **Monitor Setup** - Visual monitor arrangement tool
- **Context Menus** - Right-click menus throughout the shell
- **Keyboard Shortcuts** - Viewer for all keybindings
- **Window Manager** - Screenshot and window capture tools

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
- gtksourceview5
- NetworkManager (for network indicators)
- BlueZ (for Bluetooth support)
- PulseAudio or PipeWire (for audio controls)

# Optional dependencies
- AI API Keys:
  - Claude (Anthropic) - For Claude AI chat
  - OpenAI - For GPT models
  - Google - For Gemini models
  - Ollama - For local LLM support
- Nerd Fonts (for icons)
- ffmpeg (for screen recording)
- grim/slurp (for screenshots)
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
- `bun dev:watch` - Development with file watching (nodemon)
- `bun dev:debug` - Debug mode with GTK inspector
- `bun build:app` - Build for production
- `bun start` - Build and run the application
- `bun validate:types` - TypeScript type checking
- `bun test:logger` - Test logging functionality

### Project Structure

```
~/.config/ags/
├── src/
│   ├── app.ts                # Main entry point
│   ├── widget/               # UI components
│   │   ├── bar/              # Top bar modules
│   │   ├── launcher/         # Advanced launcher with evaluators
│   │   ├── sidebar/          # Sidebar panels
│   │   ├── overlays/         # System overlays (OSD, notifications)
│   │   ├── settings/         # Settings window components
│   │   ├── common/           # Shared UI components
│   │   └── context-menu/     # Context menu system
│   ├── services/             # Core services
│   │   ├── ai/               # Multi-provider AI integration
│   │   ├── signal-stickers/  # Signal sticker management
│   │   ├── logger/           # Advanced logging with source maps
│   │   └── window-manager/   # Window capture and management
│   ├── utils/                # Utility functions
│   ├── handlers/             # Command and AI handlers
│   └── scripts/              # Build and utility scripts
├── styles/                   # SCSS styles
├── user-config.json          # User configuration
└── logs/                     # Application logs
```

### Configuration

1. **User Configuration**
   - Edit `user-config.json` for all customization
   - Hot reload support - changes apply immediately
   - Configurable options:
     - AI providers and models
     - Time format and weather settings
     - Search features toggles
     - Battery warning thresholds
     - Animation durations
     - Theme selection
     - Launcher result limits
     - Sidebar enable/disable
     - Custom keybindings
     - Monitor-specific settings

2. **Environment Variables**
   ```bash
   # Logging configuration
   AGS_LOG_LEVEL=info      # error, warn, info, debug
   AGS_LOG_FORMAT=pretty   # json, simple, pretty
   AGS_LOG_FILE=true       # Enable file logging
   AGS_LOG_CONSOLE=true    # Enable console logging
   
   # API Keys (optional) - can be set via AI command in sidebar
   CLAUDE_API_KEY=your-api-key
   OPENAI_API_KEY=your-api-key
   GOOGLE_API_KEY=your-api-key
   # For Ollama, ensure server is running locally
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
   - Set the font in user-config.json

3. **Build errors**
   - Clear cache: `rm -rf dist/ node_modules/`
   - Reinstall dependencies: `bun install`
   - Check TypeScript errors: `bun validate:types`

4. **Performance issues**
   - Disable debug logging
   - Reduce animation durations in user-config.json
   - Check system resource usage

5. **AI Chat not working**
   - Ensure API keys are set in environment or via sidebar command
   - Check the selected model is valid for your provider
   - Verify network connectivity

6. **Screen recording issues**
   - Install ffmpeg for recording support
   - Check audio permissions for recording with sound
   - Ensure sufficient disk space for recordings

### Debug Mode

Enable debug mode for detailed logging:
```bash
AGS_LOG_LEVEL=debug bun dev:watch
```

### Source Map Support

The project includes automatic source map generation and reading for enhanced debugging. Error stack traces will show original TypeScript source locations instead of compiled JavaScript.

## Additional Features

### Signal Sticker Integration
- Browse and search Signal sticker packs
- Download and cache stickers locally
- Use stickers in launcher interface
- Automatic sticker pack discovery

### Advanced Window Management
- Window screenshot capture
- Window focus and switching
- Workspace management via launcher
- Kill process functionality

### Developer Features
- Comprehensive logging system with multiple outputs
- Source map support for debugging
- Hot reload for configuration changes
- TypeScript with full type checking
- Tailwind CSS with GTK4 compatibility patches

## Contributing

Contributions are welcome! Please ensure:
- Code follows existing patterns
- TypeScript types are properly defined
- Components are reactive and efficient
- Run `bun validate:types` before submitting

## Acknowledgments

- [Aylur's GTK Shell (AGS)](https://github.com/Aylur/ags) - The framework powering this configuration
- [Hyprland](https://hyprland.org/) - The Wayland compositor
- [Astal](https://github.com/Aylur/astal) - The reactive framework for AGS

## Special Thanks

- [end-4/dots-hyprland](https://github.com/end-4/dots-hyprland) - Inspiration for many UI components and design patterns.
- [signalstickers/stickers-client](https://github.com/signalstickers/stickers-client) - Reference implementation for Signal sticker integration logic

## License

This project is licensed under the MIT License - see the LICENSE file for details.

