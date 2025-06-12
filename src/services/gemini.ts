import Gio from "gi://Gio";
import GLib from "gi://GLib";
import Soup from "gi://Soup?version=3.0";
import { GObject, register, signal, property } from "astal/gobject";
import { fileExists } from "../utils";
import AstalIO from "gi://AstalIO";
import { execAsync, exec } from "astal/process";
import configManager from "./config-manager";
import {
  Role,
  Content,
  GenerateContentResponse,
  ServiceMessage,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold,
} from "../types/gemini";
import { serviceLogger as log } from "../utils/logger";

const config = configManager.config;
const AI_DIR = `${config.dir.state}/ags/user/ai`;
const HISTORY_DIR = `${AI_DIR}/chats/`;
const HISTORY_FILENAME = `gemini.txt`;
const HISTORY_PATH = HISTORY_DIR + HISTORY_FILENAME;
const ENV_KEY = GLib.getenv("GOOGLE_API_KEY");
const ONE_CYCLE_COUNT = 3;

// Ensure all required directories exist
exec(`mkdir -p ${AI_DIR}`);
exec(`mkdir -p ${HISTORY_DIR}`);

if (!fileExists(`${config.dir.config}/gemini_history.json`)) {
  execAsync([
    `bash`,
    `-c`,
    `touch ${config.dir.config}/gemini_history.json`,
  ]).catch(err => log.error("Failed to create gemini history file", { error: err }));
  AstalIO.write_file(`${config.dir.config}/gemini_history.json`, "[ ]");
}

@register()
export class GeminiMessage extends GObject.Object {
  private _role: Role = Role.USER;
  private _parts = [{ text: "" }];
  private _isThinking = true;
  private _isDone = false;
  private _rawData = "";

  @signal(String) declare delta: (_delta: string) => void;

  constructor(
    initialRole: Role,
    initialContent: string,
    thinking = true,
    done = false,
  ) {
    super();
    this._role = initialRole;
    this._parts = [{ text: initialContent }];
    this._isThinking = thinking;
    this._isDone = done;
    if (initialRole == Role.USER) {
      log.debug("GeminiMessage initialized with user role", { initialRole });
      this.done = true;
      this._isDone = true;
      this.emit("changed");
      this.emit("delta", initialContent);
      this.emit("finished", this);
    }
  }

  get rawData() {
    return this._rawData;
  }

  @signal()
  changed() {
    log.verbose("GeminiMessage changed signal emitted");
  }

  @signal(GeminiMessage)
  finished(_message: GeminiMessage) {
    log.debug("GeminiMessage finished signal emitted");
    _message._isDone = true;
    _message._isThinking = false;
  }

  set rawData(value) {
    this._rawData = value;
  }

  @property(Boolean)
  get done() {
    return this._isDone;
  }
  set done(isDone: boolean) {
    this._isDone = isDone;
    this.notify("done");
  }

  get role() {
    return this._role;
  }
  set role(role) {
    this._role = role;
    this.emit("changed");
  }

  @property(String)
  get content() {
    return this._parts.map((part) => part.text).join();
  }
  set content(content) {
    this._parts = [{ text: content }];
    this.notify("content");
    this.emit("changed");
  }

  get parts() {
    return this._parts;
  }

  @property(Boolean)
  get thinking() {
    return this._isThinking;
  }

  set thinking(value) {
    this._isThinking = value;
    this.notify("thinking");
    this.emit("changed");
  }

  addDelta(delta: string) {
    if (this._isThinking) {
      this._isThinking = false;
      this.content = delta;
    } else {
      this.content += delta;
    }
    this.emit("delta", delta);
  }

}

