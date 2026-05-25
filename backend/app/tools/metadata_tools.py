from app.services.metadata_service import MetadataService

svc = MetadataService()

def list_tables() -> list[str]:
    return svc.list_tables()

def describe_table(table_name: str) -> list[dict]:
    return svc.describe_table(table_name)
