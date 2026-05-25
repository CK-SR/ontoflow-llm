from app.config import settings
from app.db import connect, rows_to_dict


class MetadataService:
    def list_tables(self) -> list[str]:
        with connect(settings.equipment_db) as conn:
            rows = conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").fetchall()
            return [r[0] for r in rows]

    def describe_table(self, table_name: str) -> list[dict]:
        with connect(settings.equipment_db) as conn:
            rows = conn.execute(f"PRAGMA table_info({table_name})").fetchall()
            return rows_to_dict(rows)

    def sample_table(self, table_name: str, limit: int = 5) -> list[dict]:
        with connect(settings.equipment_db) as conn:
            rows = conn.execute(f"SELECT * FROM {table_name} LIMIT ?", (limit,)).fetchall()
            return rows_to_dict(rows)