// Initial conversation examples
const initMessages: GeminiMessage[] = [
  new GeminiMessage(
    Role.USER,
    "You are an assistant on a sidebar of a Wayland Linux desktop. Please always use a casual tone when answering your questions, unless requested otherwise or making writing suggestions. These are the steps you should take to respond to the user's queries:\n1. If it's a writing- or grammar-related question or a sentence in quotation marks, Please point out errors and correct when necessary using underlines, and make the writing more natural where appropriate without making too major changes. If you're given a sentence in quotes but is grammatically correct, explain briefly concepts that are uncommon.\n2. If it's a question about system tasks, give a bash command in a code block with brief explanation.\n3. Otherwise, when asked to summarize information or explaining concepts, you are should use bullet points and headings. For mathematics expressions, you *have to* use LaTeX within a code block with the language set as \"latex\". \nNote: Use casual language, be short, while ensuring the factual correctness of your response. If you are unsure or don't have enough information to provide a confident answer, simply say \"I don't know\" or \"I'm not sure.\". \nThanks!",
    true,
    false,
  ),
  new GeminiMessage(Role.MODEL, "Got it! I'll help you out with a casual, friendly tone. Whether you need grammar fixes, bash commands, or explanations, I'm here to help!", false, false),
];

@register()
export class GeminiService extends GObject.Object {
  private static _instance: GeminiService | null = null;

  @signal() declare initialized: (isInit: boolean) => {};
  @signal(Number) declare newMsg: (msgId: number) => {};
  @signal(Boolean) declare hasKey: (hasKey: boolean) => {};

  _assistantPrompt = config.ai.enhancements;
  _cycleModels = false;
  _usingHistory = config.ai.useHistory;
  _key = "";
  _requestCount = 0;
  _safe = config.ai.safety;
  _temperature = config.ai.defaultTemperature;
  _messages: GeminiMessage[] = [];
  _modelIndex = 0;
  _decoder = new TextDecoder();

  constructor() {
    super();
    
    if (GeminiService._instance) {
      return GeminiService._instance;
    }
    
    GeminiService._instance = this;

    log.info("GeminiService initializing");

    // Get API key from ConfigManager or environment
    const geminiConfig = configManager.getValue("ai.providers.gemini");
    log.debug("Gemini config from ConfigManager", { 
      hasConfig: !!geminiConfig,
      hasApiKey: !!geminiConfig?.apiKey,
      configKeys: geminiConfig ? Object.keys(geminiConfig) : []
    });
    
    if (geminiConfig?.apiKey) {
      this._key = geminiConfig.apiKey;
      log.info("Using API key from user config", { 
        keyLength: geminiConfig.apiKey.length,
        keyPrefix: geminiConfig.apiKey.substring(0, 10) + "..."
      });
    } else if (ENV_KEY) {
      this._key = ENV_KEY;
      log.info("Using API key from environment variable (fallback)");
    } else {
      log.warn("No API key found in config or environment");
      
      // Try to load from user config one more time
      configManager.loadConfig();
      const retryConfig = configManager.getValue("ai.providers.gemini");
      if (retryConfig?.apiKey) {
        this._key = retryConfig.apiKey;
        log.info("Found API key after config reload", { 
          keyLength: retryConfig.apiKey.length 
        });
      } else {
        this.emit("has-key", false);
      }
    }

    // Set up other config values
    if (geminiConfig) {
      this._cycleModels = geminiConfig.cycleModels || false;
      this._temperature = geminiConfig.temperature || config.ai.defaultTemperature;
    }

    log.debug("API key status", { 
      hasKey: this._key.length > 0,
      keyLength: this._key.length 
    });

    if (this._usingHistory) this.loadHistory();
    else this._messages = this._assistantPrompt ? [...initMessages] : [];

    log.debug("Initial messages loaded", { count: this._messages.length });
    
    // Emit new-msg for each initial message
    this._messages.forEach((msg, index) => {
      this.emit("new-msg", index);
    });
    
    log.info("GeminiService initialized");
    this.emit("initialized");
  }
  
  getMessages() {
    return this._messages;
  }
  
  setApiKey(key: string) {
    log.info("Updating API key", { keyLength: key.length });
    this._key = key;
    this.emit("has-key", key.length > 0);
    
    // Also update the config
    configManager.setAPIKey("gemini", key);
  }
  
  refreshApiKey() {
    const geminiConfig = configManager.getValue("ai.providers.gemini");
    
    if (geminiConfig?.apiKey) {
      this._key = geminiConfig.apiKey;
      log.info("Refreshed API key from user config", { 
        keyLength: this._key.length 
      });
    } else if (ENV_KEY) {
      this._key = ENV_KEY;
      log.info("Using API key from environment variable (fallback)");
    } else {
      this._key = "";
      log.warn("No API key found after refresh");
    }
    
    this.emit("has-key", this._key.length > 0);
  }

