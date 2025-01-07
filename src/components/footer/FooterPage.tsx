import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AddTaskIcon from "@mui/icons-material/AddTask";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as HomeLoanIcon } from '../../assets/Images/home-loan-icon.svg';
import "./FooterPage.scss";

function FooterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStyleId, setActiveStyleId] = useState(0);

  const footerItems = [
    { label: "Home", icon: <HomeIcon className="!tw-size-4" />, path: "/dashboard", styleId: 1 },
    { label: "My tasks", icon: <AddTaskIcon className="!tw-size-4" />, path: "/my-task-page", styleId: 2 },
    // { label: "Home Loan", icon: <HomeLoanIcon className="!tw-size-4" fill={activeStyleId === 3 ? '#3C4049' : '#656C7B'} />, path: "/home-loan-page", styleId: 3 },
    { label: "Help", icon: <LiveHelpOutlinedIcon className="!tw-size-4" />, path: "/help", styleId: 4 },
    { label: "Profile", icon: <PersonOutlineOutlinedIcon className="!tw-size-4" />, path: "/myAccount/view", styleId: 5 },
  ];

  const handleButtonClick = (path: string, styleId: number) => {
    navigate(path);
    setActiveStyleId(styleId);
  };

  useEffect(() => {
    const matchingItem = footerItems.find((item) => item.path === location.pathname);
    if (matchingItem) {
      setActiveStyleId(matchingItem.styleId);
    }
  }, [location.pathname]);

  return (
    <div className="tw-fixed tw-bottom-0 tw-left-0 tw-flex tw-bg-white tw-w-full tw-border-t tw-px-4 tw-py-2 tw-pb-4 tw-justify-between tw-text-xs tw-z-50">
      {footerItems.map((item) => (
        <div
          key={item.label}
          className={`${activeStyleId === item.styleId ? "tw-bg-black/10 tw-font-bold tw-text-black" : ""} 
            tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-2 tw-w-20 tw-aspect-[16/14] tw-rounded-md tw-cursor-pointer tw-gap-1`}
          onClick={() => handleButtonClick(item.path, item.styleId)}
        >
          {item.icon}
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default FooterPage;
