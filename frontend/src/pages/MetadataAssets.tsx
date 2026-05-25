import React, { useEffect, useState } from 'react';
import { Card, Table, List, Input, Tag, Spin, Alert, Row, Col, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import { getTables, getTableColumns, getTableSample } from '../api/metadata';
import type { ColumnInfo } from '../types/metadata';

const MetadataAssets: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [sampleRows, setSampleRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [colLoading, setColLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getTables()
      .then(setTables)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectTable = async (name: string) => {
    setSelectedTable(name);
    setColLoading(true);
    try {
      const [colRes, sampleRes] = await Promise.all([
        getTableColumns(name),
        getTableSample(name),
      ]);
      setColumns(colRes.columns || []);
      setSampleRows(sampleRes.sample_rows || []);
    } catch (e) {
      setColumns([]);
      setSampleRows([]);
    } finally {
      setColLoading(false);
    }
  };

  const filteredTables = tables.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase()),
  );

  const columnDefs = [
    { title: '字段名', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (v: string) => v || '-' },
    {
      title: '主键',
      key: 'pk',
      render: (_: unknown, record: ColumnInfo) =>
        record.pk === 1 || record.primary_key ? <Tag color="blue">PK</Tag> : '-',
    },
    {
      title: '非空',
      key: 'notnull',
      render: (_: unknown, record: ColumnInfo) =>
        record.notnull === 1 || record.nullable === false ? '是' : '否',
    },
    { title: '默认值', dataIndex: 'dflt_value', key: 'dflt_value', render: (v: unknown) => v ?? '-' },
  ];

  const sampleColumns = sampleRows.length > 0
    ? Object.keys(sampleRows[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key,
        ellipsis: true,
        render: (v: unknown) => String(v ?? '-'),
      }))
    : [];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <PageHeader title="元数据资产" subtitle="浏览数据表的字段与样例数据" />
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}
      <Row gutter={16}>
        <Col span={6}>
          <Card title="数据表" size="small" style={{ height: '100%' }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜索表名"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: 12 }}
              allowClear
            />
            <List
              size="small"
              dataSource={filteredTables}
              style={{ maxHeight: 500, overflow: 'auto' }}
              renderItem={(name) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    background: selectedTable === name ? '#e6f7ff' : undefined,
                    padding: '6px 12px',
                  }}
                  onClick={() => handleSelectTable(name)}
                >
                  <Typography.Text strong={selectedTable === name}>{name}</Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={18}>
          {selectedTable ? (
            <Spin spinning={colLoading}>
              <Card title={`字段信息 - ${selectedTable}`} size="small" style={{ marginBottom: 16 }}>
                <Table
                  rowKey="name"
                  columns={columnDefs}
                  dataSource={columns}
                  pagination={false}
                  size="small"
                />
              </Card>
              <Card title={`样例数据 - ${selectedTable}`} size="small">
                <Table
                  rowKey={(_, i) => String(i)}
                  columns={sampleColumns}
                  dataSource={sampleRows}
                  pagination={false}
                  size="small"
                  scroll={{ x: 'max-content' }}
                />
              </Card>
            </Spin>
          ) : (
            <Card style={{ textAlign: 'center', padding: 60, color: '#999' }}>
              请在左侧选择一个表查看详情
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MetadataAssets;
