from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.bootstrap import ensure_runtime_ready
from app.api.datasource_api import router as datasource_router
from app.api.metadata_api import router as metadata_router
from app.api.ontology_api import router as ontology_router
from app.api.graph_api import router as graph_router
from app.api.chat_api import router as chat_router

app = FastAPI(title="Mini OntoFlow")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/api/health')
def health(): return {"status":"ok"}

app.include_router(datasource_router)
app.include_router(metadata_router)
app.include_router(ontology_router)
app.include_router(graph_router)
app.include_router(chat_router)


@app.on_event("startup")
def startup_init() -> None:
    ensure_runtime_ready()
