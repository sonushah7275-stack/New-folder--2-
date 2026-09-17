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
        <div className="bg-[#FAF9F6] p-6 rounded-xs border border-[#B87333]/30 text-center space-y-4">
          <CheckCircle className="w-10 h-10 text-[#B87333] mx-auto" />
          <h3 className="font-serif text-2xl text-[#0A2342]">Reset Link Sent</h3>
          <p className="text-xs text-[#5C6B73] font-light leading-relaxed">
            We have sent password reset instructions to your email address. Please check your inbox.
          </p>
          <div className="pt-2">
            <Link to="/login" className="inline-flex items-center text-xs font-semibold text-[#0A2342] hover:underline">
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

              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>

              <div className="text-center pt-4 border-t border-[#B87333]/20">
                <Link to="/login" className="inline-flex items-center text-xs font-semibold text-[#0A2342] hover:underline">
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
