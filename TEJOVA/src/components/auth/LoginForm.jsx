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
        <div className="bg-[#FAF8F3] p-6 rounded-xs border border-[#1F4D3B]/20 text-center space-y-4">
          <CheckCircle className="w-10 h-10 text-[#1F4D3B] mx-auto" />
          <h3 className="font-serif text-2xl text-[#1F4D3B]">Welcome Back!</h3>
          <p className="text-xs text-[#687280] font-light">You have successfully signed into your TEJOVA account.</p>
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-[#FAF8F3] border border-gray-300 rounded-xs text-sm text-[#1F1F1F] focus:outline-none focus:border-[#1F4D3B]"
                />
                <ErrorMessage name="email" component="div" className="text-xs text-red-600 mt-1 font-light" />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-[#668F6B] hover:text-[#1F4D3B] transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#FAF8F3] border border-gray-300 rounded-xs text-sm text-[#1F1F1F] focus:outline-none focus:border-[#1F4D3B] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

              <div className="text-center pt-4 border-t border-gray-100 text-xs text-[#687280]">
                <span>Don't have an account? </span>
                <Link to="/register" className="font-semibold text-[#1F4D3B] hover:underline">
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
