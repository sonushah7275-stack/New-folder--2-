import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../common/Button";
import { CheckCircle } from "lucide-react";
import { verifyOtp, clearAuthErrors } from "../../Redux/slices/authSlice";

export const OtpVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, successMessage, error } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailInput, setEmailInput] = useState("");
  const [resent, setResent] = useState(false);
  const inputsRef = useRef([]);

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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === 6) {
      dispatch(clearAuthErrors());
      dispatch(verifyOtp({ email: emailInput, otp: code })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setTimeout(() => navigate("/login"), 1500);
        }
      });
    }
  };

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {successMessage ? (
        <div className="bg-[#FAF9F6] p-6 rounded-xs border border-[#B87333]/30 text-center space-y-4">
          <CheckCircle className="w-10 h-10 text-[#B87333] mx-auto" />
          <h3 className="font-serif text-2xl text-[#0A2342]">Account Verified!</h3>
          <p className="text-xs text-[#5C6B73] font-light">{successMessage}</p>
          <Button variant="primary" onClick={() => navigate("/login")} className="w-full">
            Sign In Now
          </Button>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xs">
              ⚠️ {error}
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-[#5C6B73] font-light mb-4">
              Enter your registered email and the 6-digit verification code sent to your inbox.
            </p>

            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Your registered email address"
              required
              className="w-full px-4 py-2.5 bg-[#F5F3EF] border border-[#B87333]/30 rounded-xs text-xs text-[#0A2342] mb-4 focus:outline-none"
            />

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
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl font-semibold bg-[#F5F3EF] border border-[#B87333]/30 rounded-xs text-[#0A2342] focus:outline-none focus:border-[#0A2342] focus:ring-1 focus:ring-[#0A2342]"
                />
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              className="text-xs font-semibold text-[#B87333] hover:text-[#0A2342] transition-colors cursor-pointer"
            >
              {resent ? "Verification Code Resent!" : "Didn't receive code? Resend Code"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
