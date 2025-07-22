import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const { Title } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await register(values);
      localStorage.setItem('token', response.data.token);
      message.success('Регистрация успешна!');
      navigate('/profile');
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '50px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Регистрация
      </Title>
      <Form
        name="register"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Имя" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Пожалуйста, введите ваш email!', type: 'email' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Пол"
          rules={[{ required: true, message: 'Пожалуйста, выберите пол!' }]}
        >
          <Select placeholder="Выберите пол">
            <Option value="male">Мужской</Option>
            <Option value="female">Женский</Option>
            <Option value="other">Другой</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="age"
          label="Возраст"
          rules={[{ required: true, message: 'Пожалуйста, укажите возраст!' }]}
        >
          <InputNumber min={18} max={100} placeholder="Возраст" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Зарегистрироваться
          </Button>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="link" onClick={() => navigate('/login')}>
            Уже есть аккаунт? Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
