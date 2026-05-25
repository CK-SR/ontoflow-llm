from pydantic import BaseModel


class OntologySchemaResponse(BaseModel):
    name: str
    schema: dict
    created_at: str | None = None
