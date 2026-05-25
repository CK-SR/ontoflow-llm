import json
from datetime import datetime
from app.config import settings
from app.db import connect


class OntologyService:
    def get_schema(self) -> dict:
        with connect(settings.platform_db) as conn:
            row = conn.execute("SELECT name,schema_json,created_at FROM ontology_schemas ORDER BY id DESC LIMIT 1").fetchone()
            if row:
                return {"name": row["name"], "schema": json.loads(row["schema_json"]), "created_at": row["created_at"]}
        return {"name": "unknown", "schema": {}}

    def reload_schema(self) -> dict:
        schema = json.loads(settings.ontology_seed_path.read_text(encoding="utf-8"))
        now = datetime.utcnow().isoformat()
        with connect(settings.platform_db) as conn:
            conn.execute("INSERT INTO ontology_schemas(name,schema_json,created_at) VALUES(?,?,?)", (schema.get("name", "sample_ontology"), json.dumps(schema, ensure_ascii=False), now))
            conn.commit()
        return {"name": schema.get("name", "sample_ontology"), "schema": schema, "created_at": now}
