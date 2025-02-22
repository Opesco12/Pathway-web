import {
  ArrowCircleRight2,
  ArrowRight,
  ChartSquare,
  Moneys,
} from "iconsax-react";
import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";
import { amountFormatter } from "../utils/amountFormatter";

const Portfolio = () => {
  return (
    <div className="flex flex-col h-full">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className={"my-4"}
      >
        My Portfolio
      </StyledText>

      <div className="flex-1 bg-white rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[#ECF9FF] h-[200px] p-6 rounded-lg">
            <div className="h-full w-full bg-white rounded-lg p-5 flex flex-col items-center justify-center gap-5">
              <div className="flex items-center justify-center gap-1">
                <Moneys
                  size={18}
                  color={Colors.primary}
                  variant="Bold"
                />
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

          <div className="border border-gray-300 rounded-lg p-5">
            <div className="flex items-center gap-3 pb-3 border-b  border-gray-300">
              <ChartSquare
                size={35}
                color={Colors.lightSecondary}
                variant="Bold"
              />
              <div className="w-full flex justify-between items-center gap-2">
                <div>
                  <StyledText
                    color={Colors.primary}
                    variant="semibold"
                  >
                    Pathway Money Market Plan
                  </StyledText>
                  <br />
                  <StyledText
                    type="label"
                    color={"#4D4D4D"}
                  >
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

            <div className="flex items-center gap-3 pb-3 border-b  border-gray-300">
              <ChartSquare
                size={35}
                color={Colors.lightSecondary}
                variant="Bold"
              />
              <div className="w-full flex justify-between items-center gap-2 p-3">
                <div>
                  <StyledText
                    color={Colors.primary}
                    variant="semibold"
                  >
                    Pathway Money Market Plan
                  </StyledText>
                  <br />
                  <StyledText
                    type="label"
                    color={"#4D4D4D"}
                  >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
