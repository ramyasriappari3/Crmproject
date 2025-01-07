import CloseIcon from "@mui/icons-material/Close";
import MobileTabs from "@Components/mobile-tabs/MobileTabs";
import "./ApplicationFormDetailes.scss";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import location_icon from "./../../../../assets/Images/location_icon.svg";
import CircleIcon from "@mui/icons-material/Circle";
import { Button } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Avatar from "./../../../../assets/Images/Avatar.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ReviewSecondPage from "@Components/review-second-page/ReviewSecondpage";
import ReviewThirdPage from "@Components/review-third-page/ReviewThirdPage";
import ReviewFourthPage from "@Components/review-fourth-page/ReviewFourthPage";
import ReviewSevenPage from "@Components/review-seven-page/ReviewSevenPage";
import ReviewEightPage from "@Components/review-eight-page/ReviewEightPage";
import ReviewFivePage from "@Components/review-five-page/ReviewFivePage";
import ReviewSixPage from "@Components/review-six-page/ReviewSixPage";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@Src/app/hooks";
import { checkForFalsyValues, convertNumberToWords, convertToTBD, formatNumberToIndianSystemArea, getDataFromLocalStorage, getDateFormateFromTo } from "@Src/utils/globalUtilities";
import moment from "moment";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import { useParams } from "react-router-dom";
import Api from "../../api/Api";
import { Modal, Typography, Backdrop } from "@mui/material";
import saleable_area_icon from "./../../../../assets/Images/saleable_area_icon.svg";
import unit_type_icon from "./../../../../assets/Images/unit_type_icon.svg";
import car_icon from "./../../../../assets/Images/car_icon.svg";
import tooltip_icon from "./../../../../assets/Images/tooltip_icon.svg";
import facing_icon from "./../../../../assets/Images/facing_icon.svg";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import {getConfigData} from "@Src/config/config";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import userSessionInfo from "../../util/userSessionInfo";
import { formatExactDateTime, formatExactDate, last_modifiedformatExactDateTime } from '@Src/utils/globalUtilities';
import { formatNumberToIndianSystem } from '@Src/utils/globalUtilities';
import ReviewApplicationHooks from "../review-application/ReviewApplicationHooks";
import { shallowEqual } from 'react-redux'; // For shallow comparison
import CustomPDFViewer from "@Components/custom-pdf-viewer/CustomPDFViewer";
import ReviewApplicationPDF from "@Components/react-pdf/ReviewApplicationPDF";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";


interface CustomerDocument {
  document_identifier: string;
  cust_profile_id: string;
  document_name: string;
  document_type: string;
  document_number: string;
  document_url: string;
  created_on: string;
  last_modified_by: string;
  last_modified_at: string;
}

