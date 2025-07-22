import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await register(values);
      localStorage.setItem('token', result.token);
      message.success('Регистрация прошла успешно');
      navigate('/profile');
    } catch (error) {
      message.error(error.error || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="register"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ gender: 'male', age: 25 }}
    >
      <Form.Item
        label="Имя"
        name="name"
        rules={[{ required: true, message: 'Пожалуйста, введите ваше имя' }]}
      >
        <Input placeholder="Введите ваше имя" />
      </Form.Item>

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

      <Form.Item
        label="Пол"
        name="gender"
        rules={[{ required: true, message: 'Пожалуйста, выберите пол' }]}
      >
        <Select placeholder="Выберите пол">
          <Option value="male">Мужской</Option>
          <Option value="female">Женский</Option>
          <Option value="other">Другое</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Возраст"
        name="age"
        rules={[{ required: true, message: 'Пожалуйста, укажите возраст' }]}
      >
        <InputNumber min={18} max={100} placeholder="Введите возраст" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
