from app.services.graph_query import GraphQueryService

svc = GraphQueryService()

def search_graph(keyword: str) -> list[dict]:
    return svc.search(keyword)

def get_entity_neighbors(node_id: int) -> list[dict]:
    return svc.neighbors(node_id)
