import React, { useState, useEffect } from 'react';
import { Button, Typography, message, Card, Select, InputNumber, Row, Col } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { getPhotos, ratePhoto } from '../api/photo';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const Rate = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ gender: '', minAge: null, maxAge: null });
  const navigate = useNavigate();

  const fetchPhotos = async (filterData = filters) => {
    setLoading(true);
    try {
      const response = await getPhotos(filterData);
      setPhotos(response.data.photos);
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при загрузке фото');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleRate = async (photoId, score) => {
    try {
      await ratePhoto({ photoId, score });
      message.success('Фото оценено!');
      fetchPhotos();
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при оценке фото');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };
      fetchPhotos(newFilters);
      return newFilters;
    });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}>Загрузка...</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Оценка фотографий
      </Title>
      <Card title="Фильтры" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Select
              placeholder="Пол"
              style={{ width: '100%' }}
              value={filters.gender || undefined}
              onChange={(value) => handleFilterChange('gender', value)}
              allowClear
            >
              <Option value="male">Мужской</Option>
              <Option value="female">Женский</Option>
              <Option value="other">Другой</Option>
            </Select>
          </Col>
          <Col span={8}>
            <InputNumber
              placeholder="Минимальный возраст"
              min={18}
              max={100}
              value={filters.minAge}
              onChange={(value) => handleFilterChange('minAge', value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <InputNumber
              placeholder="Максимальный возраст"
              min={18}
              max={100}
              value={filters.maxAge}
              onChange={(value) => handleFilterChange('maxAge', value)}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>
      {photos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Title level={4}>Нет фотографий для оценки</Title>
          <Button type="primary" onClick={() => navigate('/profile')}>
            Вернуться в профиль
          </Button>
        </div>
      ) : (
        photos.map((photo) => (
          <Card
            key={photo.id}
            title={`Автор: ${photo.owner.name}`}
            style={{ marginBottom: 16 }}
            extra={<span>Возраст: {photo.owner.age}, Пол: {photo.owner.gender === 'male' ? 'Мужской' : photo.owner.gender === 'female' ? 'Женский' : 'Другой'}</span>}
          >
            <img
              src={photo.imageUrl}
              alt="Фото для оценки"
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover', marginBottom: 16 }}
            />
            <div style={{ textAlign: 'center' }}>
              <Title level={5}>Оцените фото:</Title>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <Button
                  key={score}
                  onClick={() => handleRate(photo.id, score)}
                  style={{ margin: '0 5px' }}
                  icon={score === 10 ? <StarOutlined /> : null}
                >
                  {score}
                </Button>
              ))}
            </div>
          </Card>
        ))
      )}
      <Button type="link" onClick={() => navigate('/profile')} style={{ textAlign: 'center', display: 'block', margin: 'auto' }}>
        Вернуться в профиль
      </Button>
    </div>
  );
};

export default Rate;
