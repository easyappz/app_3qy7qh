import React, { useState, useEffect } from 'react';
import { Card, message, List, Button } from 'antd';
import { getPhotoStats, getUserPhotos } from '../api/photos';
import { getProfile } from '../api/user';

const Stats = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfileAndPhotos = async () => {
      setLoading(true);
      try {
        const profileResponse = await getProfile();
        setUser(profileResponse.data.user);
        
        // Загружаем фотографии пользователя
        const photosResponse = await getUserPhotos();
        setPhotos(photosResponse.data.photos || []);
      } catch (error) {
        message.error(error.response?.data?.error || 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndPhotos();
  }, []);

  // Загрузка статистики для конкретной фотографии
  const loadStats = async (photoId) => {
    setLoading(true);
    try {
      const response = await getPhotoStats(photoId);
      setPhotos((prevPhotos) =>
        prevPhotos.map((p) =>
          p.id === photoId ? { ...p, stats: response.data.stats } : p
        )
      );
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при загрузке статистики');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {user && (
        <Card style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3>Ваши баллы: {user.points}</h3>
        </Card>
      )}
      <Card title="Статистика по вашим фотографиям" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <List
          loading={loading}
          itemLayout="vertical"
          dataSource={photos}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Button
                  onClick={() => loadStats(item.id)}
                  disabled={loading || !!item.stats}
                  type="primary"
                  style={{ borderRadius: '4px' }}
                >
                  Загрузить статистику
                </Button>,
              ]}
              extra={
                item.stats && (
                  <div style={{ maxWidth: '300px', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <h4 style={{ marginBottom: '8px', color: '#333' }}>Статистика по полу:</h4>
                    <p style={{ margin: '4px 0' }}>Мужчины: {item.stats.male.count} оценок, среднее: {item.stats.male.average.toFixed(2)}</p>
                    <p style={{ margin: '4px 0' }}>Женщины: {item.stats.female.count} оценок, среднее: {item.stats.female.average.toFixed(2)}</p>
                    <p style={{ margin: '4px 0' }}>Другие: {item.stats.other.count} оценок, среднее: {item.stats.other.average.toFixed(2)}</p>
                    <h4 style={{ marginTop: '12px', marginBottom: '8px', color: '#333' }}>Статистика по возрастным группам:</h4>
                    <p style={{ margin: '4px 0' }}>18-24: {item.stats.ageGroups['18-24'].count} оценок, среднее: {item.stats.ageGroups['18-24'].average.toFixed(2)}</p>
                    <p style={{ margin: '4px 0' }}>25-34: {item.stats.ageGroups['25-34'].count} оценок, среднее: {item.stats.ageGroups['25-34'].average.toFixed(2)}</p>
                    <p style={{ margin: '4px 0' }}>35-44: {item.stats.ageGroups['35-44'].count} оценок, среднее: {item.stats.ageGroups['35-44'].average.toFixed(2)}</p>
                    <p style={{ margin: '4px 0' }}>45+: {item.stats.ageGroups['45+'].count} оценок, среднее: {item.stats.ageGroups['45+'].average.toFixed(2)}</p>
                  </div>
                )
              }
            >
              <List.Item.Meta
                avatar={<img src={item.imageUrl} alt="Фото" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }} />}
                title={`Фото ID: ${item.id}`}
                description="Статистика по оценкам"
              />
            </List.Item>
          )}
        />
        {photos.length === 0 && !loading && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
            У вас пока нет фотографий для отображения статистики.
          </p>
        )}
      </Card>
    </div>
  );
};

export default Stats;
