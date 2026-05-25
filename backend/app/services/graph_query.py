import json
from app.config import settings
from app.db import connect, rows_to_dict


class GraphQueryService:
    def stats(self) -> dict:
        with connect(settings.platform_db) as conn:
            node_count = conn.execute("SELECT COUNT(*) FROM graph_nodes").fetchone()[0]
            edge_count = conn.execute("SELECT COUNT(*) FROM graph_edges").fetchone()[0]
            rows = conn.execute("SELECT entity_type,COUNT(*) cnt FROM graph_nodes GROUP BY entity_type").fetchall()
            return {"node_count": node_count, "edge_count": edge_count, "entity_types": {r['entity_type']: r['cnt'] for r in rows}}

    def list_nodes(self) -> list[dict]:
        with connect(settings.platform_db) as conn:
            return rows_to_dict(conn.execute("SELECT * FROM graph_nodes ORDER BY id LIMIT 200").fetchall())

    def list_edges(self) -> list[dict]:
        with connect(settings.platform_db) as conn:
            return rows_to_dict(conn.execute("SELECT * FROM graph_edges ORDER BY id LIMIT 300").fetchall())

    def get_entity(self, node_id: int) -> dict | None:
        with connect(settings.platform_db) as conn:
            row = conn.execute("SELECT * FROM graph_nodes WHERE id=?", (node_id,)).fetchone()
            return dict(row) if row else None

    def neighbors(self, node_id: int) -> list[dict]:
        with connect(settings.platform_db) as conn:
            rows = conn.execute("""SELECT e.relation_type, n.* FROM graph_edges e
            JOIN graph_nodes n ON n.id=e.target_node_id WHERE e.source_node_id=?
            UNION ALL
            SELECT e.relation_type, n.* FROM graph_edges e
            JOIN graph_nodes n ON n.id=e.source_node_id WHERE e.target_node_id=?""", (node_id, node_id)).fetchall()
            return rows_to_dict(rows)

    def search(self, keyword: str) -> list[dict]:
        kw = f"%{keyword}%"
        with connect(settings.platform_db) as conn:
            rows = conn.execute("SELECT * FROM graph_nodes WHERE label LIKE ? OR properties_json LIKE ? LIMIT 50", (kw, kw)).fetchall()
            return rows_to_dict(rows)
