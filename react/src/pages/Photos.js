import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPhoto } from '../api/photo';
import { getProfile } from '../api/user';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Photos = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data.user);
      } catch (error) {
        message.error(error.response?.data?.error || 'Ошибка при загрузке профиля');
      }
    };
    fetchProfile();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await uploadPhoto(values);
      message.success('Фото загружено успешно!');
      navigate('/stats');
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при загрузке фото');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Загрузка фото
      </Title>
      {user && user.points < 10 ? (
        <Card style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={4} type="danger">
            Недостаточно баллов
          </Title>
          <p>У вас {user.points} баллов. Нужно минимум 10 баллов для загрузки фото.</p>
          <Button type="primary" onClick={() => navigate('/rate')}>
            Оценить фото и заработать баллы
          </Button>
        </Card>
      ) : (
        <Form
          name="uploadPhoto"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="imageUrl"
            label="URL изображения"
            rules={[{ required: true, message: 'Пожалуйста, введите URL изображения!' }]}
          >
            <Input placeholder="Введите URL изображения" prefix={<UploadOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Загрузить фото
            </Button>
          </Form.Item>
        </Form>
      )}
      <Button type="link" onClick={() => navigate('/profile')} style={{ textAlign: 'center', display: 'block', margin: 'auto' }}>
        Вернуться в профиль
      </Button>
    </div>
  );
};

export default Photos;
