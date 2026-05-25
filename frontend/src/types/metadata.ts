export interface ColumnInfo {
  cid?: number;
  name: string;
  type?: string;
  notnull?: number;
  dflt_value?: string | null;
  pk?: number;
  primary_key?: boolean;
  nullable?: boolean;
}

export interface TableColumnsResponse {
  table_name: string;
  columns: ColumnInfo[];
}

export interface TableSampleResponse {
  table_name: string;
  sample_rows: Record<string, unknown>[];
}
