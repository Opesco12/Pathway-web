import {
  ArrowCircleRight2,
  ArrowRight,
  ChartSquare,
  Moneys,
} from "iconsax-react";
import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";
import { amountFormatter } from "../utils/amountFormatter";
import PortfolioItem from "../component/PortfolioItem";
import { useData } from "../context/DataContext";

const Portfolio = () => {
  const {
    totalBalance,
    mutualFundBalances,
    fixedIncomePortfolio,
    userBalance,
  } = useData();

  console.log(fixedIncomePortfolio);

  console.log("Total balance: ", totalBalance);
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

      <div className="flex-1 rounded-xl bg-white p-5 md:p-3 lg:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="h-[200px] rounded-lg border border-[#73CAEE] bg-[#ECF9FF] p-6">
            <div className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-lg border border-[#73CAEE] bg-white p-5">
              <div className="flex items-center justify-center gap-1">
                <Moneys size={18} color={Colors.primary} variant="Bold" />
                <StyledText type="label">Total Portfolio Balance</StyledText>
              </div>

              <StyledText
                variant="semibold"
                color={Colors.primary}
                style={{ fontSize: "2rem" }}
              >
                {amountFormatter.format(totalBalance)}
              </StyledText>
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 p-5 md:p-3 lg:p-5">
            <PortfolioItem
              product={{ portfolio: "Wallet", balance: userBalance?.balance }}
            />
            {mutualFundBalances?.map((product, index) => (
              <PortfolioItem key={index} product={product} />
            ))}
            {fixedIncomePortfolio?.map((product, index) => (
              <PortfolioItem
                key={index}
                product={product}
                isLast={index === fixedIncomePortfolio.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
