import React, { ContextType, useEffect, useState } from "react";
import "./MyAccount.scss";
import { toast } from "react-toastify";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import { IAPIResponse } from "@Src/types/api-response-interface";
import {
  generateRandomNumber,
  getDataFromLocalStorage,
} from "@Src/utils/globalUtilities";
import ProgressBar from "@ramonak/react-progress-bar";
import { useContext } from "react";
import { MyContext } from "@Src/Context/RefreshPage/Refresh";
import { Tooltip } from "@mui/material";
import user_profile_icon from "./../../../../assets/Images/customer_profile.png";
import eye_icon from "./../../../../assets/Images/eye_icon.svg";
import userSessionInfo from "../../util/userSessionInfo";
import Api from "../../api/Api";
import Header from "@App/admin/layout/header/Header";
import { useAppDispatch } from "@Src/app/hooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";

const MyAccount = () => {
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0); // Password strength indicator
  const userDetails: any = JSON.parse(
    getDataFromLocalStorage("user_details") || "{}"
  );
  const [newProfilePicUrl, setNewProfilePicUrl] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressBarColor, setProgressBarColor] = useState("#FF0006");
  const [picBlur, setPicBlur] = useState(false);
  const [profilePictureId, setProfilePictureId] = useState(false);
  const [panOrPassportNumber, setPanOrPassportNumber] = useState(false);
  const [renderHeaderComponent, setRenderHeaderComponent] = useState(false);

  const { toggleState } = useContext(MyContext); // Ensure toggleState is typed correctly

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
      //   setRenderHeaderComponent(false)
    }
  };
  useEffect(() => {
    getRMDetails();
  }, [refreshPage]);

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

  useEffect(() => {
    calculatePasswordStrength(newPassword);
  }, [newPassword]);

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

    const userInfo = userSessionInfo.logUserInfo();
    const user_data = {
      document_url: newProfilePicUrl,
      crm_executive_code: userInfo?.rm_user_name,
      type: "update",
    };

    try {
      dispatch(showSpinner());
      const {
        data,
        status: responseStatus,
        message,
      }: any = await Api.post("crm_update_profile_pic", user_data);

      if (responseStatus) {
        toast.success("Profile Updated Sucessfully !");
        setRefreshPage(!refreshPage);
        setPicBlur(false);
        setRenderHeaderComponent(true);
      }
    } catch (err) {}
    toggleState();
    dispatch(hideSpinner());
  };

  const removeUserProfile = async (e: any) => {
    e.preventDefault();
    // setRenderHeaderComponent(false)
    const userInfo = userSessionInfo.logUserInfo();
    const user_data = {
      document_url: "",
      crm_executive_code: userInfo?.rm_user_name,
      type: "remove",
    };
    dispatch(showSpinner());
    try {
      const {
        data,
        status: responseStatus,
        message,
      }: any = await Api.post("crm_update_profile_pic", user_data);

      if (responseStatus) {
        toast.success("Profile Pic Removed Sucessfully !");
        setRefreshPage(!refreshPage);
        setPicBlur(false);
        setRenderHeaderComponent(true);
      }
    } catch (err) {
      //console.log("Getting error ", err);
    }
    toggleState();
    dispatch(hideSpinner());
  };

  const updatePassword = async (e: any) => {
    e.preventDefault();
    const userInfo = userSessionInfo.logUserInfo();
    const reqObj = {
      new_password: newPassword,
      current_password: currentPassword,
      user_login_name: userInfo?.rm_user_name,
      user_type_id: "internal",
    };
    try {
      if (newPassword === currentPassword) {
        toast.error("New Password Should be unique");
        setCurrentPassword("");
        setNewPassword("");
      } else if (newPassword.length < 8) {
        toast.error("Password Should be minimum 8 Characters");
      } else if (passwordStrength < 5) {
        toast.error("Password should be strong");
      } else {
        const {
          data,
          status: responseStatus,
          message,
        }: any = await Api.post("crm_reset_password", reqObj);
  
        if (responseStatus) {
          // Clear the password fields after successful update
          setCurrentPassword("");
          setNewPassword("");
          setPasswordStrength(0); // Reset password strength if needed
          toast.success(message);
          getRMDetails(); // Optionally refresh user details
        } else {
          toast.error(message);
          setRefreshPage(!refreshPage);
        }
      }
    } catch (err) {
      console.error("Error occurred while updating password:", err);
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
            const userInfo = userSessionInfo.logUserInfo();
            // console.log(userInfo, "userInfo");
            const formData: any = new FormData();
            formData.append("file", file);
            formData.append("cust_profile_id", userInfo.login_user_id);
            formData.append("document_name", "applicant_photo");
            const {
              data,
              status: responseStatus,
              message,
            } = await Api.post("documents_upload", formData);
            setProgress(100);
            setTimeout(() => {
              setProgressBarColor("#2cba00");
              setTimeout(() => {
                setShowProgressBar(false);
              }, 1000);
            }, 1000);
            if (responseStatus) {
              setNewProfilePicUrl(data?.data);
              setProfileUrl(data?.data);
              setPicBlur(true);
              //setRenderHeaderComponent(true);
            }
          } catch (error) {
            console.error("Error uploading file:", error);
            // Handle error state
          }
        } else if (file.size > maxSizeInBytes) {
          toast.error("File size should be below 2MB");
        } else if (file.size < minSizeInBytes) {
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

  //   useEffect(() => {
  //     if (renderHeaderComponent) {
  //       setRenderHeaderComponent(false);
  //     }
  //   }, [renderHeaderComponent]);

  return (
    <>
      <h1 className="tw-font-bold tw-text-black tw-text-2xl tw-pl-5 tw-pb-3">
        My Account
      </h1>
      <div className="my-account-cont">
        <h3 className="tw-font-bold">Profile</h3>
        <p className="tw-text-light-grey">
          Upload your photo and personal details here
        </p>

        <p className="tw-mt-5 tw-text-gray-400">PROFILE PICTURE</p>

        <div className="tw-mt-2 tw-flex tw-p-5 tw-border-[#8f8e8e5a] tw-border-[1px] tw-w-fit tw-rounded-xl tw-items-center">
          <img
            src={profileUrl || user_profile_icon}
            alt="main-profile-url"
            className="tw-mr-6 tw-w-24 tw-h-24 tw-rounded-full "
            style={picBlur ? { filter: "blur(1px)" } : {}}
          />
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
              <label
                htmlFor="file-upload"
                className="tw-px-10 tw-py-2 btn btn--black"
              >
                Upload new photo
              </label>
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />

              <button
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
              </button>
            </div>
            <p className="tw-text-[grey]">
              You can upload jpg, png images files <br /> max size of 2mb
            </p>
          </div>
        </div>

        <button
          className="tw-px-10 tw-py-2 tw-bg-black tw-mt-4 tw-text-white tw-rounded-lg"
          onClick={changeUserData}
        >
          Save Changes
        </button>
        <form>
          <div className="tw-flex lg:tw-flex-nowrap tw-flex-wrap tw-mt-4 tw-gap-8">
            {/* <Tooltip
            title={
              "Non-Editable Field, for any change please contact to your Relationship Manager"
            }
            placement="top"
          > */}
            <div className="tw-flex tw-flex-col">
              <label htmlFor="" className="tw-mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="tw-bg-[#DFE1E7] tw-w-72 tw-p-2 tw-rounded-md"
                value={firstName}
              />
            </div>
            {/* </Tooltip> */}
          </div>
          {/* <Tooltip
          title={
            "Non-Editable Field, for any change please contact to your Relationship Manager"
          }
          placement="top-start"
        > */}
          <div className="tw-flex tw-flex-col tw-mt-4 tw-w-72">
            <label htmlFor="">Email address</label>
            <input
              type="email"
              className="tw-bg-[#DFE1E7] tw-p-2 tw-rounded-md"
              value={email}
            />
          </div>
          {/* </Tooltip> */}
        </form>
        <hr className="tw-mt-5 tw-mb-5" />
        <h3 className="tw-font-bold">Password</h3>
        <p className="tw-text-gray-400">
          We recommend that you set a strong password that is at least 8 <br />{" "}
          characters long and includes a mix of letters, numbers, and symbols
        </p>

        <form
          className="tw-flex tw-flex-col tw-mt-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="">Current password</label>
          <div
            style={{
              border: "1px solid grey",
              width: "fit-content",
              padding: "1px 4px ",
              borderRadius: "10px",
            }}
          >
            <input
              type={currentPasswordVisible ? "text" : "password"}
              className="tw-p-2 lg:tw-w-80 tw-rounded-md"
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
              value={currentPassword} 
              style={{ border: "none" }}
            />
            <button
              onClick={() => {
                setCurrentPasswordVisible(!currentPasswordVisible);
              }}
            >
              {/* {currentPasswordVisible ? (
                <img src={eye_icon} alt="Eye icon" />
              ) : (
                <img src={eye_icon} alt="Eye icon" />
              )} */}
               {currentPasswordVisible ? <img src="/images/eye.svg" alt="show password" /> : <img src="/images/eye-off.svg" alt="hide password" />}
            </button>
          </div>
          <label htmlFor="" className="tw-mt-4">
            New password
          </label>
          <div
            style={{
              border: "1px solid grey",
              width: "fit-content",
              padding: "1px 4px ",
              borderRadius: "10px",
            }}
          >
            <input
              type={newPasswordVisible ? "text" : "password"}
              className="tw-p-2  lg:tw-w-80 tw-rounded-md"
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              value={newPassword} 
              style={{ border: "none" }}
            />
            <button
              onClick={() => {
                setNewPasswordVisible(!newPasswordVisible);
              }}
            >
              {/* {newPasswordVisible ? (
                <img src={eye_icon} alt="Eye icon" />
              ) : (
                <img src={eye_icon} alt="Eye icon" />
              )} */}
              {newPasswordVisible ? <img src="/images/eye.svg" alt="show password" /> : <img src="/images/eye-off.svg" alt="hide password" />}
            </button>
          </div>
          <div className="tw-flex tw-mt-2 ">
            {/* {[...Array(passwordStrength)].map((_, index) => (
                        <div key={index} className='tw-w-16 tw-h-1 tw-bg-gray-300 tw-mr-1 tw-rounded-md' style={ passwordStrength < 0 ? {backgroundColor :"grey" } :  { backgroundColor: getPasswordColor() }}></div>
                    ))} */}
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
          <button
            className="tw-bg-black tw-w-fit tw-text-white tw-mt-7 tw-py-2 tw-px-10 tw-rounded-lg"
            onClick={updatePassword}
          >
            Change Password
          </button>
        </form>
        {renderHeaderComponent && <Header></Header>}
      </div>
    </>
  );
};

export default MyAccount;
