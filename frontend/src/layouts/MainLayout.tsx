import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  MessageOutlined,
  DatabaseOutlined,
  TableOutlined,
  ApartmentOutlined,
  NodeIndexOutlined,
  MonitorOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Sider, Header, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页总览' },
  { key: '/chat', icon: <MessageOutlined />, label: '探索对话' },
  { key: '/datasources', icon: <DatabaseOutlined />, label: '数据源管理' },
  { key: '/metadata', icon: <TableOutlined />, label: '元数据资产' },
  { key: '/ontology', icon: <ApartmentOutlined />, label: '本体建模' },
  { key: '/graph', icon: <NodeIndexOutlined />, label: '图谱视图' },
  { key: '/twin', icon: <MonitorOutlined />, label: '设备孪生看板' },
  { key: '/risk', icon: <WarningOutlined />, label: '设备风险分析' },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={200}
        style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Title level={5} style={{ margin: 0, color: '#1a3a5c' }}>
            Mini OntoFlow
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            height: 56,
          }}
        >
          <Title level={4} style={{ margin: 0, color: '#2c3e50', fontWeight: 500 }}>
            本体增强智能平台
          </Title>
        </Header>
        <Content
          style={{
            margin: 16,
            padding: 20,
            background: '#f5f7fa',
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
