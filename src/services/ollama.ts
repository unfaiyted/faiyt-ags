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
const HISTORY_FILENAME = `ollama.txt`;
const HISTORY_PATH = HISTORY_DIR + HISTORY_FILENAME;
const ONE_CYCLE_COUNT = 3;

// Ensure all required directories exist
exec(`mkdir -p ${AI_DIR}`);
exec(`mkdir -p ${HISTORY_DIR}`);

export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export interface ServiceMessage {
  role: Role;
  content: string;
}

@register()
export class OllamaMessage extends GObject.Object {
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
      log.debug("OllamaMessage initialized with user role", { initialRole });
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
    log.verbose("OllamaMessage changed signal emitted");
  }

  @signal(OllamaMessage)
  finished(_message: OllamaMessage) {
    log.debug("OllamaMessage finished signal emitted");
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

const initMessages: OllamaMessage[] = [
  new OllamaMessage(
    Role.SYSTEM,
    "You are an assistant on a sidebar of a Wayland Linux desktop. Please always use a casual tone when answering your questions, unless requested otherwise or making writing suggestions. These are the steps you should take to respond to the user's queries:\n1. If it's a writing- or grammar-related question or a sentence in quotation marks, Please point out errors and correct when necessary using underlines, and make the writing more natural where appropriate without making too major changes. If you're given a sentence in quotes but is grammatically correct, explain briefly concepts that are uncommon.\n2. If it's a question about system tasks, give a bash command in a code block with brief explanation.\n3. Otherwise, when asked to summarize information or explaining concepts, you are should use bullet points and headings. For mathematics expressions, you *have to* use LaTeX within a code block with the language set as \"latex\". \nNote: Use casual language, be short, while ensuring the factual correctness of your response. If you are unsure or don't have enough information to provide a confident answer, simply say \"I don't know\" or \"I'm not sure.\". \nThanks!",
    true,
    false,
  ),
];

@register()
export class OllamaService extends GObject.Object {
  private static _instance: OllamaService | null = null;

  @signal() declare initialized: (isInit: boolean) => {};
  @signal(Number) declare newMsg: (msgId: number) => {};
  @signal(Boolean) declare hasKey: (hasKey: boolean) => {};

  _assistantPrompt = config.ai.enhancements;
  _cycleModels = false;
  _usingHistory = config.ai.useHistory;
  _baseUrl = "";
  _localUrl = "";
  _requestCount = 0;
  _safe = config.ai.safety;
  _temperature = config.ai.defaultTemperature;
  _messages: OllamaMessage[] = [];
  _modelIndex = 0;
  _decoder = new TextDecoder();
  _modelName = "";
  _availableModels: string[] = [];

  constructor() {
    super();
    
    if (OllamaService._instance) {
      return OllamaService._instance;
    }
    
    OllamaService._instance = this;

    log.info("OllamaService initializing");

    // Get Ollama config from ConfigManager
    const ollamaConfig = configManager.getValue("ai.providers.ollama");
    log.debug("Ollama config from ConfigManager", { 
      hasConfig: !!ollamaConfig,
      configKeys: ollamaConfig ? Object.keys(ollamaConfig) : []
    });
    
    if (ollamaConfig) {
      this._baseUrl = ollamaConfig.baseUrl || "http://localhost:11434";
      this._localUrl = ollamaConfig.localUrl || this._baseUrl;
      this._modelName = ollamaConfig.model || "llama2";
      this._temperature = ollamaConfig.temperature || config.ai.defaultTemperature;
    }

    log.debug("Ollama service configuration", { 
      baseUrl: this._baseUrl,
      localUrl: this._localUrl,
      model: this._modelName
    });

    // Check if Ollama is running and fetch available models
    this.checkOllamaStatus();

    if (this._usingHistory) this.loadHistory();
    else this._messages = this._assistantPrompt ? [...initMessages] : [];

    log.debug("Initial messages loaded", { count: this._messages.length });
    
    // Emit new-msg for each initial message
    this._messages.forEach((msg, index) => {
      this.emit("new-msg", index);
    });
    
    log.info("OllamaService initialized");
    this.emit("initialized");
  }
  
  async checkOllamaStatus() {
    try {
      log.info("Checking Ollama service status");
      
      const session = new Soup.Session();
      const message = new Soup.Message({
        method: "GET",
        uri: GLib.Uri.parse(
          `${this._localUrl}/api/tags`,
          GLib.UriFlags.NONE,
        ),
      });

      session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (_, result) => {
        try {
          const bytes = session.send_and_read_finish(result);
          if (!bytes) {
            log.warn("Ollama service not responding");
            return;
          }

          const decoder = new TextDecoder();
          const text = decoder.decode(bytes.toArray());
          const response = JSON.parse(text);
          
          if (response.models) {
            this._availableModels = response.models.map((m: any) => m.name);
            log.info("Ollama models available", { models: this._availableModels });
            this.emit("has-key", true); // Ollama doesn't need API key
          }
        } catch (error) {
          log.error("Failed to check Ollama status", { error });
          this.emit("has-key", false);
        }
      });
    } catch (error) {
      log.error("Failed to check Ollama status", { error });
    }
  }
  
  getMessages() {
    return this._messages;
  }
  
  get modelName() {
    return this._modelName;
  }
  
  set modelName(model: string) {
    this._modelName = model;
    log.debug("Model changed", { model });
  }

  get keyPath() {
    return ""; // Ollama doesn't use API keys
  }
  
  get key() {
    return "local"; // Ollama is local, no key needed
  }
  
  set key(keyValue) {
    // No-op for Ollama
  }

  get cycleModels() {
    return this._cycleModels;
  }
  set cycleModels(value) {
    this._cycleModels = value;
    if (!value) this._modelIndex = 0;
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

  get availableModels() {
    return this._availableModels;
  }

  saveHistory() {
    log.debug("Saving chat history", { path: HISTORY_PATH });
    exec(`bash -c 'mkdir -p ${HISTORY_DIR} && touch ${HISTORY_PATH}'`);
    AstalIO.write_file(
      HISTORY_PATH,
      JSON.stringify(
        this._messages.map((msg: OllamaMessage) => {
          return { role: msg.role, content: msg.content };
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

  readResponse(stream: Gio.DataInputStream, aiResponse: OllamaMessage) {
    const readNextChunk = () => {
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
          
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              
              if (data.message?.content) {
                log.verbose("Received content", { contentLength: data.message.content.length });
                aiResponse.addDelta(data.message.content);
              }
              
              if (data.done) {
                log.info("Message stream completed", { 
                  contentLength: aiResponse.content.length 
                });
                aiResponse.done = true;
                aiResponse.emit("finished", aiResponse);
                return;
              }
            } catch (e) {
              log.error("Failed to parse response line", { error: e, line });
            }
          }

          readNextChunk();
        } catch (e) {
          log.error("Error reading stream", { message: (e as Error).message });
        }
      });
    };
    readNextChunk();
  }

  isKeySet() {
    // Ollama doesn't need an API key, but we check if service is running
    return this._availableModels.length > 0;
  }

  addMessage(role: Role, message: string) {
    log.debug("Adding message", { role, messageLength: message.length });
    this._messages.push(new OllamaMessage(role, message, false));
    this.emit("new-msg", this._messages.length - 1);
  }

  send(msg: string) {
    log.info("Sending message to Ollama", { message: msg });
    this._messages.push(new OllamaMessage(Role.USER, msg, false, true));
    this.emit("new-msg", this._messages.length - 1);
    const aiResponse = new OllamaMessage(
      Role.ASSISTANT,
      "thinking...",
      true,
      false,
    );

    const body = {
      model: this._modelName,
      messages: this._messages
        .filter(msg => msg.role === Role.USER || msg.role === Role.ASSISTANT || msg.role === Role.SYSTEM)
        .map((msg) => {
          return { 
            role: msg.role, 
            content: msg.content 
          };
        }),
      stream: true,
      options: {
        temperature: this._temperature,
      }
    };
    
    log.debug("API request details", {
      model: this._modelName,
      messageCount: this._messages.length,
      temperature: this._temperature,
      url: `${this._localUrl}/api/chat`
    });

    const session = new Soup.Session();
    const message = new Soup.Message({
      method: "POST",
      uri: GLib.Uri.parse(
        `${this._localUrl}/api/chat`,
        GLib.UriFlags.NONE,
      ),
    });

    message.request_headers.append("Content-Type", "application/json");

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
          aiResponse.content = `Ollama Error (${message.status_code}): ${message.reason_phrase}\n${errorText}`;
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
        aiResponse.content = `Failed to connect to Ollama API: ${error}\n\nMake sure Ollama is running locally.`;
        aiResponse.emit("finished", aiResponse);
      }
    });
    this._messages.push(aiResponse);
    this.emit("new-msg", this._messages.length - 1);

    if (this._cycleModels && this._availableModels.length > 1) {
      this._requestCount++;
      this._modelIndex = (this._requestCount % this._availableModels.length);
      this._modelName = this._availableModels[this._modelIndex];
      log.debug("Model cycling", { 
        requestCount: this._requestCount, 
        modelIndex: this._modelIndex,
        currentModel: this._modelName 
      });
    }
  }
  
  static getInstance(): OllamaService {
    if (!OllamaService._instance) {
      OllamaService._instance = new OllamaService();
    }
    return OllamaService._instance;
  }
}

// Export singleton instance
const ollamaService = OllamaService.getInstance();
export default ollamaService;