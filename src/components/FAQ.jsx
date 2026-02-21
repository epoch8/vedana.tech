import React from 'react';
import { Collapse, ConfigProvider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const theme = {
  token: {
    colorPrimary: '#2563eb',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
};

const items = [
  {
    key: '1',
    label: 'Do I need code skills?',
    children: <p style={{ margin: 0, color: '#475569' }}>No. You can build flows with blocks and rules.</p>,
  },
  {
    key: '2',
    label: 'Which channels are supported?',
    children: <p style={{ margin: 0, color: '#475569' }}>Instagram DM, WhatsApp, Facebook Messenger, SMS, email, and more.</p>,
  },
  {
    key: '3',
    label: 'Can I connect my shop?',
    children: <p style={{ margin: 0, color: '#475569' }}>Yes. Shopify and others. You can sync products and orders.</p>,
  },
  {
    key: '4',
    label: 'Is there a free plan?',
    children: <p style={{ margin: 0, color: '#475569' }}>Yes. Start free and upgrade any time.</p>,
  },
];

export default function FAQ() {
  return (
    <ConfigProvider theme={theme}>
      <section id="faq" style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.875rem', margin: 0, color: '#0f172a' }}>FAQ</h2>
          <Collapse
            items={items}
            accordion={false}
            expandIcon={({ isActive }) => (
              <PlusOutlined rotate={isActive ? 45 : 0} style={{ transition: 'transform 0.2s' }} />
            )}
            expandIconPosition="end"
            style={{ marginTop: '2rem', background: '#fff', borderRadius: '1rem' }}
          />
        </div>
      </section>
    </ConfigProvider>
  );
}
