import { Moneys, PercentageCircle, Judge, Calendar2 } from "iconsax-react";
import { Formik, Field } from "formik";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";
import { amountFormatter } from "../utils/amountFormatter";
import { useData } from "../context/DataContext";
import {
  getMutualFundOnlineBalance,
  getFixedIcomeOnlineBalances,
  getLiabilityProducts,
  getTenor,
  mutualFundSubscription,
  fixedIncomeSubscriptionOrder,
} from "../api/apiClient";
import AppModal from "../component/ui/AppModal";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const [investmentBalance, setInvestmentBalance] = useState(0);
  const [isLiabilityProduct, setIsLiabilityProduct] = useState(false);
  const [liabilityProducts, setLiabilityProducts] = useState([]);
  const [productTenors, setProductTenors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [formikBag, setFormikBag] = useState(null);

  const { userBalance, products, refreshUserBalance } = useData();
  const product = products?.find(
    (item) => item.portfolioId === Number(portfolioId),
  );

  if (!product) {
    navigate("/404");
  }

  const fetchData = async () => {
    try {
      if (product.portfolioType === 9) {
        const investmentbalances = await getFixedIcomeOnlineBalances(
          product?.portfolioId,
        );
        let balance = 0;
        investmentbalances?.map((investment) => {
          balance += investment?.currentValue;
        });
        setInvestmentBalance(balance);

        setIsLiabilityProduct(true);
        const liabilityProducts = await getLiabilityProducts(
          product.portfolioId,
        );
        if (liabilityProducts) {
          setLiabilityProducts(liabilityProducts);
          const tenors = await getTenor(liabilityProducts[0].productId);
          setProductTenors(tenors);
        }
      } else {
        const investment = await getMutualFundOnlineBalance(
          product?.portfolioId,
        );
        if (investment) setInvestmentBalance(investment?.balance);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const tenorOptions = productTenors?.map((tenor) => ({
    label: `${tenor.tenor} Days`,
    value: tenor.tenor,
  }));

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .moreThan(0, "Please input a valid amount")
      .min(
        product?.minimumInvestment || 0,
        `Minimum investment amount is ${amountFormatter.format(product?.minimumInvestment)}`,
      )
      .max(userBalance.balance, "Amount cannot exceed your balance"),
    tenor: isLiabilityProduct
      ? Yup.string().required("Please select a tenor")
      : Yup.string(),
  });

  const makeInvestment = async ({
    amount,
    portfolioId,
    portfolioTypeName,
    tenor,
  }) => {
    try {
      if (portfolioTypeName === "mutualfund") {
        return await mutualFundSubscription({
          amount: Number(amount),
          portfolioId: Number(portfolioId),
        });
      } else {
        return await fixedIncomeSubscriptionOrder({
          faceValue: Number(amount),
          currency: "NGN",
          portfolioId: Number(portfolioId),
          securityProductId: liabilityProducts[0]?.securityProductId,
          tenor: Number(tenor),
        });
      }
    } catch (error) {
      // Re-throw with more context
      throw new Error(
        error?.response?.data?.message || "Investment request failed",
      );
    }
  };

  const handleInvestment = async (values) => {
    try {
      // Start loading
      setIsModalOpen(false);
      formikBag?.setSubmitting(true);

      const { amount, tenor } = values;

      if (!product?.portfolioId || !product?.portfolioTypeName) {
        throw new Error("Product details are missing");
      }

      const response = await makeInvestment({
        amount,
        portfolioId: product.portfolioId,
        portfolioTypeName: product.portfolioTypeName,
        tenor: tenor,
      });

      if (response) {
        toast.success(
          `You have successfully invested ${amountFormatter.format(amount)} in ${product.portfolioName}`,
        );
      }

      setIsChecked(false);
      setFormValues(null);

      // Optionally refresh data
      fetchData();
      refreshUserBalance();

      return response;
    } catch (error) {
      // Show error message
      toast.error(error.message || "Investment failed. Please try again.");
      throw error;
    } finally {
      // Always reset submit state
      formikBag?.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (product) {
      fetchData();
    }
  }, [product]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsChecked(false);
    if (formikBag) {
      formikBag.setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className="my-4"
      >
        {product?.portfolioName}
      </StyledText>

      <div className="flex-1 rounded-xl bg-white p-5 md:p-3 lg:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="min-h-[200px] rounded-lg border border-[#73CAEE] bg-[#ECF9FF] p-3 md:p-6">
            <div className="flex h-[200px] w-full flex-col items-center justify-center gap-5 rounded-lg border border-[#73CAEE] bg-white p-3 md:p-5">
              <div className="flex items-center justify-center gap-1">
                <Moneys size={18} color={Colors.primary} variant="Bold" />
                <StyledText type="label">Investment Balance</StyledText>
              </div>

              <StyledText
                variant="semibold"
                color={Colors.primary}
                style={{ fontSize: "2rem" }}
              >
                {amountFormatter.format(investmentBalance)}
              </StyledText>
            </div>

            <div className="grid grid-cols-2 py-5">
              <Detail
                title="Annualized Yield"
                detail={`${product?.return}%`}
                icon={
                  <PercentageCircle
                    variant="Bold"
                    size={20}
                    color={Colors.primary}
                  />
                }
              />

              <Detail
                title="Min. Investment"
                detail={amountFormatter.format(product?.minimumInvestment)}
                icon={
                  <Moneys variant="Bold" size={20} color={Colors.primary} />
                }
              />
            </div>

            <div className="border-t border-[#73CAEE]" />

            <div className="grid grid-cols-2 py-5">
              <Detail
                title="Min. Holding Period"
                detail={`${product?.minimumHoldingPeriod} Days`}
                icon={
                  <Calendar2 variant="Bold" size={20} color={Colors.primary} />
                }
              />
              <Detail
                title="Penalty Rate"
                detail={`${product?.earlyRedemptionPenaltyRate}%`}
                icon={<Judge variant="Bold" size={20} color={Colors.primary} />}
              />
            </div>
          </div>

          <div className="h-[300px] rounded-lg border border-[#B0B0B0] p-3 md:p-7">
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
                    className="w-full text-center"
                    color={Colors.primary}
                    variant="semibold"
                  >
                    Amount to Invest
                  </StyledText>

                  <Field
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter investment amount"
                    disabled={isSubmitting}
                    className="block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                    style={{
                      borderColor:
                        errors.amount && touched.amount
                          ? "red"
                          : Colors.primary,
                    }}
                  />

                  {errors.amount && touched.amount && (
                    <p className="my-1 text-xs text-red-600">{errors.amount}</p>
                  )}

                  <StyledText type="label" color={Colors.light}>
                    Available Balance:{" "}
                    {amountFormatter.format(userBalance.balance)}
                  </StyledText>

                  {isLiabilityProduct && (
                    <>
                      <Field
                        as="select"
                        name="tenor"
                        disabled={isSubmitting}
                        className="mt-3 block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                        style={{
                          borderColor:
                            errors.tenor && touched.tenor
                              ? "red"
                              : Colors.primary,
                        }}
                      >
                        <option value="">Select Tenor</option>
                        {tenorOptions?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      {errors.tenor && touched.tenor && (
                        <p className="my-1 text-xs text-red-600">
                          {errors.tenor}
                        </p>
                      )}
                    </>
                  )}

                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    {isSubmitting ? "Processing..." : "Invest Funds"}
                  </button>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <AppModal
        title="Confirm Investment Terms"
        isOpen={isModalOpen}
        onClose={handleModalClose}
      >
        <StyledText>
          Redemption during the Lock-up period will attract a 20% penalty on
          accrued returns earned over the period.
        </StyledText>
        <StyledText className="mt-3">
          By tapping the "Make Payment" button, you agree to have the total due
          deducted from your wallet balance to create this investment plan.
        </StyledText>

        <div className="mt-4 flex items-center gap-1">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="rounded border-gray-300"
          />
          <StyledText type="label">Yes, I agree to the terms above.</StyledText>
        </div>

        <button
          onClick={() => formValues && handleInvestment(formValues)}
          disabled={!isChecked || !formValues || formikBag?.isSubmitting}
          className="mt-5 inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          style={{ backgroundColor: Colors.primary }}
        >
          {formikBag?.isSubmitting ? "Processing..." : "Make Payment"}
        </button>
      </AppModal>
    </div>
  );
};

const Detail = ({ title, detail, icon }) => {
  return (
    <div className="py-2">
      <div className="flex items-center justify-center gap-1">
        {icon}
        <StyledText type="label" variant="semibold">
          {title}
        </StyledText>
      </div>
      <StyledText
        type="label"
        variant="semibold"
        className="w-full text-center"
      >
        {detail}
      </StyledText>
    </div>
  );
};

export default ProductDetails;
