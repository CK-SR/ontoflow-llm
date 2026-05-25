from fastapi import APIRouter
from app.services.ontology_service import OntologyService

router = APIRouter(prefix="/api/ontology", tags=["ontology"])
svc = OntologyService()

@router.get("/schema")
def get_schema(): return svc.get_schema()

@router.post("/schema/reload")
def reload_schema(): return svc.reload_schema()
