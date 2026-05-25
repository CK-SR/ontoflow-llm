import logging
from openai import OpenAI
from app.config import settings


logger = logging.getLogger(__name__)


class LLMClient:
    def __init__(self) -> None:
        self.enabled = bool(settings.get_api_key())
        logger.info("LLM client initialized. enabled=%s model=%s", self.enabled, settings.openai_model)

    def chat_with_tools(self, messages: list[dict], tools: list[dict]) -> dict:
        api_key = settings.get_api_key()
        if not self.enabled:
            logger.error("LLM call blocked: missing OPENAI_API_KEY / DASHSCOPE_API_KEY")
            raise RuntimeError("OPENAI_API_KEY / DASHSCOPE_API_KEY 未配置，请设置环境变量或 .env")
        client = OpenAI(api_key=api_key, base_url=settings.openai_base_url or None)
        logger.info("Calling LLM with model=%s base_url=%s", settings.openai_model, settings.openai_base_url or "default")
        resp = client.chat.completions.create(model=settings.openai_model, messages=messages, tools=tools, tool_choice="auto")
        return resp.choices[0].message.model_dump()
