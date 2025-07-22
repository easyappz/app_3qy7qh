import React from 'react';
import ProfileLayout from '../components/ProfileLayout';
import Stats from '../components/Stats';

const StatsPage = () => {
  return (
    <ProfileLayout title="Статистика">
      <Stats />
    </ProfileLayout>
  );
};

export default StatsPage;
