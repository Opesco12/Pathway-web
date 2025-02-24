import { useState, useEffect } from "react";
import { ChartSquare, ArrowCircleRight2 } from "iconsax-react";
import { useNavigate } from "react-router-dom";

import StyledText from "./ui/StyledText";
import { Colors } from "../constants/Color";

import { amountFormatter } from "../utils/amountFormatter";

const PortfolioItem = ({ product, isLast }) => {
  const navigate = useNavigate();
  const [fixedIncomeBalance, setFixedIncomeBalance] = useState(0);

  useEffect(() => {
    if (product.portfolioType === 9) {
      var balance = 0;
      product.investments?.map(
        (investment) => (balance += investment.currentValue),
      );

      setFixedIncomeBalance(balance);
    }
  }, []);

  const handleNavigation = () =>
    navigate(`/portfolio/${product?.portfolioId}`, {
      state: {
        mutualfundAccountNo: product?.mutualfundAccountNo,
        portfolioType: product?.portfolioType,
        product: product,
        investmentBalance:
          product.portfolioType === 9 ? fixedIncomeBalance : product?.balance,
      },
    });

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded pb-3 pl-3 hover:bg-gray-200 md:pl-1 lg:pl-3 ${
        !isLast ? "border-b border-gray-300" : ""
      }`}
      onClick={product?.portfolio !== "Wallet" ? handleNavigation : undefined}
    >
      <ChartSquare size={45} color={Colors.lightSecondary} variant="Bold" />
      <div className="flex flex-1 items-center justify-between gap-2 p-3">
        <div>
          <StyledText color={Colors.primary} variant="semibold">
            {product?.portfolio}
          </StyledText>
          <br />
          <StyledText type="label" color={"#4D4D4D"}>
            {product ? (
              product.portfolioType === 9 ? (
                amountFormatter.format(fixedIncomeBalance)
              ) : (
                amountFormatter.format(product.balance)
              )
            ) : (
              <StyledText type="label" color={"#4D4D4D"}>
                Loading...
              </StyledText>
            )}
          </StyledText>
        </div>
        <ArrowCircleRight2
          size={30}
          variant="Bold"
          color={Colors.primary}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default PortfolioItem;
