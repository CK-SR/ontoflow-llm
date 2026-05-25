from fastapi import APIRouter, HTTPException
from app.services.datasource_service import DataSourceService

router = APIRouter(prefix="/api/datasources", tags=["datasources"])
svc = DataSourceService()

@router.get("")
def list_datasources():
    return svc.list_datasources()

@router.get("/{datasource_id}")
def get_datasource(datasource_id: int):
    data = svc.get_datasource(datasource_id)
    if not data:
        raise HTTPException(status_code=404, detail="Datasource not found")
    return data
