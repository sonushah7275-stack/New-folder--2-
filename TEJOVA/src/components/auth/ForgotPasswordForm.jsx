import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "../common/Button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { forgotPassword, clearAuthErrors } from "../../Redux/slices/authSlice";

export const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector((state) => state.auth);

  return (
    <div>
      {successMessage ? (
        <div className="bg-[#FAF9F6] p-6 rounded-xs border border-[#B87333]/30 text-center space-y-4">
          <CheckCircle className="w-10 h-10 text-[#B87333] mx-auto" />
          <h3 className="font-serif text-2xl text-[#0A2342]">Reset Code Sent</h3>
          <p className="text-xs text-[#5C6B73] font-light leading-relaxed">
            {successMessage}
          </p>
          <div className="pt-2">
            <Link to="/login" className="inline-flex items-center text-xs font-semibold text-[#0A2342] hover:underline">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{ email: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Email address is required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(clearAuthErrors());
            dispatch(forgotPassword(values.email)).then(() => {
              setSubmitting(false);
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xs">
                  ⚠️ {error}
                </div>
              )}

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

              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting || loading} className="w-full">
                {isSubmitting || loading ? "Sending Reset Link..." : "Send Reset Link"}
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
