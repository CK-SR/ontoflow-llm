export interface OntologyEntity {
  name: string;
  properties?: string[];
}

export interface OntologyRelation {
  name: string;
  source: string;
  target: string;
  label?: string;
}

export interface OntologySchema {
  entities?: OntologyEntity[];
  relations?: OntologyRelation[];
  [key: string]: unknown;
}

export interface OntologySchemaResponse {
  name: string;
  schema: OntologySchema;
  created_at?: string | null;
}
