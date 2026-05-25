import React from 'react';
import { Card, Statistic } from 'antd';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  valueStyle?: React.CSSProperties;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, prefix, suffix, valueStyle }) => (
  <Card size="small" style={{ height: '100%' }}>
    <Statistic
      title={title}
      value={value}
      prefix={prefix}
      suffix={suffix}
      valueStyle={valueStyle}
    />
  </Card>
);

export default StatCard;
