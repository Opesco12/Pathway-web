import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useMediaQuery } from "react-responsive";
import {
  Briefcase,
  ChartSquare,
  HambergerMenu,
  Home3,
  LogoutCurve,
  MoneyTime,
  ReceiptText,
  User,
} from "iconsax-react";
import { Colors } from "../../constants/Color";

import "../../styles/sidebar.css";

const ResponsiveSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const isLargeScreen = useMediaQuery({ minWidth: 992 });
  const isMediumScreen = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  const handleCollapsedChange = () => {
    if (!isSmallScreen) {
      setCollapsed(!collapsed);
    }
  };

  const handleToggleSidebar = () => {
    setToggled(!toggled);
  };

  return (
    <>
      {isSmallScreen && (
        <div
          className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between px-4"
          style={{ backgroundColor: Colors.primary }}
        >
          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dtu6cxvk6/image/upload/PAM_NAV_LOGO.png"
              className="h-10"
              alt="Logo"
            />
          </div>

          <button
            onClick={handleToggleSidebar}
            className="rounded-lg p-2 hover:bg-blue-700"
          >
            <HambergerMenu size={24} color="white" />
          </button>
        </div>
      )}

      <Sidebar
        collapsed={isMediumScreen || collapsed}
        toggled={toggled}
        onBackdropClick={handleToggleSidebar}
        breakPoint="md"
        backgroundColor={Colors.primary}
        className={`h-screen ${isSmallScreen ? "fixed" : ""}`}
        width="240px"
      >
        <Menu
          className="flex h-full flex-col pt-6"
          menuItemStyles={{
            button: {
              color: "white",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
              padding: "12px 24px",
            },
          }}
        >
          {isLargeScreen ? (
            <MenuItem className="mb-8 px-6">
              <img
                src="https://res.cloudinary.com/dtu6cxvk6/image/upload/PAM_NAV_LOGO.png"
                className=""
                alt="Logo"
              />
            </MenuItem>
          ) : (
            isMediumScreen && (
              <MenuItem className="mb-8">
                <img
                  src="https://res.cloudinary.com/dtu6cxvk6/image/upload/logo.png"
                  className=""
                  alt="Logo"
                />
              </MenuItem>
            )
          )}

          <MenuItem
            icon={<Home3 variant="Bold" color="white" size={24} />}
            component={<a href="/" />}
          >
            <span className="text-white">Dashboard</span>
          </MenuItem>

          <MenuItem
            icon={<ChartSquare variant="Bold" color="white" size={24} />}
            component={<a href="/invest" />}
          >
            <span className="text-white">Invest</span>
          </MenuItem>

          <MenuItem
            icon={<ReceiptText variant="Bold" color="white" size={24} />}
            component={<a href="/transactions" />}
          >
            <span className="text-white">Transactions</span>
          </MenuItem>

          <MenuItem
            icon={<Briefcase variant="Bold" color="white" size={24} />}
            component={<a href="/portfolio" />}
          >
            <span className="text-white">Portfolio</span>
          </MenuItem>

          <MenuItem
            icon={<User variant="Bold" color="white" size={24} />}
            component={<a href="/profile" />}
          >
            <span className="text-white">Profile</span>
          </MenuItem>

          <div className="sidebar-footer">
            <MenuItem
              icon={<LogoutCurve variant="Bold" color="white" size={24} />}
              className="mt-auto mb-6"
            >
              <span className="text-white">Logout</span>
            </MenuItem>
          </div>
        </Menu>
      </Sidebar>
    </>
  );
};

export default ResponsiveSidebar;
