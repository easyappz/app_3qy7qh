import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import '../App.css';

const { Header } = Layout;
const { Title, Text } = Typography;

const HeaderComponent = ({ user }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Header style={{ backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>
          <Link to="/rate" style={{ color: '#1890ff' }}>PhotoRate</Link>
        </Title>
        {user && (
          <Space>
            <Text strong>Баллы: {user.points}</Text>
            <Text type="secondary">|</Text>
            <Link to="/profile">Профиль</Link>
            <Text type="secondary">|</Text>
            <Text style={{ cursor: 'pointer', color: '#ff4d4f' }} onClick={handleLogout}>
              Выйти
            </Text>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default HeaderComponent;
