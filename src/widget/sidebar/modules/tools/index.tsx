import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import { execAsync } from "astal/process";
import { PhosphorIcons } from "../../../utils/icons/types";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { createLogger } from "../../../../utils/logger";
import { setupCursorHover } from "../../../utils/buttons";

const log = createLogger('ToolsModule');

interface ToolItem {
  id: string;
  name: string;
  icon: PhosphorIcons;
  description: string;
  category: 'system' | 'development' | 'network' | 'monitoring';
  hasInput?: boolean;
  inputPlaceholder?: string;
  defaultInput?: string;
  useNotification?: boolean;
}

interface ToolState {
  expanded: boolean;
  loading: boolean;
  result: string | null;
  error: string | null;
  input: string;
}

const tools: ToolItem[] = [
  // Development Tools
  {
    id: "git-status",
    name: "Git Status",
    icon: PhosphorIcons.GitBranch,
    description: "Check git status of current project",
    category: 'development',
  },
  {
    id: "docker-status",
    name: "Docker Status",
    icon: PhosphorIcons.Package,
    description: "View running Docker containers",
    category: 'development',
  },
  {
    id: "port-scanner",
    name: "Port Scanner",
    icon: PhosphorIcons.NetworkSlash,
    description: "Check common development ports",
    category: 'network',
  },
  // System Tools
  {
    id: "clear-cache",
    name: "Clear Cache",
    icon: PhosphorIcons.Trash,
    description: "Clear system and app caches",
    category: 'system',
    useNotification: true,
  },
  {
    id: "system-info",
    name: "System Info",
    icon: PhosphorIcons.Info,
    description: "View system information",
    category: 'monitoring',
  },
  {
    id: "process-monitor",
    name: "Process Monitor",
    icon: PhosphorIcons.Monitor,
    description: "View top CPU/Memory processes",
    category: 'monitoring',
  },
  // Network Tools
  {
    id: "network-speed",
    name: "Network Speed",
    icon: PhosphorIcons.WifiHigh,
    description: "Test network speed",
    category: 'network',
  },
  {
    id: "dns-flush",
    name: "DNS Flush",
    icon: PhosphorIcons.ArrowsClockwise,
    description: "Flush DNS cache",
    category: 'network',
    useNotification: true,
  },
  // Development Environment
  {
    id: "node-version",
    name: "Node Version",
    icon: PhosphorIcons.FileJs,
    description: "Check Node.js and npm versions",
    category: 'development',
  },
  {
    id: "kill-port",
    name: "Kill Port",
    icon: PhosphorIcons.Stop,
    description: "Kill process on specified port",
    category: 'development',
    hasInput: true,
    inputPlaceholder: "Enter port number",
    defaultInput: "3000",
  }
];

// Tool actions mapping
const toolActions: Record<string, (input?: string) => Promise<string>> = {
  "git-status": async () => {
    const result = await execAsync(['bash', '-c', 'cd ~/Projects && git status']).catch(e => `Error: ${e}`);
    return result;
  },
  "docker-status": async () => {
    const result = await execAsync(['docker', 'ps', '--format', 'table {{.Names}}\t{{.Status}}']).catch(() => 'Docker not running or not installed');
    return result || 'No containers running';
  },
  "port-scanner": async () => {
    const ports = [3000, 5000, 5173, 8000, 8080, 9000];
    const result = await execAsync(['bash', '-c', `for port in ${ports.join(' ')}; do echo -n "Port $port: "; lsof -i :$port | grep LISTEN | head -1 | awk '{print $1" ("$2")"}' || echo "free"; done`]).catch(e => `Error: ${e}`);
    return result;
  },
  "clear-cache": async () => {
    await execAsync(['bash', '-c', 'rm -rf ~/.cache/thumbnails/*']).catch(e => `Error: ${e}`);
    return "Cache cleared successfully";
  },
  "system-info": async () => {
    const result = await execAsync(['bash', '-c', 'echo "CPU: $(nproc) cores\nMemory: $(free -h | grep Mem | awk \'{print $3"/"$2}\')\nDisk: $(df -h / | tail -1 | awk \'{print $3"/"$2}\')\nUptime: $(uptime -p)"']).catch(e => `Error: ${e}`);
    return result;
  },
  "process-monitor": async () => {
    const result = await execAsync(['bash', '-c', 'ps aux --sort=-%cpu | head -11 | tail -10 | awk \'{printf "%-20s %5s%% %5s%%\n", substr($11,1,20), $3, $4}\' | column -t']).catch(e => `Error: ${e}`);
    return `PROCESS              CPU%  MEM%\n${result}`;
  },
  "network-speed": async () => {
    return "Speed test started... This may take a moment.\nPlease wait for results.";
  },
  "dns-flush": async () => {
    await execAsync(['systemctl', 'restart', 'systemd-resolved']).catch(async () => {
      await execAsync(['resolvectl', 'flush-caches']).catch(() => 'Failed to flush DNS cache');
    });
    return "DNS cache flushed successfully";
  },
  "node-version": async () => {
    const result = await execAsync(['bash', '-c', 'echo "Node: $(node -v 2>/dev/null || echo \"not installed\")\nnpm: $(npm -v 2>/dev/null || echo \"not installed\")\nBun: $(bun -v 2>/dev/null || echo \"not installed\")\nYarn: $(yarn -v 2>/dev/null || echo \"not installed\")"']).catch(e => `Error: ${e}`);
    return result;
  },
  "kill-port": async (port = "3000") => {
    const checkResult = await execAsync(['bash', '-c', `lsof -i:${port} | grep LISTEN | head -1`]).catch(() => null);
    if (!checkResult) {
      return `No process found on port ${port}`;
    }

    await execAsync(['bash', '-c', `lsof -ti:${port} | xargs kill -9`]).catch(e => `Error: ${e}`);
    return `Process on port ${port} killed successfully`;
  }
};

