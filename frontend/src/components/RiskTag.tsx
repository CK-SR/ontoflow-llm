import React from 'react';
import { Tag } from 'antd';

interface RiskTagProps {
  level: string;
}

const RISK_COLOR_MAP: Record<string, string> = {
  高: 'red',
  中: 'orange',
  低: 'green',
};

const RiskTag: React.FC<RiskTagProps> = ({ level }) => (
  <Tag color={RISK_COLOR_MAP[level] || 'default'}>{level}风险</Tag>
);

export default RiskTag;
