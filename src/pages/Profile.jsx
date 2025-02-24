import {
  ArrowRight2,
  Book,
  ClipboardTick,
  Headphone,
  Lock1,
  UserOctagon,
  Profile as ProfileIcon,
  Global,
  DocumentText,
  Security,
} from "iconsax-react";
import { useNavigate } from "react-router-dom";
import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";
import { useAuth } from "../context/UserContext";
import { useData } from "../context/DataContext";

const settingsOptions = [
  {
    icon: ProfileIcon,
    label: "Personal Details",
    path: "/profile/personal-details",
  },
  { icon: Book, label: "Bank Details", path: "/profile/bank-details" },
  { icon: ClipboardTick, label: "KYC", path: "/kyc/1" },
  { icon: UserOctagon, label: "Contact Account Manager", path: "#" },
  { icon: Lock1, label: "Change Password", path: "/change-password" },
  { icon: Global, label: "Visit Our Website", path: "#" },
  { icon: DocumentText, label: "Terms and Conditions", path: "#" },
  { icon: Security, label: "Privacy Policy", path: "#" },
  { icon: Headphone, label: "Help & Support", path: "#" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { walletDetails } = useData();

  console.log(user);

  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className="my-4"
      >
        Profile
      </StyledText>

      <div className="flex-1 rounded-xl bg-white bg-[url('https://res.cloudinary.com/dtu6cxvk6/image/upload/layer.png')] bg-cover bg-center p-5 md:p-3 lg:p-5">
        <div className="flex items-center gap-5 py-3">
          {/* <img
            alt=""
            src="/images/utlam-default.webp"
            className="h-[50px] w-[50px] rounded-full md:h-[100px] md:w-[100px]"
          /> */}
          <div>
            <StyledText type="heading" variant="medium" color={Colors.white}>
              {user?.fullName}
            </StyledText>
            <br />
            <StyledText
              type="label"
              color={Colors.white}
              style={{ opacity: "0.7" }}
            >
              {user?.userName}
            </StyledText>
            <br />
            <StyledText
              type="label"
              color={Colors.white}
              style={{ opacity: "0.7" }}
            >
              {walletDetails?.accountName}
            </StyledText>
            <br />
            <StyledText
              type="label"
              color={Colors.white}
              style={{ opacity: "0.7" }}
            >
              {walletDetails?.accountNo}
            </StyledText>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex-1 rounded-xl bg-white p-5 md:p-3 lg:p-5">
          <div className="my-3 border-b border-gray-200 pb-3">
            <StyledText color={Colors.primary} variant="semibold" type="title">
              Account Settings
            </StyledText>
          </div>

          {settingsOptions.map(({ icon: Icon, label, path }, index) => (
            <div key={index}>
              <div
                onClick={() => path !== "#" && navigate(path)}
                className="flex cursor-pointer flex-row items-center justify-between bg-white py-4 hover:bg-gray-200"
              >
                <StyledText
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <Icon size={20} color={Colors.primary} />
                  {label}
                </StyledText>
                <ArrowRight2 size={17} color={Colors.primary} variant="Bold" />
              </div>
              <hr className="border-t border-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