export default function ToolModules(props: Widget.BoxProps) {
  const selectedCategory = Variable<string>('all');
  const searchQuery = Variable<string>('');

  // Create a map to store tool states
  const toolStates = new Map<string, Variable<ToolState>>();

  // Initialize tool states
  tools.forEach(tool => {
    toolStates.set(tool.id, Variable<ToolState>({
      expanded: false,
      loading: false,
      result: null,
      error: null,
      input: tool.defaultInput || '',
    }));
  });

  const filteredTools = Variable.derive(
    [selectedCategory, searchQuery],
    (category, query) => {
      return tools.filter(tool => {
        const matchesCategory = category === 'all' || tool.category === category;
        const matchesSearch = query === '' ||
          tool.name.toLowerCase().includes(query.toLowerCase()) ||
          tool.description.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    }
  );

  const categories = [
    { id: 'all', name: 'All', icon: PhosphorIcons.SquaresFour },
    { id: 'development', name: 'Dev', icon: PhosphorIcons.Code },
    { id: 'system', name: 'System', icon: PhosphorIcons.Desktop },
    { id: 'network', name: 'Network', icon: PhosphorIcons.WifiHigh },
    { id: 'monitoring', name: 'Monitor', icon: PhosphorIcons.ChartLine }
  ];

  const executeTool = async (tool: ToolItem, fromInput: boolean = false) => {
    const stateVar = toolStates.get(tool.id)!;
    const state = stateVar.get();

    // If clicking the main button and it's already expanded, just toggle
    if (!fromInput && state.expanded) {
      stateVar.set({ ...state, expanded: false });
      return;
    }

    // For tools without input, always execute when expanding
    // For tools with input, only execute if fromInput is true (play button clicked)
    const shouldExecute = !tool.hasInput || fromInput;

    // Expand first
    stateVar.set({ ...state, expanded: true, loading: shouldExecute, result: null, error: null });

    // Execute if needed
    if (shouldExecute) {
      // Small delay to ensure UI updates before async operation
      setTimeout(async () => {
        try {
          const action = toolActions[tool.id];
          if (action) {
            const result = await action(state.input);

            // Get current state again to ensure we have the latest
            const currentState = stateVar.get();

            if (tool.useNotification) {
              await execAsync(['notify-send', tool.name, result]);
              stateVar.set({ ...currentState, expanded: false, loading: false });
            } else {
              stateVar.set({ ...currentState, loading: false, result });
            }
          }
        } catch (error) {
          const currentState = stateVar.get();
          stateVar.set({ ...currentState, loading: false, error: (error as Error).toString() });
        }
      }, 50);
    }
  };

  return (
    <box
      {...props}
      vertical
      cssName="tools-module"
      cssClasses={["spacing-v-10"]}
    >
      {/* Search Bar */}
      <box cssName="tools-search-container">
        <entry
          cssName="tools-search"
          placeholderText="Search tools..."
          onChanged={(self) => searchQuery.set(self.text)}
          hexpand
        />
      </box>

      {/* Category Filter */}
      <box cssName="tools-categories" cssClasses={["spacing-h-5"]}>
        {categories.map(cat => (
          <button
            setup={setupCursorHover}
            cssName="tools-category-btn"
            cssClasses={bind(selectedCategory).as(selected =>
              selected === cat.id ? ["active"] : []
            )}
            onClicked={() => selectedCategory.set(cat.id)}
          >
            <box cssClasses={["spacing-h-5"]}>
              <PhosphorIcon iconName={cat.icon} cssName="tools-category-icon" size={16} />
              <label label={cat.name} />
            </box>
          </button>
        ))}
      </box>

      {/* Tools Grid */}
      <Gtk.ScrolledWindow
        vexpand
        cssName="tools-scroll"
      >
        <box
          vertical
          cssName="tools-grid"
          cssClasses={["spacing-v-10"]}
        >
          {bind(filteredTools).as(tools =>
            tools.length > 0 ? (
              <box cssName="tools-list" vertical cssClasses={["spacing-v-5"]}>
                {tools.map(tool => {
                  const stateVar = toolStates.get(tool.id)!;

                  return (
                    <box vertical cssName="tool-container">
                      <button
                        setup={setupCursorHover}
                        cssName="tool-item"
                        onClicked={() => executeTool(tool)}
                      >
                        <box cssClasses={["spacing-h-10"]}>
                          <box cssName="tool-icon-wrapper">
                            <PhosphorIcon marginStart={12} iconName={tool.icon} cssName="tool-icon" size={24} />
                          </box>
                          <box vertical hexpand>
                            <label
                              cssName="tool-name"
                              label={tool.name}
                              halign={Gtk.Align.START}
                            />
                            <label
                              cssName="tool-description"
                              label={tool.description}
                              halign={Gtk.Align.START}
                              wrap
                            />
                          </box>
                          {bind(stateVar).as(state => (
                            <PhosphorIcon
                              iconName={state.expanded ? PhosphorIcons.CaretDown : PhosphorIcons.CaretRight}
                              cssName="tool-arrow"
                              size={16}
                            />
                          ))}
                        </box>
                      </button>

                      {/* Expandable content */}
                      {bind(stateVar).as(state => state.expanded ? (
                        <box vertical cssName="tool-expanded" cssClasses={["spacing-v-10"]}>
                          {/* Input field for tools that need it */}
                          {tool.hasInput && (
                            <box cssName="tool-input-container" cssClasses={["spacing-h-10"]}>
                              <entry
                                cssName="tool-input"
                                placeholderText={tool.inputPlaceholder}
                                text={state.input}
                                onChanged={(self) => {
                                  const currentState = stateVar.get();
                                  // Only update if the value actually changed to prevent recursion
                                  if (currentState.input !== self.text) {
                                    stateVar.set({ ...currentState, input: self.text });
                                  }
                                }}
                                hexpand
                              />
                              <button
                                setup={setupCursorHover}
                                cssName="tool-execute-btn"
                                onClicked={() => executeTool(tool, true)}
                              >
                                <PhosphorIcon iconName={PhosphorIcons.Play} size={16} />
                              </button>
                            </box>
                          )}

                          {/* Results display */}
                          {state.loading && (
                            <box cssName="tool-loading" cssClasses={["spacing-h-10"]}>
                              <Gtk.Spinner spinning={true} />
                              <label label="Loading..." />
                            </box>
                          )}

                          {state.result && (
                            <box cssName="tool-result">
                              <label
                                label={state.result}
                                cssName="tool-result-text"
                                halign={Gtk.Align.START}
                                selectable={true}
                                wrap
                              />
                            </box>
                          )}

                          {state.error && (
                            <box cssName="tool-error">
                              <label
                                label={state.error}
                                cssName="tool-error-text"
                                halign={Gtk.Align.START}
                                wrap
                              />
                            </box>
                          )}
                        </box>
                      ) : <label />)}
                    </box>
                  );
                })}
              </box>
            ) : (
              <box cssName="tools-empty" vertical valign={Gtk.Align.CENTER} vexpand>
                <PhosphorIcon iconName={PhosphorIcons.MagnifyingGlass} cssName="empty-icon" size={48} />
                <label label="No tools found" cssName="empty-text" />
              </box>
            )
          )}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  );
}
