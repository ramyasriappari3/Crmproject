import React, { ContextType, useEffect, useState } from "react";
import "./MyAccountPage.scss";
import { toast } from "react-toastify";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { generateRandomNumber, getDataFromLocalStorage } from "@Src/utils/globalUtilities";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ProgressBar from "@ramonak/react-progress-bar";
import { useContext } from "react";
import { MyContext } from "@Src/Context/RefreshPage/Refresh";
import user_profile_icon from "./../../assets/Images/customer_profile.png";
import { useNavigate } from "react-router-dom";
import userSessionInfo from "@Src/app/admin/util/userSessionInfo";
import { useDispatch } from "react-redux";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { Tooltip } from '@mui/material';

const MyAccountPage = () => {
  const navigate = useNavigate();
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [panNumber, setPANNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0); // Password strength indicator
  const [passwordError, setPasswordError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const userDetails: any = JSON.parse(getDataFromLocalStorage("user_details") || "{}");
  const [newProfilePicUrl, setNewProfilePicUrl] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressBarColor, setProgressBarColor] = useState("#FF0006");
  const [picBlur, setPicBlur] = useState(false);
  const [profilePictureId, setProfilePictureId] = useState(false);
  const { toggleState, cust_profile_id } = useContext(MyContext);
  const dispatch = useDispatch();

  const getMainApplicantDetails = async () => {
    try {
      dispatch(showSpinner());
      const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.CUSTOMER_APPLICATION_DETAILS}?cust_profile_id=${userDetails?.cust_profile_id}`).GET();
      if (apiResponse?.success) {
        setfullName(apiResponse?.data?.customerProfileDetails?.full_name);
        setEmail(apiResponse?.data?.customerProfileDetails?.email_id);
        setPANNumber(apiResponse?.data?.pan_card)
        setProfileUrl(apiResponse?.data?.customerProfileDocumentsDetails?.find((doc: any) => doc?.document_name === "applicant_photo")?.document_url);
        setProfilePictureId(apiResponse?.data?.customerProfileDocumentsDetails?.find((doc: any) => doc?.document_name === "applicant_photo")?.document_identifier);
      }
      else {

      }
    }
    catch (err) {

    }
    finally {
      dispatch(hideSpinner());
    }

  };


  const calculatePasswordStrength = (password: any) => {
    // Password strength calculation
    let strength = 0;

    // Minimum length
    if (password.length >= 8) {
      strength += 1;
    }
    // Presence of uppercase letters
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }
    // Presence of lowercase letters
    if (/[a-z]/.test(password)) {
      strength += 1;
    }
    // Presence of numbers
    if (/\d/.test(password)) {
      strength += 1;
    }
    // Presence of special characters
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) {
      strength += 1;
    }
    setPasswordStrength(strength);
  };

  const getPasswordColor = () => {
    // Determine color for password complexity
    if (passwordStrength === 0 || passwordStrength === 1) {
      return "red"; // Low complexity
    } else if (passwordStrength === 2) {
      return "orange"; // Medium complexity
    } else if (passwordStrength === 3) {
      return "#FFCC00"; // Medium-High complexity
    } else if (passwordStrength === 4) {
      return "yellow"; // High complexity
    } else if (passwordStrength === 5) {
      return "green"; // Very High complexity
    }
  };

  const changeUserData = async (e: any) => {
    e.preventDefault();
    if (!newProfilePicUrl) {
      return;
    }
    const user_data = {
      document_url: newProfilePicUrl,
      document_name: "applicant_photo",
      document_type: "ID Document",
      document_number: generateRandomNumber(7),
      last_modified_by: userDetails?.user_login_name,
    };

    try {
      const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.UPDATE_USER_PROFILE}`).POST(user_data);
      if (apiResponse?.success) {
        toast.success("Profile Updated Sucessfully !");
        setRefreshPage(!refreshPage);
        setPicBlur(false);
      }
    } catch (err) { }
    toggleState();
  };

  const removeUserProfile = async (e: any) => {
    e.preventDefault();
    if (profilePictureId === undefined || profilePictureId === null) {
      return;
    }
    const user_data = {
      document_identifier: profilePictureId,
    };

    try {
      const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.DELETE_APPLICANT_DOCUMENTS}`).POST(user_data);
      if (apiResponse?.success) {
        toast.success("Profile Updated Sucessfully !");
        setRefreshPage(!refreshPage);
      }
    } catch (err) {
      //console.log("Getting error ", err);
    }
    toggleState();
  };

  const updatePassword = async (e: any) => {
    e.preventDefault();
    setPasswordError("");
    setCurrentPasswordError("");
    if (!currentPassword) {
      setCurrentPasswordError("Current password is required");
    } else if (newPassword === currentPassword) {
      setPasswordError("New Password Should be unique");
    } else if (newPassword.length < 8) {
      setPasswordError("Password Should be minimum 8 Characters");
    } else if (passwordStrength < 2) {
      setPasswordError("Password should be strong");
    } else if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      const reqObj = {
        new_password: newPassword,
        current_password: currentPassword,
        pan_card: userDetails?.user_login_name,
        user_type_id: "customer",
      };
      try {
        const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.UPDATE_PASSWORD}`).POST(reqObj);
        if (apiResponse.success) {
          toast.success(apiResponse.message);
        } else {
          toast.error(apiResponse.message);
        }
      } catch (err) {
        //console.log("Error occurred while updating password:", err);
        // Handle error state
      }
    }
  };

  const handleFileUpload = async (file: any) => {
    // Check if a file was selected
    if (file) {
      const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"]; // Allowed file types
      const maxSizeInBytes = 2 * 1024 * 1024; // Max file size: 2MB
      const minSizeInBytes = 20 * 1024; // Max file size: 2MB

      // Check if the file type is allowed
      if (allowedFileTypes.includes(file.type)) {
        // Check if the file size is less than 2MB
        if (file.size < maxSizeInBytes && file.size > minSizeInBytes) {
          setShowProgressBar(true);
          try {
            const customHeaders: any = {
              "Content-Type": "multipart/form-data",
            };
            let reqObj: any = {
              file: file,
              cust_profile_id: userDetails.cust_profile_id,
              document_name: "applicant_photo",
            };
            const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.UPLOAD_DOCUMENTS, true, true, customHeaders).POST(reqObj);
            setProgress(100);
            setTimeout(() => {
              setProgressBarColor("#2cba00");
              setTimeout(() => {
                setShowProgressBar(false);
              }, 1000);
            }, 1000);
            if (response.success) {
              setNewProfilePicUrl(response?.data?.data);
              setProfileUrl(response?.data?.data);
              setPicBlur(true);
            }
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        } else if (file.size > maxSizeInBytes) {
          toast.error("File size should be below 2MB");
        }
        else if (file.size < minSizeInBytes) {
          toast.error("File size should be more than 20KB");
        }
      } else {
        // Invalid file type
        console.error(
          "Invalid file type. Only JPG, JPEG, and PNG files are allowed."
        );
        toast.error(
          "Invalid file type. Only JPG, JPEG, and PNG files are allowed."
        );
      }
    } else {
      // No file selected
      console.error("No file selected");
      toast.warn("No file selected");
    }
  };

  const handleLogout = () => {
    userSessionInfo.getClearSessionData();
    navigate("/login");
  };


  useEffect(() => {
    calculatePasswordStrength(newPassword);
  }, [newPassword]);

  useEffect(() => {
    getMainApplicantDetails();
  }, [refreshPage]);

  return (
    <div className="my-account-cont">
      <h3 className="tw-font-bold">Profile</h3>
      <p className="tw-text-light-grey">Upload your photo and personal details here</p>
      <p className="tw-mt-5 tw-text-xs tw-text-gray-400">PROFILE PICTURE</p>
      <div className="tw-mt-2 tw-flex tw-p-5 tw-border-[#8f8e8e5a] tw-border-[1px] tw-w-fit tw-rounded-xl tw-items-center">
        <img src={profileUrl || user_profile_icon} alt="main-profile-url" className="tw-mr-6 tw-size-24 tw-rounded-full tw-object-cover tw-object-top" style={picBlur ? { filter: "blur(1px)" } : {}} />
        <div>
          <div>
            {showProgressBar && (
              <div className="progressbar tw-w-2/4">
                <ProgressBar
                  completed={progress}
                  bgColor={progressBarColor}
                  isLabelVisible={false}
                  height="3px"
                  width="10vh"
                />
              </div>
            )}
            <label htmlFor="file-upload" className="tw-flex tw-justify-center tw-items-center tw-cursor-pointer tw-px-12 tw-py-2 tw-rounded-lg tw-text-white tw-bg-[#241F20]">Update Profile Picture</label>
            <input id="file-upload" type="file" style={{ display: "none" }} onChange={(e) => handleFileUpload(e.target.files?.[0])} />
            {/* Commenting the remove button as this may have implication with if the customer removes the profile picture, then in RM side also it will be removed
            and this will create unnecessary confusion */}
            {/* <button
              className="tw-py-1 tw-mt-4 tw-px-7 tw-border-black tw-border-2 tw-ml-2 tw-rounded-md"
              onClick={(e) => {
                removeUserProfile(e);
              }}
              style={
                profileUrl === ""
                  ? { cursor: "not-allowed", opacity: "0.2" }
                  : {}
              }
              disabled={profileUrl === ""}
            >
              Remove
            </button> */}
          </div>
          <p className="tw-text-[#656C7B] tw-mt-3">
            You can upload jpg, png, jpeg images files <br /> max size of 2MB
          </p>
        </div>
      </div>

      <button className="tw-px-10 tw-py-2 tw-bg-black tw-mt-4 tw-text-white tw-rounded-lg" onClick={changeUserData}>
        Save Changes
      </button>
      <form>
        <div className="tw-grid md:tw-grid-cols-3 tw-grid-cols-1 tw-gap-8 tw-mt-4">
          <div className="tw-flex tw-flex-col tw-gap-2">
            <label htmlFor="full name">Full Name</label>
            <Tooltip title={'Please Contact Your RM for any change'} arrow placement="top" classes={{ tooltip: 'custom-tooltip-color' }}>
              <input
                disabled
                type="text"
                className="tw-p-2 tw-rounded-md tw-flex-1 tw-bg-[#eee]"
                value={fullName}
              />
            </Tooltip>
          </div>
          <div className="tw-flex tw-flex-col tw-gap-2">
            <label htmlFor="email">Email address</label>
            <Tooltip title={'Please Contact Your RM for any change'} arrow placement="top" classes={{ tooltip: 'custom-tooltip-color' }}>
              <input
                disabled
                type="email"
                className="tw-p-2 tw-rounded-md tw-flex-1  tw-bg-[#eee]"
                value={email}
              />
            </Tooltip>
          </div>
        </div>
      </form>
      <hr className="tw-mt-5 tw-mb-5" />
      <h3 className="tw-font-bold">Password</h3>
      <p className="tw-text-gray-400">
        We recommend that you set a strong password that is at least 8 <br />{" "}
        characters long and includes a mix of letters, numbers, and symbols
      </p>

      <form className="tw-flex tw-flex-col tw-mt-4" onSubmit={(e) => { e.preventDefault(); }}>
        <label htmlFor="">Current password</label>
        <div className="tw-border tw-border-[#DFE1E7] tw-w-fit tw-p-1 tw-px-4 tw-rounded-lg">
          <input
            type={currentPasswordVisible ? "text" : "password"}
            className="tw-p-2 lg:tw-w-80 tw-rounded-md !tw-border-none"
            onChange={(e) => { setCurrentPassword(e.target.value); }}
          />
          <button onClick={() => { setCurrentPasswordVisible(!currentPasswordVisible); }}>
            {currentPasswordVisible ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
          </button>
        </div>
        {currentPasswordError && <span className="tw-text-red-500">{currentPasswordError}</span>}
        <label htmlFor="" className="tw-mt-4">
          New password
        </label>
        <div className="tw-border tw-border-[#DFE1E7] tw-w-fit tw-p-1 tw-px-4 tw-rounded-lg">
          <input
            type={newPasswordVisible ? "text" : "password"}
            className="tw-p-2  lg:tw-w-80 tw-rounded-md !tw-border-none"
            onChange={(e) => { setNewPassword(e.target.value); }}
          />
          <button onClick={() => { setNewPasswordVisible(!newPasswordVisible) }}>
            {newPasswordVisible ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
          </button>
        </div>
        <div className="tw-flex tw-mt-2 ">
          <span
            className="tw-w-20 tw-h-1 tw-bg-[#DFE1E7] tw-rounded-md tw-mr-3"
            style={
              passwordStrength >= 1
                ? { backgroundColor: getPasswordColor() }
                : {}
            }
          ></span>
          <span
            className="tw-w-20 tw-h-1 tw-bg-[#DFE1E7] tw-rounded-md tw-mr-3"
            style={
              passwordStrength > 2
                ? { backgroundColor: getPasswordColor() }
                : {}
            }
          ></span>
          <span
            className="tw-w-20 tw-h-1 tw-bg-[#DFE1E7] tw-rounded-md tw-mr-3"
            style={
              passwordStrength > 3
                ? { backgroundColor: getPasswordColor() }
                : {}
            }
          ></span>
          <span
            className="tw-w-20 tw-h-1 tw-bg-[#DFE1E7] tw-rounded-md tw-mr-3"
            style={
              passwordStrength > 4
                ? { backgroundColor: getPasswordColor() }
                : {}
            }
          ></span>
        </div>
        <label htmlFor="" className="tw-mt-4">
          Confirm password
        </label>
        <div className="tw-border tw-border-[#DFE1E7] tw-w-fit tw-p-1 tw-px-4 tw-rounded-lg">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            className="tw-p-2 lg:tw-w-80 tw-rounded-md !tw-border-none"
            onChange={(e) => { setConfirmPassword(e.target.value) }}
            style={{ border: "none" }}
          />
          <button
            onClick={() => { setConfirmPasswordVisible(!confirmPasswordVisible) }}
          >
            {confirmPasswordVisible ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
          </button>
        </div>
        {passwordError && <span className="tw-text-red-500">{passwordError}</span>}
        <button className="tw-bg-black tw-w-fit tw-text-white tw-mt-7 tw-py-2 tw-px-10 tw-rounded-lg" onClick={updatePassword}>
          Change Password
        </button>
      </form>
      <button className="md:tw-hidden tw-w-full tw-p-2 tw-mt-8 tw-border-2 tw-border-red-500 tw-text-red-500 tw-rounded-lg" onClick={handleLogout}>
        LOGOUT
      </button>
    </div>
  );
};

export default MyAccountPage;
