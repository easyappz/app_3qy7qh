import React, { useState, useEffect } from 'react';
import { Typography, message, Card, Table, Button } from 'antd';
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

  const BarChartCustom = ({ data, title }) => {
    const maxCount = Math.max(...data.map(item => item.count));
    const maxAverage = Math.max(...data.map(item => item.average));

    return (
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, textAlign: 'center' }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.map(item => (
            <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 150, textAlign: 'right' }}>Количество оценок:</div>
                <div style={{ flexGrow: 1, backgroundColor: '#e6f7ff', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      height: 20,
                      backgroundColor: '#1890ff',
                      transition: 'width 0.5s ease-in-out',
                    }}
                  />
                </div>
                <div style={{ width: 50, textAlign: 'center' }}>{item.count}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 150, textAlign: 'right' }}>Средняя оценка:</div>
                <div style={{ flexGrow: 1, backgroundColor: '#f0f9eb', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(item.average / maxAverage) * 100}%`,
                      height: 20,
                      backgroundColor: '#52c41a',
                      transition: 'width 0.5s ease-in-out',
                    }}
                  />
                </div>
                <div style={{ width: 50, textAlign: 'center' }}>{item.average.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Статистика по вашим фото
      </Title>
      <Card title="Оценки по полу" style={{ marginBottom: 24 }}>
        <BarChartCustom data={genderData} title="Распределение по полу" />
        <Table
          dataSource={genderData}
          columns={columns}
          pagination={false}
          rowKey="name"
          style={{ marginTop: 16 }}
        />
      </Card>
      <Card title="Оценки по возрасту">
        <BarChartCustom data={ageData} title="Распределение по возрасту" />
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
