from pydantic import BaseModel


class TableColumnsResponse(BaseModel):
    table_name: str
    columns: list[dict]


class TableSampleResponse(BaseModel):
    table_name: str
    sample_rows: list[dict]
