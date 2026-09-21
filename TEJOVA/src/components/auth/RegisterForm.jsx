import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "../common/Button";
import { Eye, EyeOff } from "lucide-react";
import { registerUser, clearAuthErrors } from "../../Redux/slices/authSlice";

export const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={{ fullName: "", email: "", password: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.fullName || !values.fullName.trim()) {
          errors.fullName = "Full name is required";
        } else if (values.fullName.trim().length < 2) {
          errors.fullName = "Name must be at least 2 characters";
        }

        if (!values.email) {
          errors.email = "Email address is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
          errors.email = "Invalid email address";
        }

        if (!values.password) {
          errors.password = "Password is required";
        } else if (values.password.length < 6) {
          errors.password = "Password must be at least 6 characters";
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(clearAuthErrors());
        dispatch(
          registerUser({
            name: values.fullName.trim(),
            email: values.email.trim(),
            password: values.password,
          })
        ).then((res) => {
          setSubmitting(false);
          if (res.meta.requestStatus === "fulfilled") {
            navigate("/");
          }
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2342] mb-1.5">
              Full Name
            </label>
            <Field
              type="text"
              name="fullName"
              placeholder="e.g. Sophia Loren"
              className="w-full px-4 py-3 bg-[#F5F3EF] border border-[#B87333]/30 rounded-xs text-sm text-[#0A2342] focus:outline-none focus:border-[#0A2342]"
            />
            <ErrorMessage name="fullName" component="div" className="text-xs text-red-600 mt-1 font-light" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2342] mb-1.5">
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2342] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#F5F3EF] border border-[#B87333]/30 rounded-xs text-sm text-[#0A2342] focus:outline-none focus:border-[#0A2342] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A2342] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <ErrorMessage name="password" component="div" className="text-xs text-red-600 mt-1 font-light" />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting || loading} className="w-full">
              {isSubmitting || loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-[#B87333]/20 text-xs text-[#5C6B73]">
            <span>Already have an account? </span>
            <Link to="/login" className="font-semibold text-[#0A2342] hover:underline">
              Sign In
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};
