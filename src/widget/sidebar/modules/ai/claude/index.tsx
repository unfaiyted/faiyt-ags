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
import config from "../../../../../utils/config";
import { parseCommand, enableClickthrough } from "../../../../../utils";
// import ChatContent from "../components/chat-content";

export interface ClaudeAIProps extends Widget.BoxProps { }

const WelcomeMessage = () => {
  return (
    <box homogeneous vexpand>
      <box cssName="spacing-v-15" vertical valign={Gtk.Align.CENTER}>
        <label label="Welcome to Claude AI!" />
      </box>
    </box>
  );
};

export default function ClaudeAI(props: ClaudeAIProps) {
  print("ClaudeAI Initilizer");
  const chatContent = new VarMap([
    [0, <box />],
    [1, <WelcomeMessage />],
  ]);

  const input = Variable("");
  const reavererIsVisible = Variable(false);
  const updateContent = Variable(false);

  print("Service Starting");
  const claudeService = new ClaudeService();

  claudeService.connect("new-msg", (source: ClaudeService, id: number) => {
    print("!!ClaudeService new-msg notify:", id);
    chatContent.set(
      id,
      <ChatMessage
        modelName="Claude 3.5"
        message={claudeService.getMessage(id)}
      />,
    );
  });

  const appendChatContent = (newContent: Gtk.Widget) => {
    print("appendChatContent called");
    const maxKey = Math.max(...chatContent.get().map(([k]) => k));
    // existingContent.push();
    print("last key:", maxKey);
    chatContent.set(maxKey + 1, newContent);
    print("append-Chat Content size:", chatContent.get().length);
    updateContent.set(true);
  };

  const clearChat = () => {
    // chatContent.set([]);
    chatContent.deleteAll();
  };

  const sendMessage = (message: string) => {
    print("sendMessage - Sending message:", message);
    // Check if text or API key is empty
    if (message.length == 0) return;
    if (!claudeService.isKeySet()) {
      // ClaudeService.key = message;
      appendChatContent(
        SystemMessage({
          content: `Key saved to\n\`${claudeService.keyPath}\``,
          commandName: "API Key",
          // geminiView,
        }),
      );
      message = "";
      return;
    }
    // Commands
    if (message.startsWith("/")) {
      const { command, args } = parseCommand(message);

      const aiCommand: AICommandProps = {
        args,
        clearChat,
        appendChatContent,
        service: claudeService,
      };

      const commands = ClaudeCommands(aiCommand);
      print("Current command:", command);
      const commandHandler = commands[command];

      if (commandHandler) {
        commandHandler(args);
      } else {
        print("Invalid command");
        appendChatContent(
          SystemMessage({
            content: "Invalid command.",
            commandName: "Error",
            // geminiView,
          }),
        );
      }
    } else {
      claudeService.send(message);
    }
  };

  const sendMessageReturn = () => {
    sendMessage(input.get());
  };

  const sendMessageClick = () => {
    sendMessage(input.get());
  };

  const handleInputChanged = () => {
    reavererIsVisible.set(true);
    // input.set(self.get_text());

  };

  chatContent.subscribe((content) => {
    print("sub-Chat Content size:", content.length);
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
    <box {...props} vexpand>
      {/* <ChatView> */}
      {/*   <box cssName="spacing-v-10" vertical> */}
      {/*       <ChatContent content={} /> */}
      {/*     {bind(chatContent).as((v) => { */}
      {/*       return v.map(([num, w]) => w); */}
      {/*     })} */}
      {/*   </box> */}
      {/* </ChatView> */}
      <box cssName="sidebar-chat-textarea" vexpand={false}>
        {/* <overlay> */}
        {/*   <revealer */}
        {/*     visible={reavererIsVisible.get()} */}
        {/*     transitionType={Gtk.RevealerTransitionType.CROSSFADE} transitionDuration={config.animations.durationLarge}> */}
        {/*     <ChatInput */}
        {/*       autoFocus={true} */}
        {/*       aiName={AIName.CLAUDE} */}
        {/*       handleSubmit={sendMessageReturn} */}
        {/*       onChanged={handleInputChanged} */}
        {/*     /> */}
        {/*   </revealer> */}
        {/*   <ChatInput */}
        {/*     autoFocus={true} */}
        {/*     aiName={AIName.CLAUDE} */}
        {/*     handleSubmit={sendMessageReturn} */}
        {/*     onChanged={handleInputChanged} */}
        {/*   /> */}
        {/* </overlay> */}
        <box cssName="width-10" />
        {/* <ChatSendButton onClicked={sendMessageClick} /> */}
      </box>
    </box>
  );
}
