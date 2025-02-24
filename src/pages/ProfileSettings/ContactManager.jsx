import { useState } from "react";
import { Mail, PhoneCall } from "lucide-react";
import { Copy, CopySuccess } from "iconsax-react";
import StyledText from "../../component/ui/StyledText";
import { Colors } from "../../constants/Color";

const ContactManager = () => {
  const [isMailCopied, setIsMailCopied] = useState(false);
  const [isPhoneCopied, setIsPhoneCopied] = useState(false);

  const handleMailCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsMailCopied(true);
      setTimeout(() => setIsMailCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handlePhoneCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsPhoneCopied(true);
      setTimeout(() => setIsPhoneCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className="my-4"
      >
        Contact Account Manager
      </StyledText>

      <div className="flex-1 space-y-4 rounded-xl bg-white p-4 md:p-8">
        <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2">
          <Mail size={20} color={Colors.primary} />
          <StyledText color={Colors.primary}>
            Email Address: info@pathwayassetmanagement.com
          </StyledText>

          {isMailCopied ? (
            <CopySuccess size={20} color={Colors.primary} />
          ) : (
            <Copy
              size={20}
              color={Colors.primary}
              onClick={() => handleMailCopy("info@pathwayassetmanagement.com")}
            />
          )}
        </div>

        <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2">
          <PhoneCall size={20} color={Colors.primary} />
          <StyledText color={Colors.primary}>
            Telephone Number: (+234) 707 - 033 - 9449
          </StyledText>
          {isPhoneCopied ? (
            <CopySuccess size={20} color={Colors.primary} />
          ) : (
            <Copy
              size={20}
              color={Colors.primary}
              onClick={() => handlePhoneCopy("(+234) 707 - 033 - 9449")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManager;
