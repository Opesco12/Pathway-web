import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import StyledText from "../../component/ui/StyledText";
import { Colors } from "../../constants/Color";
import { resetPassword, resetPasswordRequest } from "../../api/apiClient";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string().when([], {
      is: () => isEmailRegistered,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(6, "Password must be at least 6 characters")
          .matches(
            /^[A-Za-z\d@$!%*?#&]+$/,
            "Password can only contain letters, numbers, and @$!%*#?&",
          )
          .matches(
            /[a-z]/,
            "Password must contain at least one lowercase letter",
          )
          .matches(
            /[A-Z]/,
            "Password must contain at least one uppercase letter",
          )
          .matches(/\d/, "Password must contain at least one number")
          .matches(
            /[@$!%*?&#]/,
            "Password must contain at least one special character (@$!%*?&#)",
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    confirmPassword: Yup.string().when([], {
      is: () => isEmailRegistered,
      then: (schema) =>
        schema
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    token: Yup.string().when([], {
      is: () => isEmailRegistered,
      then: (schema) => schema.required("Please input the token in your mail"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return (
    <div className="grid h-screen md:grid-cols-2">
      <div className="z-50 hidden bg-[#000050] md:block"></div>
      <div className="flex h-screen items-center justify-center px-2">
        <div className="mx-auto min-w-[320px] bg-[#f5f5f5] md:min-w-[500px]">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1
                  className="block text-2xl font-bold text-gray-800"
                  style={{ color: Colors.primary }}
                >
                  Reset Password
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  A password reset mail will be sent to your email.
                </p>
              </div>

              <Formik
                initialValues={{
                  email: "",
                  token: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true);
                  const { email, token, password } = values;

                  try {
                    if (isEmailRegistered) {
                      const response = await resetPassword(token, password);
                      if (response) {
                        toast.success("Password Reset Successful");
                        setIsEmailRegistered(false);
                        navigate("/login");
                      }
                    } else {
                      const response = await resetPasswordRequest(email);
                      if (response) {
                        setIsEmailRegistered(true);
                        toast.info("Check your email for the reset token.");
                      }
                    }
                  } catch (error) {
                    toast.error("Something went wrong. Try again.");
                  }
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    {isEmailRegistered && (
                      <>
                        {/* Token Field */}
                        <div>
                          <label
                            htmlFor="token"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Token
                          </label>
                          <Field
                            type="text"
                            name="token"
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="token"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>

                        {/* Password Field */}
                        <div>
                          <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          <Field
                            type="password"
                            name="password"
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Confirm Password
                          </label>
                          <Field
                            type="password"
                            name="confirmPassword"
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                      </>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      style={{ backgroundColor: Colors.primary }}
                    >
                      {isSubmitting
                        ? "Loading"
                        : isEmailRegistered
                          ? "Reset Password"
                          : "Send Link"}
                    </button>
                  </Form>
                )}
              </Formik>

              <StyledText
                style={{
                  textAlign: "center",
                  width: "100%",
                  marginTop: "10px",
                }}
                color={Colors.primary}
                variant="semibold"
              >
                <span
                  className="cursor-pointer text-center"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </StyledText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
