import React, { useEffect, useState } from "react";
import "./TdsDetails.scss";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import {Tooltip} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams } from "react-router-dom";
import Api from "../../api/Api";
import { formatNumberToIndianSystem } from "@Src/utils/globalUtilities";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { useAppDispatch } from "@Src/app/hooks";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { MODULES_API_MAP } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import userSessionInfo from "../../util/userSessionInfo";
import delete_icon from './../../../../assets/Images/delete_icon.svg';
import view_icon from './../../../../assets/Images/view_icon.svg';

function TdsDetails() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [documentMessage, setDocumentMessage] = useState("");

  const [deleteDocumentHandleSubmit, setDeleteDocumentHandleSubmit] =
    useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDeleteDocumentsSubmit = async (document: any) => {
    
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("crm_download_customer_unit_documents", {
      document_identifier: document?.document_identifier,
      type: "units_documents",
      "document_name":document?.document_name
    });
    dispatch(showSpinner());
    if (responseStatus) {
      toast.success(message);
      setDeleteDocumentHandleSubmit(true);
    } else {
      toast.error(message);
    }
    dispatch(hideSpinner());
    handleClose();
  };

  const navigate = useNavigate();
  const { customerId } = useParams();
  const { custUnitId } = useParams();
  const dispatch = useAppDispatch();
  const [customerTDSProofs, setCustomerTDSProofs] = useState<any>([]);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [onePerTds, setOnePerTds] = useState("");
  const [tdsDone, setTdsDone] = useState("");
  const [balanceTds, setBalanceTds] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<any>({});

  const handleBackToGrid = () => {
    navigate(`/crm/managecustomerdetails/${customerId}/${custUnitId}`, {
      state: { viewMilestonesTab: true, currentTab: 2 },
    });
  };

  const geCustomerTDSProofs = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_customer_tds_documents", {
      cust_unit_id: custUnitId,
      cust_profile_id: customerId,
      type: "admin",
    });
    dispatch(showSpinner());
    if (responseStatus) {
      setCustomerTDSProofs(data?.paymentTdsData);
      setBalanceAmount(data.total_billed_amount);
      setCustomerDetails(data?.customerDetails);
      setOnePerTds(data.oneperGST);
      setTdsDone(data.TDSDone);
      setBalanceTds(data.balanceTDS);
      setIsLoading(true);
    } else {
      setCustomerTDSProofs([]);
      setBalanceAmount("");
      setOnePerTds("");
      setTdsDone("");
      setBalanceTds("");
      setIsLoading(true);
    }
    dispatch(hideSpinner());
  };

  useEffect(() => {
    geCustomerTDSProofs();
    setDeleteDocumentHandleSubmit(false);
  }, [deleteDocumentHandleSubmit]);

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
      console.log("res", res.data);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      
    }
  };

  return (
    <div style={{ width: "98%", margin: "2rem" }}>
      <div className="manager_header">
        <Button onClick={handleBackToGrid} style={{ color: "black" }}>
          <ArrowBackIcon color="inherit" />
        </Button>
        <span className="tw-font-bold tw-text-black">
          Manage Customers / {customerDetails?.full_name}{" "}
          </span>
          <span style={{ color: "#656C7B"}}> / Tds details</span>
        
      </div>
      <div
        style={{
          width: "95%",
          margin: "1rem",
          backgroundColor: "white",
          maxHeight : '1190px',
          overflowY : 'scroll',
          padding: "1rem",
          borderRadius: "1rem",
        }}
      >
        <div className="tw-m-5 tw-mt-3">
          <p className="tw-font-bold tw-text-black tw-mb-3 tw-text-sm">TDS Details</p>
          <p className="tw-text-black tw-mb-6 tw-text-sm">TDS Summary information</p>
          <div
            className="tw-flex tw-justify-between"
            style={{
              border: "1px solid #DFE1E7",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            <div>
              <p className="tw-font-bold tw-text-black tw-mb-3 tw-text-sm">
                Total Invoice Amount
              </p>
              <p className="tw-text-sm">₹ {formatNumberToIndianSystem(balanceAmount)}</p>
            </div>
            <div>
              <p className="tw-font-bold tw-text-black tw-mb-3 tw-text-sm">TDS @1%</p>
              <p className="tw-text-sm">₹ {formatNumberToIndianSystem(onePerTds)}</p>
            </div>
            <div>
              <p className="tw-font-bold tw-text-black tw-mb-3 tw-text-sm">TDS Paid</p>
              <p className="tw-text-sm">₹ {formatNumberToIndianSystem(tdsDone)}</p>
            </div>
            <div>
              <p className="tw-font-bold tw-text-black tw-mb-3 tw-text-sm">Balance TDS</p>
              <p className="tw-text-sm">₹ {formatNumberToIndianSystem(balanceTds)}</p>
            </div>
          </div>
          <p className="tw-font-bold tw-text-black tw-mt-5 tw-text-sm">
            TDS Challans and 26QB Forms
          </p>
          <p className="tw-text-sm">all uploaded TDS challans and 26QB forms are listed below</p>

          <div style={{backgroundColor : 'white'}}>
      {customerTDSProofs.length > 0 ? (
         <List>
         {customerTDSProofs.map((file: any, index: number) => (
           <React.Fragment key={file.document_identifier}>
             <ListItem className="list-item-hover xyz" style={{height : '3.5rem'}}>
               <ListItemIcon >
               {file?.document_url?.endsWith(".pdf") ? (
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
                          src={file?.document_url}
                          alt="Document Icon"
                          style={{ width: 24, height: 24 }}
                        />
                      )}
               </ListItemIcon>
               <ListItemText
                 primary={file.document_name}
                 style={{ color: "black" }}
                 secondary={`added on ${file.created_on}`}
               />
               <div className="hidden-icons">
                 <Tooltip title="Download" placement="top">
                   <IconButton edge="end" aria-label="download">
                     <button
                       onClick={() => downloadDocuments(file?.document_url)}
                     >
                       <img src="/images/download-icon.svg" alt="Download" className="tw-mr-3"/>
                     </button>
                   </IconButton>
                 </Tooltip>
                 <Tooltip title="View" placement="top">
                   <IconButton edge="end" aria-label="view">
                     <a
                       href={file.document_url}
                       target="_blank"
                       rel="noopener noreferrer"
                     >
                <img src={view_icon} alt="view_icon" className="tw-mr-3"/>
                </a>
                   </IconButton>
                 </Tooltip>
                 <Tooltip title="Delete" placement="top">
                   <IconButton edge="end" aria-label="delete">
                     <div>
                     <img src={delete_icon} alt="delete_icon" 
                       onClick={handleOpen} />
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
                             onClick={() => handleDeleteDocumentsSubmit(file)}
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
                     </div>
                   </IconButton>
                 </Tooltip>
               </div>
             </ListItem>
             {index < customerTDSProofs.length - 1 && <Divider />}
           </React.Fragment>
         ))}
       </List>
      ) : (
        isLoading && (
          <div className="no-payment-proofs">
            <img
              src={
                "https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/No+Data+Found.jpg"
              }
              alt="No Payment Proofs"
              className="no-payment-proofs-image"
            />
            <p className="no-payment-proofs-text">
              No TDS Proofs Available
            </p>
          </div>
        )
      )}
    </div>
        </div>
      </div>
    </div>
  );
}

export default TdsDetails;
