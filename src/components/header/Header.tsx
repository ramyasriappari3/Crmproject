import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@Src/features/auth/authSlice";
import { useAppDispatch } from "@Src/app/hooks";
import { AppRouteURls } from "@Constants/app-route-urls";
import { LOCAL_STORAGE_DATA_KEYS } from "@Constants/localStorageDataModel";
import { capitalizeFirstLetter, removeDataFromLocalStorage } from "@Src/utils/globalUtilities";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import { getDataFromLocalStorage } from "@Src/utils/globalUtilities";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import user_profile_icon from "./../../assets/Images/customer_profile.png";
import { MyContext } from "@Src/Context/RefreshPage/Refresh";
import { useContext } from "react";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import "./Header.scss";
import Notifications from "@Components/notifications/Notifications";

const Header = () => {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState("");
  const [openProfile, setOpenProfile] = useState(false);
  const [userName, setUsername] = useState("");
  const dispatchLogout = useAppDispatch();
  const navigate = useNavigate();
  const propertyId = location.pathname.split("/")[3];
  const [mainApplicantProfile, setMainApplicantProfile] = useState("");
  const userDetails: any = JSON.parse(getDataFromLocalStorage("user_details") || "{}");
  const [propertyDetails, setPropertyDetails] = useState<any>({});
  const [ismobileScreen, setMobileScreen] = useState(false);
  const [notificationData, setNotificationData] = useState<any>([]);
  const [nftStatusUpdate, setNftStatusUpdate] = useState<any>(true);
  const { isTrue, toggleState } = useContext(MyContext);
  const custUnitId = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.CUST_UNIT_ID);
  interface PropertyDetails {
    user_email: string;
    user_mobile: string;
    user_name: string;
    price_per_sqft: string;
    unit_id: number;
    covered_area: string;
    appartment_no: number;
    unit_type: string;
    bedrooms: number;
    balcony_area: string;
    carpet_area: string;
    facing: string;
    description: string;
    unit_floor_plan: string;
    project_name: number;
    project_details: string;
    project_address: string;
    name: number;
    floor_no: string;
    floor_name: string;
    tower_no: string;
    tower_name: string;
    bank_name: string;
    branch: string;
    bank_ifsc_code: string;
    account_holder_name: string;
    application_id: number;
    bank_account_number: string;
    parking_count: number;
    parking_slots: string;
    basement: string;
    joint_users: any[];
    unit_images: string[];
    first_name: string;
    last_name: string;
    due_amount: number;
    typical_floor_plan: string;
    other_charges: string;
    total_amount: string;
    sales_executive_image: string;
    sales_executive_name: string;
    sales_executive_email: string;
    sales_executive_phone: string;
    common_area: string;
  }

  const handleProfileClick = () => {
    setOpenProfile((prev) => !prev);
  };

  const handleProfileClickAway = () => {
    setOpenProfile(false);
  };

  const logoutHandler = () => {
    removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY);
    removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS);
    removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_TOKEN);
    dispatchLogout(logout());
    navigate(`/${AppRouteURls.LOG_IN}`);
  };

  const getMainApplicantDetails = async () => {
    try {
      const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.CUSTOMER_APPLICATION_DETAILS}?cust_profile_id=${userDetails?.cust_profile_id}`).GET();
      if (apiResponse?.success) {
        const profileUrlOfMainApplicant = apiResponse?.data?.customerProfileDocumentsDetails?.find((profileData: any) => profileData.document_name === "applicant_photo")?.document_url;
        setMainApplicantProfile(profileUrlOfMainApplicant);
        setUsername(apiResponse?.data?.customerProfileDetails?.full_name);
      }
    }
    catch (error) {

    }

  };

  const getPropertyDetail = async () => {
    try {
      const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.CUSTOMER_UNITS}?unit_id=${propertyId}`).GET();
      if (apiResponse?.success) {
        setPropertyDetails(apiResponse?.data?.resultData[0]);
      }
    } catch (error) { }
  };

  const getNotifications = async () => {
    try {
      const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.GET_NOTIFICATIONS}?cust_unit_id=${custUnitId}`).GET();
      if (apiResponse?.success) {
        console.log(apiResponse, "apiResponse");
        setNotificationData(apiResponse?.data);
      }
    }
    catch (error) {

    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMobileScreen(true);
      } else {
        setMobileScreen(false);
      }
    };

    handleResize();
  });

  useEffect(() => {
    getPropertyDetail();
    getMainApplicantDetails();



    if (location.pathname === "/myAccount/view") {
      setCurrentRoute("/myAccount/view");
    } else if (location.pathname.includes("/my-property-details")) {
      setCurrentRoute("/my-property-details");
    } else if (location.pathname.includes("/tds")) {
      setCurrentRoute("/tdsInfo");
    } else if (location.pathname.includes("/payments-proof")) {
      setCurrentRoute("/payments-proof");
    } else if (location.pathname == "/dashboard") {
      setCurrentRoute("/dashboard");
    } else if (location.pathname == "/help") {
      setCurrentRoute("/help");
    } else if (location.pathname == "/my-task-page") {
      setCurrentRoute("/my-task-page");
    } else if (location.pathname == "/home-loan-page") {
      setCurrentRoute("/home-loan-page");
    }
  }, [location.pathname, isTrue]);

  useEffect(() => {
    if (nftStatusUpdate) {
      setNftStatusUpdate(false);
      getNotifications();
    }
  }, [nftStatusUpdate, getNotifications])

  const getTowerFloorProjectName = () => {
    const modifiedTowerCode = parseInt(propertyDetails?.tower_code, 10).toString(); // Removed leading zeroes
    const floorCode = parseInt(propertyDetails?.floor_no, 10).toString(); // Removed leading zeroes
    const unitNo = propertyDetails?.unit_no;
    const projectName = propertyDetails?.project_name;
    return `T${modifiedTowerCode}-${floorCode}${unitNo} ${projectName}`;
  };

  const renderContent = () => {
    switch (currentRoute) {
      case "/myAccount/view":
        return <h1 className="tw-font-bold tw-text-black tw-text-2xl">My Account</h1>
      case "/my-property-details":
        return (
          <button className="tw-text-black tw-flex" onClick={() => { navigate("/dashboard"); }}>
            <ArrowBackIcon className="tw-font-light tw-text-[#656C7B]" />
            <span className="tw-font-medium tw-ml-2 tw-text-[#656C7B]">Home /{" "}
              <span className="tw-text-[#25272D] tw-font-bold">{" "}{capitalizeFirstLetter(getTowerFloorProjectName())}{" "}
              </span>
            </span>
          </button>
        );
      case "/tdsInfo":
        return (
          <button className="tw-text-black tw-flex" onClick={() => { navigate(`/my-property-details/unitId/${propertyDetails?.unit_id}/payments`); }}>
            <ArrowBackIcon className="tw-font-light tw-text-[#656C7B]" />
            <span className="tw-font-medium tw-ml-2 tw-text-[#656C7B]">
              Home / {capitalizeFirstLetter(getTowerFloorProjectName())} /
              Payments /{" "}
              <span className="tw-text-[#25272D] tw-font-bold">{" "}TDS details{" "}</span>
            </span>
          </button>
        );
      case "/payments-proof":
        return (
          <button className="tw-text-black tw-flex" onClick={() => { navigate(`/my-property-details/unitId/${propertyDetails?.unit_id}/payments`); }}>
            <ArrowBackIcon className="tw-font-light tw-text-[#656C7B]" />
            <span className="tw-font-medium tw-ml-2 tw-text-[#656C7B]">
              Home / {capitalizeFirstLetter(getTowerFloorProjectName())} /
              Payments /{" "}
              <span className="tw-text-[#25272D] tw-font-bold">{" "}Payment Proof Reconciliation{" "}</span>
            </span>
          </button>
        );
      case "/dashboard":
        return <p className="tw-text-black tw-text-2xl tw-font-bold ">Welcome, {userName}</p>
      case "/my-task-page":
        return <p className="tw-text-black tw-text-2xl tw-font-bold">My Tasks</p>
      case "/help":
        return <p className="tw-text-black tw-text-2xl tw-font-bold ">Help</p>;
      case "/home-loan-page":
        return <p className="tw-text-black tw-text-2xl tw-font-bold ">Home Loan</p>;
      default:
        return null;
    }
  };
  return (
    <div className="header-page tw-flex tw-mt-4 lg:tw-px-6 tw-px-4 tw-justify-between tw-items-center">
      <div className="tw-flex tw-justify-end tw-items-center ">
        {renderContent()}
      </div>
      <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
        <div className="tw-mb-1">
          <Notifications notificationData={notificationData} getNotifications={getNotifications} setNftStatusUpdate={setNftStatusUpdate} />
        </div>
        <div className="md:tw-block tw-hidden">
          <ClickAwayListener onClickAway={handleProfileClickAway}>
            <Box className="profileDropdown !tw-p-0 !tw-m-0">
              <button type="button" onClick={handleProfileClick}>
                <div className="tw-flex tw-items-center tw-justify-center tw-gap-4">
                  <div className="header-img">
                    <div className="tw-w-10">
                      <img src={mainApplicantProfile || user_profile_icon} alt="main applicant profile" className="tw-rounded-full tw-object-cover tw-object-top" />
                    </div>
                  </div>
                  <div className="tw-font-medium text-pri-all">{userName}</div>
                  <div>
                    <KeyboardArrowDownIcon />
                  </div>
                </div>
              </button>
              {openProfile ? (
                <Box className="profileDropdown__list">
                  <div>
                    <NavLink onClick={handleProfileClickAway} to={"/myAccount/view"} className="tw-flex tw-gap-2 tw-mb-2 tw-cursor-pointer">
                      <div className="primary-text-1"><PermIdentityIcon /></div>
                      <div className="primary-text-1">My Details</div>
                    </NavLink>
                    <div className="tw-flex tw-gap-2 tw-cursor-pointer" onClick={logoutHandler}>
                      <div className="primary-text-1"><LogoutIcon /></div>
                      <div className="primary-text-1">Log Out</div>
                    </div>
                  </div>
                </Box>
              ) : null}
            </Box>
          </ClickAwayListener>
        </div>
      </div>
    </div>
  );
};

export default Header;
