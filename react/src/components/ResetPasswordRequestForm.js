import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { requestPasswordReset } from '../api/auth';

const ResetPasswordRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await requestPasswordReset(values);
      message.success('Инструкции по сбросу пароля отправлены на ваш email');
      setSubmitted(true);
    } catch (error) {
      message.error(error.error || 'Ошибка при запросе сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="reset-password-request"
      layout="vertical"
      onFinish={onFinish}
    >
      {!submitted ? (
        <>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Пожалуйста, введите ваш email', type: 'email' }]}
          >
            <Input placeholder="Введите ваш email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Отправить инструкции
            </Button>
          </Form.Item>
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Проверьте ваш email для получения инструкций по сбросу пароля.</p>
        </div>
      )}
    </Form>
  );
};

export default ResetPasswordRequestForm;
