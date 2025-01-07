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
import moment from "moment";

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

const SUPPORTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

// const isFile = (value: unknown): value is File => {
//   return value instanceof File;
// };

const isFile = (value: any): value is File => value && value instanceof File;
interface IFormInputs {
  projectName: string | null;
  year: string | null;
  month: string;
  imageTitle: string | null;
  document: File | null | string;
}

interface ConstructionData {
  project_name: string;
  year: string;
  month: string;
  image_title: string;
  image_url: string;
  action: string;
  images_id: string;
  project_id: string;
  document: string;
  images_url: string;
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
  const [deleteConstructionUpdate, setDeleteConstructionUpdates] =
    useState<any>({});
  const schema = yup.object().shape({
    projectName: yup.string().required("Project Name is required"),
    year: yup
      .string()
      .typeError("Year is required")
      .nullable("Year is required")
      .required("Year is required"),
    month: yup.string().required("Month is required"),
    imageTitle: yup.string().required("Title is required"),
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
        "Unsupported file format",
        (value) =>
          !isFile(value) ||
          (isFile(value) && SUPPORTED_FILE_TYPES.includes(value.type))
      )
      .test(
        "fileSize",
        "File size is too large, File should be below 2MB",
        (value) =>
          !isFile(value) || (isFile(value) && value.size <= 2048 * 1024)
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
    setValue("projectName", row?.project_id);
    setValue("year", row?.year);
    setValue("month", row?.month);
    setValue("imageTitle", row?.image_title);
    setOpen(true);
    setImageUrl(row?.images_url);
    setEditingImgId(row?.images_id);
    setValue("document", row?.images_url);
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
    setIsEditMode(false);
    setValue("projectName", "");
    setValue("year", "");
    setValue("month", "");
    setValue("imageTitle", "");
    setImageUrl(null);
    reset();
  };

  const handleOpen = () => {
    setOpen(true);
    reset();
  };

  const handleDocumentTypeChange = (event: any) => {
    setDocumentType(event.target.value);
  };

  const years = Array.from(
    new Array(1),
    (val, index) => new Date().getFullYear() - index
  );

  // const months = [
  //   { id: 1, name: "January" },
  //   { id: 2, name: "February" },
  //   { id: 3, name: "March" },
  //   { id: 4, name: "April" },
  //   { id: 5, name: "May" },
  //   { id: 6, name: "June" },
  //   { id: 7, name: "July" },
  //   { id: 8, name: "August" },
  //   { id: 9, name: "September" },
  //   { id: 10, name: "October" },
  //   { id: 11, name: "November" },
  //   { id: 12, name: "December" },
  // ];


  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentMonthIndex = new Date().getMonth(); // 0-11 for Jan-Dec
  let months =  monthNames.slice(0, currentMonthIndex + 1).map((name, index) => ({
    id: index + 1,
    name: name,
  }));

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
    }: any = await Api.get("crm_get_construction_images", {});
    if (responseStatus) {
      const sortedData = data.sort((a: any, b: any) => {
        if (parseInt(a.year) !== parseInt(b.year)) {
          return parseInt(b.year) - parseInt(a.year);
        }
        return monthMap[b.month] - monthMap[a.month];
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
    getConstructionImages();
    getProjectsList();
  }, [open, isEditMode, openDelete]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   // setIsEditMode(false);
    const file = e.target.files?.[0] || null;
    setValue("document", file);
    let uploadedFile = await handleFileUpload(file);
    setImageUrl(uploadedFile?.data);
    //setValue("document", uploadedFile?.data);
    // setValue("document", file);
    if(isEditMode){
      setValue("document", uploadedFile?.data);
    }
    trigger("document");
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

  const uploadConstructionImages = async (payload: IFormInputs) => {
    try {
      dispatch(showSpinner());
      // let uploadedFile = await handleFileUpload(payload?.document);
      let constructionObj: any = {
        project_id: payload?.projectName,
        images_url: imageUrl,
        year_of_update: payload?.year,
        month_of_update: payload?.month,
        image_title: payload?.imageTitle,
      };
      if (editingImgId) {
        constructionObj.images_id = editingImgId;
      }

      console.log(constructionObj,"constructionObj",isEditMode , editingImgId)
      const {
        data,
        status: responseStatus,
        message,
      }: any = await Api.post("crm_post_construction_images", constructionObj);
      if (responseStatus) {
        toast.success("Construction Image Successfully");
        setOpen(false);
        reset();
        setValue("projectName", "");
        setValue("year", "");
        setValue("month", "");
        setValue("imageTitle", "");
        setImageUrl(null);
        setIsEditMode(false);
        setEditingImgId("")
      } else {
        toast.error("Error uploading Consteruction proof");
      }
      getConstructionImages()
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
      reset();
      setValue("projectName", "");
      setValue("year", "");
      setValue("month", "");
      setValue("imageTitle", "");
      setImageUrl(null);
      setIsEditMode(false);
      setEditingImgId("")
    } else {
      toast.success(message);
    }
  };

  return (
    <>
      <div className="tw-pl-2 tw-pr-6 tw-pb-6">
        <div className="tw-flex tw-flex-col tw-gap-4">
          <p className="tw-text-2xl tw-font-bold tw-text-black tw-mt-5">
            Construction Updates
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
                <TableCell className="!tw-text-white !tw-text-lg">Project Name</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg" align="right">Year</TableCell>
                <TableCell className="tw-mr-10 !tw-text-white !tw-text-lg" align="center">
                  Month
                </TableCell>
                <TableCell className="!tw-text-white !tw-text-lg tw-w-96" align="center">Title</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg" align="center">Image</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg">Uploaded Date</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {constructionData.map((row: any, index: any) => (
                <TableRow key={index} className="tw-bg-white">
                  <TableCell>
                    <p className="tw-font-bold">{row.project_name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold">{row.year}</p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold tw-flex tw-justify-start tw-ml-10">
                      {row.month}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold tw-flex tw-justify-center" style={{overflowWrap :'anywhere'}}>
                      {row.image_title}
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
                    <p className="tw-font-bold tw-text-center">{moment(row.date).format("DD/MM/YYYY")}</p>
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
                  Upload Construction Updates
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
                  <span className="fs13 text-pri-black">Year</span>
                </div>
                <Controller
                  name="year"
                  control={control}
                  rules={{ required: "Year is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!errors.year}
                      onFocus={() => clearErrors("year")}
                      onBlur={() => trigger("year")}
                    >
                      {years.map((year, index) => (
                        <MenuItem key={index} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <p className="tw-text-red-500">{errors.year?.message}</p>

                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Month</span>
                </div>
                <Controller
                  name="month"
                  control={control}
                  rules={{ required: "Month is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!errors.month}
                      onFocus={() => clearErrors("month")}
                      onBlur={() => trigger("month")}
                    >
                      {months.map((month) => (
                        <MenuItem key={month.id} value={month.name}>
                          {month.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <p className="tw-text-red-500">{errors.month?.message}</p>
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Title</span>
                </div>
                <Controller
                  name="imageTitle"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      fullWidth
                      {...field}
                      placeholder="Enter Image Title"
                      error={!!errors.imageTitle}
                      onFocus={() => clearErrors("imageTitle")}
                      onBlur={() => trigger("imageTitle")}
                      inputProps={{ maxLength: 500 }}
                      onChange={(e) => {
                        const value = e.target.value; // Get the input value
                        // Allow leading spaces but remove spaces from the rest
                        field.onChange(value.replace(/\s{2,}/g, ' ')); // Replace multiple spaces with a single space
                      }}
                    />
                  )}
                />
                <p className="tw-text-red-500">{errors.imageTitle?.message}</p>
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Upload document</span>
                </div>
                <div>
                  <Controller
                    name="document"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="file"
                        onChange={handleFileChange}
                        onFocus={() => clearErrors("document")}
                        className="tw-block tw-w-full file:tw-mr-8 text-pri-header fs13 file:tw-cursor-pointer
                        file:tw-p-1 tw-border-1 file:tw-rounded-md file:tw-border-gray-200 
                        file:tw-font-semibold file:tw-border-1
                        tw-text-black file:tw-bg-gray-200 file:tw-m-1.5
                                          hover:file:tw-cursor-pointer hover:file:tw-bg-sky-50 tw-rounded-lg
                                            hover:file:tw-text-sky-700"
                      />
                    )}
                  />
                  <p className="tw-text-red-500">{errors.document?.message}</p>
                </div>
                <p className="fs13">Supported files: jpeg, jpg, png, pdf</p>

                <div className="tw-flex tw-justify-end tw-gap-6 tw-items-center tw-mt-6">
                  <button className="bg-white-btn-util" onClick={handleClose}>
                    Close
                  </button>
                  <button type="submit" className="bg-black-btn-util" disabled ={imageUrl == null ? true : false}>
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
