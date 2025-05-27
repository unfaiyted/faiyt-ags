import { Widget, Gtk } from "astal/gtk4";
import GObject from "gi://GObject";
import { ChatSendButton } from "../index";
import ChatInput from "../components/chat-input";
import ChatMessage from "../components/chat-message";
import { AIName } from "../index";
import { Variable, bind } from "astal";
import { VarMap } from "../../../../../types/var-map";
import { ClaudeService } from "../../../../../services/claude";
import { ClaudeCommands, AICommandProps } from "../../../../../handlers/claude-commands";
import { SystemMessage } from "../components/system-message";
import ChatView from "../components/chat-view";
import CommandSuggestions from "../components/command-suggestions";
import config from "../../../../../utils/config";
import { parseCommand, enableClickthrough } from "../../../../../utils";
import { sidebarLogger as log } from "../../../../../utils/logger";
import { ChatContent } from "../components/chat-content";
import PhosphorIcon from "../../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../../utils/icons/types";

export interface ClaudeAIProps extends Widget.BoxProps { }

const WelcomeMessage = () => {
  return (
    <box cssName="ai-welcome-message" vexpand valign={Gtk.Align.CENTER}>
      <box cssClasses={["spacing-v-15"]} vertical>
        <label label="Welcome to Claude AI!" />
        <label label="Type a message to start chatting" />
        <label label="Use / for commands" />
      </box>
    </box>
  );
};

export default function ClaudeAI(props: ClaudeAIProps) {
  log.debug("ClaudeAI initializing");
  const chatContent = new VarMap([]);

  const input = Variable("");
  const updateContent = Variable(false);
  const inputEntryRef = Variable<Gtk.Entry | null>(null);
  const showCommandSuggestions = Variable(false);
  const selectedModel = Variable(0);

  log.debug("Starting Claude service");
  const claudeService = new ClaudeService();

  const availableModels = [
    { name: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20241022" },
    { name: "Claude 3 Opus", value: "claude-3-opus-20240229" },
    { name: "Claude 3 Haiku", value: "claude-3-haiku-20240307" },
  ];

  // The service will emit new-msg for each initial message automatically

  claudeService.connect("new-msg", (source: ClaudeService, id: number) => {
    log.debug("Claude service new message", { messageId: id });
    chatContent.set(
      id,
      <ChatMessage
        modelName="Claude 3.5 Sonnet"
        message={claudeService.getMessage(id)}
      />,
    );
  });

  const appendChatContent = (newContent: Gtk.Widget) => {
    log.debug("Appending chat content");
    const maxKey = Math.max(...chatContent.get().map(([k]) => k));
    // existingContent.push();
    log.debug("Chat content", { lastKey: maxKey });
    chatContent.set(maxKey + 1, newContent);
    log.debug("Chat content updated", { size: chatContent.get().length });
    updateContent.set(true);
  };

  const clearChat = () => {
    // chatContent.set([]);
    chatContent.deleteAll();
  };

  const sendMessage = (message: string) => {
    const trimmedMessage = message.trim();
    log.info("Sending message", { message: trimmedMessage });

    // Check if text is empty
    if (trimmedMessage.length === 0) return;

    // Clear input
    input.set("");

    if (!claudeService.isKeySet()) {
      claudeService.key = trimmedMessage;
      appendChatContent(
        SystemMessage({
          content: `API Key saved to\n\`${claudeService.keyPath}\``,
          commandName: "API Key",
        }),
      );
      return;
    }

    // Commands
    if (trimmedMessage.startsWith("/")) {
      const { command, args } = parseCommand(trimmedMessage);

      const aiCommand: AICommandProps = {
        args,
        clearChat,
        appendChatContent,
        service: claudeService,
      };

      const commands = ClaudeCommands(aiCommand);
      log.debug("Processing command", { command });
      const commandHandler = commands[command];

      if (commandHandler) {
        commandHandler(args);
      } else {
        // Show available commands
        appendChatContent(
          SystemMessage({
            content: `Invalid command: "${command}"\n\nAvailable commands:\n/clear - Clear chat history\n/model - Switch AI model\n/help - Show this help`,
            commandName: "Error",
          }),
        );
      }
    } else {
      claudeService.send(trimmedMessage);
    }
  };

  const sendMessageReturn = () => {
    sendMessage(input.get());
  };

  const sendMessageClick = () => {
    sendMessage(input.get());
  };

  const handleInputChanged = (text: string) => {
    input.set(text);
    // Show command suggestions when typing a command
    showCommandSuggestions.set(text.startsWith("/"));
  };

  const handleCommandSelect = (command: string) => {
    input.set(command + " ");
    showCommandSuggestions.set(false);
    inputEntryRef.get()?.grab_focus();
  };

  chatContent.subscribe((content) => {
    log.debug("Chat content subscription triggered", { contentSize: content.length });
  });

  // const chatPlaceholder = Widget.Label({
  //   cssName: "txt-subtext txt-smallie margin-left-5",
  //   halign: Gtk.Align.START,
  //   valign: Gtk.Align.CENTER,
  //   label: "Enter Text...",
  //   // label: APIS[currentApiId].placeholderText,
  // });
  //
  // const ChatPlaceholderRevealer = Widget.Revealer({
  //   revealChild: true,
  //   transitionType: Gtk.RevealerTransitionType.CROSSFADE,
  //   transitionDuration: config.animations.durationLarge,
  //   child: chatPlaceholder,
  //   setup: enableClickthrough,
  // });

  return (
    <box {...props} vertical cssName="ai-chat-container"
      setup={(self) => {
        // Focus the input when the AI tab becomes visible
        self.connect("map", () => {
          log.debug("AI chat container mapped, focusing input");
          setTimeout(() => {
            const entry = inputEntryRef.get();
            if (entry) {
              entry.grab_focus();
            }
          }, 100);
        });
      }}
    >
      {/* Model selector header */}
      <box cssName="ai-chat-header" vexpand={false}>
        <button
          cssName="ai-model-selector"
          onClicked={() => {
            // Cycle through models
            selectedModel.set((selectedModel.get() + 1) % availableModels.length);
          }}
        >
          <box cssClasses={["spacing-h-10"]}>
            <PhosphorIcon iconName={PhosphorIcons.Robot} size={16} />
            <label label={bind(selectedModel).as(idx => availableModels[idx].name)} />
            <PhosphorIcon iconName={PhosphorIcons.CaretDown} size={12} />
          </box>
        </button>
      </box>

      <ChatView>
        <box cssName="spacing-v-10" vertical>
          {bind(chatContent).as((v) => {
            return v.map(([num, w]) => w);
          })}
        </box>
      </ChatView>

      <box vertical vexpand={false}>
        <CommandSuggestions
          query={input}
          visible={showCommandSuggestions}
          onSelect={handleCommandSelect}
        />
        <box cssName="sidebar-chat-textarea" valign={Gtk.Align.END}>
          <ChatInput
            autoFocus={true}
            aiName={AIName.CLAUDE}
            handleSubmit={sendMessageReturn}
            handleChanged={handleInputChanged}
            entryRef={inputEntryRef}
            value={input}
            hexpand
          />
          <ChatSendButton onClicked={sendMessageClick} />
        </box>
      </box>
    </box>
  );
}
