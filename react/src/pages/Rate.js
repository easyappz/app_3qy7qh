import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import HeaderComponent from '../components/HeaderComponent';
import FilterComponent from '../components/FilterComponent';
import RatingComponent from '../components/RatingComponent';
import { getPhotos, ratePhoto } from '../api/photo';
import { instance } from '../api/axios';

const { Content } = Layout;

const Rate = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({ gender: '', minAge: 18, maxAge: 100 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await instance.get('/api/profile');
        setUser(response.data.user);
      } catch (error) {
        message.error('Ошибка при загрузке профиля');
        console.error('Profile fetch error:', error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const data = await getPhotos(filters);
        setPhotos(data.photos);
        setCurrentPhoto(data.photos.length > 0 ? data.photos[0] : null);
      } catch (error) {
        message.error('Ошибка при загрузке фотографий');
        console.error('Photos fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRate = async (photoId, score) => {
    try {
      await ratePhoto(photoId, score);
      if (score > 0) {
        message.success('Оценка сохранена! Баллы +1');
        setUser((prevUser) => ({ ...prevUser, points: prevUser.points + 1 }));
      }
      const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
      setPhotos(updatedPhotos);
      setCurrentPhoto(updatedPhotos.length > 0 ? updatedPhotos[0] : null);
    } catch (error) {
      message.error('Ошибка при сохранении оценки');
      console.error('Rating error:', error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <HeaderComponent user={user} />
      <Content style={{ padding: '20px', marginTop: '64px' }}>
        <FilterComponent onFilterChange={handleFilterChange} />
        {!loading && <RatingComponent photo={currentPhoto} onRate={handleRate} />}
      </Content>
    </Layout>
  );
};

export default Rate;
