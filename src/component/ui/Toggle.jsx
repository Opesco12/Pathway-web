import { useState } from "react";

import FilterBox from "./Filterbox";
import { Colors } from "../../constants/Color";

const Toggle = ({ options, onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState(options[0].value);

  const handlePress = (value) => {
    setSelectedValue(value);
    onValueChange(value);
  };
  return (
    <div className="flex justify-center gap-3 md:gap-4">
      {options.map((option, index) => (
        <FilterBox
          key={index}
          text={option.label}
          selected={option.value === selectedValue}
          style={{
            backgroundColor:
              selectedValue === option.value ? Colors.primary : Colors.white,
          }}
          onPress={() => handlePress(option.value)}
        />
      ))}
    </div>
  );
};

export default Toggle;
