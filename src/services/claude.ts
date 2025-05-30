import Gio from "gi://Gio";
import GLib from "gi://GLib";
import Soup from "gi://Soup?version=3.0";
import { GObject, register, signal, property } from "astal/gobject";
import { fileExists } from "../utils";
import AstalIO from "gi://AstalIO";
import { execAsync, exec } from "astal/process";
import configManager from "./config-manager";
import {
  EventType,
  ContentBlockDelta,
  TextDelta,
  DeltaType,
} from "../types/claude";
import { ServiceMessage, Role } from "../types/claude";
import { serviceLogger as log } from "../utils/logger";

const config = configManager.config;
const AI_DIR = `${config.dir.state}/ags/user/ai`;
const HISTORY_DIR = `${AI_DIR}/chats/`;
const HISTORY_FILENAME = `claude.txt`;
const HISTORY_PATH = HISTORY_DIR + HISTORY_FILENAME;
const ENV_KEY = GLib.getenv("ANTHROPIC_API_KEY");
const ONE_CYCLE_COUNT = 3;

// Ensure all required directories exist
exec(`mkdir -p ${AI_DIR}`);
exec(`mkdir -p ${HISTORY_DIR}`);

if (!fileExists(`${config.dir.config}/claude_history.json`)) {
  execAsync([
    `bash`,
    `-c`,
    `touch ${config.dir.config}/claude_history.json`,
  ]).catch(err => log.error("Failed to create claude history file", { error: err }));
  AstalIO.write_file(`${config.dir.config}/claude_history.json`, "[ ]");
}


@register()
export class ClaudeMessage extends GObject.Object {
  private _role: Role = Role.USER;
  private _parts = [{ type: "text", text: "" }];
  private_parts = [{ type: "text", text: "" }];
  private _isThinking = true;
  private _isDone = false;
  private _rawData = "";
  private _parserState = { parsed: "", stack: [] };

  @signal(String) declare delta: (_delta: string) => void;

