import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Tag, Collapse, Typography, Space, Alert, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import type { ChatResponse, ToolCallTrace } from '../types/chat';
import { sendChat } from '../api/chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: ToolCallTrace[];
  dataSource?: string;
  error?: boolean;
}

const EXAMPLE_QUESTIONS = [
  '当前系统有哪些数据源？',
  '这个数据源里有哪些表？',
  'equipment 表有哪些字段？',
  '当前有哪些风险较高的设备？',
  '帮我分析设备 E001 的风险原因。',
  '查一下某个设备关联的厂家、位置和供应商。',
];

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res: ChatResponse = await sendChat(msgText);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.answer,
        toolCalls: res.tool_calls || [],
        dataSource: res.data_source,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: err instanceof Error ? err.message : '请求失败，请检查后端是否启动',
        error: true,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px 0',
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <RobotOutlined style={{ fontSize: 48, marginBottom: 16, color: '#b0c4de' }} />
            <Typography.Paragraph type="secondary">
              输入问题开始探索，或点击下方示例
            </Typography.Paragraph>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 12,
              padding: '0 12px',
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: 8,
                background: msg.role === 'user' ? '#1a3a5c' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#333',
                border: msg.role === 'user' ? 'none' : '1px solid #e8e8e8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                {msg.role === 'assistant' && <RobotOutlined />}
                {msg.role === 'user' && <UserOutlined />}
                <span style={{ fontWeight: 500, fontSize: 12 }}>
                  {msg.role === 'user' ? '你' : '助手'}
                </span>
                {msg.dataSource && (
                  <Tag color="blue" style={{ marginLeft: 4, fontSize: 11 }}>
                    {msg.dataSource}
                  </Tag>
                )}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.6 }}>
                {msg.content}
              </div>
              {msg.error && <Alert type="error" message="请求出错" style={{ marginTop: 8 }} />}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <Collapse
                  size="small"
                  style={{ marginTop: 8 }}
                  items={msg.toolCalls.map((tc, idx) => ({
                    key: idx,
                    label: (
                      <Space>
                        <Tag color="orange">{tc.tool_name}</Tag>
                        <span style={{ fontSize: 12, color: '#666' }}>工具调用</span>
                      </Space>
                    ),
                    children: (
                      <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          参数：
                        </Typography.Text>
                        <pre style={{ fontSize: 11, margin: '4px 0', background: '#fafafa', padding: 6, borderRadius: 4 }}>
                          {JSON.stringify(tc.arguments, null, 2)}
                        </pre>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          结果预览：
                        </Typography.Text>
                        <pre style={{ fontSize: 11, margin: '4px 0', background: '#fafafa', padding: 6, borderRadius: 4, maxHeight: 200, overflow: 'auto' }}>
                          {tc.result_preview}
                        </pre>
                      </div>
                    ),
                  }))}
                />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'center', padding: 12 }}>
            <Spin tip="思考中..." />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ marginBottom: 8, padding: '0 12px' }}>
          <Space wrap size={[4, 4]}>
            {EXAMPLE_QUESTIONS.map((q) => (
              <Tag
                key={q}
                style={{ cursor: 'pointer', fontSize: 12 }}
                color="default"
                onClick={() => handleSend(q)}
              >
                {q}
              </Tag>
            ))}
          </Space>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '0 12px' }}>
          <Input
            size="large"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={() => handleSend()}
            placeholder="输入问题，例如：当前有哪些风险较高的设备？"
            disabled={loading}
          />
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
