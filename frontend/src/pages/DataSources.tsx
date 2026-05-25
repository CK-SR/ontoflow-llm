import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Alert, Spin } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import { getDatasources } from '../api/datasource';
import type { DataSource } from '../types/datasource';

const DataSources: React.FC = () => {
  const [data, setData] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDatasources()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (v: string) => <Tag icon={<DatabaseOutlined />} color="blue">{v}</Tag>,
    },
    { title: '路径', dataIndex: 'db_path', key: 'db_path', ellipsis: true },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态',
      key: 'status',
      render: () => <Tag color="green">可用</Tag>,
    },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <PageHeader title="数据源管理" subtitle="查看已接入的数据源信息" />
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}
      <Card size="small">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default DataSources;
