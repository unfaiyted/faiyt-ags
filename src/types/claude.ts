export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

// Base event types
export type BaseEvent = {
  type: EventType;
};

// Content block types
export type TextContentBlock = {
  type: "text";
  text: string;
};

export type ToolUseContentBlock = {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, any>;
};

export type ContentBlock = TextContentBlock | ToolUseContentBlock;

export enum DeltaType {
  TEXT_DELTA = "text_delta",
  INPUT_JSON_DELTA = "input_json_delta",
  CONTENT_BLOCK_DELTA = "content_block_delta",
}

// Delta types
export type TextDelta = {
  type: DeltaType.TEXT_DELTA;
  text: string;
};

export type InputJsonDelta = {
  type: DeltaType.INPUT_JSON_DELTA;
  partial_json: string;
};

export type ContentBlockDelta = {
  type: DeltaType.CONTENT_BLOCK_DELTA;
  index: number;
  delta: TextDelta | InputJsonDelta;
};

export interface ServiceMessage {
  role: Role;
  parts: Array<{ text: string }>;
}

// Message types
export type Message = {
  id: string;
  type: "message";
  role: "assistant";
  model: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  content: ContentBlock[];
  stop_reason: string | null;
};

export type Error = {
  type: string;
  message: string;
};

export type ErrorEvent = BaseEvent & {
  type: EventType.ERROR;
  error: Error;
};

// Specific event types
export type MessageStartEvent = BaseEvent & {
  type: EventType.MESSAGE_START;
  message: Message;
};

export type ContentBlockStartEvent = BaseEvent & {
  type: EventType.CONTENT_BLOCK_START;
  index: number;
  content_block: ContentBlock;
};

export type PingEvent = BaseEvent & {
  type: EventType.PING;
};

export type ContentBlockStopEvent = BaseEvent & {
  type: EventType.CONTENT_BLOCK_STOP;
  index: number;
};

export type MessageDelta = {
  stop_reason: string | null;
  stop_sequence: string | null;
  usage: {
    output_tokens: number;
  };
};

export type MessageDeltaEvent = BaseEvent & {
  type: EventType.MESSAGE_DELTA;
  delta: MessageDelta;
  usage: {
    output_tokens: number;
  };
};

export type MessageStopEvent = BaseEvent & {
  type: EventType.MESSAGE_STOP;
};

export enum EventType {
  ERROR = "error",
  PING = "ping",
  MESSAGE_START = "message_start",
  CONTENT_BLOCK_START = "content_block_start",
  CONTENT_BLOCK_DELTA = "content_block_delta",
  CONTENT_BLOCK_STOP = "content_block_stop",
  MESSAGE_DELTA = "message_delta",
  MESSAGE_STOP = "message_stop",
}

// Union of all possible events
export type AnthropicStreamingEvent =
  | MessageStartEvent
  | ErrorEvent
  | ContentBlockStartEvent
  | PingEvent
  | ContentBlockDelta
  | ContentBlockStopEvent
  | MessageDeltaEvent
  | MessageStopEvent;

// Parser function type
export type StreamParser = {
  parse(event: string): {
    event: string;
    data: AnthropicStreamingEvent;
  };
};
