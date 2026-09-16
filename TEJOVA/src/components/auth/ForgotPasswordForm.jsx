import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '../common/Button';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export const ForgotPasswordForm = () => {
  const [sent, setSent] = useState(false);

  return (
    <div>
      {sent ? (
        <div className="bg-[#FAF8F3] p-6 rounded-xs border border-[#1F4D3B]/20 text-center space-y-4">
          <CheckCircle className="w-10 h-10 text-[#1F4D3B] mx-auto" />
          <h3 className="font-serif text-2xl text-[#1F4D3B]">Reset Link Sent</h3>
          <p className="text-xs text-[#687280] font-light leading-relaxed">
            We have sent password reset instructions to your email address. Please check your inbox.
          </p>
          <div className="pt-2">
            <Link to="/login" className="inline-flex items-center text-xs font-semibold text-[#1F4D3B] hover:underline">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{ email: '' }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Email address is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
              errors.email = 'Invalid email address';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              setSent(true);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
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

              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>

              <div className="text-center pt-4 border-t border-gray-100">
                <Link to="/login" className="inline-flex items-center text-xs font-semibold text-[#1F4D3B] hover:underline">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};
