import { OllamaService } from "../services/ollama";
import { SystemMessage } from "../widget/sidebar/modules/ai/components/system-message";
import { serviceLogger as log } from "../utils/logger";

export interface AICommandProps {
  args: string;
  clearChat: () => void;
  appendChatContent: (content: any) => void;
  service: OllamaService;
}

export const OllamaCommands = (props: AICommandProps) => {
  const { args, clearChat, appendChatContent, service } = props;

  const commands: Record<string, (args: string) => void> = {
    clear: (_args: string) => {
      log.info("Clearing chat");
      clearChat();
      service.clear();
      appendChatContent(
        SystemMessage({
          content: "Chat cleared.",
          commandName: "Clear",
        }),
      );
    },
    
    model: (_args: string) => {
      const currentModel = service.modelName;
      const availableModels = service.availableModels;
      
      if (args.trim()) {
        // Try to set a new model
        const newModel = args.trim();
        if (availableModels.includes(newModel)) {
          service.modelName = newModel;
          appendChatContent(
            SystemMessage({
              content: `Model changed to: ${newModel}`,
              commandName: "Model",
            }),
          );
        } else {
          appendChatContent(
            SystemMessage({
              content: `Model "${newModel}" not found.\n\nAvailable models:\n${availableModels.join("\n")}`,
              commandName: "Error",
            }),
          );
        }
      } else {
        // Show current model and available models
        appendChatContent(
          SystemMessage({
            content: `Current model: ${currentModel}\n\nAvailable models:\n${availableModels.join("\n")}`,
            commandName: "Model",
          }),
        );
      }
    },
    
    models: (_args: string) => {
      const availableModels = service.availableModels;
      appendChatContent(
        SystemMessage({
          content: `Available models:\n${availableModels.join("\n")}`,
          commandName: "Models",
        }),
      );
    },
    
    help: (_args: string) => {
      appendChatContent(
        SystemMessage({
          content: `Available commands:
/clear - Clear chat history
/model [name] - Show current model or change to a new one
/models - List all available models
/temp [0.0-2.0] - Set temperature
/history - Toggle history mode
/prompt - Toggle assistant prompt
/save - Save chat history
/load - Load chat history
/help - Show this help message`,
          commandName: "Help",
        }),
      );
    },
    
    temp: (tempArg: string) => {
      const temp = parseFloat(tempArg);
      if (!isNaN(temp) && temp >= 0 && temp <= 2) {
        service.temperature = temp;
        appendChatContent(
          SystemMessage({
            content: `Temperature set to: ${temp}`,
            commandName: "Temperature",
          }),
        );
      } else {
        appendChatContent(
          SystemMessage({
            content: "Temperature must be between 0.0 and 2.0",
            commandName: "Error",
          }),
        );
      }
    },
    
    history: (_args: string) => {
      service.useHistory = !service.useHistory;
      appendChatContent(
        SystemMessage({
          content: `History mode: ${service.useHistory ? "enabled" : "disabled"}`,
          commandName: "History",
        }),
      );
    },
    
    prompt: (_args: string) => {
      service.assistantPrompt = !service.assistantPrompt;
      appendChatContent(
        SystemMessage({
          content: `Assistant prompt: ${service.assistantPrompt ? "enabled" : "disabled"}`,
          commandName: "Prompt",
        }),
      );
    },
    
    save: (_args: string) => {
      service.saveHistory();
      appendChatContent(
        SystemMessage({
          content: "Chat history saved.",
          commandName: "Save",
        }),
      );
    },
    
    load: (_args: string) => {
      service.loadHistory();
      clearChat();
      service.getMessages().forEach((msg, index) => {
        log.debug("Loading message", { index, role: msg.role });
      });
      appendChatContent(
        SystemMessage({
          content: "Chat history loaded.",
          commandName: "Load",
        }),
      );
    },
  };

  return commands;
};