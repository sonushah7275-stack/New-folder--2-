import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { OtpVerification } from '../../components/auth/OtpVerification';

export const VerifyOtpPage = () => {
  return (
    <AuthLayout title="Verify Your Email" subtitle="Enter the 6-digit confirmation code sent to your email to activate your account.">
      <OtpVerification />
    </AuthLayout>
  );
};
