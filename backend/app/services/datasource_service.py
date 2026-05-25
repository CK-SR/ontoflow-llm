from app.config import settings
from app.db import connect, rows_to_dict


class DataSourceService:
    def list_datasources(self) -> list[dict]:
        with connect(settings.platform_db) as conn:
            rows = conn.execute("SELECT * FROM datasources ORDER BY id").fetchall()
            return rows_to_dict(rows)

    def get_datasource(self, datasource_id: int) -> dict | None:
        with connect(settings.platform_db) as conn:
            row = conn.execute("SELECT * FROM datasources WHERE id=?", (datasource_id,)).fetchone()
            return dict(row) if row else None
