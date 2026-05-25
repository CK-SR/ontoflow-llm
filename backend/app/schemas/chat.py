from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class ToolCallTrace(BaseModel):
    tool_name: str
    arguments: dict
    result_preview: str


class ChatResponse(BaseModel):
    answer: str
    tool_calls: list[ToolCallTrace]
    data_source: str
