import React, { useState } from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
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
    <div className="flex items-center justify-center h-screen">
      <div className="bg-[#f5f5f5] min-w-md">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
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
                  className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium"
                  href="../examples/html/signup.html"
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
                    <label
                      htmlFor="email"
                      className="block text-sm mb-2"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        style={{
                          borderColor:
                            errors.email && touched.email
                              ? "red"
                              : Colors.primary,
                        }}
                      />
                      {errors.email && touched.email && (
                        <p className="text-xs text-red-600 mt-2">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2"
                      >
                        Password
                      </label>
                      <a
                        className="inline-flex items-center gap-x-1 text-sm decoration-2 hover:underline focus:outline-none focus:underline font-medium"
                        href="../examples/html/recover-account.html"
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
                        className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
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
                          <EyeSlash
                            size={20}
                            color="#718096"
                          />
                        ) : (
                          <Eye
                            size={20}
                            color="#718096"
                          />
                        )}
                      </button>
                      {errors.password && touched.password && (
                        <p className="text-xs text-red-600 mt-2">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-white hover:opacity-90 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
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
