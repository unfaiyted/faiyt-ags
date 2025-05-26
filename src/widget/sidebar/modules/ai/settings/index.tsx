import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import PhosphorIcon from "../../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../../utils/icons/types";
import { sidebarLogger as log } from "../../../../../utils/logger";

export interface AISettingsProps extends Widget.BoxProps { }

interface AIProvider {
  id: string;
  name: string;
  icon: PhosphorIcons;
  hasApiKey: boolean;
  models: string[];
  selectedModel: number;
  settings: {
    temperature?: number;
    maxTokens?: number;
    contextLength?: number;
  };
}

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

const SettingsInput = ({ label, value, placeholder, type = "text", onChanged }: {
  label: string;
  value: Variable<string>;
  placeholder?: string;
  type?: "text" | "password" | "number";
  onChanged?: (value: string) => void;
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
        }}
      />
    </box>
  );
};

const SettingsSlider = ({ label, value, min = 0, max = 1, step = 0.1, onChanged }: {
  label: string;
  value: Variable<number>;
  min?: number;
  max?: number;
  step?: number;
  onChanged?: (value: number) => void;
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
        }}
      />
    </box>
  );
};

const SettingsDropdown = ({ label, options, selected, onChanged }: {
  label: string;
  options: string[];
  selected: Variable<number>;
  onChanged?: (index: number) => void;
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

const MCPServerItem = ({ server, onToggle, onRemove }: {
  server: { id: string; name: string; url: string; enabled: boolean };
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

const AIProviderSettings = ({ provider }: { provider: AIProvider }) => {
  const apiKey = Variable("");
  const temperature = Variable(provider.settings.temperature || 0.7);
  const maxTokens = Variable(provider.settings.maxTokens || 2048);
  const selectedModel = Variable(provider.selectedModel);

  return (
    <box vertical cssName="ai-provider-settings" cssClasses={["spacing-v-15"]}>
      <box cssName="ai-provider-header" cssClasses={["spacing-h-10"]}>
        <PhosphorIcon iconName={provider.icon} size={24} />
        <label label={provider.name} cssName="ai-provider-name" />
        {provider.hasApiKey && (
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
          onChanged={(key) => {
            log.debug(`API key updated for ${provider.id}`);
          }}
        />

        <SettingsDropdown
          label="Model"
          options={provider.models}
          selected={selectedModel}
          onChanged={(idx) => {
            log.debug(`Model changed for ${provider.id}:`, provider.models[idx]);
          }}
        />

        <SettingsSlider
          label="Temperature"
          value={temperature}
          min={0}
          max={2}
          step={0.1}
          onChanged={(val) => {
            log.debug(`Temperature updated for ${provider.id}:`, val);
          }}
        />

        <SettingsSlider
          label="Max Tokens"
          value={maxTokens}
          min={256}
          max={4096}
          step={256}
          onChanged={(val) => {
            log.debug(`Max tokens updated for ${provider.id}:`, val);
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

  const providers: AIProvider[] = [
    {
      id: "claude",
      name: "Claude",
      icon: PhosphorIcons.Brain,
      hasApiKey: true,
      models: ["Claude 3.5 Sonnet", "Claude 3 Opus", "Claude 3 Haiku"],
      selectedModel: 0,
      settings: {
        temperature: 0.7,
        maxTokens: 2048,
        contextLength: 100000,
      }
    },
    {
      id: "gemini",
      name: "Gemini",
      icon: PhosphorIcons.Diamond,
      hasApiKey: false,
      models: ["Gemini Pro", "Gemini Pro Vision"],
      selectedModel: 0,
      settings: {
        temperature: 0.9,
        maxTokens: 2048,
      }
    },
    {
      id: "gpt",
      name: "ChatGPT",
      icon: PhosphorIcons.Chat,
      hasApiKey: false,
      models: ["GPT-4", "GPT-3.5 Turbo"],
      selectedModel: 0,
      settings: {
        temperature: 0.7,
        maxTokens: 2048,
      }
    },
    {
      id: "ollama",
      name: "Ollama",
      icon: PhosphorIcons.Alien,
      hasApiKey: true,
      models: ["llama2", "mistral", "codellama"],
      selectedModel: 0,
      settings: {
        temperature: 0.8,
        maxTokens: 2048,
      }
    }
  ];

  const enableMCP = Variable(false);
  const mcpServerUrl = Variable("");
  const autoSaveChat = Variable(true);
  const streamResponses = Variable(true);
  const contextWindow = Variable(4);
  const responseTimeout = Variable(30);
  const retryAttempts = Variable(3);
  const saveLocation = Variable("~/.config/ags/chats");
  const exportFormat = Variable(0);
  const enableLogging = Variable(false);
  const defaultProvider = Variable(0);
  const mcpServers = Variable<Array<{ id: string, name: string, url: string, enabled: boolean }>>([]);

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
            {providers.map((provider, _idx) => (
              <AIProviderSettings provider={provider} />
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
            <box cssClasses={["spacing-h-10"]}>
              <button
                cssName="settings-toggle"
                cssClasses={bind(enableMCP).as(active => active ? ["active"] : [])}
                onClicked={() => enableMCP.set(!enableMCP.get())}
              >
                <box cssClasses={["toggle-indicator"]} />
              </button>
              <label label="Enable MCP Server Integration" />
            </box>

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
                    value={Variable("")}
                    placeholder="My MCP Server"
                  />
                  <SettingsInput
                    label="Server URL"
                    value={mcpServerUrl}
                    placeholder="http://localhost:3000"
                    onChanged={(url) => {
                      log.debug("MCP Server URL updated:", url);
                    }}
                  />
                  <button cssName="settings-button-secondary">
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
                            }}
                            onRemove={() => {
                              mcpServers.set(mcpServers.get().filter(s => s.id !== server.id));
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
                    value={Variable(10)}
                    min={5}
                    max={60}
                    step={5}
                  />
                  <box cssClasses={["spacing-h-10"]}>
                    <button
                      cssName="settings-toggle"
                      cssClasses={Variable(true).get() ? ["active"] : []}
                      onClicked={() => { }}
                    >
                      <box cssClasses={["toggle-indicator"]} />
                    </button>
                    <label label="Auto-reconnect on failure" />
                  </box>
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

              <box cssClasses={["spacing-h-10"]}>
                <button
                  cssName="settings-toggle"
                  cssClasses={bind(autoSaveChat).as(active => active ? ["active"] : [])}
                  onClicked={() => autoSaveChat.set(!autoSaveChat.get())}
                >
                  <box cssClasses={["toggle-indicator"]} />
                </button>
                <label label="Auto-save chat history" />
              </box>

              <box cssClasses={["spacing-h-10"]}>
                <button
                  cssName="settings-toggle"
                  cssClasses={bind(streamResponses).as(active => active ? ["active"] : [])}
                  onClicked={() => streamResponses.set(!streamResponses.get())}
                >
                  <box cssClasses={["toggle-indicator"]} />
                </button>
                <label label="Stream responses" />
              </box>

              <box cssClasses={["spacing-h-10"]}>
                <button
                  cssName="settings-toggle"
                  cssClasses={bind(enableLogging).as(active => active ? ["active"] : [])}
                  onClicked={() => enableLogging.set(!enableLogging.get())}
                >
                  <box cssClasses={["toggle-indicator"]} />
                </button>
                <label label="Enable debug logging" />
              </box>

              <SettingsInput
                label="Chat Save Location"
                value={saveLocation}
                placeholder="~/.config/ags/chats"
                onChanged={(path) => {
                  log.debug("Save location updated:", path);
                }}
              />

              <SettingsDropdown
                label="Export Format"
                options={["Markdown", "JSON", "Plain Text"]}
                selected={exportFormat}
                onChanged={(idx) => {
                  log.debug("Export format changed:", ["markdown", "json", "txt"][idx]);
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
                options={providers.map(p => p.name)}
                selected={defaultProvider}
                onChanged={(idx) => {
                  log.debug("Default provider changed:", providers[idx].name);
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
