import React from 'react';
import AuthLayout from '../components/AuthLayout';
import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <AuthLayout title="Новый пароль">
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
