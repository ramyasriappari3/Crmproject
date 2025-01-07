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

const project_Logo_SUPPORTED_FILE_TYPES = documentConfig?.ProjectLogs?.SUPPORTED_FILE_TYPES

const project_Banner_SUPPORTED_FILE_TYPES = documentConfig?.ProjectBanner?.SUPPORTED_FILE_TYPES


const isFile = (value: any): value is File => value && value instanceof File;
interface IFormInputs {
  projectName: string | null;
  projectDescription: string | null;
  projectLogo: File | null | string;
  projectBanner: File | null | string;
}

interface ConstructionData {
  project_name: string;
  project_description:string;
  project_id:string;
  project_logo:string;
  project_banner:string;


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
  const [projectLogoUrl,setProjectLogoUrl] = useState("");
  const [projectBannerUrl,setProjectBannerUrl] = useState("")
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [bannerFileName, setBannerFileName] = useState<string | null>(null);
  const [deleteConstructionUpdate, setDeleteConstructionUpdates] =
    useState<any>({});
    const schema = yup.object().shape({
      projectName: yup.string().required("Project Name is required"),
      projectDescription: yup.string().required("Project Description is required"),
      projectLogo: yup
      .mixed()
      .test("isFileOrString", "Image is required", (value) => {
          // Allow empty value in edit mode
          return isEditMode ? true : (value && isFile(value));
      })
      .test(
          "fileType",
          "Unsupported file format",
          (value) =>
              !isFile(value) ||
              (isFile(value) && project_Logo_SUPPORTED_FILE_TYPES.includes(value.type))
      )
      .test(
          "fileSize",
          "File size is too large, File should be below 2MB",
          (value) =>
              !isFile(value) || (isFile(value) && value.size <= documentConfig?.ProjectLogs?.maximumSize * documentConfig?.ProjectLogs?.minimumSize)
      ),
      projectBanner: yup
      .mixed()
      .test("isFileOrString", "Image is required", (value) => {
          // Allow empty value in edit mode
          return isEditMode ? true : (value && isFile(value));
      })
      .test(
          "fileType",
          "Unsupported file format",
          (value) =>
              !isFile(value) ||
              (isFile(value) && project_Banner_SUPPORTED_FILE_TYPES.includes(value.type))
      )
      .test(
          "fileSize",
          "File size is too large, File should be below 2MB",
          (value) =>
              !isFile(value) || (isFile(value) && value.size <= documentConfig?.ProjectBanner?.maximumSize * documentConfig?.ProjectBanner?.minimumSize)
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
    setIsEditMode(true); // Set to edit mode
    setEditingImgId(row?.project_id); // Track the row being edited
    setValue("projectName", row?.project_id); // Set project name
    setValue("projectDescription", row?.project_description); // Set project description
    setValue("projectLogo",row?.project_logo)
    setValue("projectBanner",row?.project_banner)
    setProjectLogoUrl(row?.project_logo); // Set existing logo URL
    setProjectBannerUrl(row?.project_banner); // Set existing banner URL
    setOpen(true); // Open modal
    setLogoFileName(row?.project_logo.split("/").pop() || null);
    setBannerFileName(row?.project_banner.split("/").pop() || null);
};

  const handleDelete = (row: ConstructionData) => {
    setOpenDelete(true);
    setDeleteConstructionUpdates(row);
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
    // setIsEditMode(false);
    setValue("projectName", "");
    setValue("projectDescription","");
    setValue("projectBanner","");
    setValue("projectLogo","");
    // setValue("year", "");
    // setValue("month", "");
    // setValue("imageTitle", "");
    // setImageUrl("");
    setLogoFileName(null)
    setBannerFileName(null)
    reset();
  };

  const handleOpen = () => {
    setOpen(true);
    reset();
    setProjectLogoUrl("")
    setProjectBannerUrl("")
  };

  const handleDocumentTypeChange = (event: any) => {
    setDocumentType(event.target.value);
  };

 
  const getConstructionImages = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_get_construction_images", {});
    if (responseStatus) {
      const sortedData = data.sort((a: any, b: any) => {
        if (parseInt(a.year) !== parseInt(b.year)) {
          return parseInt(b.year) - parseInt(a.year);
        }
      });
      setConstructionData(sortedData);
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
    // getConstructionImages();
    getProjectsList();
  }, [open, isEditMode, openDelete]);

 // File change handlers
const handleFileProjectLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  setValue("projectLogo", file);
  if (file) {
      setLogoFileName(file.name); // Set the file name when a file is selected
  } else {
      setLogoFileName(null); // Reset if no file is selected
  }
  // Trigger validation only if the file is not null
  if (file) {
      let uploadedFile = await handleFileUpload(file);
      setProjectLogoUrl(uploadedFile?.data);
      trigger("projectLogo"); // Trigger validation only if a file is selected
  }
};




const handleFileProjectBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  setValue("projectBanner", file);
  if (file) {
      setBannerFileName(file.name); // Set the file name when a file is selected
  } else {
    setBannerFileName(null); // Reset if no file is selected
  }
  // Trigger validation only if the file is not null
  if (file) {
      let uploadedFile = await handleFileUpload(file);
      setProjectBannerUrl(uploadedFile?.data);
      trigger("projectBanner"); // Trigger validation only if a file is selected
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
      formData.append("document_name", "project_logos");
      const { status, data, message } = await Api.post(url_name, formData);
      return data;
    } catch {
      toast.error("Error uploading the file");
    }
  };

  const uploadConstructionImages = async (payload: IFormInputs) => {
    console.log("payload",payload,projectBannerUrl,projectLogoUrl);

    try {
      dispatch(showSpinner());
      // let uploadedFile = await handleFileUpload(payload?.document);
      // let constructionObj: any = {
      //   project_id: payload?.projectName,
      //   project_logo: projectLogoUrl,
      //   project_banner:projectBannerUrl,
      //   project_description:payload?.projectDescription
      // };

      const constructionObj: any = {
        project_id: payload.projectName,
        project_description: payload.projectDescription,
        project_logo: projectLogoUrl || payload.projectLogo, // Use existing URL if no new file
        project_banner: projectBannerUrl || payload.projectBanner, // Use existing URL if no new file
    };
      
      const {
        data,
        status: responseStatus,
        message,
      }: any = await Api.post("crm_update_project_logs", constructionObj);
      if (responseStatus) {
        toast.success("Project Logo And Project Banner Image Successfully");
        setOpen(false);
        reset();
        setValue("projectName", "");
        setValue("projectLogo", "");
        setValue("projectBanner", "");
        setValue("projectDescription", "");
        setProjectBannerUrl("");
        setProjectLogoUrl("");
        setLogoFileName(null);
        setBannerFileName(null);
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
      type: "construction_updates",
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
            Project Logo
          </p>
        </div>
        {/* <div className="tw-flex tw-justify-end">
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
        </div> */}

        <TableContainer
          component={Paper}
          style={{ overflowX: "auto", borderRadius: "0.5rem", marginTop: '16px' }}

        >
          <Table aria-label="simple table">
            <TableHead className="tw-bg-[#008B8B]">
              <TableRow>
                <TableCell className="tw-w-36 !tw-text-white !tw-text-lg">Project Name</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg tw-w-[40rem] " align="center">Description</TableCell>
                <TableCell className="tw-mr-10 !tw-text-white !tw-text-lg" align="center">
                  Project Logo
                </TableCell>
                <TableCell align="center" className="!tw-text-white !tw-text-lg">Project Banner</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg tw-w-16">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectData.map((row: any, index: any) => (
                <TableRow key={index} className="tw-bg-white">
                  <TableCell>
                    <p className="tw-font-bold tw-text-[#2F4F4F]">{row.project_name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-text-justify tw-font-bold tw-text-[#2F4F4F]">{row.project_description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="tw-w-36 tw-h-36 tw-justify-center tw-rounded-md tw-overflow-hidden tw-border tw-border-gray-100 tw-flex">
                      {row?.project_logo?.endsWith(".pdf") ? (
                        <iframe
                          src={row?.project_logo}
                          title="Project logo"
                          width="100%"
                          height="100%"
                          style={{ border: "none" }}
                        />
                      ) : (
                        <img
                          src={row.project_logo}
                          alt={"Project logo"}
                          className="tw-w-full tw-h-full tw-object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="tw-w-36 tw-h-36 tw-rounded-md tw-overflow-hidden tw-border tw-border-gray-100 tw-flex tw-justify-start">
                      {row?.project_banner?.endsWith(".pdf") ? (
                        <iframe
                          src={row?.project_banner}
                          title="Project Banner"
                          width="100%"
                          height="100%"
                          style={{ border: "none" }}
                        />
                      ) : (
                        <img
                          src={row.project_banner}
                          alt={"Project Banner"}
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
                  Project Logos
                </p>
                <p className="tw-cursor-pointer" onClick={handleClose}>
                  <CloseIcon />
                </p>
              </div>
              <div className="tw-flex tw-flex-col tw-flex-start">
                <div className="tw-mb-1">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Project Name</span>
                </div>
                <Controller
                  name="projectName"
                  control={control}
                  rules={{ required: "Project Name is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!errors.projectName}
                      onFocus={() => clearErrors("projectName")}
                      onBlur={() => trigger("projectName")}
                    >
                      {projectData.map((project: any) => (
                        <MenuItem
                          key={project.project_id}
                          value={project.project_id}
                        >
                          {project.project_name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <p className="tw-text-red-500">{errors.projectName?.message}</p>
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Description</span>
                </div>
                <Controller
                  name="projectDescription"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      fullWidth
                      {...field}
                      placeholder="Enter Image Title"
                      error={!!errors.projectDescription}
                      onFocus={() => clearErrors("projectDescription")}
                      onBlur={() => trigger("projectDescription")}
                      inputProps={{ maxLength: 500 }}
                      onChange={(e) => {
                        const value = e.target.value; // Get the input value
                        // Allow leading spaces but remove spaces from the rest
                        field.onChange(value.replace(/\s{2,}/g, ' ')); // Replace multiple spaces with a single space
                      }}
                    />
                  )}
                />
                <p className="tw-text-red-500">{errors.projectDescription?.message}</p>
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Project Logo</span>
                </div>
                <div>
                <Controller
                  name="projectLogo"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileProjectLogoChange}
                        onFocus={() => clearErrors("projectLogo")}
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
                        {logoFileName && (
                          <Typography variant="body1" sx={{ marginLeft: 2 }}>
                            File: {logoFileName}
                          </Typography>
                        )}
                      </Box>
                    </div>
                  )}
                />
                  <p className="tw-text-red-500">{errors.projectLogo?.message}</p>
                </div>
                <p className="fs13">Supported files: {documentConfig?.ProjectLogs?.supportedFormat}</p>
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Project Banner</span>
                </div>
                <div>
                <Controller
                  name="projectBanner"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileProjectBannerChange}
                        onFocus={() => clearErrors("projectBanner")}
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
                        {bannerFileName && (
                          <Typography variant="body1" sx={{ marginLeft: 2 }}>
                            File: {bannerFileName}
                          </Typography>
                        )}
                      </Box>
                    </div>
                  )}
                />
                  <p className="tw-text-red-500">{errors.projectLogo?.message}</p>
                </div>
                <p className="fs13">Supported files: {documentConfig?.ProjectBanner?.supportedFormat}</p>

                <div className="tw-flex tw-justify-end tw-gap-6 tw-items-center tw-mt-6">
                  <button className="bg-white-btn-util" onClick={handleClose}>
                    Close
                  </button>
                  <button type="submit" className="bg-black-btn-util" disabled ={projectLogoUrl && projectBannerUrl == null || projectLogoUrl && projectBannerUrl == "" ? true : false}>
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
