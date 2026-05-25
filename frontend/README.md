# Mini OntoFlow 前端管理台

Mini OntoFlow 本体增强智能平台的前端界面，基于 React + TypeScript + Ant Design 构建。

## 快速开始

### 1. 安装 Node.js

确保已安装 Node.js >= 18，可通过以下命令确认：

```bash
node -v
npm -v
```

### 2. 安装依赖

```bash
cd frontend
npm install
```

### 3. 启动后端

前端依赖后端 API，请先启动后端服务：

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. 启动前端开发服务器

```bash
cd frontend
npm run dev
```

默认访问：http://127.0.0.1:5173

## 配置

### API 地址

默认后端地址为 `http://127.0.0.1:8000`。

如需修改，创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 中的 `VITE_API_BASE_URL`：

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## 页面说明

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页总览 | `/` | 系统状态、统计数据、架构流程展示 |
| 探索对话 | `/chat` | 自然语言对话，调用 Agent 查询数据 |
| 数据源管理 | `/datasources` | 查看已接入的数据源信息 |
| 元数据资产 | `/metadata` | 浏览数据表、字段、样例数据 |
| 本体建模 | `/ontology` | 查看本体 Schema 实体与关系定义 |
| 图谱视图 | `/graph` | 可视化知识图谱，支持搜索与节点详情 |
| 设备孪生看板 | `/twin` | 设备状态监控、风险概览 |
| 设备风险分析 | `/risk` | 设备风险评估列表与详情 |

## 常见问题

### 1. 后端未启动

页面显示"后端服务未连接"提示。请先启动后端：

```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. 端口不一致

如果后端不在 8000 端口，请修改 `.env` 中的 `VITE_API_BASE_URL`。

### 3. CORS 跨域问题

如果浏览器控制台出现 CORS 错误，需要给 FastAPI 后端添加 CORS 中间件：

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. npm install 失败

- 检查 Node.js 版本是否 >= 18
- 尝试删除 `node_modules` 和 `package-lock.json` 后重新安装
- 如果网络问题，可尝试使用国内镜像：`npm config set registry https://registry.npmmirror.com`

## 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录，可部署到任意静态文件服务器。

## 技术栈

- Vite 6
- React 18
- TypeScript 5
- Ant Design 5
- Axios
- React Router 6
- Cytoscape.js（图谱可视化）
- ECharts（图表）
