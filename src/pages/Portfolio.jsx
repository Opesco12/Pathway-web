import {
  ArrowCircleRight2,
  ArrowRight,
  ChartSquare,
  Moneys,
} from "iconsax-react";

import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";
import PortfolioItem from "../component/PortfolioItem";

import { amountFormatter } from "../utils/amountFormatter";
import { useData } from "../context/DataContext";

const Portfolio = () => {
  const { userBalance, products } = useData();

  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className={"my-4"}
      >
        My Portfolio
      </StyledText>

      <div className="flex-1 rounded-xl bg-white p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="h-[200px] rounded-lg bg-[#ECF9FF] p-6">
            <div className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-lg bg-white p-5">
              <div className="flex items-center justify-center gap-1">
                <Moneys size={18} color={Colors.primary} variant="Bold" />
                <StyledText type="label">Total Portfolio Balance</StyledText>
              </div>

              <StyledText
                variant="semibold"
                color={Colors.primary}
                style={{ fontSize: "2rem" }}
              >
                {amountFormatter.format(2320000)}
              </StyledText>
            </div>
          </div>

          <PortfolioItem />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
