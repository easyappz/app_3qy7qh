import { instance } from './axios';

export const getPhotos = async (filters = {}) => {
  try {
    const response = await instance.get('/api/photos', {
      params: {
        gender: filters.gender || '',
        minAge: filters.minAge || 18,
        maxAge: filters.maxAge || 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};

export const ratePhoto = async (photoId, score) => {
  try {
    const response = await instance.post('/api/photos/rate', {
      photoId,
      score,
    });
    return response.data;
  } catch (error) {
    console.error('Error rating photo:', error);
    throw error;
  }
};
