import React from 'react';
import { Typography } from 'antd';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
  <div style={{ marginBottom: 20 }}>
    <Typography.Title level={4} style={{ margin: 0 }}>
      {title}
    </Typography.Title>
    {subtitle && (
      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
        {subtitle}
      </Typography.Text>
    )}
  </div>
);

export default PageHeader;
