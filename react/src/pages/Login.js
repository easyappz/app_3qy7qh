import React from 'react';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <AuthLayout title="Вход">
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
