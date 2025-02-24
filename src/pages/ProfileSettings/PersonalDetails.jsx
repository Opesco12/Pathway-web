import { useState, useEffect } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import HeaderText from "../components/HeaderText";
import AppTextField from "../components/AppTextField";
import StyledText from "../components/StyledText";

import { Colors } from "../constants/Colors";
import AppSelect from "../components/AppSelect";
import AppButton from "../components/AppButton";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";

import { getClientInfo, getNextOfKins, createNextOfKin } from "../api";
import { userProfileSchema } from "../validationSchemas/userSchema";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

const PersonalDetails = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userHasNextOfKin, setUserHasNextOfKin] = useState(0);
  const [nexOfKin, setNextOfKin] = useState(null);
  const [kinRelationship, setKinRelationship] = useState(null);
  const [gender, setGender] = useState(null);

  const kinRelationships = [
    {
      label: "Spouse",
      value: "Spouse",
    },
    {
      label: "Parent",
      value: "Parent",
    },
    {
      label: "Sibling",
      value: "Sibling",
    },
    {
      label: "Son",
      value: "Son",
    },
    {
      label: "Daughter",
      value: "Daughter",
    },
    {
      label: "Guardian",
      value: "Guardian",
    },
    {
      label: "Aunt",
      value: "Aunt",
    },
    {
      label: "Uncle",
      value: "Uncle",
    },
    {
      label: "Niece",
      value: "Niece",
    },
    {
      label: "Nephew",
      value: "Nephew",
    },
    {
      label: "Cousin",
      value: "Cousin",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

  const genderOptions = [
    {
      label: "Male",
      value: "M",
    },
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
      setKinRelationship(nextOfKins[0].relationship);
      setGender(nextOfKins[0].gender);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }
  return (
    <div>
      <HeaderText>Personal Details</HeaderText>
      <div className="mb-[30px] flex flex-col items-center justify-center gap-[15px]">
        <img
          src="/images/utlam-default.webp"
          className="h-[75px] w-[75px] rounded-full md:h-[150px] md:w-[150px]"
        />
        <StyledText type="subheading" variant="semibold" color={Colors.primary}>
          {`${userData?.firstname} ${userData?.surname}`}
        </StyledText>
      </div>

      <div className="rounded-lg border p-[20px]">
        <Formik
          validationSchema={userProfileSchema}
          initialValues={
            userHasNextOfKin > 0
              ? {
                  firstname: userData?.firstname,
                  surname: userData?.surname,
                  phoneNumber: userData?.mobileNumber,
                  kinFirstname: nexOfKin ? nexOfKin?.firstname : "",
                  kinLastname: nexOfKin ? nexOfKin?.surname : "",
                  kinEmail: nexOfKin ? nexOfKin?.email : "",
                  kinPhoneNumber: nexOfKin ? nexOfKin?.telephoneNo : "",
                  kinGender: nexOfKin ? nexOfKin?.gender : "",
                  kinRelationship: nexOfKin ? nexOfKin?.relationship : "",
                }
              : {
                  firstname: userData?.firstname,
                  surname: userData?.surname,
                  phoneNumber: userData?.mobileNumber,
                  kinFirstname: "",
                  kinLastname: "",
                  kinEmail: "",
                  kinPhoneNumber: "",
                  kinGender: "",
                  kinRelationship: "",
                }
          }
          onSubmit={async (values) => {
            const { kinEmail, kinFirstname, kinLastname, kinPhoneNumber } =
              values;

            const nextOfKinData = {
              email: kinEmail,
              firstname: kinFirstname,
              surname: kinLastname,
              telephoneNo: kinPhoneNumber,
              relationship: kinRelationship,
              gender: gender,
            };
            if (userHasNextOfKin === 0) {
              if (kinRelationship && gender) {
                const data = await createNextOfKin(nextOfKinData);
                if (data) {
                  toast.success("Profile has been updated succesfully");
                  navigate("/profile");
                }
              } else {
                toast.error("PLease fill out all fields");
              }
            }
          }}
        >
          {({ handleChange, handleSubmit, isSubmitting }) => (
            <div className="flex w-full flex-col gap-[40px]">
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
                    <AppTextField
                      name="firstname"
                      onChange={handleChange("firstname")}
                      label={"First Name"}
                      sx={{ width: "48%" }}
                    />
                    <AppTextField
                      name="surname"
                      onChange={handleChange("surname")}
                      label={"Last Name"}
                      sx={{ width: "48%" }}
                    />
                  </div>
                  <AppTextField
                    name="phoneNumber"
                    onChange={handleChange("phoneNumber")}
                    label={"Phone Number"}
                    sx={{ width: "100%" }}
                  />
                </div>
                <div className="mt-[20px] flex w-[100%] flex-col gap-[15px] md:mt-[0px] md:w-[48%]">
                  <StyledText
                    type="title"
                    color={Colors.text}
                    style={{ fontWeight: "600" }}
                  >
                    Next of kin
                  </StyledText>
                  <div className="relative flex justify-between">
                    <AppTextField
                      name="kinFirstname"
                      onChange={handleChange("kinFirstname")}
                      disabled={userHasNextOfKin === 1 ? true : false}
                      label={"First Name"}
                      sx={{ width: "48%" }}
                    />
                    <AppTextField
                      name="kinLastname"
                      onChange={handleChange("kinLastname")}
                      disabled={userHasNextOfKin === 1 ? true : false}
                      label={"Last Name"}
                      sx={{ width: "48%" }}
                    />
                  </div>

                  <AppTextField
                    name="kinEmail"
                    onChange={handleChange("kinEmail")}
                    disabled={userHasNextOfKin === 1 ? true : false}
                    label={"Email Address"}
                    sx={{ width: "100%" }}
                  />

                  <AppTextField
                    name="kinPhoneNumber"
                    onChange={handleChange("kinPhoneNumber")}
                    disabled={userHasNextOfKin === 1 ? true : false}
                    label={"Phone Number"}
                    sx={{ width: "100%" }}
                  />

                  <AppSelect
                    name={"kinRelationship"}
                    label="Relationship"
                    onValueChange={(value) => setKinRelationship(value)}
                    // selectedValue={kinRelationship}
                    options={kinRelationships}
                    disabled={userHasNextOfKin === 1 ? true : false}
                  />
                  <AppSelect
                    name={"kinGender"}
                    label="Gender"
                    onValueChange={(value) => setGender(value)}
                    options={genderOptions}
                    disabled={userHasNextOfKin === 1 ? true : false}
                  />
                </div>
              </div>
              <AppButton onClick={handleSubmit}>
                {isSubmitting === true ? (
                  <SmallLoadingSpinner color={Colors.white} />
                ) : (
                  "Save"
                )}
              </AppButton>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonalDetails;
