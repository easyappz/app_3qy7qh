import React, { useState, useEffect } from 'react';
import { Card, Typography, message, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/user';

const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data.user);
      } catch (error) {
        message.error(error.response?.data?.error || 'Ошибка при загрузке профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    message.success('Выход выполнен');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}>Загрузка...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Профиль
      </Title>
      {user && (
        <Card
          title={<span><UserOutlined style={{ marginRight: 8 }} /> {user.name}</span>}
          style={{ width: '100%' }}
        >
          <Text strong>Email:</Text> <Text>{user.email}</Text>
          <br />
          <Text strong>Пол:</Text> <Text>{user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Другой'}</Text>
          <br />
          <Text strong>Возраст:</Text> <Text>{user.age}</Text>
          <br />
          <Text strong>Баллы:</Text> <Text>{user.points}</Text>
          <br />
          {user.points < 10 && (
            <Text type="danger">У вас недостаточно баллов для загрузки фото. Оцените фотографии других, чтобы заработать баллы.</Text>
          )}
          <div style={{ marginTop: 16 }}>
            <Button 
              type="primary" 
              onClick={() => navigate('/photos')} 
              disabled={user.points < 10}
              style={{ marginRight: 8 }}
            >
              Загрузить фото
            </Button>
            <Button 
              type="default" 
              onClick={() => navigate('/rate')}
              style={{ marginRight: 8 }}
            >
              Оценить фото
            </Button>
            <Button 
              type="default" 
              onClick={() => navigate('/stats')}
              style={{ marginRight: 8 }}
            >
              Статистика
            </Button>
            <Button type="danger" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;
