import React, { useState } from "react";
import { Formik, Field } from "formik";
import { Eye, EyeSlash } from "iconsax-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Colors } from "../../constants/Color";
import { userLoginSchema } from "../../utils/validationSchemas/userSchema";
import { login } from "../../api/apiClient";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError("");
    try {
      const response = await login(values.email, values.password);
      if (response)
        navigate("/login/2fa", {
          state: { fromLogin: true, username: values.email },
        });
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center px-2">
      <div className="mx-auto min-w-[320px] bg-[#f5f5f5] md:min-w-[500px]">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1
                className="block text-2xl font-bold text-gray-800"
                style={{ color: Colors.primary }}
              >
                Welcome Back!
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Don't have an account yet?{" "}
                <a
                  className="font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-none"
                  href="/register"
                  style={{ color: Colors.primary }}
                >
                  Sign up here
                </a>
              </p>
            </div>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={userLoginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, handleSubmit }) => (
                <div className="grid gap-y-4">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm">
                      Email address
                    </label>
                    <div className="relative">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                        style={{
                          borderColor:
                            errors.email && touched.email
                              ? "red"
                              : Colors.primary,
                        }}
                      />
                      {errors.email && touched.email && (
                        <p className="mt-2 text-xs text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="mb-2 block text-sm">
                        Password
                      </label>
                      <a
                        className="inline-flex items-center gap-x-1 text-sm font-medium decoration-2 hover:underline focus:underline focus:outline-none"
                        href="/reset-password"
                        style={{ color: Colors.primary }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                        style={{
                          borderColor:
                            errors.password && touched.password
                              ? "red"
                              : Colors.primary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? (
                          <EyeSlash size={20} color="#718096" />
                        ) : (
                          <Eye size={20} color="#718096" />
                        )}
                      </button>
                      {errors.password && touched.password && (
                        <p className="mt-2 text-xs text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
