import React, { useState, useEffect } from 'react';
import { Upload, Button, message, List, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPhoto, getProfile } from '../api/auth';
import { instance } from '../api/axios';

const PhotoUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
        // Здесь можно добавить загрузку существующих фотографий пользователя, если API поддерживает
      } catch (error) {
        message.error(error.error || 'Ошибка при загрузке профиля');
      }
    };
    fetchProfile();
  }, []);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    if (!user || user.points < 1) {
      message.error('У вас недостаточно баллов для загрузки фотографии. Требуется минимум 1 балл.');
      onError(new Error('Insufficient points'));
      return;
    }

    setLoading(true);
    try {
      // Здесь должна быть логика загрузки файла на сервер, например, через API
      // В данном примере мы просто эмулируем загрузку
      const formData = new FormData();
      formData.append('file', file);
      // Пример: const response = await instance.post('/api/upload', formData);
      // Вместо этого используем заглушку
      setTimeout(async () => {
        const imageUrl = URL.createObjectURL(file);
        const photoData = await uploadPhoto({ imageUrl });
        setPhotos([...photos, photoData.photo]);
        onSuccess('ok');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Ошибка при загрузке фотографии');
      onError(error);
      setLoading(false);
    }
  };

  const handleSwitchChange = (checked, photoId) => {
    if (!user || user.points <= 0) {
      message.warning('У вас недостаточно баллов для добавления фотографии в оценку');
      return;
    }
    // Здесь должна быть логика API для изменения статуса фотографии (добавление/удаление из оценки)
    message.success(checked ? 'Фотография добавлена в оценку' : 'Фотография удалена из оценки');
  };

  const uploadProps = {
    customRequest: handleUpload,
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    accept: 'image/*',
    listType: 'picture',
  };

  return (
    <div>
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Баллы: {user.points}</h3>
          <p>Для добавления фотографии в оценку требуется минимум 1 балл.</p>
        </div>
      )}
      <Upload {...uploadProps} disabled={loading || (user && user.points < 1)}>
        <Button icon={<UploadOutlined />} loading={loading}>
          Загрузить фотографию
        </Button>
      </Upload>

      <div style={{ marginTop: '20px' }}>
        <h3>Ваши фотографии</h3>
        <List
          itemLayout="horizontal"
          dataSource={photos}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Switch
                  checkedChildren="В оценке"
                  unCheckedChildren="Не в оценке"
                  defaultChecked={item.status === 'rating'}
                  onChange={(checked) => handleSwitchChange(checked, item.id)}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<img src={item.imageUrl} alt="Фото" style={{ width: 100, height: 100, objectFit: 'cover' }} />}
                title={`Фото ID: ${item.id}`}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default PhotoUpload;
