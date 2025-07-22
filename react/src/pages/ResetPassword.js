import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth';

const { Title } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await resetPassword(values);
      message.success(response.data.message);
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '50px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Новый пароль
      </Title>
      <Form
        name="resetPassword"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Пожалуйста, введите ваш email!', type: 'email' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="token"
          label="Код сброса"
          rules={[{ required: true, message: 'Пожалуйста, введите код сброса!' }]}
        >
          <Input placeholder="Код сброса" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Новый пароль"
          rules={[{ required: true, message: 'Пожалуйста, введите новый пароль!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Новый пароль" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Сбросить пароль
          </Button>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="link" onClick={() => navigate('/login')}>
            Вернуться ко входу
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
