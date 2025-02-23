const Loader = () => {
  return (
    <div className="relative h-16 w-16 rounded-full bg-[#000050]">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/dtu6cxvk6/image/upload/logo.png"
          alt="Logo"
          className="z-10 h-6 w-6"
        />
      </div>

      <div className="flex h-full w-full items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-300 border-t-[#000050]"></div>
      </div>
    </div>
  );
};

export default Loader;

{
  /* <div className="flex items-center justify-center h-full w-full">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#000050] rounded-full animate-spin" />
    </div> */
}
