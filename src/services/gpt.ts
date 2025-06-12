import Gio from "gi://Gio";
import GLib from "gi://GLib";
import Soup from "gi://Soup?version=3.0";
import { GObject, register, signal, property } from "astal/gobject";
import { fileExists } from "../utils";
import AstalIO from "gi://AstalIO";
import { execAsync, exec } from "astal/process";
import configManager from "./config-manager";
import { serviceLogger as log } from "../utils/logger";

const config = configManager.config;
const AI_DIR = `${config.dir.state}/ags/user/ai`;
const HISTORY_DIR = `${AI_DIR}/chats/`;
const HISTORY_FILENAME = `gpt.txt`;
const HISTORY_PATH = HISTORY_DIR + HISTORY_FILENAME;
const ENV_KEY = GLib.getenv("OPENAI_API_KEY");
const ONE_CYCLE_COUNT = 3;

// Ensure all required directories exist
exec(`mkdir -p ${AI_DIR}`);
exec(`mkdir -p ${HISTORY_DIR}`);

if (!fileExists(`${config.dir.config}/gpt_history.json`)) {
  execAsync([
    `bash`,
    `-c`,
    `touch ${config.dir.config}/gpt_history.json`,
  ]).catch(err => log.error("Failed to create GPT history file", { error: err }));
  AstalIO.write_file(`${config.dir.config}/gpt_history.json`, "[ ]");
}

export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export interface ServiceMessage {
  role: Role;
  content: string;
}

interface GPTStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

@register()
export class GPTMessage extends GObject.Object {
  private _role: Role = Role.USER;
  private _content = "";
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
    this._content = initialContent;
    this._isThinking = thinking;
    this._isDone = done;
    if (initialRole == Role.USER) {
      log.debug("GPTMessage initialized with user role", { initialRole });
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
    log.verbose("GPTMessage changed signal emitted");
  }

  @signal(GPTMessage)
  finished(_message: GPTMessage) {
    log.debug("GPTMessage finished signal emitted");
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
    return this._content;
  }
  set content(content) {
    this._content = content;
    this.notify("content");
    this.emit("changed");
  }

