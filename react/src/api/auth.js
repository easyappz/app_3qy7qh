import { instance } from './axios';

export const register = (data) => {
  return instance.post('/api/register', data);
};

export const login = (data) => {
  return instance.post('/api/login', data);
};

export const resetPasswordRequest = (data) => {
  return instance.post('/api/reset-password-request', data);
};

export const resetPassword = (data) => {
  return instance.post('/api/reset-password', data);
};
