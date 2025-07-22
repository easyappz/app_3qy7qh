import React from 'react';
import { Layout, Menu, Typography, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, PictureOutlined, BarChartOutlined } from '@ant-design/icons';
import '../../styles/ProfileLayout.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const ProfileLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Профиль',
      onClick: () => navigate('/profile'),
    },
    {
      key: '/photos',
      icon: <PictureOutlined />,
      label: 'Мои фотографии',
      onClick: () => navigate('/photos'),
    },
    {
      key: '/rate',
      icon: <PictureOutlined />,
      label: 'Оценить фотографии',
      onClick: () => navigate('/rate'),
    },
    {
      key: '/stats',
      icon: <BarChartOutlined />,
      label: 'Статистика',
      onClick: () => navigate('/stats'),
    },
  ];

  return (
    <Layout className="profile-layout">
      <Header className="profile-header">
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Оценка фотографий
        </Title>
        <Button type="link" onClick={handleLogout} style={{ color: 'white' }}>
          Выйти
        </Button>
      </Header>
      <Layout>
        <Sider width={200} className="profile-sider">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="profile-menu"
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content className="profile-content">
            <Title level={2}>{title}</Title>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProfileLayout;
