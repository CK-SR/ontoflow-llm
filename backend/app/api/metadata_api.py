from fastapi import APIRouter
from app.services.metadata_service import MetadataService

router = APIRouter(prefix="/api/metadata", tags=["metadata"])
svc = MetadataService()

@router.get("/tables")
def tables(): return svc.list_tables()

@router.get("/tables/{table_name}/columns")
def columns(table_name: str): return {"table_name": table_name, "columns": svc.describe_table(table_name)}

@router.get("/tables/{table_name}/sample")
def sample(table_name: str): return {"table_name": table_name, "sample_rows": svc.sample_table(table_name)}
