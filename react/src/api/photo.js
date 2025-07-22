import { instance } from './axios';

export const uploadPhoto = (data) => {
  return instance.post('/api/photos', data);
};

export const getPhotos = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.minAge) params.append('minAge', filters.minAge);
  if (filters.maxAge) params.append('maxAge', filters.maxAge);
  return instance.get(`/api/photos?${params.toString()}`);
};

export const ratePhoto = (data) => {
  return instance.post('/api/photos/rate', data);
};

export const getPhotoStats = (photoId = '') => {
  return instance.get(`/api/photos/${photoId}/stats`);
};
