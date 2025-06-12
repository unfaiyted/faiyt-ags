import { Gtk } from "astal/gtk4";
import { GeminiService } from "../services/gemini";
import { SystemMessage } from "../widget/sidebar/modules/ai/components/system-message";
import { serviceLogger as log } from "../utils/logger";

export interface AICommandProps {
  args: string;
  clearChat: () => void;
  appendChatContent: (content: Gtk.Widget) => void;
  service: GeminiService;
}

export const GeminiCommands = ({
  args,
  clearChat,
  appendChatContent,
  service,
}: AICommandProps) => {
  const commands: Record<string, (args: string) => void> = {
    clear: () => {
      log.info("Clearing chat history");
      service.clear();
      clearChat();
      appendChatContent(
        SystemMessage({
          content: "Chat history cleared",
          commandName: "Clear",
        }),
      );
    },
    model: () => {
      const currentModel = service.modelName;
      appendChatContent(
        SystemMessage({
          content: `Current model: ${currentModel}`,
          commandName: "Model",
        }),
      );
    },
    key: (args: string) => {
      if (args && args.trim().length > 0) {
        service.key = args.trim();
        appendChatContent(
          SystemMessage({
            content: `API Key saved to\n\`${service.keyPath}\``,
            commandName: "API Key",
          }),
        );
      } else {
        appendChatContent(
          SystemMessage({
            content: "Please provide an API key.\nUsage: /key YOUR_API_KEY",
            commandName: "API Key",
          }),
        );
      }
    },
    help: () => {
      const helpText = `Available commands:
/clear - Clear chat history
/model - Show current AI model
/key [API_KEY] - Set API key
/history - Toggle history saving
/temp [0.0-2.0] - Set temperature
/safety - Toggle safety mode
/prompt - Toggle assistant prompt
/models - Cycle through available models
/load - Load chat history
/save - Save current chat
/help - Show this help message`;
      
      appendChatContent(
        SystemMessage({
          content: helpText,
          commandName: "Help",
        }),
      );
    },
    history: () => {
      service.useHistory = !service.useHistory;
      const status = service.useHistory ? "enabled" : "disabled";
      appendChatContent(
        SystemMessage({
          content: `History saving ${status}`,
          commandName: "History",
        }),
      );
    },
    temp: (args: string) => {
      if (args && args.trim().length > 0) {
        const temp = parseFloat(args.trim());
        if (!isNaN(temp) && temp >= 0 && temp <= 2) {
          service.temperature = temp;
          appendChatContent(
            SystemMessage({
              content: `Temperature set to ${temp}`,
              commandName: "Temperature",
            }),
          );
        } else {
          appendChatContent(
            SystemMessage({
              content: "Invalid temperature. Please use a value between 0 and 2.",
              commandName: "Temperature",
            }),
          );
        }
      } else {
        appendChatContent(
          SystemMessage({
            content: `Current temperature: ${service.temperature}`,
            commandName: "Temperature",
          }),
        );
      }
    },
    safety: () => {
      service.safe = !service.safe;
      const status = service.safe ? "enabled" : "disabled";
      appendChatContent(
        SystemMessage({
          content: `Safety mode ${status}`,
          commandName: "Safety",
        }),
      );
    },
    prompt: () => {
      service.assistantPrompt = !service.assistantPrompt;
      const status = service.assistantPrompt ? "enabled" : "disabled";
      appendChatContent(
        SystemMessage({
          content: `Assistant prompt ${status}`,
          commandName: "Prompt",
        }),
      );
    },
    models: () => {
      service.cycleModels = !service.cycleModels;
      const status = service.cycleModels ? "enabled" : "disabled";
      appendChatContent(
        SystemMessage({
          content: `Model cycling ${status}`,
          commandName: "Models",
        }),
      );
    },
    load: () => {
      service.loadHistory();
      appendChatContent(
        SystemMessage({
          content: "Chat history loaded",
          commandName: "Load",
        }),
      );
    },
    save: () => {
      service.saveHistory();
      appendChatContent(
        SystemMessage({
          content: "Chat history saved",
          commandName: "Save",
        }),
      );
    },
  };

  return commands;
};