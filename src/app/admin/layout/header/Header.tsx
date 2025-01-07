import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  Badge,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./Header.scss";
import { MenuItem, Menu } from "@mui/material";
import { useNavigate } from "react-router-dom";
import userSessionInfo from "../../util/userSessionInfo";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink } from "react-router-dom";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import notification_icon from "../../../../assets/Images/notification_icon.svg";
import down_arrow_icon from "../../../../assets/Images/down_arrow_icon.svg";
import Api from "../../api/Api";
import Stack from "@mui/material/Stack";
import ReusableNotification from "./Notifications";


interface Notification {
  notification_id: string;
  cust_unit_id?: string;
  unit_id?: string;
  invoice_number?: string;
  title: string;
  description: string;
  is_read: boolean;
  notification_type: string;
  user_login_id?: string;
  created_on?: string;
  last_modified_by?: string;
  last_modified_at?: string;
  floor_name?: string;
  floor_no?: string;
  project_code?: number;
  project_name?: string;
  tower_code?: string;
  tower_name?: string;
  unit_no?: string;
}

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [openProfileMenu,setOpenProfileMenu] = useState(false)
  const [userType,setUserType] = useState("")
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

 
  const [notification,setnotification] = useState<any>([]);
  const [nftStatusUpdate, setNftStatusUpdate] = useState<any>(true);
  const [clickedNotifications, setClickedNotifications] = useState(
    notification?.map((notification: any,index: any) => false) // Initialize all notifications as unclicked (false)
  );


  const handleClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const userInfo = userSessionInfo.logUserInfo();
    if(userInfo?.user_type_id == "internal"){
      userSessionInfo.getClearSessionData();
      navigate("/crm/login");
    }else{
      userSessionInfo.getClearSessionData();
      navigate("/crm/admin/login");
    }
   
  };

  const handleMyAccount = () => {
    navigate("/crm/myaccount");
    setOpenProfileMenu(false)
  };

  const handleProfileClickAway = () => {
    setOpenProfile(false);
  };

  const getRMDetails = async () => {
    const userInfo = userSessionInfo.logUserInfo();
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("crm_details", {
      crm_executive_code: userInfo?.rm_user_name,
    });

    if (responseStatus) {
      setFirstName(data?.crm_executive_name);
      setEmail(data?.email_id);
      setProfileUrl(data?.crm_profile_pic);
    }
  };

  const handleNavigation = (notification: any) => {
    if (notification?.notification_type === "documentTemplate") {
      navigate("/crm/admin/templateapproval");
    }
  }
  const handleNotificationClick = (index: number, notification_id: string) => {
    const updatedClicks = [...clickedNotifications];
    updatedClicks[index] = true; // Mark notification as clicked
    setClickedNotifications(updatedClicks);
    updateNotificationStatus(notification_id);
    fetchNotifications();
  };

  const updateNotificationStatus = async (notificationId:string) => {
    try {
      const response = await Api.post("", {
        notification_id: notificationId
      });
      if (response.status && response.data && response.data.length > 0) {
        console.log(response.data);
        setNftStatusUpdate(true);
      } else {
        console.error("Failed to Update Notifications:", response.message);
      }
    } catch (error) {
      console.error("Error Updating Notifications Data:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await Api.get("crm_get_Notification", {});
      if (response.status && response.data && response.data.length > 0) {
        console.log(response.data);
        setnotification(response.data);
      } else {
        console.error("Failed to fetch Notifications Data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching Notifications Data:", error);
    }
  };
useEffect(() => {
    if (nftStatusUpdate) {
      setNftStatusUpdate(false);
      fetchNotifications();
    }
  }, [nftStatusUpdate, fetchNotifications])

  useEffect(() => {
    getRMDetails();
    fetchNotifications();
  }, []);

  function getInitials(fullName: string) {
    const nameParts = fullName.split(" ");
    let second_name;
    let initials;
    if (nameParts[1] != undefined) {
      second_name = nameParts[1]?.substring(0, 1).toUpperCase();
      initials = nameParts[0]?.substring(0, 1).toUpperCase() + second_name;
    } else {
      second_name = nameParts[0]?.substring(0, 2).toUpperCase();
      initials = second_name;
    }
    return initials.toUpperCase();
  }

  return (
    <AppBar className="topbar">
      <Toolbar style={{gap : '10px'}}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          <img className="tw-w-20 md:tw-mr-8" src={"/logo.png"} alt="" />
        </Typography>
        <IconButton size="large" onClick={toggleNotification}>
          <Badge color="error" className={`tw-flex tw-gap-6 tw-mb-4 notification-item ${notification?.is_read ? '' : 'tw-bg-black/5'}`}>
            <img src={notification_icon} alt="notification-icon" />
          </Badge>
        </IconButton>
        {isNotificationOpen && (
          <ClickAwayListener onClickAway={() => setIsNotificationOpen(false)}>
            <div className="notification-wrapper" ref={notificationRef}>
    <ReusableNotification notificationData={notification} onNotificationClick={handleNotificationClick} onNavigation={handleNavigation} nftStatusUpdate={nftStatusUpdate} isNotificationOpen={isNotificationOpen} setIsNotificationOpen={setIsNotificationOpen}  />
    </div>
          </ClickAwayListener>
        )}
        <p  style={{borderRight : '1px solid #C0C4CE'}}>f</p>
        {profileUrl != "" && profileUrl != null && profileUrl != undefined ? (
          <Stack className="avatar" direction="row" spacing={1}>
            <Avatar alt="Remy Sharp" src={profileUrl} onClick={()=>setOpenProfileMenu(true)} />
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Avatar onClick={()=>setOpenProfileMenu(true)}>{getInitials(firstName || 'SA')}</Avatar>
          </Stack>
        )}
        <IconButton aria-label="Download" onClick={handleClick}>
          <div onClick={()=>setOpenProfileMenu(true)} className="text-pri-all" style={{fontSize : '18px'}}>{firstName}</div>
          <img src={down_arrow_icon} alt="down_arrow_icon" onClick={()=>setOpenProfileMenu(true)}/>
        </IconButton>
        {openProfileMenu && <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <div style={{ padding: "0.5rem", width: "10rem" }}>
            <div className="tw-flex tw-gap-2 tw-mb-2 tw-cursor-pointer">
              <div className="primary-text-1">
                <PermIdentityIcon />
              </div>
              <div className="primary-text-1" onClick={handleMyAccount}>
                My Details
              </div>
            </div>
            <div className="tw-flex tw-gap-2 tw-cursor-pointer">
              <div className="primary-text-1">
                <LogoutIcon />
              </div>
              <div onClick={handleLogout} className="primary-text-1">
                Log Out
              </div>
            </div>
          </div>
        </Menu>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Header;
