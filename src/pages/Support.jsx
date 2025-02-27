import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";
import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { toast } from "react-toastify";

const Support = () => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Simulate sending the message to customer service
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setMessage("");

      toast.success("Your message has been sent, we'll respond shortly.");
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className="my-4"
      >
        Help & Support
      </StyledText>

      <div className="flex-1 rounded-xl bg-white p-5 md:p-3 lg:p-5">
        <div className="mb-8">
          <StyledText type="subheading" variant="semibold" className="mb-4">
            Contact Us
          </StyledText>

          <div className="mb-6 space-y-3">
            <div className="flex items-center">
              <Mail className="mr-2" size={20} color={Colors.primary} />
              <StyledText>
                <a
                  href="mailto:info@pathwayassetmanagement.com"
                  className="hover:underline"
                  style={{ color: Colors.primary }}
                >
                  info@pathwayassetmanagement.com
                </a>
              </StyledText>
            </div>

            <div className="flex items-center">
              <Phone className="mr-2" size={20} color={Colors.primary} />
              <StyledText>
                <a
                  href="tel:+2347070339449"
                  className="hover:underline"
                  style={{ color: Colors.primary }}
                >
                  (+234) 707 - 033 - 9449
                </a>
              </StyledText>
            </div>
          </div>

          <div className="my-6 border-b border-gray-200"></div>
        </div>

        <div>
          <StyledText type="subheading" variant="semibold" className="mb-4">
            Send a Message
          </StyledText>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="message" className="block">
                <StyledText variant="medium">
                  How can we help you today?
                </StyledText>
              </label>

              <textarea
                id="message"
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Describe your issue or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                style={{ backgroundColor: Colors.primary }}
                className="rounded-lg px-6 py-2 text-white hover:opacity-90 focus:outline-none disabled:opacity-70"
                disabled={isSubmitting || !message.trim()}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