  get modelName() {
    const models = configManager.getValue("ai.providers.gemini.models") || [];
    return models[this._modelIndex] || models[0] || "gemini-1.5-flash";
  }
  
  set modelName(model: string) {
    const models = configManager.getValue("ai.providers.gemini.models") || [];
    const index = models.indexOf(model);
    if (index !== -1) {
      this._modelIndex = index;
      log.debug("Model changed", { model, index });
    }
  }

  get keyPath() {
    return "ai.providers.gemini.apiKey";
  }
  get key() {
    return this._key;
  }
  set key(keyValue) {
    this._key = keyValue;
    configManager.setAPIKey("gemini", keyValue);
    log.info("API key saved successfully");
    this.emit("has-key", true);
  }

  get cycleModels() {
    return this._cycleModels;
  }
  set cycleModels(value) {
    this._cycleModels = value;
    const models = configManager.getValue("ai.providers.gemini.models") || [];
    if (!value) this._modelIndex = 0;
    else {
      this._modelIndex =
        (this._requestCount - (this._requestCount % ONE_CYCLE_COUNT)) %
        models.length;
    }
  }

  get useHistory() {
    return this._usingHistory;
  }
  set useHistory(value) {
    if (value && !this._usingHistory) this.loadHistory();
    this._usingHistory = value;
  }

  get safe() {
    return this._safe;
  }
  set safe(value) {
    this._safe = value;
  }

  get temperature() {
    return this._temperature;
  }
  set temperature(value) {
    this._temperature = value;
  }

  get messages() {
    return this._messages;
  }
  get lastMessage() {
    return this._messages[this._messages.length - 1];
  }

  saveHistory() {
    log.debug("Saving chat history", { path: HISTORY_PATH });
    exec(`bash -c 'mkdir -p ${HISTORY_DIR} && touch ${HISTORY_PATH}'`);
    AstalIO.write_file(
      HISTORY_PATH,
      JSON.stringify(
        this._messages.map((msg: ServiceMessage) => {
          let m = { role: msg.role, content: msg.parts };
          return m;
        }),
      ),
    );
    log.debug("Chat history saved", { messageCount: this._messages.length });
  }

  getMessage(id: number) {
    return this._messages[id];
  }

  loadHistory() {
    log.info("Loading chat history");
    this._messages = [];
    this.appendHistory();
    this._usingHistory = true;
  }

  appendHistory() {
    try {
      if (fileExists(HISTORY_PATH)) {
        log.debug("History file found, loading messages");
        const readfile = AstalIO.read_file(HISTORY_PATH);
        const historyMessages = JSON.parse(readfile);
        log.debug("Loaded history", { messageCount: historyMessages.length });
        
        historyMessages.forEach((element: ServiceMessage) => {
          this.addMessage(element.role, element.parts[0].text);
        });
      } else {
        log.debug("No history file found");
      }
    } catch (e) {
      log.error("Failed to append history", { error: e });
    } finally {
      this._messages = this._assistantPrompt ? [...initMessages] : [];
    }
  }

  @signal()
  clear() {
    log.info("Clearing chat messages");
    this._messages = this._assistantPrompt ? [...initMessages] : [];
    if (this._usingHistory) this.saveHistory();
    this.emit("clear");
  }

  get assistantPrompt() {
    return this._assistantPrompt;
  }
  set assistantPrompt(value) {
    this._assistantPrompt = value;
    if (value) this._messages = [...initMessages];
    else this._messages = [];
  }

