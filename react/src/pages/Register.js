import React from 'react';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <AuthLayout title="Регистрация">
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
