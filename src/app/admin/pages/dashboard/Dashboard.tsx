import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import DoughnutPieChart from "../analytics/DoughnutPieChart";
import TDSCollectionStatus from "../analytics/TDSCollectionStatus";
import HalfDoughnutPieChart from "../analytics/HalfDoughnutPieChart";
import EChartsOption from "../analytics/AgreementStatusByStages";
import Invoice_raised from "./../../../../assets/Images/Invoice_raised.svg";
import Api from "../../api/Api";
import userSessionInfo from "../../util/userSessionInfo";
import { useAppDispatch } from "@Src/app/hooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import total_customer from "./../../../../assets/Images/total_customer.svg";
import onboarded_customer from "./../../../../assets/Images/onboarding_icon.svg";
import overdue_invoice from "./../../../../assets/Images/overdue_invoice.svg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import Popover from "@mui/material/Popover";
import CircleIcon from "@mui/icons-material/Circle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from "dayjs/plugin/utc";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  MenuItem,
  TextField,
  Select,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
  IconButton,
} from "@mui/material";
function AdminDashboard() {
  const dispatch = useAppDispatch();
  const userInfo = userSessionInfo.logUserInfo();
  const [totalCustomer, setTotalCustomer] = useState("");
  const [totalOnboardedCustomer, setTotalOnboardedCustomer] = useState<any>([]);
  const [totalinvoiceRaised, setTotalInvoiceRaised] = useState<any>([]);
  const [totalOverDue, setTotalOverDue] = useState<any>([]);
  const [pieChatApplicationStatus, setPieChatApplicationStatus] = useState<any>(
    []
  );
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState<any>([]);
  const [totalReceiptAmount, setTotalReceiptAmount] = useState<any>([]);
  const [totalUnbilledAmount, setTotalUnBilledAmount] = useState<any>([]);
  const [totalOverDueAmount, setTotalOverDueAmount] = useState<any>([]);
  const [paymentDoughNut, setPaymentDoughNut] = useState<any>([]);
  const [selectedTowers, setSelectedTowers] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const openPrjTwr = Boolean(anchorEl2);
  const [anchorElDateRange, setAnchorElDateRange] =
    useState<null | HTMLElement>(null);

  const openDateRange = Boolean(anchorElDateRange);

  const handleClosePrjTwr = () => {
    setAnchorEl2(null);
  };
  const handleDate = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElDateRange(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElDateRange(null);
  };
  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue ? dayjs(newValue).utc(true) : null);
  };
  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue ? dayjs(newValue).utc(true) : null);
  };
  const getRMApplicationStatusInfo = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("crm_application_status_info", {
      crmExecutiveCode: userInfo?.rm_user_name,
    });

    dispatch(showSpinner());
    if (responseStatus) {
      setPieChatApplicationStatus(data?.pieChatApplicationStatus[0]?.json_agg);
      setTotalCustomer(data?.total_customers[0]?.json_agg[0]?.count || 0);
      let totalCustomers =
        data?.customers_application_status[0]?.json_agg?.filter(
          (item: any, index: number) => {
            return item.application_status == "Approved";
          }
        );
      setTotalOnboardedCustomer(totalCustomers);
      console.log(data?.totalInvoiceRaised[0]?.json_agg);
      setTotalInvoiceRaised(data?.totalInvoiceRaised[0]?.json_agg);
      setTotalOverDue(data?.totalInvoiceOverDue);
      setTotalInvoiceAmount(data?.total_customers_invoice_amount);
      setTotalReceiptAmount(data?.total_customer_receipts_amount);
      setTotalUnBilledAmount(data?.total_un_billed_amount);
      setTotalOverDueAmount(data?.total_over_due_amount);
      console.log("dataa", data);
      setPaymentDoughNut([
        {
          value:
            data?.total_customer_receipts_amount?.length > 0
              ? data?.total_customer_receipts_amount[0]?.total_receipt_amount
              : 0,
          name: "Total Amount Received",
          itemStyle: { color: "#00BA62" },
        },
        {
          value:
            data?.total_over_due_amount?.length > 0 &&
            data?.total_over_due_amount[0]?.total_overdue_amount !== null
              ? data?.total_over_due_amount[0]?.total_over_due_amount
              : 0,
          name: "Total Amount Over Due",
          itemStyle: { color: "#FB4C61" },
        },
        {
          value:
            data?.total_customers_invoice_amount?.length > 0 &&
            data?.total_customers_invoice_amount != null
              ? data?.total_customers_invoice_amount[0]?.total_due_amount
              : 0,
          name: "Total Amount Due",
          itemStyle: { color: "#f97700" },
        },
        {
          value:
            data?.total_un_billed_amount?.length > 0
              ? data?.total_un_billed_amount[0]?.total_un_billed_amount
              : 0,
          name: "Total Unbilled Amount",
          itemStyle: { color: "#90a4ae" },
        },
      ]);
    }
    dispatch(hideSpinner());
  };

  // console.log("paymentDoughNut",paymentDoughNut,totalReceiptAmount[0]?.total_receipt_amount)

  useEffect(() => {
    getRMApplicationStatusInfo();
  }, []);

  return (
    <>
      <div
        className="tw-flex tw-justify-between tw-items-center"
        style={{ marginBottom: "-40px" }}
      >
        <div className="tw-flex tw-h-fit  dashboard1">
          <p className="tw-text-2xl tw-font-bold tw-text-black tw-ml-2"style={{marginLeft:'1rem',marginTop : '2rem'}}>
            Dashboard
          </p>
        </div>
        <div className="tw-flex tw-justify-between tw-text-xs tw-font-semibold tw-items-center tw-gap-6">
          <div
            className="tw-flex  tw-items-center tw-m-10 dashboard2"
            style={{ marginRight: "76px" }}
          >
            <p className="">Filter by:</p>
            <button
              className="!tw-flex !tw-gap-[2px] tw-px-2 !tw-h-fit !tw-w-fit tw-items-center !tw-rounded-[4px]"
              style={{ background: "white" }}
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
            {/* <div className="tw-max-h-80 tw-overflow-y-auto">
                
              </div> */}
          </Popover>
          {/* <button className="tw-flex tw-items-center tw-gap-1">
              <p id="status-filter-label" className="!tw-text-xs">
                Status
              </p>
              <Select
                labelId="status-filter-label"
                id="status-filter"
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
            </LocalizationProvider> */}
        </div>
      </div>
      <div>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={4} style={{ margin: "2px" }}>
              <div className="tw-flex tw-justify-between tw-mb-5">
                <Card className="small_cards">
                  <CardContent className="icons">
                    <p style={{ color: "#656C7B" }}>Total Customers</p>
                    <p className="card_content">{totalCustomer || 0}</p>
                  </CardContent>
                  <CardContent className="tw-flex tw-justify-end tw-pt-10">
                    <img src={total_customer} alt="total_customer" />
                  </CardContent>
                </Card>

                <Card className="small_card">
                  <CardContent className="icons">
                    <p style={{ color: "#656C7B" }}>Onboarding</p>
                    <p className="card_content">
                      {totalOnboardedCustomer?.length > 0
                        ? totalOnboardedCustomer[0].count
                        : 0}
                    </p>
                  </CardContent>
                  <CardContent className="tw-flex tw-justify-end tw-pt-10">
                    <img src={onboarded_customer} alt="onboarded_customer" />
                  </CardContent>
                </Card>
              </div>
              <div className="tw-flex tw-justify-between tw-mb-5 tw-gap-7">
                <Card className="small_cards">
                  <CardContent className="icons">
                    <p style={{ color: "#656C7B" }}>Invoice Raised</p>
                    <p className="card_content">
                      {totalinvoiceRaised?.length > 0
                        ? totalinvoiceRaised[0].count
                        : 0}
                    </p>
                  </CardContent>
                  <CardContent className="tw-flex tw-justify-end tw-pt-10">
                    <img src={Invoice_raised} alt="invoice_raised" />
                  </CardContent>
                </Card>

                <Card className="small_card">
                  <CardContent className="icons">
                    <p style={{ color: "#656C7B" }}>Overdue Invoice</p>
                    <p className="card_content">
                      {totalOverDue?.length > 0
                        ? totalOverDue[0]?.total_overdue_count
                        : 0}
                    </p>
                  </CardContent>
                  <CardContent className="tw-flex tw-justify-end tw-pt-10">
                    <img
                      src={overdue_invoice}
                      alt="overdue_invoice"
                      className="large-image"
                    />
                  </CardContent>
                </Card>
              </div>
            </Grid>
            
            <Grid item xs={3.8} style={{ margin: "2px 11px 2px -45px" }}>
              <Card className="card">
                {/* < HalfDoughnutPieChart  pieChatApplicationStatus= {pieChatApplicationStatus}/> */}
              </Card>
            </Grid>
            <Grid item xs={3.8} style={{ margin: "2px" }}>
              <Card className="card">
                {/* <DoughnutPieChart totalInvoiceAmount={totalInvoiceAmount} totalReceiptAmount={totalReceiptAmount}  totalUnbilledAmount ={totalUnbilledAmount} totalOverDueAmount={totalOverDueAmount} paymentDoughNut ={paymentDoughNut}/> */}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className="tw-mt-2.5" style={{ marginBottom: "40px" }}>
      <div className="iframe-div">
      <iframe title="Power BI Report" width="1140" height="541.25" src="
https://app.powerbi.com/reportEmbed?reportId=9a553a6c-c04b-4062-b03c-f0ea5169e76a&autoAuth=true&ctid=65b3a1ac-2d46-4eac-a1e9-e86d226f6ac6"></iframe>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
