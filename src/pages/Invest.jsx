import { useState } from "react";
import { Moneys } from "iconsax-react";

import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";
import { amountFormatter } from "../utils/amountFormatter";
import Toggle from "../component/ui/Toggle";

const Invest = () => {
  const [filter, setFilter] = useState("all");
  const Product = () => {
    return (
      <div className=" rounded-lg overflow-hidden flex flex-col">
        <img
          src="https://res.cloudinary.com/dtu6cxvk6/image/upload/default.png"
          //   className="h-[45%]"
        />

        <div
          className="flex-1 p-3 bg-[#ECF9FF]"
          //   style={{ backgroundColor: Colors.lightSecondary }}
        >
          <StyledText
            color={Colors.primary}
            type="title"
            variant="semibold"
          >
            Pathway Money Market Plan
          </StyledText>

          <div className="flex gap-1 items-center border-t border-[#B0B0B0] pt-2 mt-3">
            <Moneys
              size={18}
              color={Colors.secondary}
              variant="Bold"
            />

            <StyledText type="label">
              From {amountFormatter.format(5000)}
            </StyledText>
          </div>
        </div>
      </div>
    );
  };

  const toggleOptions = [
    { label: "All", value: "all" },
    { label: "Mutual Funds", value: "mutualfund" },
    { label: "Liabilities", value: "liability" },
  ];

  return (
    <div className="flex flex-col h-full">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className={"my-4"}
      >
        Investments
      </StyledText>

      <div className="flex-1 bg-white rounded-xl p-5">
        <div className="flex gap-3 border-b border-[#B0B0B0] pb-3">
          <StyledText
            variant="semibold"
            type="subheading"
            color={Colors.primary}
          >
            Available Products
          </StyledText>

          <Toggle
            options={toggleOptions}
            onValueChange={(value) => setFilter(value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 mt-5 gap-y-5">
          <Product />
          <Product />
          <Product />
          <Product />
        </div>
      </div>
    </div>
  );
};

export default Invest;
