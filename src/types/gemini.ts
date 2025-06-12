export enum Role {
  USER = "user",
  MODEL = "model",
}

// Safety ratings
export enum HarmCategory {
  HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH",
  HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT",
  HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT",
}

export enum HarmBlockThreshold {
  BLOCK_NONE = "BLOCK_NONE",
  BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
  BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
  BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
}

// Content types
export type TextPart = {
  text: string;
};

export type InlineDataPart = {
  inlineData: {
    mimeType: string;
    data: string; // base64 encoded
  };
};

export type Part = TextPart | InlineDataPart;

export type Content = {
  role: Role;
  parts: Part[];
};

// Response types
export type SafetyRating = {
  category: HarmCategory;
  probability: string;
};

export type Candidate = {
  content: Content;
  finishReason?: string;
  index: number;
  safetyRatings?: SafetyRating[];
};

export type PromptFeedback = {
  blockReason?: string;
  safetyRatings?: SafetyRating[];
};

export type UsageMetadata = {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
};

// Streaming response types
export type GenerateContentResponse = {
  candidates?: Candidate[];
  promptFeedback?: PromptFeedback;
  usageMetadata?: UsageMetadata;
};

// Configuration types
export type SafetySetting = {
  category: HarmCategory;
  threshold: HarmBlockThreshold;
};

export type GenerationConfig = {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
};

// Service message format (to match Claude's pattern)
export interface ServiceMessage {
  role: Role;
  parts: Array<{ text: string }>;
}

// Request types
export type GenerateContentRequest = {
  contents: Content[];
  generationConfig?: GenerationConfig;
  safetySettings?: SafetySetting[];
};