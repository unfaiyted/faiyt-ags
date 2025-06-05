import { Widget, Astal, Gtk, Gdk, App } from "astal/gtk4";
import { Variable, bind } from "astal";
import configManager from "../../services/config-manager";
import { serviceLogger as log } from "../../utils/logger";
import { BarMode } from "../bar/types";
import KeyboardShortcut from "../utils/keyboard-shortcut";
import { c } from "../../utils/style";

// Import components
import { SettingsSection } from "./components/settings-section";
import { SettingRow } from "./components/setting-row";
import { ToggleSwitch } from "./components/toggle-switch";
import { NumberInput } from "./components/number-input";
import { TextInput } from "./components/text-input";
import { Dropdown } from "./components/dropdown";
import { KeybindInput } from "./components/keybind-input";

interface SettingsWindowProps extends Widget.WindowProps {
  gdkmonitor: Gdk.Monitor;
  monitor: number;
}

const SettingsWindow = (props: SettingsWindowProps) => {
  const { gdkmonitor, monitor } = props;
  const windowName = `settings-${monitor}`;
  const config = configManager.config;
  const searchQuery = Variable("");

  const updateConfig = async (path: string, value: any) => {
    try {
      log.debug(`Updating config: ${path} = ${value}`);
      // Use setValue method which accepts dot notation paths
      configManager.setValue(path, value);
      await configManager.saveConfig();
      log.debug(`Config saved successfully for ${path}`);
    } catch (error) {
      log.error(`Failed to save config for ${path}`, { error });
    }
  };

  // Filter sections based on search query
  const matchesSearch = (text: string): boolean => {
    const query = searchQuery.get().toLowerCase();
    return query === "" || text.toLowerCase().includes(query);
  };

  const content = (
    <box cssName="settings-container" vertical spacing={0}>
      <box cssName="settings-header" vertical spacing={12}>
        <box spacing={12}>
          <label cssName="settings-title">Settings</label>
          <box hexpand />
          <button
            cssName="settings-close-button"
            onClicked={() => App.get_window(windowName)?.hide()}
          >
            <label>✕</label>
          </button>
        </box>
        
        {/* Search/Filter Bar */}
        <box cssName="settings-search-box" spacing={8}>
          <label>🔍</label>
          <entry
            cssName="settings-search"
            placeholder_text="Search settings..."
            hexpand
            onChanged={(self) => searchQuery.set(self.text)}
          />
        </box>
      </box>

      <Gtk.ScrolledWindow
        cssName="settings-scrollable"
        vexpand
        hscrollbar_policy={Gtk.PolicyType.NEVER}
        vscrollbar_policy={Gtk.PolicyType.AUTOMATIC}
      >
        <box cssName="settings-content" vertical spacing={16}>
          {/* Appearance Settings */}
          {bind(searchQuery).as(q => 
            (matchesSearch("appearance") || matchesSearch("theme") || matchesSearch("bar")) && (
              <SettingsSection title="Appearance">
                {matchesSearch("theme") && (
                  <SettingRow
                    label="Theme"
                    description="Choose your color theme"
                  >
                    <Dropdown
                      value={config.appearance.theme}
                      options={[
                        { label: "Rosé Pine", value: "rose-pine" },
                        { label: "Dracula", value: "dracula" },
                        { label: "Nord", value: "nord" }
                      ]}
                      onChanged={(value) => updateConfig("appearance.theme", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("bar mode") && (
                  <SettingRow
                    label="Bar Mode"
                    description="Default bar display mode"
                  >
                    <Dropdown
                      value={config.bar.default}
                      options={[
                        { label: "Normal", value: BarMode.Normal },
                        { label: "Focus", value: BarMode.Focus },
                        { label: "Nothing", value: BarMode.Nothing }
                      ]}
                      onChanged={(value) => updateConfig("bar.default", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("corner radius") && (
                  <SettingRow
                    label="Bar Corner Radius"
                    description="Rounded corners for the bar"
                  >
                    <NumberInput
                      value={config.appearance.barRoundCorners}
                      min={0}
                      max={30}
                      onChanged={(value) => updateConfig("appearance.barRoundCorners", value)}
                    />
                  </SettingRow>
                )}
              </SettingsSection>
            )
          )}

          {/* Time & Weather Settings */}
          {bind(searchQuery).as(q => 
            (matchesSearch("time") || matchesSearch("weather") || matchesSearch("clock")) && (
              <SettingsSection title="Time & Weather">
                {matchesSearch("time format") && (
                  <SettingRow
                    label="Time Format"
                    description="Clock display format"
                  >
                    <TextInput
                      value={config.time.format}
                      placeholder="%H:%M"
                      onChanged={(value) => updateConfig("time.format", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("weather city") && (
                  <SettingRow
                    label="Weather City"
                    description="City for weather data"
                  >
                    <TextInput
                      value={config.weather.city}
                      placeholder="New York"
                      onChanged={(value) => updateConfig("weather.city", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("temperature unit") && (
                  <SettingRow
                    label="Temperature Unit"
                    description="Celsius or Fahrenheit"
                  >
                    <Dropdown
                      value={config.weather.preferredUnit}
                      options={[
                        { label: "Celsius", value: "C" },
                        { label: "Fahrenheit", value: "F" }
                      ]}
                      onChanged={(value) => updateConfig("weather.preferredUnit", value as "C" | "F")}
                    />
                  </SettingRow>
                )}
              </SettingsSection>
            )
          )}

          {/* Search Settings */}
          {bind(searchQuery).as(q => 
            (matchesSearch("search") || matchesSearch("launcher") || matchesSearch("results")) && (
              <SettingsSection title="Search">
                {matchesSearch("max results") && (
                  <SettingRow
                    label="Max Results"
                    description="Maximum search results to display"
                  >
                    <NumberInput
                      value={config.launcher.maxResults}
                      min={5}
                      max={50}
                      step={5}
                      onChanged={(value) => updateConfig("launcher.maxResults", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("list prefixes") && (
                  <SettingRow
                    label="List Prefixes"
                    description="Show available search prefixes"
                  >
                    <ToggleSwitch
                      value={config.search.enableFeatures.listPrefixes}
                      onToggled={(value) => updateConfig("search.enableFeatures.listPrefixes", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("actions") && (
                  <SettingRow
                    label="Actions"
                    description="Enable system actions"
                  >
                    <ToggleSwitch
                      value={config.search.enableFeatures.actions}
                      onToggled={(value) => updateConfig("search.enableFeatures.actions", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("commands") && (
                  <SettingRow
                    label="Commands"
                    description="Enable shell commands"
                  >
                    <ToggleSwitch
                      value={config.search.enableFeatures.commands}
                      onToggled={(value) => updateConfig("search.enableFeatures.commands", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("math") && (
                  <SettingRow
                    label="Math Results"
                    description="Show calculator results"
                  >
                    <ToggleSwitch
                      value={config.search.enableFeatures.mathResults}
                      onToggled={(value) => updateConfig("search.enableFeatures.mathResults", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("directory") && (
                  <SettingRow
                    label="Directory Search"
                    description="Enable directory browsing"
                  >
                    <ToggleSwitch
                      value={config.search.enableFeatures.directorySearch}
                      onToggled={(value) => updateConfig("search.enableFeatures.directorySearch", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("ai search") && (
                  <SettingRow
                    label="AI Search"
                    description="Enable AI-powered search"
                  >
                    <ToggleSwitch
                      value={config.search.enableFeatures.aiSearch}
                      onToggled={(value) => updateConfig("search.enableFeatures.aiSearch", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("web search") && (
                  <SettingRow
                    label="Web Search"
                    description="Enable web search"
                  >
                    <ToggleSwitch
                      value={config.search.enableFeatures.webSearch}
                      onToggled={(value) => updateConfig("search.enableFeatures.webSearch", value)}
                    />
                  </SettingRow>
                )}
              </SettingsSection>
            )
          )}

          {/* Search Evaluators */}
          {bind(searchQuery).as(q => 
            (matchesSearch("evaluator") || matchesSearch("calculator") || matchesSearch("converter")) && (
              <SettingsSection title="Search Evaluators">
                {matchesSearch("math") && (
                  <SettingRow
                    label="Math Evaluator"
                    description="Calculate math expressions"
                  >
                    <ToggleSwitch
                      value={config.search.evaluators.mathEvaluator}
                      onToggled={(value) => updateConfig("search.evaluators.mathEvaluator", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("base") && (
                  <SettingRow
                    label="Base Converter"
                    description="Convert between number bases"
                  >
                    <ToggleSwitch
                      value={config.search.evaluators.baseConverter}
                      onToggled={(value) => updateConfig("search.evaluators.baseConverter", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("color") && (
                  <SettingRow
                    label="Color Converter"
                    description="Convert between color formats"
                  >
                    <ToggleSwitch
                      value={config.search.evaluators.colorConverter}
                      onToggled={(value) => updateConfig("search.evaluators.colorConverter", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("date") && (
                  <SettingRow
                    label="Date Calculator"
                    description="Calculate date differences"
                  >
                    <ToggleSwitch
                      value={config.search.evaluators.dateCalculator}
                      onToggled={(value) => updateConfig("search.evaluators.dateCalculator", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("percentage") && (
                  <SettingRow
                    label="Percentage Calculator"
                    description="Calculate percentages"
                  >
                    <ToggleSwitch
                      value={config.search.evaluators.percentageCalculator}
                      onToggled={(value) => updateConfig("search.evaluators.percentageCalculator", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("time") && (
                  <SettingRow
                    label="Time Calculator"
                    description="Calculate time differences"
                  >
                    <ToggleSwitch
                      value={config.search.evaluators.timeCalculator}
                      onToggled={(value) => updateConfig("search.evaluators.timeCalculator", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("unit") && (
                  <SettingRow
                    label="Unit Converter"
                    description="Convert between units"
                  >
                    <ToggleSwitch
                      value={config.search.evaluators.unitConverter}
                      onToggled={(value) => updateConfig("search.evaluators.unitConverter", value)}
                    />
                  </SettingRow>
                )}
              </SettingsSection>
            )
          )}

          {/* Battery Settings */}
          {bind(searchQuery).as(q => 
            (matchesSearch("battery") || matchesSearch("power")) && (
              <SettingsSection title="Battery">
                {matchesSearch("low battery") && (
                  <SettingRow
                    label="Low Battery"
                    description="Low battery warning threshold (%)"
                  >
                    <NumberInput
                      value={config.battery.low}
                      min={5}
                      max={50}
                      step={5}
                      onChanged={(value) => updateConfig("battery.low", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("critical battery") && (
                  <SettingRow
                    label="Critical Battery"
                    description="Critical battery threshold (%)"
                  >
                    <NumberInput
                      value={config.battery.critical}
                      min={5}
                      max={20}
                      onChanged={(value) => updateConfig("battery.critical", value)}
                    />
                  </SettingRow>
                )}
              </SettingsSection>
            )
          )}

          {/* Animation Settings */}
          {bind(searchQuery).as(q => 
            (matchesSearch("animation") || matchesSearch("duration") || matchesSearch("choreography")) && (
              <SettingsSection title="Animations">
                {matchesSearch("animation duration") && (
                  <SettingRow
                    label="Animation Duration"
                    description="Small animation duration (ms)"
                  >
                    <NumberInput
                      value={config.animations.durationSmall}
                      min={100}
                      max={1000}
                      step={50}
                      onChanged={(value) => updateConfig("animations.durationSmall", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("choreography delay") && (
                  <SettingRow
                    label="Choreography Delay"
                    description="Delay between animations (ms)"
                  >
                    <NumberInput
                      value={config.animations.choreographyDelay}
                      min={0}
                      max={100}
                      step={10}
                      onChanged={(value) => updateConfig("animations.choreographyDelay", value)}
                    />
                  </SettingRow>
                )}
              </SettingsSection>
            )
          )}

          {/* Sidebar Settings */}
          {bind(searchQuery).as(q => 
            (matchesSearch("sidebar") || matchesSearch("panel")) && (
              <SettingsSection title="Sidebar">
                {matchesSearch("left sidebar") && (
                  <SettingRow
                    label="Left Sidebar"
                    description="Enable left sidebar"
                  >
                    <ToggleSwitch
                      value={config.sidebar.leftEnabled}
                      onToggled={(value) => updateConfig("sidebar.leftEnabled", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("right sidebar") && (
                  <SettingRow
                    label="Right Sidebar"
                    description="Enable right sidebar"
                  >
                    <ToggleSwitch
                      value={config.sidebar.rightEnabled}
                      onToggled={(value) => updateConfig("sidebar.rightEnabled", value)}
                    />
                  </SettingRow>
                )}
              </SettingsSection>
            )
          )}

          {/* Display & Monitor Settings */}
          {bind(searchQuery).as(q => 
            (matchesSearch("display") || matchesSearch("monitor") || matchesSearch("screen")) && (
              <SettingsSection title="Display & Monitors">
                {matchesSearch("monitor") && (
                  <SettingRow
                    label="Configure Displays"
                    description="Arrange and configure your monitors"
                  >
                    <button
                      cssName="apply-button"
                      onClicked={async () => {
                        const monitorsWindow = App.get_window(`monitors-${monitor}`);
                        if (monitorsWindow) {
                          // The window's custom show() method will handle screenshot capture
                          await monitorsWindow.show();
                          App.get_window(windowName)?.hide();
                        }
                      }}
                    >
                      <label>Open Display Settings</label>
                    </button>
                  </SettingRow>
                )}
              </SettingsSection>
            )
          )}

          {/* Window Manager Settings */}
          {bind(searchQuery).as(q => 
            (matchesSearch("window") || matchesSearch("screenshot") || matchesSearch("manager")) && (
              <SettingsSection title="Window Manager">
                {matchesSearch("window manager") && (
                  <SettingRow
                    label="Enable Window Manager"
                    description="Track and screenshot windows"
                  >
                    <ToggleSwitch
                      value={config.windowManager.enabled}
                      onToggled={(value) => updateConfig("windowManager.enabled", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("capture on focus") && (
                  <SettingRow
                    label="Capture on Focus"
                    description="Take screenshot when window gains focus"
                  >
                    <ToggleSwitch
                      value={config.windowManager.captureOnFocus}
                      onToggled={(value) => updateConfig("windowManager.captureOnFocus", value)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("screenshot interval") && (
                  <SettingRow
                    label="Screenshot Interval"
                    description="Update focused window screenshot (seconds)"
                  >
                    <NumberInput
                      value={config.windowManager.screenshotInterval / 1000}
                      min={5}
                      max={300}
                      step={5}
                      onChanged={(value) => updateConfig("windowManager.screenshotInterval", value * 1000)}
                    />
                  </SettingRow>
                )}
                
                {matchesSearch("cleanup interval") && (
                  <SettingRow
                    label="Cleanup Interval"
                    description="Clean orphaned screenshots (minutes)"
                  >
                    <NumberInput
                      value={config.windowManager.cleanupInterval / 60000}
                      min={1}
                      max={60}
                      step={1}
                      onChanged={(value) => updateConfig("windowManager.cleanupInterval", value * 60000)}
                    />
                  </SettingRow>
                )}
              </SettingsSection>
            )
          )}

          {/* Keyboard Shortcuts */}
          {bind(searchQuery).as(q => 
            (matchesSearch("keyboard") || matchesSearch("shortcut") || matchesSearch("keybind") || matchesSearch("hotkey")) && (
              <SettingsSection title="Keyboard Shortcuts">
                {/* Launcher Keybinds */}
                {(matchesSearch("launcher") || matchesSearch("keyboard") || matchesSearch("toggle")) && (
                  <box vertical spacing={8}>
                    <label cssName="keybind-category" xalign={0}>Launcher</label>
                    
                    <SettingRow
                      label="Toggle Launcher"
                      description="Show/hide the application launcher"
                    >
                      <KeybindInput
                        value={config.keybinds.launcher.toggleLauncher}
                        onChanged={(value) => updateConfig("keybinds.launcher.toggleLauncher", value)}
                      />
                    </SettingRow>
                    
                    <SettingRow
                      label="Next Result"
                      description="Navigate to next search result"
                    >
                      <KeybindInput
                        value={config.keybinds.launcher.nextResult}
                        onChanged={(value) => updateConfig("keybinds.launcher.nextResult", value)}
                      />
                    </SettingRow>
                    
                    <SettingRow
                      label="Previous Result"
                      description="Navigate to previous search result"
                    >
                      <KeybindInput
                        value={config.keybinds.launcher.prevResult}
                        onChanged={(value) => updateConfig("keybinds.launcher.prevResult", value)}
                      />
                    </SettingRow>
                    
                    <SettingRow
                      label="Focus Input"
                      description="Focus the search input field"
                    >
                      <KeybindInput
                        value={config.keybinds.launcher.focusInput}
                        onChanged={(value) => updateConfig("keybinds.launcher.focusInput", value)}
                      />
                    </SettingRow>
                  </box>
                )}
                
                {/* Sidebar Keybinds */}
                {(matchesSearch("sidebar") || matchesSearch("keyboard") || matchesSearch("tab")) && (
                  <box vertical spacing={8}>
                    <label cssName="keybind-category" xalign={0}>Left Sidebar</label>
                    
                    <SettingRow
                      label="Next Tab"
                      description="Switch to next tab"
                    >
                      <KeybindInput
                        value={config.keybinds.sidebar.left.nextTab}
                        onChanged={(value) => updateConfig("keybinds.sidebar.left.nextTab", value)}
                      />
                    </SettingRow>
                    
                    <SettingRow
                      label="Previous Tab"
                      description="Switch to previous tab"
                    >
                      <KeybindInput
                        value={config.keybinds.sidebar.left.prevTab}
                        onChanged={(value) => updateConfig("keybinds.sidebar.left.prevTab", value)}
                      />
                    </SettingRow>
                    
                    <SettingRow
                      label="Cycle Tabs"
                      description="Cycle through all tabs"
                    >
                      <KeybindInput
                        value={config.keybinds.sidebar.left.cycleTab}
                        onChanged={(value) => updateConfig("keybinds.sidebar.left.cycleTab", value)}
                      />
                    </SettingRow>
                  </box>
                )}
                
                {(matchesSearch("sidebar") || matchesSearch("keyboard") || matchesSearch("tab")) && (
                  <box vertical spacing={8}>
                    <label cssName="keybind-category" xalign={0}>Right Sidebar</label>
                    
                    <SettingRow
                      label="Next Tab"
                      description="Switch to next tab"
                    >
                      <KeybindInput
                        value={config.keybinds.sidebar.right.nextTab}
                        onChanged={(value) => updateConfig("keybinds.sidebar.right.nextTab", value)}
                      />
                    </SettingRow>
                    
                    <SettingRow
                      label="Previous Tab"
                      description="Switch to previous tab"
                    >
                      <KeybindInput
                        value={config.keybinds.sidebar.right.prevTab}
                        onChanged={(value) => updateConfig("keybinds.sidebar.right.prevTab", value)}
                      />
                    </SettingRow>
                    
                    <SettingRow
                      label="Cycle Tabs"
                      description="Cycle through all tabs"
                    >
                      <KeybindInput
                        value={config.keybinds.sidebar.right.cycleTab}
                        onChanged={(value) => updateConfig("keybinds.sidebar.right.cycleTab", value)}
                      />
                    </SettingRow>
                  </box>
                )}
                
                {/* Other Keybinds */}
                {(matchesSearch("bar") || matchesSearch("keyboard") || matchesSearch("focus")) && (
                  <box vertical spacing={8}>
                    <label cssName="keybind-category" xalign={0}>Other</label>
                    
                    <SettingRow
                      label="Focus Top Bar"
                      description="Focus the top bar"
                    >
                      <KeybindInput
                        value={config.keybinds.topBar.focus}
                        onChanged={(value) => updateConfig("keybinds.topBar.focus", value)}
                      />
                    </SettingRow>
                  </box>
                )}
                
                {/* Global Shortcuts Info */}
                <box cssName="keybind-info" vertical spacing={4}>
                  <label cssName="keybind-info-title" xalign={0}>Global Shortcuts (Non-configurable)</label>
                  <box spacing={8}>
                    <KeyboardShortcut keys={["Escape"]} />
                    <label>Close focused window/popup</label>
                  </box>
                  <box spacing={8}>
                    <KeyboardShortcut keys={["Super", "Q"]} />
                    <label>Quit application (set in Hyprland)</label>
                  </box>
                </box>
              </SettingsSection>
            )
          )}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  );

  return (
    <window
      name={windowName}
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.ON_DEMAND}
      application={App}
      cssName="settings-window"
      cssClasses={c`${props.cssClasses || ''}`}
      visible={false}
      onKeyPressed={(self, keyval) => {
        if (keyval === Gdk.KEY_Escape) {
          self.hide();
          return true;
        }
        return false;
      }}
      setup={(self) => {
        // Don't set size on window, let content determine size
        self.connect("show", () => {
          log.debug("Settings window shown");
          self.grab_focus();
        });
      }}
    >
      <box cssName="settings-window-wrapper" hexpand vexpand halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
        {content}
      </box>
    </window>
  );
};

export default SettingsWindow;