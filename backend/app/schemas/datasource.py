from pydantic import BaseModel


class DataSource(BaseModel):
    id: int
    name: str
    type: str
    db_path: str
    description: str
