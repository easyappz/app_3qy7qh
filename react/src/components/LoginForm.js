import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { login } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      localStorage.setItem('token', result.token);
      message.success('Вход выполнен успешно');
      navigate('/profile');
    } catch (error) {
      message.error(error.error || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Пожалуйста, введите ваш email', type: 'email' }]}
      >
        <Input placeholder="Введите ваш email" />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}
      >
        <Input.Password placeholder="Введите пароль" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Войти
        </Button>
      </Form.Item>

      <Form.Item>
        <Link to="/reset-password-request">Забыли пароль?</Link>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
