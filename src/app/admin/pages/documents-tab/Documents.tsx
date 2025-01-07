import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import delete_icon from "./../../../../assets/Images/delete_icon.svg";
import view_icon from "./../../../../assets/Images/view_icon.svg";

import "./Documents.scss";
import dayjs, { Dayjs } from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import { FormControl, MenuItem, Select } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Api from "../../api/Api";
import { useParams } from "react-router-dom";
import userSessionInfo from "../../util/userSessionInfo";
import { toast } from "react-toastify";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { useAppDispatch } from "@Src/app/hooks";
import axios from "axios";
import { MODULES_API_MAP } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import { useForm, Controller } from "react-hook-form";
import { OutlinedInput, InputAdornment } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { Tooltip } from "@mui/material";

const SUPPORTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "image/jpg",
];

interface IFormInputs {
  paymentAmount: number | null;
  paymentDate: Date | null;
  documentNumber: string;
  document: File | null;
}

function Documents() {
  const dispatch = useAppDispatch();
  const [uploadModel, setUploadModel] = useState(false);
  const [documentTypesMapping, setDocumentTypesMapping] = useState<any>({});
  const [selectedDocumentType, setSelectedDocumentType] = useState<any>([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState<any>([]);
  const [documentType, setdocumentType] = useState<any>("");
  const [documentNames, setdocumentNames] = useState<any>("");
  const [selectedDocument, setSelectedDocument] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<any>();
  const [successMessage, setSuccessMessage] = useState<any>();
  const [selectedFile, setSelectedFile] = useState<any>("");
  const [documentUrl, setDocumentUrl] = useState("");
  const { customerId } = useParams();
  const { custUnitId } = useParams();
  const [myUploadDocuments, setMyUploadsDocuments] = useState<any>([]);
  const [tdsDocuments, setTdsDocuments] = useState<any>([]);
  const [paymentProofsDocuments, setPaymentProofsDocuments] = useState<any>([]);
  const [loanDocuments, setLoanDocuments] = useState<any>([]);
  const [sellerDocuments, setSellerDocuments] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  let [isPaymentProofComplete, setIsPaymentProofComplete] = useState(false);
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [viewDocument,setViewDocument] = useState(false);
  const [viewDocumentObj,setViewDocumentObj]= useState<any>({})

  const handleClose = () => setOpen(false);

  const { control } = useForm();
  const [deleteDocumentSubmit, setDeleteDocumentSubmit] = useState(false);
  const [deleteDocumentObj, setDeleteDocumentObj] = useState<any>({});

  const handleDeleteDocumentsSubmit = async (document: any) => {
    let documentObj;

    if (document?.document_type === "ID Document") {
      documentObj = {
        document_identifier: document?.document_identifier,
      };
    } else {
      documentObj = {
        document_identifier: document?.document_identifier,
        type: "units_documents",
        document_name: document?.document_name,
      };
    }

    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post(
      "crm_download_customer_unit_documents",
      documentObj
    );
    dispatch(showSpinner());
    if (responseStatus) {
      toast.success(message);
      setDeleteDocumentSubmit(true);
      setDeleteDocumentObj({});
      setOpen(false);
    } else {
      toast.error(message);
    }
    dispatch(hideSpinner());
  };

  const documentTypeValues = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_document_type_values", {});
    if (responseStatus) {
      setDocumentTypesMapping(data.documentValueMapping[0].content);
      setSelectedDocumentType(
        Object.keys(data.documentValueMapping[0].content)
      );
    } else {
      setDocumentTypesMapping({});
      setSelectedDocumentType([]);
    }
  };

  const getCustomerUnitDocuments = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_customer_unit_documents", {
      cust_profile_id: customerId,
      cust_unit_id: custUnitId,
    });

    dispatch(showSpinner());
    if (responseStatus) {
      setMyUploadsDocuments(data?.myUploadDocuments);
      setTdsDocuments(data?.paymentTdsData);
      setPaymentProofsDocuments(data?.paymentProofsData);
      setLoanDocuments(data?.legalDocumentData);
      setSellerDocuments(data?.sellerDocumentData);
      setIsLoading(true);
    }
    dispatch(hideSpinner());
  };

  useEffect(() => {
    getCustomerUnitDocuments();
    documentTypeValues();
    setDeleteDocumentSubmit(false);
  }, [uploadModel, deleteDocumentSubmit]);

  const handleChange = (event: any) => {
    const selectedType = event.target.value as string;
    setdocumentType(selectedType);
    setSelectedDocumentNames(documentTypesMapping[selectedType] || []);
    setdocumentNames("");
  };

  const handleDocumentNameChange = (event: any) => {
    const selectedDocumentName = event.target.value as string;
    setdocumentNames(selectedDocumentName);
  };

  const handleUploadImage = async (event: any) => {
    const file = event.target.files[0];
    const uploadedFileSizeInKB = (file?.size ?? 0) / 1024;
  
    const isIdDocumentApplicantProof = documentType === "ID Document" && documentNames === "applicant_photo";
    const allowedTypes = isIdDocumentApplicantProof 
      ? SUPPORTED_FILE_TYPES.filter(type => type !== "application/pdf")
      : SUPPORTED_FILE_TYPES;
  
    if (!file || !allowedTypes.includes(file.type)) {
      setErrorMessage(isIdDocumentApplicantProof
        ? "Please select a JPG, JPEG, or PNG file."
        : "Please select a JPG, JPEG, PNG or PDF file.");
      setIsDocumentUploaded(false);
      return;
    }
  
    if (uploadedFileSizeInKB < 20 || uploadedFileSizeInKB > 2048) {
      setErrorMessage("Document size should be more than 20KB and less than 2MB.");
      setIsDocumentUploaded(false);
    } else {
      setSelectedFile(file);
      let url_name = "documents_upload";
      const formData: any = new FormData();
      formData.append("file", file);
      formData.append("cust_profile_id", customerId);
      formData.append("document_name", documentNames);
      const { status, data, message } = await Api.post(url_name, formData);
      if (status) {
        setDocumentUrl(data.data);
        setSuccessMessage("Document Uploaded Successfully");
        setErrorMessage("");
        setIsDocumentUploaded(true);
      } else {
        setDocumentUrl("");
        setErrorMessage(message);
        setIsDocumentUploaded(false);
      }
    }
  };

  const handleSubmitAllotmentLetter = async () => {
    // console.log("documentType", documentType);
    // console.log("documentNames", documentNames);
    // console.log("docuemnturl", documentUrl);
    const userInfo = userSessionInfo.logUserInfo();
    let url: any;
    let uploadDocumentObj;
    if (documentType == "ID Document") {
      uploadDocumentObj = {
        cust_profile_id: customerId,
        document_name: documentNames,
        document_type: documentType,
        document_number: "",
        document_url: documentUrl,
        last_modified_by: userInfo?.rm_user_name,
      };
      url = "crm_customer_profile_documents";
    } else if (documentType == "Proofs" && documentNames == "payment_proof") {
      console.log("paymentAmount", paymentAmount);
      console.log("checkNumber", checkNumber);
      console.log("selectedDate", selectedDate);
      const date = new Date(selectedDate);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      uploadDocumentObj = {
        cust_unit_id: custUnitId,
        document_name: documentNames,
        document_type: documentType,
        document_number: checkNumber,
        document_url: documentUrl,
        last_modified_by: userInfo?.rm_user_name,
        amount: paymentAmount,
        payment_date: formattedDate,
        payment_type: "payment",
      };
      url = "crm_aggrement_sale";
    } else {
      uploadDocumentObj = {
        cust_unit_id: custUnitId,
        document_name: documentNames,
        document_type: documentType,
        document_number: "",
        document_url: documentUrl,
        last_modified_by: userInfo?.rm_user_name,
      };
      url = "crm_aggrement_sale";
    }
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post(url, uploadDocumentObj);
    if (responseStatus) {
      toast.success("Document Uploaded Successfully");
      setUploadModel(false);
    } else {
      toast.error("Documents Not Uploaded Successfully");
      setUploadModel(true);
    }

    setdocumentType("");
    setdocumentNames("");
    setSelectedFile("");
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedDocumentNames([]);
    setSelectedDocumentType([]);
    setPaymentAmount("");
    setPaymentDate("");
    setCheckNumber("");
    setSelectedDate(null)
    resetForm()
  };

  const isPaymentProofCompletevalue = 
    documentType === "Proofs" && 
    documentNames === "payment_proof" ? 
    (paymentAmount !== "" && 
    selectedDate !== null && 
    checkNumber !== "") : true;

  const isCompleteUpload = 
    documentType !== "" && 
    documentNames !== "" && 
    isPaymentProofCompletevalue && 
    isDocumentUploaded;

    const resetForm = () => {
      setdocumentType("");
      setdocumentNames("");
      setSelectedFile("");
      setSelectedDocumentNames([]);
      setSelectedDocumentType([]);
      setErrorMessage("");
      setSuccessMessage("");
      setPaymentAmount("");
      setPaymentDate("");
      setCheckNumber("");
      setSelectedDate(null);
      setIsDocumentUploaded(false);
      setDocumentUrl("");
    };


  

  const downloadDocuments = async (file_url: string) => {
    const userToken = userSessionInfo.getJwtToken();
    const customHeaders: any = {
      headers: {
        "client-code": "myhome",
        key: userToken?.key,
      },
      responseType: "blob",
    };
    const reqObj = {
      file_url: file_url,
    };
    const res = await axios.post(
      `${
        MODULES_API_MAP.AUTHENTICATION + GLOBAL_API_ROUTES.DOWNLOAD_DOCUMNETS
      }`,
      reqObj,
      customHeaders
    );
    if (res.data) {
      let file_name: any = file_url?.split("/").pop();
      // console.log("res", res.data)
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      ////console.log("file not found");
    }
  };

  useEffect(() => {
    if (documentType === "Proofs" && documentNames === "payment_proof") {
      const isComplete = 
        paymentAmount !== "" && 
        selectedDate !== null && 
        checkNumber !== "" && 
        documentUrl !== "";
      setIsPaymentProofComplete(isComplete);
    } else {
      setIsPaymentProofComplete(true);
    }
  }, [documentType, documentNames, paymentAmount, selectedDate, checkNumber, documentUrl]);

  useEffect(() => {
    if (uploadModel) {
      resetForm();
    }
  }, [uploadModel]);


  return (
    <>
      <div>
        <Box sx={{ flexGrow: 1, marginLeft: "20px" }}>
          <div className="tw-flex tw-justify-between  tw-mt-7">
            <p className="tw-font-bold tw-text-black">Documents</p>
            <Button
              variant="outlined"
              sx={{
                color: "black",
                borderColor: "black",
                borderRadius: "0.5rem",
                marginRight: "2rem",
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => setUploadModel(true)}
            >
              Upload document
            </Button>
          </div>
          {myUploadDocuments?.length > 0 && (
            <div>
              <p>Uploaded by customer</p>
            </div>
          )}
          <div>
            <List>
              {myUploadDocuments?.map((myuploadfile: any, index: number) => (
                <React.Fragment key={myuploadfile.document_identifier}>
                  <ListItem className="list-item-hover">
                  <ListItemIcon>
                      {myuploadfile.document_url?.endsWith(".pdf") ? (
                        // <iframe
                        //   src={myuploadfile?.document_url}
                        //   title="Payment Proof PDF"
                        //   width="40"
                        //   height="40"
                        //   style={{ border: "none" }}
                        // />
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.1999 0H18.8985L27.966 9.45128V27.8341C27.966 30.1369 26.1029 32 23.8081 32H8.1999C5.89706 32 4.034 30.1369 4.034 27.8341V4.1659C4.03396 1.86306 5.89702 0 8.1999 0Z" fill="#E5252A" />
                        <path opacity="0.302" fill-rule="evenodd" clip-rule="evenodd" d="M18.8905 0V9.37931H27.966L18.8905 0Z" fill="white" />
                        <path d="M8.66364 23.8763V18.0312H11.1504C11.7661 18.0312 12.2539 18.1992 12.6217 18.543C12.9895 18.8788 13.1734 19.3346 13.1734 19.9023C13.1734 20.47 12.9895 20.9258 12.6217 21.2616C12.2539 21.6055 11.7661 21.7734 11.1504 21.7734H10.1589V23.8763H8.66364ZM10.1589 20.502H10.9825C11.2064 20.502 11.3823 20.4541 11.5022 20.3421C11.6222 20.2382 11.6862 20.0942 11.6862 19.9024C11.6862 19.7105 11.6222 19.5665 11.5022 19.4626C11.3823 19.3506 11.2064 19.3027 10.9825 19.3027H10.1589V20.502ZM13.7891 23.8763V18.0312H15.86C16.2678 18.0312 16.6516 18.0872 17.0114 18.2072C17.3713 18.3271 17.6991 18.495 17.987 18.7269C18.2748 18.9508 18.5067 19.2546 18.6746 19.6385C18.8345 20.0223 18.9225 20.4621 18.9225 20.9578C18.9225 21.4456 18.8346 21.8853 18.6746 22.2691C18.5067 22.6529 18.2748 22.9568 17.987 23.1807C17.6991 23.4125 17.3713 23.5804 17.0114 23.7004C16.6516 23.8203 16.2678 23.8763 15.86 23.8763H13.7891ZM15.2523 22.605H15.6841C15.916 22.605 16.1319 22.581 16.3318 22.525C16.5237 22.4691 16.7076 22.3811 16.8835 22.2612C17.0514 22.1412 17.1874 21.9733 17.2833 21.7494C17.3793 21.5255 17.4273 21.2616 17.4273 20.9578C17.4273 20.6459 17.3793 20.3821 17.2833 20.1582C17.1874 19.9343 17.0514 19.7664 16.8835 19.6465C16.7076 19.5265 16.5237 19.4386 16.3318 19.3826C16.1319 19.3266 15.916 19.3026 15.6841 19.3026H15.2523V22.605ZM19.6741 23.8763V18.0312H23.8321V19.3026H21.1694V20.2381H23.2963V21.5015H21.1694V23.8763H19.6741Z" fill="white" />
                    </svg>
                      ) : (
                        <img
                          src={myuploadfile.document_url}
                          alt="Document Icon"
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={myuploadfile.document_url?.split("/")?.pop()}
                      style={{ color: "black" }}
                      secondary={`added on ${dayjs(
                        myuploadfile.last_modified_at
                      ).format("DD/MM/YYYY")}`}
                    />
                    <div className="hidden-icons">
                      <Tooltip title="Download" placement="top">
                        <IconButton edge="end" aria-label="download">
                          <button
                            onClick={() =>
                              downloadDocuments(myuploadfile?.document_url)
                            }
                          >
                            <img
                              src="/images/download-icon.svg"
                              alt="Download"
                              className="tw-mr-3"
                            />
                          </button>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View" placement="top">
                        <IconButton edge="end" aria-label="view" onClick={()=>{setViewDocument(true);setViewDocumentObj(myuploadfile)}}>
                          {/* <a
                            href={myuploadfile.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          > */}
                            <img
                              src={view_icon}
                              alt="view_icon"
                              className="tw-mr-3"
                            />
                          {/* </a> */}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <IconButton edge="end" aria-label="delete">
                          <img
                            src={delete_icon}
                            alt="delete_icon"
                            onClick={() => {
                              setDeleteDocumentObj(myuploadfile);
                              setOpen(true);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </ListItem>
                  {index < myUploadDocuments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </div>
          {sellerDocuments?.length > 0 && (
            <div>
              <p>Seller Documents</p>
            </div>
          )}
          <div>
            <List>
              {sellerDocuments?.map((file: any, index: number) => (
                <React.Fragment key={file.document_identifier}>
                  <ListItem className="list-item-hover">
                  <ListItemIcon>
                      {file.document_url?.endsWith(".pdf") ? (
                        // <iframe
                        //   src={file?.document_url}
                        //   title="Payment Proof PDF"
                        //   width="40"
                        //   height="40"
                        //   style={{ border: "none" }}
                        // />
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.1999 0H18.8985L27.966 9.45128V27.8341C27.966 30.1369 26.1029 32 23.8081 32H8.1999C5.89706 32 4.034 30.1369 4.034 27.8341V4.1659C4.03396 1.86306 5.89702 0 8.1999 0Z" fill="#E5252A" />
                        <path opacity="0.302" fill-rule="evenodd" clip-rule="evenodd" d="M18.8905 0V9.37931H27.966L18.8905 0Z" fill="white" />
                        <path d="M8.66364 23.8763V18.0312H11.1504C11.7661 18.0312 12.2539 18.1992 12.6217 18.543C12.9895 18.8788 13.1734 19.3346 13.1734 19.9023C13.1734 20.47 12.9895 20.9258 12.6217 21.2616C12.2539 21.6055 11.7661 21.7734 11.1504 21.7734H10.1589V23.8763H8.66364ZM10.1589 20.502H10.9825C11.2064 20.502 11.3823 20.4541 11.5022 20.3421C11.6222 20.2382 11.6862 20.0942 11.6862 19.9024C11.6862 19.7105 11.6222 19.5665 11.5022 19.4626C11.3823 19.3506 11.2064 19.3027 10.9825 19.3027H10.1589V20.502ZM13.7891 23.8763V18.0312H15.86C16.2678 18.0312 16.6516 18.0872 17.0114 18.2072C17.3713 18.3271 17.6991 18.495 17.987 18.7269C18.2748 18.9508 18.5067 19.2546 18.6746 19.6385C18.8345 20.0223 18.9225 20.4621 18.9225 20.9578C18.9225 21.4456 18.8346 21.8853 18.6746 22.2691C18.5067 22.6529 18.2748 22.9568 17.987 23.1807C17.6991 23.4125 17.3713 23.5804 17.0114 23.7004C16.6516 23.8203 16.2678 23.8763 15.86 23.8763H13.7891ZM15.2523 22.605H15.6841C15.916 22.605 16.1319 22.581 16.3318 22.525C16.5237 22.4691 16.7076 22.3811 16.8835 22.2612C17.0514 22.1412 17.1874 21.9733 17.2833 21.7494C17.3793 21.5255 17.4273 21.2616 17.4273 20.9578C17.4273 20.6459 17.3793 20.3821 17.2833 20.1582C17.1874 19.9343 17.0514 19.7664 16.8835 19.6465C16.7076 19.5265 16.5237 19.4386 16.3318 19.3826C16.1319 19.3266 15.916 19.3026 15.6841 19.3026H15.2523V22.605ZM19.6741 23.8763V18.0312H23.8321V19.3026H21.1694V20.2381H23.2963V21.5015H21.1694V23.8763H19.6741Z" fill="white" />
                    </svg>
                      ) : (
                        <img
                          src={file.document_url}
                          alt="Document Icon"
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.document_url?.split("/")?.pop()}
                      style={{ color: "black" }}
                      secondary={`added on ${dayjs(
                        file?.last_modified_at
                      ).format("DD/MM/YYYY")}`}
                    />
                    <div className="hidden-icons">
                      <Tooltip title="Download" placement="top">
                        <IconButton edge="end" aria-label="download">
                          <button
                            onClick={() =>
                              downloadDocuments(file?.document_url)
                            }
                          >
                            <img
                              src="/images/download-icon.svg"
                              alt="Download"
                              className="tw-mr-3"
                            />
                          </button>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View" placement="top">
                        <IconButton edge="end" aria-label="view" onClick={()=>{setViewDocument(true);setViewDocumentObj(file)}}>
                          
                            <img
                              src={view_icon}
                              alt="view_icon"
                              className="tw-mr-3"
                            />
                          
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <IconButton edge="end" aria-label="delete">
                          <img
                            src={delete_icon}
                            alt="delete_icon"
                            onClick={() => {
                              setDeleteDocumentObj(file);
                              setOpen(true);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </ListItem>
                  {index < sellerDocuments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </div>
          {tdsDocuments?.length > 0 && (
            <div>
              <p>TDS Documents</p>
            </div>
          )}
          <div>
            <List>
              {tdsDocuments?.map((file: any, index: number) => (
                <React.Fragment key={file.document_identifier}>
                  <ListItem className="list-item-hover">
                  <ListItemIcon>
                      {file.document_url?.endsWith(".pdf") ? (
                        // <iframe
                        //   src={file?.document_url}
                        //   title="Payment Proof PDF"
                        //   width="40"
                        //   height="40"
                        //   style={{ border: "none" }}
                        // />
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.1999 0H18.8985L27.966 9.45128V27.8341C27.966 30.1369 26.1029 32 23.8081 32H8.1999C5.89706 32 4.034 30.1369 4.034 27.8341V4.1659C4.03396 1.86306 5.89702 0 8.1999 0Z" fill="#E5252A" />
                        <path opacity="0.302" fill-rule="evenodd" clip-rule="evenodd" d="M18.8905 0V9.37931H27.966L18.8905 0Z" fill="white" />
                        <path d="M8.66364 23.8763V18.0312H11.1504C11.7661 18.0312 12.2539 18.1992 12.6217 18.543C12.9895 18.8788 13.1734 19.3346 13.1734 19.9023C13.1734 20.47 12.9895 20.9258 12.6217 21.2616C12.2539 21.6055 11.7661 21.7734 11.1504 21.7734H10.1589V23.8763H8.66364ZM10.1589 20.502H10.9825C11.2064 20.502 11.3823 20.4541 11.5022 20.3421C11.6222 20.2382 11.6862 20.0942 11.6862 19.9024C11.6862 19.7105 11.6222 19.5665 11.5022 19.4626C11.3823 19.3506 11.2064 19.3027 10.9825 19.3027H10.1589V20.502ZM13.7891 23.8763V18.0312H15.86C16.2678 18.0312 16.6516 18.0872 17.0114 18.2072C17.3713 18.3271 17.6991 18.495 17.987 18.7269C18.2748 18.9508 18.5067 19.2546 18.6746 19.6385C18.8345 20.0223 18.9225 20.4621 18.9225 20.9578C18.9225 21.4456 18.8346 21.8853 18.6746 22.2691C18.5067 22.6529 18.2748 22.9568 17.987 23.1807C17.6991 23.4125 17.3713 23.5804 17.0114 23.7004C16.6516 23.8203 16.2678 23.8763 15.86 23.8763H13.7891ZM15.2523 22.605H15.6841C15.916 22.605 16.1319 22.581 16.3318 22.525C16.5237 22.4691 16.7076 22.3811 16.8835 22.2612C17.0514 22.1412 17.1874 21.9733 17.2833 21.7494C17.3793 21.5255 17.4273 21.2616 17.4273 20.9578C17.4273 20.6459 17.3793 20.3821 17.2833 20.1582C17.1874 19.9343 17.0514 19.7664 16.8835 19.6465C16.7076 19.5265 16.5237 19.4386 16.3318 19.3826C16.1319 19.3266 15.916 19.3026 15.6841 19.3026H15.2523V22.605ZM19.6741 23.8763V18.0312H23.8321V19.3026H21.1694V20.2381H23.2963V21.5015H21.1694V23.8763H19.6741Z" fill="white" />
                    </svg>
                      ) : (
                        <img
                          src={file.document_url}
                          alt="Document Icon"
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.document_url?.split("/")?.pop()}
                      style={{ color: "black" }}
                      secondary={`added on ${dayjs(
                        file?.last_modified_at
                      ).format("DD/MM/YYYY")}`}
                    />
                    <div className="hidden-icons">
                      <Tooltip title="Download" placement="top">
                        <IconButton edge="end" aria-label="options">
                          <button
                            onClick={() =>
                              downloadDocuments(file?.document_url)
                            }
                          >
                            <img
                              src="/images/download-icon.svg"
                              alt="Download"
                              className="tw-mr-3"
                            />
                          </button>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View" placement="top">
                        <IconButton edge="end" aria-label="options" onClick={()=>{setViewDocument(true);setViewDocumentObj(file)}}>
                         
                            <img
                              src={view_icon}
                              alt="view_icon"
                              className="tw-mr-3"
                            />
                         
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <IconButton edge="end" aria-label="options">
                          <div>
                            <img
                              src={delete_icon}
                              alt="delete_icon"
                              onClick={() => {
                                setDeleteDocumentObj(file);
                                setOpen(true);
                              }}
                            />
                          </div>
                        </IconButton>
                      </Tooltip>
                    </div>
                  </ListItem>
                  {index < tdsDocuments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </div>
          {loanDocuments?.length > 0 && (
            <div>
              <p>Legal Documents</p>
            </div>
          )}
          <div>
            <List>
              {loanDocuments?.map((file: any, index: number) => (
                <React.Fragment key={file.document_identifier}>
                  <ListItem className="list-item-hover">
                  <ListItemIcon>
                      {file.document_url?.endsWith(".pdf") ? (
                        // <iframe
                        //   src={file?.document_url}
                        //   title="Payment Proof PDF"
                        //   width="40"
                        //   height="40"
                        //   style={{ border: "none" }}
                        // />
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.1999 0H18.8985L27.966 9.45128V27.8341C27.966 30.1369 26.1029 32 23.8081 32H8.1999C5.89706 32 4.034 30.1369 4.034 27.8341V4.1659C4.03396 1.86306 5.89702 0 8.1999 0Z" fill="#E5252A" />
                        <path opacity="0.302" fill-rule="evenodd" clip-rule="evenodd" d="M18.8905 0V9.37931H27.966L18.8905 0Z" fill="white" />
                        <path d="M8.66364 23.8763V18.0312H11.1504C11.7661 18.0312 12.2539 18.1992 12.6217 18.543C12.9895 18.8788 13.1734 19.3346 13.1734 19.9023C13.1734 20.47 12.9895 20.9258 12.6217 21.2616C12.2539 21.6055 11.7661 21.7734 11.1504 21.7734H10.1589V23.8763H8.66364ZM10.1589 20.502H10.9825C11.2064 20.502 11.3823 20.4541 11.5022 20.3421C11.6222 20.2382 11.6862 20.0942 11.6862 19.9024C11.6862 19.7105 11.6222 19.5665 11.5022 19.4626C11.3823 19.3506 11.2064 19.3027 10.9825 19.3027H10.1589V20.502ZM13.7891 23.8763V18.0312H15.86C16.2678 18.0312 16.6516 18.0872 17.0114 18.2072C17.3713 18.3271 17.6991 18.495 17.987 18.7269C18.2748 18.9508 18.5067 19.2546 18.6746 19.6385C18.8345 20.0223 18.9225 20.4621 18.9225 20.9578C18.9225 21.4456 18.8346 21.8853 18.6746 22.2691C18.5067 22.6529 18.2748 22.9568 17.987 23.1807C17.6991 23.4125 17.3713 23.5804 17.0114 23.7004C16.6516 23.8203 16.2678 23.8763 15.86 23.8763H13.7891ZM15.2523 22.605H15.6841C15.916 22.605 16.1319 22.581 16.3318 22.525C16.5237 22.4691 16.7076 22.3811 16.8835 22.2612C17.0514 22.1412 17.1874 21.9733 17.2833 21.7494C17.3793 21.5255 17.4273 21.2616 17.4273 20.9578C17.4273 20.6459 17.3793 20.3821 17.2833 20.1582C17.1874 19.9343 17.0514 19.7664 16.8835 19.6465C16.7076 19.5265 16.5237 19.4386 16.3318 19.3826C16.1319 19.3266 15.916 19.3026 15.6841 19.3026H15.2523V22.605ZM19.6741 23.8763V18.0312H23.8321V19.3026H21.1694V20.2381H23.2963V21.5015H21.1694V23.8763H19.6741Z" fill="white" />
                    </svg>
                      ) : (
                        <img
                          src={file.document_url}
                          alt="Document Icon"
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.document_url?.split("/")?.pop()}
                      style={{ color: "black" }}
                      secondary={`added on ${dayjs(
                        file?.last_modified_at
                      ).format("DD/MM/YYYY")}`}
                    />
                    <div className="hidden-icons">
                      <Tooltip title="Download" placement="top">
                        <IconButton edge="end" aria-label="options">
                          <button
                            onClick={() =>
                              downloadDocuments(file?.document_url)
                            }
                          >
                            <img
                              src="/images/download-icon.svg"
                              alt="Download"
                              className="tw-mr-3"
                            />
                          </button>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View" placement="top">
                        <IconButton edge="end" aria-label="options" onClick={()=>{setViewDocument(true);setViewDocumentObj(file)}}>
                         
                            <img
                              src={view_icon}
                              alt="view_icon"
                              className="tw-mr-3"
                            />
                         
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <IconButton edge="end" aria-label="options">
                          <div>
                            <img
                              src={delete_icon}
                              alt="delete_icon"
                              onClick={() => {
                                setDeleteDocumentObj(file);
                                setOpen(true);
                              }}
                            />
                          </div>
                        </IconButton>
                      </Tooltip>
                    </div>
                  </ListItem>
                  {index < loanDocuments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </div>
          {paymentProofsDocuments?.length > 0 && (
            <div>
              <p>Payment Proofs Documents</p>
            </div>
          )}
          <div>
            <List>
              {paymentProofsDocuments?.map((file: any, index: number) => (
                <React.Fragment key={file.document_identifier}>
                  <ListItem className="list-item-hover">
                    <ListItemIcon>
                      {file.document_url?.endsWith(".pdf") ? (
                        // <iframe
                        //   src={file?.document_url}
                        //   title="Payment Proof PDF"
                        //   width="40"
                        //   height="40"
                        //   style={{ border: "none" }}
                        // />
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.1999 0H18.8985L27.966 9.45128V27.8341C27.966 30.1369 26.1029 32 23.8081 32H8.1999C5.89706 32 4.034 30.1369 4.034 27.8341V4.1659C4.03396 1.86306 5.89702 0 8.1999 0Z" fill="#E5252A" />
                                    <path opacity="0.302" fill-rule="evenodd" clip-rule="evenodd" d="M18.8905 0V9.37931H27.966L18.8905 0Z" fill="white" />
                                    <path d="M8.66364 23.8763V18.0312H11.1504C11.7661 18.0312 12.2539 18.1992 12.6217 18.543C12.9895 18.8788 13.1734 19.3346 13.1734 19.9023C13.1734 20.47 12.9895 20.9258 12.6217 21.2616C12.2539 21.6055 11.7661 21.7734 11.1504 21.7734H10.1589V23.8763H8.66364ZM10.1589 20.502H10.9825C11.2064 20.502 11.3823 20.4541 11.5022 20.3421C11.6222 20.2382 11.6862 20.0942 11.6862 19.9024C11.6862 19.7105 11.6222 19.5665 11.5022 19.4626C11.3823 19.3506 11.2064 19.3027 10.9825 19.3027H10.1589V20.502ZM13.7891 23.8763V18.0312H15.86C16.2678 18.0312 16.6516 18.0872 17.0114 18.2072C17.3713 18.3271 17.6991 18.495 17.987 18.7269C18.2748 18.9508 18.5067 19.2546 18.6746 19.6385C18.8345 20.0223 18.9225 20.4621 18.9225 20.9578C18.9225 21.4456 18.8346 21.8853 18.6746 22.2691C18.5067 22.6529 18.2748 22.9568 17.987 23.1807C17.6991 23.4125 17.3713 23.5804 17.0114 23.7004C16.6516 23.8203 16.2678 23.8763 15.86 23.8763H13.7891ZM15.2523 22.605H15.6841C15.916 22.605 16.1319 22.581 16.3318 22.525C16.5237 22.4691 16.7076 22.3811 16.8835 22.2612C17.0514 22.1412 17.1874 21.9733 17.2833 21.7494C17.3793 21.5255 17.4273 21.2616 17.4273 20.9578C17.4273 20.6459 17.3793 20.3821 17.2833 20.1582C17.1874 19.9343 17.0514 19.7664 16.8835 19.6465C16.7076 19.5265 16.5237 19.4386 16.3318 19.3826C16.1319 19.3266 15.916 19.3026 15.6841 19.3026H15.2523V22.605ZM19.6741 23.8763V18.0312H23.8321V19.3026H21.1694V20.2381H23.2963V21.5015H21.1694V23.8763H19.6741Z" fill="white" />
                                </svg>
                      ) : (
                        <img
                          src={file.document_url}
                          alt="Document Icon"
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.document_url?.split("/")?.pop()}
                      style={{ color: "black" }}
                      secondary={`added on ${dayjs(
                        file?.last_modified_at
                      ).format("DD/MM/YYYY")}`}
                    />
                    <div className="hidden-icons">
                      <Tooltip title="Download" placement="top">
                        <IconButton edge="end" aria-label="options">
                          <button
                            onClick={() =>
                              downloadDocuments(file?.document_url)
                            }
                          >
                            <img
                              src="/images/download-icon.svg"
                              alt="Download"
                              className="tw-mr-3"
                            />
                          </button>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View" placement="top">
                        <IconButton edge="end" aria-label="options" onClick={()=>{setViewDocument(true);setViewDocumentObj(file)}}>
                          
                            <img
                              src={view_icon}
                              alt="view_icon"
                              className="tw-mr-3"
                            />
                         
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <IconButton edge="end" aria-label="options">
                          <div>
                            <img
                              src={delete_icon}
                              alt="delete_icon"
                              onClick={() => {
                                setDeleteDocumentObj(file);
                                setOpen(true);
                              }}
                            />
                          </div>
                        </IconButton>
                      </Tooltip>
                    </div>
                  </ListItem>
                  {index < paymentProofsDocuments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </div>
         
        </Box>
      </div>
      <Dialog open={uploadModel} onClose={() => {
          setUploadModel(false);
          resetForm();
          
        }}
       
        >
        <div className="tw-flex tw-justify-between tw-m-4">
          <h3 className="text-pri-all tw-text-2xl tw-font-bold">
            Upload Files
          </h3>
          <img
            src="/images/cross-icon.svg"
            className="tw-cursor-pointer"
            onClick={() => {
              setUploadModel(false);
              resetForm();
            }}
          />
        </div>
        <DialogContent>
          <p className="text-sm mb-4">
            You have the option to upload property-related documents by choosing
            the file type
          </p>
          <div>
            <p className="tw-mb-2" style={{ marginTop: "2rem" }}>
              {" "}
              Select Document Type
              <span className="red-star">*</span>
            </p>
            <FormControl fullWidth>
              <Select
                value={documentType}
                onChange={handleChange}
                IconComponent={KeyboardArrowDownIcon}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {selectedDocumentType?.map((type: any) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {documentType != "" && (
            <div>
              <p className="tw-mb-2" style={{ marginTop: "1rem" }}>
                {" "}
                Select Document Name
                <span className="red-star">*</span>
              </p>
              <FormControl fullWidth>
                <Select
                  value={documentNames}
                  IconComponent={KeyboardArrowDownIcon}
                  onChange={handleDocumentNameChange}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {selectedDocumentNames?.map((name: any) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

{documentType === "Proofs" && documentNames === "payment_proof" && (
          <>
            <div className="tw-flex tw-flex-col tw-flex-start">
              <p className="tw-mb-2" style={{ marginTop: "2rem" }}>
                Payment Amount
                <span className="red-star">*</span>
              </p>
              <Controller
                control={control}
                name="paymentAmount"
                render={({ field }) => (
                  <OutlinedInput
                    fullWidth
                    {...field}
                    placeholder="₹ Enter your paid amount"
                    type="number"
                    inputMode="numeric"
                    value={paymentAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      const regex = /^\d{0,10}(\.\d{0,2})?$/;
                      if (regex.test(value)) {
                        setPaymentAmount(value);
                      }
                    }}
                    required
                  />
                )}
              />

              <p className="tw-mb-2" style={{ marginTop: "2rem" }}>
                Payment Date
                <span className="red-star">*</span>
              </p>
              <Controller
  control={control}
  name="paymentDate"
  render={({ field }) => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        {...field}
        open={dateOpen}
        onOpen={() => setDateOpen(true)}
        onClose={() => setDateOpen(false)}
        maxDate={new Date()}
        value={selectedDate}
        onChange={(date: any) => {
          field.onChange(date);
          setSelectedDate(date);
        }}
        inputFormat="dd/MM/yyyy"
        renderInput={(params) => (
          <TextField
            fullWidth
            {...params}
            inputProps={{
              ...params.inputProps,
              readOnly: true,
              style: { color: 'black' }, 
              onClick: () => setDateOpen(true),
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    className="!tw-mr-2"
                    aria-label="toggle date picker"
                    onClick={() => setDateOpen(true)}
                    edge="end"
                  >
                    <CalendarTodayOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder="Select Payment Date"
            required
            onClick={() => setDateOpen(true)}
          />
        )}
      />
    </LocalizationProvider>
  )}
/>

              <p className="tw-mb-2" style={{ marginTop: "2rem" }}>
                UTR/Cheque Number
                <span className="red-star">*</span>
              </p>
              <Controller
                name="checkNumber"
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    fullWidth
                    {...field}
                    placeholder="UTR/ Cheque number"
                    value={checkNumber}
                    inputProps={{ maxLength: 12 }}
                    onChange={(e) => {
                      const { value } = e.target;
                      const sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
                      setCheckNumber(sanitizedValue);
                    }}
                    required
                  />
                )}
              />
            </div>
          </>
        )}

          <div className="tw-mt-4">
            <TextField
              type="file"
              id="myFile"
              name="filename"
              sx={{ mt: 3, width: "550px" }}
              onChange={handleUploadImage}
              disabled={documentNames == "" ? true : false}
            />

            <p style={{ color: "#989FAE", marginTop: "6px" }}>
              Supported files : jpeg , jpg , png
            </p>
          </div>

          {errorMessage && (
            <div className="tw-text-red-500 tw-my-1">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="tw-text-green-500 tw-my-1">{successMessage}</div>
          )}
          <div>
          <DialogActions>
          <Button
            variant="outlined"
            sx={{ color: "black", borderColor: "black" }}
            onClick={() => {
              setUploadModel(false);
              resetForm();
            }}
          >
            Close
          </Button>
          <Button
            style={{ 
              backgroundColor: isCompleteUpload ? "#000000" : "transparent",
              color: isCompleteUpload ? "#FFFFFF" : "black",
              border: !isCompleteUpload ? "1px solid black" : "none",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: isCompleteUpload ? "pointer" : "not-allowed",
              opacity: !isCompleteUpload ? 0.5 : 1,
              marginRight: "1rem",
              width: '97px',  // Fix the width
              height: '37px'  // Fix the height
            }}
            onClick={handleSubmitAllotmentLetter}
            disabled={!isCompleteUpload}
          >
            Submit
          </Button>
        </DialogActions>

          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ width: "500px", height: "110px" }}>
          <div className="tw-flex tw-justify-between">
            <h3 className="tw-font-bold">Delete Documents</h3>
            <img
              src="/images/cross-icon.svg"
              className="tw-cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>

          <p>Are you sure you want to delete the document</p>
        </DialogTitle>

        <DialogActions style={{ justifyContent: "space-between" }}>
          <Button
            onClick={() => {
              handleDeleteDocumentsSubmit(deleteDocumentObj);
            }}
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
          >
            Yes
          </Button>
          <Button
            onClick={handleClose}
            color="primary"
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
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
              open={viewDocument}
              onClose={()=>{setViewDocument(false);setViewDocumentObj({})}}
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
                {viewDocumentObj?.document_url?.endsWith(".pdf") ? (
                  <iframe
                    src={viewDocumentObj?.document_url}
                    style={{ width: "100%", height: "80vh" }}
                    frameBorder="0"
                    title="PDF Viewer"
                  />
                ) : (
                  <img
                    src={viewDocumentObj?.document_url}
                    alt="Document"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
              </DialogContent>
              <DialogActions>
                
                <Button onClick={()=>setViewDocument(false)}>Close</Button>
              </DialogActions>
      </Dialog>

      {isLoading &&
        myUploadDocuments?.length == 0 &&
        tdsDocuments?.length == 0 &&
        paymentProofsDocuments?.length == 0 &&
        sellerDocuments?.length == 0 &&
        loanDocuments?.length == 0 && (
          <>
            <div className="tw-flex tw-justify-center tw-items-center">
              <div className="tw-flex tw-justify-center tw-items-center tw-flex-col">
                <img
                  src={
                    "https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/No+Data+Found.jpg"
                  }
                  alt="No Payment Proofs"
                  className="tw-size-2/4"
                />
                <p className="no-document-text">No Documents Available</p>
              </div>
            </div>
          </>
        )}
    </>
  );
}

export default Documents;
