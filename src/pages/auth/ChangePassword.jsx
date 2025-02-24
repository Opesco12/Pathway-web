import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Colors } from "../../constants/Color";
import StyledText from "../../component/ui/StyledText";
import { changePassword } from "../../api/apiClient";
import { changePasswordSchema } from "../../utils/validationSchemas/userSchema";

const ChangePassword = () => {
  const navigate = useNavigate();

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
                Change Password
              </h1>
            </div>

            <Formik
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={changePasswordSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const { oldPassword, newPassword } = values;
                  const response = await changePassword(
                    oldPassword,
                    newPassword,
                  );
                  if (response) {
                    toast.success("Password Successfully Changed");
                    navigate("/profile");
                  }
                } catch (error) {
                  toast.error("Error changing password");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="oldPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Old Password
                    </label>
                    <Field
                      type="password"
                      name="oldPassword"
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="oldPassword"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <Field
                      type="password"
                      name="newPassword"
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

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

                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    {isSubmitting ? "Loading..." : "Sign in"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
