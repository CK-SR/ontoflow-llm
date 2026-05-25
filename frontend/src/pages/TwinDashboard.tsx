import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Tag, Spin, Alert, Descriptions, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import RiskTag from '../components/RiskTag';
import { getEquipments, getEquipmentRisks } from '../api/equipment';
import type { Equipment, EquipmentRisk } from '../types/equipment';

const STATUS_COLORS: Record<string, string> = {
  正常: '#52c41a', 异常: '#ff4d4f', 维修中: '#faad14',
};

const IMPORTANCE_COLORS: Record<string, string> = {
  关键: '#ff4d4f', 一般: '#1890ff',
};

const RISK_COLORS: Record<string, string> = {
  高: '#ff4d4f', 中: '#faad14', 低: '#52c41a',
};

const TwinDashboard: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [risks, setRisks] = useState<EquipmentRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [eq, rk] = await Promise.all([getEquipments(), getEquipmentRisks()]);
        setEquipments(eq);
        setRisks(rk);
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  const statusMap: Record<string, number> = {};
  equipments.forEach((e) => {
    const s = e.status || '未知';
    statusMap[s] = (statusMap[s] || 0) + 1;
  });

  const importanceMap: Record<string, number> = {};
  equipments.forEach((e) => {
    const il = e.importance_level || '未知';
    importanceMap[il] = (importanceMap[il] || 0) + 1;
  });

  const riskLevelMap: Record<string, number> = {};
  risks.forEach((r) => {
    riskLevelMap[r.risk_level] = (riskLevelMap[r.risk_level] || 0) + 1;
  });

  const highRisks = risks.filter((r) => r.risk_level === '高');

  const riskMap = new Map(risks.map((r) => [r.equipment_id, r]));
  const getRisk = (id: number) => riskMap.get(id);

  const statusPieOption = {
    tooltip: { trigger: 'item' as const },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: Object.entries(statusMap).map(([name, value]) => ({
        name, value,
        itemStyle: { color: STATUS_COLORS[name] || '#999' },
      })),
      label: { fontSize: 12 },
    }],
  };

  const importancePieOption = {
    tooltip: { trigger: 'item' as const },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: Object.entries(importanceMap).map(([name, value]) => ({
        name, value,
        itemStyle: { color: IMPORTANCE_COLORS[name] || '#999' },
      })),
      label: { fontSize: 12 },
    }],
  };

  const riskPieOption = {
    tooltip: { trigger: 'item' as const },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: Object.entries(riskLevelMap).map(([name, value]) => ({
        name: `${name}风险`, value,
        itemStyle: { color: RISK_COLORS[name] || '#999' },
      })),
      label: { fontSize: 12 },
    }],
  };

  const eqColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '型号', dataIndex: 'model', key: 'model' },
    { title: '类别', dataIndex: 'category', key: 'category' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (v: string) => <Tag color={STATUS_COLORS[v] || 'default'}>{v || '-'}</Tag>,
    },
    {
      title: '重要等级', dataIndex: 'importance_level', key: 'importance_level',
      render: (v: string) => <Tag color={IMPORTANCE_COLORS[v] || 'default'}>{v || '-'}</Tag>,
    },
    {
      title: '风险等级', key: 'risk',
      render: (_: unknown, record: Equipment) => {
        const r = getRisk(record.id);
        return r ? <RiskTag level={r.risk_level} /> : '-';
      },
    },
  ];

  const getDetailFromGraph = (eq: Equipment) => {
    const r = getRisk(eq.id);
    return (
      <Row gutter={16}>
        <Col span={12}>
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="设备名称">{eq.name}</Descriptions.Item>
            <Descriptions.Item label="型号">{eq.model || '-'}</Descriptions.Item>
            <Descriptions.Item label="类别">{eq.category || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={STATUS_COLORS[eq.status || ''] || 'default'}>{eq.status || '-'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="重要等级">
              <Tag color={IMPORTANCE_COLORS[eq.importance_level || ''] || 'default'}>{eq.importance_level || '-'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="生产厂家">{eq.manufacturer_name || '-'}</Descriptions.Item>
            <Descriptions.Item label="部署位置">{eq.location_name || '-'}</Descriptions.Item>
            <Descriptions.Item label="供应商">{eq.supplier_name || '-'}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={12}>
          {r ? (
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="风险等级"><RiskTag level={r.risk_level} /></Descriptions.Item>
              <Descriptions.Item label="风险分数">{r.risk_score}</Descriptions.Item>
              <Descriptions.Item label="风险原因">
                {r.reasons.map((reason) => (
                  <Tag key={reason} color="volcano" style={{ marginBottom: 4 }}>{reason}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="关联供应商">{r.related_supplier || '-'}</Descriptions.Item>
              <Descriptions.Item label="生产厂家">{r.related_manufacturer || '-'}</Descriptions.Item>
              <Descriptions.Item label="部署位置">{r.related_location || '-'}</Descriptions.Item>
              <Descriptions.Item label="维修次数">{r.maintenance_count}</Descriptions.Item>
            </Descriptions>
          ) : (
            <span style={{ color: '#999' }}>暂无风险数据</span>
          )}
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <PageHeader title="设备孪生看板" subtitle="设备状态孪生监控与风险概览" />
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={4}><StatCard title="设备总数" value={equipments.length} /></Col>
        <Col span={4}><StatCard title="高风险设备" value={highRisks.length} valueStyle={{ color: highRisks.length > 0 ? '#ff4d4f' : '#52c41a' }} /></Col>
        {Object.entries(statusMap).map(([status, count]) => (
          <Col span={4} key={status}>
            <StatCard title={`${status}设备`} value={count} />
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card title="设备状态分布" size="small">
            <ReactECharts option={statusPieOption} style={{ height: 200 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="重要等级分布" size="small">
            <ReactECharts option={importancePieOption} style={{ height: 200 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="风险等级分布" size="small">
            <ReactECharts option={riskPieOption} style={{ height: 200 }} />
          </Card>
        </Col>
      </Row>

      {highRisks.length > 0 && (
        <Card title="高风险设备列表" size="small" style={{ marginBottom: 16 }}>
          {highRisks.map((r) => (
            <div key={r.equipment_id} style={{ marginBottom: 4 }}>
              <Tag color="red">{r.equipment_name}</Tag>
              <span style={{ fontSize: 12, color: '#666' }}>分数: {r.risk_score}</span>
              <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
                {r.reasons.join('; ')}
              </span>
            </div>
          ))}
        </Card>
      )}

      <Card title="设备列表" size="small" style={{ marginBottom: 16 }}>
        <Table
          rowKey="id"
          columns={eqColumns}
          dataSource={equipments}
          size="small"
          pagination={false}
          onRow={(record) => ({
            onClick: () => setSelectedEq(record),
            style: { cursor: 'pointer', background: selectedEq?.id === record.id ? '#e6f7ff' : undefined },
          })}
        />
      </Card>

      {selectedEq && (
        <Card title={`设备详情 - ${selectedEq.name}`} size="small">
          {getDetailFromGraph(selectedEq)}
        </Card>
      )}
    </div>
  );
};

export default TwinDashboard;
