import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '../common/Button';
import { Eye, EyeOff } from 'lucide-react';

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
      validate={(values) => {
        const errors = {};
        if (!values.fullName) errors.fullName = 'Full name is required';
        if (!values.email) {
          errors.email = 'Email address is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
          errors.email = 'Invalid email address';
        }
        if (!values.password) {
          errors.password = 'Password is required';
        } else if (values.password.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        }
        if (values.password !== values.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
          navigate('/verify-otp');
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Name
            </label>
            <Field
              type="text"
              name="fullName"
              placeholder="e.g. Sophia Loren"
              className="w-full px-4 py-3 bg-[#FAF8F3] border border-gray-300 rounded-xs text-sm text-[#1F1F1F] focus:outline-none focus:border-[#1F4D3B]"
            />
            <ErrorMessage name="fullName" component="div" className="text-xs text-red-600 mt-1 font-light" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Password
            </label>
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <Field
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#FAF8F3] border border-gray-300 rounded-xs text-sm text-[#1F1F1F] focus:outline-none focus:border-[#1F4D3B]"
            />
            <ErrorMessage name="confirmPassword" component="div" className="text-xs text-red-600 mt-1 font-light" />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-gray-100 text-xs text-[#687280]">
            <span>Already have an account? </span>
            <Link to="/login" className="font-semibold text-[#1F4D3B] hover:underline">
              Sign In
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};
