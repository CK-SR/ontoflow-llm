import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Button, Spin, Alert, Typography, Descriptions } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import JsonViewer from '../components/JsonViewer';
import { getOntologySchema, reloadOntologySchema } from '../api/ontology';
import type { OntologySchemaResponse, OntologyEntity, OntologyRelation } from '../types/ontology';

const ENTITY_COLORS: Record<string, string> = {
  Equipment: '#1a3a5c', Manufacturer: '#e67e22', Location: '#27ae60',
  MaintenanceRecord: '#8e44ad', Supplier: '#c0392b', PurchaseContract: '#2980b9',
};

const RELATION_COLORS: Record<string, string> = {
  PRODUCED_BY: 'blue', LOCATED_IN: 'green', HAS_MAINTENANCE: 'purple',
  SUPPLIED_BY: 'red', HAS_CONTRACT: 'cyan', SIGNED_CONTRACT: 'geekblue',
};

const OntologyModeling: React.FC = () => {
  const [schema, setSchema] = useState<OntologySchemaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloading, setReloading] = useState(false);

  const fetchSchema = async () => {
    try {
      const data = await getOntologySchema();
      setSchema(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchema(); }, []);

  const handleReload = async () => {
    setReloading(true);
    try {
      const data = await reloadOntologySchema();
      setSchema(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '重载失败');
    } finally {
      setReloading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  const entities: OntologyEntity[] = schema?.schema?.entities || [];
  const relations: OntologyRelation[] = schema?.schema?.relations || [];

  return (
    <div>
      <PageHeader title="本体建模" subtitle="查看本体 Schema 中的实体与关系定义" />
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Descriptions size="small" column={2}>
          <Descriptions.Item label="Schema 名称">{schema?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{schema?.created_at || '-'}</Descriptions.Item>
        </Descriptions>
        <Button icon={<ReloadOutlined />} onClick={handleReload} loading={reloading}>
          重新加载 Schema
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="实体类型" size="small">
            {entities.length === 0 ? (
              <Typography.Text type="secondary">暂无实体定义</Typography.Text>
            ) : (
              entities.map((ent) => (
                <Card key={ent.name} size="small" style={{ marginBottom: 8 }}
                  title={<Tag color={ENTITY_COLORS[ent.name] || 'default'}>{ent.name}</Tag>}>
                  {ent.properties && ent.properties.length > 0 ? (
                    <div>{ent.properties.map((p) => (
                      <Tag key={p} style={{ marginBottom: 4 }}>{p}</Tag>
                    ))}</div>
                  ) : (
                    <Typography.Text type="secondary">无属性定义</Typography.Text>
                  )}
                </Card>
              ))
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="关系类型" size="small">
            {relations.length === 0 ? (
              <Typography.Text type="secondary">暂无关系定义</Typography.Text>
            ) : (
              relations.map((rel, idx) => (
                <Card key={idx} size="small" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Tag color={ENTITY_COLORS[rel.source] || 'default'}>{rel.source}</Tag>
                    <Tag color={RELATION_COLORS[rel.name] || 'default'}>{rel.label || rel.name}</Tag>
                    <Tag color={ENTITY_COLORS[rel.target] || 'default'}>{rel.target}</Tag>
                  </div>
                </Card>
              ))
            )}
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <JsonViewer data={schema?.schema || {}} title="原始 Schema JSON" />
      </div>
    </div>
  );
};

export default OntologyModeling;
