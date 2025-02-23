import React, { useState } from "react";
import { CloseCircle } from "iconsax-react";

import StyledText from "./StyledText";
import { Colors } from "../../constants/Color";

const AppModal = ({ isOpen, onClose, title, children }) => {
  //   const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 ">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg ">
        <div className="relative bg-white rounded-lg p-6 shadow-xl min-h-[300px]">
          <div className=" mb-6 flex justify-between items-center pb-3 border-b border-[#B0B0B0]">
            <StyledText
              variant="semibold"
              type="title"
              color={Colors.primary}
            >
              {title}
            </StyledText>
            <CloseCircle
              size={24}
              color="#000"
              onClick={onClose}
            />
          </div>

          <div className="space-y-4 mb-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppModal;
