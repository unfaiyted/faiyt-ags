import { Widget, Gtk } from "astal/gtk4";
import { ChatCodeBlock } from "./chat-code-block";
import config from "../../../../../utils/config";
import { ClaudeMessage } from "../../../../../services/claude";
import GtkSource from "gi://GtkSource?version=5";
import { Binding, Variable, bind } from "astal";
import { sidebarLogger as log } from "../../../../../utils/logger";
import { c } from "../../../../../utils/style";

export interface MessageContentProps extends Widget.BoxProps {
  content: string | Binding<string>;
}

const Divider = () => (
  <box cssName="sidebar-chat-divider" />
);

interface ContentBlock {
  type: 'text' | 'code';
  content: string;
  lang?: string;
}

const parseContent = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];

  // First, split by code blocks
  const codeBlockRegex = /```(\w+)?[ \t]*\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index);
      if (textContent.trim()) {
        // Split text content by newlines to handle different block types
        processTextContent(textContent, blocks);
      }
    }

    // Add code block
    const lang = match[1] || 'text';
    const code = match[2] ? match[2].trim() : '';
    if (code) {
      blocks.push({ type: 'code', content: code, lang });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    if (remainingText.trim()) {
      processTextContent(remainingText, blocks);
    }
  }

  // If no blocks were created, treat entire content as text
  if (blocks.length === 0 && content.trim()) {
    processTextContent(content, blocks);
  }

  // Filter out blocks that are just whitespace
  return blocks.filter(block => {
    if (block.type === 'code') return true;
    const trimmed = block.content.trim();
    return trimmed.length > 0;
  });
};

// Helper function to process text content and split by paragraphs
const processTextContent = (text: string, blocks: ContentBlock[]) => {
  // First, check if the entire text is a table
  if (text.includes('|') && text.includes('---') && text.split('\n').filter(l => l.trim()).length > 2) {
    const lines = text.split('\n').filter(l => l.trim());
    const hasTableStructure = lines.length >= 2 && 
      lines[0].includes('|') && 
      lines[1].includes('---') &&
      lines[1].includes('|');
    
    if (hasTableStructure) {
      blocks.push({ type: 'text', content: text.trim() });
      return;
    }
  }
  
  // Split by double newlines to separate paragraphs
  const paragraphs = text.split(/\n\n+/);
  
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;
    
    // Check if this paragraph is a table
    const lines = trimmed.split('\n');
    if (lines.length >= 2 && lines[0].includes('|') && lines[1].includes('---') && lines[1].includes('|')) {
      blocks.push({ type: 'text', content: trimmed });
      continue;
    }
    
    // Process lines within the paragraph
    let currentBlock = '';
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Check if this line is a horizontal rule
      if (/^(---|\*\*\*|___)\s*$/.test(trimmedLine) && trimmedLine.length >= 3) {
        // Save any accumulated content
        if (currentBlock.trim()) {
          blocks.push({ type: 'text', content: currentBlock.trim() });
          currentBlock = '';
        }
        // Add the horizontal rule as its own block
        blocks.push({ type: 'text', content: trimmedLine });
        i++;
        continue;
      }
      
      // Check if this is a definition list term
      if (i + 1 < lines.length && 
          !line.includes(':') && 
          lines[i + 1].trim().startsWith(':')) {
        // This is a definition term followed by definition(s)
        if (currentBlock.trim()) {
          blocks.push({ type: 'text', content: currentBlock.trim() });
          currentBlock = '';
        }
        
        // Collect the term and all its definitions
        let defListContent = line;
        let j = i + 1;
        while (j < lines.length && lines[j].trim().startsWith(':')) {
          defListContent += '\n' + lines[j];
          j++;
        }
        
        blocks.push({ type: 'text', content: defListContent });
        i = j;
        continue;
      }
      
      // Check if this starts a table (need at least 2 more lines)
      if (i + 1 < lines.length && line.includes('|') && lines[i + 1].includes('---') && lines[i + 1].includes('|')) {
        // Save any accumulated content
        if (currentBlock.trim()) {
          blocks.push({ type: 'text', content: currentBlock.trim() });
          currentBlock = '';
        }
        
        // Collect the entire table
        let tableContent = line;
        let j = i + 1;
        while (j < lines.length && (lines[j].includes('|') || lines[j].trim() === '')) {
          if (lines[j].trim()) {
            tableContent += '\n' + lines[j];
          }
          j++;
        }
        
        blocks.push({ type: 'text', content: tableContent });
        i = j;
        continue;
      }
      
      // Regular line - accumulate it
      if (currentBlock) {
        currentBlock += '\n' + line;
      } else {
        currentBlock = line;
      }
      i++;
    }
    
    // Add any remaining content
    if (currentBlock.trim()) {
      blocks.push({ type: 'text', content: currentBlock.trim() });
    }
  }
};

const md2pango = (content: string) => {
  // Enhanced markdown to pango conversion
  let formatted = content;

  // Horizontal rules - check for exact match (must be alone on line)
  if (/^(---|\*\*\*|___)\s*$/.test(formatted.trim()) && formatted.trim().length >= 3) {
    return '<span foreground="#6e6a86">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>';
  }

  // Headers with better spacing (including h4-h6)
  formatted = formatted.replace(/^###### (.*?)$/gm, '<span size="small" weight="bold">$1</span>');
  formatted = formatted.replace(/^##### (.*?)$/gm, '<span size="medium" weight="bold">$1</span>');
  formatted = formatted.replace(/^#### (.*?)$/gm, '<span size="medium" weight="bold">$1</span>');
  formatted = formatted.replace(/^### (.*?)$/gm, '<span size="large" weight="bold">$1</span>');
  formatted = formatted.replace(/^## (.*?)$/gm, '<span size="x-large" weight="bold">$1</span>');
  formatted = formatted.replace(/^# (.*?)$/gm, '<span size="xx-large" weight="bold">$1</span>');

  // Blockquotes
  formatted = formatted.replace(/^> (.*?)$/gm, '<span foreground="#6e6a86">│ </span><i>$1</i>');
  formatted = formatted.replace(/^>>(.*?)$/gm, '<span foreground="#6e6a86">││</span><i>$1</i>');

  // Links - must be processed before other inline formatting
  formatted = formatted.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<span foreground="#c4a7e7" underline="single">$1</span>');

  // Highlighted text (==text==)
  formatted = formatted.replace(/==(.*?)==/g, '<span background="#f6c177" foreground="#191724">$1</span>');

  // Strikethrough
  formatted = formatted.replace(/~~(.*?)~~/g, '<s>$1</s>');

  // Bold (handle before italic to avoid conflicts)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  formatted = formatted.replace(/__(.*?)__/g, '<b>$1</b>');

  // Italic (avoid matching list items)
  formatted = formatted.replace(/(?<!^|\n)\*([^\*\n]+)\*(?![\*])/g, '<i>$1</i>');
  formatted = formatted.replace(/(?<!^|\n)_([^_\n]+)_(?!_)/g, '<i>$1</i>');

  // Subscript (H~2~O)
  formatted = formatted.replace(/~([^~]+)~/g, '<sub>$1</sub>');

  // Superscript (X^2^)
  formatted = formatted.replace(/\^([^\^]+)\^/g, '<sup>$1</sup>');

  // Inline code with better styling
  formatted = formatted.replace(/`(.*?)`/g, '<span background="#26233a" foreground="#ebbcba"><tt> $1 </tt></span>');

  // Task lists
  formatted = formatted.replace(/^- \[x\] (.*?)$/gm, '<span foreground="#9ccfd8">✓</span> <s>$1</s>');
  formatted = formatted.replace(/^- \[ \] (.*?)$/gm, '<span foreground="#6e6a86">☐</span> $1');

  // Definition lists (term followed by : definition on next line or after colon)
  // Handle inline definitions (Term: Definition)
  formatted = formatted.replace(/^([^:\n]+):\s+(.+)$/gm, '<b>$1:</b> $2');
  // Handle multi-line definitions (: Definition)
  formatted = formatted.replace(/^:\s+(.+)$/gm, '    <span foreground="#908caa">$1</span>');

  // Lists with better formatting
  formatted = formatted.replace(/^(\s*)- (.*?)$/gm, (match, indent, text) => {
    const level = indent.length / 2;
    const spaces = '  '.repeat(level);
    return `${spaces}<span foreground="#eb6f92">•</span> ${text}`;
  });

  formatted = formatted.replace(/^(\s*)\* (.*?)$/gm, (match, indent, text) => {
    const level = indent.length / 2;
    const spaces = '  '.repeat(level);
    return `${spaces}<span foreground="#eb6f92">•</span> ${text}`;
  });

  formatted = formatted.replace(/^(\s*)(\d+)\. (.*?)$/gm, (match, indent, num, text) => {
    const level = indent.length / 2;
    const spaces = '  '.repeat(level);
    return `${spaces}<span foreground="#f6c177">${num}.</span> ${text}`;
  });

  // Emphasis markers
  formatted = formatted.replace(/^(!|⚠️|ℹ️|✅|❌) (.*?)$/gm, (match, marker, text) => {
    const markerColors: Record<string, string> = {
      '!': '#eb6f92',
      '⚠️': '#f6c177',
      'ℹ️': '#31748f',
      '✅': '#9ccfd8',
      '❌': '#eb6f92'
    };
    const color = markerColors[marker] || '#c4a7e7';
    return `<span foreground="${color}">${marker}</span> ${text}`;
  });

  return formatted;
};

export const ChatMessageContent = (props: MessageContentProps) => {
  const { content, ...boxProps } = props;

  const renderContent = () => {
    const contentStr = content instanceof Binding ? content.get() : content;

    // Ensure contentStr is a string
    const safeContentStr = typeof contentStr === 'string' ? contentStr : String(contentStr || '');

    const blocks = parseContent(safeContentStr);

    return blocks.map((block, index) => {
      if (block.type === 'code' && block.lang) {
        // Debug log
        log.debug("Rendering code block", {
          index,
          lang: block.lang,
          contentType: typeof block.content,
          contentLength: block.content?.length || 0
        });

        return ChatCodeBlock({
          content: block.content,
          lang: block.lang
        });
      } else {
        const formatted = md2pango(block.content);

        // Check if this block contains headers
        const hasHeader = /^#{1,6} /.test(block.content.trim());

        // Check if this is a table (more accurate detection)
        const lines = block.content.split('\n').filter(l => l.trim());
        const isTable = lines.length >= 2 && 
          lines[0].includes('|') && 
          lines[1].includes('---') && 
          lines[1].includes('|');
        
        // Check if this is a horizontal rule
        const isHorizontalRule = /^(---|\*\*\*|___)\s*$/.test(block.content.trim());

        if (isTable) {
          // For tables, use monospace font
          return (
            <label
              halign={Gtk.Align.FILL}
              cssName="sidebar-chat-table"
              useMarkup={false}
              xalign={0}
              wrap={true}
              selectable={true}
              label={block.content}
            />
          );
        } else if (isHorizontalRule) {
          // For horizontal rules, use the formatted version
          const formatted = md2pango(block.content);
          return (
            <label
              halign={Gtk.Align.FILL}
              cssName="sidebar-chat-hr"
              useMarkup={true}
              xalign={0}
              wrap={false}
              selectable={false}
              label={formatted}
            />
          );
        }

        return (
          <label
            halign={Gtk.Align.FILL}
            cssName={`sidebar-chat-txt`}
            cssClasses={c`${hasHeader ? 'has-header' : ''}`}
            useMarkup={true}
            xalign={0}
            wrap={true}
            selectable={true}
            label={formatted}
          />
        );
      }
    });
  };

  return (
    <box
      {...boxProps}
      cssName="sidebar-chat-message-content"
      vertical
      spacing={6}
    >
      {content instanceof Binding ? (
        content.as((text) => {
          // Ensure text is a string during binding updates
          const safeText = typeof text === 'string' ? text : String(text || '');
          const blocks = parseContent(safeText);

          return blocks.map((block, index) => {
            if (block.type === 'code' && block.lang) {
              return ChatCodeBlock({
                content: block.content,
                lang: block.lang
              });
            } else {
              const formatted = md2pango(block.content);

              // Check if this block contains headers
              const hasHeader = /^#{1,6} /.test(block.content.trim());

              // Check if this is a table (more accurate detection)
              const lines = block.content.split('\n').filter(l => l.trim());
              const isTable = lines.length >= 2 && 
                lines[0].includes('|') && 
                lines[1].includes('---') && 
                lines[1].includes('|');
              
              // Check if this is a horizontal rule
              const isHorizontalRule = /^(---|\*\*\*|___)\s*$/.test(block.content.trim());

              if (isTable) {
                return (
                  <label
                    halign={Gtk.Align.FILL}
                    cssName="sidebar-chat-table"
                    useMarkup={false}
                    xalign={0}
                    wrap={true}
                    selectable={true}
                    label={block.content}
                  />
                );
              } else if (isHorizontalRule) {
                // For horizontal rules, use the formatted version
                const formatted = md2pango(block.content);
                return (
                  <label
                    halign={Gtk.Align.FILL}
                    cssName="sidebar-chat-hr"
                    useMarkup={true}
                    xalign={0}
                    wrap={false}
                    selectable={false}
                    label={formatted}
                  />
                );
              }

              return (
                <label
                  halign={Gtk.Align.FILL}
                  cssName={`sidebar-chat-txt`}
                  cssClasses={c`${hasHeader ? 'has-header' : ''}`}
                  useMarkup={true}
                  xalign={0}
                  wrap={true}
                  selectable={true}
                  label={formatted}
                />
              );
            }
          });
        })
      ) : (
        renderContent()
      )}
    </box>
  );
};

export default ChatMessageContent;