  constructor(
    initialRole: Role,
    initialContent: string,
    thinking = true,
    done = false,
  ) {
    super();
    this._role = initialRole;
    this._parts = [{ type: "text", text: initialContent }];
    this._isThinking = thinking;
    this._isDone = done;
    if (initialRole == Role.USER) {
      log.debug("ClaudeMessage initialized with user role", { initialRole });
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
    log.verbose("ClaudeMessage changed signal emitted");
  }

  @signal(ClaudeMessage)
  finished(_message: ClaudeMessage) {
    log.debug("ClaudeMessage finished signal emitted");
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
    this._parts = [{ type: "text", text: content }];
    this.notify("content");
    this.emit("changed");
  }

  get parts() {
    return this._parts;
  }
  get label() {
    return this._parserState.parsed + this._parserState.stack.join("");
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

  parseSection() {
    if (this._isThinking) {
      this._isThinking = false;
      this._parts[0].text = "";
    }
    const parsedData = JSON.parse(this._rawData);
    if (!parsedData.candidates)
      this._parts[0].text += `Blocked: ${parsedData.promptFeedback.blockReason}`;
    else {
      const delta = parsedData.candidates[0].content.parts[0].text;
      this._parts[0].text += delta;
    }
    // this.emit('delta', delta);
    this.notify("content");
    this._rawData = "";
  }
}

const initMessages: ClaudeMessage[] = [
  new ClaudeMessage(
    Role.USER,
    "You are an assistant on a sidebar of a Wayland Linux desktop. Please always use a casual tone when answering your questions, unless requested otherwise or making writing suggestions. These are the steps you should take to respond to the user's queries:\n1. If it's a writing- or grammar-related question or a sentence in quotation marks, Please point out errors and correct when necessary using underlines, and make the writing more natural where appropriate without making too major changes. If you're given a sentence in quotes but is grammatically correct, explain briefly concepts that are uncommon.\n2. If it's a question about system tasks, give a bash command in a code block with brief explanation.\n3. Otherwise, when asked to summarize information or explaining concepts, you are should use bullet points and headings. For mathematics expressions, you *have to* use LaTeX within a code block with the language set as \"latex\". \nNote: Use casual language, be short, while ensuring the factual correctness of your response. If you are unsure or don’t have enough information to provide a confident answer, simply say “I don’t know” or “I’m not sure.”. \nThanks!",
    true,
    false,
  ),
  new ClaudeMessage(Role.ASSISTANT, "Got it!", false, false),
  new ClaudeMessage(
    Role.USER,
    "He rushed to where the event was supposed to be hold, he didn't know it got calceled",
    true,
    false,
  ),
  new ClaudeMessage(
    Role.ASSISTANT,

    '## Grammar correction\nErrors:\n"He rushed to where the event was supposed to be __hold____,__ he didn\'t know it got calceled"\nCorrection + minor improvements:\n"He rushed to the place where the event was supposed to be __held____, but__ he didn\'t know that it got calceled"',
  ),
  new ClaudeMessage(Role.USER, "raise volume by 5%", true, false),
  new ClaudeMessage(
    Role.ASSISTANT,

    "## Volume +5```bash\nwpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+\n```\nThis command uses the `wpctl` utility to adjust the volume of the default sink.",
  ),
  new ClaudeMessage(
    Role.USER,
    "main advantages of the nixos operating system",
    true,
    false,
  ),
  new ClaudeMessage(
    Role.ASSISTANT,

    "## NixOS advantages\n- **Reproducible**: A config working on one device will also work on another\n- **Declarative**: One config language to rule them all. Effortlessly share them with others.\n- **Reliable**: Per-program software versioning. Mitigates the impact of software breakage",
  ),
  new ClaudeMessage(Role.USER, "whats skeumorphism", true, false),
  new ClaudeMessage(
    Role.ASSISTANT,

    "## Skeuomorphism\n- A design philosophy- From early days of interface designing- Tries to imitate real-life objects- It's in fact still used by Apple in their icons until today.",
  ),
  new ClaudeMessage(Role.USER, '"ignorance is bliss"', true, false),
  new ClaudeMessage(
    Role.ASSISTANT,

    '## "Ignorance is bliss"\n- A Latin proverb that means being unaware of something negative can be a source of happiness\n- Often used to justify avoiding difficult truths or responsibilities\n- Can also be interpreted as a warning against seeking knowledge that may bring pain or sorrow',
  ),
  new ClaudeMessage(
    Role.USER,
    "find the derivative of (x-438)/(x^2+23x-7)+x^x",
    true,
    false,
  ),
  new ClaudeMessage(
    Role.ASSISTANT,

    "## Derivative\n```latex\n\\[\n\\frac{d}{dx}\\left(\\frac{x - 438}{x^2 + 23x - 7} + x^x\\right) = \\frac{-(x^2+23x-7)-(x-438)(2x+23)}{(x^2+23x-7)^2} + x^x(\\ln(x) + 1)\n\\]\n```",
  ),
  new ClaudeMessage(Role.USER, "write the double angle formulas", true, false),
  new ClaudeMessage(
    Role.ASSISTANT,

    "## Double angle formulas\n```latex\n\\[\n\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta)\n\\]\n\\\\\n\\[\n\\cos(2\\theta) = \\cos^2(\\theta) - \\sin^2(\\theta)\n\\]\n\\\\\n\\[\n\\tan(2\\theta) = \\frac{2\\tan(\\theta)}{1 - \\tan^2(\\theta)}\n\\]\n```",
  ),
];

@register()
export class ClaudeService extends GObject.Object {
  private static _instance: ClaudeService | null = null;

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
  _messages: ClaudeMessage[] = [];
  _modelIndex = 0;
  _decoder = new TextDecoder();

  constructor() {
    super();
    
    if (ClaudeService._instance) {
      return ClaudeService._instance;
    }
    
    ClaudeService._instance = this;

    log.info("ClaudeService initializing");

    // Get API key from ConfigManager or environment
    // Priority: 1. User config, 2. Environment variable
    const claudeConfig = configManager.getValue("ai.providers.claude");
    log.debug("Claude config from ConfigManager", { 
      hasConfig: !!claudeConfig,
      hasApiKey: !!claudeConfig?.apiKey,
      configKeys: claudeConfig ? Object.keys(claudeConfig) : []
    });
    
    if (claudeConfig?.apiKey) {
      this._key = claudeConfig.apiKey;
      log.info("Using API key from user config", { 
        keyLength: claudeConfig.apiKey.length,
        keyPrefix: claudeConfig.apiKey.substring(0, 10) + "..."
      });
    } else if (ENV_KEY) {
      this._key = ENV_KEY;
      log.info("Using API key from environment variable (fallback)");
    } else {
      log.warn("No API key found in config or environment");
      
      // Try to load from user config one more time
      configManager.loadConfig();
      const retryConfig = configManager.getValue("ai.providers.claude");
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
    if (claudeConfig) {
      this._cycleModels = claudeConfig.cycleModels || false;
      this._temperature = claudeConfig.temperature || config.ai.defaultTemperature;
    }

    log.debug("API key status", { 
      hasKey: this._key.length > 0,
      keyLength: this._key.length 
    });

    // if (this._usingHistory) timeout(1000, () => this.loadHistory());
    if (this._usingHistory) this.loadHistory();
    else this._messages = this._assistantPrompt ? [...initMessages] : [];

    log.debug("Initial messages loaded", { count: this._messages.length });
    
    // Emit new-msg for each initial message
    this._messages.forEach((msg, index) => {
      this.emit("new-msg", index);
    });
    
    log.info("ClaudeService initialized");
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
    configManager.setAPIKey("claude", key);
  }
  
  /**
   * Refresh API key from config (useful after config changes)
   */
  refreshApiKey() {
    const claudeConfig = configManager.getValue("ai.providers.claude");
    
    // Priority: 1. User config, 2. Environment variable
    if (claudeConfig?.apiKey) {
      this._key = claudeConfig.apiKey;
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
    const models = configManager.getValue("ai.providers.claude.models") || [];
    return models[this._modelIndex] || models[0] || "claude-3-5-sonnet-20241022";
  }
  
  set modelName(model: string) {
    const models = configManager.getValue("ai.providers.claude.models") || [];
    const index = models.indexOf(model);
    if (index !== -1) {
      this._modelIndex = index;
      log.debug("Model changed", { model, index });
    }
  }

  get keyPath() {
    return "ai.providers.claude.apiKey";
  }
  get key() {
    return this._key;
  }
  set key(keyValue) {
    this._key = keyValue;
    configManager.setAPIKey("claude", keyValue);
    log.info("API key saved successfully");
    this.emit("has-key", true);
  }

  get cycleModels() {
    return this._cycleModels;
  }
  set cycleModels(value) {
    this._cycleModels = value;
    const models = configManager.getValue("ai.providers.claude.models") || [];
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
          // this._messages.push(element);
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
    // console.log(this._messages)
    // this._messages = this._messages.concat(JSON.parse(readfile));
    // for (let index = 0; index < this._messages.length; index++) {
    //     this.emit('newMsg', index);
    // }
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

  readResponse(stream: Gio.DataInputStream, aiResponse: ClaudeMessage) {
    let eventData = "";
    let eventType = EventType.ERROR;

    const readNextLine = () => {
      stream.read_line_async(0, null, (stream, res) => {
        try {
          if (!stream) {
            log.debug("Stream ended");
            return;
          }

          const [bytes] = stream.read_line_finish(res);

          if (!bytes) {
            // aiResponse.done = true;
            return;
          }

          // log.verbose("attempting line decode");
          const line = this._decoder.decode(bytes);
          log.verbose("Decoded line", { line });

          if (line.startsWith("event: ")) {
            eventType = line.slice(7) as EventType;
          } else if (line.startsWith("data: ")) {
            eventData = line.slice(6);

            if (eventData && eventType === EventType.CONTENT_BLOCK_DELTA) {
              try {
                const data = JSON.parse(eventData) as ContentBlockDelta;
                if ((data.delta.type = DeltaType.TEXT_DELTA)) {
                  const delta = (data.delta as TextDelta)?.text || "";
                  log.verbose("Received text delta", { deltaLength: delta.length });
                  aiResponse.addDelta(delta);
                }
              } catch (e) {
                log.error("Failed to parse event data", { error: e });
              }
            }
          } else if (line === "") {
            // Empty line indicates end of event
            eventType = EventType.ERROR;
            eventData = "";
          }

          readNextLine();
        } catch (e) {
          log.error("Error reading stream", { message: (e as Error).message });
          // if (this._usingHistory) this.saveHistory();
          //   return;
        } finally {
          if (eventType === EventType.MESSAGE_STOP) {
            log.info("Message stream completed", { 
              contentLength: aiResponse.content.length 
            });
            aiResponse.done = true;
            aiResponse.emit("finished", aiResponse);
          }
          // log.verbose("This line is done being read");
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
    this._messages.push(new ClaudeMessage(role, message, false));
    this.emit("new-msg", this._messages.length - 1);
  }

  send(msg: string) {
    log.info("Sending message to Claude", { message: msg });
    this._messages.push(new ClaudeMessage(Role.USER, msg, false, true));
    this.emit("new-msg", this._messages.length - 1);
    const aiResponse = new ClaudeMessage(
      Role.ASSISTANT,
      "thinking...",
      true,
      false,
    );

    const body = {
      model: this.modelName,
      messages: this._messages
        .filter(msg => msg.role === Role.USER || msg.role === Role.ASSISTANT)
        .map((msg) => {
          // Claude API expects content as a string, not parts array
          return { 
            role: msg.role.toLowerCase(), 
            content: msg.content 
          };
        }),
      max_tokens: 1024,
      stream: true,
    };
    
    log.debug("API request details", {
      model: this.modelName,
      messageCount: this._messages.length,
      hasApiKey: this._key.length > 0,
      keyPreview: this._key.length > 0 ? `${this._key.substring(0, 10)}...` : "NO KEY"
    });

    // TODO: implment this conditionally
    // const proxyResolver = new Gio.SimpleProxyResolver({
    //   defaultProxy: config.ai.proxyUrl || undefined,
    // });

    const session = new Soup.Session();
    const message = new Soup.Message({
      method: "POST",
      uri: GLib.Uri.parse(
        `https://api.anthropic.com/v1/messages`,
        GLib.UriFlags.NONE,
      ),
    });

    message.request_headers.append("Content-Type", "application/json");
    message.request_headers.append("anthropic-version", "2023-06-01");
    
    // Use the API key from instance (already prioritized correctly in constructor)
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
    
    message.request_headers.append("x-api-key", currentKey);

    message.set_request_body_from_bytes(
      "application/json",
      // TODO: Fix this as im not sure this typing works
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
        aiResponse.content = `Failed to connect to Claude API: ${error}`;
        aiResponse.emit("finished", aiResponse);
      }
    });
    this._messages.push(aiResponse);
    this.emit("new-msg", this._messages.length - 1);

    if (this._cycleModels) {
      this._requestCount++;
      const models = configManager.getValue("ai.providers.claude.models") || [];
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
  
  static getInstance(): ClaudeService {
    if (!ClaudeService._instance) {
      ClaudeService._instance = new ClaudeService();
    }
    return ClaudeService._instance;
  }
}

// Export singleton instance
const claudeService = ClaudeService.getInstance();
export default claudeService;
