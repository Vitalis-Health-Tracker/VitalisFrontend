import React, { useEffect, useState } from "react";
import IconHeartbeat from "../assets/IconHeartBeat";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logcheck, setLogcheck] = useState("");
  const [content, setContent] = useState();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setLogcheck(sessionStorage.getItem('isLoggedIn'))
    if (logcheck === "true") {
      setContent(
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          onClick={()=>navigate("/account")}
          className="size-6 fill-white h-8 w-8 rounded-full border-2 border-white hover:border-Quaternary cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
        
      );
    } else {
      setContent(
        <button
          className="font-poppins bg-Grey bg-opacity-40 flex space-x-1 border-2 hover:scale-110 border-Secondary rounded-full px-2 py-1 text-Secondary hover:bg-Quaternary hover:text-Secondary"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
        // </div>
      );
    }
  }, [isLoggedIn, logcheck]);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Fitness", path: "/fitness" },
    { name: "Diet", path: "/diet" },
    { name: "Wellbeing", path: "/wellbeing" },
  ];

  const isActive = (path) =>
    location.pathname === path
      ? "bg-Quaternary text-Secondary px-3 py-1 rounded-full text-sm font-medium"
      : "text-Secondary hover:bg-Quaternary hover:text-white px-3 py-1 rounded-full text-sm font-medium";

  return (
    <nav className="bg-Primary ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo and App Name */}
          <div
            className="flex items-center absolute"
            onClick={() => navigate("/")}
          >
            <IconHeartbeat
              style={{ width: "30px", height: "30px", color: "#ff0000" }}
            />
            <span
              className="text-Secondary ml-2 text-3xl font-geist font-semibold"
              style={{ cursor: "pointer" }}
            >
              Vitalis
            </span>
          </div>

          {/* Centered Navigation Links with White Rounded Border */}
          { logcheck === "true" ?
          (<div
            className="flex items-center justify-center flex-grow "
            style={{ marginLeft: "3em" }}
          >
            <div className="flex space-x-1 bg-opacity-10 hover:scale-110 transition font-poppins cursor-pointer  border-Secondary border-2 rounded-full px-2 py-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={isActive(link.path)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          ):(<></>)}

          {/* Profile Section on the Right */}
          <div className="relative ml-auto">{content}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
