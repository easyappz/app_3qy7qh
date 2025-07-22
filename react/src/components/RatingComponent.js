import React from 'react';
import { Card, Image, Rate, Button, Typography } from 'antd';
import '../App.css';

const { Title, Text } = Typography;

const RatingComponent = ({ photo, onRate }) => {
  if (!photo) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Фотографии для оценки не найдены.</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <Card
        hoverable
        cover={
          <Image
            alt="Фото для оценки"
            src={photo.imageUrl}
            style={{ height: '300px', objectFit: 'cover' }}
          />
        }
      >
        <Title level={4}>Оцените это фото</Title>
        <Text>Автор: {photo.owner.name} ({photo.owner.gender === 'male' ? 'Мужчина' : photo.owner.gender === 'female' ? 'Женщина' : 'Другое'}, {photo.owner.age} лет)</Text>
        <div style={{ marginTop: '20px' }}>
          <Rate
            allowHalf
            count={10}
            onChange={(value) => onRate(photo.id, value)}
            style={{ fontSize: '30px' }}
          />
        </div>
      </Card>
      <Button
        onClick={() => onRate(photo.id, 0)}
        style={{ marginTop: '20px' }}
      >
        Пропустить
      </Button>
    </div>
  );
};

export default RatingComponent;
