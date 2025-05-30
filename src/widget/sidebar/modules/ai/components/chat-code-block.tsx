import { Gtk } from "astal/gtk4";
import GtkSource from "gi://GtkSource?version=5";
import { PhosphorIcons } from "../../../../utils/icons/types";
import PhosphorIcon from "../../../../utils/icons/phosphor";
import { execAsync } from "astal/process";
import { sidebarLogger as log } from "../../../../../utils/logger";

const CUSTOM_SCHEME_ID = `rose-pine`; // Custom Rosé Pine theme

function substituteLang(str: string) {
  const subs = [
    { from: "javascript", to: "js" },
    { from: "typescript", to: "js" },
    { from: "bash", to: "sh" },
    { from: "shell", to: "sh" },
    { from: "json", to: "json" },
    { from: "python", to: "python3" },
    { from: "cpp", to: "cpp" },
    { from: "c++", to: "cpp" },
  ];
  for (const { from, to } of subs) {
    if (from === str) return to;
  }
  return str;
}

// Initialize custom scheme path once
const initializeCustomScheme = () => {
  const schemeManager = GtkSource.StyleSchemeManager.get_default();
  const currentPaths = schemeManager.get_search_path();
  const customPath = "/home/faiyt/.config/ags/src/styles/gtksourceview";

  // Add our custom path if not already present
  if (!currentPaths.includes(customPath)) {
    schemeManager.set_search_path([...currentPaths, customPath]);
  }

  // Force reload to pick up new schemes
  schemeManager.force_rescan();

  // Log available schemes for debugging
  const schemeIds = schemeManager.get_scheme_ids();
  log.debug("Available GtkSourceView schemes", { schemes: schemeIds });
};

// Initialize once
initializeCustomScheme();

export const HighlightedCode = (content: string, lang: string) => {
  log.info("Highlighting code", { content, lang });
  // Ensure content is a string
  const contentStr = typeof content === 'string' ? content : String(content || '');

  const buffer = new GtkSource.Buffer();
  const sourceView = new GtkSource.View({
    buffer: buffer,
    wrap_mode: Gtk.WrapMode.NONE,
    editable: false,
    cursor_visible: false,
    monospace: true,
    show_line_numbers: true,
    show_line_marks: false,
    right_margin_position: 80,
    show_right_margin: false,
    tab_width: 2,
    indent_width: 2,
    highlight_current_line: false,
    background_pattern: GtkSource.BackgroundPatternType.NONE,
  });

  const langManager = GtkSource.LanguageManager.get_default();
  let displayLang = langManager.get_language(substituteLang(lang));
  if (displayLang) {
    buffer.set_language(displayLang);
  }

  const schemeManager = GtkSource.StyleSchemeManager.get_default();
  let scheme = schemeManager.get_scheme(CUSTOM_SCHEME_ID);

  // Fallback to oblivion if our custom scheme isn't found
  if (!scheme) {
    log.warn("Custom scheme not found, falling back to oblivion");
    scheme = schemeManager.get_scheme("oblivion");
  }

  if (scheme) {
    buffer.set_style_scheme(scheme);
  }

  buffer.set_text(contentStr, -1);

  // Apply additional styling
  sourceView.set_left_margin(8);
  sourceView.set_right_margin(8);
  sourceView.set_top_margin(4);
  sourceView.set_bottom_margin(4);

  log.info("Code block highlighted", { lang });
  return sourceView;
};

interface ChatCodeBlockProps {
  content?: string;
  lang?: string;
}

export const ChatCodeBlock = (props: ChatCodeBlockProps) => {
  const { content = "", lang = "txt" } = props;

  // Ensure both content and lang are strings
  const contentStr = typeof content === 'string' ? content : String(content || '');
  const langStr = typeof lang === 'string' ? lang : String(lang || 'txt');


  const sourceView = HighlightedCode(contentStr, langStr);

  const handleClick = () => {
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

  log.info("Code block created", { lang });

  const codeBlock = (
    <box cssName="sidebar-chat-codeblock" vertical>
      <box cssName="sidebar-chat-codeblock-topbar" hexpand>
        <label cssName="sidebar-chat-codeblock-topbar-txt" hexpand
          halign={Gtk.Align.START}
        >{langStr}</label>
        <button
          cssName="sidebar-chat-codeblock-copy-btn"
          onClicked={handleClick}
          tooltipText="Copy code"
        >
          <PhosphorIcon iconName={PhosphorIcons.Copy} />
        </button>
      </box>
      <box cssName="sidebar-chat-codeblock-code" hexpand vexpand>
        <Gtk.ScrolledWindow
          vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
          hscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
          minContentHeight={75}
          maxContentHeight={500}
          minContentWidth={300}
          hexpand={true}
          child={sourceView as any}
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
