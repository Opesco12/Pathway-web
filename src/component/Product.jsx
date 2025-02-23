import { Moneys } from "iconsax-react";

import StyledText from "./ui/StyledText";
import { Colors } from "../constants/Color";

import { amountFormatter } from "../utils/amountFormatter";
import { toSnakeCase, getProductImage } from "../utils/functions/getImage";

const Product = ({ item }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg hover:shadow-lg">
      <img
        src={getProductImage(item?.portfolioName)}
        //   className="h-[45%]"
      />

      <div
        className="flex-1 bg-[#ECF9FF] p-3"
        //   style={{ backgroundColor: Colors.lightSecondary }}
      >
        <StyledText color={Colors.primary} type="title" variant="semibold">
          {item?.portfolioName}
        </StyledText>

        <div className="mt-5 flex items-center gap-1 border-t border-[#B0B0B0] pt-2">
          <Moneys size={18} color={Colors.secondary} variant="Bold" />

          <StyledText type="label">
            From {amountFormatter.format(item?.minimumInvestment)}
          </StyledText>
        </div>
      </div>
    </div>
  );
};

export default Product;
