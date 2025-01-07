import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Modal,
  Box,
  OutlinedInput,
  DialogContentText,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import { Dialog, DialogContent, DialogActions, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch } from "@Src/app/hooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { toast } from "react-toastify";
import Api from "../../api/Api";
import userSessionInfo from "../../util/userSessionInfo";
import documentConfig from '@Src/config/configaration.json'

const modalContentStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "auto",
  width: "90%",
  maxWidth: "500px",
  bgcolor: "white",
  borderRadius: "6px",
  boxShadow: 24,
  padding: "24px",
  overflowY: "auto",
  "@media (max-width: 600px)": {
    width: "90%",
  },
};

const SUPPORTED_FILE_TYPES = documentConfig?.MarketingImages?.SUPPORTED_FILE_TYPES;

// const isFile = (value: unknown): value is File => {
//   return value instanceof File;
// };

const isFile = (value: any): value is File => value && value instanceof File;
interface IFormInputs {
  title: string | null;
  description: string;
  navigationLink: string | null;
  document: File | null | string;
}

interface ConstructionData {

  title: string;
  description: string;
  images_url: string;
  action: string;
  images_id: string;
 
  document: string;
  navigation_link:string;
 
}

const ConstructionUpdates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const userInfo = userSessionInfo.logUserInfo();
  const [constructionData, setConstructionData] = useState<any>([]);
  const [projectData, setProjectData] = useState<any>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingImgId, setEditingImgId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [documentFileName, setDocumentFileName] = useState<string | null>(null);
  const [deleteConstructionUpdate, setDeleteConstructionUpdates] =
    useState<any>({});
  const schema = yup.object().shape({
    title: yup
      .string()
      .typeError("Title is required")
      .nullable("Title is required")
      .required("Title is required"),
    description: yup.string().required("Description is required"),
    navigationLink: yup.string().required("Navigation is required"),
    document: yup
      .mixed()
      .test("isFileOrString", "Image is required", (value) => {
        // Validate if the value is a non-empty string (URL) or a file
        return isEditMode
          ? value && typeof value === "string" // In edit mode, allow string (URL)
          : value && isFile(value); // In non-edit mode, require a file
      })
      .test(
        "fileType",
        " Please upload this format jpeg, jpg, png",
        (value) =>
          !isFile(value) ||
          (isFile(value) && SUPPORTED_FILE_TYPES.includes(value.type))
      )
      .test(
        "fileSize",
        "File size is too large, File should be below 2MB",
        (value) =>
          !isFile(value) || (isFile(value) && value.size <= documentConfig?.MarketingImages?.minimumSize * documentConfig?.MarketingImages?.maximumSize)
      ),
  });

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const handleEdit = (row: ConstructionData) => {
    console.log("Editing row: ", row);
    setIsEditMode(true);
    setEditingImgId(row?.images_id);
    setValue("title", row?.title);
    setValue("description", row?.description);
    setValue("navigationLink", row?.navigation_link);
    setOpen(true);
    setImageUrl(row?.images_url);
    setEditingImgId(row?.images_id);
    setValue("document", row?.images_url);
    setDocumentFileName(row?.images_url.split("/").pop() || null);
  };

  const handleDelete = (row: ConstructionData) => {
    setOpenDelete(true);
    setDeleteConstructionUpdates(row);
    setDocumentFileName(null)
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const [queryType, setQueryType] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setQueryType(event.target.value);
  };
  const [open, setOpen] = useState(false);
  const [documentType, setDocumentType] = useState("");

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setValue("title", "");
    setValue("description", "");
    setValue("navigationLink", "");
    setImageUrl("");
    setDocumentFileName(null)
    reset();
  };

  const handleOpen = () => {
    setOpen(true);
    reset();
    setImageUrl(null)
  };

  const handleDocumentTypeChange = (event: any) => {
    setDocumentType(event.target.value);
  };

  const years = Array.from(
    new Array(50),
    (val, index) => new Date().getFullYear() - index
  );

  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

  const monthMap: any = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const getConstructionImages = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_get_marketing_images", {});
    if (responseStatus) {
      setConstructionData(data);
    } else {
      setConstructionData([]);
    }
  };

  const getProjectsList = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_projects_list", {});
    if (responseStatus) {
      setProjectData(data);
    } else {
      setProjectData([]);
    }
  };

  useEffect(() => {
    getConstructionImages();
    getProjectsList();
  }, [open, isEditMode, openDelete]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue("document", file);
    if (file) {
        setDocumentFileName(file.name); // Set the file name when a file is selected
    } else {
        setDocumentFileName(null); // Reset if no file is selected
    }
    // Trigger validation only if the file is not null
    if (file) {
        let uploadedFile = await handleFileUpload(file);
        setImageUrl(uploadedFile?.data);
        trigger("document"); // Trigger validation only if a file is selected
    }
};

  const handleFileUpload = async (document: File | null) => {
    try {
      if (!document) {
        return;
      }
      let url_name = "documents_upload";
      const formData: any = new FormData();
      formData.append("file", document);
      formData.append("cust_profile_id", userInfo?.login_user_id);
      formData.append("document_name", "marketing_images");
      const { status, data, message } = await Api.post(url_name, formData);
      return data;
    } catch {
      toast.error("Error uploading the file");
    }
  };

  const uploadConstructionImages = async (payload: IFormInputs) => {
    console.log("payload",payload,imageUrl);

    try {
      dispatch(showSpinner());
      // let uploadedFile = await handleFileUpload(payload?.document);
      let constructionObj: any = {
        images_url: imageUrl,
        title: payload?.title,
        description: payload?.description,
        navigation_link: payload?.navigationLink,
      };
      if (editingImgId) {
        constructionObj.images_id = editingImgId;
      }
      console.log("constructionObj",constructionObj,isEditMode , editingImgId)
      const {
        data,
        status: responseStatus,
        message,
      }: any = await Api.post("crm_marketing_images", constructionObj);
      if (responseStatus) {
        toast.success("Marketing Image Inserted Successfully");
        setOpen(false);
        reset();
        setValue("title", "");
        setValue("description", "");
        setValue("navigationLink", "");
        setImageUrl("");
        setEditingImgId("")
        setDocumentFileName(null);
        getConstructionImages()
      } else {
        toast.error("Error uploading Consteruction proof");
      }
      dispatch(hideSpinner());
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      toast.error("Error uploading payment proof");
    }
  };

  const onSubmit = async (data: IFormInputs) => {
    await uploadConstructionImages(data);
    setOpen(false);
  };

  const deleteConstructionUpdates = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("delete_crm_delete", {
      id: deleteConstructionUpdate?.images_id,
      type: "marketing_images",
    });
    if (responseStatus) {
      toast.success(message);
      setOpenDelete(false);
    } else {
      toast.success(message);
    }
  };

  return (
    <>
      <div className="tw-pl-2 tw-pr-6 tw-pb-6">
        <div className="tw-flex tw-flex-col tw-gap-4">
          <p className="tw-text-2xl tw-font-bold tw-text-black tw-mt-5">
            Marketing Images
          </p>
        </div>
        <div className="tw-flex tw-justify-end">
          <div>
            <Button
              onClick={handleOpen}
              variant="contained"
              disableElevation
              sx={{
                marginTop: "13px",
                marginBottom: "13px",
                marginRight: "3px",
                textTransform: "none",
                backgroundColor: "black",
                "&:hover": { backgroundColor: "black" },
              }}
            >
              Add
              <PlusOneIcon />
            </Button>
          </div>
        </div>

        <TableContainer
          component={Paper}
          style={{ overflowX: "auto", borderRadius: "0.5rem" }}
        >
          <Table aria-label="simple table">
            <TableHead className="tw-bg-[#008B8B]">
              <TableRow>
                <TableCell className="!tw-text-white !tw-text-lg tw-w-64" align="center">Title</TableCell>
                <TableCell className="tw-mr-10 !tw-text-white !tw-text-lg" align="center">
                Description
                </TableCell>
                <TableCell className="!tw-text-white !tw-text-lg tw-w-96" align="center">Navigation Link</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg tw-w-48" align="center">Image</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {constructionData.map((row: any, index: any) => (
                <TableRow key={index} className="tw-bg-white">
                  <TableCell>
                    <p className="tw-font-bold">{row.title}</p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold tw-flex tw-justify-start tw-ml-10">
                      {row.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold tw-flex tw-justify-center">
                      {row.navigation_link}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="tw-w-36 tw-h-36 tw-rounded-md tw-overflow-hidden tw-border tw-border-gray-100 tw-flex tw-justify-start">
                      {row?.images_url?.endsWith(".pdf") ? (
                        <iframe
                          src={row?.images_url}
                          title="construction Updates"
                          width="100%"
                          height="100%"
                          style={{ border: "none" }}
                        />
                      ) : (
                        <img
                          src={row.images_url}
                          alt={"construction update"}
                          className="tw-w-full tw-h-full tw-object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(row)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(row)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalContentStyle}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="tw-flex tw-justify-between">
                <p className="tw-font-bold tw-text-2xl tw-text-black">
                  Marketing Images
                </p>
                <p className="tw-cursor-pointer" onClick={handleClose}>
                  <CloseIcon />
                </p>
              </div>
              <div className="tw-flex tw-flex-col tw-flex-start">
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Title</span>
                </div>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      fullWidth
                      {...field}
                      placeholder="Enter Image Title"
                      error={!!errors.title}
                      onFocus={() => clearErrors("title")}
                      onBlur={() => trigger("title")}
                      inputProps={{ maxLength: 500 }}
                      onChange={(e) => {
                        const value = e.target.value; // Get the input value
                        // Allow leading spaces but remove spaces from the rest
                        field.onChange(value.replace(/\s{2,}/g, ' ')); // Replace multiple spaces with a single space
                      }}
                    />
                  )}
                />
                
                <p className="tw-text-red-500">{errors.title?.message}</p>

                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Description</span>
                </div>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      fullWidth
                      {...field}
                      placeholder="Enter Image Title"
                      error={!!errors.description}
                      onFocus={() => clearErrors("description")}
                      onBlur={() => trigger("description")}
                      inputProps={{ maxLength: 500 }}
                      onChange={(e) => {
                        const value = e.target.value; // Get the input value
                        // Allow leading spaces but remove spaces from the rest
                        field.onChange(value.replace(/\s{2,}/g, ' ')); // Replace multiple spaces with a single space
                      }}
                    />
                  )}
                />
                <p className="tw-text-red-500">{errors.description?.message}</p>
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Navigation Link</span>
                </div>
                <Controller
                  name="navigationLink"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      fullWidth
                      {...field}
                      placeholder="Enter Image Title"
                      error={!!errors.navigationLink}
                      onFocus={() => clearErrors("navigationLink")}
                      onBlur={() => trigger("navigationLink")}
                      inputProps={{ maxLength: 500 }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, ''); // Remove spaces
                        field.onChange(value);
                      }}
                    />
                  )}
                />
                <p className="tw-text-red-500">{errors.navigationLink?.message}</p>
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Upload document</span>
                </div>
                <div>
                <Controller
                  name="document"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        onFocus={() => clearErrors("document")}
                        style={{ display: "none" }} // Hide the default file input
                      />
                      <Box display="flex" alignItems="center">
                        <label
                          htmlFor="file-upload"
                          className="custom-file-upload"
                        >
                          <Button
                            variant="outlined" // Use outlined variant for a white button
                            component="span"
                            size="small"
                            sx={{
                              backgroundColor: "white", // Set background to white
                              color: "black", // Set text color to black
                              "&:hover": {
                                backgroundColor: "#f0f0f0", // Optional: change on hover
                              },
                            }}
                          >
                            Choose File
                          </Button>
                        </label>
                        {documentFileName && (
                          <Typography variant="body1" sx={{ marginLeft: 2 }}>
                            File: {documentFileName}
                          </Typography>
                        )}
                      </Box>

                     
                    </div>
                  )}
                />
                  <p className="tw-text-red-500">{errors.document?.message}</p>
                </div>
                <p className="fs13">Supported files: {documentConfig?.MarketingImages?.supportedFormat}</p>

                <div className="tw-flex tw-justify-end tw-gap-6 tw-items-center tw-mt-6">
                  <button className="bg-white-btn-util" onClick={handleClose}>
                    Close
                  </button>
                  <button type="submit" className="bg-black-btn-util" disabled ={imageUrl == null || imageUrl == "" ? true : false}>
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </Box>
        </Modal>
      </div>

      <div>
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <div className="tw-flex tw-justify-between tw-p-3">
            <p className="tw-font-bold tw-text-2xl tw-text-black">
              Delete Confirmation
            </p>
            <p
              className="tw-cursor-pointer"
              onClick={() => setOpenDelete(false)}
            >
              <CloseIcon />
            </p>
          </div>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button color="error" onClick={deleteConstructionUpdates}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ConstructionUpdates;
