import { useState } from "react";
import { Moneys } from "iconsax-react";

import StyledText from "../component/ui/StyledText";
import Toggle from "../component/ui/Toggle";
import Product from "../component/Product";
import { Colors } from "../constants/Color";

import { amountFormatter } from "../utils/amountFormatter";
import { useData } from "../context/DataContext";

const Invest = () => {
  const [filter, setFilter] = useState("all");

  const { products } = useData();

  const toggleOptions = [
    { label: "All", value: "all" },
    { label: "Mutual Funds", value: "mutualfund" },
    { label: "Fixed Income", value: "liability" },
  ];

  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className={"my-4"}
      >
        Investments
      </StyledText>

      <div className="flex-1 rounded-xl bg-white p-4 md:p-8">
        <div className="flex flex-col items-center gap-3 border-b border-[#B0B0B0] pb-3 md:flex-row">
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

        <div className="mt-5 grid grid-cols-2 gap-5 gap-y-5 md:grid-cols-3 lg:grid-cols-3">
          {products
            ?.filter(
              (product) =>
                filter === "all" || product.portfolioTypeName === filter,
            )
            .map((product, index) => (
              <Product item={product} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Invest;
