import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, message } from 'antd';
import { getProfile, updateProfile } from '../api/auth';

const { Option } = Select;

const ProfileForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        setUser(data.user);
        form.setFieldsValue(data.user);
      } catch (error) {
        message.error(error.error || 'Ошибка при загрузке профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await updateProfile(values);
      setUser(data.user);
      message.success('Профиль обновлен');
    } catch (error) {
      message.error(error.error || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Баллы: {user.points}</h3>
        </div>
      )}
      <Form
        form={form}
        name="profile"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Имя"
          name="name"
          rules={[{ required: true, message: 'Пожалуйста, введите ваше имя' }]}
        >
          <Input placeholder="Введите ваше имя" />
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Сохранить изменения
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileForm;
