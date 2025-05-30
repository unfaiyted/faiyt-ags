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

export interface ConfigOptions {
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
    autoDarkMode: {
      enabled: boolean;
      from: string;
      to: string;
    };
    keyboardUseFlag: boolean;
    layerSmoke: boolean;
    layerSmokeStrength: number;
    barRoundCorners: number;
    fakeScreenRounding: number;
  };
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
    warnLevels: number[];
    warnTitles: string[];
    warnMessages: string[];
    suspendThreshold: number;
  };
  brightness: {
    controllers: {
      default: string;
      [key: string]: string;
    };
  };
  cheatsheet: {
    keybinds: {
      configPath: string;
    };
  };
  gaming: {
    crosshair: {
      size: number;
      color: string;
    };
  };
  i18n: {
    langCode: string;
    extraLogs: boolean;
  };
  monitors: {
    scaleMethod: string;
  };
  music: {
    preferredPlayer: string;
  };
  onScreenKeyboard: {
    layout: string;
  };
  overview: {
    scale: number;
    numOfRows: number;
    numOfCols: number;
    wsNumScale: number;
    wsNumMarginScale: number;
  };
  sidebar: {};
  search: {
    enableFeatures: {
      actions: boolean;
      commands: boolean;
      mathResults: boolean;
      directorySearch: boolean;
      aiSearch: boolean;
      webSearch: boolean;
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
  dock: {
    enabled: boolean;
    hiddenThickness: number;
    pinnedApps: string[];
    layer: string;
    monitorExclusivity: boolean;
    searchPinnedAppIcons: boolean;
    trigger: string[];
    autoHide: {
      trigger: string;
      interval: number;
    }[];
  };
  icons: {
    searchPaths: string[];
    symbolicIconTheme: {
      dark: string;
      light: string;
    };
    substitutions: {
      [key: string]: string;
    };
    regexSubstitutions: {
      regex: RegExp;
      replace: string;
    }[];
  };
  keybinds: {
    overview: {
      altMoveLeft: string;
      altMoveRight: string;
      deleteToEnd: string;
    };
    sidebar: {
      apis: {
        nextTab: string;
        prevTab: string;
      };
      options: {
        nextTab: string;
        prevTab: string;
      };
      pin: string;
      cycleTab: string;
      nextTab: string;
      prevTab: string;
    };
    cheatsheet: {
      keybinds: {
        nextTab: string;
        prevTab: string;
      };
      nextTab: string;
      prevTab: string;
      cycleTab: string;
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
}
