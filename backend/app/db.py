import json
import sqlite3
from pathlib import Path
from typing import Any


def connect(db_path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def rows_to_dict(rows: list[sqlite3.Row]) -> list[dict[str, Any]]:
    return [dict(r) for r in rows]


def json_dumps(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False)
