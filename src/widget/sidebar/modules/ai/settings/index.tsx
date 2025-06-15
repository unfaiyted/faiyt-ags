import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import PhosphorIcon from "../../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../../utils/icons/types";
import { sidebarLogger as log } from "../../../../../utils/logger";
import configManager from "../../../../../services/config-manager";
import { AIProvider, MCPServer } from "../../../../../types/config";

export interface AISettingsProps extends Widget.BoxProps { }

interface SettingsSectionProps {
  title: string;
  icon: PhosphorIcons;
  expanded: Variable<boolean>;
  onToggle: () => void;
  child?: Gtk.Widget;
  children?: Gtk.Widget[];
}

const SettingsSection = (props: SettingsSectionProps) => {
  const { title, icon, expanded, onToggle, child, children } = props;

  return (
    <box vertical cssName="settings-section">
      <button
        cssName="settings-section-header"
        onClicked={onToggle}
      >
        <box cssClasses={["spacing-h-10"]}>
          <PhosphorIcon iconName={icon} size={18} />
          <label label={title} hexpand halign={Gtk.Align.START} />
          <PhosphorIcon
            iconName={bind(expanded).as(e => e ? PhosphorIcons.CaretUp : PhosphorIcons.CaretDown)}
            size={16}
          />
        </box>
      </button>
      <revealer
        revealChild={bind(expanded)}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transitionDuration={200}
        child={
          <box vertical cssName="settings-section-content" cssClasses={["spacing-v-10", "margin-top-10"]}>
            {children || child}
          </box>
        }
      />
    </box>
  );
};

const SettingsInput = ({ label, value, placeholder, type = "text", onChanged, configPath }: {
  label: string;
  value: Variable<string>;
  placeholder?: string;
  type?: "text" | "password" | "number";
  onChanged?: (value: string) => void;
  configPath?: string;
}) => {
  return (
    <box vertical cssClasses={["spacing-v-5"]}>
      <label label={label} halign={Gtk.Align.START} cssName="settings-input-label" />
      <entry
        cssName="settings-input"
        text={bind(value)}
        placeholderText={placeholder}
        visibility={type !== "password"}
        inputPurpose={type === "number" ? Gtk.InputPurpose.NUMBER : Gtk.InputPurpose.FREE_FORM}
        onChanged={(self) => {
          const newValue = self.get_text();
          value.set(newValue);
          onChanged?.(newValue);
          if (configPath) {
            configManager.setValue(configPath, newValue);
          }
        }}
      />
    </box>
  );
};

const SettingsSlider = ({ label, value, min = 0, max = 1, step = 0.1, onChanged, configPath }: {
  label: string;
  value: Variable<number>;
  min?: number;
  max?: number;
  step?: number;
  onChanged?: (value: number) => void;
  configPath?: string;
}) => {
  return (
    <box vertical cssClasses={["spacing-v-5"]}>
      <box cssClasses={["spacing-h-10"]}>
        <label label={label} hexpand halign={Gtk.Align.START} cssName="settings-input-label" />
        <label label={bind(value).as(v => v.toFixed(1))} cssName="settings-slider-value" />
      </box>
      <slider
        cssName="settings-slider"
        hexpand
        drawValue={false}
        min={min}
        max={max}
        value={bind(value)}
        onValueChanged={(self) => {
          const newValue = self.value;
          value.set(newValue);
          onChanged?.(newValue);
          if (configPath) {
            configManager.setValue(configPath, newValue);
          }
        }}
      />
    </box>
  );
};

const SettingsDropdown = ({ label, options, selected, onChanged, configPath }: {
  label: string;
  options: string[];
  selected: Variable<number>;
  onChanged?: (index: number) => void;
  configPath?: string;
}) => {
  const showDropdown = Variable(false);

  return (
    <box vertical cssClasses={["spacing-v-5"]}>
      <label label={label} halign={Gtk.Align.START} cssName="settings-input-label" />
      <button
        cssName="settings-dropdown"
        onClicked={() => showDropdown.set(!showDropdown.get())}
      >
        <box cssClasses={["spacing-h-10"]}>
          <label label={bind(selected).as(idx => options[idx] || "Select...")} hexpand halign={Gtk.Align.START} />
          <PhosphorIcon iconName={PhosphorIcons.CaretDown} size={12} />
        </box>
      </button>
      <revealer
        revealChild={bind(showDropdown)}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transitionDuration={200}
      >
        <box vertical cssName="settings-dropdown-menu">
          {options.map((option, idx) => (
            <button
              cssName="settings-dropdown-item"
              cssClasses={bind(selected).as(sel => sel === idx ? ["active"] : [])}
              onClicked={() => {
                selected.set(idx);
                showDropdown.set(false);
                onChanged?.(idx);
                if (configPath) {
                  configManager.setValue(configPath, idx);
                }
              }}
            >
              <label label={option} halign={Gtk.Align.START} />
            </button>
          ))}
        </box>
      </revealer>
    </box>
  );
};

