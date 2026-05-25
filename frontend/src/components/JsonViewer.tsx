import React from 'react';
import { Collapse, Typography } from 'antd';

interface JsonViewerProps {
  data: unknown;
  title?: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, title = 'JSON 数据' }) => {
  const jsonStr = JSON.stringify(data, null, 2);

  return (
    <Collapse
      size="small"
      items={[
        {
          key: '1',
          label: title,
          children: (
            <Typography.Text>
              <pre
                style={{
                  margin: 0,
                  fontSize: 12,
                  maxHeight: 400,
                  overflow: 'auto',
                  background: '#fafafa',
                  padding: 12,
                  borderRadius: 4,
                }}
              >
                {jsonStr}
              </pre>
            </Typography.Text>
          ),
        },
      ]}
    />
  );
};

export default JsonViewer;