const ReviewApplication = (props: {
  bookingDetailsdata: any;
  reviewApplicationData: any;
  onActiveTab: any;
  applicantDetails: any;
  setIsReviewButton: any;
  parentStateData: any;
  sendDataToParent: any;
}) => {
  const [applicationData, setApplicationData] = useState<any>();
  const saveAndExitSelector: any = useAppSelector(
    (state) => state.global.formSubmitAndExit
  );
  const saveAndNextSelector: any = useAppSelector(
    (state) => state.global.formSubmitAndNext
  );
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userDetails: any = JSON.parse(
    getDataFromLocalStorage("user_details") || "{}"
  );
  const backbuttonSelector: any = useAppSelector(
    (state) => state.global.backButtonClicked
  );
  const [isReviewButton, setIsReviewButton] = useState<any>(false);
  const [reviewApplicationData, setReviewApplicationData] = useState<any>();
  const [jointData, setJointData] = useState<any>();
  const [appData, setAppData] = useState<any>();
  const [costBreakup, setCostBreakup] = useState<any[]>([]);
  const [paymentSchedules, setPaymentDetails] = useState<any[]>([]);
  const [isFaqSidebar, setIsFaqSidebar] = useState(false);
  const [isBookingDetailSidebar, setIsBookingDetailSidebar] = useState(false);
  const [isCloseFormPopUp, setIsCloseFormPopUp] = useState(false);
  const [applicantBankDetails, setApplicantBankDetails] = useState<any[]>([]);
  const [customerUnitDetails, setCustomerUnitDetails] = useState<any>();
  const [mainApplicantDocuments, setMainApplicantDocuments] = useState<any>([]);
  const [jointApplicantDocuments, setJointApplicantDocuments] = useState<any>();
  const { customerId } = useParams();
  const [open, setOpen] = React.useState(false);
  const [isKycChecked, setIsKycChecked] = useState(false);
  const [isBookingFormChecked, setIsBookingFormChecked] = useState(false);
  const [redraftopen, setReDraftOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [panDocumentUrl, setPanDocumentUrl] = useState<any[]>([]);
  const [aadharDocumentUrl, setAadharDocumentUrl] = useState<any[]>([]);
  const [applicantPhotoUrl, setApplicantUrl] = useState<any[]>([]);
  const [approvedPopUp, setApprovedPopUp] = useState(false);
  const [modelDocumentNumber, setModelDocumentNumber] = useState("");
  const [modelDocumentType, setModelDocumentType] = useState("");
  const [redraftErrorMessage, setRedraftErrorMessage] = useState("");
  const [applicantInfoChecked, setApplicantInfoChecked] = useState(false);
  const [documentUploadedChecked, setDocumentUploadedChecked] = useState(false);
  const [applicantComment, setApplicantComment] = useState("");
  const [documentComment, setDocumentComment] = useState("");
  const userInfo = userSessionInfo.logUserInfo();

  const handleReDraftCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    if (name === "Application Form") {
      setApplicantInfoChecked(checked);
    } else if (name === "Document Upload") {
      setDocumentUploadedChecked(checked);
    }
  };

  const isEditable = (checked: any) =>
    checked && customerUnitDetails?.application_status === "Submitted";

  const handleDocumentViewClick = (
    imageUrl: string,
    documentNumber: string,
    documentType: string
  ) => {
    setModalImage(imageUrl);
    setIsDocumentModalOpen(true);
    setModelDocumentNumber(documentNumber);
    setModelDocumentType(documentType);
  };

  const handleViewDocumentClose = () => {
    setIsDocumentModalOpen(false);
    setModalImage("");
    setModelDocumentNumber("");
    setModelDocumentType("");
    setIsKycChecked(false); 
    setIsBookingFormChecked(false)
  };

  const VerifyhandleClose = async (application_status: string) => {
    // setOpen(true);
    const userInfo = userSessionInfo.logUserInfo();

    let application_success_obj = {
      cust_unit_id: customerUnitDetails?.cust_unit_id,
      cust_profile_id: appData?.cust_profile_id,
      application_status: application_status,
      last_modified_by: userInfo?.rm_user_name,
    };
    // here we need to call Api for Application Status is Approved.
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("crm_verify_application", application_success_obj);
    dispatch(showSpinner());
    if (responseStatus) {
      toast.success(message);
      setOpen(false);
      setApprovedPopUp(true);
      // navigate('/crm/completeverification');
    } else {
      toast.success(message);
      setOpen(true);
      setApprovedPopUp(false);
    }
    dispatch(hideSpinner());
  };

  useEffect(() => {
    if (!applicantInfoChecked) {
      setApplicantComment("");
    } else if (!documentUploadedChecked) {
      setDocumentComment("");
    }
  }, []);

  const handleSubmit = async () => {
    let application_redraft_reasons = "";
    if (applicantInfoChecked && documentUploadedChecked) {
      application_redraft_reasons = "both";
    } else if (applicantInfoChecked) {
      application_redraft_reasons = "Application Form";
    } else if (documentUploadedChecked) {
      application_redraft_reasons = "Document Upload";
    }
    const userInfo = userSessionInfo.logUserInfo();
    const reDraftApiPayload = {
      cust_unit_id: customerUnitDetails?.cust_unit_id,
      cust_profile_id: appData?.cust_profile_id,
      application_status: "Re-Draft",
      application_redraft_reasons,
      redraft_application_comments: applicantComment,
      redraft_document_comments: documentComment,
      last_modified_by: userInfo?.rm_user_name,
    };

    if (
      (!applicantInfoChecked && !documentUploadedChecked) ||
      (applicantInfoChecked && applicantComment.trim() === "") ||
      (documentUploadedChecked && documentComment.trim() === "")
    ) {
      setRedraftErrorMessage(
        "Please select at least one checkbox and provide the comments"
      );
      return;
    }

    setRedraftErrorMessage("");

    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("crm_verify_application", reDraftApiPayload);
    dispatch(showSpinner());
    if (responseStatus) {
      toast.success(message);
      setReDraftOpen(false);
      setOpen(false);
      setApplicantInfoChecked(false) ;
      setDocumentUploadedChecked(false)
    } else {
      toast.error(message);
      setReDraftOpen(true);
      setRedraftErrorMessage(data);
    }
    dispatch(hideSpinner());
  };

  const getReviewApplicationData = async () => {
    try {
      const {
        data,
        status: responseStatus,
        message,
      }: any = await Api.get("get_crm_review_application", {
        cust_profile_id: customerId,
      });
      dispatch(showSpinner());
      if (responseStatus) {
        let joint = data?.customerApplicantDetails?.jointCustomerProfileDetails;
        let mainApplicantDocuments =
          data?.customerApplicantDetails?.customerProfileDocumentsDetails;
        let jointApplicantDocuments =
          data?.customerApplicantDetails?.jointHolderDocumentsDetails;
        let user = data?.customerApplicantDetails?.customerProfileDetails;
        let applicantData = data?.customerUnitsDetails[0];
        let calculationData =
          data?.customerUnitsDetails[0]?.calculationFields || [];
        let payment = data?.customerUnitsDetails[0]?.unit_milestones || [];
        let sortedPaymentMilestonesData = payment.sort(
          (a: any, b: any) => a.milestone_sequence - b.milestone_sequence
        );
        let bankDetails =
          data?.customerApplicantDetails?.customerBankDetails || [];
        let customerUnitDetails = data?.customerUnitsDetails[0];
        setMainApplicantDocuments(mainApplicantDocuments);
        setJointApplicantDocuments(jointApplicantDocuments);
        setJointData(joint);
        setAppData(user);
        setApplicantBankDetails(bankDetails);
        setReviewApplicationData(data);
        setApplicationData(applicantData);
        setCostBreakup(calculationData);
        setPaymentDetails(sortedPaymentMilestonesData);
        setCustomerUnitDetails(customerUnitDetails);
        const panDocumentsArray = mainApplicantDocuments?.filter(
          (doc: CustomerDocument) => doc.document_name === "PAN"
        );
        const aadharDocumentsArray = mainApplicantDocuments?.filter(
          (doc: CustomerDocument) => doc.document_name === "Aadhaar_number"
        );
        const applicantPhoto = mainApplicantDocuments?.filter(
          (doc: CustomerDocument) => doc.document_name === "applicant_photo"
        );
        setPanDocumentUrl(panDocumentsArray);
        setAadharDocumentUrl(aadharDocumentsArray);
        setApplicantUrl(applicantPhoto);
        if (
          data?.customerUnitsDetails[0]?.application_redraft_reasons == "both"
        ) {
          setApplicantInfoChecked(true);
          setDocumentUploadedChecked(true);
          setApplicantComment(
            data?.customerUnitsDetails[0]?.redraft_application_comments
          );
          setDocumentComment(
            data?.customerUnitsDetails[0]?.redraft_document_comments
          );
        } else if (
          data?.customerUnitsDetails[0]?.application_redraft_reasons ==
          "Application Form"
        ) {
          setApplicantInfoChecked(true);
          setDocumentUploadedChecked(false);
          setApplicantComment(
            data?.customerUnitsDetails[0]?.redraft_application_comments
          );
          setDocumentComment("");
        } else if (
          data?.customerUnitsDetails[0]?.application_redraft_reasons ==
          "Document Upload"
        ) {
          setApplicantInfoChecked(false);
          setDocumentUploadedChecked(true);
          setApplicantComment("");
          setDocumentComment(
            data?.customerUnitsDetails[0]?.redraft_document_comments
          );
        }
      }
      dispatch(hideSpinner());
      //dispatch(hideSpinner());
    } catch (error) {
      //console.log(error)
    }
  };

  useEffect(() => {
    getReviewApplicationData();
  }, []);

  function getInitials(fullName: string) {
    // Split the name by spaces
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

  const handleBackToGrid = () => {
    navigate("/crm/customerslist");
  };

  const handleVerificationClick = (cust_profile_id: string) => {
    // navigate(`/crm/applicationformdetails/${cust_profile_id}`);
    setOpen(true);
  };

  const handleReDraftClick = (cust_profile_id: string) => {
    // setOpen(true);
    setReDraftOpen(true);
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setCheckboxState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setCheckboxState(event.target.checked);
  };

  const isCompleteVerificationEnabled = isKycChecked && isBookingFormChecked;
  const handleClose = (event: any, reason: any) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      setOpen(false);
    }
    setIsKycChecked(false)
    setIsBookingFormChecked(false)
  };
  function formatDate(currentDate: any) {


    // Format the date as DD/MM/YYYY
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();

    // Combine the parts into the desired format
    const Date = `${day}/${month}/${year}`;
    return Date
  }

  return (
    <>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={4}>
            <Grid item xs={8}>
              <div className="tw-flex tw-items-center tw-mb-3 tw-mt-8">
                <Button
                  onClick={() => handleBackToGrid()}
                  style={{ color: "black" }}
                >
                  <ArrowBackIcon color="inherit" />
                </Button>

                <h2 className="tw-font-bold tw-text-black">
                  Onboard Customers
                </h2>
              </div>
              <ReviewAppPDFComp />
            </Grid>
            <Grid item xs={4}>
              <div
                className=""
                style={{ background: "white", padding: "2.5rem", height: 'auto', marginLeft: '15px', position: 'fixed' }}
              >
                <div>
                  <p className="tw-text-black">
                    {customerUnitDetails?.unit_type_id}
                  </p>
                  <p className="tw-font-bold tw-text-black">
                    {customerUnitDetails?.project_name}, Tower{" "}
                    {parseInt(customerUnitDetails?.tower_code, 10)?.toString()},
                    {parseInt(customerUnitDetails?.floor_no, 10)?.toString()}
                    {customerUnitDetails?.unit_no}
                  </p>
                  <div className="tw-flex tw-justify-between">
                    <p className="lite tw-flex tw-gap-1  tw-w-full">
                      <img src={location_icon} alt="loaction_icon" className="tw-mr-2"/> {customerUnitDetails?.project_city},{" "}
                      {customerUnitDetails?.project_state}
                    </p>
                  </div>
                </div>
                <div
                  className="tw-flex tw-justify-between tw-mt-4 tw-mr-2"
                  style={{ borderTop: "1px solid #DFE1E7" }}
                >
                  <div className="tw-text-sm">
                    <p className="tw-mt-4">Booking Number</p>
                    <p className="tw-text-black">
                      {customerUnitDetails?.booking_no}
                    </p>
                  </div>
                </div>
                <div className="tw-mt-4 tw-text-sm">
                  <p className="tw-mb-2">Applicant name</p>
                  <div className="tw-flex" style={{ wordBreak: "break-word" }}>
                    {applicantPhotoUrl && applicantPhotoUrl.length > 0 ? (
                      <Stack direction="row" spacing={1}>
                        <Avatar
                          className="tw-mt-1"
                          alt="Applicant Photo"
                          src={applicantPhotoUrl[0].document_url}
                        />
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={2}>
                        <Avatar className="tw-mt-1">
                          {getInitials(customerUnitDetails?.full_name || "")}
                        </Avatar>
                      </Stack>
                    )}

                    <div className="tw-ml-2">
                      <p className="tw-text-black tw-font-bold">
                        {" "}
                        {customerUnitDetails?.full_name}
                      </p>
                      <p className="lite">{appData?.email_id}</p>
                    </div>
                  </div>
                  <p className="tw-mt-5 tw-text-sm">Application status</p>
                  <CircleIcon
                    className={
                      customerUnitDetails?.application_status === "Submitted"
                        ? "button_submitted"
                        : customerUnitDetails?.application_status === "Re-Draft"
                        ? "button_redraft"
                        : "Button_NotSubmitted"
                    }
                  />{" "}
                  <span className="tw-text-sm">
                    {customerUnitDetails?.application_status}
                  </span>
                  <p className="tw-mt-4">Date created</p>
                  <p className="tw-text-black">
                    {last_modifiedformatExactDateTime(
                      customerUnitDetails?.created_on
                    )}
                  </p>
                  <p className="tw-mt-4">Last updated</p>
                  <p className="tw-text-black">{last_modifiedformatExactDateTime(customerUnitDetails?.last_modified_at)}</p>
                  <p className="tw-mt-7" >Last updated by</p>
                  <p className="tw-text-black tw-mb-12 tw-text-sm">{userInfo?.rm_user_name == customerUnitDetails?.last_modified_by ? customerUnitDetails?.crm_executive_code : customerUnitDetails?.full_name}</p>
                </div>
                <div className="tw-flex tw-justify-between tw-font-bold" style={{ fontSize: '14px', marginTop: '100px' }}>
                  {/* <Tooltip
                    title={customerUnitDetails?.application_status !== "Submitted" ? "You can verify the application only when the application status is 'Submitted'" : ""}
                    placement="top"
                  >
                    <span> */}
                  <button
                    style={{
                      backgroundColor: "#000000",
                      color: "#FFFFFF",
                      border: "1px solid #000000",
                      borderRadius: "5px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      width: '178px'
                      // cursor: customerUnitDetails?.application_status === "Submitted" ? "" : "not-allowed",
                    }}
                    // disabled={customerUnitDetails?.application_status !== "Submitted"}
                    onClick={() =>
                      handleVerificationClick(appData?.cust_profile_id)
                    }
                  >
                    Verify Application
                  </button>
                  {/* </span>
                  </Tooltip> */}
                  {/* <Tooltip 
                  title={customerUnitDetails?.application_status !== 'Submitted' ? "You can request a redraft only when the application status is 'Submitted'" : ""}
                  placement="top"
                  > 
                  <span> */}
                  <button
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#000000",
                      border: "1px solid #000000",
                      borderRadius: "5px",
                      padding: '0.5rem',
                      cursor: 'pointer',
                      width: '130px',
                      marginRight: '30px',
                      marginLeft: '15px'
                      // cursor: customerUnitDetails?.application_status === 'Submitted' ?  "pointer" : "not-allowed" ,
                    }}
                    // disabled={customerUnitDetails?.application_status !== 'Submitted'}
                    onClick={() => handleReDraftClick(appData?.cust_profile_id)}
                  >
                    Request Redraft
                  </button>
                  {/* </span>
                  </Tooltip> */}
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%", // Reduced width
            maxWidth: "500px", // Reduced maxWidth
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2, // Reduced padding
            borderRadius: "8px",
            overflow: "auto",
            maxHeight: "99%",
          }}
        >
          <div className="tw-flex tw-justify-between tw-mb-4">
            <h3 className="tw-font-bold tw-text-black">
              Verify the application
            </h3>
            <img
              src="/images/cross-icon.svg"
              className="tw-cursor-pointer"
              alt="Close"
              onClick={() =>{ setOpen(false) ;setIsKycChecked(false); setIsBookingFormChecked(false)}}
            />
          </div>
          <div style={{ textAlign: "left" }}>
            <p className="tw-text-black tw-text-sm">
              {customerUnitDetails?.unit_type_id}
            </p>
            <p className="tw-font-bold tw-text-black tw-text-sm">
              {customerUnitDetails?.project_name}, Tower{" "}
              {parseInt(customerUnitDetails?.tower_code, 10)?.toString()},
              {parseInt(customerUnitDetails?.floor_no, 10)?.toString()}
              {customerUnitDetails?.unit_no}
            </p>
            <div className="tw-flex tw-justify-between">
              <p className="lite tw-flex tw-justify-between">
                <img
                  src={location_icon}
                  alt="loaction_icon"
                  className="tw-mr-2"
                />{" "}
                {customerUnitDetails?.project_city},{" "}
                {customerUnitDetails?.project_state}
              </p>
            </div>
          </div>
          <div className="tw-flex tw-justify-between tw-my-4 tw-text-sm">
          <Tooltip
                title={
                  <div className="tw-flex tw-flex-col tw-h-auto tw-w-auto tw-z-50">
                    {customerUnitDetails?.carpet_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2">
                        <span>Carpet Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(customerUnitDetails?.carpet_area)} SFT
                        </span>
                      </div>
                    )}
                    {customerUnitDetails?.balcony_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2">
                        <span>Balcony Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(customerUnitDetails?.balcony_area)} SFT
                        </span>
                      </div>
                    )}
                    {customerUnitDetails?.common_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2">
                        <span>Common Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(customerUnitDetails?.common_area)} SFT
                        </span>
                      </div>
                    )}
                    {customerUnitDetails?.uds_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2">
                        <span>UDS Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(customerUnitDetails?.uds_area)} SFT
                        </span>
                      </div>
                    )}
                    {customerUnitDetails?.saleable_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54]">
                        <span>Total Saleable Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(customerUnitDetails?.saleable_area)} SFT
                        </span>
                      </div>
                    )}
                  </div>
                }
                classes={{ tooltip: "custom-tooltip-color" }}
                enterTouchDelay={0}
                leaveTouchDelay={5000}
                arrow
                placement="top"
              >
               <div className="tw-mr-4">
              <p className="lite tw-flex tw-justify-between">
                <img src={saleable_area_icon} alt="saleable icon" className="tw-mr-2" /> Saleable Area
                <img src={tooltip_icon} alt="tooltip_icon" className="tw-ml-1" /></p>
              <p className="tw-font-bold tw-text-black tw-mt-2 tw-ml-7">
                {customerUnitDetails?.saleable_area} SFT
              </p>
            </div>
              </Tooltip>
            {/* <div className="tw-mr-4">
              <p className="lite tw-flex tw-justify-between">
                <img src={saleable_area_icon} alt="saleable icon" className="tw-mr-2" /> Saleable Area{" "}
                <img src={tooltip_icon} alt="tooltip_icon" className="tw-ml-1" /></p>
              <p className="tw-font-bold tw-text-black tw-mt-2 tw-ml-7">
                {customerUnitDetails?.saleable_area} SFT
              </p>
            </div> */}
            <div className="tw-mr-4">
              <p className="lite tw-flex tw-justify-between">
                <img src={unit_type_icon} alt="unit icon" className="tw-mr-2 tw-w-5 tw-h-5" /> Unit Type
              </p>
              <p className="tw-font-bold tw-text-black tw-mt-2 tw-ml-7">
                {customerUnitDetails?.bedrooms}
              </p>
            </div>
            <div>
              <p className="lite tw-flex tw-justify-between">
                <img src={car_icon} alt="car icon" className="tw-mr-2" /> Car Parking
              </p>
              <p className="tw-font-bold tw-text-black tw-mt-2 tw-ml-7">
                {customerUnitDetails?.no_of_parkings}
                </p>
            </div>
          </div>
          <div className="tw-flex tw-justify-between">
            <p className="lite tw-flex tw-justify-between">
              <img src={facing_icon} alt="facing_icon" className="tw-mr-2" /> Facing
            </p>
          </div>
          <p className="tw-font-bold tw-text-black tw-ml-8 tw-mb-4 tw-text-sm" >
            {(customerUnitDetails?.facing || "N/A")?.split(" ")[0]}
          </p>
          <p className='tw-mb-5' style={{ borderBottom: '1px solid #DFE1E7' }}></p>
          <FormControlLabel
            control={
              <Tooltip
                title={
                  customerUnitDetails?.application_status !== "Submitted"
                    ? "You can do this only when the application status is 'Submitted'"
                    : ""
                }
              >
                <span>
                  <Checkbox
                    checked={isKycChecked}
                    onChange={(e) => handleCheckboxChange(e, setIsKycChecked)}
                    disabled={
                      customerUnitDetails?.application_status == "Submitted"
                        ? false
                        : true
                    }
                  />
                </span>
              </Tooltip>
            }
            label={
              <span
                style={{ fontWeight: "bold", color: "black" }}
                className="tw-text-sm"
              >
               Kyc Verification
              </span>
            }
          />
          <p className="tw-ml-7 tw-text-black tw-text-sm">
          Kyc Verification has been successfully completed
          </p>
          <Box
            sx={{
              backgroundColor: "#F3F5F6",
              borderRadius: "1rem",
              padding: "1rem",
              mt: 2,
            }}
          >
            <p className="tw-font-bold tw-text-black tw-text-sm">
              {appData?.full_name}
            </p>
            <div className="tw-flex tw-justify-between tw-mt-2 tw-text-sm">
              <p className="tw-text-black">PAN Card</p>
              <p className="tw-text-black tw-ml-5">{appData?.pan_card}</p>
              {panDocumentUrl?.length > 0 ? (
                panDocumentUrl.map((doc: CustomerDocument) => (
                  <p
                    key={doc.document_identifier}
                    className="tw-text-blue-500 tw-cursor-pointer"
                    onClick={() =>
                      handleDocumentViewClick(
                        doc.document_url,
                        appData?.pan_card,
                        "PAN DETAILS"
                      )
                    }
                  >
                    View
                  </p>
                ))
              ) : (
                <p className="tw-text-blue-500 tw-cursor-pointer">
                  No Document
                </p>
              )}
            </div>
            <div className="tw-flex tw-justify-between tw-mt-2 tw-text-sm">
              <p className=" tw-text-black">Aadhaar Card</p>
              <p className="tw-text-black">{appData?.aadhaar_number}</p>
              {aadharDocumentUrl?.length > 0 ? (
                aadharDocumentUrl?.map((doc: CustomerDocument) => (
                  <p
                    key={doc.document_identifier}
                    className="tw-text-blue-500 tw-cursor-pointer"
                    onClick={() =>
                      handleDocumentViewClick(
                        doc.document_url,
                        appData?.aadhaar_number,
                        "AADHAR NUMBER"
                      )
                    }
                  >
                    View
                  </p>
                ))
              ) : (
                <p className="tw-text-blue-500 tw-cursor-pointer">
                  No Document
                </p>
              )}
            </div>

            <Dialog
              open={isDocumentModalOpen}
              onClose={handleViewDocumentClose}
              maxWidth="sm"
              fullWidth
            >
              <DialogContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {modalImage.endsWith(".pdf") ? (
                  <iframe
                    src={modalImage}
                    style={{ width: "100%", height: "80vh" }}
                    frameBorder="0"
                    title="PDF Viewer"
                  />
                ) : (
                  <img
                    src={modalImage}
                    alt="Document"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <p style={{ marginRight: "7rem" }}>
                  {modelDocumentType}:{" "}
                  <span className="tw-font-bold">{modelDocumentNumber}</span>
                </p>
                <Button onClick={handleViewDocumentClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </Box>
          <FormControlLabel
            control={
              <Tooltip
                title={
                  customerUnitDetails?.application_status !== "Submitted"
                    ? "You can do this only when the application status is 'Submitted'"
                    : ""
                }
              >
                <span>
                  <Checkbox
                    checked={isBookingFormChecked}
                    onChange={(e) =>
                      handleCheckboxChange(e, setIsBookingFormChecked)
                    }
                    disabled={
                      customerUnitDetails?.application_status == "Submitted"
                        ? false
                        : true
                    }
                  />
                </span>
              </Tooltip>
            }
            label={
              <span
                style={{ fontWeight: "bold", color: "black" }}
                className="tw-text-sm"
              >
                Booking Form
              </span>
            }
          />
          <p className="tw-ml-8 tw-text-black tw-text-sm">
            Booking form has been successfully completed
          </p>
          <Box
            sx={{
              backgroundColor: "#F3F5F6",
              borderRadius: "1rem",
              padding: "1rem",
              mt: 2,
            }}
          >
            <p className="tw-font-bold tw-ml-2 tw-text-black tw-text-sm">
              Booking form
            </p>
            <div className="tw-flex tw-justify-between tw-mt-2">
              <p className="tw-ml-2 tw-text-black tw-text-sm">Submitted on</p>
              <p className="tw-text-black tw-text-sm">
                {last_modifiedformatExactDateTime(
                  customerUnitDetails?.last_modified_at
                )}
              </p>
            </div>
          </Box>
          <div
            className="tw-mt-4 tw-flex tw-justify-end"
            style={{ marginTop: "5rem", marginRight: "3rem" }}
          >
            <Button
              style={{
                backgroundColor: isCompleteVerificationEnabled ? "#000000" : undefined,
                color: isCompleteVerificationEnabled ? "#FFFFFF" : undefined,
                border: isCompleteVerificationEnabled ? "none" : undefined,
                borderRadius: "5px",
                cursor: isCompleteVerificationEnabled ? "pointer" : undefined,
                marginRight: "1rem", // This remains constant
                textTransform: "none", // Ensures consistent text casing
              }}
              onClick={() => VerifyhandleClose("Approved")}
              disabled={!isCompleteVerificationEnabled}
            >
              <p style={{ textTransform: "none", fontSize: "0.875rem" }}>
                Complete Verification
              </p>
            </Button>
            <Button
              style={{
                backgroundColor: "#FFFFFF",
                color: "#000000",
                border: "1px solid #000000",
                borderRadius: "5px",
                marginLeft: "1.5rem",
                cursor: "pointer",
                textTransform: "none", // Ensures consistent text casing
              }}
              onClick={() => handleReDraftClick(appData?.cust_profile_id)}
            >
              <p style={{ textTransform: "none", fontSize: "0.875rem" }}>
                Request as Redraft
              </p>
            </Button>
          </div>


        </Box>
      </Modal>

      <Dialog
        open={redraftopen}
        onClose={(event: any, reason: any) => {
          if (reason === "backdropClick") {
            setReDraftOpen(false);
            setApplicantInfoChecked(false) ; setDocumentUploadedChecked(false) ;
            setApplicantInfoChecked(false);setDocumentUploadedChecked(false)
          }
        }}
      >
        <div className="tw-flex tw-justify-between tw-m-4">
          <p className="text-pri-all tw-text-xl tw-font-bold">
            Request Redraft
          </p>
          <img
            src="/images/cross-icon.svg"
            className="tw-cursor-pointer"
            onClick={() => {setReDraftOpen(false); setApplicantInfoChecked(false) ; setDocumentUploadedChecked(false) ;setApplicantInfoChecked(false);setDocumentUploadedChecked(false)}}
          />
        </div>
        <DialogContent>
          <p className="text-sm mb-4 tw-text-sm" style={{ color: "#656C7B" }}>
            The applicant will be able to see the message during their next{" "}
            <br></br>login.
          </p>

          <p
            className="text-sm mb-4 tw-mt-4 tw-text-sm"
            style={{ color: "#656C7B" }}
          >
            Select the application sections needing changes.
          </p>

          {redraftErrorMessage?.length > 0 && (
            <div className="tw-text-red-500 tw-my-1">{redraftErrorMessage}</div>
          )}
          <div className="flex gap-4 mb-10">
            <FormControlLabel
              control={
                <Tooltip
                  title={
                    customerUnitDetails?.application_status !== "Submitted"
                      ? "You can do this only when the application status is 'Submitted'"
                      : ""
                  }
                >
                  <span>
                    <Checkbox
                      checked={applicantInfoChecked}
                      onChange={handleReDraftCheckboxChange}
                      name="Application Form"
                      disabled={
                        customerUnitDetails?.application_status !== "Submitted"
                      }
                    />
                  </span>
                </Tooltip>
              }
              label={
                <Typography
                  variant="body1"
                  fontWeight={applicantInfoChecked ? "bold" : "normal"}
                >
                  Applicant Information
                </Typography>
              }
            />
          </div>
          <div>
            <p
              className="tw-mb-2"
              style={{
                color: isEditable(applicantInfoChecked) ? "#656C7B" : "#AEB4C1",
              }}
            >
              Write a message
            </p>
            <TextField
              sx={{
                mt: 3,
                backgroundColor: isEditable(applicantInfoChecked)
                  ? "white"
                  : "#DFE1E7",
              }}
              className="message"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              disabled={!isEditable(applicantInfoChecked)}
              value={applicantInfoChecked ? applicantComment : ""}
              onChange={(e) =>
                applicantInfoChecked ? setApplicantComment(e.target.value) : ""
              }
            />
          </div>
          <div className="flex gap-4 mb-7 tw-mt-3">
            <FormControlLabel
              control={
                <Tooltip
                  title={
                    customerUnitDetails?.application_status !== "Submitted"
                      ? "You can do this only when the application status is 'Submitted'"
                      : ""
                  }
                >
                  <span>
                    <Checkbox
                      checked={documentUploadedChecked}
                      onChange={handleReDraftCheckboxChange}
                      name="Document Upload"
                      disabled={
                        customerUnitDetails?.application_status !== "Submitted"
                      }
                    />
                  </span>
                </Tooltip>
              }
              label={
                <Typography
                  variant="body1"
                  fontWeight={documentUploadedChecked ? "bold" : "normal"}
                >
                  Documents Uploaded
                </Typography>
              }
            />
          </div>
          <div>
            <p
              className="tw-mb-2 tw-mt-3"
              style={{
                color: isEditable(documentUploadedChecked)
                  ? "#656C7B"
                  : "#AEB4C1",
              }}
            >
              {" "}
              Write a message
            </p>
            <TextField
              sx={{
                mt: 3,
                backgroundColor: isEditable(documentUploadedChecked)
                  ? "white"
                  : "#DFE1E7",
              }}
              className="message"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              disabled={!isEditable(documentUploadedChecked)}
              value={documentUploadedChecked ? documentComment : ""}
              onChange={(e) =>
                documentUploadedChecked
                  ? setDocumentComment(e.target.value)
                  : ""
              }
            />
          </div>
          <div>
            <DialogActions>
              <Button
                variant="outlined"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  border: "1px solid #000000",
                  borderRadius: "7px",
                  marginLeft: "1.5rem",
                  cursor: "pointer",
                  textTransform: "none",
                  width: "5rem",
                  marginTop: "1rem",
                }}
                onClick={() => {setReDraftOpen(false);setApplicantInfoChecked(false);setDocumentUploadedChecked(false)}}
              >
                Close
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "7px",
                  cursor: "pointer",
                  marginRight: "1rem",
                  textTransform: "none",
                  width: "6rem",
                  marginTop: "1rem",
                }}
                onClick={handleSubmit}
                disabled={
                  customerUnitDetails?.application_status == "Submitted"
                    ? false
                    : true
                }
              >
                Submit
              </Button>
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <Dialog
          open={approvedPopUp}
          onClose={() => {
            setApprovedPopUp(false);
          }}
        >
          <div className="tw-flex tw-justify-between tw-m-6">
            <h3 className="tw-font-bold">Verify the application</h3>
            <img
              src="/images/cross-icon.svg"
              className="tw-cursor-pointer"
              onClick={() => setApprovedPopUp(false)}
            />
          </div>
          <Box
            sx={{
              padding: "50px",
              borderRadius: "8px",
              textAlign: "center",
              height: "935px",
            }}
          >
            <CheckCircleIcon style={{ color: "#00BD35", fontSize: 60 }} />
            <p className="tw-font-bold">
              Application verification has been completed
            </p>
            <Typography variant="body2" gutterBottom>
              The booking and customer details can be viewed under manager
              <p>customers tab. </p>
            </Typography>

            <Button
              variant="outlined"
              sx={{
                color: "black",
                borderColor: "black",
                marginTop: "2rem",
                borderRadius: "0.5rem",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/crm/customerslist")}
            >
             <p style={{textTransform : 'none'}}> Done</p>
            </Button>
          </Box>
        </Dialog>
      </div>
    </>
  );
};

