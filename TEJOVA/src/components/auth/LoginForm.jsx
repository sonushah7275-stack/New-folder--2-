import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '../common/Button';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {loggedIn ? (
        <div className="bg-[#FAF9F6] p-6 rounded-xs border border-[#B87333]/30 text-center space-y-4">
          <CheckCircle className="w-10 h-10 text-[#B87333] mx-auto" />
          <h3 className="font-serif text-2xl text-[#0A2342]">Welcome Back!</h3>
          <p className="text-xs text-[#5C6B73] font-light">You have successfully signed into your TEJOVA account.</p>
          <Button variant="primary" onClick={() => navigate('/')} className="w-full">
            Return to Homepage
          </Button>
        </div>
      ) : (
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Email address is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
              errors.email = 'Invalid email address';
            }
            if (!values.password) {
              errors.password = 'Password is required';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              setLoggedIn(true);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2342] mb-2">
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-[#B87333]/30 rounded-xs text-sm text-[#0A2342] focus:outline-none focus:border-[#0A2342]"
                />
                <ErrorMessage name="email" component="div" className="text-xs text-red-600 mt-1 font-light" />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2342]">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-[#B87333] hover:text-[#0A2342] transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#F5F3EF] border border-[#B87333]/30 rounded-xs text-sm text-[#0A2342] focus:outline-none focus:border-[#0A2342] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A2342]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-xs text-red-600 mt-1 font-light" />
              </div>

              {/* Submit */}
              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center pt-4 border-t border-[#B87333]/20 text-xs text-[#5C6B73]">
                <span>Don't have an account? </span>
                <Link to="/register" className="font-semibold text-[#0A2342] hover:underline">
                  Create Account
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};
