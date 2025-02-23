import React from "react";
import StyledText from "./StyledText";
import { Colors } from "../../constants/Color";

const FilterBox = ({ text, selected, onPress }) => {
  return (
    <div
      className={`relative flex cursor-pointer overflow-hidden rounded-full border p-1 px-4 transition-transform duration-300 ${
        selected ? "scale-110" : "scale-100"
      }`}
      style={{
        borderColor: selected ? Colors.primary : Colors.lightPrimary,
        backgroundColor: Colors.white,
      }}
      onClick={onPress}
    >
      {/* Background animation */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          selected ? "w-full" : "w-0"
        }`}
        style={{
          borderRadius: "999px",
          zIndex: 0,
          backgroundColor: selected ? Colors.primary : "",
        }}
      ></div>

      {/* Text Content */}
      <StyledText
        className="relative z-10 transition-all duration-300"
        variant="medium"
        type="label"
        color={selected ? Colors.white : Colors.lightPrimary}
      >
        {text}
      </StyledText>
    </div>
  );
};

export default FilterBox;
