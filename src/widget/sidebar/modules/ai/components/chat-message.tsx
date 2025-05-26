import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";
import GLib from "gi://GLib";
import ChatCodeBlock from "./chat-code-block";
import ChatMessageContent from "./chat-message-content";
import { ClaudeMessage } from "../../../../../services/claude";
// import {ChatMessage} from "./"
import { Variable, bind } from "astal";
import { sidebarLogger as log } from "../../../../../utils/logger";
import { c } from "../../../../../utils/style";

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
  <box cssClasses={c`${extraClassName}`} cssName={`sidebar-chat-message-skeletonline`} />
);

export interface LoadingSkeletonProps extends Widget.BoxProps {
  name: string;
}
const ChatMessageLoadingSkeleton = (props: LoadingSkeletonProps) => (
  <box
    {...props}
    name={props.name}
    vertical
    cssName="spacing-v-5"
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
  log.debug("ChatMessage component created");
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
    log.debug("Message delta received", { content: delta.content });

    displayMessage.set(delta.content);
  });

  message.connect("finished", (message: ClaudeMessage) => {
    // print("message", message);
    log.debug("Message finished", { content: message.content });
    thinking.set(false);
    displayMessage.set(message.content);
  });

  log.debug("Initial message state", {
    content: message.content,
    thinking: thinking.get()
  });
  displayMessage.set(message.content);
  return (
    <box cssName="sidebar-chat-message">
      <box vertical>
        <label
          xalign={0}
          halign={Gtk.Align.START}
          wrap
          label={message.role == "user" ? USERNAME : props.modelName}
          cssName="sidebar-chat-name"
          cssClasses={c`${message.role == "user" ? "user" : "bot"}`}
        />
        <box homogeneous cssName="sidebar-chat-messagearea">
          <stack visibleChildName={bind(thinking).as((v) => (v ? "thinking" : "message"))}>
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
