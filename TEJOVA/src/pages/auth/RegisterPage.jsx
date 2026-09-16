import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const RegisterPage = () => {
  return (
    <AuthLayout title="Create Account" subtitle="Join the TEJOVA conscious community and unlock personalized botanical rituals.">
      <RegisterForm />
    </AuthLayout>
  );
};
