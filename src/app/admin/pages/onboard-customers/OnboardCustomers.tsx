import React, {
  useState,
  useEffect,
  MouseEvent,
  ChangeEvent,
  ReactNode,
} from "react";
import "./OnboardCustomers.scss";
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
import { useNavigate } from "react-router-dom";
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
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface OnBoardCustomer {
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
  search_term: string;
  tower_id: string;
  full_name: string;
  customer_number: any;
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
  key: keyof OnBoardCustomer | null;
  direction: "asc" | "desc";
}

export default function OnboardCustomers() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openPrjTwr = Boolean(anchorEl2);
  const today = dayjs(); 
  let [onBoardCustomersData, setOnBoardCustomersData] = useState<
    OnBoardCustomer[]
  >([]);
  let [originalCustomerData, setOriginalCustomerData] = useState<
    OnBoardCustomer[]
  >([]);
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

  const postOnBoardCustomers = async (tower_id: string[] = []) => {
    setLoading(true);
    dispatch(showSpinner());
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("onboard_customers", {
      tower_id,
      application_status: ["Re-Draft", "Submitted", "Not Submitted","Login Not Sent"],
    });
    if (responseStatus) {
      const onBoardCustomersDataWithId = data.map(
        (customer: OnBoardCustomer) => ({
          ...customer,
          unit: `${customer.project_name},Tower ${parseInt(
            customer?.tower_code,
            10
          )?.toString()},${customer?.floor_no}${customer.unit_no}`,
          combi_floor_unit: `${customer?.floor_no}${customer.unit_no}`,
        })
      );
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

  const handleNameClick = (name: string, cust_profile_id: string) => {
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
      data = data.filter((booking) =>
        selectedTowers.includes(booking.tower_id)
      );
    }
    setOnBoardCustomersData(data);
  };

  // const [sortConfig, setSortConfig] = useState<any>({ key: ['application_status','first_name','unit','combi_floor_unit','booking_date','full_name'], direction: 'asc'  });

  const [sortConfig, setSortConfig] = useState<{
    [key: string]: "asc" | "desc" | null;
  }>({
    application_status: null,
    full_name: null,
    unit: null,
    combi_floor_unit: null,
    booking_date: null,
  });

  onBoardCustomersData = React.useMemo(() => {
    let sortableData = [...onBoardCustomersData];
    for (const key in sortConfig) {
      if (sortConfig[key]) {
        sortableData.sort((a: any, b: any) => {
          if (a[key] < b[key]) {
            return sortConfig[key] === "asc" ? -1 : 1;
          }
          if (a[key] > b[key]) {
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

    setSortConfig({ ...sortConfig, [key]: direction });
  };

  const getClassNamesFor = (key: any) => {
    if (sortConfig[key] === null) {
      return "sort-icon";
    }
    return sortConfig[key] === "asc" ? "sort-icon asc" : "sort-icon desc";
  };

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
  //     return sortConfig.direction === 'asc' ? <ArrowUpwardIcon style={{color : '#989FAE', cursor : 'pointer'}}/> : <ArrowDownwardIcon style={{color : '#989FAE' , cursor : 'pointer'}}/>;
  //   }
  //   return <ArrowDownwardIcon style={{ color: "#989FAE" ,cursor : 'pointer' }} />;
  // };

  return (
    <div className="tw-pl-2 tw-pr-6 tw-pb-6">
      <div className="tw-flex tw-flex-col tw-gap-4">
        <p className="tw-text-2xl tw-font-bold tw-text-black tw-mt-9 tw-ml-3">
          Onboard Customers
        </p>
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
            <button className="tw-flex tw-items-center">
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
                <MenuItem className= 'tw-text-sm' value="">All</MenuItem>
                <MenuItem value="Re-Draft">
                  {" "}
                  <CircleIcon
                    style={{
                      color: "#D39826",
                      width: "0.5em",
                      marginRight: "0.5rem",
                    }}
                  />
                  <span className="tw-text-xs">Re-Draft</span>{" "}
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
                  <span className="tw-text-xs">Not Submitted</span>{" "}
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
                  <span className="tw-text-xs">Submitted</span>
                </MenuItem>
                <MenuItem value="Login Not Sent">
                  {" "}
                  <CircleIcon
                    style={{
                      color: "#926bfa",
                      width: "0.5em",
                      marginRight: "0.5rem",
                    }}
                  />{" "}
                  <span className="tw-text-xs">Login Not Sent</span>
                </MenuItem>
              </Select>
            </button>
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
      <div className="tw-rounded-2xl tw-overflow-hidden table-shadow">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead className="tw-bg-gray-200">
              <TableRow>
                <TableCell
                  onClick={() => requestSort("full_name")}
                  className="headers !tw-flex !tw-items-center"
                >
                  Applicant Name{" "}
                  <span className={getClassNamesFor("full_name")} style={{marginRight : onBoardCustomersData.length == 0 ? '10rem' : '10rem'}}>
                    <span className="up-arrow"></span>
                    <span className="down-arrow"></span>
                  </span>
                </TableCell>
                <TableCell
                  onClick={() => requestSort("combi_floor_unit")}
                  className="headers"
                >
                  Project & Tower
                  <span className={`${getClassNamesFor("combi_floor_unit")} custom-margin-top`} style={{marginRight : '8.5rem'}}>
                    <span className="up-arrow"></span>
                    <span className="down-arrow"></span>
                  </span>
                </TableCell>
                <TableCell onClick={() => requestSort("application_status")}>
                  Status{" "}
                  <span className={`${getClassNamesFor("application_status")} custom-margin-top`} style={{marginRight : '3rem'}}>
                    <span className="up-arrow"></span>
                    <span className="down-arrow"></span>
                  </span>
                </TableCell>
                <TableCell onClick={() => requestSort("booking_date")}>
                  Booking Date{" "}
                  <span className={`${getClassNamesFor("booking_date")} custom-margin-top`}>
                    <span className="up-arrow"></span>
                    <span className="down-arrow"></span>
                  </span>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {onBoardCustomersData.map((row: any, index: number) => (
                <TableRow
                  key={row.full_name}
                  className="tw-bg-white hover:tw-bg-blue-200"
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={() =>
                      handleNameClick(row.full_name, row.cust_profile_id)
                    }
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {row?.profile_pic != "" &&
                      row.profile_pic != null &&
                      row.profile_pic != undefined ? (
                        <Stack direction="row" spacing={1}>
                          <Avatar
                            alt="Remy Sharp"
                            src={row.profile_pic}
                            style={{ marginRight: "10px" }}
                          />
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={2}>
                          <Avatar style={{ marginRight: "10px" }}>
                            {getInitials(row?.full_name)}
                          </Avatar>
                        </Stack>
                      )}

                      <div>
                        <p className="tw-font-bold">
                          {" "}
                          {row.full_name}{" "}
                          {row.middle_name != "" || row.middle_name != null
                            ? row.middle_name
                            : row.middle_name}{" "}
                          {row.last_name != "" || row.last_name != null
                            ? row.last_name
                            : row.last_name}
                        </p>
                        <p style={{ color: "#656C7B" }}>
                          {row.customer_mobile}
                        </p>
                        <p className="tw-text-[#656C7B]">Customer Number-{parseInt(row.customer_number)} </p> {/* for testing purpose  */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      handleNameClick(row.unit, row.cust_profile_id)
                    }
                  >
                    <p className="tw-font-bold">{row.unit}</p>
                  </TableCell>
                  <TableCell
                    style={{ paddingLeft: "0px" }}
                    align="left"
                    className="tw-font-bold"
                    onClick={() =>
                      handleNameClick(
                        row.application_status,
                        row.cust_profile_id
                      )
                    }
                  >
                    <CircleIcon
                      style={{ marginRight: "0.5rem" }}
                      className={
                        row.application_status === "Submitted"
                          ? "button_submitted"
                          : row.application_status === "Re-Draft"
                          ? "button_redraft"
                          : "Button_NotSubmitted"
                      }
                    />
                    {row.application_status}
                  </TableCell>

                  <TableCell
                    style={{ paddingLeft: "25px" }}
                    align="left"
                    className="tw-font-bold"
                    onClick={() =>
                      handleNameClick(row.booking_date, row.cust_profile_id)
                    }
                  >
                    {dayjs(row.booking_date).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="right">
                    <div className="more" >
                      <div>
                        <Button  className="more_icon"
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={(event) => handleClick(event, row)}
                        >
                          <MoreVertIcon style={{ color: "black" ,paddingLeft : '4px'}} />
                        </Button>

                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                          onClose={handleClose}
                          PaperProps={{
                            sx: {
                              boxShadow: "1px 2px 1px rgba(0, 0, 0, 0.1)",
                              border: "1px solid #ccc",
                            },
                          }}
                        >
                          <MenuItem
                            onClick={() =>
                              handleEdit(
                                row?.cust_profile_id,
                                row?.cust_unit_id
                              )
                            }
                          >
                            Edit Application
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              resendLoginCrenditials();
                            }}
                          >
                            Send Reset Password Link
                          </MenuItem>
                        </Menu>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* {loading && <p>Loading more customers...</p>}
        {!hasMore && <p>No more customers to load.</p>} */}
      </div>
      {openSendLoginPage && (
        <Dialog open={true} onClose={() => {}}>
          <div className="tw-flex tw-justify-between tw-m-4">
            <h3 className="tw-font-bold">Send login credentials</h3>
            <img
              src="/images/cross-icon.svg"
              className="tw-cursor-pointer"
              onClick={() => setOpenSendLoginPage(false)}
            />
          </div>
          <DialogContent>
            <p className="text-sm mb-4">
              You can choose your preferred medium from the list below to send
              login credentials to the applicant.
            </p>
            <div className="flex gap-4 mb-4">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="SMS"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Email"
              />
            </div>

            <div>
              <div className="text_field_top">
                <span>Phone Number</span>
                <TextField
                  sx={{ mt: 3 }}
                  margin="normal"
                  required
                  className="mb-4"
                  fullWidth
                  defaultValue="+91 9873493509"
                  variant="outlined"
                  value={selectedRow?.customer_mobile}
                />
              </div>
              <br></br>
              <div>
                Email Address
                <TextField
                  sx={{ mt: 3 }}
                  className="mb-4"
                  fullWidth
                  defaultValue="Kaylee_Lemke@gmail.com"
                  variant="outlined"
                  value={selectedRow?.customer_email}
                />
              </div>
              <br></br>
              <div>
                write a message
                <TextField
                  sx={{ mt: 3 }}
                  className="message"
                  fullWidth
                  placeholder="Max 24 characters"
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </div>
            </div>
            <div>
              <DialogActions>
                <Button
                  variant="outlined"
                  sx={{ color: "black", borderColor: "black" }}
                  onClick={() => setOpenSendLoginPage(false)}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    "&:hover": { backgroundColor: "darkgray" },
                  }}
                  onClick={() => setOpenSendLoginPage(false)}
                >
                  Send login credentials
                </Button>
              </DialogActions>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface InputTextProps {
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextFieldComp: React.FC<InputTextProps> = (props: InputTextProps) => {
  const { value, onChange = () => {}, placeholder } = props;
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
