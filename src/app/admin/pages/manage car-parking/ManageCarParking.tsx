import React, { useState, useEffect, MouseEvent, ChangeEvent } from "react";
import './ManageCarParking.scss'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CircleIcon from "@mui/icons-material/Circle";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import {
  MenuItem,
  Button,
  Menu,
  TextField,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../api/Api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { SelectChangeEvent } from "@mui/material/Select";
import { DateRange } from "@mui/lab";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Box, IconButton } from "@mui/material";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { useAppDispatch } from "@Src/app/hooks";
import userSessionInfo from "../../util/userSessionInfo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import { formatNumberToIndianSystem } from '@Src/utils/globalUtilities'
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface ManageCarParking {
  booking_no: string;
  booking_date: string;
  unit_no: string;
  flat_no_from_sap: string;
  floor_no: string;
  floor_name: string;
  tower_code: string;
  tower_name: string;
  project_name: string;
  project_code: number;
  address: string;
  company_name: string;
  company_code: string;
  mobile_number: string;
  email_id: string;
  first_name: string;
  cust_profile_id: string;
  application_status: string;
  profile_pic: string;
  last_name: string | null;
  middle_name: string | null;
  unit: string;
  cust_unit_id: string;
  full_name: string;
  search_term: string;
  tower_id: string;
  customer_email: string;
  total_billed_amount: any;
  total_paid_amount: any;
  total_due_amount: any;
  customer_number: any;
  car_parking_slots: string
}

interface CalculationFields {
  basic_rate: number;
  basic_rate_gst: number;
  basic_total_amount: number;
  floor_rate: number;
  floor_gst: number;
  floor_total_amount: number;
  car_parking_gst: number;
  car_parking_with_gst: number;
  amenity_gst: number;
  amenity_with_gst: number;
  total_sale_consideration_without_gst: number;
  total_sale_consideration_gst: number;
  total_sale_consideration_with_gst: any;
  legal_charges_gst: number;
  legal_charges_total: number;
  maintaince_rate: string;
  maintaince_amount: string;
  maintaince_amount_gst: number;
  maintaince_amount_with_gst: number;
  corpus_fund_rate: string;
  corpus_fund_amt: string;
  document_without_gst: number;
  document_gst: number;
  document_with_gst: any;
  total_payable_amount: number;
  paid_amount: number;
  balance_amount: number;
  total_amount_five_perc_GST: number;
  total_amount_ts_plus_othchg: any;
}

interface CustomerBookingDetails {
  pan_card: string;
  mobile_number: string;
  login_user_id: string;
  cust_unit_id: string;
  cust_profile_id: string;
  customer_number: string;
  parking_charges: string;
  amenities_charges: string;
  total_handover_charges: string;
  unit_id: string;
  price_per_sq_ft: string;
  floor_rise_rate: string;
  total_sale_consideration: string;
  booking_date: string;
  booking_no: string;
  sale_order_number: string;
  booking_amount_paid: string;
  booking_due_amount: string;
  booking_payment_type: string | null;
  booking_payment_id: string | null;
  agreement_date: string | null;
  sale_deed_date: string | null;
  total_amount_paid: string;
  total_due_amount: string;
  other_charges: string;
  sgst_rate: string;
  cgst_rate: string;
  cost_calculation_url: string;
  corpus_fund_amt: string;
  corpus_per_sft_rate: string;
  legal_charges_amt: string;
  maintenance_amt: string;
  maintenance_gst_rate_central: string;
  legal_gst_rate_state: string;
  maintenance_per_sft_rate: string;
  unit_type_id: string;
  unit_no: string;
  flat_no_from_sap: string;
  project_id: string;
  tower_id: string;
  tower_or_sector_id: string;
  floor_id: string;
  launch_phase: string;
  covered_area: string;
  carpet_area: string;
  balcony_area: string;
  common_area: string;
  uds_area: string;
  saleable_area: string;
  pricing_refmaterial: string;
  pricing_refmaterial_desc: string;
  tax_classification1: string;
  tax_classification2: string;
  tax_classification3: string;
  tax_classification4: string;
  tax_classification5: string;
  confirmed_flat: string;
  mat_mas_deletion_ind: string;
  measure_unit: string;
  hsn_code: string;
  hsn_code_description: string;
  no_of_parkings: number;
  mortgaged_flat: string;
  base_unit: string;
  category: string;
  facing: string;
  description: string;
  per_sqft_rate: string;
  total_area: string;
  appartment_number: string;
  bedrooms: string;
  tower_code: string;
  tower_name: string;
  total_floors: number;
  floor_no: string;
  floor_name: string;
  total_flats: number | null;
  project_code: number;
  project_name: string;
  project_address: string;
  company_id: string;
  company_name: string;
  company_address: string;
  maintenance_gst_rate_state: string;
  legal_gst_rate_central: string;
  application_stage: string | null;
  application_status: string;
  application_comments: string | null;
  application_reject_reasons: string | null;
  created_on: string;
  joint_holder_present: boolean;
  no_of_joint_holders: string;
  amenity_type: string;
  amenities_description: string | null;
  amenity_amount: string;
  sales_order_number: string;
  sales_order_date: string;
  booking_id: string;
  booking_amount: string;
  per_sft_rate: string;
  total_sft: string;
  car_parking_amount: string;
  amenities_amount: string;
  crm_executive: string;
  sales_executive: string;
  car_parking_slots: string;
  interested_in_home_loans: boolean;
  sales_order_id: string;
  crm_email: string;
  crm_phone: string;
  calculationFields: CalculationFields;
  total_billed_amount: string;
  total_payable_amount: string;
  balance_amount: number;
  basic_rate: any;
  total_gst_amount: any;
  total_amount_ts_plus_othchg: any;
  project_state: string;
  project_city: string;
}


