import { Widget, Gtk, Gdk, Astal } from "astal/gtk3";
import GLib from "gi://GLib";
import ChatCodeBlock from "./chat-code-block";
import ChatMessageContent from "./chat-message-content";
import { ClaudeMessage } from "../../../../../services/claude";
// import {ChatMessage} from "./"
import { Variable, bind } from "astal";

// const LATEX_DIR = `${GLib.get_user_cache_dir()}/ags/media/latex`;
// const CUSTOM_SOURCEVIEW_SCHEME_PATH = `${App.configDir}/assets/themes/sourceviewtheme${darkMode.value ? '' : '-light'}.xml`;
// const CUSTOM_SCHEME_ID = `custom${darkMode.value ? '' : '-light'}`;
const USERNAME = GLib.get_user_name();

//   setup: (self) => self
//                     .hook(message, (self, isThinking) => {
//                         messageArea.shown = message.thinking ? 'thinking' : 'message';
//                     }, 'notify::thinking')
//                     .hook(message, (self) => { // Message update
//                         messageContentBox.attribute.fullUpdate(messageContentBox, message.content, message.role != 'user');
//                     }, 'notify::content')
//                     .hook(message, (label, isDone) => { // Remove the cursor
//                         messageContentBox.attribute.fullUpdate(messageContentBox, message.content, false);
//                     j, 'notify::done')
//                 ,
//             })

const TextSkeleton = (extraClassName = "") => (
  <box className={`sidebar-chat-message-skeletonline ${extraClassName}`} />
);

export interface LoadingSkeletonProps extends Widget.BoxProps {
  name: string;
}
const ChatMessageLoadingSkeleton = (props: LoadingSkeletonProps) => (
  <box
    {...props}
    name={props.name}
    vertical
    className="spacing-v-5"
    children={Array.from({ length: 3 }, (_, id) =>
      TextSkeleton(`sidebar-chat-message-skeletonline-offset${id}`),
    )}
  />
);

export interface ChatMessageProps extends Widget.BoxProps {
  message: ClaudeMessage;
  modelName: string;
}

export const ChatMessage = (props: ChatMessageProps) => {
  print("ChatMESSAGE created");
  const { message } = props;

  const displayMessage = Variable("Thinking...");
  const thinking = Variable(message.role == "user" ? false : message.thinking);
  // ClaudeMessage.
  //
  //
  // message.connect("notify", (message, pspec) => {
  //   print("notify:", pspec);
  //   displayMessage.set(message.content);
  // });
  //
  message.connect("delta", (delta: ClaudeMessage) => {
    print("delta-content:", delta.content);

    displayMessage.set(delta.content);
  });

  message.connect("finished", (message: ClaudeMessage) => {
    // print("message", message);
    print("finished-content:", message.content);
    thinking.set(false);
    displayMessage.set(message.content);
  });

  print("Setting message.content", message.content);
  print("thinking:", thinking.get());
  displayMessage.set(message.content);
  return (
    <box className="sidebar-chat-message">
      <box vertical>
        <label
          xalign={0}
          halign={Gtk.Align.START}
          wrap
          label={message.role == "user" ? USERNAME : props.modelName}
          className={`txt txt-bold sidebar-chat-name sidebar-chat-name-${message.role == "user" ? "user" : "bot"}`}
        />
        <box homogeneous className="sidebar-chat-messagearea">
          <stack shown={bind(thinking).as((v) => (v ? "thinking" : "message"))}>
            <ChatMessageLoadingSkeleton name="thinking" />
            <ChatMessageContent
              name="message"
              content={bind(displayMessage).as((v) => v)}
            />
          </stack>
        </box>
      </box>
    </box>
  );
};

export default ChatMessage;
