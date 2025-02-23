import { useState, useEffect } from "react";
import { ChartSquare, ArrowCircleRight2 } from "iconsax-react";

import StyledText from "./ui/StyledText";
import { Colors } from "../constants/Color";

import { amountFormatter } from "../utils/amountFormatter";
import { p } from "framer-motion/client";

const PortfolioItem = ({ product, isLast }) => {
  const [fixedIncomeBalance, setFixedIncomeBalance] = useState(0);

  useEffect(() => {
    if (product.portfolioType === 9) {
      var balance = 0;
      console.log(product.investments);
      product.investments?.map(
        (investment) => (balance += investment.currentValue),
      );

      setFixedIncomeBalance(balance);
    }
  }, []);

  return (
    <div
      className={`flex items-center gap-3 rounded pb-3 pl-3 hover:bg-gray-200 md:pl-1 lg:pl-3 ${
        !isLast ? "border-b border-gray-300" : ""
      }`}
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