  readResponse(stream: Gio.DataInputStream, aiResponse: GeminiMessage) {
    let buffer = "";
    let lastProcessedIndex = 0;
    let responseCount = 0;
    let lastTextLength = 0; // Track length of text we've already processed

    const readAllData = () => {
      stream.read_bytes_async(8192, 0, null, (stream, res) => {
        try {
          const bytes = stream.read_bytes_finish(res);
          if (!bytes || bytes.get_size() === 0) {
            log.debug("Stream ended", { 
              totalResponses: responseCount,
              bufferLength: buffer.length 
            });
            return;
          }

          const chunk = this._decoder.decode(bytes.toArray());
          buffer += chunk;
          
          // Parse only new data
          const result = this.parseAccumulatedData(buffer, lastProcessedIndex, aiResponse, lastTextLength);
          lastProcessedIndex = result.lastIndex;
          responseCount += result.count;
          lastTextLength = result.lastTextLength;
          
          // Continue reading
          readAllData();
        } catch (e) {
          log.error("Error reading stream", { error: e });
          aiResponse.done = true;
          aiResponse.thinking = false;
          aiResponse.content = "Error reading response from Gemini";
          aiResponse.emit("finished", aiResponse);
        }
      });
    };
    
    readAllData();
  }
  
  private parseAccumulatedData(data: string, startFrom: number, aiResponse: GeminiMessage, lastTextLength: number): { lastIndex: number, count: number, lastTextLength: number } {
    // Gemini returns streaming responses as JSON array: [response1,response2,...]
    // We need to find complete JSON objects within the stream
    
    let startIdx = startFrom;
    let bracketCount = 0;
    let inString = false;
    let escapeNext = false;
    let processedCount = 0;
    let lastProcessedEnd = startFrom;
    let currentTextLength = lastTextLength;
    
    for (let i = startFrom; i < data.length; i++) {
      const char = data[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"' && !escapeNext) {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{' || char === '[') {
          if (bracketCount === 0) {
            startIdx = i;
          }
          bracketCount++;
        } else if (char === '}' || char === ']') {
          bracketCount--;
          
          if (bracketCount === 0) {
            // Found a complete JSON object/array
            const jsonStr = data.substring(startIdx, i + 1);
            lastProcessedEnd = i + 1;
            
            try {
              // Check if it's an array or single object
              if (jsonStr.trim().startsWith('[')) {
                const responses = JSON.parse(jsonStr) as GenerateContentResponse[];
                for (const response of responses) {
                  currentTextLength = this.processGeminiResponse(response, aiResponse, currentTextLength);
                  processedCount++;
                }
              } else {
                const response = JSON.parse(jsonStr) as GenerateContentResponse;
                currentTextLength = this.processGeminiResponse(response, aiResponse, currentTextLength);
                processedCount++;
              }
            } catch (e) {
              log.verbose("Failed to parse JSON segment", { 
                error: e, 
                jsonLength: jsonStr.length 
              });
            }
          }
        }
      }
    }
    
