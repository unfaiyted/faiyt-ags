import { Widget, Gtk } from "astal/gtk4";
import { ChatSendButton } from "../index";
import ChatInput from "../components/chat-input";
import ChatMessage from "../components/chat-message";
import { AIName } from "../index";
import { Variable, bind } from "astal";
import { VarMap } from "../../../../../types/var-map";
import ollamaService, { OllamaService } from "../../../../../services/ollama";
import { OllamaCommands, AICommandProps } from "../../../../../handlers/ollama-commands";
import { SystemMessage } from "../components/system-message";
import ChatView from "../components/chat-view";
import CommandSuggestions from "../components/command-suggestions";
import { parseCommand } from "../../../../../utils";
import { sidebarLogger as log } from "../../../../../utils/logger";
import PhosphorIcon from "../../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../../utils/icons/types";
import configManager from "../../../../../services/config-manager";

export interface OllamaAIProps extends Widget.BoxProps { }

const WelcomeMessage = () => {
  return (
    <box cssName="ai-welcome-message" vexpand valign={Gtk.Align.CENTER}>
      <box cssClasses={["spacing-v-15"]} vertical>
        <label label="Welcome to Ollama AI!" />
        <label label="Type a message to start chatting" />
        <label label="Use / for commands" />
      </box>
    </box>
  );
};

export default function OllamaAI(props: OllamaAIProps) {
  log.debug("OllamaAI initializing");
  const chatContent = new VarMap([]);

  const input = Variable("");
  const updateContent = Variable(false);
  const inputEntryRef = Variable<Gtk.Entry | null>(null);
  const showCommandSuggestions = Variable(false);
  const selectedModel = Variable(0);
  const availableModels = Variable<string[]>([]);

  log.debug("Getting Ollama service instance");

  // Update available models when service reports them
  ollamaService.connect("has-key", (source: OllamaService, hasKey: boolean) => {
    if (hasKey) {
      const models = ollamaService.availableModels;
      log.debug("Ollama models available", { models });
      availableModels.set(models);
      
      // Set current model index
      const currentModelIndex = models.indexOf(ollamaService.modelName);
      if (currentModelIndex !== -1) {
        selectedModel.set(currentModelIndex);
      }
    }
  });

  ollamaService.connect("new-msg", (source: OllamaService, id: number) => {
    log.debug("Ollama service new message", { messageId: id });
    const models = availableModels.get();
    const modelName = models.length > 0 ? models[selectedModel.get()] : ollamaService.modelName;
    
    chatContent.set(
      id,
      <ChatMessage
        modelName={modelName}
        message={ollamaService.getMessage(id)}
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

    if (!ollamaService.isKeySet()) {
      appendChatContent(
        SystemMessage({
          content: `Ollama service is not running.\n\nPlease start Ollama with:\n\`ollama serve\``,
          commandName: "Error",
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
        service: ollamaService,
      };

      const commands = OllamaCommands(aiCommand);
      log.debug("Processing command", { command });
      const commandHandler = commands[command];

      if (commandHandler) {
        commandHandler(args);
      } else {
        // Show available commands
        appendChatContent(
          SystemMessage({
            content: `Invalid command: "${command}"\n\nUse /help to see available commands.`,
            commandName: "Error",
          }),
        );
      }
    } else {
      // Set the selected model before sending
      const models = availableModels.get();
      if (models.length > 0) {
        ollamaService.modelName = models[selectedModel.get()];
      }
      ollamaService.send(trimmedMessage);
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
            const models = availableModels.get();
            if (models.length > 0) {
              selectedModel.set((selectedModel.get() + 1) % models.length);
              ollamaService.modelName = models[selectedModel.get()];
            }
          }}
          sensitive={bind(availableModels).as(models => models.length > 0)}
        >
          <box cssClasses={["spacing-h-10"]}>
            <PhosphorIcon iconName={PhosphorIcons.Robot} size={16} />
            <label label={bind(availableModels).as(models => {
              if (models.length === 0) return "No models available";
              const idx = selectedModel.get();
              return models[idx] || models[0];
            })} />
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
            aiName={AIName.OLLAMA}
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