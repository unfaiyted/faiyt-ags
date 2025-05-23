import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";
import GtkSource from "gi://GtkSource?version=4";
import config from "../../../../../utils/config";
import { execAsync } from "astal/process";
import { MaterialIcon } from "../../../../utils/icons/material";

const CUSTOM_SCHEME_ID = `custom`;

function substituteLang(str: string) {
  const subs = [
    { from: "javascript", to: "js" },
    { from: "bash", to: "sh" },
  ];
  for (const { from, to } of subs) {
    if (from === str) return to;
  }
  return str;
}

export const HighlightedCode = (content: string, lang: string) => {
  const buffer = new GtkSource.Buffer();
  const sourceView = new GtkSource.View({
    buffer: buffer,
    wrap_mode: Gtk.WrapMode.NONE,
  });
  const langManager = GtkSource.LanguageManager.get_default();
  let displayLang = langManager.get_language(substituteLang(lang)); // Set your preferred language
  if (displayLang) {
    buffer.set_language(displayLang);
  }
  const schemeManager = GtkSource.StyleSchemeManager.get_default();
  buffer.set_style_scheme(schemeManager.get_scheme(CUSTOM_SCHEME_ID));
  buffer.set_text(content, -1);
  return sourceView;
};

export const ChatCodeBlock = (content = "", lang = "txt") => {
  // if (lang == 'tex' || lang == 'latex') {
  //     return Latex(content);
  // }

  const sourceView = HighlightedCode(content, lang);

  const handleClick = (self: Widget.Button, event: Astal.ClickEvent) => {
    const buffer = sourceView.get_buffer();
    const copyContent = buffer.get_text(
      buffer.get_start_iter(),
      buffer.get_end_iter(),
      false,
    ); // TODO: fix this
    // TODO: move to actions
    execAsync([`wl-copy`, `${copyContent}`]).catch(print);
  };

  const updateText = (text: string) => {
    sourceView.get_buffer().set_text(text, -1);
  };

  const codeBlock = (
    <box className="sidebar-chat-codeblock" vertical>
      <box className="sidebar-chat-codeblock-topbar">
        <label className="sidebar-chat-codeblock-topbar-txt">{lang}</label>
        <box className="sidebar-chat-codeblock-topbar-btn">
          <button
            className="sidebar-chat-codeblock-topbar-btn"
            onClick={handleClick}
          >
            <box className="spacing-h-5">
              <MaterialIcon icon="content_copy" size="small" />
              <label label="Copy" />
            </box>
          </button>
        </box>
      </box>
      <box className="sidebar-chat-codeblock-code" homogeneous>
        <scrollable
          vscroll={Gtk.PolicyType.NEVER}
          hscroll={Gtk.PolicyType.AUTOMATIC}
          child={sourceView}
        />
      </box>
    </box>
  );

  // const schemeIds = styleManager.get_scheme_ids();

  // print("Available Style Schemes:");
  // for (let i = 0; i < schemeIds.length; i++) {
  //     print(schemeIds[i]);
  // }

  return codeBlock;
};

export default ChatCodeBlock;
