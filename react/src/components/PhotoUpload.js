import React, { useState, useEffect } from 'react';
import { Upload, Button, message, List, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPhoto } from '../api/photo';
import { getProfile } from '../api/user';

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
    setLoading(true);
    try {
      // Здесь предполагается, что у вас есть эндпоинт для загрузки файла
      // Если загрузка файла происходит через сторонний сервис, замените это на реальный код
      const formData = new FormData();
      formData.append('file', file);
      // Пример: загрузка файла на сервер или сторонний сервис
      // const response = await instance.post('/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // Временная заглушка для imageUrl
      const imageUrl = URL.createObjectURL(file);
      const photoData = await uploadPhoto({ imageUrl });
      setPhotos([...photos, photoData.photo]);
      // Обновляем профиль пользователя после загрузки фото, чтобы отобразить актуальные баллы
      const updatedProfile = await getProfile();
      setUser(updatedProfile.user);
      onSuccess('ok');
      setLoading(false);
      message.success('Фотография успешно загружена!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ошибка при загрузке фотографии';
      message.error(errorMessage);
      onError(error);
      setLoading(false);
    }
  };

  const handleSwitchChange = (checked, photoId) => {
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {user && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ color: '#333', fontSize: '18px' }}>Ваши баллы: {user.points}</h3>
        </div>
      )}
      <Upload {...uploadProps} disabled={loading}>
        <Button 
          icon={<UploadOutlined />} 
          loading={loading} 
          style={{ 
            width: '100%', 
            maxWidth: '300px', 
            margin: '0 auto', 
            display: 'block',
            borderColor: '#52c41a',
            color: '#52c41a'
          }}
        >
          Загрузить фотографию
        </Button>
      </Upload>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#333', fontSize: '16px', marginBottom: '15px' }}>Ваши фотографии</h3>
        {photos.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>У вас пока нет загруженных фотографий.</p>
        ) : (
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
                style={{ background: '#fff', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
              >
                <List.Item.Meta
                  avatar={<img src={item.imageUrl} alt="Фото" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }} />}
                  title={`Фото ID: ${item.id}`}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
