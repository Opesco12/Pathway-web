import { ChartSquare, ArrowCircleRight2 } from "iconsax-react";

import StyledText from "./ui/StyledText";
import { Colors } from "../constants/Color";

import { amountFormatter } from "../utils/amountFormatter";

const PortfolioItem = ({ portfolio }) => {
  return (
    <div className="flex items-center gap-3 border-b border-gray-300 pb-3">
      <ChartSquare size={35} color={Colors.lightSecondary} variant="Bold" />
      <div className="flex w-full items-center justify-between gap-2 p-3">
        <div>
          <StyledText color={Colors.primary} variant="semibold">
            Pathway Money Market Plan
          </StyledText>
          <br />
          <StyledText type="label" color={"#4D4D4D"}>
            {amountFormatter.format(4000000)}
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
