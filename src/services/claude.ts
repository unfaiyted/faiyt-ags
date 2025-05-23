import Gio from "gi://Gio";
import GLib from "gi://GLib";
import Soup from "gi://Soup?version=3.0";
import { GObject, register, signal, property } from "astal/gobject";
import { fileExists } from "../utils";
import { readFile, writeFile, writeFileAsync } from "astal/file";
import { execAsync, exec } from "astal/process";
import config from "../utils/config";
import {
  EventType,
  ContentBlockDelta,
  TextDelta,
  DeltaType,
} from "../types/claude";
import { ServiceMessage, Role } from "../types/claude";

const HISTORY_DIR = `${config.dir.state}/ags/user/ai/chats/`;
const HISTORY_FILENAME = `claude.txt`;
const HISTORY_PATH = HISTORY_DIR + HISTORY_FILENAME;
const KEY_FILE = `${config.dir.state}/ags/user/ai/anthropic_key.txt`;
const ENV_KEY = GLib.getenv("ANTHROPIC_API_KEY");
const APIDOM_FILE_LOCATION = `${config.dir.state}/ags/user/ai/anthropic_api_dom.txt`;
const CHAT_MODELS = ["claude-3-5-sonnet-20241022"];
const ONE_CYCLE_COUNT = 3;

if (!fileExists(`${config.dir.config}/claude_history.json`)) {
  execAsync([
    `bash`,
    `-c`,
    `touch ${config.dir.config}/claude_history.json`,
  ]).catch(print);
  writeFile("[ ]", `${config.dir.config}/claude_history.json`);
}

exec(`mkdir -p ${config.dir.config}/ags/user/ai`);

