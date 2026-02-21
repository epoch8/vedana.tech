import React from 'react';
import { Table, ConfigProvider } from 'antd';

const theme = {
  token: {
    colorPrimary: '#2563eb',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
};

const columns = [
  {
    title: 'Aspect',
    dataIndex: 'aspect',
    key: 'aspect',
    width: '28%',
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: 'Classic RAG',
    dataIndex: 'classic',
    key: 'classic',
    width: '36%',
  },
  {
    title: 'Semantic RAG (Vedana)',
    dataIndex: 'semantic',
    key: 'semantic',
    width: '36%',
    render: (_, record) => (
      <span dangerouslySetInnerHTML={{ __html: record.semanticHtml }} />
    ),
  },
];

const data = [
  {
    key: '1',
    aspect: 'Full lists & filters',
    classic: 'Returns only a handful of "similar" items',
    semanticHtml: 'Always returns the <strong>complete set</strong> that matches filters',
  },
  {
    key: '2',
    aspect: 'Exact codes / SKUs',
    classic: 'Can confuse similar codes or product IDs',
    semanticHtml: '<strong>Precise match</strong> by code → correct results every time',
  },
  {
    key: '3',
    aspect: 'Logic & relations',
    classic: "Can't handle real constraints (e.g., accessory compatibility)",
    semanticHtml: '<strong>Understands links</strong> like Product → Accessory → Compatibility',
  },
  {
    key: '4',
    aspect: 'Explainability',
    classic: '"Because it was similar"',
    semanticHtml: '<strong>Traceable reasoning</strong>: which rules and data led to the answer',
  },
  {
    key: '5',
    aspect: 'Consistency',
    classic: 'Same query may give different answers',
    semanticHtml: '<strong>Deterministic</strong>: same model → same result',
  },
];

export default function ProblemTable() {
  return (
    <ConfigProvider theme={theme}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: true }}
        size="middle"
        aria-label="Comparison of Classic RAG and Semantic RAG (Vedana)"
      />
    </ConfigProvider>
  );
}
