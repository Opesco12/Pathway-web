import { useEffect, useState } from "react";
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
  Copy,
  CopySuccess,
  Add,
  UserCirlceAdd,
} from "iconsax-react";
import { CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";
import { useAuth } from "../context/UserContext";
import { useData } from "../context/DataContext";
import { fetchClientPhoto, uploadImage } from "../api/apiClient";
import Loader from "../component/ui/LoadingAnimation";
import AppModal from "../component/ui/AppModal";
import { toast } from "react-toastify";

const settingsOptions = [
  {
    icon: ProfileIcon,
    label: "Personal Details",
    path: "/profile/personal-details",
  },
  { icon: Book, label: "Bank Details", path: "/profile/bank-details" },
  { icon: ClipboardTick, label: "KYC", path: "#" },
  {
    icon: UserOctagon,
    label: "Contact Account Manager",
    path: "/profile/contact-manager",
  },
  { icon: Lock1, label: "Change Password", path: "/change-password" },
  { icon: Global, label: "Visit Our Website", path: "https://pathway.ng/" },
  { icon: DocumentText, label: "Terms and Conditions", path: "#" },
  { icon: Security, label: "Privacy Policy", path: "#" },
  { icon: Headphone, label: "Help & Support", path: "/profile/support" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { walletDetails } = useData();

  const [clientPhoto, setClientPhoto] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const toggleChat = () => {
    if (!window.Tawk_API) return;

    if (window.Tawk_API.isChatHidden()) {
      window.Tawk_API.showWidget();
      window.Tawk_API.maximize();
    } else {
      window.Tawk_API.maximize();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const clientPhoto = await fetchClientPhoto();
      setClientPhoto(clientPhoto?.photo);
      // setIsLoading(false);
    };

    fetchData();
  }, []);

  // if (isLoading) {
  //   return (
  //     <div className="flex-1 items-center justify-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 10000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // if (file) {
    //   const imageUrl = URL.createObjectURL(file);
    // }
    setSelectedImage(file);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      if (!selectedImage) {
        toast.error("Select an image");
      } else {
        const response = await uploadImage(selectedImage);
      }

      setIsUploading(false);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error(error);
    }

    setIsUploading(false);
  };

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
        <div className="flex flex-col items-center justify-center py-3">
          {clientPhoto ? (
            <img
              src={`data:image/jpeg;base64,${clientPhoto}`}
              alt="Client"
              className="aspect-square w-30 rounded-full object-cover"
            />
          ) : (
            <div className="relative m-0 p-0">
              <UserCirlceAdd
                size="32"
                color={Colors.white}
                className="h-30 w-30 opacity-70"
                variant="Bold"
                onClick={() => setIsUploadModalOpen(true)}
              />
            </div>
          )}

          <div className="text-center">
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
              style={{ opacity: "0.7", marginTop: "20px" }}
            >
              {walletDetails?.accountName}
            </StyledText>
            <br />
            <div className="flex items-center justify-center gap-2">
              <StyledText
                type="label"
                color={Colors.white}
                style={{ opacity: "0.7" }}
              >
                {walletDetails?.accountNo}
              </StyledText>
              {copied ? (
                <CopySuccess
                  size={20}
                  color={Colors.white}
                  className="opacity-70"
                />
              ) : (
                <Copy
                  size={20}
                  color={Colors.white}
                  className="opacity-70"
                  onClick={() => handleCopy(walletDetails?.accountNo)}
                />
              )}
            </div>
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
            <div
              key={index}
              onClick={() => {
                if (path.startsWith("http")) {
                  window.open(path, "_blank");
                } else if (path !== "#") {
                  navigate(path);
                }
              }}
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
          ))}
        </div>
      </div>
      <AppModal
        isOpen={isUploadModalOpen}
        onClose={() => !isUploading && setIsUploadModalOpen(false)}
        title={"Upload Profile Image"}
      >
        <div className="">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload New Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#000050] hover:file:bg-blue-100"
            />
          </div>

          <div>
            {/* Display selected image */}
            {selectedImage && (
              <div className="h-20 w-20 overflow-hidden rounded-full border">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected Profile"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            )}
            <div className="">
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedImage}
                className={`mt-5 w-full rounded-md px-4 py-2 font-medium text-white ${
                  isUploading || !selectedImage
                    ? "cursor-not-allowed bg-[#60C2CF]"
                    : "bg-[#000050] hover:opacity-80"
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Upload Photo"
                )}
              </button>
            </div>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default Profile;
