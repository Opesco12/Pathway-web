import { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Colors } from "../../constants/Color";
import StyledText from "../../component/ui/StyledText";

import {
  getClientInfo,
  getNextOfKins,
  createNextOfKin,
} from "../../api/apiClient";
import { userProfileSchema } from "../../utils/validationSchemas/userSchema";
import Loader from "../../component/ui/LoadingAnimation";

const PersonalDetails = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userHasNextOfKin, setUserHasNextOfKin] = useState(0);
  const [nextOfKin, setNextOfKin] = useState(null);

  const kinRelationships = [
    { label: "Spouse", value: "Spouse" },
    { label: "Parent", value: "Parent" },
    { label: "Sibling", value: "Sibling" },
    { label: "Son", value: "Son" },
    { label: "Daughter", value: "Daughter" },
    { label: "Guardian", value: "Guardian" },
    { label: "Aunt", value: "Aunt" },
    { label: "Uncle", value: "Uncle" },
    { label: "Niece", value: "Niece" },
    { label: "Nephew", value: "Nephew" },
    { label: "Cousin", value: "Cousin" },
    { label: "Other", value: "Other" },
  ];

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  const fetchData = async () => {
    setLoading(true);
    const clientInfo = await getClientInfo();
    const { firstname, surname, mobileNumber } = clientInfo;
    setUserData({
      firstname: firstname,
      surname: surname,
      mobileNumber: mobileNumber,
    });

    const nextOfKins = await getNextOfKins();
    if (nextOfKins.length > 0) {
      console.log(nextOfKins);
      setUserHasNextOfKin(1);
      setNextOfKin(nextOfKins[0]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className={"my-4"}
      >
        Personal Details
      </StyledText>

      <div className="flex-1 rounded-xl bg-white p-4 md:p-8">
        <Formik
          validationSchema={userProfileSchema}
          initialValues={{
            firstname: userData?.firstname || "",
            surname: userData?.surname || "",
            phoneNumber: userData?.mobileNumber || "",
            kinFirstname: nextOfKin?.firstname || "",
            kinLastname: nextOfKin?.surname || "",
            kinEmail: nextOfKin?.email || "",
            kinPhoneNumber: nextOfKin?.telephoneNo || "",
            kinGender: nextOfKin?.gender || "",
            kinRelationship: nextOfKin?.relationship || "",
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            const {
              kinEmail,
              kinFirstname,
              kinLastname,
              kinPhoneNumber,
              kinGender,
              kinRelationship,
            } = values;

            const nextOfKinData = {
              email: kinEmail,
              firstname: kinFirstname,
              surname: kinLastname,
              telephoneNo: kinPhoneNumber,
              relationship: kinRelationship,
              gender: kinGender,
            };

            console.log(nextOfKinData);

            if (userHasNextOfKin === 0) {
              if (kinRelationship && kinGender) {
                const data = await createNextOfKin(nextOfKinData);
                if (data) {
                  toast.success("Profile has been updated successfully");
                  navigate("/profile");
                }
              } else {
                toast.error("Please fill out all fields");
              }
            }
          }}
        >
          {({ handleSubmit, isSubmitting, errors, touched }) => (
            <Form className="flex w-full flex-col gap-[40px]">
              <div className="flex w-full flex-col justify-between md:flex-row">
                <div className="flex w-[100%] flex-col gap-[15px] md:w-[48%]">
                  <StyledText
                    type="title"
                    color={Colors.text}
                    style={{ fontWeight: "600" }}
                  >
                    Personal Details
                  </StyledText>
                  <div className="relative flex justify-between">
                    <div className="w-[48%]">
                      <label
                        htmlFor="firstname"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <Field
                        name="firstname"
                        id="firstname"
                        disabled
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="firstname"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                    <div className="w-[48%]">
                      <label
                        htmlFor="surname"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <Field
                        name="surname"
                        id="surname"
                        disabled
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="surname"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <Field
                      name="phoneNumber"
                      id="phoneNumber"
                      disabled
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                </div>

                <div className="mt-[20px] flex w-[100%] flex-col gap-[15px] md:mt-[0px] md:w-[48%]">
                  <StyledText
                    type="title"
                    color={Colors.text}
                    style={{ fontWeight: "600" }}
                  >
                    Next of Kin
                  </StyledText>
                  <div className="relative flex justify-between">
                    <div className="w-[48%]">
                      <label
                        htmlFor="kinFirstname"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <Field
                        name="kinFirstname"
                        id="kinFirstname"
                        disabled={userHasNextOfKin === 1}
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-70"
                      />
                      <ErrorMessage
                        name="kinFirstname"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                    <div className="w-[48%]">
                      <label
                        htmlFor="kinLastname"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <Field
                        name="kinLastname"
                        id="kinLastname"
                        disabled={userHasNextOfKin === 1}
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-70"
                      />
                      <ErrorMessage
                        name="kinLastname"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="kinEmail"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <Field
                      name="kinEmail"
                      id="kinEmail"
                      type="email"
                      disabled={userHasNextOfKin === 1}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-70"
                    />
                    <ErrorMessage
                      name="kinEmail"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="kinPhoneNumber"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <Field
                      name="kinPhoneNumber"
                      id="kinPhoneNumber"
                      disabled={userHasNextOfKin === 1}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-70"
                    />
                    <ErrorMessage
                      name="kinPhoneNumber"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="kinRelationship"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Relationship
                    </label>
                    <Field
                      as="select"
                      name="kinRelationship"
                      id="kinRelationship"
                      disabled={userHasNextOfKin === 1}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-70"
                    >
                      <option value="">Select Relationship</option>
                      {kinRelationships.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="kinRelationship"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="kinGender"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="kinGender"
                      id="kinGender"
                      disabled={userHasNextOfKin === 1}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-70"
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="kinGender"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                style={{ backgroundColor: Colors.primary }}
              >
                {isSubmitting ? "Loading..." : "Save"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonalDetails;
