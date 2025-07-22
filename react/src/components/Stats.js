import React, { useState, useEffect } from 'react';
import { Card, message, List } from 'antd';
import { getPhotoStats } from '../api/photos';
import { getProfile } from '../api/auth';

const Stats = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        setUser(data.user);
        // Здесь можно добавить загрузку фотографий пользователя и их статистики, если API поддерживает список
        // В данном случае предполагаем, что у нас есть список фотографий
      } catch (error) {
        message.error(error.error || 'Ошибка при загрузке профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Эмуляция загрузки статистики для каждой фотографии
  const loadStats = async (photoId) => {
    setLoading(true);
    try {
      const data = await getPhotoStats(photoId);
      setPhotos((prevPhotos) =>
        prevPhotos.map((p) =>
          p.id === photoId ? { ...p, stats: data.stats } : p
        )
      );
    } catch (error) {
      message.error(error.error || 'Ошибка при загрузке статистики');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Баллы: {user.points}</h3>
        </div>
      )}
      <div>
        <h3>Статистика по вашим фотографиям</h3>
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
                  disabled={loading}
                >
                  Загрузить статистику
                </Button>,
              ]}
              extra={
                item.stats && (
                  <div>
                    <h4>Статистика по полу:</h4>
                    <p>Мужчины: {item.stats.male.count} оценок, среднее: {item.stats.male.average.toFixed(2)}</p>
                    <p>Женщины: {item.stats.female.count} оценок, среднее: {item.stats.female.average.toFixed(2)}</p>
                    <p>Другие: {item.stats.other.count} оценок, среднее: {item.stats.other.average.toFixed(2)}</p>
                    <h4>Статистика по возрастным группам:</h4>
                    <p>18-24: {item.stats.ageGroups['18-24'].count} оценок, среднее: {item.stats.ageGroups['18-24'].average.toFixed(2)}</p>
                    <p>25-34: {item.stats.ageGroups['25-34'].count} оценок, среднее: {item.stats.ageGroups['25-34'].average.toFixed(2)}</p>
                    <p>35-44: {item.stats.ageGroups['35-44'].count} оценок, среднее: {item.stats.ageGroups['35-44'].average.toFixed(2)}</p>
                    <p>45+: {item.stats.ageGroups['45+'].count} оценок, среднее: {item.stats.ageGroups['45+'].average.toFixed(2)}</p>
                  </div>
                )
              }
            >
              <List.Item.Meta
                avatar={<img src={item.imageUrl} alt="Фото" style={{ width: 100, height: 100, objectFit: 'cover' }} />}
                title={`Фото ID: ${item.id}`}
                description="Статистика по оценкам"
              />
            </List.Item>
          )}
        />
        {photos.length === 0 && !loading && (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            У вас пока нет фотографий для отображения статистики.
          </p>
        )}
      </div>
    </div>
  );
};

export default Stats;