function replaceapidom(URL: string) {
  if (fileExists(APIDOM_FILE_LOCATION)) {
    var contents = readFile(APIDOM_FILE_LOCATION).trim();
    var URL = URL.toString().replace(
      "generativelanguage.googleapis.com",
      contents,
    );
  }
  return URL;
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
      print("initialRole", initialRole);
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
    print("ClaudeMessage changed");
  }

  @signal(ClaudeMessage)
  finished(_message: ClaudeMessage) {
    print("ClaudeMessage finished");
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
  // static {
  //   Service.register(this, {
  //     initialized: [],
  //     clear: [],
  //     newMsg: ["int"],
  //     hasKey: ["boolean"],
  //   });
  // }

  @signal() declare initialized: (isInit: boolean) => {};
  @signal(Number) declare newMsg: (msgId: number) => {};
  @signal(Boolean) declare hasKey: (hasKey: boolean) => {};

  _assistantPrompt = config.ai.enhancements;
  _cycleModels = true;
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

    print("ClaudeService constructor");

    if (ENV_KEY) this._key = ENV_KEY;
    else if (fileExists(KEY_FILE)) this._key = readFile(KEY_FILE).trim();
    else this.emit("has-key", false);

    print("Key:", this._key);

    // if (this._usingHistory) timeout(1000, () => this.loadHistory());
    if (this._usingHistory) this.loadHistory();
    else this._messages = this._assistantPrompt ? [...initMessages] : [];

    print("initMessages:", initMessages);
    print("intilized");
    this.emit("initialized");
  }

  get modelName() {
    return CHAT_MODELS[this._modelIndex];
  }

  get keyPath() {
    return KEY_FILE;
  }
  get key() {
    return this._key;
  }
  set key(keyValue) {
    this._key = keyValue;
    writeFileAsync(this._key, KEY_FILE)
      .then(() => this.emit("has-key", true))
      .catch(print);
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
        CHAT_MODELS.length;
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
    exec(`bash -c 'mkdir -p ${HISTORY_DIR} && touch ${HISTORY_PATH}'`);
    writeFile(
      JSON.stringify(
        this._messages.map((msg: ServiceMessage) => {
          let m = { role: msg.role, content: msg.parts };
          return m;
        }),
      ),
      HISTORY_PATH,
    );
  }

  getMessage(id: number) {
    return this._messages[id];
  }

  loadHistory() {
    this._messages = [];
    this.appendHistory();
    this._usingHistory = true;
  }

  appendHistory() {
    try {
      if (fileExists(HISTORY_PATH)) {
        const readfile = readFile(HISTORY_PATH);
        JSON.parse(readfile).forEach((element: ServiceMessage) => {
          // this._messages.push(element);
          this.addMessage(element.role, element.parts[0].text);
        });
      }
    } catch (e) {
      print(e);
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
            print("Stream ended");
            return;
          }

          const [bytes] = stream.read_line_finish(res);

          if (!bytes) {
            // aiResponse.done = true;
            return;
          }

          // print("attempting line decode");
          const line = this._decoder.decode(bytes);
          console.log("decoded", line);

          if (line.startsWith("event: ")) {
            eventType = line.slice(7) as EventType;
          } else if (line.startsWith("data: ")) {
            eventData = line.slice(6);

            if (eventData && eventType === EventType.CONTENT_BLOCK_DELTA) {
              try {
                const data = JSON.parse(eventData) as ContentBlockDelta;
                if ((data.delta.type = DeltaType.TEXT_DELTA)) {
                  const delta = (data.delta as TextDelta)?.text || "";
                  aiResponse.addDelta(delta);
                }
              } catch (e) {
                print("Failed to parse event data:", e);
              }
            }
          } else if (line === "") {
            // Empty line indicates end of event
            eventType = EventType.ERROR;
            eventData = "";
          }

          readNextLine();
        } catch (e) {
          print("Error reading ", (e as Error).message);
          // if (this._usingHistory) this.saveHistory();
          //   return;
        } finally {
          if (eventType === EventType.MESSAGE_STOP) {
            aiResponse.done = true;
            aiResponse.emit("finished", aiResponse);
          }
          // print("This line is done being read");
        }
      });
    };
    readNextLine();
  }

  isKeySet() {
    return this._key.length > 0;
  }

  addMessage(role: Role, message: string) {
    this._messages.push(new ClaudeMessage(role, message, false));
    this.emit("new-msg", this._messages.length - 1);
  }

  send(msg: string) {
    print("msg:", msg);
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
      messages: this._messages.map((msg) => {
        let m = { role: msg.role, content: msg.parts };
        return m;
      }),
      max_tokens: 1024,
      stream: true,
    };

    // TODO: implment this conditionally
    // const proxyResolver = new Gio.SimpleProxyResolver({
    //   defaultProxy: config.ai.proxyUrl || undefined,
    // });

    // const requestHeaders = new Soup.MessageHeaders(
    //   Soup.MessageHeadersType.REQUEST,
    // );

    const session = new Soup.Session();
    const message = new Soup.Message({
      method: "POST",
      uri: GLib.Uri.parse(
        `https://api.anthropic.com/v1/messages`,
        GLib.UriFlags.NONE,
      ),
    });

    message.request_headers.append("Content-Type", "application/json");
    message.request_headers.append("Content-Type", "application/json");
    message.request_headers.append("anthropic-version", "2023-06-01");
    message.request_headers.append("x-api-key", ENV_KEY || this._key);

    message.set_request_body_from_bytes(
      "application/json",
      // TODO: Fix this as im not sure this typing works
      new GLib.Bytes(JSON.stringify(body) as unknown as Uint8Array),
    );

    session.send_async(message, GLib.PRIORITY_DEFAULT, null, (_, result) => {
      const stream = session.send_finish(result);
      this.readResponse(
        new Gio.DataInputStream({
          close_base_stream: true,
          base_stream: stream,
        }),
        aiResponse,
      );
    });
    this._messages.push(aiResponse);
    this.emit("new-msg", this._messages.length - 1);

    if (this._cycleModels) {
      this._requestCount++;
      if (this._cycleModels)
        this._modelIndex =
          (this._requestCount - (this._requestCount % ONE_CYCLE_COUNT)) %
          CHAT_MODELS.length;
    }
  }
}

export default ClaudeService;
