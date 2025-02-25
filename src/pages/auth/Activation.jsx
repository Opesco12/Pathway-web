import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

import { resnedActivationCode, activateAccount } from "../../api/apiClient";
import { Colors } from "../../constants/Color";
import { useAuth } from "../../context/UserContext";
import { userStorage } from "../../storage/userStorage";
import { keys } from "../../storage/keys";

const Activation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setIsAuthenticated, setUser } = useAuth();

  // Prevent manual access
  if (!location.state?.fromRegister) {
    return <Navigate to="/login" replace />;
  }

  const { email } = location.state;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      // handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (enteredOtp) => {
    console.log(email, enteredOtp);
    try {
      const info = {
        username: email,
        securityCode: `${enteredOtp}`,
      };

      console.log(info);
      const response = await activateAccount(info);
      if (response) {
        navigate("/login");
        toast.success("Your account has been successfully activated");
      }
    } catch (error) {
      toast.error("Invalid Code, Please try again.");
    }
  };

  const resendActivationCode = async (email) => {
    const data = await resnedActivationCode({ userName: email });
    if (data) {
      toast.success("Activation code has been sent succesfully.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto min-w-[320px] bg-[#f5f5f5] md:min-w-[500px]">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1
                className="block text-2xl font-bold text-gray-800"
                style={{ color: Colors.primary }}
              >
                Enter OTP
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a 6-digit code to your email. Please enter it below.
              </p>
            </div>

            <div className="mt-5">
              <form>
                <div className="grid gap-y-4">
                  <div className="text-center">
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="number"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="h-12 w-12 rounded-lg border text-center text-lg focus:border-blue-500 focus:ring-blue-500"
                          required
                          style={{ borderColor: Colors.primary }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    style={{ backgroundColor: Colors.primary }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(otp.join(""));
                    }}
                    disabled={otp.includes("")} // Disable button if OTP is incomplete
                  >
                    Verify OTP
                  </button>
                </div>
              </form>

              <p className="mt-4 text-center text-sm text-gray-600">
                Didn't receive the code?
                <button
                  className="cursor-pointer font-medium text-blue-600 hover:underline"
                  style={{ color: Colors.primary }}
                  onClick={() => resendActivationCode(email)}
                >
                  Resend Activation Code
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activation;
