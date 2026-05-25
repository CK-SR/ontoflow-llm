from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest
from app.services.agent_service import AgentService

router = APIRouter(prefix="/api", tags=["chat"])
agent = AgentService()

@router.post('/chat')
def chat(req: ChatRequest):
    try:
        return agent.chat(req.message)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"工具调用失败: {e}")
