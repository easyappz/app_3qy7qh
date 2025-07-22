import { instance } from './axios';

// Загрузка фотографии
export const uploadPhoto = async (data) => {
  try {
    const response = await instance.post('/api/photos', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Photo upload failed' };
  }
};

// Получение фотографий для оценки
export const getPhotosForRating = async (filters = {}) => {
  try {
    const response = await instance.get('/api/photos', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch photos for rating' };
  }
};

// Оценка фотографии
export const ratePhoto = async (data) => {
  try {
    const response = await instance.post('/api/photos/rate', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to rate photo' };
  }
};

// Получение статистики по фотографии
export const getPhotoStats = async (photoId) => {
  try {
    const response = await instance.get(`/api/photos/${photoId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch photo stats' };
  }
};
