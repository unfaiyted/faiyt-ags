import { Widget, Gtk } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import PhosphorIcon from "../../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../../utils/icons/types";

interface Command {
  name: string;
  description: string;
  icon: PhosphorIcons;
}

const availableCommands: Command[] = [
  { name: "/clear", description: "Clear chat history", icon: PhosphorIcons.Trash },
  { name: "/load", description: "Load chat history", icon: PhosphorIcons.DownloadSimple },
  { name: "/model", description: "Show current model", icon: PhosphorIcons.Robot },
  { name: "/prompt", description: "Add a user message", icon: PhosphorIcons.ChatText },
  { name: "/key", description: "Manage API key", icon: PhosphorIcons.Key },
  { name: "/help", description: "Show available commands", icon: PhosphorIcons.Question },
];

export interface CommandSuggestionsProps extends Widget.BoxProps {
  query: Binding<string>;
  visible: Binding<boolean>;
  handleSelect: (command: string) => void;
}

export const CommandSuggestions = (props: CommandSuggestionsProps) => {
  const { query, visible, onSelect, ...boxProps } = props;

  const filteredCommands = Variable.derive([query], (q) => {
    if (!q.startsWith("/")) return [];

    const searchTerm = q.toLowerCase();

    // If only "/" is typed, show all commands (up to 5)
    if (q === "/") {
      return availableCommands.slice(0, 5);
    }

    // Otherwise filter based on the search term
    return availableCommands
      .filter(cmd => cmd.name.toLowerCase().startsWith(searchTerm))
      .slice(0, 5);
  });

  return (
    <revealer
      revealChild={bind(visible)}
      transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
      transitionDuration={200}
    >
      <box
        {...boxProps}
        cssName="command-suggestions"
        vertical
      >
        {bind(filteredCommands).as(commands =>
          commands.length > 0 ? (
            <>
              {commands.map((cmd, index) => (
                <button
                  cssName="command-suggestion-item"
                  cssClasses={index === 0 ? ["active"] : []}
                  onClicked={() => props.handleSelect(cmd.name)}
                >
                  <box cssClasses={["spacing-h-10"]}>
                    <PhosphorIcon iconName={cmd.icon} size={16} cssName="command-icon" />
                    <box vertical hexpand>
                      <label
                        cssName="command-name"
                        label={cmd.name}
                        halign={Gtk.Align.START}
                      />
                      <label
                        cssName="command-desc"
                        label={cmd.description}
                        halign={Gtk.Align.START}
                      />
                    </box>
                  </box>
                </button>
              ))}
            </>
          ) : null
        )}
      </box>
    </revealer>
  );
};

export default CommandSuggestions;