interface ProjectTowerData {
  project_name: string;
  project_code: number;
  project_id: string;
  towerdata: TowerData[];
}

interface TowerData {
  tower_code: string;
  tower_name: string;
  tower_id: string;
}

interface SortConfig {
  key: keyof ManageCarParking | null;
  direction: 'asc' | 'desc';
}


export default function ManageCarParking() {
  const navigate = useNavigate();
  const { customerId, custUnitId } = useParams();
  console.log(customerId);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openPrjTwr = Boolean(anchorEl2);
  let [onBoardCustomersData, setOnBoardCustomersData] = useState<
    ManageCarParking[]
  >([]);
  let [originalCustomerData, setOriginalCustomerData] = useState<
    ManageCarParking[]
  >([]);
  const [customerUnits, setCustomerUnits] = useState<CustomerBookingDetails[]>(
    []
  );

  const [anchorElDateRange, setAnchorElDateRange] =
    useState<null | HTMLElement>(null);
  const openDateRange = Boolean(anchorElDateRange);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQueryTerm, setSearchQueryTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange<Date | null>>([
    null,
    null,
  ]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10); // Default limit per page
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [projectTowerFilterData, setProjectTowerFilterData] = useState<
    ProjectTowerData[]
  >([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTowers, setSelectedTowers] = useState<string[]>([]);
  // const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  // const [sortConfig, setSortConfig] = useState<any>({ key: null, direction: 'asc' });
  const handleClick = (event: MouseEvent<HTMLButtonElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const today = dayjs();

  const [selectedRow, setSelectedRow] = useState<any>({});
  const [openSendLoginPage, setOpenSendLoginPage] = useState(false);

  const handleDate = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElDateRange(event.currentTarget);
  };
  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue ? dayjs(newValue).utc(true) : null);
    setOnBoardCustomersData([]);
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue ? dayjs(newValue).utc(true) : null);
    setOnBoardCustomersData([]);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElDateRange(null);
  };

  const handleClosePrjTwr = () => {
    setAnchorEl2(null);
  };

  const handleClickPrjTwr = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleEdit = (custProfileId: string, custUnitId: string) => {
    navigate(
      "/crm/application/" +
      selectedRow?.cust_profile_id +
      "/" +
      selectedRow?.cust_unit_id
    );
  };
  console.log(onBoardCustomersData);
  console.log(originalCustomerData);
  const postOnBoardCustomers = async (tower_id: string[] = []) => {
    setLoading(true);
    dispatch(showSpinner());
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("manager_customers", {
      tower_id,
      application_status: ["Approved"],
    });
    if (responseStatus) {
      const onBoardCustomersDataWithId = data.map(
        (customer: ManageCarParking) => ({
          ...customer,
          unit: `${customer.project_name},Tower ${parseInt(
            customer?.tower_code,
            10
          )?.toString()},${customer?.floor_no}${customer.unit_no
            }`,
          combi_floor_unit: `${customer?.floor_no}${customer.unit_no
            }`
        })
      );
      console.log(onBoardCustomersDataWithId);
      setOnBoardCustomersData((prevData) => [
        ...prevData,
        ...onBoardCustomersDataWithId,
      ]);
      setOriginalCustomerData((prevData) => [
        ...prevData,
        ...onBoardCustomersDataWithId,
      ]);
    }
    setLoading(false);
    dispatch(hideSpinner());
  };

  const projectTowerData = async () => {
    const userInfo = userSessionInfo.logUserInfo();
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("get_project_towers", {
      crm_executive_code: userInfo?.rm_user_name,
    });
    if (responseStatus) {
      setProjectTowerFilterData(data);
      if (data.length > 0) {
        const defaultProject = data[0];
        const defaultTowers = defaultProject.towerdata.map(
          (tower: any, index: number) => tower.tower_id
        );
        postOnBoardCustomers(defaultTowers);
        setSelectedProject(defaultProject.project_id);
        setSelectedTowers(defaultTowers);
        setOnBoardCustomersData([]);
      }
    } else {
    }
  };

  useEffect(() => {
    projectTowerData();
  }, []);

  const handleNameClick = (cust_profile_id: string) => {
    navigate(`/crm/applicationformdetails/${cust_profile_id}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    setSearchQuery(value);
  };

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryTerm(event.target.value);
    handleFilterSearch();
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as string);
    handleFilterSearch();
  };

  const handleProjectChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    projectId: string
  ) => {
    if (event.target.checked) {
      setSelectedProject(projectId);
    } else {
      setSelectedProject(null);
      setSelectedTowers([]);
    }
  };

  const handleTowerChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    towerId: string
  ) => {
    if (event.target.checked) {
      setSelectedTowers((prevSelected) => [...prevSelected, towerId]);

      setOnBoardCustomersData([]); // Clear previous results
    } else {
      setSelectedTowers((prevSelected) =>
        prevSelected.filter((id) => id !== towerId)
      );
      setOnBoardCustomersData([]);
    }
  };

  const id = openPrjTwr ? "simple-popover-project-tower" : undefined;

  function getInitials(fullName: string) {
    const nameParts = fullName.split(" ");
    let second_name;
    let initials;
    if (nameParts[1] != undefined) {
      second_name = nameParts[1]?.substring(0, 1).toUpperCase() || nameParts[2]?.substring(0, 1).toUpperCase()
      initials = nameParts[0]?.substring(0, 1).toUpperCase() + second_name;
    } else {
      second_name = nameParts[0]?.substring(0, 2).toUpperCase();
      initials = second_name;
    }
    return initials.toUpperCase();
  }

  const resendLoginCrenditials = async () => {
    setOpenSendLoginPage(true);
  };

  useEffect(() => {
    handleFilterSearch();
  }, [
    searchQuery,
    searchQueryTerm,
    statusFilter,
    selectedTowers,
    startDate,
    endDate,
  ]);


  const handleFilterSearch = () => {
    let data = originalCustomerData;

    if (searchQuery) {
      data = data.filter((booking) =>
        booking.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchQueryTerm) {
      data = data.filter((booking) =>
        booking.search_term
          .toLowerCase()
          .includes(searchQueryTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter(
        (booking) =>
          booking.application_status.toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }
    if (startDate && endDate) {
      const startDateString = startDate
        ? startDate?.toISOString().split("T")[0]
        : "";
      const endDateString = endDate ? endDate?.toISOString().split("T")[0] : "";
      data = data.filter((booking) => {
        return (
          booking.booking_date >= startDateString &&
          booking.booking_date <= endDateString
        );
      });
    }
    if (selectedTowers) {
      data = data.filter(booking =>
        selectedTowers.includes(booking.tower_id)
      );
    }
    setOnBoardCustomersData(data);
  };

  // const [sortConfig, setSortConfig] = useState<any>({ key: ['application_status','first_name','unit','total_billed_amount','total_paid_amount','total_due_amount','combi_floor_unit' ,'booking_date',"full_name"], direction: 'asc'  });

  // const handleSort = (key:any) => {
  //   let direction = 'asc';
  //   // Check if the current key is already in keys array
  //   const keyIndex = sortConfig?.keys?.indexOf(key);
  //   if (keyIndex !== -1 && sortConfig.direction === 'asc') {
  //     direction = 'desc';
  //   } else if (keyIndex !== -1 && sortConfig.direction === 'desc') {
  //     // Remove the key if already exists and descending, reset to ascending
  //     setSortConfig({ keys: sortConfig.keys.filter((k:any) => k !== key), direction: 'asc' });
  //     return;
  //   } else if (keyIndex === -1) {
  //     // Add the key if not exists, reset all others to ascending
  //     setSortConfig({ keys: [key], direction: 'asc' });
  //     return;
  //   }
  //   setSortConfig({ keys: [key], direction });
  // };

  // onBoardCustomersData = React.useMemo(() => {
  //   if (sortConfig?.keys?.length > 0) {
  //     return [...onBoardCustomersData].sort((a:any, b:any) => {
  //       // Compare values based on the first key in keys array
  //       const sortKey = sortConfig.keys[0];
  //       const aValue = a[sortKey];
  //       const bValue = b[sortKey];
  //       if (typeof aValue === 'string' && typeof bValue === 'string') {
  //         return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  //       }
  //       return 0;
  //     });
  //   }
  //   return onBoardCustomersData;
  // }, [onBoardCustomersData, sortConfig]);

  // const getIcon = (key:any) => {
  //   // Check if the current key is in keys array
  //   const keyIndex = sortConfig?.keys?.indexOf(key);
  //   if (keyIndex !== -1) {
  //     return sortConfig.direction === 'asc' ? <ArrowUpwardIcon style={{ color: "#989FAE",cursor : 'pointer' }}/> : <ArrowDownwardIcon style={{ color: "#989FAE", cursor : 'pointer'}}/>;
  //   }
  //   return <ArrowDownwardIcon style={{ color: "#989FAE" ,cursor : 'pointer'}} />;
  // };


  const [sortConfig, setSortConfig] = useState<{ [key: string]: "asc" | "desc" | null }>({
    total_paid_amount: null,
    full_name: null,
    total_billed_amount: null,
    combi_floor_unit: null,
    booking_date: null,
    total_due_amount: null
  });

  onBoardCustomersData = React.useMemo(() => {
    let sortableData = [...onBoardCustomersData];
    for (const key in sortConfig) {
      if (sortConfig[key]) {
        sortableData.sort((a: any, b: any) => {
          // Convert to numbers for numeric fields to ensure correct sorting
          const aValue = key === 'total_due_amount' || key === 'total_billed_amount' || key === 'total_paid_amount' ? parseFloat(a[key]) : a[key];
          const bValue = key === 'total_due_amount' || key === 'total_billed_amount' || key === 'total_paid_amount' ? parseFloat(b[key]) : b[key];

          if (aValue < bValue) {
            return sortConfig[key] === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig[key] === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
    }
    return sortableData;
  }, [onBoardCustomersData, sortConfig]);


  const requestSort = (key: any) => {
    let direction: any = "asc";
    if (sortConfig[key] === "asc") {
      direction = "desc";
    } else if (sortConfig[key] === "desc") {
      direction = null;
    }

    const newSortConfig: { [key: string]: "asc" | "desc" | null } = {
      total_paid_amount: null,
      full_name: null,
      total_billed_amount: null,
      combi_floor_unit: null,
      booking_date: null,
      total_due_amount: null
    };

    newSortConfig[key] = direction;
    setSortConfig(newSortConfig);
  };

  const getClassNamesFor = (key: any) => {
    if (sortConfig[key] === null) {
      return "sort-icon";
    }
    return sortConfig[key] === "asc" ? "sort-icon asc" : "sort-icon desc";
  };


  const managerUnitDetailsOnHandle = (cust_profile_id: string, cust_unit_id: string, name: string) => {
    // setSelectedName(name);
    navigate(`/crm/managecarparkingdetails/${cust_profile_id}/${cust_unit_id}`);
    // setShowDetails(false);

  };

  // const managerUnitDetailsOnHandle = (cust_profile_id: string,cust_unit_id:string,name:string) => {
  //   const encodedCustomerInfo = encodeURIComponent(JSON.stringify(cust_profile_id));
  //   navigate(`/book-slots/${cust_profile_id}/${cust_unit_id}?customerInfo=${encodedCustomerInfo}`);
  // };



  // const getCustomerDetails = async () => {
  //   const { data, status, message }: any = await Api.get(
  //     "get_customer_application_data",
  //     { cust_profile_id: customerId }
  //   );
  //   if (status) {
  //     // console.log(data, status);
  //     setCustomerDetails(data.customerProfileDetails);
  //     setCustomerDocumentsDetails(data.customerProfileDocumentsDetails);
  //     setCustomerBankDetails(data.customerBankDetails);
  //     setJointCustomerDetails(data.jointCustomerProfileDetails);
  //     // let customerProfile = data.customerProfileDocumentsDetails?.filter((item)=>{item.document_name == 'applicant_photo'})
  //     let customerProfile = data.customerProfileDocumentsDetails?.filter(
  //       (item: any, index: number) => item.document_name === "applicant_photo"
  //     );
  //     setProfilePic(customerProfile[0]?.document_url);

  //     let joint_purchaser_details = data?.jointCustomerProfileDetails;

  //     setSecondPurchaserDetails(joint_purchaser_details);

  //     // /item=>{item.document_name == 'applicant_photo'
  //   } else {
  //     setCustomerDetails({});
  //     setCustomerDocumentsDetails([]);
  //     setCustomerBankDetails({});
  //     setJointCustomerDetails([]);
  //   }
  // };

  return (
    <>
      <div>
        <h2 className="Application_header tw-font-bold tw-text-black tw-ml-3" style={{marginLeft : '1rem',marginTop : '6rem'}}>
          Manage Car Parking
        </h2>
        <div className="tw-flex tw-justify-between tw-mb-2 tw-items-center">
          <div className="tw-flex tw-h-fit tw-gap-4">
            {/* <TextField
              className="tw-bg-white"
              id="search-bar"
              variant="outlined"
              placeholder="Search term..."
              size="medium"
              value={searchQueryTerm}
              onChange={handleSearchTermChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="tw-ml-2" />
                  </InputAdornment>
                ),
              }}
            /> */}
            <TextFieldComp
              placeholder={"Search term..."}
              value={searchQueryTerm}
              onChange={handleSearchTermChange}
            />
            <TextFieldComp
              placeholder="Search by applicant name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {/* <TextField
              id="search-bar"
              variant="outlined"
              placeholder="Search by applicant name..."
              size="medium"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              style={{ marginTop: "8px", background: "white" }}
            /> */}
          </div>
          <div className="tw-flex tw-justify-between tw-text-xs tw-font-semibold tw-items-center tw-gap-6">
            <div className="tw-flex tw-gap-4 tw-items-center">
              <p className="">Filter by:</p>
              <button
                className="!tw-flex !tw-gap-[2px] tw-px-2 !tw-h-fit !tw-w-fit tw-items-center !tw-rounded-[4px]"
                style={{ background: "white" }}
                onClick={handleClickPrjTwr}
              >
                <Typography
                  className="!tw-font-semibold !tw-text-xs !tw-text-blue-600"
                  style={{ textTransform: "none" }}
                >
                  {selectedTowers?.length === 0
                    ? "Project & Tower"
                    : `(${selectedTowers.length}) Project & tower`}
                </Typography>
                {selectedTowers?.length === 0 ? (
                  <KeyboardArrowDownIcon className="tw-font-bold tw-text-black" />
                ) : (
                  <div className="tw-flex tw-items-center tw-gap-[2px]">
                    <KeyboardArrowDownIcon className="tw-font-bold tw-text-blue-600" />
                    <img
                      width={14}
                      src="/images/cross-icon.svg"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    />
                  </div>
                )}
              </button>
            </div>
            <Popover
              id={id}
              open={openPrjTwr}
              anchorEl={anchorEl2}
              onClose={handleClosePrjTwr}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <div className="tw-max-h-80 tw-overflow-y-auto">
                {projectTowerFilterData.map((project, index) => (
                  <div key={project.project_id} className="tw-px-4 tw-py-2">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedProject === project.project_id}
                            disabled
                            onChange={(event) =>
                              handleProjectChange(event, project.project_id)
                            }
                          />
                        }
                        label={project.project_name}
                      />
                      {selectedProject === project.project_id &&
                        project.towerdata.map((tower, index) => (
                          <FormControlLabel
                            style={{ marginLeft: "1rem" }}
                            key={tower.tower_id}
                            control={
                              <Checkbox
                                checked={selectedTowers.includes(
                                  tower.tower_id
                                )}
                                onChange={(event) =>
                                  handleTowerChange(event, tower.tower_id)
                                }
                              />
                            }
                            label={`Tower ${tower.tower_code}`}
                            className="tw-ml-4"
                          />
                        ))}
                    </FormGroup>
                  </div>
                ))}
              </div>
            </Popover>
            {/* <button className="tw-flex tw-items-center">
              <p id="status-filter-label" className="!tw-text-xs">
                Status
              </p>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusChange}
                label="Status"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  width: statusFilter !== "" ? '13em' : '2em', 
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Re-Draft">
                  {" "}
                  <CircleIcon
                    style={{
                      color: "#D39826",
                      width: "0.5em",
                      marginRight: "0.5rem",
                    }}
                  />
                  Re-Draft{" "}
                </MenuItem>
                <MenuItem value="Not Submitted">
                  {" "}
                  <CircleIcon
                    style={{
                      color: "#FF0F4B",
                      width: "0.5em",
                      marginRight: "0.5rem",
                    }}
                  />
                  Not Submitted{" "}
                </MenuItem>
                <MenuItem value="Submitted">
                  {" "}
                  <CircleIcon
                    style={{
                      color: "#1F69FF",
                      width: "0.5em",
                      marginRight: "0.5rem",
                    }}
                  />{" "}
                  Submitted
                </MenuItem>
              </Select>
            </button> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <button className="tw-flex tw-items-center tw-gap-1">
                <p onClick={handleDate} id="date-filter-label">
                  Booking Date{" "}
                </p>

                <Select
                  labelId="date-filter-label"
                  id="date-filter"
                  open={false}
                  value={`${startDate} - ${endDate}`}
                  onClick={handleDate}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  label="Date"
                  IconComponent={
                    startDate || endDate
                      ? () => (
                        <IconButton>
                          <CloseIcon
                            onClick={(event) => {
                              event.stopPropagation();
                              setStartDate(null);
                              setEndDate(null);
                              setPage(1);
                              setOnBoardCustomersData([]);
                              setHasMore(true);
                            }}
                          />
                        </IconButton>
                      )
                      : undefined
                  }
                >
                  <MenuItem value="">Select Date Range</MenuItem>
                </Select>
              </button>

              <Popover
                id={id}
                open={openDateRange}
                anchorEl={anchorElDateRange}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Box p={2}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <DatePicker
                      label="From"
                      value={startDate}
                      onChange={handleStartDateChange}
                      inputFormat="DD/MM/YYYY"
                      views={["year", "month", "day"]}
                      maxDate={today}
                      openTo="year"
                      renderInput={(startProps) => (
                        <TextField
                          {...startProps}
                          inputProps={{
                            ...startProps.inputProps,
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Box mx={2} sx={{ marginTop: "1rem" }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <DatePicker
                        label="To"
                        value={endDate}
                        onChange={handleEndDateChange}
                        inputFormat="DD/MM/YYYY"
                        maxDate={today}
                        views={["year", "month", "day"]}
                        openTo="year"
                        renderInput={(endProps) => (
                          <TextField
                            {...endProps}
                            inputProps={{
                              ...endProps.inputProps,
                              readOnly: true,
                            }}
                          />
                        )}
                        minDate={
                          startDate ? startDate.add(1, "day") : undefined
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </Popover>
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <div>
        <TableContainer style={{ overflowX: 'auto', borderRadius: '0.5rem' }}>
          <Table aria-label="simple table">
            <TableHead className=" tw-bg-gray-200">
              <TableRow>
                <TableCell onClick={() => requestSort("full_name")} style={{ paddingLeft: '5rem' }}>
                  Applicant Name
                  <span className={`${getClassNamesFor("full_name")} custom-margin-top`}>
                    <span className="up-arrow"></span>
                    <span className="down-arrow"></span>
                  </span>
                </TableCell>
                <TableCell onClick={() => requestSort("combi_floor_unit")} >
                  Project & tower
                  <span className={`${getClassNamesFor("combi_floor_unit")} custom-margin-top`} >
                    <span className="up-arrow"></span>
                    <span className="down-arrow"></span>
                  </span>
                </TableCell>
                <TableCell onClick={() => requestSort("total_billed_amount")}>
                  <div className="tw-flex tw-justify-between">
                    Total Amount Billed
                    <span className={`${getClassNamesFor("total_billed_amount")}  custom-margin-top`}>
                      <span className="up-arrow"></span>
                      <span className="down-arrow"></span>
                    </span>
                  </div>
                </TableCell>
                <TableCell onClick={() => requestSort("total_paid_amount")}>
                  <div className="tw-flex tw-justify-between" >
                    Total Amount Received
                    <span className={`${getClassNamesFor("total_paid_amount")}  custom-margin-top`} >
                      <span className="up-arrow"></span>
                      <span className="down-arrow"></span>
                    </span>
                  </div>
                </TableCell>
                {/* <TableCell onClick={() => requestSort("total_due_amount")}>
                  <div className="tw-flex tw-justify-between" >
                    Parking Slots
                    <span className={`${getClassNamesFor("total_due_amount")} custom-margin-top`} >
                      <span className="up-arrow"></span>
                      <span className="down-arrow"></span>
                    </span>
                  </div>
                </TableCell> */}
                <TableCell onClick={() => requestSort("booking_date")}>
                  <div className="tw-flex tw-justify-between" style={{marginLeft : '3rem'}}>
                    Parking Status
                    <span className={`${getClassNamesFor("booking_date")} custom-margin-top`} >
                      <span className="up-arrow"></span>
                      <span className="down-arrow"></span>
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {onBoardCustomersData.map((row: ManageCarParking, index) => (

                <TableRow className="tw-bg-white  hover:tw-bg-blue-200"
                  key={row.full_name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => managerUnitDetailsOnHandle(row?.cust_profile_id, row?.cust_unit_id, row?.full_name)}
                >
                  <TableCell component="th" scope="row">
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => handleNameClick(row.full_name)}
                    >
                      {row?.profile_pic != "" &&
                        row.profile_pic != null &&
                        row.profile_pic != undefined ? (
                        <Stack direction="row" spacing={1}>
                          <Avatar alt="Remy Sharp" src={row.profile_pic} style={{ marginRight: '10px' }} />
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={2}>
                          <Avatar style={{ marginRight: '10px' }}>{getInitials(row?.full_name)}</Avatar>
                        </Stack>
                      )}

                      <div>
                        <p className="tw-font-bold"> {row.full_name} {row.middle_name != "" || row.middle_name != null ? row.middle_name : row.middle_name} {row.last_name != "" || row.last_name != null ? row.last_name : row.last_name}</p>
                        <p style={{ color: "#656C7B" }}>{row.customer_email}</p>
                        <p className="tw-text-[#656C7B]">Customer Number-{parseInt(row.customer_number)} </p> {/* for testing purpose  */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="tw-font-bold">{row.unit}</p>

                  </TableCell>
                  <TableCell >
                    ₹{formatNumberToIndianSystem(row.total_billed_amount)}
                  </TableCell>
                  <TableCell >
                    ₹{formatNumberToIndianSystem(row.total_paid_amount)}
                  </TableCell>
                  {/* //<TableCell > */}
                    {/* ₹{formatNumberToIndianSystem(row.total_due_amount)} */}
                    
                  {/* </TableCell> */}
                  <TableCell align="center" className={`tw-font-bold tw-py-2 tw-px-4 ${row.car_parking_slots ? 'tw-text-green-500' : 'tw-text-blue-500'}`}>
                    {row.car_parking_slots ? row?.car_parking_slots : "Parking Slots not selected"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* {loading && <p>Loading more customers...</p>}
        {!hasMore && <p>No more customers to load.</p>} */}
      </div>
    </>
  );
}

interface InputTextProps {
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextFieldComp: React.FC<InputTextProps> = (props: InputTextProps) => {
  const { value, onChange = () => { }, placeholder } = props;
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