    return { lastIndex: lastProcessedEnd, count: processedCount, lastTextLength: currentTextLength };
  }
  
  private processGeminiResponse(response: GenerateContentResponse, aiResponse: GeminiMessage, previousTextLength: number): number {
    // Skip if already done
    if (aiResponse.done) {
      return previousTextLength;
    }
    
    if (response.promptFeedback?.blockReason) {
      aiResponse.content = `Blocked: ${response.promptFeedback.blockReason}`;
      aiResponse.done = true;
      aiResponse.thinking = false;
      aiResponse.emit("finished", aiResponse);
      return previousTextLength;
    }
    
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content?.parts) {
        let fullText = "";
        
        // Concatenate all parts to get the full text
        for (const part of candidate.content.parts) {
          if ('text' in part && part.text) {
            fullText += part.text;
          }
        }
        
        // Only add the new portion of text
        if (fullText.length > previousTextLength) {
          const newText = fullText.substring(previousTextLength);
          if (newText.trim()) {
            aiResponse.addDelta(newText);
          }
        }
        
        // Check if response is complete
        if (candidate.finishReason) {
          log.info("Gemini response complete", { 
            finishReason: candidate.finishReason,
            contentLength: aiResponse.content.length 
          });
          aiResponse.done = true;
          aiResponse.thinking = false;
          aiResponse.emit("finished", aiResponse);
        }
        
        return fullText.length;
      }
    }
    
    return previousTextLength;
  }

  isKeySet() {
    return this._key.length > 0;
  }

  addMessage(role: Role, message: string) {
    log.debug("Adding message", { role, messageLength: message.length });
    this._messages.push(new GeminiMessage(role, message, false));
    this.emit("new-msg", this._messages.length - 1);
  }

  send(msg: string) {
    log.info("Sending message to Gemini", { message: msg });
    this._messages.push(new GeminiMessage(Role.USER, msg, false, true));
    this.emit("new-msg", this._messages.length - 1);
    const aiResponse = new GeminiMessage(
      Role.MODEL,
      "thinking...",
      true,
      false,
    );

    // Prepare contents for Gemini API
    const contents: Content[] = this._messages
      .filter(msg => msg.role === Role.USER || msg.role === Role.MODEL)
      .map((msg) => ({
        role: msg.role,
        parts: msg.parts.map(part => ({ text: part.text }))
      }));

    // Safety settings
    const safetySettings: SafetySetting[] = this._safe ? [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ] : [];

    const body = {
      contents,
      generationConfig: {
        temperature: this._temperature,
        maxOutputTokens: 2048,
      },
      safetySettings,
    };
    
    log.debug("API request details", {
      model: this.modelName,
      messageCount: contents.length,
      hasApiKey: this._key.length > 0,
      keyPreview: this._key.length > 0 ? `${this._key.substring(0, 10)}...` : "NO KEY"
    });

    const session = new Soup.Session();
    const message = new Soup.Message({
      method: "POST",
      uri: GLib.Uri.parse(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:streamGenerateContent?key=${this._key}`,
        GLib.UriFlags.NONE,
      ),
    });

    message.request_headers.append("Content-Type", "application/json");
    
    if (!this._key) {
      log.error("No API key available for request");
      aiResponse.done = true;
      aiResponse.thinking = false;
      aiResponse.content = "No API key configured. Use /key command to set one.";
      aiResponse.emit("finished", aiResponse);
      return;
    }

    message.set_request_body_from_bytes(
      "application/json",
      new GLib.Bytes(JSON.stringify(body) as unknown as Uint8Array),
    );

    session.send_async(message, GLib.PRIORITY_DEFAULT, null, (_, result) => {
      try {
        const stream = session.send_finish(result);
        
        // Check response status
        const status = message.get_status();
        log.info("API response status", { 
          status: status,
          statusCode: message.status_code,
          reasonPhrase: message.reason_phrase 
        });
        
        if (message.status_code !== 200) {
          // Try to read error response
          const bytes = stream.read_bytes(8192, null);
          const errorText = bytes ? new TextDecoder().decode(bytes.toArray()) : "Unknown error";
          log.error("API request failed", { 
            statusCode: message.status_code,
            error: errorText 
          });
          
          aiResponse.done = true;
          aiResponse.thinking = false;
          aiResponse.content = `API Error (${message.status_code}): ${message.reason_phrase}\n${errorText}`;
          aiResponse.emit("finished", aiResponse);
          return;
        }
        
        log.debug("API request sent successfully, starting response stream");
        this.readResponse(
          new Gio.DataInputStream({
            close_base_stream: true,
            base_stream: stream,
          }),
          aiResponse,
        );
      } catch (error) {
        log.error("Failed to send API request", { error: error.toString() });
        aiResponse.done = true;
        aiResponse.thinking = false;
        aiResponse.content = `Failed to connect to Gemini API: ${error}`;
        aiResponse.emit("finished", aiResponse);
      }
    });
    this._messages.push(aiResponse);
    this.emit("new-msg", this._messages.length - 1);

    if (this._cycleModels) {
      this._requestCount++;
      const models = configManager.getValue("ai.providers.gemini.models") || [];
      if (this._cycleModels && models.length > 0) {
        this._modelIndex =
          (this._requestCount - (this._requestCount % ONE_CYCLE_COUNT)) %
          models.length;
        log.debug("Model cycling", { 
          requestCount: this._requestCount, 
          modelIndex: this._modelIndex,
          currentModel: this.modelName 
        });
      }
    }
  }
  
  static getInstance(): GeminiService {
    if (!GeminiService._instance) {
      GeminiService._instance = new GeminiService();
    }
    return GeminiService._instance;
  }
}

// Export singleton instance
const geminiService = GeminiService.getInstance();
export default geminiService;