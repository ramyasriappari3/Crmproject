import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  useNavigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./leftsidebar.scss";
import onboard_icon from "./../../../../assets/Images/onboard_icon.svg";
import dashboard_icon from "./../../../../assets/Images/dashboard_icon.svg";
import manage_customer_icon from "./../../../../assets/Images/manage_customer_icon.svg";
import car_icon from "./../../../../assets/Images/car_icon.svg";
import QuizIcon from "@mui/icons-material/Quiz";
import ApartmentIcon from "@mui/icons-material/Apartment";
import userSessionInfo from "../../util/userSessionInfo";
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import InfoIcon from '@mui/icons-material/Info';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ad_icon from "./../../../../assets/Images/ad-icon.svg"
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

interface CollapsibleSidebarProps { }

const LeftSideBar: React.FC<CollapsibleSidebarProps> = ({ }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const userInfo = userSessionInfo.logUserInfo();
  const [activeSection, setActiveSection] = useState<string>("customers");

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
   
  };

  return (
    <div>
      <Drawer
        sx={{
          width: open ? 247 : 65,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 247 : 60,
            marginTop: "4rem",
            borderTop: "2px solid #DFE1E7",
          },
        }}
        anchor="left"
        open={true}
        variant="permanent"
      >
        <List>
          {userInfo?.user_type_id == "internal" && (
            <>
              <ListItem>
                <ListItemIcon>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={open ? handleDrawerClose : handleDrawerOpen}
                    edge="start"
                    className={`${!open ? "icon_style" : "icon_style1"} tw-z-50`}
                    sx={{
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {open ? (
                      <ChevronLeftIcon
                        sx={{
                          color: "black",
                          border: "1px solid black",
                          borderRadius: 1,
                          fontSize: "2rem",
                          marginBottom: "1rem",
                          backgroundColor: "white",
                          boxShadow: "none",
                          outline: "none",
                          "&:hover": {
                            backgroundColor: "#EAECEF",
                            boxShadow: "none",
                            outline: "none",
                          },
                        }}
                      />
                    ) : (
                      <ChevronRightIcon
                        sx={{
                          color: "black",
                          border: "1px solid black",
                          borderRadius: 1,
                          fontSize: "2rem",
                          marginBottom: "1rem",
                          backgroundColor: "white",
                          boxShadow: "none",
                          outline: "none",
                          "&:hover": {
                            backgroundColor: "#EAECEF",
                            boxShadow: "none",
                            outline: "none",
                          },
                        }}
                      />
                    )}
                  </IconButton>
                </ListItemIcon>
              </ListItem>
              <ListItem
                className={
                  activeSection === "dashboard" ? "selected" : ""
                }
                button
                selected={activeSection === "dashboard"}
                onClick={() => handleSectionClick("dashboard")}
              >
                <ListItemIcon
                  className={
                    activeSection === "dashboard" ? "icon-selected" : ""
                  }
                >
                  <span>
                    <img src={dashboard_icon} alt="dashboard icon" />
                  </span>
                </ListItemIcon>
                {open && <ListItemText primary="Dashboard" />}
              </ListItem>
              <ListItem
                className={activeSection === "customerslist" ? "selected" : ""}
                button
                selected={activeSection === "customerslist"}
                onClick={() => handleSectionClick("customerslist")}
              >
                <ListItemIcon
                  className={
                    activeSection === "customerslist" ? "icon-selected" : ""
                  }
                >
                  <span>
                    <img src={onboard_icon} alt="teams icon" />
                  </span>{" "}
                </ListItemIcon>
                {open && <ListItemText primary="Onboard Customers" />}
              </ListItem>
              <ListItem
                className={activeSection === "managecustomer" ? "selected" : ""}
                button
                selected={activeSection === "managecustomer"}
                onClick={() => handleSectionClick("managecustomer")}
              >
                <ListItemIcon
                  className={
                    activeSection === "managecustomer" ? "icon-selected" : ""
                  }
                >
                  <span>
                    <img src={manage_customer_icon} alt="teams icon" />
                  </span>
                </ListItemIcon>
                {open && <ListItemText primary="Manage Customers" />}
              </ListItem>
            
             
            </>
          )}

         
        </List>
        <Divider />
      </Drawer>
      <main style={{ marginLeft: open ? 260 : 80, marginTop: 64 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default LeftSideBar;
