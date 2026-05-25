export interface ToolCallTrace {
  tool_name: string;
  arguments: Record<string, unknown>;
  result_preview: string;
}

export interface ChatResponse {
  answer: string;
  tool_calls: ToolCallTrace[];
  data_source: string;
}

export interface ChatRequest {
  message: string;
}
