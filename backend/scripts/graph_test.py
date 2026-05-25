import requests
import json

base = "http://127.0.0.1:8000"


def chat(message: str, timeout: int = 30):
    print(f"\n{'='*60}")
    print(f"Q: {message}")
    print("-" * 60)
    resp = requests.post(base + "/api/chat", json={"message": message}, timeout=timeout).json()
    print(f"A: {resp['answer']}")
    print(f"Data source: {resp['data_source']}")
    print(f"Tool calls: {[tc['tool_name'] for tc in resp['tool_calls']]}")
    return resp


chat("焊接机器人B的供应商还供应了哪些设备？")
chat("一号厂房里部署了哪些设备？请通过知识图谱查找。")
chat("风险高的供应商签了哪些采购合同？")
chat("从焊接机器人B出发，找出与它相关的所有实体和关系。")
