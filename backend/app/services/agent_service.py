import json
from app.config import settings
from app.tools.registry import TOOLS
from app.schemas.chat import ChatResponse, ToolCallTrace
from app.services.llm_client import LLMClient
from app.tools.equipment_tools import analyze_equipment_risk


class AgentService:
    def __init__(self) -> None:
        self.llm = LLMClient()

    def _mock(self, msg: str) -> ChatResponse:
        traces = []
        text = ""
        if "数据源" in msg:
            r = TOOLS["list_data_sources"](); traces.append(ToolCallTrace(tool_name="list_data_sources", arguments={}, result_preview=str(r[:2]))); text = f"数据来源: TOOL。当前数据源: {r}"
        elif "表" in msg:
            r = TOOLS["list_tables"](); traces.append(ToolCallTrace(tool_name="list_tables", arguments={}, result_preview=str(r))); text = f"数据来源: SQL元数据。表有: {', '.join(r)}"
        elif "异常" in msg or "风险" in msg:
            res = [analyze_equipment_risk(i) for i in range(1, 7)]
            high = [x for x in res if x['risk_level'] == '高']
            traces.append(ToolCallTrace(tool_name="analyze_equipment_risk", arguments={"batch":"1..6"}, result_preview=str(high[:2])))
            text = f"数据来源: TOOL+SQL。高风险设备: {high}"
        else:
            text = "数据来源: LLM(MOCK)。请询问数据源、表、异常设备或风险。"
        return ChatResponse(answer=text, tool_calls=traces, data_source="TOOL")

    def chat(self, message: str) -> ChatResponse:
        if settings.mock_llm:
            return self._mock(message)
        return self._mock(message)
