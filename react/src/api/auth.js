import { instance } from './axios';

// Регистрация нового пользователя
export const register = async (data) => {
  try {
    const response = await instance.post('/api/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

// Вход пользователя
export const login = async (data) => {
  try {
    const response = await instance.post('/api/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

// Запрос на сброс пароля
export const requestPasswordReset = async (data) => {
  try {
    const response = await instance.post('/api/reset-password-request', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Password reset request failed' };
  }
};

// Сброс пароля
export const resetPassword = async (data) => {
  try {
    const response = await instance.post('/api/reset-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Password reset failed' };
  }
};

// Получение профиля пользователя
export const getProfile = async () => {
  try {
    const response = await instance.get('/api/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch profile' };
  }
};

// Обновление профиля пользователя
export const updateProfile = async (data) => {
  try {
    const response = await instance.put('/api/profile', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update profile' };
  }
};
