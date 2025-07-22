import React, { useState, useEffect } from 'react';
import { Card, Button, Slider, Select, InputNumber, message, Row, Col } from 'antd';
import { getPhotosForRating, ratePhoto } from '../api/photos';
import { getProfile } from '../api/auth';

const { Option } = Select;

const PhotoRating = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [filters, setFilters] = useState({ gender: '', minAge: null, maxAge: null });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (error) {
        message.error(error.error || 'Ошибка при загрузке профиля');
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [filters]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await getPhotosForRating(filters);
      setPhotos(data.photos);
      if (data.photos.length > 0) {
        setCurrentPhoto(data.photos[0]);
      } else {
        setCurrentPhoto(null);
      }
    } catch (error) {
      message.error(error.error || 'Ошибка при загрузке фотографий');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async () => {
    if (!currentPhoto) return;
    setLoading(true);
    try {
      await ratePhoto({ photoId: currentPhoto.id, score: rating });
      message.success('Оценка сохранена. Вы получили 1 балл');
      if (user) {
        setUser({ ...user, points: user.points + 1 });
      }
      const updatedPhotos = photos.filter((p) => p.id !== currentPhoto.id);
      setPhotos(updatedPhotos);
      if (updatedPhotos.length > 0) {
        setCurrentPhoto(updatedPhotos[0]);
      } else {
        setCurrentPhoto(null);
        fetchPhotos();
      }
      setRating(5);
    } catch (error) {
      message.error(error.error || 'Ошибка при сохранении оценки');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div>
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Баллы: {user.points}</h3>
        </div>
      )}
      <div style={{ marginBottom: '20px' }}>
        <h3>Фильтры</h3>
        <Row gutter={16}>
          <Col span={8}>
            <label>Пол:</label>
            <Select
              value={filters.gender}
              onChange={(value) => handleFilterChange('gender', value)}
              style={{ width: '100%' }}
              placeholder="Выберите пол"
              allowClear
            >
              <Option value="male">Мужской</Option>
              <Option value="female">Женский</Option>
              <Option value="other">Другое</Option>
            </Select>
          </Col>
          <Col span={8}>
            <label>Минимальный возраст:</label>
            <InputNumber
              value={filters.minAge}
              onChange={(value) => handleFilterChange('minAge', value)}
              min={18}
              max={100}
              placeholder="Мин. возраст"
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <label>Максимальный возраст:</label>
            <InputNumber
              value={filters.maxAge}
              onChange={(value) => handleFilterChange('maxAge', value)}
              min={18}
              max={100}
              placeholder="Макс. возраст"
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </div>

      <div>
        {currentPhoto ? (
          <Card
            cover={<img src={currentPhoto.imageUrl} alt="Фото для оценки" style={{ height: 400, objectFit: 'contain' }} />}
            style={{ maxWidth: 600, margin: '0 auto' }}
          >
            <Card.Meta
              title={`Пользователь: ${currentPhoto.owner.name}`}
              description={`Возраст: ${currentPhoto.owner.age}, Пол: ${currentPhoto.owner.gender === 'male' ? 'Мужской' : currentPhoto.owner.gender === 'female' ? 'Женский' : 'Другое'}`}
            />
            <div style={{ marginTop: '20px' }}>
              <Slider
                min={1}
                max={10}
                value={rating}
                onChange={(value) => setRating(value)}
                marks={{ 1: '1', 10: '10' }}
              />
              <Button
                type="primary"
                onClick={handleRate}
                loading={loading}
                style={{ marginTop: '10px' }}
                block
              >
                Оценить ({rating})
              </Button>
            </div>
          </Card>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>Фотографии для оценки отсутствуют. Попробуйте изменить фильтры.</p>
            <Button onClick={fetchPhotos} loading={loading}>
              Обновить
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoRating;
