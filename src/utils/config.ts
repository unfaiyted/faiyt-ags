import GLib from "gi://GLib";
import { ConfigOptions, DisplayModes } from "../types/config";
import { BarMode } from "../widget/bar/types";

const USERNAME = GLib.get_user_name();
// Default options.

export const defaultConfigOptions: ConfigOptions = {
  // General stuff
  user: {
    avatarPath: "/home/faiyt/Pictures/avatar.png",
  },
  monitors: {},
  ai: {
    defaultGPTProvider: "claude",
    defaultTemperature: 0.9,
    enhancements: true,
    useHistory: true,
    safety: true,
    writingCursor: " ...", // Warning: Using weird characters can mess up Markdown rendering
    proxyUrl: null,
    providers: {
      claude: {
        name: "Claude",
        apiKey: "",
        baseUrl: "https://api.anthropic.com/v1/messages",
        model: "claude-3-5-sonnet-20241022",
        temperature: 0.9,
        maxTokens: 1024,
        enabled: true,
        contextLength: 100000,
        models: [
          "claude-3-5-sonnet-20241022",
          "claude-3-5-haiku-20241022",
          "claude-3-opus-20240229",
          "claude-3-haiku-20240307",
        ],
        selectedModel: 0,
        cycleModels: false,
      },
      gemini: {
        name: "Gemini",
        apiKey: "",
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
        model: "gemini-1.5-flash",
        temperature: 0.9,
        maxTokens: 2048,
        enabled: true,
        models: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"],
        selectedModel: 0,
        cycleModels: false,
      },
      gpt: {
        name: "GPT",
        apiKey: "",
        baseUrl: "https://api.openai.com/v1/chat/completions",
        model: "gpt-3.5-turbo",
        temperature: 0.9,
        maxTokens: 1024,
        enabled: true,
        models: ["gpt-4", "gpt-3.5-turbo"],
        selectedModel: 0,
      },
      ollama: {
        name: "Ollama",
        apiKey: "",
        baseUrl: "http://localhost:11434",
        model: "llama2",
        temperature: 0.9,
        maxTokens: 1024,
        enabled: true,
        models: ["llama2", "mistral", "codellama"],
        selectedModel: 0,
        localUrl: "http://localhost:11434",
      },
    },
    mcp: {
      enabled: false,
      servers: [],
      connectionTimeout: 10,
      autoReconnect: true,
    },
    chat: {
      autoSave: true,
      streamResponses: true,
      saveLocation: "~/.config/ags/chats",
      exportFormat: "markdown",
      contextWindow: 4,
      responseTimeout: 30,
      retryAttempts: 3,
      enableLogging: false,
    },
  },
  animations: {
    choreographyDelay: 35,
    durationSmall: 110,
    durationLarge: 180,
  },
  appearance: {
    defaultMode: DisplayModes.DARK,
    theme: "rose-pine",
    autoDarkMode: {
      // Turns on dark mode in certain hours. Time in 24h format
      enabled: false,
      from: "18:10",
      to: "6:10",
    },
    keyboardUseFlag: false, // Use flag emoji instead of abbreviation letters
  },
  apps: {
    bluetooth: "blueberry",
    imageViewer: "imv",
    network: "nm-connection-editor",
    settings: "xfce4-settings-manager",
    taskManager: "htop",
    browser: "/home/faiyt/Applications/Zen.AppImage",
    terminal: "kitty", // This is only for shell actions
    fileManager: "nautilus",
  },
  battery: {
    low: 20,
    critical: 10,
    enableNotifications: true,
    suspendThreshold: 3,
    warnLevels: [20, 15, 5],
    warnTitles: ["Low battery", "Very low battery", "Critical Battery"],
    warnMessages: [
      "Plug in the charger",
      "You there?",
      "PLUG THE CHARGER ALREADY",
    ],
  },
  brightness: {
    // Object of controller names for each monitor, either "brightnessctl" or "ddcutil" or "auto"
    // 'default' one will be used if unspecified
    // Examples
    // 'eDP-1': "brightnessctl",
    // 'DP-1': "ddcutil",
    controllers: {
      default: "auto",
    },
  },
  cheatsheet: {
    keybinds: {
      hyprlandConfigPath: "", // Path to hyprland keybind config file. Leave empty for default (~/.config/hypr/hyprland/keybinds.conf)
      neovimConfigPath: "", // Path to neovim keybind config file
    },
  },

  music: {
    preferredPlayer: "plasma-browser-integration",
  },
  launcher: {
    maxResults: 15,
  },
  // Window enable/disable configuration
  windows: {
    bar: {
      enabled: true,
      corners: true, // Enable bar corner widgets
    },
    launcher: {
      enabled: true,
    },
    sidebar: {
      leftEnabled: true,
      rightEnabled: true,
    },
    overlays: {
      enabled: true,
      notifications: true,
      indicators: true,
      music: true,
      wallpaper: true,
    },
    settings: {
      enabled: true,
      monitors: true,
    },
  },
  sidebar: {
    left: {},
    right: {},
  },
  search: {
    enableFeatures: {
      listPrefixes: true,
      actions: true,
      commands: true,
      mathResults: true,
      directorySearch: true,
      aiSearch: true,
      webSearch: true,
      stickers: true,
    },
    evaluators: {
      baseConverter: true,
      colorConverter: true,
      dateCalculator: true,
      mathEvaluator: true,
      percentageCalculator: true,
      timeCalculator: true,
      unitConverter: true,
    },
    engineBaseUrl: "https://www.google.com/search?q=",
    excludedSites: ["quora.com"],
    externalProviders: {
      google: {
        name: "Google",
        prefix: "!g",
        url: "https://www.google.com/search?q=%s",
        icon: "google",
      },
      duckduckgo: {
        name: "DuckDuckGo",
        prefix: "!d",
        url: "https://duckduckgo.com/?q=%s",
        icon: "web-browser",
      },
      claude: {
        name: "Claude AI",
        prefix: "!c",
        url: "https://claude.ai/new?q=%s",
        icon: "robot",
      },
    },
    stickers: {
      packs: [
        {
          id: "65416f7802bc665180d5ab1b6e48fb41",
          key: "5a8ce7501299bf580d9fb00edb507ec9a29cbaa0d71e3bd54421a93fd0772dd0",
          name: "FFXIV Emotes HQ",
        },
        {
          id: "74a7f27901d37720fa0ebaef9b714b74",
          key: "36d8c2da117b9694be3827d508e1410a546b298f93bd60cbb99614739c91f68a",
          name: "Fat Cat",
        },
      ],
    },
  },
  time: {
    // See https://docs.gtk.org/glib/method.DateTime.format.html
    // Here's the 12h format: "%I:%M%P"
    // For seconds, add "%S" and set interval to 1000
    format: "%H:%M",
    interval: 5000,
    dateFormatLong: "%A, %d/%m", // On bar
    dateInterval: 5000,
    dateFormat: "%d/%m", // On notif time
  },
  weather: {
    city: "San Antonio TX",
    preferredUnit: "C", // Either C or F
  },
  workspaces: {
    shown: 5,
  },
  keybinds: {
    // Format: Mod1+Mod2+key. CaSe SeNsItIvE!
    // Modifiers: Shift Ctrl Alt Hyper Meta
    // See https://docs.gtk.org/gdk3/index.html#constants for the other keys (they are listed as KEY_key)
    launcher: {
      toggleLauncher: "Super+Space",
      nextResult: "Down",
      prevResult: "Up",
      focusInput: "Ctrl+l",
    },
    sidebar: {
      left: {
        nextTab: "Page_Down",
        prevTab: "Page_Up",
        cycleTab: "Ctrl+Tab",
      },
      right: {
        nextTab: "Page_Down",
        prevTab: "Page_Up",
        cycleTab: "Ctrl+Tab",
      },
    },
    cheatsheet: {
      nextTab: "Ctrl+Page_Down",
      prevTab: "Ctrl+Page_Up",
      cycleTab: "Ctrl+Tab",
    },
    topBar: {
      focus: "Alt+b",
    },
  },
  bar: {
    // These are the modes you will be able to cycle between. If you remove a mode, it will be hidden.
    modes: [BarMode.Normal, BarMode.Focus, BarMode.Nothing],
    default: BarMode.Normal,
    modules: {
      left: ["windowTitle"],
      center: {
        left: ["system", "music"],
        middle: ["workspaces"],
        right: ["utilities"],
      },
      right: ["battery", "clock", "weather", "statusIndicators", "tray"],
    },
  },
  dir: {
    scripts: `/home/${USERNAME}/.config/ags/scripts`,
    home: GLib.get_home_dir(),
    cache: GLib.get_user_cache_dir(),
    config: GLib.get_user_config_dir(),
    state: GLib.get_user_state_dir(),
    systemConfig: GLib.get_system_config_dirs(),
    systemData: GLib.get_system_data_dirs(),
    data: GLib.get_user_data_dir(),
    runtime: GLib.get_user_runtime_dir(),
  },
  windowManager: {
    enabled: true,
    screenshotInterval: 30000, // 30 seconds
    cleanupInterval: 300000, // 5 minutes
    captureOnFocus: true,
  },
  wallpaper: {
    directory: `/home/${USERNAME}/Pictures/Wallpapers`,
    enabled: true,
    changeInterval: 0, // in minutes, 0 = disabled
    itemsPerPage: 5,
    thumbnailSize: 160,
    winActiveOpacity: 0.2,
    winInactiveOpacity: 0.1,
    animationDuration: 300,
    sortBy: "name",
    supportedFormats: ["jpg", "jpeg", "png", "webp", "gif", "bmp"],
  },
};

export default defaultConfigOptions;