  get label() {
    return this._content;
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

const initMessages: GPTMessage[] = [
  new GPTMessage(
    Role.USER,
    "You are an assistant on a sidebar of a Wayland Linux desktop. Please always use a casual tone when answering your questions, unless requested otherwise or making writing suggestions. These are the steps you should take to respond to the user's queries:\n1. If it's a writing- or grammar-related question or a sentence in quotation marks, Please point out errors and correct when necessary using underlines, and make the writing more natural where appropriate without making too major changes. If you're given a sentence in quotes but is grammatically correct, explain briefly concepts that are uncommon.\n2. If it's a question about system tasks, give a bash command in a code block with brief explanation.\n3. Otherwise, when asked to summarize information or explaining concepts, you are should use bullet points and headings. For mathematics expressions, you *have to* use LaTeX within a code block with the language set as \"latex\". \nNote: Use casual language, be short, while ensuring the factual correctness of your response. If you are unsure or don't have enough information to provide a confident answer, simply say \"I don't know\" or \"I'm not sure.\". \nThanks!",
    true,
    false,
  ),
  new GPTMessage(Role.ASSISTANT, "Got it! I'll help you with tasks on your Linux desktop, keeping things casual and concise. Feel free to ask me anything!", false, false),
];

@register()
export class GPTService extends GObject.Object {
  private static _instance: GPTService | null = null;

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
  _messages: GPTMessage[] = [];
  _modelIndex = 0;
  _decoder = new TextDecoder();
  _availableModels = [
    "gpt-4-turbo-preview",
    "gpt-4",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-16k",
  ];

  constructor() {
    super();
    
    if (GPTService._instance) {
      return GPTService._instance;
    }
    
    GPTService._instance = this;

    log.info("GPTService initializing");

    // Get API key from ConfigManager or environment
    // Priority: 1. User config, 2. Environment variable
    const gptConfig = configManager.getValue("ai.providers.gpt");
    log.debug("GPT config from ConfigManager", { 
      hasConfig: !!gptConfig,
      hasApiKey: !!gptConfig?.apiKey,
      configKeys: gptConfig ? Object.keys(gptConfig) : []
    });
    
    if (gptConfig?.apiKey) {
      this._key = gptConfig.apiKey;
      log.info("Using API key from user config", { 
        keyLength: gptConfig.apiKey.length,
        keyPrefix: gptConfig.apiKey.substring(0, 10) + "..."
      });
    } else if (ENV_KEY) {
      this._key = ENV_KEY;
      log.info("Using API key from environment variable (fallback)");
    } else {
      log.warn("No API key found in config or environment");
      
      // Try to load from user config one more time
      configManager.loadConfig();
      const retryConfig = configManager.getValue("ai.providers.gpt");
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
    if (gptConfig) {
      this._temperature = gptConfig.temperature || config.ai.defaultTemperature;
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
    
    log.info("GPTService initialized");
    this.emit("initialized");
  }
  
  getMessages() {
    return this._messages;
  }
  
  /**
   * Update the API key and save to config
   */
  setApiKey(key: string) {
    log.info("Updating API key", { keyLength: key.length });
    this._key = key;
    this.emit("has-key", key.length > 0);
    
    // Also update the config
    configManager.setAPIKey("gpt", key);
  }
  
  /**
   * Refresh API key from config (useful after config changes)
   */
  refreshApiKey() {
    const gptConfig = configManager.getValue("ai.providers.gpt");
    
    // Priority: 1. User config, 2. Environment variable
    if (gptConfig?.apiKey) {
      this._key = gptConfig.apiKey;
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
    const gptConfig = configManager.getValue("ai.providers.gpt");
    return gptConfig?.model || this._availableModels[this._modelIndex] || "gpt-3.5-turbo";
  }
  
  set modelName(model: string) {
    const index = this._availableModels.indexOf(model);
    if (index !== -1) {
      this._modelIndex = index;
      log.debug("Model changed", { model, index });
      
      // Update config
      configManager.setValue("ai.providers.gpt.model", model);
    }
  }

  get availableModels() {
    return this._availableModels;
  }

  get keyPath() {
    return "ai.providers.gpt.apiKey";
  }
  get key() {
    return this._key;
  }
  set key(keyValue) {
    this._key = keyValue;
    configManager.setAPIKey("gpt", keyValue);
    log.info("API key saved successfully");
    this.emit("has-key", true);
  }

  get cycleModels() {
    return this._cycleModels;
  }
  set cycleModels(value) {
    this._cycleModels = value;
    if (!value) this._modelIndex = 0;
    else {
      this._modelIndex =
        (this._requestCount - (this._requestCount % ONE_CYCLE_COUNT)) %
        this._availableModels.length;
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
          let m = { role: msg.role, content: msg.content };
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
          this.addMessage(element.role, element.content);
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

  readResponse(stream: Gio.DataInputStream, aiResponse: GPTMessage) {
    let buffer = "";
    
    const readNextLine = () => {
      stream.read_line_async(0, null, (stream, res) => {
        try {
          if (!stream) {
            log.debug("Stream ended");
            return;
          }

          const [bytes] = stream.read_line_finish(res);

          if (!bytes) {
            return;
          }

          const line = this._decoder.decode(bytes);
          buffer += line + "\n";

          // Process complete chunks
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() || ""; // Keep incomplete chunk in buffer

          for (const chunk of chunks) {
            if (chunk.trim() === "") continue;
            
            const lines = chunk.split("\n").filter(l => l.trim() !== "");
            
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                
                if (data === "[DONE]") {
                  log.info("GPT stream completed");
                  aiResponse.done = true;
                  aiResponse.emit("finished", aiResponse);
                  return;
                }
                
                try {
                  const parsed = JSON.parse(data) as GPTStreamChunk;
                  const delta = parsed.choices[0]?.delta?.content;
                  
                  if (delta) {
                    log.verbose("Received text delta", { deltaLength: delta.length });
                    aiResponse.addDelta(delta);
                  }
                } catch (e) {
                  log.error("Failed to parse GPT response", { error: e, data });
                }
              }
            }
          }

          readNextLine();
        } catch (e) {
          log.error("Error reading stream", { message: (e as Error).message });
        }
      });
    };
    readNextLine();
  }

  isKeySet() {
    return this._key.length > 0;
  }

  addMessage(role: Role, message: string) {
    log.debug("Adding message", { role, messageLength: message.length });
    this._messages.push(new GPTMessage(role, message, false));
    this.emit("new-msg", this._messages.length - 1);
  }

  send(msg: string) {
    log.info("Sending message to GPT", { message: msg });
    this._messages.push(new GPTMessage(Role.USER, msg, false, true));
    this.emit("new-msg", this._messages.length - 1);
    const aiResponse = new GPTMessage(
      Role.ASSISTANT,
      "thinking...",
      true,
      false,
    );

    const body = {
      model: this.modelName,
      messages: this._messages
        .filter(msg => msg.role === Role.USER || msg.role === Role.ASSISTANT || msg.role === Role.SYSTEM)
        .map((msg) => {
          return { 
            role: msg.role.toLowerCase(), 
            content: msg.content 
          };
        }),
      temperature: this._temperature,
      max_tokens: configManager.getValue("ai.providers.gpt.maxTokens") || 1024,
      stream: true,
    };
    
    log.debug("API request details", {
      model: this.modelName,
      messageCount: this._messages.length,
      hasApiKey: this._key.length > 0,
      keyPreview: this._key.length > 0 ? `${this._key.substring(0, 10)}...` : "NO KEY"
    });

    const session = new Soup.Session();
    const message = new Soup.Message({
      method: "POST",
      uri: GLib.Uri.parse(
        configManager.getValue("ai.providers.gpt.baseUrl") || "https://api.openai.com/v1/chat/completions",
        GLib.UriFlags.NONE,
      ),
    });

    message.request_headers.append("Content-Type", "application/json");
    
    // Use the API key from instance
    const currentKey = this._key || "";
    log.debug("Setting API key for request", { 
      keyLength: currentKey.length,
      keyPrefix: currentKey.length > 0 ? currentKey.substring(0, 10) + "..." : "empty",
      hasKey: currentKey.length > 0
    });
    
    if (!currentKey) {
      log.error("No API key available for request");
      aiResponse.done = true;
      aiResponse.thinking = false;
      aiResponse.content = "No API key configured. Use /key command to set one.";
      aiResponse.emit("finished", aiResponse);
      return;
    }
    
    message.request_headers.append("Authorization", `Bearer ${currentKey}`);

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
        aiResponse.content = `Failed to connect to OpenAI API: ${error}`;
        aiResponse.emit("finished", aiResponse);
      }
    });
    this._messages.push(aiResponse);
    this.emit("new-msg", this._messages.length - 1);

    if (this._cycleModels) {
      this._requestCount++;
      if (this._cycleModels && this._availableModels.length > 0) {
        this._modelIndex =
          (this._requestCount - (this._requestCount % ONE_CYCLE_COUNT)) %
          this._availableModels.length;
        log.debug("Model cycling", { 
          requestCount: this._requestCount, 
          modelIndex: this._modelIndex,
          currentModel: this.modelName 
        });
      }
    }
  }
  
  static getInstance(): GPTService {
    if (!GPTService._instance) {
      GPTService._instance = new GPTService();
    }
    return GPTService._instance;
  }
}

// Export singleton instance
const gptService = GPTService.getInstance();
export default gptService;