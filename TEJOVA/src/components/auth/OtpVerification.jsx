import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { CheckCircle } from 'lucide-react';

export const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setVerified(true);
  };

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {verified ? (
        <div className="bg-[#FAF8F3] p-6 rounded-xs border border-[#1F4D3B]/20 text-center space-y-4">
          <CheckCircle className="w-10 h-10 text-[#1F4D3B] mx-auto" />
          <h3 className="font-serif text-2xl text-[#1F4D3B]">Account Verified!</h3>
          <p className="text-xs text-[#687280] font-light">Your email address has been successfully verified.</p>
          <Button variant="primary" onClick={() => navigate('/')} className="w-full">
            Explore TEJOVA
          </Button>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="text-center">
            <p className="text-xs text-[#687280] font-light mb-6">
              We've sent a 6-digit verification code to your email.
            </p>

            {/* 6 Digit Inputs */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl font-semibold bg-[#FAF8F3] border border-gray-300 rounded-xs text-[#1F4D3B] focus:outline-none focus:border-[#1F4D3B] focus:ring-1 focus:ring-[#1F4D3B]"
                />
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Verify Email
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              className="text-xs font-semibold text-[#668F6B] hover:text-[#1F4D3B] transition-colors"
            >
              {resent ? 'Verification Code Resent!' : 'Didn\'t receive code? Resend Code'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
