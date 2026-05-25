from app.config import settings
from app.db import connect, rows_to_dict

DENY = ["drop", "delete", "update", "insert", "alter", "create", "pragma", "attach"]

def query_sql(sql: str) -> list[dict]:
    s = sql.strip().lower()
    if not s.startswith("select") or any(k in s for k in DENY):
        raise ValueError("只允许执行安全的 SELECT 查询")
    with connect(settings.equipment_db) as conn:
        rows = conn.execute(sql).fetchmany(50)
        return rows_to_dict(rows)
