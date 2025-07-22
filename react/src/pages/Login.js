import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values);
      localStorage.setItem('token', response.data.token);
      message.success('Вход выполнен успешно!');
      navigate('/profile');
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '50px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Вход
      </Title>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Пожалуйста, введите ваш email!', type: 'email' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Войти
          </Button>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="link" onClick={() => navigate('/reset-password-request')}>
            Забыли пароль?
          </Button>
          <Button type="link" onClick={() => navigate('/register')}>
            Регистрация
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
