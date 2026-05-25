# Mini OntoFlow Backend Demo

## 项目目标
实现“SQLite业务库 -> 元数据 -> 本体 -> 图谱 -> Agent工具调用 -> 自然语言问答”的最小闭环。

## 说明：不再提交二进制 DB
本仓库不再提交 `data/*.db` 二进制文件，服务启动或脚本执行时会自动创建。

## Windows 安装与运行
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> 首次启动会自动创建 `data/equipment_demo.db`、`data/platform.db` 并自动构建图谱。

## 手动初始化（可选）
- `python scripts/init_demo_db.py`：重建业务库与平台库。
- `python scripts/build_graph.py`：重建图谱节点与边。

## 示例 API
- `GET /api/health`
- `GET /api/metadata/tables`
- `GET /api/graph/stats`
- `GET /api/equipment/risks`
- `POST /api/chat` body: `{"message":"当前有哪些风险较高的设备？"}`