export default ReviewApplication;




const ReviewAppPDFComp = React.memo(() => {
  const {
    reviewApplicantDetails,
    customerUnitDetails,
    getParkingCounts,
    getSortingmilestone,
  } = ReviewApplicationHooks();

  const bookingDetailsInfo = reviewApplicantDetails?.customerApplicantDetails?.paymentDetails;
  const mainApplicantDocuments = reviewApplicantDetails?.customerApplicantDetails?.customerProfileDocumentsDetails; // Add this line to get the main applicant documents
  const jointApplicantDocuments = reviewApplicantDetails?.customerApplicantDetails?.jointHolderDocumentsDetails; // Joint documents if needed

  const memoizedCustomerUnitDetails = useMemo(
    () => ({ ...customerUnitDetails }),
    [JSON.stringify(customerUnitDetails)] // Deep comparison using JSON.stringify
  );

  const memoizedBookingDetailsInfo = useMemo(
    () => ({ ...bookingDetailsInfo }),
    [JSON.stringify(bookingDetailsInfo)] // Deep comparison using JSON.stringify
  );

  const memoizedPdfDocument = useMemo(() => {
    const bookingAmountPaid = checkForFalsyValues(Number(memoizedBookingDetailsInfo?.booking_amount_paid));
    const bookingAmountPaidInWords = bookingAmountPaid
      ? convertNumberToWords(bookingAmountPaid)?.toUpperCase()
      : "N/A";

    return (
      <ReviewApplicationPDF
        agreementLetter={{
          projectLogo: checkForFalsyValues(memoizedCustomerUnitDetails?.project_banner),
          companyLogo: checkForFalsyValues(memoizedCustomerUnitDetails?.project_logo),
          apartmentNumber: checkForFalsyValues(memoizedCustomerUnitDetails?.tower_code?.replace(/^0+/, "")) + '-' + checkForFalsyValues(parseInt(memoizedCustomerUnitDetails?.floor_no)) + checkForFalsyValues(memoizedCustomerUnitDetails?.unit_no),
          customerNumber: checkForFalsyValues(memoizedCustomerUnitDetails?.customer_number?.replace(/^0+/, "")),
          bookingNumber: checkForFalsyValues(memoizedCustomerUnitDetails?.booking_no?.replace(/^0+/, "")),
          agreementDate: getDateFormateFromTo(memoizedCustomerUnitDetails?.agreement_date),
          saleDeedDate: getDateFormateFromTo(memoizedCustomerUnitDetails?.sale_deed_date),
          salesRepresentative: checkForFalsyValues(memoizedCustomerUnitDetails?.sales_executive_name) || "N/A",
          crmRepresentative: checkForFalsyValues(memoizedCustomerUnitDetails?.crm_executive_name),
          place: 'Hyderabad',
          date: getDateFormateFromTo("currentdate"),
          companyName: checkForFalsyValues(memoizedCustomerUnitDetails?.company_name),
          companyAddress: checkForFalsyValues(memoizedCustomerUnitDetails?.company_address),
          companyCityAndPin: checkForFalsyValues(memoizedCustomerUnitDetails?.company_city) + '-' + checkForFalsyValues(memoizedCustomerUnitDetails?.company_postal_code)?.split("")?.slice(4)?.join(""),
          projectName: checkForFalsyValues(memoizedCustomerUnitDetails?.project_name),
          floorNo: checkForFalsyValues((parseInt(memoizedCustomerUnitDetails?.floor_no)?.toString())),
          unitNo: checkForFalsyValues(memoizedCustomerUnitDetails?.unit_no),
          tower: checkForFalsyValues(memoizedCustomerUnitDetails?.tower_code?.replace(/^0+/, "")),
          scaleableArea: checkForFalsyValues(memoizedCustomerUnitDetails?.saleable_area),
          bookingTransactionId: memoizedBookingDetailsInfo?.booking_transaction_id,
          bookingDate: memoizedBookingDetailsInfo?.booking_date,
          bookingBankName: memoizedBookingDetailsInfo?.booking_bank_name,
          bookingBranchName: memoizedBookingDetailsInfo?.booking_bank_branch_name,
          bookingAmountPaid: formatNumberToIndianSystem(bookingAmountPaid),
          bookingAmountPaidInWords: bookingAmountPaidInWords,
          applicantPhoto: mainApplicantDocuments?.find((doc: any) => doc?.document_name === 'applicant_photo')?.document_url,
          jointApplicantsPhotos: jointApplicantDocuments
            ?.filter((doc: any) => doc?.document_name === 'applicant_photo')
            ?.map((data: any) => (data?.document_url)),
          carpetArea: formatNumberToIndianSystemArea(memoizedCustomerUnitDetails?.carpet_area),
          balconyArea: formatNumberToIndianSystemArea(memoizedCustomerUnitDetails?.balcony_area),
          commonArea: formatNumberToIndianSystemArea(memoizedCustomerUnitDetails?.common_area),
          carParkingSlots: convertToTBD(memoizedCustomerUnitDetails?.car_parking_slots),
          noOfParking: convertToTBD(getParkingCounts(memoizedCustomerUnitDetails?.car_parking_slots)),
          basementLevel: convertToTBD(memoizedCustomerUnitDetails?.basement_level),
        }}
        customerUnitDetails={reviewApplicantDetails?.customerUnitsDetails?.[0]}
        applicantDetails={reviewApplicantDetails?.customerApplicantDetails?.customerProfileDetails}
        jointApplicantDetails={reviewApplicantDetails?.customerApplicantDetails?.jointCustomerProfileDetails}
        applicantBankDetails={reviewApplicantDetails?.customerApplicantDetails?.customerBankDetails}
        interestedInHomeLoans={reviewApplicantDetails?.customerApplicantDetails?.customerBankDetails?.interested_in_home_loans}
        milestoneData={getSortingmilestone(reviewApplicantDetails?.customerUnitsDetails)}
      />
    );
  }, [
    memoizedCustomerUnitDetails,
    memoizedBookingDetailsInfo,
    reviewApplicantDetails,
    getParkingCounts,
    getSortingmilestone,
    mainApplicantDocuments, // Added dependency for documents
    jointApplicantDocuments,
  ]);

  return (
    <>
      {memoizedCustomerUnitDetails && memoizedBookingDetailsInfo && mainApplicantDocuments && jointApplicantDocuments && (
        <div style={{ width: "100%", height: "90vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CustomPDFViewer type="view" buttonElement='' fileName='Review Application' onClose={() => {}} showCloseButton={false}>
            {memoizedPdfDocument}
          </CustomPDFViewer>
        </div>
      )}
    </>
  );
});
