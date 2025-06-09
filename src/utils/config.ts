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
    proxyUrl: null, // Can be "socks5://127.0.0.1:9050" or "http://127.0.0.1:8080" for example. Leave it blank if you don't need it.
    providers: {
      claude: {
        name: "Claude",
        apiKey: "",
        baseUrl: "https://api.anthropic.com/v1/messages",
        model: "claude-3-5-sonnet-20241022",
        temperature: 0.9,
        maxTokens: 1024,
        enabled: true,
        models: [
          "claude-3-5-sonnet-20241022",
          "claude-3-5-haiku-20241022",
          "claude-3-opus-20240229",
          "claude-3-haiku-20240307",
        ],
        cycleModels: false,
      },
      gemini: {
        name: "Gemini",
        apiKey: "",
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
        model: "gemini-pro",
        temperature: 0.9,
        maxTokens: 1024,
        enabled: true,
      },
      gpt: {
        name: "GPT",
        apiKey: "",
        baseUrl: "https://api.openai.com/v1/chat/completions",
        model: "gpt-3.5-turbo",
        temperature: 0.9,
        maxTokens: 1024,
        enabled: true,
      },
      ollama: {
        name: "Ollama",
        apiKey: "",
        baseUrl: "http://localhost:11434",
        model: "llama2",
        temperature: 0.9,
        maxTokens: 1024,
        enabled: true,
        localUrl: "http://localhost:11434",
      },
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
    barRoundCorners: 1, // 0: No, 1: Yes
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
  sidebar: {
    leftEnabled: true,
    rightEnabled: true,
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
};

export default defaultConfigOptions;
