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
}

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
    monitors: MonitorConfig[];
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
        cycleModels?: boolean;
      };
      gemini: AIProvider;
      gpt: AIProvider;
      ollama: AIProvider & {
        localUrl?: string;
      };
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
    barRoundCorners: number;
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
    scaleMethod: string;
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
    leftEnabled: boolean;
    rightEnabled: boolean;
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
  };
  launcher: {
    maxResults: number;
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
}
