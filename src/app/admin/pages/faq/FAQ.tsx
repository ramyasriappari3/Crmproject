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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import Api from "../../api/Api";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch } from "@Src/app/hooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { toast } from "react-toastify";
import { ENUMValues } from "../../../../../src/utils/globalUtilities";

interface CustomerData {
  query: string;
  answer: string;
  faq_type: string;
  action: string;
  faq_id: string;
}

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

// const mockCustomerData: CustomerData[] = [
//   {
//     query: "dfghj",
//     answer: "dfghj",
//     type: "sdfghj",
//     action: "sdfghj",
//   },
//   // Add more mock data here
// ];

const schema = yup.object().shape({
  query: yup.string().required("Query is required"),
  answer: yup.string().required("answer is required"),
  faq_type: yup.string().required("Type is required"),
});

interface IFormInputs {
  query: string | null;
  answer: string | null;
  faq_type: string | null;
  faq_id: string | null;
}

const Faq = () => {
  // const [data] = useState(mockCustomerData);
  const [searchQuery, setSearchQuery] = useState("");
  const [faqsData, setFaqsData] = useState<any>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqTypeValues, setFaqTypeValues] = useState<any>([]);
  const dispatch = useAppDispatch();
  const [originalFaqsdata, setOriginalFaqsData] = useState<any>([]);
  const [queryType, setQueryType] = React.useState("All");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteFaqData, setDeleteFaqData] = useState<any>({});
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

  const handleEdit = (row: CustomerData) => {
    setIsEditMode(true); // Set to edit mode
    setEditingFaqId(row.faq_id); // Track the row being edited
    setValue("query", row.query); // Set values in the form
    setValue("answer", row.answer);
    setValue("faq_type", row.faq_type);
    setOpen(true); // Open modal
  };

  const handleDelete = (row: CustomerData) => {
    setOpenDelete(true);
    setDeleteFaqData(row);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    handleFilterSearch();
  };

  const handleFilterSearch = () => {
    let data = originalFaqsdata;
    if (searchQuery) {
      data = data.filter(
        (item: any) =>
          item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (queryType !="All") {
      console.log(queryType,"queryType")
      data = data.filter(
        (item: any) => item.faq_type.toLowerCase() === queryType.toLowerCase()
      );
    }
    setFaqsData(data);
  };

  useEffect(() => {
    handleFilterSearch();
  }, [searchQuery, queryType]);

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value,"event.target.value")
    setQueryType(event.target.value);
    handleFilterSearch();
  };
  const [open, setOpen] = useState(false);
  const [documentType, setDocumentType] = useState("");

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setValue("query", "");
    setValue("answer", "");
    setValue("faq_type", "");
    setValue("faq_id", "");
    reset();
  };

  const handleOpen = () => {
    setOpen(true);
    reset();
    setValue("query", "");
    setValue("answer", "");
    setValue("faq_type", "");
    setValue("faq_id", "");
  };

  const handleDocumentTypeChange = (event: any) => {
    setDocumentType(event.target.value);
  };

  const getFaqsList = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_get_faqs", {});
    if (responseStatus) {
      let sortData = data?.data?.resultData?.sort((a: any, b: any) => {
        return new Date(b.last_modified_at).getTime() - new Date(a.last_modified_at).getTime();
    });
      setFaqsData(sortData);
      setOriginalFaqsData(sortData);
    } else {
      setFaqsData([]);
    }
  };

  const getFaqsType = async () => {
    let faqType = await ENUMValues("faq_type_values");
    setFaqTypeValues(faqType);
  };

  useEffect(() => {
    getFaqsList();
  }, [open, openDelete,isEditMode]);

  useEffect(()=>{
    getFaqsType();
  },[])

  const createFaqs = async (payload: any) => {
    try {
      dispatch(showSpinner());
      if (isEditMode && editingFaqId) {
        payload.faq_id = editingFaqId; // Set the editing FAQ ID
    } else {
        delete payload?.faq_id; // Ensure faq_id is not included when creating a new FAQ
    }
      const {
        data,
        status: responseStatus,
        message,
      }: any = await Api.post("crm_post_faqs", payload);
      if (responseStatus) {
        toast.success(message);
        setOpen(false);
        setIsEditMode(false);
        reset();
        setValue("query", "");
        setValue("answer", "");
        setValue("faq_type", "");
        getFaqsList();
      } else {
        toast.error("Error Creating the Faqs");
      }

      dispatch(hideSpinner());
    } catch (error) {
      toast.error("Error Creating the Faqs");
    }
  };

  const onSubmit = async (data: IFormInputs) => {
    createFaqs(data);
    setOpen(false);
  };
  
  const deleteFaqs = async() => {
  const {
    data,
    status: responseStatus,
    message,
  }: any = await Api.get("delete_crm_delete", {"id":deleteFaqData?.faq_id,type:"faqs"});
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
          <p className="tw-text-2xl tw-font-bold tw-text-black tw-mt-5">FAQ's</p>
          <div className="tw-flex tw-justify-between tw-mb-2 tw-items-center">
            <div className="tw-flex tw-h-fit tw-gap-4">
              <TextFieldComp
                placeholder="Search here..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="tw-flex tw-justify-between">
              <div>
                <Button
                  onClick={handleOpen}
                  variant="contained"
                  disableElevation
                  sx={{
                    marginTop: "13px",
                    backgroundColor: "black",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "black" },
                  }}
                >
                  Add
                  <PlusOneIcon />
                </Button>
              </div>
              <div>
                <FormControl sx={{ m: 1, minWidth: 180,marginRight : 0.5}} size="small">
                  <InputLabel id="demo-select-small-label">
                    Query Type
                  </InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={queryType}
                    label="Query Type"
                    onChange={handleChange}
                  >
                    <MenuItem className= 'tw-text-sm' value="All">All</MenuItem>
                    {faqTypeValues?.map((type: any) => (
                      <MenuItem key={type?.unnest} value={type?.unnest}>
                        {type?.unnest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </div>

        <TableContainer
          component={Paper}
          style={{ overflowX: "auto", borderRadius: "0.5rem" }}
        >
          <Table aria-label="simple table">
            <TableHead className="tw-bg-[#008B8B]">
              <TableRow>
                <TableCell className="!tw-text-white !tw-text-lg" align="center">Query</TableCell>
                <TableCell style={{paddingRight: '11rem'}} className="!tw-text-white !tw-text-lg" align="center">Answer</TableCell>
                <TableCell style={{paddingRight : '3rem'}} className="!tw-text-white !tw-text-lg" align="center">Type</TableCell>
                <TableCell className="!tw-text-white !tw-text-lg">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faqsData?.map((row: any, index: any) => (
                <TableRow  key={index} className="tw-bg-white">
                  <TableCell>
                    <p className="tw-font-bold tw-flex tw-justify-left">{row?.query}</p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold tw-flex tw-justify-left tw-w-96">{row?.answer}</p>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold">{row?.faq_type}</p>
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
                <p className="tw-font-bold tw-text-2xl tw-text-black">{!isEditMode ? `Create FAQ's` : `Update FAQ's`}</p>
                <p className="tw-cursor-pointer" onClick={handleClose}>
                  <CloseIcon />
                </p>
              </div>

              <div className="tw-flex tw-flex-col tw-flex-start">
                {/* Query Field */}
                <div className="tw-mb-1">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Query</span>
                </div>
                <Controller
                  name="query"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      rows={2} // Adjust the number of rows as needed
                      fullWidth
                      placeholder="Enter Query"
                      error={!!errors.query}
                      onFocus={() => clearErrors("query")}
                      onBlur={() => trigger("query")}
                      inputProps={{ maxLength: 500 }} // Keeps the character limit
                      onChange={(e) => {
                        const value = e.target.value; // Get the input value
                        // Allow leading spaces but remove spaces from the rest
                        field.onChange(value.replace(/\s{2,}/g, ' ')); // Replace multiple spaces with a single space
                      }}
                    />
                  )}
                />
                <p className="tw-text-red-500">{errors.query?.message}</p>

                {/* Answer Field */}
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Answer</span>
                </div>
                <Controller
                  name="answer"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      rows={2} // Adjust the number of rows as needed
                      fullWidth
                      placeholder="Enter Answer"
                      error={!!errors.answer}
                      onFocus={() => clearErrors("answer")}
                      onBlur={() => trigger("answer")}
                      inputProps={{ maxLength: 5000 }} // Keeps the character limit for the answer
                      onChange={(e) => {
                        const value = e.target.value; // Get the input value
                        // Allow leading spaces but remove spaces from the rest
                        field.onChange(value.replace(/\s{2,}/g, ' ')); // Replace multiple spaces with a single space
                      }}
                    />
                  )}
                />
                <p className="tw-text-red-500">{errors.answer?.message}</p>

                {/* FAQ Type */}
                <div className="tw-mb-1 tw-mt-2">
                  <span className="tw-text-red-500">*</span>
                  <span className="fs13 text-pri-black">Faq Type</span>
                </div>
                <Controller
                  name="faq_type"
                  control={control}
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!errors.faq_type}
                      onFocus={() => clearErrors("faq_type")}
                      onBlur={() => trigger("faq_type")}
                    >
                      {faqTypeValues.map((type: any) => (
                        <MenuItem key={type.unnest} value={type.unnest}>
                          {type.unnest}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <p className="tw-text-red-500">{errors.faq_type?.message}</p>

                {/* Buttons */}
                <div className="tw-flex tw-justify-end tw-gap-6 tw-items-center tw-mt-6">
                  <button className="bg-white-btn-util" onClick={handleClose}>
                    Close
                  </button>
                  <button type="submit" className="bg-black-btn-util">
                  {!isEditMode ? `Create` : `Update`}
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

export default Faq;

interface InputTextProps {
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextFieldComp: React.FC<InputTextProps> = (props: InputTextProps) => {
  const { value, onChange, placeholder } = props;

  return (
    <div
      style={{ background: "white" }}
      className="!tw-px-2 !tw-py-[6px] tw-border-[1.5px] tw-border-black/30 tw-rounded-lg tw-flex tw-gap-1 tw-items-center"
    >
      <SearchIcon style={{ fontSize: "18px" }} />
      <input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="focus:!tw-outline-none focus:!tw-border-none !tw-border-none tw-w-full tw-text-sm placeholder:tw-font-light placeholder:tw-text-black/60 tw-h-fit"
      />
    </div>
  );
};
