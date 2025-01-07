import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import "./Notifications.scss";
import { ArrowBack } from "@mui/icons-material";
import { Badge, ClickAwayListener, IconButton } from "@mui/material";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { IAPIResponse } from "@Src/types/api-response-interface";
import { httpService, MODULES_API_MAP } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import { GridCloseIcon } from "@mui/x-data-grid";
import { useNavigate } from 'react-router-dom'
import { getDataFromLocalStorage } from "@Src/utils/globalUtilities";
import { LOCAL_STORAGE_DATA_KEYS } from "@Constants/localStorageDataModel";
import { count } from "console";

const Notifications = ({ notificationData, getNotifications, setNftStatusUpdate }: { notificationData: any, getNotifications: () => void, setNftStatusUpdate: any }) => {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const unit_id = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.UNIT_ID);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [clickedNotifications, setClickedNotifications] = useState(
    notificationData.map(() => false) // Initialize all notifications as unclicked (false)
  );

  const toggleNotifications = () => {
    setOpenNotifications((prev) => !prev);
  };

  const handleViewMore = () => {
    if (visibleCount >= notificationData.length) {
      setVisibleCount(5); // Reset to show only 5 notifications
    } else {
      setVisibleCount((prev) => prev + 5); // Show next 5 notifications
    }
  };

  const handleNotificationClick = (index: number, notificationId: string) => {
    const updatedClicks = [...clickedNotifications];
    updatedClicks[index] = true; // Mark notification as clicked
    setClickedNotifications(updatedClicks);
    updateNotificationStatus(notificationId);
    getNotifications();
  };

  const updateNotificationStatus = async (notificationId: string) => {
    if (!notificationId) {
      return;
    }
    try {
      const reqObj = { notification_id: notificationId }
      await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.UPDATE_NOTIFICATION}`).POST(reqObj);
      setNftStatusUpdate(true);
    }
    catch (error) {

    }
  };


  const handleNavigation = (notificationData: any) => {
    if (notificationData?.notification_type === "invoices") {
      navigate(`/my-property-details/unitId/${unit_id}/payments`)
    }
    else if (notificationData?.notification_type === "receipts") {
      navigate(`/my-property-details/unitId/${unit_id}/receipts`)
    }
  }

  const totalUnreadNotification = (notificationData: any) => {
    let count = 0;

    for (let i = 0; i < notificationData.length; i++) {
      if (notificationData[i]?.is_read === false) {
        count += 1;
      }
    }
    return count;

  };

  useEffect(() => {
    setUnreadCount(totalUnreadNotification(notificationData));

  }, [handleNotificationClick]);




  const isAllNotificationsVisible = visibleCount >= notificationData.length;

  return (
    <div className="notification-container">
      <div className="tw-flex tw-self-start tw-mt-2">
        <ClickAwayListener onClickAway={() => setOpenNotifications(false)}>
          <Box className="notifications">
            <div className="tw-block">
              <button className="tw-pb-2" type="button" onClick={toggleNotifications}>
                <Badge badgeContent={unreadCount} sx={{ '& .MuiBadge-badge': { backgroundColor: 'red', color: 'white', }, }}>
                  <NotificationsNoneIcon />
                </Badge>
              </button>
            </div>
            {openNotifications && (
              <Box className="notifications__list tw-p-4">
                <div className="tw-flex tw-items-center tw-justify-between">
                  <p className="tw-font-bold tw-text-lg tw-text-[#25272D]">Notifications</p>
                  <IconButton onClick={() => setOpenNotifications(false)}>
                    <GridCloseIcon />
                  </IconButton>
                </div>
                <div className="tw-py-4">
                  {notificationData.length > 0 ? (
                    notificationData?.slice(0, visibleCount).map((notification: any, index: number) => (
                      <div
                        key={index}
                        className={`tw-flex tw-gap-6 tw-mb-4 notification-item ${notification?.is_read ? '' : 'tw-bg-black/5'}`}
                        onClick={() => {
                          handleNotificationClick(index, notification?.notification_id);
                          handleNavigation(notification);
                          setOpenNotifications(false);
                        }}
                      >
                        <div className="tw-w-6">
                          <img src="/images/notification-bell.png" alt="Notification" className="tw-w-full" />
                        </div>
                        <div className="tw-w-72 tw-text-justify">
                          <div className="tw-font-bold tw-text-sm text-pri-all">
                            {`T${parseInt(notification?.tower_code)}-${parseInt(notification?.floor_no)}${notification?.unit_no}, ${notification?.project_name}`}
                          </div>
                          <div className="tw-text-sm text-pri-all">{notification?.description}</div>
                        </div>
                        {!notification?.is_read && (
                          <div className="blue-dot" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="tw-text-center tw-text-gray-500">No new notifications</div>
                  )}
                </div>
                {notificationData.length > 0 && (
                  <div className="tw-text-center tw-mt-4">
                    <button
                      className="tw-text-blue-500 tw-font-bold tw-text-sm"
                      onClick={handleViewMore}
                    >
                      {isAllNotificationsVisible ? "View Less" : "View More"}
                    </button>
                  </div>
                )}
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </div>
    </div>
  );
};

export default Notifications;
function navigate(arg0: string) {
  throw new Error("Function not implemented.");
}

