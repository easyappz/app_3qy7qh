import React from 'react';
import { Layout, Card, Typography } from 'antd';
import '../styles/AuthLayout.css';

const { Content } = Layout;
const { Title } = Typography;

const AuthLayout = ({ title, children }) => {
  return (
    <Layout className="auth-layout">
      <Content className="auth-content">
        <Card className="auth-card" bordered={false}>
          <Title level={2} className="auth-title">
            {title}
          </Title>
          {children}
        </Card>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
