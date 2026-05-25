import React from 'react';
import { Card } from 'antd';
import PageHeader from '../components/PageHeader';
import ChatBox from '../components/ChatBox';

const ExploreChat: React.FC = () => (
  <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
    <PageHeader title="探索对话" subtitle="通过自然语言查询数据、分析设备风险" />
    <Card style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: '0 0 12px 0' } }}>
      <ChatBox />
    </Card>
  </div>
);

export default ExploreChat;
