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
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch } from "@Src/app/hooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { toast } from "react-toastify";
import Api from "../../api/Api";
import userSessionInfo from "../../util/userSessionInfo";
import { ENUMValues } from "../../../../../src/utils/globalUtilities";
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

const SUPPORTED_FILE_TYPES = documentConfig?.ProjectImages?.SUPPORTED_FILE_TYPES

const isFile = (value: unknown): value is File => {
  return value instanceof File;
};

interface IFormInputs {
  projectName: string | null;
  imageSequence: number | null;
  imageType: string;
  document: File | null | string;
}

interface projectImagesData {
  project_name: string;
  image_sequence: number;
  image_type: string;
  project_id: string;
  document: string;
  images_url: string;
  images_id: string;
}

const ConstructionUpdates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const userInfo = userSessionInfo.logUserInfo();
  const [projectImagesData, setProjectImagesData] = useState<any>([]);
  const [projectData, setProjectData] = useState<any>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingImgId, setEditingImgId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageTypeValues, setImageTypeValues] = useState<any>([]);
  const [sequenceArray, setSequenceArray] = useState<any>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteProjectData, setdeleteProjectData] = useState<any>({});
  const [disableFileds,setDisabledFields] =  useState(false);
  const [documentFileName, setDocumentFileName] = useState<string | null>(null);

  const schema = yup.object().shape({
    projectName: yup.string().required("Project Name is required"),
    imageSequence: yup.number().required("Image Sequence Is required"),
    imageType: yup.string().required("Image Type Is Required"),
    document: yup
      .mixed()
      .test("documentValidation", "Document is required", function (value) {
        const imageType = this.parent.imageType;
        if (
          imageType === "property video" ||
          imageType === "construction video"
        ) {
          return typeof value === "string" && value.trim() !== "";
        }
        return value instanceof File || typeof value === "string";
      })
      .test("fileSize", "File size must be between 2KB and 2MB", function (value) {
        if (value && value instanceof File) {
          const sizeInKB = value.size / 1024; // Convert bytes to KB
          return sizeInKB >= documentConfig?.ProjectImages?.minimumSize && sizeInKB <=  documentConfig?.ProjectImages?.maximumSize;
        }
        return true; 
      })
      .test("fileType", "Unsupported file type", function (value) {
        if (value && value instanceof File) {
          return SUPPORTED_FILE_TYPES.includes(value.type);
        }
        return true; 
      }),
  });

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const handleEdit = (row: projectImagesData) => {
    console.log("Editing row: ", row);
    setIsEditMode(true);
    setEditingImgId(row?.images_id);
    setValue("projectName", row?.project_id);
    setValue("imageSequence", row?.image_sequence);
    setValue("imageType", row?.image_type);
    setOpen(true);
    setImageUrl(row?.images_url);
    setEditingImgId(row?.images_id);
    setDisabledFields(true)
    setDocumentFileName(row?.images_url.split("/").pop() || null);
    // setValue("document", row?.images_url);
    if (
      row?.image_type === "property video" ||
      row?.image_type === "construction video"
    ) {
      setValue("document", row?.images_url);
    } else {
      setValue("document", row?.images_url);
    }
  };

  const handleDelete = (row: any) => {
    console.log("Deleting row: ", row);
    setOpenDelete(true);
    setdeleteProjectData(row);
    setDocumentFileName(null)
    reset()
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
    setValue("projectName", "");
    setValue("imageSequence", 0);
    setValue("imageType", "");
    setImageUrl("");
    setDocumentFileName(null)
    reset();
  };

  const handleOpen = () => {
    setOpen(true);
    reset();
    setValue("projectName", "");
    setValue("imageSequence", 0);
    setValue("imageType", "");
    setImageUrl(null);
  };

  const handleDocumentTypeChange = (event: any) => {
    setDocumentType(event.target.value);
  };

  const getProjectImages = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_get_project_images", {});
    if (responseStatus) {
      let imageData = data?.sort((a: any, b: any) => {
        return parseInt(a.image_sequence) - parseInt(b.image_sequence);
      });
      let imageSequence = imageData?.map((item: any) => ({
        image_sequence: item.image_sequence,
      }));
      setProjectImagesData(imageData);
      setSequenceArray(imageSequence);
    } else {
      setProjectImagesData([]);
      setSequenceArray([]);
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

  const getImageTypeValues = async () => {
    let imageType = await ENUMValues("image_type_values");
    setImageTypeValues(imageType);
  };

  useEffect(() => {
    getProjectImages();
    getProjectsList();
    getImageTypeValues();
    getProjectsList();
  }, [open,openDelete]);

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
      formData.append("document_name", "construction_images");
      const { status, data, message } = await Api.post(url_name, formData);
      return data;
    } catch {
      toast.error("Error uploading the file");
    }
  };

  const uploadProjectImages = async (payload: IFormInputs) => {
    try {
      dispatch(showSpinner());
      let projectImagesObj: any = {
        project_id: payload?.projectName,
        images_url: imageUrl,
        image_sequence: payload?.imageSequence,
        image_type: payload?.imageType,
      };
      console.log("projectImagesObj", projectImagesObj);
      if (isEditMode && editingImgId) {
        projectImagesObj.images_id = editingImgId;
      }
      const {
        data,
        status: responseStatus,
        message,
      }: any = await Api.post("crm_post_project_images", projectImagesObj);
      if (responseStatus) {
        toast.success("Construction Image Successfully");
        setOpen(false);
        reset();
        setValue("projectName", "");
        setValue("imageType", "");
        setValue("imageSequence", 0);
        setImageUrl("");
        setDocumentFileName(null);
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
    console.log("data", data);
    await uploadProjectImages(data);
    setOpen(false);
  };

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

  let image_sequence_array = documentConfig?.image_sequence_array
  
  const deleteFaqs = async() => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("delete_crm_delete", {"id":deleteProjectData?.images_id,type:"project_images"});
    if (responseStatus) {
      toast.success(message);
      setOpenDelete(false);
    }else{
      toast.success(message);
    } 
    };

  return (
    <>
      <div className="tw-pl-2 tw-pr-6 tw-pb-6">
        <div className="tw-flex tw-flex-col tw-gap-4">
          <p className="tw-text-2xl tw-font-bold tw-text-black tw-mt-5">
            Project Images
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
                <TableCell className="!tw-text-white !tw-text-lg">Project Name</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg">Image Sequence</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg">Image Type</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg">Image</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectImagesData.map((row: any, index: any) => (
                <TableRow key={index} className="tw-bg-white">
                  <TableCell>
                    <p className="tw-font-bold">{row.project_name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold">{row.image_sequence}</p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold">{row.image_type}</p>
                  </TableCell>
                  <TableCell>
                    {row?.image_type == "property video" ||
                    row?.image_type == "construction video" ? (
                      <>
                        <div className="tw-w-24 tw-h-36 tw-rounded-md tw-overflow-hidden tw-border tw-border-gray-100">
                          <iframe
                            width="560"
                            height="315"
                            src={row.images_url.replace("watch?v=", "embed/")}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={true}
                          ></iframe>
                        </div>
                      </>
                    ) : (
                      <div className="tw-w-24 tw-h-24 tw-rounded-md tw-overflow-hidden tw-border tw-border-gray-100">
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
                    )}
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
                  Upload Project Images
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
                      disabled={isEditMode}
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
                  <span className="fs13 text-pri-black">Image Sequence</span>
                </div>
                <Controller
                  name="imageSequence"
                  control={control}
                  rules={{ required: "Image Sequence is required" }}
                
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!errors.imageSequence}
                      onFocus={() => clearErrors("imageSequence")}
                      onBlur={() => trigger("imageSequence")}
                      disabled={isEditMode}
                    >
                      {image_sequence_array.map((seq: any, index: any) => (
                        <MenuItem key={index} value={seq?.image_sequence}>
                          {seq?.image_sequence}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <p className="tw-text-red-500">
                  {errors.imageSequence?.message}
                </p>

                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Image Type</span>
                </div>
                <Controller
                  name="imageType"
                  control={control}
                  rules={{ required: "Image Type is required" }}
              
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!errors.imageType}
                      onFocus={() => clearErrors("imageType")}
                      onBlur={() => trigger("imageType")}
                      disabled={isEditMode}
                    >
                      {image_sequence_array
                        .filter((type: any) => {
                          // In edit mode, show all options. Otherwise, filter by sequence.
                          return (
                            isEditMode ||
                            type.image_sequence === watch("imageSequence")
                          );
                        })
                        .map((filteredType: any, index: number) => (
                          <MenuItem key={index} value={filteredType.image_type}>
                            {filteredType.image_type}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                <p className="tw-text-red-500">{errors.imageType?.message}</p>
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Upload document</span>
                </div>
                <div>
                  {watch("imageType") === "property video" ||
                  watch("imageType") === "construction video" ||
                  watch("imageSequence") === 10 ||
                  watch("imageSequence") === 11 ? (
                    <Controller
                      name="document"
                      control={control}
                      render={({ field }) => (
                        <OutlinedInput
                          fullWidth
                          {...field}
                          placeholder="Enter Video Url"
                          error={!!errors.document}
                          onFocus={() => clearErrors("document")}
                          onBlur={() => trigger("document")}
                          inputProps={{ maxLength: 500 }}
                          onChange={(e) => {
                            const { value } = e.target;
                            setImageUrl(value);
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                  ) : (
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
                  )}

                  <p className="tw-text-red-500">{errors.document?.message}</p>
                </div>
                <p className="fs13">Supported files: {documentConfig?.ProjectImages?.supportedFormat}</p>

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
            <Button color="error" onClick={deleteFaqs}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ConstructionUpdates;
