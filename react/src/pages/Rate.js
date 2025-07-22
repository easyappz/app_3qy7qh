import React from 'react';
import ProfileLayout from '../components/ProfileLayout';
import PhotoRating from '../components/PhotoRating';

const Rate = () => {
  return (
    <ProfileLayout title="Оценить фотографии">
      <PhotoRating />
    </ProfileLayout>
  );
};

export default Rate;
