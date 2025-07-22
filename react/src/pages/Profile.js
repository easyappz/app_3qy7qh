import React from 'react';
import ProfileLayout from '../components/ProfileLayout';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
  return (
    <ProfileLayout title="Профиль">
      <ProfileForm />
    </ProfileLayout>
  );
};

export default Profile;
