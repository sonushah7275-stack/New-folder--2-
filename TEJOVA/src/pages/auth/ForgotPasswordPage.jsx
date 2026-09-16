import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
  return (
    <AuthLayout title="Forgot Password?" subtitle="Enter your registered email address and we'll send you a link to reset your account password.">
      <ForgotPasswordForm />
    </AuthLayout>
  );
};
