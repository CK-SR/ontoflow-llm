from openai import OpenAI
from app.config import settings


class LLMClient:
    def __init__(self) -> None:
        self.enabled = bool(settings.get_api_key())

    def chat_with_tools(self, messages: list[dict], tools: list[dict]) -> dict:
        if not self.enabled:
            raise RuntimeError("OPENAI_API_KEY / DASHSCOPE_API_KEY 未配置，请设置环境变量或 .env")
        client = OpenAI(api_key=settings.get_api_key(), base_url=settings.openai_base_url or None)
        resp = client.chat.completions.create(model=settings.openai_model, messages=messages, tools=tools, tool_choice="auto")
        return resp.choices[0].message.model_dump()
