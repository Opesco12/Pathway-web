import { useEffect, useState } from "react";
import {
  Moneys,
  Calendar,
  Clock,
  PercentageCircle,
  ArrowCircleRight2,
} from "iconsax-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";
import AppModal from "../component/ui/AppModal";

import { amountFormatter } from "../utils/amountFormatter";
import { calculateTenor } from "../utils/functions/calculateTenor";
import { useData } from "../context/DataContext";
import { mutualfundRedemption } from "../api/apiClient";

const PortfolioDetails = ({}) => {
  const { portfolioId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUserBalance } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [formikBag, setFormikBag] = useState(null);

  const data = location?.state;

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .moreThan(0, "Please input a valid amount")
      .min(1000, `Minimum investment amount is ${amountFormatter.format(1000)}`)
      .max(data?.investmentBalance, "Amount cannot exceed your balance"),
  });

  const handleMutualFundWithdrawal = async (accountNo, amount) => {
    try {
      setIsModalOpen(false);
      formikBag?.setSubmitting(true);
      const data = await mutualfundRedemption(accountNo, amount);
      if (data) {
        toast.success(
          `Redemption Successful \n You have sucessfully redeemed ${amountFormatter.format(amount)} from ${data?.product?.portfolio}`,
        );
      }

      setFormValues(null);
      refreshUserBalance();
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
    if (!data || !portfolioId) {
      navigate("/404", { replace: true });
    }
  }, [data, portfolioId]);

  console.log(data);

  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className="my-4"
      >
        Portfolio - {data?.product?.portfolio}
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
                {amountFormatter.format(data?.investmentBalance)}
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

        {data?.portfolioType === 9 && (
          <div className="mt-5 grid grid-cols-2 items-start gap-3">
            {data?.product?.investments?.map((investment, index) => (
              <FixedIncomeInvestment
                investment={investment}
                portfolioId={portfolioId}
                key={index}
                portfolio={data?.product?.portfolio}
              />
            ))}
          </div>
        )}
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
            disabled={!formValues || formikBag?.isSubmitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-x-2 rounded-lg border bg-gray-100 px-4 py-4 text-sm font-medium text-white hover:bg-gray-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            style={{ borderColor: Colors.primary, color: Colors.primary }}
          >
            Cancel
          </button>

          <button
            onClick={() =>
              formValues &&
              handleMutualFundWithdrawal(
                data?.mutalFundAccountNo,
                formValues?.amount,
              )
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

const FixedIncomeInvestment = ({ investment, portfolioId, portfolio }) => {
  const navigate = useNavigate();
  const formatDate = (date) => {
    const newDate = new Date(date).toDateString();
    return newDate;
  };

  return (
    <div
      onClick={() =>
        navigate(`/portfolio/${portfolioId}/redeem`, {
          state: { investment: investment, portfolio },
        })
      }
      className="my-2 cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-lg"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moneys size={20} color={Colors.primary} variant="Bold" />
          <StyledText type="subheading" color={Colors.primary}>
            {amountFormatter.format(investment?.currentValue)}
          </StyledText>
        </div>
        <ArrowCircleRight2 size={35} color={Colors.primary} variant="Bold" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock size={20} color={Colors.primary} />

          <StyledText color={Colors.primary}>
            Tenor:{" "}
            {calculateTenor(investment?.valueDate, investment?.maturityDate)}{" "}
            Days
          </StyledText>
        </div>

        <div className="flex items-center gap-2">
          <PercentageCircle size={20} color={Colors.primary} />
          <StyledText color={Colors.primary}>
            Interest Rate: {investment?.interestRate}%
          </StyledText>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={20} color={Colors.primary} />
          <StyledText color={Colors.primary}>
            Maturity Date: {formatDate(investment?.maturityDate)}
          </StyledText>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetails;
