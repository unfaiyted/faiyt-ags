import { BarMode } from "../widget/bar/types";

export enum DisplayModes {
  LIGHT = "light",
  DARK = "dark",
}

export interface AIProvider {
  name: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  enabled?: boolean;
  contextLength?: number;
}

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

// TODO: Maybe consider the idea of having a monitor group id or something, where we have specific settings for different monitor groups
// like if an external monitor is plugged in, we should be able to figure out how we can automatically determine positions/scales resolutions based on the whole picutre of all the monitors plugged in.
// need to fingerprint the monitors and figure out how to get the resolutions of the monitors.
//
export interface MonitorConfig {
  name: string;
  position: {
    x: number;
    y: number;
  };
  resolution: {
    width: number;
    height: number;
  };
  isPrimary: boolean;
  refreshRate: number;
  scale: number;
}

export interface ConfigOptions {
  // AI Settings should are stored in the LeftBar where the AI providers are displayed.
  user: {
    avatarPath: string;
  };
  ai: {
    defaultGPTProvider: string;
    defaultTemperature: number;
    enhancements: boolean;
    useHistory: boolean;
    safety: boolean;
    writingCursor: string;
    proxyUrl: string | null;
    providers: {
      claude: AIProvider & {
        models?: string[];
        selectedModel?: number;
        cycleModels?: boolean;
      };
      gemini: AIProvider & {
        models?: string[];
        selectedModel?: number;
        cycleModels?: boolean;
      };
      gpt: AIProvider & {
        models?: string[];
        selectedModel?: number;
      };
      ollama: AIProvider & {
        models?: string[];
        selectedModel?: number;
        localUrl?: string;
      };
    };
    mcp: {
      enabled: boolean;
      servers: MCPServer[];
      connectionTimeout: number;
      autoReconnect: boolean;
    };
    chat: {
      autoSave: boolean;
      streamResponses: boolean;
      saveLocation: string;
      exportFormat: "markdown" | "json" | "txt";
      contextWindow: number;
      responseTimeout: number;
      retryAttempts: number;
      enableLogging: boolean;
    };
  };
  animations: {
    choreographyDelay: number;
    durationSmall: number;
    durationLarge: number;
  };
  appearance: {
    defaultMode: DisplayModes;
    theme: string;
    autoDarkMode: {
      enabled: boolean;
      from: string;
      to: string;
    };
    keyboardUseFlag: boolean;
  };
  // Default apps to use for various actions
  apps: {
    bluetooth: string;
    imageViewer: string;
    network: string;
    settings: string;
    browser: string;
    taskManager: string;
    terminal: string;
    fileManager: string;
  };
  battery: {
    low: number;
    critical: number;
    enableNotifications: boolean;
    suspendThreshold: number;
    warnLevels: number[];
    warnTitles: string[];
    warnMessages: string[];
  };
  brightness: {
    controllers: {
      default: string;
      [key: string]: string;
    };
  };
  cheatsheet: {
    keybinds: {
      hyprlandConfigPath: string;
      neovimConfigPath: string;
    };
  };
  // gaming: {
  //   crosshair: {
  //     size: number;
  //     color: string;
  //   };
  // };
  // i18n: {
  //   langCode: string;
  //   extraLogs: boolean;
  // };
  monitors: {
    [key: string]: MonitorConfig;
  };
  music: {
    preferredPlayer: string;
  };
  // onScreenKeyboard: {
  //   layout: string;
  // };
  // overview: {
  //   scale: number;
  //   numOfRows: number;
  //   numOfCols: number;
  //   wsNumScale: number;
  //   wsNumMarginScale: number;
  // };
  sidebar: {
    left: {};
    right: {};
  };
  search: {
    enableFeatures: {
      listPrefixes: boolean;
      actions: boolean;
      commands: boolean;
      mathResults: boolean;
      directorySearch: boolean;
      aiSearch: boolean;
      webSearch: boolean;
      stickers: boolean;
    };
    evaluators: {
      baseConverter: boolean;
      colorConverter: boolean;
      dateCalculator: boolean;
      mathEvaluator: boolean;
      percentageCalculator: boolean;
      timeCalculator: boolean;
      unitConverter: boolean;
    };
    engineBaseUrl: string;
    excludedSites: string[];
    externalProviders: {
      [key: string]: {
        name: string;
        prefix: string;
        url: string;
        icon: string;
      };
    };
    stickers: {
      packs: Array<{
        id: string;
        key: string;
        name?: string;
      }>;
    };
  };
  time: {
    format: string;
    interval: number;
    dateFormatLong: string;
    dateInterval: number;
    dateFormat: string;
  };
  weather: {
    city: string;
    preferredUnit: "C" | "F";
  };
  workspaces: {
    shown: number;
  };
  // dock: {
  //   enabled: boolean;
  //   hiddenThickness: number;
  //   pinnedApps: string[];
  //   layer: string;
  //   monitorExclusivity: boolean;
  //   searchPinnedAppIcons: boolean;
  //   trigger: string[];
  //   autoHide: {
  //     trigger: string;
  //     interval: number;
  //   }[];
  // };
  // icons: {
  //   searchPaths: string[];
  //   symbolicIconTheme: {
  //     dark: string;
  //     light: string;
  //   };
  //   substitutions: {
  //     [key: string]: string;
  //   };
  //   regexSubstitutions: {
  //     regex: RegExp;
  //     replace: string;
  //   }[];
  // };
  keybinds: {
    sidebar: {
      left: {
        nextTab: string;
        prevTab: string;
        cycleTab: string;
      };
      right: {
        nextTab: string;
        prevTab: string;
        cycleTab: string;
      };
    };
    cheatsheet: {
      nextTab: string;
      prevTab: string;
      cycleTab: string;
    };
    launcher: {
      toggleLauncher: string;
      nextResult: string;
      prevResult: string;
      focusInput: string;
    };
    topBar: {
      focus: string;
    };
  };
  bar: {
    modes: BarMode[];
    default: BarMode;
    modules: {
      left: string[];
      center: {
        left: string[];
        middle: string[];
        right: string[];
      };
      right: string[];
    };
  };
  launcher: {
    maxResults: number;
  };
  // Window enable/disable configuration
  windows: {
    bar: {
      enabled: boolean;
      corners: boolean;
    };
    launcher: {
      enabled: boolean;
    };
    sidebar: {
      leftEnabled: boolean;
      rightEnabled: boolean;
    };
    overlays: {
      enabled: boolean;
      notifications: boolean;
      indicators: boolean;
      music: boolean;
      wallpaper: boolean;
    };
    settings: {
      enabled: boolean;
      monitors: boolean;
    };
  };
  dir: {
    scripts: string;
    home: string;
    cache: string;
    config: string;
    state: string;
    systemConfig: string[];
    systemData: string[];
    data: string;
    runtime: string;
  };
  windowManager: {
    enabled: boolean;
    screenshotInterval: number;
    cleanupInterval: number;
    captureOnFocus: boolean;
  };
  wallpaper: {
    directory: string;
    enabled: boolean;
    changeInterval: number; // in minutes, 0 = disabled
    itemsPerPage: number;
    thumbnailSize: number;
    winActiveOpacity: number;
    winInactiveOpacity: number;
    animationDuration: number;
    sortBy: "name" | "date" | "random";
    supportedFormats: string[];
  };
}
