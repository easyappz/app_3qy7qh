import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { resetPasswordRequest } from '../api/auth';

const { Title } = Typography;

const ResetPasswordRequest = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await resetPasswordRequest(values);
      message.success(response.data.message);
      navigate('/reset-password');
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при запросе сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '50px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Сброс пароля
      </Title>
      <Form
        name="resetPasswordRequest"
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Получить код
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

export default ResetPasswordRequest;
