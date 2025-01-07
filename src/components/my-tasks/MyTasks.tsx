import React, { useContext, useEffect, useState } from "react";
import "./MyTasks.scss";
import MyTaskCard from "@Components/my-task-card/MyTaskCard";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { myTaskCardProps } from "@Components/my-task-card/MyTaskCard";
import { useAppDispatch } from "@Src/app/hooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { MyContext } from "@Src/Context/RefreshPage/Refresh";
import userSessionInfo from "../../app/admin/util/userSessionInfo";
import Api from "../../app/admin/api/Api";
import { useParams } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  DialogActions,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  Modal,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@mui/material";
const SUPPORTED_FILE_TYPES = ["application/pdf"];
const MyTasks = (props: { setCurrentTab: any }) => {
  const [completedTasks, setCompletedTasks] = useState<myTaskCardProps[]>([]);
  const [pendingTasks, setPendingTasks] = useState<myTaskCardProps[]>([]);
  const dispatch = useAppDispatch();
  const { cust_unit_id } = useContext(MyContext);
  const { custUnitId, customerId } = useParams();
  const [custUnitDetails, setCustUnitDetails] = useState<any>();
  const [changeRequestTasks, setChangeRequestTasks] = useState<any>([]);
  const [disableTitle, setDisableTitle] = useState(false);
  const [existingModal, setExistingModal] = useState(false);
  const [existingDocumentObj, setExistingDocumentobj] = React.useState<any>({});
  const [nestedDialogOpen, setNestedDialogOpen] = useState(false);
  const handleNestedDialogOpen = () => setNestedDialogOpen(true);
  const [documentTaskTitle, setDocumentTaskTitle] = useState("");
  const [documentTaskDescription, setDocumentTaskDescription] = useState("");
  const userInfo = userSessionInfo.logUserInfo();
  const [errorMessage, setErrorMessage] = useState<any>();
  const [successMessage, setSuccessMessage] = useState<any>();
  const [documentUrl, setDocumentUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>("");
  const [existingDraftMessage, setExistingDraftMessage] = useState(
    "Changes To the Aggrement of Sale are limited to the demograpic details,with Valid KYC documents or booked unit corrections"
  );
  let selectedDocumentNames = [
    {
      task_title: "Agreement Of Sale",
      task_type: "agreement_of_sale",
    },
    {
      task_title: "Sale Deed",
      task_type: "sale_deed",
    },
    {
      task_title: "Hand Over Document",
      task_type: "handover_document",
    },
  ];
  const getMyTasks = async () => {
    try {
      dispatch(showSpinner());
      const userInfo = userSessionInfo.logUserInfo();
      if (!userInfo) {
        const apiResponse: IAPIResponse = await httpService(
          MODULES_API_MAP.AUTHENTICATION,
          `${GLOBAL_API_ROUTES.MY_TASKS}?cust_unit_id=${cust_unit_id}`
        ).GET();
        if (apiResponse?.success) {
          setCustUnitDetails(apiResponse?.data?.[0]);
          setCompletedTasks(apiResponse?.data?.[0]?.closedTasks);
          setPendingTasks(apiResponse?.data?.[0]?.pendingTasks);
        }
        dispatch(hideSpinner());
      } else if (userInfo?.user_type_id == "internal") {
        const {
          data,
          status: responseStatus,
          message,
        }: any = await Api.get("crm_tasks_list", {
          cust_unit_id: custUnitId,
        });
        setCustUnitDetails(data?.[0]);
        setCompletedTasks(data?.[0]?.closedTasks);
        setPendingTasks(data?.[0]?.pendingTasks);
        let changeRequestData = data?.[0]?.pendingTasks.filter(
          (item: any, index: number) => {
            return (
              item?.task_type == "agreement_of_sale" &&
              (item?.doc_task_status == "assigned_to_RM" ||
                item?.doc_task_status == "assigned_existing_document_to_customer" ||
                item?.doc_task_status == "assigned_new_document_to_customer"
              )
            );
          }
        );
        setChangeRequestTasks(changeRequestData);
        if (changeRequestData?.length > 0) {
          let pendingTask = data?.[0]?.pendingTasks.filter(
            (item: any, index: number) => {
              return (
                item?.task_type != "agreement_of_sale" &&
                (item?.doc_task_status != "assigned_to_RM" ||
                  item?.doc_task_status !=
                  "assigned_existing_document_to_customer" ||
                  item?.doc_task_status != "assigned_new_document_to_customer"
                )
              );
            }
          );
          setPendingTasks(pendingTask);
        }
      }
    } catch (error) { }
  };
  useEffect(() => {
    getMyTasks();
  }, [cust_unit_id]);

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
      `${MODULES_API_MAP.AUTHENTICATION + GLOBAL_API_ROUTES.DOWNLOAD_DOCUMNETS
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
    } else {
      //console.log("file not found");
    }
  };

  const handleExistingDocument = async (item: any) => {
    setExistingModal(true);
    setExistingDocumentobj(item);
  };


  const submitRevisedDraft = async (revisedObj: any) => {
    setNestedDialogOpen(true);
    setDisableTitle(true);
    let taskTitle = selectedDocumentNames?.filter((name: any, index: any) => {
      return name.task_type == revisedObj?.task_type;
    });
    setDocumentTaskTitle(revisedObj?.task_type);
    setDocumentTaskDescription(
      "You have Requested To Change to your aggrement of Sale.Please Review the revised Draft and Approve it if everything is sastifactory.If Furthur versions are needed.you may request another changes"
    );
  };

  const submitExistingModel = async () => {

    let existingObj = {
      doc_task_status: "assigned_existing_document_to_customer",
      task_description: existingDraftMessage,
      task_note_originator: existingDraftMessage,
      last_modified_date: new Date(),
      last_modified_by: userInfo?.rm_user_name,
      task_id: existingDocumentObj?.task_id,
    };
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("crm_update_existing_document", existingObj);
    dispatch(showSpinner());
    if (responseStatus) {
      setExistingModal(false);
      getMyTasks();
      toast.success(message);
    } else {
    }
    dispatch(hideSpinner());
  };
  const handleNestedDialogClose = async () => {
    setNestedDialogOpen(false);
    setDocumentTaskTitle("");
    setDocumentTaskDescription("");
    setDocumentUrl("");
    setSelectedFile("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleUploadImage = async (event: any) => {
    const file = event.target.files[0];
    const uploadedFileSizeInKB = (file?.size ?? 0) / 1024;
    if (!file || !SUPPORTED_FILE_TYPES.includes(file.type)) {
      setErrorMessage("Please select only  PDF file");
      return;
    }
    if (!file || uploadedFileSizeInKB < 20 || uploadedFileSizeInKB > 2048) {
      setErrorMessage(
        `Document size should be more than 20KB and less than 2MB.`
      );
    } else {
      setSelectedFile(file);
      let url_name = "documents_upload";
      const formData: any = new FormData();
      formData.append("file", file);
      formData.append("cust_profile_id", customerId);
      formData.append("document_name", documentTaskTitle);
      const { status, data, message } = await Api.post(url_name, formData);
      if (status) {
        setDocumentUrl(data.data);
        setSuccessMessage("Document Uploaded Successfully");
        setErrorMessage("");
      } else {
        setDocumentUrl("");
        setErrorMessage(message);
      }
    }
  };

  const propertyDocumentUploadSubmitHandle = async (e: any) => {
    e.preventDefault();
    let taskTitle = selectedDocumentNames?.filter((name: any, index: any) => {
      return name.task_type == documentTaskTitle;
    });
    let propertyDocObj = {
      task_type: documentTaskTitle,
      task_title: taskTitle[0]?.task_title,
      doc_task_status: !disableTitle
        ? "assigned_to_customer"
        : "assigned_new_document_to_customer",
      date_of_completion: new Date(),
      document_url: documentUrl,
      task_description: documentTaskDescription,
      cust_unit_id: custUnitId,
      crm_executive_id: userInfo?.rm_user_name,
      task_notes_originator: documentTaskDescription,
      task_notes_responder: "",
      last_modified_by: userInfo?.rm_user_name,
      last_modified_date: new Date(),
    };
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("crm_property_documents_tasks", propertyDocObj);
    dispatch(showSpinner());
    if (responseStatus) {
      toast.success(message);
      setDocumentTaskTitle("");
      setDocumentTaskDescription("");
      setDocumentUrl("");
      setSelectedFile("");
      setErrorMessage("");
      setSuccessMessage("");
      setNestedDialogOpen(false);
      setDisableTitle(false);
      getMyTasks();
    } else {
      toast.error(message);
    }
    dispatch(hideSpinner());
  };

  const isCompleteUpload =
    documentTaskTitle != "" &&
    documentTaskDescription != "" &&
    selectedFile != "";


  return (
    <div className="my-task-cont">
      {userInfo && <div>
        <p className="tw-font-bold tw-text-black">Change requests</p>
        <p className=" tw-text-black tw-mb-3 tw-text-sm">
          The customer has requested that the following task be verified and
          reassigned.
        </p>
      </div>
      }

      {changeRequestTasks?.length > 0 &&
        changeRequestTasks?.map((item: any, index: number) => {
          return (
            <div>
              <Accordion
                defaultExpanded
                style={{
                  border: "1px solid #DFE1E7",
                  borderRadius: "0.5rem",
                  marginRight: "2rem",
                  marginBottom: "1rem",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div className="tw-flex">
                    <img
                      src="/images/document_icon.png"
                      className="tw-cursor-pointer tw-mr-4"
                      width={45}
                      height={45}
                      alt='document'
                    />
                    <div>
                      <p className="lite"> Tower{custUnitDetails?.tower_code}-{custUnitDetails?.floor_no}{custUnitDetails?.unit_no}, {custUnitDetails?.project_name}</p>
                      <p className="tw-font-bold">
                        Approve draft of legal documents
                      </p>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      backgroundColor: " #F3F5F6",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <div className="tw-flex tw-justify-between tw-m-3">
                      <div className="tw-ml-2 tw-mt-2">
                        <p className="lite">Subject</p>
                        <p className="tw-font-bold">{item?.subject}</p>
                      </div>
                    </div>
                    <div className="tw-ml-5 tw-mb-7">
                      <p className="lite">Message</p>
                      <p className="tw-text-black tw-mb-7">
                        {item?.doc_task_status == "assigned_to_RM"  ? item?.task_notes_responder: item?.task_description}
                      </p>
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-end tw-gap-5">
                    <Button
                      onClick={() => downloadDocuments(item?.document_url)}
                      variant="outlined"
                      sx={{
                        color: "black",
                        borderColor: "black",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <span className="task_button">Download Draft</span>
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        color: "black",
                        borderColor: "black",
                        borderRadius: "0.5rem",
                      }}
                      onClick={() => {
                        handleExistingDocument(item);
                      }}
                      disabled={item?.doc_task_status == "assigned_existing_document_to_customer" || item?.doc_task_status == "assigned_new_document_to_customer"}
                    >
                      <span className="task_button">Send Existing Draft</span>
                    </Button>

                    <Button
                      onClick={() => submitRevisedDraft(item)}
                      variant="outlined"
                      sx={{
                        color: "black",
                        borderColor: "black",
                        borderRadius: "0.5rem",
                      }}
                      disabled={item?.doc_task_status == "assigned_existing_document_to_customer" || item?.doc_task_status == "assigned_new_document_to_customer"}
                    >
                      <span className="task_button">Send Revised Draft</span>
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
      <p className="text-pri-all tw-my-4 tw-font-bold">Pending Tasks</p>
      {(pendingTasks || [])?.map((task: any, index: any) => {
        return (
          <MyTaskCard
            key={index}
            task={task}
            custUnitDetails={custUnitDetails}
            setCurrentTab={props?.setCurrentTab}
            getMyTasks={getMyTasks}
          />
        );
      })}
      <p className="text-pri-all tw-my-4 tw-font-bold">Completed Tasks</p>
      {(completedTasks || [])?.map((task: any, index: any) => {
        return (
          <MyTaskCard
            key={index}
            task={task}
            custUnitDetails={custUnitDetails}
            setCurrentTab={props?.setCurrentTab}
            getMyTasks={getMyTasks}
          />
        );
      })}

      <div>
        <Dialog open={existingModal} onClose={() => setExistingModal(false)}>
          <div className="tw-flex tw-justify-between tw-p-4">
            <ArrowBackIcon />
            <img
              src="/images/cross-icon.svg"
              className="tw-cursor-pointer"
              alt="Close"
              onClick={() => setExistingModal(false)}
            />
          </div>
          <DialogContent>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography sx={{ fontWeight: "bold", textTransform: "none" }}>
                  <p style={{ textTransform: "none" }}>
                    Send Back the Existing Draft
                  </p>
                </Typography>
              }
            />
            <div>
              <div>
                <p style={{ color: "#656C7B", marginTop: "1rem" }}>
                  <span className="red-star">*</span> Message
                </p>
                <TextField
                  sx={{ mt: 3, width: "432px" }}
                  fullWidth
                  placeholder="Enter short description about the document"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={existingDraftMessage}
                  onChange={(e) => {
                    setExistingDraftMessage(e.target.value);
                  }}
                  disabled={
                    existingDocumentObj?.doc_task_status ===
                    "assigned_existing_document_to_customer"
                  }
                />
              </div>
            </div>
            <div className="tw-mt-10">
              <button
                style={{
                  backgroundColor:
                    existingDocumentObj?.doc_task_status ===
                      "assigned_existing_document_to_customer"
                      ? "#cccccc" // Grey background for disabled state
                      : "#000000", // Black background for enabled state
                  color: "#FFFFFF",
                  border: "1px solid #000000",
                  borderRadius: "5px",
                  padding: "0.5rem",
                  cursor:
                    existingDocumentObj?.doc_task_status ===
                      "assigned_existing_document_to_customer"
                      ? "not-allowed" // Change cursor for disabled state
                      : "pointer",
                  width: "420px",
                  opacity:
                    existingDocumentObj?.doc_task_status ===
                      "assigned_existing_document_to_customer"
                      ? 0.6 // Reduce opacity for disabled state
                      : 1,
                }}
                onClick={submitExistingModel}
                disabled={
                  existingDocumentObj?.doc_task_status ===
                  "assigned_existing_document_to_customer"
                }
              >
                Send Back To Customer
              </button>
            </div>
            {/* ... other content ... */}
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Dialog open={nestedDialogOpen} onClose={handleNestedDialogClose}>
          <div className="tw-flex tw-justify-between tw-p-4">
            <ArrowBackIcon />
            <img
              src="/images/cross-icon.svg"
              className="tw-cursor-pointer"
              onClick={handleNestedDialogClose}
            />
          </div>
          <DialogContent>
            <p className="tw-font-bold tw-mb-3">Draft document verification</p>
            <div>
              <div className="text_field_top">
                <p style={{ color: "#656C7B" }}>
                  <span className="red-star">*</span> Task title
                </p>

                <Select
                  sx={{ mt: 3, width: "432px" }}
                  className="mb-4"
                  fullWidth
                  variant="outlined"
                  value={documentTaskTitle}
                  onChange={(e) => {
                    setDocumentTaskTitle(e.target.value);
                  }}
                  disabled={disableTitle}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {selectedDocumentNames.map((doc: any, index: any) => (
                    <MenuItem key={index} value={doc.task_type}>
                      {doc.task_title}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div>
                <p style={{ color: "#656C7B", marginTop: "1rem" }}>
                  <span className="red-star">*</span> Description
                </p>
                <TextField
                  sx={{ mt: 3, width: "432px" }}
                  className="message"
                  fullWidth
                  placeholder="Enter short description about the document"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={documentTaskDescription}
                  onChange={(e) => {
                    setDocumentTaskDescription(e.target.value);
                  }}
                />
              </div>
            </div>
            <p className="tw-mt-7" style={{ color: "#656C7B" }}>
              <span className="red-star">*</span> Upload document
            </p>
            <div>
              <TextField
                type="file"
                id="myFile"
                name="filename"
                sx={{ mt: 3, width: "432px" }}
                onChange={handleUploadImage}
                disabled={
                  documentTaskTitle == "" || documentTaskDescription == ""
                    ? true
                    : false
                }
              />
              <p style={{ color: "#989FAE", marginTop: "2px" }}>
                Supported files: pdf only
              </p>
            </div>
            {errorMessage && (
              <div className="tw-text-red-500 tw-my-1">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="tw-text-green-500 tw-my-1">{successMessage}</div>
            )}
            <div className="tw-m-2">
              <p style={{ color: "#656C7B" }}>Remind customer via</p>
              <div className="tw-mt-2">
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="SMS"
                />
                <FormControlLabel
                  style={{ marginLeft: "9rem" }}
                  control={<Checkbox defaultChecked />}
                  label="Email"
                />
              </div>
              <DialogActions style={{ marginTop: "4rem", marginRight: "3rem" }}>
                {/* <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    padding: "0.4rem 5.5rem",
                    borderRadius: "8px",
                  }}
                  onClick={(e) => propertyDocumentUploadSubmitHandle(e)}
                >
                  Assign
                </Button> */}
                <Button
                  style={
                    !isCompleteUpload
                      ? {}
                      : {
                        backgroundColor: "#000000",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "5px",
                        padding: "10px 20px",
                        cursor: "pointer",
                        marginRight: "1rem",
                      }
                  }
                  onClick={(e) => propertyDocumentUploadSubmitHandle(e)}
                  disabled={!isCompleteUpload}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "black", borderColor: "black" }}
                  onClick={handleNestedDialogClose}
                >
                  Close
                </Button>
              </DialogActions>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyTasks;
