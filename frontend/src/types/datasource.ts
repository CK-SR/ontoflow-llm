export interface DataSource {
  id: number;
  name: string;
  type: string;
  db_path: string;
  description: string;
  status?: string;
}

export interface DataSourceListResponse {
  data: DataSource[];
}
