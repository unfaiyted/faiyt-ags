import { BarMode } from "../widget/bar/types";

export enum DisplayModes {
  LIGHT = "light",
  DARK = "dark",
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
    taskManager: string;
    terminal: string;
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
  sidebar: {
    ai: {
      extraGptModels: {
        [key: string]: {
          name: string;
          logo_name: string;
          description: string;
          base_url: string;
          key_get_url: string;
          key_file: string;
          model: string;
        };
      };
    };
    image: {
      columns: number;
      batchCount: number;
      allowNsfw: boolean;
      saveInFolderByTags: boolean;
    };
    pages: {
      order: string[];
      apis: {
        order: string[];
      };
    };
  };
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
    preferredUnit: string;
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

export type MergedConfig = ConfigOptions; // Define as needed for your merged config