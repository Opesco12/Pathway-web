import { useEffect, useState } from "react";
import { Formik, Field } from "formik";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Moneys } from "iconsax-react";
import * as Yup from "yup";
import { toast } from "react-toastify";

import StyledText from "../component/ui/StyledText";
import AppModal from "../component/ui/AppModal";
import { amountFormatter } from "../utils/amountFormatter";
import { Colors } from "../constants/Color";

import { fixedIncomeRedemptionOrder } from "../api/apiClient";
import { useData } from "../context/DataContext";

const FixedIncomeWithdrawal = () => {
  const navigate = useNavigate();
  const { refreshUserBalance } = useData();
  const { portfolioId } = useParams();
  const location = useLocation();
  const data = location.state?.investment;
  const portfolio = location.state?.portfolio;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [formikBag, setFormikBag] = useState(null);

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .moreThan(0, "Please input a valid amount")
      .min(1000, `Minimum investment amount is ${amountFormatter.format(1000)}`)
      .max(data?.faceValue, "Amount cannot exceed your balance"),
  });

  const handleFixedIncomeWithdrawal = async (referenceNo, amount) => {
    try {
      setIsModalOpen(false);
      formikBag?.setSubmitting(true);
      const data = await fixedIncomeRedemptionOrder(referenceNo, amount);
      if (data) {
        toast.success(
          `Redemption Successful \n You have sucessfully redeemed ${amountFormatter.format(amount)} from ${portfolio}`,
        );
        setFormValues(null);
        refreshUserBalance();
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Redemption failed. Please try again.");
    } finally {
      formikBag?.setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (formikBag) {
      formikBag.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!portfolioId || !data) navigate("/404", { replace: true });
  }, []);

  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className="my-4"
      >
        Portfolio - {portfolio}
      </StyledText>

      <div className="flex-1 rounded-xl bg-white p-5 md:p-3 lg:p-5">
        <div
          className={`grid grid-cols-1 gap-3 md:${data?.portfolioType !== 9 && "grid-cols-2"}`}
        >
          <div className="min-h-[200px] rounded-lg border border-[#73CAEE] bg-[#ECF9FF] p-3 md:p-6">
            <div className="flex h-[200px] w-full flex-col items-center justify-center gap-5 rounded-lg border border-[#73CAEE] bg-white p-3 md:p-5">
              <div className="flex items-center justify-center gap-1">
                <Moneys size={18} color={Colors.primary} variant="Bold" />
                <StyledText type="label">Total Investment Balance</StyledText>
              </div>

              <StyledText
                variant="semibold"
                color={Colors.primary}
                style={{ fontSize: "2rem" }}
              >
                {amountFormatter.format(data?.faceValue)}
              </StyledText>
            </div>
          </div>

          {data?.portfolioType !== 9 && (
            <div className="rounded-lg border border-[#B0B0B0] p-3 md:p-7">
              <Formik
                initialValues={{ amount: "", tenor: "" }}
                validationSchema={validationSchema}
                onSubmit={(values, formikHelpers) => {
                  setFormValues(values);
                  setFormikBag(formikHelpers);
                  setIsModalOpen(true);
                }}
              >
                {({
                  errors,
                  touched,
                  handleSubmit,
                  isSubmitting,
                  values,
                  setFieldValue,
                }) => (
                  <div className="flex h-full flex-col items-center justify-center">
                    <StyledText
                      className="my-1 w-full text-center"
                      color={Colors.primary}
                      variant="semibold"
                    >
                      Amount to redeem
                    </StyledText>

                    <Field
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="Enter amount"
                      disabled={isSubmitting}
                      className="block w-full rounded-lg border px-4 py-3 text-center text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                      style={{
                        borderColor:
                          errors.amount && touched.amount
                            ? "red"
                            : Colors.primary,
                      }}
                    />

                    {errors.amount && touched.amount && (
                      <p className="my-1 text-xs text-red-600">
                        {errors.amount}
                      </p>
                    )}

                    <button
                      onClick={handleSubmit}
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-6 inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      style={{ backgroundColor: Colors.primary }}
                    >
                      {isSubmitting ? "Processing..." : "Redeem Funds"}
                    </button>
                  </div>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
      <AppModal
        title="Confirm Redemption"
        isOpen={isModalOpen}
        onClose={handleModalClose}
      >
        <StyledText>
          Redemption during the Lock-up period will attract a 20% penalty on
          accrued returns earned over the period.
        </StyledText>

        <StyledText>Are you sure you want to redeem your funds?</StyledText>

        <div className="grid grid-cols-2 gap-5">
          <button
            onClick={handleModalClose}
            //   disabled={!isChecked || !formValues || formikBag?.isSubmitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-x-2 rounded-lg border bg-gray-100 px-4 py-4 text-sm font-medium text-white hover:bg-gray-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            style={{ borderColor: Colors.primary, color: Colors.primary }}
          >
            Cancel
          </button>

          <button
            onClick={() =>
              formValues &&
              handleFixedIncomeWithdrawal(data?.referenceNo, formValues?.amount)
            }
            disabled={!formValues || formikBag?.isSubmitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            style={{ backgroundColor: Colors.primary }}
          >
            {formikBag?.isSubmitting ? "Processing..." : "Confirm"}
          </button>
        </div>
      </AppModal>
    </div>
  );
};

export default FixedIncomeWithdrawal;
