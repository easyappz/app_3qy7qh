import React from 'react';
import AuthLayout from '../components/AuthLayout';
import ResetPasswordRequestForm from '../components/ResetPasswordRequestForm';

const ResetPasswordRequest = () => {
  return (
    <AuthLayout title="Сброс пароля">
      <ResetPasswordRequestForm />
    </AuthLayout>
  );
};

export default ResetPasswordRequest;