const SettingsToggle = ({ label, value, onChanged, configPath }: {
  label: string;
  value: Variable<boolean>;
  onChanged?: (value: boolean) => void;
  configPath?: string;
}) => {
  return (
    <box cssClasses={["spacing-h-10"]}>
      <button
        cssName="settings-toggle"
        cssClasses={bind(value).as(active => active ? ["active"] : [])}
        onClicked={() => {
          const newValue = !value.get();
          value.set(newValue);
          onChanged?.(newValue);
          if (configPath) {
            configManager.setValue(configPath, newValue);
          }
        }}
      >
        <box cssClasses={["toggle-indicator"]} />
      </button>
      <label label={label} />
    </box>
  );
};

const MCPServerItem = ({ server, onToggle, onRemove }: {
  server: MCPServer;
  onToggle: () => void;
  onRemove: () => void;
}) => {
  return (
    <box cssName="mcp-server-item" cssClasses={["spacing-h-10"]}>
      <box vertical hexpand>
        <label label={server.name} cssName="mcp-server-name" halign={Gtk.Align.START} />
        <label label={server.url} cssName="mcp-server-url" halign={Gtk.Align.START} />
      </box>
      <button
        cssName="settings-toggle-small"
        cssClasses={server.enabled ? ["active"] : []}
        onClicked={onToggle}
      >
        <box cssClasses={["toggle-indicator-small"]} />
      </button>
      <button
        cssName="settings-button-icon"
        onClicked={onRemove}
      >
        <PhosphorIcon iconName={PhosphorIcons.X} size={16} />
      </button>
    </box>
  );
};

const AIProviderSettings = ({ providerId }: { providerId: string }) => {
  const provider = configManager.getValue(`ai.providers.${providerId}`);
  if (!provider) return null;

  const apiKey = Variable(provider.apiKey || "");
  const temperature = Variable(provider.temperature || 0.7);
  const maxTokens = Variable(provider.maxTokens || 2048);
  const selectedModel = Variable(provider.selectedModel || 0);

  // Listen for config changes
  configManager.connect("config-changed", (self, path: string) => {
    if (path.startsWith(`ai.providers.${providerId}`)) {
      const updatedProvider = configManager.getValue(`ai.providers.${providerId}`);
      if (updatedProvider) {
        apiKey.set(updatedProvider.apiKey || "");
        temperature.set(updatedProvider.temperature || 0.7);
        maxTokens.set(updatedProvider.maxTokens || 2048);
        selectedModel.set(updatedProvider.selectedModel || 0);
      }
    }
  });

  const iconMap: Record<string, PhosphorIcons> = {
    claude: PhosphorIcons.Brain,
    gemini: PhosphorIcons.Diamond,
    gpt: PhosphorIcons.Chat,
    ollama: PhosphorIcons.Alien,
  };

  return (
    <box vertical cssName="ai-provider-settings" cssClasses={["spacing-v-15"]}>
      <box cssName="ai-provider-header" cssClasses={["spacing-h-10"]}>
        <PhosphorIcon iconName={iconMap[providerId] || PhosphorIcons.Robot} size={24} />
        <label label={provider.name} cssName="ai-provider-name" />
        {provider.apiKey && (
          <box cssClasses={["spacing-h-5"]} halign={Gtk.Align.END} hexpand>
            <PhosphorIcon iconName={PhosphorIcons.CheckCircle} size={16} cssName="icon-success" />
            <label label="Connected" cssName="text-success" />
          </box>
        )}
      </box>

      <box vertical cssClasses={["spacing-v-10"]}>
        <SettingsInput
          label="API Key"
          value={apiKey}
          placeholder="Enter your API key..."
          type="password"
          configPath={`ai.providers.${providerId}.apiKey`}
          onChanged={(key) => {
            log.debug(`API key updated for ${providerId}`);
          }}
        />

        {provider.models && (
          <SettingsDropdown
            label="Model"
            options={provider.models}
            selected={selectedModel}
            configPath={`ai.providers.${providerId}.selectedModel`}
            onChanged={(idx) => {
              log.debug(`Model changed for ${providerId}:`, provider.models[idx]);
              // Also update the model field
              configManager.setValue(`ai.providers.${providerId}.model`, provider.models[idx]);
            }}
          />
        )}

        <SettingsSlider
          label="Temperature"
          value={temperature}
          min={0}
          max={2}
          step={0.1}
          configPath={`ai.providers.${providerId}.temperature`}
          onChanged={(val) => {
            log.debug(`Temperature updated for ${providerId}:`, val);
          }}
        />

        <SettingsSlider
          label="Max Tokens"
          value={maxTokens}
          min={256}
          max={4096}
          step={256}
          configPath={`ai.providers.${providerId}.maxTokens`}
          onChanged={(val) => {
            log.debug(`Max tokens updated for ${providerId}:`, val);
          }}
        />
      </box>
    </box>
  );
};

