import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Steps, Alert, Spin, Typography } from 'antd';
import {
  DatabaseOutlined,
  TableOutlined,
  ApartmentOutlined,
  NodeIndexOutlined,
  RobotOutlined,
  MonitorOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import client from '../api/client';
import type { GraphStats } from '../types/graph';

interface DashboardData {
  healthOk: boolean;
  datasourceCount: number;
  tableCount: number;
  graphStats: GraphStats | null;
  highRiskCount: number;
  lastLoadTime: string;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    healthOk: false,
    datasourceCount: 0,
    tableCount: 0,
    graphStats: null,
    highRiskCount: 0,
    lastLoadTime: '-',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [healthRes, dsRes, tablesRes, statsRes, risksRes] = await Promise.allSettled([
          client.get('/api/health'),
          client.get('/api/datasources'),
          client.get('/api/metadata/tables'),
          client.get('/api/graph/stats'),
          client.get('/api/equipment/risks'),
        ]);

        const healthOk = healthRes.status === 'fulfilled' && healthRes.value.data?.status === 'ok';
        const datasourceCount =
          dsRes.status === 'fulfilled' ? (dsRes.value.data?.length ?? 0) : 0;
        const tableCount =
          tablesRes.status === 'fulfilled' ? (tablesRes.value.data?.length ?? 0) : 0;
        const graphStats =
          statsRes.status === 'fulfilled' ? statsRes.value.data : null;
        const risks =
          risksRes.status === 'fulfilled' ? (risksRes.value.data ?? []) : [];
        const highRiskCount = risks.filter(
          (r: { risk_level?: string }) => r.risk_level === '高',
        ).length;

        setData({
          healthOk,
          datasourceCount,
          tableCount,
          graphStats,
          highRiskCount,
          lastLoadTime: new Date().toLocaleString('zh-CN'),
        });
      } catch {
        setError('后端服务未连接，请先启动后端');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Mini OntoFlow 本体增强智能平台"
        subtitle="样例数据库 · 元数据探知 · 本体建模 · 图谱构建 · 智能体工具调用 · 设备状态孪生"
      />

      {error && (
        <Alert
          type="error"
          message="后端服务未连接"
          description="请先启动后端服务：cd backend && python -m app.main"
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <StatCard
            title="后端状态"
            value={data.healthOk ? '正常' : '异常'}
            prefix={
              data.healthOk ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              )
            }
            valueStyle={{ color: data.healthOk ? '#52c41a' : '#ff4d4f', fontSize: 20 }}
          />
        </Col>
        <Col span={4}>
          <StatCard title="数据源数量" value={data.datasourceCount} />
        </Col>
        <Col span={4}>
          <StatCard title="表数量" value={data.tableCount} />
        </Col>
        <Col span={4}>
          <StatCard title="图谱节点" value={data.graphStats?.node_count ?? '-'} />
        </Col>
        <Col span={4}>
          <StatCard title="图谱关系" value={data.graphStats?.edge_count ?? '-'} />
        </Col>
        <Col span={4}>
          <StatCard
            title="高风险设备"
            value={data.highRiskCount}
            valueStyle={{ color: data.highRiskCount > 0 ? '#ff4d4f' : '#52c41a' }}
          />
        </Col>
      </Row>

      <Card title="系统架构流程" size="small">
        <Steps
          current={-1}
          items={[
            { title: '样例数据库', icon: <DatabaseOutlined /> },
            { title: '元数据探知', icon: <TableOutlined /> },
            { title: '本体 Schema', icon: <ApartmentOutlined /> },
            { title: '图谱实例', icon: <NodeIndexOutlined /> },
            { title: 'Agent 工具调用', icon: <RobotOutlined /> },
            { title: '设备孪生看板', icon: <MonitorOutlined /> },
          ]}
        />
      </Card>

      {data.graphStats && data.graphStats.entity_types && (
        <Card title="图谱实体类型分布" size="small" style={{ marginTop: 16 }}>
          <Row gutter={[16, 8]}>
            {Object.entries(data.graphStats.entity_types).map(([type, count]) => (
              <Col key={type} span={4}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Typography.Text strong>{type}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary">{count} 个节点</Typography.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
        最近加载时间：{data.lastLoadTime}
      </div>
    </div>
  );
};

export default Dashboard;
