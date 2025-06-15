import { GObject, register, property, signal } from "astal/gobject";
import { exec } from "astal/process";
import AstalIO from "gi://AstalIO";
import GLib from "gi://GLib";
import { ConfigOptions } from "../types/config";
import defaultConfig from "../utils/config";
import { deepMerge } from "../utils/objects";
import { fileExists } from "../utils";
import { serviceLogger as log } from "../utils/logger";

const USER_CONFIG_DIR = GLib.get_user_config_dir();
const AGS_CONFIG_DIR = `${USER_CONFIG_DIR}/ags`;
const USER_CONFIG_PATH = `${AGS_CONFIG_DIR}/user-config.json`;

@register()
export class ConfigManager extends GObject.Object {
  private static _instance: ConfigManager | null = null;
  private _config: ConfigOptions = defaultConfig;
  private _userConfig: Partial<ConfigOptions> = {};

  @signal(String) declare configChanged: (path: string) => void;
  @signal() declare saved: () => void;
  @signal() declare loaded: () => void;
  @signal() declare reset: () => void;

  constructor() {
    super();

    if (ConfigManager._instance) {
      return ConfigManager._instance;
    }

    log.info("ConfigManager initializing");
    log.debug("Config paths", {
      USER_CONFIG_DIR,
      AGS_CONFIG_DIR,
      USER_CONFIG_PATH,
    });

    // Ensure config directory exists
    try {
      exec(`mkdir -p ${AGS_CONFIG_DIR}`);
      log.info("Config directory created/verified");

      // Double-check directory exists
      try {
        exec(`test -d ${AGS_CONFIG_DIR}`);
        log.debug("Directory check passed");
      } catch (e) {
        log.debug("Directory check failed - directory may not exist");
      }
    } catch (err) {
      log.error("Failed to create config directory", { error: err });
    }

    // Load config on initialization
    this._config = defaultConfig;
    this.loadConfig();

    // Create default config file if it doesn't exist
    if (!fileExists(USER_CONFIG_PATH)) {
      log.info("Creating default user config file at", {
        path: USER_CONFIG_PATH,
      });
      try {
        // Test file write capability first
        const testPath = `${AGS_CONFIG_DIR}/test.txt`;
        try {
          AstalIO.write_file(testPath, "test");
          if (fileExists(testPath)) {
            log.debug("Test file write successful");
            exec(`rm -f ${testPath}`);
          } else {
            log.error("Test file write failed - file operations may not work");
          }
        } catch (testErr) {
          log.error("Test file write error", { error: testErr });
        }

        // Use synchronous write for initial file creation
        // Start with empty object - only user overrides are saved
        const initialConfig = JSON.stringify({}, null, 2);
        log.debug("Writing initial config", { content: initialConfig });
        AstalIO.write_file(USER_CONFIG_PATH, initialConfig);

        // Verify the file was created
        if (fileExists(USER_CONFIG_PATH)) {
          log.info("Default config file created successfully");
          // Also check with shell command
          try {
            const shellCheck = exec(`test -f "${USER_CONFIG_PATH}"`);
            log.debug("Shell file check passed");
          } catch (e) {
            log.debug("Shell file check failed", { error: e });
          }
        } else {
          log.error("Failed to verify config file after creation");
          // Try alternative check
          const lsResult = exec(`ls -la "${AGS_CONFIG_DIR}"`);
          log.debug("Directory contents", { contents: lsResult });
        }
      } catch (err) {
        log.error("Failed to create default config file", {
          error: err instanceof Error ? err.message : String(err),
          path: USER_CONFIG_PATH,
        });
      }
    } else {
      log.info("User config file already exists", { path: USER_CONFIG_PATH });
    }

    ConfigManager._instance = this;
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager._instance) {
      ConfigManager._instance = new ConfigManager();
    }
    return ConfigManager._instance;
  }

  @property(Object)
  get config(): ConfigOptions {
    return this._config;
  }

  /**
   * Load user config from file and merge with defaults
   */
  loadConfig(): void {
    try {
      if (fileExists(USER_CONFIG_PATH)) {
        log.info("Loading user config", { path: USER_CONFIG_PATH });
        const userConfigContent = AstalIO.read_file(USER_CONFIG_PATH);

        try {
          this._userConfig = JSON.parse(userConfigContent);
          log.debug("User config loaded", {
            keys: Object.keys(this._userConfig).length,
          });
        } catch (parseError) {
          log.error("Failed to parse user config", { error: parseError });
          // Backup corrupt config
          const backupPath = `${USER_CONFIG_PATH}.backup.${Date.now()}`;
          exec(`cp "${USER_CONFIG_PATH}" "${backupPath}"`);
          log.info("Backed up corrupt config", { backupPath });
          this._userConfig = {};
        }
      } else {
        log.info("No user config found, using defaults");
        this._userConfig = {};
      }

      // Merge user config with defaults
      this._config = deepMerge(
        defaultConfig,
        this._userConfig,
      ) as ConfigOptions;
      log.debug("Config merged successfully");
      
      // Debug merged AI config
      const mergedAiConfig = this.getValue("ai.providers.claude");
      log.debug("Merged AI config check", {
        hasClaudeConfig: !!mergedAiConfig,
        hasApiKey: !!mergedAiConfig?.apiKey,
        apiKeyLength: mergedAiConfig?.apiKey?.length || 0
      });

      this.emit("loaded");
    } catch (error) {
      log.error("Failed to load config", { error });
      this._config = defaultConfig;
    }
  }

  /**
   * Save current config to file
   * @param useSync - Use synchronous write (for critical operations)
   */
  async saveConfig(useSync: boolean = false): Promise<void> {
    try {
      log.info("Saving user config", {
        path: USER_CONFIG_PATH,
        configSize: Object.keys(this._userConfig).length,
        mode: useSync ? "sync" : "async",
      });

      // Pretty print the config for better readability
      const configJson = JSON.stringify(this._userConfig, null, 2);
      log.debug("Config JSON to save", { length: configJson.length });

      if (useSync) {
        AstalIO.write_file(USER_CONFIG_PATH, configJson);
      } else {
        // Use the promise-based overload with null callback
        await new Promise<void>((resolve, reject) => {
          AstalIO.write_file_async(USER_CONFIG_PATH, configJson, (source, result) => {
            try {
              AstalIO.write_file_finish(result);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
      }

      log.info("User config saved successfully");

      // Verify the file was created
      if (fileExists(USER_CONFIG_PATH)) {
        log.info("Config file verified after save");
      } else {
        log.error("Config file not found after save!");
      }

      this.emit("saved");
    } catch (error) {
      log.error("Failed to save config", {
        error: error instanceof Error ? error.message : String(error),
        path: USER_CONFIG_PATH,
      });
      throw error;
    }
  }

  /**
   * Update a specific config value using dot notation path
   * @param path - Dot notation path (e.g., "ai.providers.claude.apiKey")
   * @param value - The value to set
   */
  setValue(path: string, value: any): void {
    log.debug("Setting config value", {
      path,
      value:
        typeof value === "string" && path.includes("apiKey") ? "***" : value,
    });

    const keys = path.split(".");
    let current: any = this._userConfig;
    let configCurrent: any = this._config;

    // Create nested objects if they don't exist
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];

      if (configCurrent[key]) {
        configCurrent = configCurrent[key];
      }
    }

    // Set the value
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;

    // Update the merged config
    this._config = deepMerge(defaultConfig, this._userConfig) as ConfigOptions;

    // Emit change event
    this.emit("config-changed", path);

    // Auto-save after changes (debounced)
    this.debouncedSave();
  }

  /**
   * Get a specific config value using dot notation path
   * @param path - Dot notation path (e.g., "ai.providers.claude.apiKey")
   * @returns The value at the specified path
   */
  getValue(path: string): any {
    const keys = path.split(".");
    let current: any = this._config;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * Reset config to defaults
   */
  resetConfig(): void {
    log.info("Resetting config to defaults");

    // Backup current config before reset
    if (fileExists(USER_CONFIG_PATH)) {
      const backupPath = `${USER_CONFIG_PATH}.backup.${Date.now()}`;
      exec(`cp "${USER_CONFIG_PATH}" "${backupPath}"`);
      log.info("Backed up current config before reset", { backupPath });
    }

    this._userConfig = {};
    this._config = defaultConfig;

    // Save the empty user config (use sync for immediate write)
    this.saveConfig(true).catch((err) => {
      log.error("Failed to save reset config", { error: err });
    });

    this.emit("reset");
  }

  /**
   * Reset a specific section to defaults
   * @param section - The section to reset (e.g., "ai", "appearance")
   */
  resetSection(section: keyof ConfigOptions): void {
    log.info("Resetting config section to defaults", { section });

    if (section in this._userConfig) {
      delete this._userConfig[section];
      this._config = deepMerge(
        defaultConfig,
        this._userConfig,
      ) as ConfigOptions;

      this.emit("config-changed", section);
      this.debouncedSave();
    }
  }

  /**
   * Import config from a file
   * @param filePath - Path to the config file to import
   */
  async importConfig(filePath: string): Promise<void> {
    try {
      log.info("Importing config", { filePath });

      if (!fileExists(filePath)) {
        throw new Error(`Config file not found: ${filePath}`);
      }

      const importedContent = AstalIO.read_file(filePath);
      const importedConfig = JSON.parse(importedContent);

      // Validate it's a valid config structure
      if (typeof importedConfig !== "object") {
        throw new Error("Invalid config format");
      }

      // Backup current config
      const backupPath = `${USER_CONFIG_PATH}.backup.${Date.now()}`;
      if (fileExists(USER_CONFIG_PATH)) {
        exec(`cp "${USER_CONFIG_PATH}" "${backupPath}"`);
      }

      // Merge imported config with current user config
      this._userConfig = deepMerge(
        this._userConfig,
        importedConfig,
      ) as Partial<ConfigOptions>;
      this._config = deepMerge(
        defaultConfig,
        this._userConfig,
      ) as ConfigOptions;

      await this.saveConfig();
      log.info("Config imported successfully");
    } catch (error) {
      log.error("Failed to import config", { error });
      throw error;
    }
  }

  /**
   * Export config to a file
   * @param filePath - Path where to export the config
   */
  async exportConfig(filePath: string): Promise<void> {
    try {
      log.info("Exporting config", { filePath });

      const configJson = JSON.stringify(this._userConfig, null, 2);
      await AstalIO.write_file_async(filePath, configJson);

      log.info("Config exported successfully");
    } catch (error) {
      log.error("Failed to export config", { error });
      throw error;
    }
  }

  /**
   * Get all API keys (with masked values for security)
   */
  getAPIKeys(): Record<string, string> {
    const keys: Record<string, string> = {};
    const providers = this._config.ai.providers;

    for (const [provider, config] of Object.entries(providers)) {
      if (config.apiKey) {
        keys[provider] = config.apiKey.substring(0, 10) + "...";
      }
    }

    return keys;
  }

  /**
   * Set API key for a specific provider
   * @param provider - The AI provider name
   * @param apiKey - The API key
   */
  setAPIKey(
    provider: keyof ConfigOptions["ai"]["providers"],
    apiKey: string,
  ): void {
    this.setValue(`ai.providers.${provider}.apiKey`, apiKey);
  }

  // Window management methods
  toggleWindow(windowPath: string): void {
    const currentValue = this.getValue(`windows.${windowPath}`);
    this.setValue(`windows.${windowPath}`, !currentValue);
    this.emit("window-toggled", windowPath, !currentValue);
    log.info(`Window toggled: ${windowPath} = ${!currentValue}`);
  }

  setWindowEnabled(windowPath: string, enabled: boolean): void {
    this.setValue(`windows.${windowPath}`, enabled);
    this.emit("window-toggled", windowPath, enabled);
    log.info(`Window state set: ${windowPath} = ${enabled}`);
  }

  isWindowEnabled(windowPath: string): boolean {
    return this.getValue(`windows.${windowPath}`) || false;
  }

  // Get all window states
  getWindowStates(): Record<string, boolean> {
    const windows = this.getValue("windows") || {};
    const states: Record<string, boolean> = {};
    
    const flatten = (obj: any, prefix = ""): void => {
      for (const key in obj) {
        if (typeof obj[key] === "boolean") {
          states[prefix + key] = obj[key];
        } else if (typeof obj[key] === "object") {
          flatten(obj[key], prefix + key + ".");
        }
      }
    };
    
    flatten(windows);
    return states;
  }

  // Debounced save to avoid excessive file writes
  private _saveTimeout: number | null = null;
  private debouncedSave(): void {
    if (this._saveTimeout) {
      GLib.Source.remove(this._saveTimeout);
    }

    this._saveTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
      // Use sync write for reliability
      this.saveConfig(true).catch((err) => {
        log.error("Failed to auto-save config", { error: err });
      });
      this._saveTimeout = null;
      return GLib.SOURCE_REMOVE;
    });
  }
}

// Export singleton instance
export default ConfigManager.getInstance();
