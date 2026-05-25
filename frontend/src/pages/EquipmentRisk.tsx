import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Select, Spin, Alert, Descriptions, Drawer, Button, Typography } from 'antd';
import PageHeader from '../components/PageHeader';
import RiskTag from '../components/RiskTag';
import { getEquipmentRisks, getEquipmentRisk } from '../api/equipment';
import type { EquipmentRisk } from '../types/equipment';

const EquipmentRiskPage: React.FC = () => {
  const [risks, setRisks] = useState<EquipmentRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterLevel, setFilterLevel] = useState<string | undefined>(undefined);
  const [detailRisk, setDetailRisk] = useState<EquipmentRisk | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    getEquipmentRisks()
      .then(setRisks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleViewDetail = async (equipmentId: number) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const data = await getEquipmentRisk(equipmentId);
      setDetailRisk(data);
    } catch {
      setDetailRisk(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredRisks = filterLevel
    ? risks.filter((r) => r.risk_level === filterLevel)
    : risks;

  const columns = [
    { title: '设备ID', dataIndex: 'equipment_id', key: 'equipment_id', width: 80 },
    { title: '设备名称', dataIndex: 'equipment_name', key: 'equipment_name' },
    { title: '风险分数', dataIndex: 'risk_score', key: 'risk_score', sorter: (a: EquipmentRisk, b: EquipmentRisk) => a.risk_score - b.risk_score },
    {
      title: '风险等级', dataIndex: 'risk_level', key: 'risk_level',
      render: (v: string) => <RiskTag level={v} />,
    },
    {
      title: '风险原因', dataIndex: 'reasons', key: 'reasons',
      render: (reasons: string[]) => (
        <span>{reasons.map((r) => <Tag key={r} color="volcano" style={{ marginBottom: 2 }}>{r}</Tag>)}</span>
      ),
    },
    { title: '关联供应商', dataIndex: 'related_supplier', key: 'related_supplier', render: (v: string | null) => v || '-' },
    { title: '维修次数', dataIndex: 'maintenance_count', key: 'maintenance_count', width: 90 },
    {
      title: '操作', key: 'action', width: 90,
      render: (_: unknown, record: EquipmentRisk) => (
        <Button type="link" size="small" onClick={() => handleViewDetail(record.equipment_id)}>详情</Button>
      ),
    },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <PageHeader title="设备风险分析" subtitle="查看所有设备的风险评估结果" />
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}

      <Card size="small" style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>按风险等级筛选：</span>
        <Select
          style={{ width: 160 }}
          placeholder="全部"
          allowClear
          value={filterLevel}
          onChange={(v) => setFilterLevel(v)}
          options={[
            { label: '高风险', value: '高' },
            { label: '中风险', value: '中' },
            { label: '低风险', value: '低' },
          ]}
        />
      </Card>

      <Card size="small">
        <Table
          rowKey="equipment_id"
          columns={columns}
          dataSource={filteredRisks}
          size="middle"
          pagination={false}
        />
      </Card>

      <Drawer
        title="设备风险详情"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        width={460}
      >
        {detailLoading ? (
          <Spin />
        ) : detailRisk ? (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="设备ID">{detailRisk.equipment_id}</Descriptions.Item>
            <Descriptions.Item label="设备名称">{detailRisk.equipment_name}</Descriptions.Item>
            <Descriptions.Item label="风险分数">{detailRisk.risk_score}</Descriptions.Item>
            <Descriptions.Item label="风险等级"><RiskTag level={detailRisk.risk_level} /></Descriptions.Item>
            <Descriptions.Item label="风险原因">
              {detailRisk.reasons.map((r) => <Tag key={r} color="volcano" style={{ marginBottom: 4 }}>{r}</Tag>)}
            </Descriptions.Item>
            <Descriptions.Item label="关联供应商">{detailRisk.related_supplier || '-'}</Descriptions.Item>
            <Descriptions.Item label="生产厂家">{detailRisk.related_manufacturer || '-'}</Descriptions.Item>
            <Descriptions.Item label="部署位置">{detailRisk.related_location || '-'}</Descriptions.Item>
            <Descriptions.Item label="维修次数">{detailRisk.maintenance_count}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Typography.Text type="secondary">加载失败</Typography.Text>
        )}
      </Drawer>
    </div>
  );
};

export default EquipmentRiskPage;
