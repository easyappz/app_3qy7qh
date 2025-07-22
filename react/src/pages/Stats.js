import React, { useState, useEffect } from 'react';
import { Typography, message, Card, Table, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPhotoStats } from '../api/photo';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getPhotoStats();
        setStats(response.data.stats);
      } catch (error) {
        message.error(error.response?.data?.error || 'Ошибка при загрузке статистики');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}>Загрузка...</div>;
  }

  if (!stats) {
    return (
      <div style={{ maxWidth: 600, margin: 'auto', padding: '20px', textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          Статистика
        </Title>
        <Card>
          <Title level={4}>Нет данных для отображения</Title>
          <p>У вас нет загруженных фотографий для статистики.</p>
          <Button type="primary" onClick={() => navigate('/photos')}>
            Загрузить фото
          </Button>
        </Card>
        <Button type="link" onClick={() => navigate('/profile')} style={{ marginTop: 16 }}>
          Вернуться в профиль
        </Button>
      </div>
    );
  }

  const genderData = [
    { name: 'Мужской', count: stats.male.count, average: stats.male.average },
    { name: 'Женский', count: stats.female.count, average: stats.female.average },
    { name: 'Другой', count: stats.other.count, average: stats.other.average },
  ];

  const ageData = [
    { name: '18-24', count: stats.ageGroups['18-24'].count, average: stats.ageGroups['18-24'].average },
    { name: '25-34', count: stats.ageGroups['25-34'].count, average: stats.ageGroups['25-34'].average },
    { name: '35-44', count: stats.ageGroups['35-44'].count, average: stats.ageGroups['35-44'].average },
    { name: '45+', count: stats.ageGroups['45+'].count, average: stats.ageGroups['45+'].average },
  ];

  const columns = [
    { title: 'Категория', dataIndex: 'name', key: 'name' },
    { title: 'Количество оценок', dataIndex: 'count', key: 'count' },
    { title: 'Средняя оценка', dataIndex: 'average', key: 'average', render: (value) => value.toFixed(2) },
  ];

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Статистика по вашим фото
      </Title>
      <Card title="Оценки по полу" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => value.toFixed(2)} />
            <Legend />
            <Bar dataKey="average" fill="#8884d8" name="Средняя оценка" />
            <Bar dataKey="count" fill="#82ca9d" name="Количество оценок" />
          </BarChart>
        </ResponsiveContainer>
        <Table
          dataSource={genderData}
          columns={columns}
          pagination={false}
          rowKey="name"
          style={{ marginTop: 16 }}
        />
      </Card>
      <Card title="Оценки по возрасту">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => value.toFixed(2)} />
            <Legend />
            <Bar dataKey="average" fill="#8884d8" name="Средняя оценка" />
            <Bar dataKey="count" fill="#82ca9d" name="Количество оценок" />
          </BarChart>
        </ResponsiveContainer>
        <Table
          dataSource={ageData}
          columns={columns}
          pagination={false}
          rowKey="name"
          style={{ marginTop: 16 }}
        />
      </Card>
      <Button type="link" onClick={() => navigate('/profile')} style={{ textAlign: 'center', display: 'block', margin: 'auto' }}>
        Вернуться в профиль
      </Button>
    </div>
  );
};

export default Stats;
