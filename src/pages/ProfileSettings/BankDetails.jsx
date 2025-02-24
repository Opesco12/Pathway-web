import { useState, useEffect } from "react";
import { AddCircle, Bank } from "iconsax-react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import AppModal from "../../component/ui/AppModal";
import StyledText from "../../component/ui/StyledText";
import { Colors } from "../../constants/Color";

import {
  getclientbankaccounts,
  getBanks,
  createClientBank,
} from "../../api/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BankDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banks, setBanks] = useState([]);
  const [clientbanks, setClientbanks] = useState([]);

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    bank: Yup.string().required("Bank is required"),
    accountNo: Yup.number()
      .typeError("Account number must be a number")
      .test(
        "len",
        "Account number must be exactly 10 digits",
        (val) => val && String(val).length === 10,
      )
      .required("Account number is required"),

    accountName: Yup.string()
      .required("Account name is required")
      .min(3, "Account name must be at least 3 characters")
      .max(100, "Account name can be at most 100 characters"),
  });

  useEffect(() => {
    const fetchData = async () => {
      //   setLoading(true);
      const clientbanks = await getclientbankaccounts();
      setClientbanks(clientbanks);

      const banklist = await getBanks();
      setBanks(
        banklist.map((item) => ({
          label: item.bankName.split("-")[0],
          value: item.companyId,
        })),
      );

      //   setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className={"my-4"}
      >
        Bank Details
      </StyledText>

      <div className="grid gap-5 md:grid-cols-2">
        {clientbanks?.length > 0 &&
          clientbanks.map((bank, index) => (
            <BankItem bank={bank} key={index} />
          ))}

        {clientbanks?.length < 1 && (
          <div
            onClick={() => setIsModalOpen(true)}
            className="my-[20px] flex h-[180px] w-[100%] items-center justify-center rounded-lg border border-gray-300"
          >
            <div className="flex flex-col items-center justify-center">
              <AddCircle size={25} color={Colors.light} />
              <StyledText color={Colors.light}>Add Bank Details</StyledText>
            </div>
          </div>
        )}
      </div>

      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Bank Details"}
      >
        <Formik
          initialValues={{ bank: "", accountNo: "", accountName: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setIsSubmitting }) => {
            // console.log(values);

            const { bank, accountName, accountNo } = values;

            const requestData = {
              beneficiaryCompanyId: bank,
              beneficiaryAccountNo: accountNo,
              currencyCode: "NGN",
              beneficiaryName: accountName,
              countryCode: "NGA",
            };
            const response = await createClientBank(requestData);
            if (response) {
              if (response?.message === "success") {
                toast.success("Bank Details ahve been added successfully");
                navigate("/profile");
              }
            }

            setIsSubmitting(false);
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <div className="my-[25px] flex flex-col gap-[25px]">
              <div>
                <label
                  htmlFor="bank"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Bank
                </label>
                <Field
                  as="select"
                  name="bank"
                  id="bank"
                  disabled={isSubmitting}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-70"
                >
                  <option value="">Select Bank</option>
                  {banks.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="bank"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="accountNo"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Account Number
                </label>
                <Field
                  name="accountNo"
                  id="accountNo"
                  disabled={isSubmitting}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-70"
                />
                <ErrorMessage
                  name="accountNo"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="accountName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Account Name
                </label>
                <Field
                  name="accountName"
                  id="accountName"
                  disabled={isSubmitting}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-70"
                />
                <ErrorMessage
                  name="accountName"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                style={{ backgroundColor: Colors.primary }}
              >
                {isSubmitting === true ? "Loading..." : "Save"}
              </button>
            </div>
          )}
        </Formik>
      </AppModal>
    </div>
  );
};

export default BankDetails;

const BankItem = ({ bank }) => {
  return (
    <div
      className="my-[20px] flex h-[180px] w-[100%] items-center justify-between rounded-lg px-[20px]"
      style={{ backgroundColor: Colors.primary }}
    >
      <div>
        <StyledText variant="medium" type="title" color={Colors.white}>
          {bank?.bankName}
        </StyledText>
        <br />

        <StyledText color={Colors.white}>
          {bank?.beneficiaryAccountNo}
        </StyledText>
        <br />

        <StyledText color={Colors.white} variant="medium">
          {bank?.beneficiaryName}
        </StyledText>
      </div>
      <Bank size={25} color={Colors.white} />
    </div>
  );
};
