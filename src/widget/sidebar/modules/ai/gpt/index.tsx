import { Widget, Gtk } from "astal/gtk4";
import { ChatSendButton } from "../index";
import ChatInput from "../components/chat-input";
import ChatMessage from "../components/chat-message";
import { AIName } from "../index";
import { Variable, bind } from "astal";
import { VarMap } from "../../../../../types/var-map";
import gptService, { GPTService } from "../../../../../services/gpt";
import { GPTCommands, AICommandProps } from "../../../../../handlers/gpt-commands";
import { SystemMessage } from "../components/system-message";
import ChatView from "../components/chat-view";
import CommandSuggestions from "../components/command-suggestions";
import { parseCommand } from "../../../../../utils";
import { sidebarLogger as log } from "../../../../../utils/logger";
import PhosphorIcon from "../../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../../utils/icons/types";

export interface GPTAIProps extends Widget.BoxProps { }

const WelcomeMessage = () => {
  return (
    <box cssName="ai-welcome-message" vexpand valign={Gtk.Align.CENTER}>
      <box cssClasses={["spacing-v-15"]} vertical>
        <label label="Welcome to ChatGPT!" />
        <label label="Type a message to start chatting" />
        <label label="Use / for commands" />
      </box>
    </box>
  );
};

export default function GPTAI(props: GPTAIProps) {
  log.debug("GPTAI initializing");
  const chatContent = new VarMap([]);

  const input = Variable("");
  const updateContent = Variable(false);
  const inputEntryRef = Variable<Gtk.Entry | null>(null);
  const showCommandSuggestions = Variable(false);
  const selectedModel = Variable(0);

  log.debug("Getting GPT service instance");

  // Get available models
  const availableModels = gptService.availableModels.map((model: string) => {
    // Create display names from model IDs
    const displayName = model
      .replace("gpt-", "GPT-")
      .replace("-turbo", " Turbo")
      .replace("-preview", " Preview")
      .replace("-16k", " (16K)");
    return { name: displayName, value: model };
  });

  // Find the index of the current model
  const currentModelIndex = availableModels.findIndex(m => m.value === gptService.modelName);
  if (currentModelIndex !== -1) {
    selectedModel.set(currentModelIndex);
  }

  gptService.connect("new-msg", (source: GPTService, id: number) => {
    log.debug("GPT service new message", { messageId: id });
    chatContent.set(
      id,
      <ChatMessage
        modelName={availableModels[selectedModel.get()].name}
        message={gptService.getMessage(id)}
      />,
    );
  });

  const appendChatContent = (newContent: Gtk.Widget) => {
    log.debug("Appending chat content");
    const maxKey = Math.max(...chatContent.get().map(([k]) => k));
    log.debug("Chat content", { lastKey: maxKey });
    chatContent.set(maxKey + 1, newContent);
    log.debug("Chat content updated", { size: chatContent.get().length });
    updateContent.set(true);
  };

  const clearChat = () => {
    chatContent.deleteAll();
  };

  const sendMessage = (message: string) => {
    const trimmedMessage = message.trim();
    log.info("Sending message", { message: trimmedMessage });

    // Check if text is empty
    if (trimmedMessage.length === 0) return;

    // Clear input
    input.set("");

    if (!gptService.isKeySet()) {
      // First message is treated as API key if no key is set
      gptService.key = trimmedMessage;
      appendChatContent(
        SystemMessage({
          content: `API Key saved to\n\`${gptService.keyPath}\``,
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
        service: gptService,
      };

      const commands = GPTCommands(aiCommand);
      log.debug("Processing command", { command });
      const commandHandler = commands[command];

      if (commandHandler) {
        commandHandler(args);
      } else {
        // Show available commands
        appendChatContent(
          SystemMessage({
            content: `Invalid command: "${command}"\n\nAvailable commands:\n/clear - Clear chat history\n/model - Show current AI model\n/key - Set API key\n/help - Show all commands\n/load - Load chat history\n/prompt - Add a prompt message`,
            commandName: "Error",
          }),
        );
      }
    } else {
      // Set the selected model before sending
      gptService.modelName = availableModels[selectedModel.get()].value;
      gptService.send(trimmedMessage);
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
            // Update the service model
            gptService.modelName = availableModels[selectedModel.get()].value;
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
          query={bind(input)}
          visible={bind(showCommandSuggestions)}
          handleSelect={handleCommandSelect}
        />
        <box cssName="sidebar-chat-textarea" valign={Gtk.Align.END}>
          <ChatInput
            autoFocus={true}
            aiName={AIName.GPT}
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