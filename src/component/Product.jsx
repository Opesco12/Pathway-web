import { Moneys } from "iconsax-react";

import StyledText from "./ui/StyledText";
import { Colors } from "../constants/Color";

import { amountFormatter } from "../utils/amountFormatter";
import { getProductImage } from "../utils/functions/getImage";

const Product = ({ item }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <a href={`/invest/${item?.portfolioId}`}>
        <img src={getProductImage(item?.portfolioName)} />

        <div className="flex-1 bg-[#ECF9FF] p-2 md:p-5">
          <StyledText color={Colors.primary} variant="semibold">
            {item?.portfolioName}
          </StyledText>

          <div className="mt-5 flex items-center gap-1 border-t border-[#73CAEE] pt-2">
            <Moneys size={18} color={Colors.secondary} variant="Bold" />

            <StyledText type="label">
              From {amountFormatter.format(item?.minimumInvestment)}
            </StyledText>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Product;
