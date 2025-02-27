import React, { useState } from "react";
import { CloseCircle } from "iconsax-react";

import StyledText from "./StyledText";
import { Colors } from "../../constants/Color";

const AppModal = ({ isOpen, onClose, title, children }) => {
  //   const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2">
        <div className="relative min-h-[300px] rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between border-b border-[#B0B0B0] pb-3">
            <StyledText variant="semibold" type="title" color={Colors.primary}>
              {title}
            </StyledText>
            <CloseCircle size={24} color="#000" onClick={onClose} />
          </div>

          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppModal;
