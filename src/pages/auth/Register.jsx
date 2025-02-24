import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeSlash } from "iconsax-react";

import StyledText from "../../component/ui/StyledText";
import { Colors } from "../../constants/Color";
import {
  userRegisterSchema1,
  userRegisterSchema2,
} from "../../utils/validationSchemas/userSchema";
import { registerNewIndividual, getCountries } from "../../api/apiClient";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const countries = await getCountries();
      if (countries) {
        setCountries(
          countries.map((country) => ({
            label: country.name,
            value: country.code,
          })),
        );
      }
    };
    fetchData();
  }, []);

  const steps = [
    { name: "Personal Info", number: 1 },
    { name: "Account Details", number: 2 },
  ];

  const handleNext = (values, formikBag) => {
    // Move to next step without form submission
    setStep(2);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const response = await registerNewIndividual({
      ...values,
      dateOfBirth: new Date(values.dob).toISOString(),
    });
    if (response) {
      toast.success("Your account has been created successfully");
      navigate("/account/activate", {
        state: { email: values.email, header: "Activate Account" },
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="my-5 flex min-h-screen items-center justify-center overflow-y-auto px-2">
      <div className="mx-auto min-w-[320px] bg-[#f5f5f5] md:min-w-[500px]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-7">
          <div className="text-center">
            <h1
              className="block text-2xl font-bold text-gray-800"
              style={{ color: Colors.primary }}
            >
              Hello, it's nice to meet you
            </h1>
            <p style={{ color: Colors.light }}>Create an account below.</p>
          </div>

          {/* Step Indicator */}
          <div className="mt-6 mb-8">
            <div className="flex items-center justify-between">
              {steps.map((stepItem) => (
                <div
                  key={stepItem.number}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
                    style={{
                      backgroundColor:
                        step >= stepItem.number ? Colors.primary : "#D1D5DB",
                    }}
                  >
                    {stepItem.number}
                  </div>
                  <p className="mt-1 text-xs">{stepItem.name}</p>

                  {/* Connector Line */}
                  {stepItem.number < steps.length && (
                    <div className="absolute top-5 left-10 -z-10 h-0.5 w-full bg-gray-300">
                      <div
                        className="h-full"
                        style={{
                          backgroundColor: Colors.primary,
                          width: step > stepItem.number ? "100%" : "0%",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Formik
            validationSchema={
              step === 1 ? userRegisterSchema1 : userRegisterSchema2
            }
            initialValues={{
              firstname: "",
              lastname: "",
              phoneNumber: "",
              email: "",
              dob: "",
              gender: "",
              country: "",
              password: "",
              confirmPassword: "",
              address: "",
              city: "",
              state: "",
              clientType: 1,
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              console.log(values);
              const {
                address,
                city,
                clientType,
                firstname,
                lastname,
                phoneNumber,
                email,
                password,
                dob,
                gender,
                country,
                state,
              } = values;
              const DOB = new Date(dob).toISOString();

              const data = {
                dateOfBirth: DOB,
                emailAddress: email,
                password: password,
                firstName: firstname,
                lastName: lastname,
                phoneNo: phoneNumber,
                clientType: clientType,
                gender: gender,
                address1: address,
                city: city,
                state: state,
                country: country,
              };

              const response = await registerNewIndividual(data);

              if (response) {
                setSubmitting(false);
                toast.success("Your account has been created succesfully");
                navigate("/register/activate", {
                  state: { fromRegister: true, email: email },
                });
              }

              setSubmitting(false);
            }}
          >
            {({
              handleSubmit,
              isSubmitting,
              errors,
              touched,
              values,
              validateForm,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                  <>
                    {["firstname", "lastname", "phoneNumber", "email"].map(
                      (name) => (
                        <div key={name}>
                          <label htmlFor={name} className="mb-2 block text-sm">
                            {name
                              .replace(/([A-Z])/g, " $1")
                              .trim()
                              .replace(/\b\w/g, (char) => char.toUpperCase())}
                          </label>
                          <Field
                            id={name}
                            name={name}
                            className="block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name={name}
                            component="p"
                            className="mt-2 text-xs text-red-600"
                          />
                        </div>
                      ),
                    )}

                    {/* Date of Birth field */}
                    <div>
                      <label htmlFor="dob" className="mb-2 block text-sm">
                        Date of Birth
                      </label>
                      <Field
                        id="dob"
                        name="dob"
                        type="date"
                        className="block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="dob"
                        component="p"
                        className="mt-2 text-xs text-red-600"
                      />
                    </div>

                    {/* Gender field */}
                    <div>
                      <label htmlFor="gender" className="mb-2 block text-sm">
                        Gender
                      </label>
                      <Field
                        as="select"
                        id="gender"
                        name="gender"
                        className="block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </Field>
                      <ErrorMessage
                        name="gender"
                        component="p"
                        className="mt-2 text-xs text-red-600"
                      />
                    </div>

                    {/* Country field */}
                    <div>
                      <label htmlFor="country" className="mb-2 block text-sm">
                        Country
                      </label>
                      <Field
                        as="select"
                        id="country"
                        name="country"
                        className="block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="country"
                        component="p"
                        className="mt-2 text-xs text-red-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const errors = await validateForm();
                        if (Object.keys(errors).length === 0) {
                          setStep(2);
                        } else {
                          Object.keys(errors).forEach((field) => {
                            const element = document.getElementById(field);
                            if (element) element.focus();
                          });
                        }
                      }}
                      className="w-full rounded-lg px-4 py-3 text-white"
                      style={{ backgroundColor: Colors.primary }}
                    >
                      Next
                    </button>

                    <p className="mt-5 text-center text-sm text-gray-600">
                      Already have an account?
                      <button
                        className="cursor-pointer font-medium text-blue-600 hover:underline"
                        style={{ color: Colors.primary }}
                      >
                        <a href="/login">Login</a>
                      </button>
                    </p>
                  </>
                )}
                {step === 2 && (
                  <>
                    {/* Password field with toggle */}
                    <div>
                      <label htmlFor="password" className="mb-2 block text-sm">
                        Password
                      </label>
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

                    {/* Confirm Password field with toggle */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                          style={{
                            borderColor:
                              errors.confirmPassword && touched.confirmPassword
                                ? "red"
                                : Colors.primary,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showConfirmPassword ? (
                            <EyeSlash size={20} color="#718096" />
                          ) : (
                            <Eye size={20} color="#718096" />
                          )}
                        </button>
                        {errors.confirmPassword && touched.confirmPassword && (
                          <p className="mt-2 text-xs text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address, City, State fields */}
                    {["address", "city", "state"].map((name) => (
                      <div key={name}>
                        <label htmlFor={name} className="mb-2 block text-sm">
                          {name
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </label>
                        <Field
                          id={name}
                          name={name}
                          type="text"
                          className="block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name={name}
                          component="p"
                          className="mt-2 text-xs text-red-600"
                        />
                      </div>
                    ))}
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full rounded-lg px-4 py-3 text-white"
                        style={{ backgroundColor: "#9CA3AF" }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-full rounded-lg px-4 py-3 text-white"
                        style={{ backgroundColor: Colors.primary }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Loading..." : "Submit"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