export default function AISettings(props: AISettingsProps) {
  log.debug("AISettings initializing");

  // Section expansion states - only one can be expanded at a time
  const expandedSection = Variable<string | null>("providers");

  // Load config values
  const aiConfig = configManager.getValue("ai");
  const mcpConfig = aiConfig?.mcp || { enabled: false, servers: [], connectionTimeout: 10, autoReconnect: true };
  const chatConfig = aiConfig?.chat || {
    autoSave: true,
    streamResponses: true,
    saveLocation: "~/.config/ags/chats",
    exportFormat: "markdown",
    contextWindow: 4,
    responseTimeout: 30,
    retryAttempts: 3,
    enableLogging: false,
  };

  // Create variables for settings
  const enableMCP = Variable(mcpConfig.enabled);
  const mcpServerName = Variable("");
  const mcpServerUrl = Variable("");
  const autoSaveChat = Variable(chatConfig.autoSave);
  const streamResponses = Variable(chatConfig.streamResponses);
  const contextWindow = Variable(chatConfig.contextWindow);
  const responseTimeout = Variable(chatConfig.responseTimeout);
  const retryAttempts = Variable(chatConfig.retryAttempts);
  const saveLocation = Variable(chatConfig.saveLocation);
  const exportFormat = Variable(chatConfig.exportFormat === "markdown" ? 0 : chatConfig.exportFormat === "json" ? 1 : 2);
  const enableLogging = Variable(chatConfig.enableLogging);
  const defaultProvider = Variable(
    aiConfig?.defaultGPTProvider === "claude" ? 0 :
    aiConfig?.defaultGPTProvider === "gemini" ? 1 :
    aiConfig?.defaultGPTProvider === "gpt" ? 2 : 3
  );
  const mcpServers = Variable<MCPServer[]>(mcpConfig.servers || []);
  const connectionTimeout = Variable(mcpConfig.connectionTimeout);
  const autoReconnect = Variable(mcpConfig.autoReconnect);

  // Provider list
  const providers = ["claude", "gemini", "gpt", "ollama"];

  // Create individual variables for each section's expanded state
  const providersExpanded = Variable(expandedSection.get() === "providers");
  const mcpExpanded = Variable(expandedSection.get() === "mcp");
  const generalExpanded = Variable(expandedSection.get() === "general");

  // Subscribe to changes in expandedSection
  expandedSection.subscribe((section) => {
    providersExpanded.set(section === "providers");
    mcpExpanded.set(section === "mcp");
    generalExpanded.set(section === "general");
  });

  const toggleSection = (sectionName: string) => {
    log.debug("Toggling section", {
      current: expandedSection.get(),
      target: sectionName,
      providersExpanded: providersExpanded.get(),
      mcpExpanded: mcpExpanded.get(),
      generalExpanded: generalExpanded.get()
    });

    if (expandedSection.get() === sectionName) {
      expandedSection.set(null);
    } else {
      expandedSection.set(sectionName);
    }
  };

  const addMCPServer = () => {
    const name = mcpServerName.get().trim();
    const url = mcpServerUrl.get().trim();
    
    if (name && url) {
      const newServer: MCPServer = {
        id: Date.now().toString(),
        name,
        url,
        enabled: true
      };
      
      const servers = [...mcpServers.get(), newServer];
      mcpServers.set(servers);
      configManager.setValue("ai.mcp.servers", servers);
      
      // Clear inputs
      mcpServerName.set("");
      mcpServerUrl.set("");
    }
  };

  return (
    <Gtk.ScrolledWindow
      vexpand
      cssName="ai-settings-container"
    >
      <box vertical cssName="ai-settings-content" cssClasses={["spacing-v-20"]}>
        <label label="AI Settings" cssName="settings-title" halign={Gtk.Align.START} />

        {/* AI Providers */}
        <SettingsSection
          title="AI Providers"
          icon={PhosphorIcons.Robot}
          expanded={providersExpanded}
          onToggle={() => toggleSection("providers")}
        >
          <>
            {providers.map((providerId) => (
              <AIProviderSettings providerId={providerId} />
            ))}
          </>
        </SettingsSection>

        {/* MCP Servers */}
        <SettingsSection
          title="MCP Servers"
          icon={PhosphorIcons.CloudArrowUp}
          expanded={mcpExpanded}
          onToggle={() => toggleSection("mcp")}
        >
          <box vertical cssClasses={["spacing-v-10"]}>
            <SettingsToggle
              label="Enable MCP Server Integration"
              value={enableMCP}
              configPath="ai.mcp.enabled"
            />

            <revealer
              revealChild={bind(enableMCP)}
              transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
              transitionDuration={200}
            >
              <box vertical cssClasses={["spacing-v-15", "margin-top-10"]}>
                {/* Add New Server */}
                <box vertical cssClasses={["spacing-v-10"]}>
                  <label label="Add New MCP Server" cssName="settings-subsection-title" halign={Gtk.Align.START} />
                  <SettingsInput
                    label="Server Name"
                    value={mcpServerName}
                    placeholder="My MCP Server"
                  />
                  <SettingsInput
                    label="Server URL"
                    value={mcpServerUrl}
                    placeholder="http://localhost:3000"
                  />
                  <button 
                    cssName="settings-button-secondary"
                    onClicked={addMCPServer}
                  >
                    <box cssClasses={["spacing-h-10"]}>
                      <PhosphorIcon iconName={PhosphorIcons.Plus} size={16} />
                      <label label="Add Server" />
                    </box>
                  </button>
                </box>

                {/* Server List */}
                <box vertical cssClasses={["spacing-v-10"]}>
                  <label label="Connected Servers" cssName="settings-subsection-title" halign={Gtk.Align.START} />
                  {bind(mcpServers).as(servers =>
                    servers.length > 0 ? (
                      <box vertical cssClasses={["spacing-v-5"]}>
                        {servers.map(server => (
                          <MCPServerItem
                            server={server}
                            onToggle={() => {
                              const updated = mcpServers.get().map(s =>
                                s.id === server.id ? { ...s, enabled: !s.enabled } : s
                              );
                              mcpServers.set(updated);
                              configManager.setValue("ai.mcp.servers", updated);
                            }}
                            onRemove={() => {
                              const updated = mcpServers.get().filter(s => s.id !== server.id);
                              mcpServers.set(updated);
                              configManager.setValue("ai.mcp.servers", updated);
                            }}
                          />
                        ))}
                      </box>
                    ) : (
                      <label
                        label="No servers configured"
                        cssName="settings-empty-state"
                        halign={Gtk.Align.CENTER}
                      />
                    )
                  )}
                </box>

                {/* MCP Settings */}
                <box vertical cssClasses={["spacing-v-10"]}>
                  <label label="MCP Configuration" cssName="settings-subsection-title" halign={Gtk.Align.START} />
                  <SettingsSlider
                    label="Connection Timeout (seconds)"
                    value={connectionTimeout}
                    min={5}
                    max={60}
                    step={5}
                    configPath="ai.mcp.connectionTimeout"
                  />
                  <SettingsToggle
                    label="Auto-reconnect on failure"
                    value={autoReconnect}
                    configPath="ai.mcp.autoReconnect"
                  />
                </box>
              </box>
            </revealer>
          </box>
        </SettingsSection>

        {/* General Settings */}
        <SettingsSection
          title="General Settings"
          icon={PhosphorIcons.Sliders}
          expanded={generalExpanded}
          onToggle={() => toggleSection("general")}
        >
          <box vertical cssClasses={["spacing-v-15"]}>
            {/* Chat Settings */}
            <box vertical cssClasses={["spacing-v-10"]}>
              <label label="Chat Configuration" cssName="settings-subsection-title" halign={Gtk.Align.START} />

              <SettingsToggle
                label="Auto-save chat history"
                value={autoSaveChat}
                configPath="ai.chat.autoSave"
              />

              <SettingsToggle
                label="Stream responses"
                value={streamResponses}
                configPath="ai.chat.streamResponses"
              />

              <SettingsToggle
                label="Enable debug logging"
                value={enableLogging}
                configPath="ai.chat.enableLogging"
              />

              <SettingsInput
                label="Chat Save Location"
                value={saveLocation}
                placeholder="~/.config/ags/chats"
                configPath="ai.chat.saveLocation"
                onChanged={(path) => {
                  log.debug("Save location updated:", path);
                }}
              />

              <SettingsDropdown
                label="Export Format"
                options={["Markdown", "JSON", "Plain Text"]}
                selected={exportFormat}
                configPath="ai.chat.exportFormat"
                onChanged={(idx) => {
                  const formats = ["markdown", "json", "txt"] as const;
                  configManager.setValue("ai.chat.exportFormat", formats[idx]);
                  log.debug("Export format changed:", formats[idx]);
                }}
              />
            </box>

            {/* Performance Settings */}
            <box vertical cssClasses={["spacing-v-10"]}>
              <label label="Performance" cssName="settings-subsection-title" halign={Gtk.Align.START} />

              <SettingsSlider
                label="Context Window (messages)"
                value={contextWindow}
                min={2}
                max={20}
                step={1}
                configPath="ai.chat.contextWindow"
                onChanged={(val) => {
                  log.debug("Context window updated:", val);
                }}
              />

              <SettingsSlider
                label="Response Timeout (seconds)"
                value={responseTimeout}
                min={10}
                max={120}
                step={10}
                configPath="ai.chat.responseTimeout"
                onChanged={(val) => {
                  log.debug("Response timeout updated:", val);
                }}
              />

              <SettingsSlider
                label="Retry Attempts"
                value={retryAttempts}
                min={0}
                max={5}
                step={1}
                configPath="ai.chat.retryAttempts"
                onChanged={(val) => {
                  log.debug("Retry attempts updated:", val);
                }}
              />
            </box>

            {/* Default Provider */}
            <box vertical cssClasses={["spacing-v-10"]}>
              <label label="Default Settings" cssName="settings-subsection-title" halign={Gtk.Align.START} />

              <SettingsDropdown
                label="Default AI Provider"
                options={["Claude", "Gemini", "ChatGPT", "Ollama"]}
                selected={defaultProvider}
                onChanged={(idx) => {
                  const providerIds = ["claude", "gemini", "gpt", "ollama"];
                  configManager.setValue("ai.defaultGPTProvider", providerIds[idx]);
                  log.debug("Default provider changed:", providerIds[idx]);
                }}
              />
            </box>

            {/* Actions */}
            <box vertical cssClasses={["spacing-v-10"]}>
              <label label="Actions" cssName="settings-subsection-title" halign={Gtk.Align.START} />

              <box cssClasses={["spacing-h-10"]}>
                <button cssName="settings-button-secondary" hexpand>
                  <box cssClasses={["spacing-h-10"]}>
                    <PhosphorIcon iconName={PhosphorIcons.Export} size={16} />
                    <label label="Export All Chats" />
                  </box>
                </button>

                <button cssName="settings-button-secondary" hexpand>
                  <box cssClasses={["spacing-h-10"]}>
                    <PhosphorIcon iconName={PhosphorIcons.Archive} size={16} />
                    <label label="Backup Settings" />
                  </box>
                </button>
              </box>

              <button cssName="settings-button-danger">
                <box cssClasses={["spacing-h-10"]}>
                  <PhosphorIcon iconName={PhosphorIcons.Trash} size={16} />
                  <label label="Clear All Chat History" />
                </box>
              </button>
            </box>
          </box>
        </SettingsSection>
      </box>
    </Gtk.ScrolledWindow>
  );
}