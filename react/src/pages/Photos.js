import React from 'react';
import ProfileLayout from '../components/ProfileLayout';
import PhotoUpload from '../components/PhotoUpload';

const Photos = () => {
  return (
    <ProfileLayout title="Мои фотографии">
      <PhotoUpload />
    </ProfileLayout>
  );
};

export default Photos;
