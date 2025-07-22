import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { resetPassword } from '../api/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await resetPassword({
        email,
        token,
        newPassword: values.newPassword,
      });
      message.success('Пароль успешно сброшен');
      navigate('/login');
    } catch (error) {
      message.error(error.error || 'Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="reset-password"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ email }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Пожалуйста, введите ваш email', type: 'email' }]}
      >
        <Input placeholder="Введите ваш email" disabled />
      </Form.Item>

      <Form.Item
        label="Новый пароль"
        name="newPassword"
        rules={[{ required: true, message: 'Пожалуйста, введите новый пароль' }]}
      >
        <Input.Password placeholder="Введите новый пароль" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Сбросить пароль
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetPasswordForm;
