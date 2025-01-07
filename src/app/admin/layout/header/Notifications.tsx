import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Badge, ClickAwayListener, IconButton } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

interface NotificationComponentProps {
  notificationData: any;
  onNotificationClick: (index: number, notification_id: string) => void;
  onNavigation: (notification: Notification) => void;
  nftStatusUpdate: any;
  isNotificationOpen: boolean;
  setIsNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReusableNotification: React.FC<NotificationComponentProps> = ({
  notificationData,
  onNotificationClick,
  onNavigation,
  nftStatusUpdate,
  isNotificationOpen,
  setIsNotificationOpen
}) => {

  const [visibleCount, setVisibleCount] = useState(5);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unreadCount = notificationData?.filter((n: { is_read: any; }) => !n.is_read).length;
    setUnreadCount(unreadCount);
  }, [notificationData]);

  const handleViewMore = () => {
    setVisibleCount((prev) => (prev >= notificationData.length ? 5 : prev + 5));
  };

  const isAllNotificationsVisible = visibleCount >= notificationData.length;

  return (
    <div className="notification-container">
      <div className="tw-flex tw-self-start tw-mt-2">
        <ClickAwayListener onClickAway={() => setIsNotificationOpen(false)}>
          <Box className="notifications">
            {isNotificationOpen && (
              <Box className="notifications__list tw-p-4">
                <div className="tw-flex tw-items-center tw-justify-between">
                  <p className="tw-font-bold tw-text-lg tw-text-[#25272D]">Notifications</p>
                  <IconButton onClick={() => setIsNotificationOpen(false)}>
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
                            onNotificationClick(index, notification?.notification_id);
                            onNavigation(notification);
                          setIsNotificationOpen(false);
                        }}
                      >
                        <div className="tw-w-6">
                          <img src="/images/notification-bell.png" alt="Notification" className="tw-w-full" />
                        </div>
                        <div className="tw-w-72 tw-text-justify">
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

export default ReusableNotification;
