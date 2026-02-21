import React from 'react';
import { Button, Space, ConfigProvider } from 'antd';

const theme = {
  token: {
    colorPrimary: '#2563eb',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
};

export default function CTAButtons() {
  return (
    <ConfigProvider theme={theme}>
      <Space size="middle" wrap>
        <Button
          href="#signup"
          size="large"
          style={{
            background: '#fff',
            color: '#0f172a',
            borderColor: 'transparent',
            fontWeight: 500,
            borderRadius: '0.75rem',
          }}
        >
          Start free
        </Button>
        <Button
          href="#demo"
          size="large"
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.3)',
            fontWeight: 500,
            borderRadius: '0.75rem',
          }}
        >
          Book demo
        </Button>
      </Space>
    </ConfigProvider>
  );
}
