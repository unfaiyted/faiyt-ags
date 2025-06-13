import { Widget, Gtk } from "astal/gtk4";
import GLib from "gi://GLib";
import ChatMessageContent from "./chat-message-content";
import { ClaudeMessage } from "../../../../../services/claude";
// import {ChatMessage} from "./"
import { Variable, bind } from "astal";
import { sidebarLogger as log } from "../../../../../utils/logger";
import { c } from "../../../../../utils/style";
import configManager from "../../../../../services/config-manager";
import PhosphorIcon from "../../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../../utils/icons/types";

const USERNAME = GLib.get_user_name();

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
  const avatarPath = configManager.getValue("user.avatarPath");
  const isUser = message.role === "user";

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
    <box cssName="sidebar-chat-message" spacing={12}>
      {/* Avatar */}
      <box cssName="chat-avatar-wrapper" valign={Gtk.Align.START}>
        {isUser ? (
          avatarPath && GLib.file_test(avatarPath, GLib.FileTest.EXISTS) ? (
            <box cssClasses={["chat-avatar"]} widthRequest={32} heightRequest={32} overflow={Gtk.Overflow.HIDDEN}>
              <image file={avatarPath} pixelSize={32} />
            </box>
          ) : (
            <box cssClasses={["chat-avatar-placeholder"]} widthRequest={32} heightRequest={32}>
              <PhosphorIcon iconName={PhosphorIcons.User} size={16} />
            </box>
          )
        ) : (
          <box cssClasses={["chat-avatar-ai"]} widthRequest={32} heightRequest={32}>
            <PhosphorIcon iconName={PhosphorIcons.Robot} marginStart={6} size={16} />
          </box>
        )}
      </box>

      {/* Message content */}
      <box vertical hexpand>
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
