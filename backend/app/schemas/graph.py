from pydantic import BaseModel


class GraphStats(BaseModel):
    node_count: int
    edge_count: int
    entity_types: dict[str, int]
