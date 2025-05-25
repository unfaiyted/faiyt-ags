# AGS Launcher Feature Roadmap

## 🎯 MVP Features (Core Launch Functionality)

### **Basic Launcher**
- **Application Search & Launch**: Fast fuzzy search through installed applications
- **Keyboard-first Interface**: Default to keyboard shortcuts (Super+Space or similar)
- **Incremental Search**: Real-time filtering as you type
- **Beautiful UI**: Modern, clean design with smooth animations
- **Fast Performance**: Sub-100ms response times

### **File Operations**
- **File Search**: Quick access to files and folders (~ and / shortcuts)
- **Recent Files**: Show recently opened documents
- **File Actions**: Open, reveal in file manager, copy path

### **System Integration**
- **Calculator**: Built-in calculator with expression evaluation
- **Clipboard History**: Access recent clipboard items
- **Window Management**: Switch between open windows
- **System Commands**: Lock, logout, shutdown, restart

## 🚀 Phase 2 Features (Enhanced Productivity)

### **Productivity Tools**
- **Snippets**: Text expansion and code snippets
- **Quicklinks**: Bookmarks for frequently used URLs/resources
- **Notes**: Quick note-taking with markdown support
- **Emoji Picker**: Fast emoji search and insertion

### **Developer Tools**
- **Git Integration**: Quick git commands, repo status
- **Process Management**: Kill processes, view system resources
- **Color Picker**: System-wide color picker tool
- **Hash Generator**: MD5, SHA256, etc.

### **Hyprland Integration**
- **Workspace Management**: Switch and manage workspaces
- **Window Rules**: Quick application of window rules
- **Layout Switching**: Toggle between different layouts
- **Screenshot Tools**: Region, window, fullscreen capture

## 🌟 Phase 3 Features (Advanced & AI)

### **AI Integration**
- **Local AI Chat**: Integration with local LLMs (Ollama)
- **AI Commands**: Custom AI-powered automations
- **Smart Search**: AI-enhanced search across files and web

### **External Integrations**
- **Spotify/Music Control**: Search and control media playback
- **GitHub Integration**: Search repos, issues, PRs
- **Calendar Integration**: Quick event creation and viewing
- **Password Manager**: 1Password/Bitwarden integration

### **Advanced Features**
- **Plugin System**: Extensible architecture for custom commands
- **Web Search**: Quick web searches from launcher
- **Unit Converter**: Length, weight, currency, etc.
- **Weather**: Current conditions and forecast

## 🎨 Design & UX Priorities

### **Visual Design**
- **Modern Aesthetic**: Follow current design trends (glassmorphism, subtle shadows)
- **Dark/Light Theme**: Adaptive themes with system integration
- **Smooth Animations**: Meaningful micro-interactions
- **Typography**: Clean, readable fonts with proper hierarchy

### **Layout Options**
- **Center Window**: Primary search interface in screen center
- **Grid View**: Application grid for visual browsing
- **List View**: Compact list for efficiency
- **Two-pane Layout**: Results on right, details on left

### **Customization**
- **Hotkey Configuration**: Customizable keyboard shortcuts
- **Theme Colors**: User-configurable accent colors
- **Layout Preferences**: Adjustable window size and position

## 🔧 Technical Implementation Notes

### **AGS-Specific Features**
- **GTK4 Widgets**: Leverage native GTK components
- **CSS Styling**: Custom styling with CSS
- **JavaScript Logic**: Business logic in JS/TypeScript
- **Service Integration**: Use AGS services for system data

### **Performance Optimizations**
- **Lazy Loading**: Load extensions only when needed
- **Caching**: Cache search results and file indexes
- **Debounced Search**: Prevent excessive API calls
- **Virtual Scrolling**: Handle large result sets efficiently

### **Data Sources**
- **Desktop Files**: Parse .desktop files for applications
- **File System**: Index common directories
- **Browser History**: Chrome/Firefox bookmark integration
- **System APIs**: NetworkManager, BlueZ, PulseAudio integration

## 📋 Implementation Priority

### **1: Foundation**
1. Basic window and input handling
2. Application search and launch
3. Simple file search
4. Calculator functionality

### **2: Core Features**
1. Clipboard history
2. System commands
3. Window management
4. Beautiful animations and styling

### **3: Productivity**
1. Snippets and quicklinks
2. Notes system
3. Hyprland integration
4. Plugin architecture foundation

### **4: Polish & Extensions**
1. Themes and customization
2. Performance optimization
3. First external integrations
4. Documentation and examples

## 💡 Innovation Opportunities

### **Unique to Linux/Hyprland**
- **Workspace Previews**: Visual workspace thumbnails
- **Tiling Integration**: Smart window positioning
- **Notification Center**: Unified notification management
- **System Monitoring**: CPU, RAM, disk usage widgets

### **Community Features**
- **Shared Configurations**: Export/import setups
- **Plugin Marketplace**: Community extensions
- **Themes Gallery**: User-created themes
- **Integration Templates**: Pre-built service integrations

