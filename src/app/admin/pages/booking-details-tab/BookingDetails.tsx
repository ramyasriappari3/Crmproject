import React, { useState, useEffect, useRef, RefObject } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./BookingDetails.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LocalPhoneSharpIcon from "@mui/icons-material/LocalPhoneSharp";
import Documents from "../documents-tab/Documents";
import Tasks from "../tasks-tab/Tasks";
import ViewMilestones from "../view-milestones/ViewMilestones";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import saleable_icon from "./../../../../assets/Images/seleable_icon.png";
import unit_icon from "./../../../../assets/Images/unit_icon.png";
import car_icon from "./../../../../assets/Images/car.png";
import RupeeIcon from "./../../../../assets/Images/currency-rupee.png";
import facing_icon from "./../../../../assets/Images/Layer_1.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MenuItem, Menu } from "@mui/material";
import { Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Api from "../../api/Api";
import { useParams } from "react-router-dom";
import {
  formatNumberToIndianSystem,
  convertToTBD,
  getDateFormateFromTo,
  numberToOrdinals,
  formatNumberToIndianSystemArea,
  checkForFalsyValues,
  convertNumberToWords,
} from "@Src/utils/globalUtilities";
import { Tooltip } from "@mui/material";
import { Diversity1, InfoOutlined } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import { Radio } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import location_icon from "./../../../../assets/Images/location_icon.svg";
import phone_icon from "./../../../../assets/Images/phone_icon.svg";
import mail_icon from "./../../../../assets/Images/mail_icon.svg";


import { DownloadApplication } from '@Components/download-review-application/DownloadApplication';
import {
  Dialog,
  DialogContent,
  Checkbox,
  FormControlLabel,
  TextField,
  DialogActions,
} from "@mui/material";
import moment from "moment";
import { useLocation } from "react-router-dom";
import CustomPDFViewer from "@Components/custom-pdf-viewer/CustomPDFViewer";
import { getConfigData } from "@Src/config/config";
import ReviewApplicationHooks from "../review-application/ReviewApplicationHooks";
import ReviewApplicationPDF from "@Components/react-pdf/ReviewApplicationPDF";

interface BookingDetailsProps {
  name: string;
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

const BookingDetails = () => {
  const { customerId, custUnitId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [customerUnits, setCustomerUnits] = useState<CustomerBookingDetails[]>(
    []
  );

  const [customerDetails, setCustomerDetails] = useState<any>({});
  const [customerBankDetails, setCustomerBankDetails] = useState<any>({});
  const [customerDocumentDetails, setCustomerDocumentsDetails] = useState<
    any[]
  >([]);
  const [jointCustomerDetails, setJointCustomerDetails] = useState<any>({});
  const [profilePic, setProfilePic] = useState("");
  const [secondPurchaserDetails, setSecondPurchaserDetails] = useState<any>([]);
  const [receiptsStatus, setReceiptsStatus] = useState(false)
  const gridRef: RefObject<HTMLDivElement> = useRef(null); const [gridHeight, setGridHeight] = useState('auto');

  function handleTabChange(index: number) {
    setCurrentTab(index);
    if (currentTab == 1) {
      setReceiptsStatus(false)
    }
  }

  useEffect(() => {
    if (location.state?.viewMilestonesTab) {
      setCurrentTab(1);
    }
  }, [location.state]);

  useEffect(() => {
    const updateHeight = () => {
      if (gridRef.current) {
        const contentHeight = gridRef.current.scrollHeight;
        setGridHeight(`${contentHeight}px`);
      }
    };

    updateHeight();

    // Add event listener for window resize
    window.addEventListener('resize', updateHeight);

    // Cleanup
    return () => window.removeEventListener('resize', updateHeight);
  }, [currentTab]); // Re-run when tab changescurrentTab]); // Re-run when tab changes

  const steps: string[] = [
    "On Booking",
    "With in 30 days from the date of booking",
    "After casting of 12th floor slab ",
    "After casting of 25th floor slab",
    "After casting of 37th floor slab",
    "After completion of screeding & putty of the respective unit",
    "After completion of flooring doors & windows of the respective unit",
    "All the time of Registration/ Handover / Intimation of Completion(whichever is earlier)",
  ];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openSendLoginPage, setOpenSendLoginPage] = useState(false);
  const open = Boolean(anchorEl);
  const handleBackToGrid = () => {
    navigate("/crm/managecustomer");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const displayFormatAadhar = (value: any) => {
    return value
      ?.replace(/\D/g, "")
      ?.replace(/(.{4})/g, "$1 ")
      ?.trim();
  };

  // here call the get Customer Related to particular Units

  const getCustomerUnitsList = async (
    page: number = 1,
    perPage: number = 5
  ) => {
    const { data, res_status, status, message }: any = await Api.get(
      "get_customer_units_list",
      { cust_profile_id: customerId }
    );
    if (status) {
      setCustomerUnits(data?.resultData);
    } else {
      setCustomerUnits([]);
    }
  };

  const getCustomerDetails = async () => {
    const { data, status, message }: any = await Api.get(
      "get_customer_application_data",
      { cust_profile_id: customerId }
    );
    if (status) {
      // console.log(data, status);
      setCustomerDetails(data.customerProfileDetails);
      setCustomerDocumentsDetails(data.customerProfileDocumentsDetails);
      setCustomerBankDetails(data.customerBankDetails);
      setJointCustomerDetails(data.jointCustomerProfileDetails);
      // let customerProfile = data.customerProfileDocumentsDetails?.filter((item)=>{item.document_name == 'applicant_photo'})
      let customerProfile = data.customerProfileDocumentsDetails?.filter(
        (item: any, index: number) => item.document_name === "applicant_photo"
      );
      setProfilePic(customerProfile[0]?.document_url);

      let joint_purchaser_details = data?.jointCustomerProfileDetails;

      setSecondPurchaserDetails(joint_purchaser_details);

      // /item=>{item.document_name == 'applicant_photo'
    } else {
      setCustomerDetails({});
      setCustomerDocumentsDetails([]);
      setCustomerBankDetails({});
      setJointCustomerDetails([]);
    }
  };

  useEffect(() => {
    getCustomerUnitsList();
    getCustomerDetails();
  }, []);




  function getInitials(fullName: string): string {
    if (!fullName) {
      return "";
    }

    // Split the name by spaces
    const nameParts = fullName.split(" ");

    // Handle different name formats
    if (nameParts.length > 1) {
      // If there are more than one parts, take the first letter of the first and second names
      const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
      const secondNameInitial = nameParts[1].charAt(0).toUpperCase();
      return `${firstNameInitial}${secondNameInitial}`;
    } else {
      // If there is only one part, take the first two letters
      const firstNameInitials = nameParts[0].slice(0, 2).toUpperCase();
      return firstNameInitials;
    }
  }

  const downloadApplicationForm = async () => {
    const { data, status, message }: any = await Api.get(
      "crm_download_application",
      { cust_profile_id: customerId }
    );
    if (status) {
      let url = data?.application_pdf?.resultData;
      return window.open(url, "_blank");
    }
  };

  const resendLoginCrenditials = async (customerDetails: any) => {
    setOpenSendLoginPage(true);
  };

  return (
    <div>
      <div className="manager_header">
        <Button onClick={() => handleBackToGrid()} style={{ color: "black", marginTop: '1rem' }}>
          <ArrowBackIcon color="inherit" />
        </Button>

        <h2 className="tw-font-bold tw-text-black" style={{ marginTop: '1rem' }}>Manage Customers</h2>
      </div>

      <Grid container style={{ height: 'auto', minHeight: '100vh' }}>
        <Grid
          item
          xs={3.4}
          style={{
            border: "1px solid #DFE1E7",
            borderRadius: "0.5rem",
            boxShadow: "inherit",
            background: "white",
            marginRight: "2rem",
            // height: "1199px",
            marginLeft: "1rem",
          }}
        >
          <div>
            <div className="tw-flex tw-justify-center tw-mt-5">
              <div style={{ paddingLeft: "8rem" }}>
                {profilePic ? (
                  <Stack direction="row" spacing={1}>
                    <Avatar alt="Profile Picture" src={profilePic} />
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Avatar>
                      {getInitials(customerDetails?.full_name || "")}
                    </Avatar>
                  </Stack>
                )}
              </div>
              <div style={{ paddingLeft: "4rem" }}>
                <Button
                  sx={{
                    border: "1px solid transparent",
                    "&:hover": {
                      backgroundColor: "transparent", // Remove background color change on hover
                      border: "1px solid transparent", // Keep the border consistent
                    },
                    "&:focus": {
                      outline: "none", // Remove the blue focus outline
                      border: "1px solid transparent", // Remove the border on focus
                    },
                    "&:active": {
                      outline: "none", // Remove the blue focus outline when button is active
                      border: "1px solid transparent", // Remove the border on active
                    },
                  }}
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  disableRipple
                  disableFocusRipple
                >
                  <MoreHorizIcon
                    sx={{
                      color: "black",
                      fontSize: "2rem",
                      border: "1px solid black",
                      borderRadius: 2,
                      marginLeft: "2rem",
                    }}
                  />
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  {/* <MenuItem
                    onClick={() =>
                      navigate(`/crm/application/${customerId}/${custUnitId}`)
                    }
                  >
                    {" "}
                    Edit customer details
                  </MenuItem> */}
                  <MenuItem
                    onClick={() => {
                      resendLoginCrenditials(customerDetails);
                    }}
                  >
                    Resend login credentials
                  </MenuItem>
                  <MenuItem >
                    <div className='bg-black-btn-util'>
                      <DownloadApplication type="download" displayName="Download the Application" />
                    </div>
                  </MenuItem>
                  <MenuItem sx={{ color: "red" }}>Block customer</MenuItem>
                </Menu>
              </div>
            </div>
            <div className="tw-flex tw-justify-center tw-font-bold tw-text-black">
              <p style={{ fontSize: "18px" }}>{customerDetails.full_name} </p>
            </div>
            <div className="tw-flex tw-justify-between" style={{ marginLeft: '8rem' }}>
              <p className="lite  tw-flex tw-gap-1  tw-w-full">
                <img src={location_icon} alt="loaction_icon" style={{ width: '16px', height: '16px', marginTop: '2px' }} />{customerDetails?.address_city}
              </p>
            </div>
            <br></br>

            <div className="details tw-ml-3">
              <div className="tw-flex tw-justify-between" style={{ wordBreak: "break-word" }}>
                <p className="tw-mb-2 tw-flex tw-gap-1  tw-w-full">
                  <img src={mail_icon} alt="mail_icon" className="tw-mr-4 tw-w-5 tw-h-5" />
                  <a
                    href={`mailto:${customerDetails?.email_id}`}

                  >
                    {customerDetails?.email_id}
                  </a>
                </p>
              </div>

              <div className="tw-flex tw-justify-between">
                <p className="tw-mb-2 tw-flex tw-gap-1  tw-w-full">
                  <img src={phone_icon} alt="loaction_icon" className="tw-mr-4 tw-w-5 tw-h-5" />
                  <a href="">{customerDetails?.mobile_number}</a>
                </p>
              </div>
            </div>
            <br></br>
          </div>
          {customerUnits?.length == 1 &&
            customerUnits?.map((item, index) => (
              <>
                <Box>
                  <Grid container spacing={6}>
                    <Grid item xs={5.8}>
                      <p className="tw-ml-3 tw-text-sm">Total Amount Billed</p>
                      <p className="tw-font-bold tw-text-black tw-ml-3 tw-text-sm">
                        ₹{" "}
                        {formatNumberToIndianSystem(item?.total_billed_amount)}
                      </p>
                    </Grid>
                    <Grid item xs={6.2}>
                      <p className=" tw-text-sm tw-mr-1">Total Amount Received</p>
                      <p className="tw-font-bold tw-text-black tw-mr-1 tw-text-sm">
                        ₹{" "}
                        {formatNumberToIndianSystem(item?.total_payable_amount)}
                      </p>
                    </Grid>
                  </Grid>
                </Box>
                <div className="tw-mt-3">
                  <p className="tw-ml-3 tw-text-sm"> Total Amount Due</p>
                  <p className="tw-font-bold tw-text-black tw-ml-3 tw-text-sm">
                    ₹ {formatNumberToIndianSystem(item?.balance_amount)}
                  </p>
                </div>
              </>
            ))}

          <div >
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="tw-font-bold tw-text-sm"
              >
                Personal Details
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ boxShadow: 'none' }}> {/* Ensure no box shadow */}
                  <div className="tw-w-full">
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-text-sm lite">Full Name</p>
                        <p className="tw-text-sm">
                          {customerDetails.customer_title}. {customerDetails.full_name}
                        </p>
                      </div>
                      <div>
                        <p className="tw-text-sm lite">Parent/Spouse Name</p>
                        <p className="tw-text-sm">
                          {customerDetails?.parent_or_spouse_name}
                        </p>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Date Of Birth</p>
                        <p className="tw-text-sm">
                          {moment(customerDetails?.dob).format('DD/MM/YYYY')}
                        </p>
                      </div>
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">PAN Details</p>
                        <p className="tw-text-sm">
                          {customerDetails?.pan_card}
                        </p>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Aadhaar Number</p>
                        <p className="tw-text-sm">
                          {displayFormatAadhar(customerDetails?.aadhaar_number)}
                        </p>
                      </div>
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">GSTIN Number</p>
                        <p className="tw-text-sm">
                          {customerDetails?.gstin_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </Box>
              </AccordionDetails>
            </Accordion>
          </div>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="tw-font-bold tw-text-sm"
              >
                Professional Details
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <div className="tw-w-full">
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-text-sm lite">Occupation</p>
                        <p className="tw-text-sm">
                          {" "}
                          {customerDetails?.occupation}
                        </p>
                      </div>
                      <div>
                        <p className="tw-text-sm lite">Designation</p>
                        <p className="tw-text-sm">
                          {customerDetails?.designation}
                        </p>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Organisation Name</p>
                        <p className="tw-text-sm">
                          {customerDetails?.organisation_name}
                        </p>
                      </div>
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Organisation Address</p>
                        <p className="tw-text-sm">
                          {customerDetails?.organisation_address}
                        </p>
                      </div>
                    </div>
                  </div>
                </Box>
              </AccordionDetails>
            </Accordion>
          </div>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="tw-font-bold tw-text-sm"
              >
                Address Details
              </AccordionSummary>
              <AccordionDetails>
                <p className="tw-text-sm lite">Residential Status</p>
                <p className="tw-text-sm">{customerDetails?.resident_type}</p>

                <p className="tw-mt-5 tw-text-sm lite">Address</p>

                <p className="tw-text-sm">
                  {customerDetails?.customer_flat_house_number} ,{" "}
                  {customerDetails?.address_street1}{" "}
                  {customerDetails?.address_street2},{" "}
                  {customerDetails?.address_city},{" "}
                  {customerDetails?.address_state} {customerDetails?.pin_code},
                  {customerDetails?.address_country}
                </p>
                <Box>
                  <div className="tw-w-full tw-mt-5">
                    <div className="tw-grid tw-grid-cols-2 ">
                      <div>
                        <p className="tw-text-sm lite">Pin Code</p>
                        <p className="tw-text-sm">
                          {customerDetails?.pin_code}
                        </p>
                      </div>
                      <div>
                        <p className="tw-text-sm lite">Phone Residence</p>
                        <p className="tw-text-sm">
                          {customerDetails?.land_line_number}
                        </p>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Office</p>
                        <p className="tw-text-sm">
                          {customerDetails?.office_phone}
                        </p>
                      </div>
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Fax</p>
                        <p className="tw-text-sm">{customerDetails?.fax}</p>

                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Mobile</p>
                        <p className="tw-text-sm">
                          {customerDetails?.mobile_number}
                        </p>
                      </div>
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Email ID</p>
                        <p className="tw-text-sm"
                          style={{ wordBreak: "break-word" }}
                        >
                          {customerDetails?.email_id}
                        </p>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Alternate Mobile</p>
                        <p className="tw-text-sm">
                          {customerDetails?.alternate_mobile}
                        </p>
                      </div>
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Alternate Email ID</p>
                        <p className="tw-text-sm"

                          style={{ wordBreak: "break-word" }}
                        >
                          {customerDetails?.alternate_email_id}
                        </p>
                      </div>
                    </div>
                  </div>
                </Box>
              </AccordionDetails>
            </Accordion>
          </div>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="tw-font-bold tw-text-sm"
              >
                Bank Details
              </AccordionSummary>
              <AccordionDetails>
                <Box>

                  <div className="tw-w-full">
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-text-sm lite">Bank Name</p>
                        <p className="tw-text-sm">
                          {customerBankDetails?.bank_name}
                        </p>
                      </div>
                      <div>
                        <p className="tw-text-sm lite">Branch</p>
                        <p className="tw-text-sm">
                          {customerBankDetails?.bank_branch}
                        </p>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Account Number </p>
                        <p className="tw-text-sm">
                          {customerBankDetails?.bank_account_number}
                        </p>
                      </div>
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">IFSC Code</p>
                        <p className="tw-text-sm">
                          {customerBankDetails?.bank_ifsc_code}
                        </p>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2">
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Bank Holder Name</p>
                        <p className="tw-text-sm">
                          {" "}
                          {customerBankDetails?.name_as_on_bank_account}
                        </p>
                      </div>
                      <div>
                        <p className="tw-mt-5 tw-text-sm lite">Interested In Home Loan</p>
                        <div className="tw-mr-5">
                          <label className="square-radio">
                            Yes
                            <input
                              type="radio"
                              name="example"
                              checked={
                                customerUnits[0]?.interested_in_home_loans ===
                                  true
                                  ? true
                                  : false
                              }
                              disabled
                            />
                            <span className="custom-radio"></span>
                          </label>

                          <label className="square-radio">
                            <span style={{ marginRight: '5px' }}>No</span>
                            <input
                              type="radio"
                              name="example"
                              checked={
                                customerUnits[0]?.interested_in_home_loans ===
                                  false
                                  ? true
                                  : false
                              }
                              disabled
                            />
                            <span className="custom-radio"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                </Box>
              </AccordionDetails>
            </Accordion>
          </div>
        </Grid>
        <Grid item
          xs={8}
          className="second_Grid"
          ref={gridRef}
          style={{ height: gridHeight, overflow: 'auto' }}>
          <div className="tab-header">
            <button
              className={`tab-button ${currentTab === 0 ? "active" : ""}`}
              onClick={() => handleTabChange(0)}
            >
              Booking Details
            </button>
            <button
              className={`tab-button ${currentTab === 1 ? "active" : ""}`}
              onClick={() => handleTabChange(1)}
            >
              View Milestones
            </button>
            <button
              className={`tab-button ${currentTab === 2 ? "active" : ""}`}
              onClick={() => handleTabChange(2)}
            >
              Tasks
            </button>
            <button
              className={`tab-button ${currentTab === 3 ? "active" : ""}`}
              onClick={() => handleTabChange(3)}
            >
              Documents
            </button>
          </div>

          {currentTab === 0 ? (
            customerUnits.map((unititem, index) => (
              <div className="tw-p-4">
                <p className="tw-font-bold tw-text-black tw-mb-2 tw-mt-3 tw-text-sm">
                  Project Details
                </p>
                <p className="tw-font-bold tw-text-black tw-text-sm">
                  {unititem?.project_name}, Tower{" "}
                  {unititem.tower_code?.replace(/^0+/, "")},{" "}
                  {parseInt(unititem?.floor_name, 10).toString() ?? "N/A"}
                  {unititem.unit_no}
                </p>
                <p className="tw-text-sm tw-mt-1">
                  {unititem?.project_city} , {unititem?.project_state}
                </p>
                <div className="tw-flex tw-justify-between tw-mt-3">
                  <div>
                    <p className="tw-text-sm">Tower</p>
                    <p className="tw-font-bold tw-text-black tw-text-sm">
                      Tower {unititem.tower_code?.replace(/^0+/, "")}
                    </p>
                  </div>
                  <div>
                    <p className="tw-text-sm">Floor</p>
                    <p className="tw-font-bold tw-text-black tw-text-sm">
                      {" "}
                      {numberToOrdinals(
                        parseInt(unititem?.floor_name, 10).toString()
                      ) ?? "N/A"}{" "}
                      Floor
                    </p>
                  </div>
                  <div>
                    <p className="tw-text-sm">Flat Number </p>
                    <p className="tw-font-bold tw-text-black tw-text-sm">
                      {parseInt(unititem?.floor_name, 10).toString() ?? "N/A"}
                      {unititem.unit_no}
                    </p>
                  </div>
                  <div></div>
                </div>
                <div
                  className="tw-flex tw-justify-between tw-mb-5 tw-mt-3"
                  style={{ borderBottom: "1px solid #DFE1E7" }}
                >
                  <div className="tw-mb-3">
                    <p className="tw-text-sm">Facing </p>
                    <p className="tw-font-bold tw-text-black tw-text-sm">
                      {(unititem?.facing || "N/A")?.split(" ")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="tw-text-sm">Unit type </p>
                    <p className="tw-font-bold tw-text-black tw-text-sm">
                      {unititem?.bedrooms}
                    </p>
                  </div>
                  <div></div>
                </div>

                <div className="tw-flex tw-justify-between tw-mb-1 tw-mr-2">
                  <p className="tw-font-bold tw-text-black tw-text-sm">
                    Car Parking Details
                  </p>
                  <p className="managecar tw-text-sm">
                    Manage car parking
                    <ArrowForwardIcon />
                  </p>
                </div>
                <div
                  className="tw-flex tw-justify-between tw-mt-3"
                  style={{ borderBottom: "1px solid #DFE1E7" }}
                >
                  <div className="tw-mb-3">
                    <p className="tw-text-sm">Number of parkings </p>
                    <p className="tw-font-bold tw-text-black tw-text-sm">
                      {unititem?.no_of_parkings}
                    </p>
                  </div>
                  <div className="tw-mr-6">
                    <p className="tw-text-sm">Parking Slots</p>
                    <p className="tw-font-bold tw-text-black tw-text-sm">
                      {unititem?.car_parking_slots?.replace(/,/g, " , ")}
                    </p>
                  </div>
                  <div></div>
                </div>

                <p className="tw-font-bold tw-text-black tw-mt-3 tw-text-sm">
                  Area Details
                </p>
                <div
                  className="tw-flex tw-justify-between tw-mt-3"
                  style={{ borderBottom: "1px solid #DFE1E7" }}
                >
                  <div className="tw-mb-3">
                    <p className="tw-text-sm">Saleable area </p>
                    <p className="tw-font-bold tw-text-black tw-text-sm">
                      {" "}
                      {unititem?.saleable_area} SFT
                    </p>
                  </div>
                  <div>
                    <p className="tw-text-sm">Carpet area</p>
                    {Number(unititem?.carpet_area) !== 0 ? (
                      <>
                        <p className="tw-font-bold tw-text-black tw-text-sm">
                          {unititem?.carpet_area} SFT
                        </p>
                      </>
                    ) : (
                      <p className="tw-font-bold tw-text-black tw-text-sm">{0} SFT</p>
                    )}
                  </div>
                  <div>
                    <p className="tw-text-sm">Exclusive balcony area</p>
                    {Number(unititem?.balcony_area) !== 0 ? (
                      <>
                        <p className="tw-font-bold tw-text-black tw-text-sm">
                          {unititem?.balcony_area} SFT
                        </p>
                      </>
                    ) : (
                      <p className="tw-font-bold tw-text-black tw-text-sm">{0} SFT</p>
                    )}
                  </div>
                  <div className="tw-mr-3">
                    <p className="tw-text-sm">Common area (including external walls)</p>
                    {Number(unititem?.common_area) !== 0 ? (
                      <>
                        <p className="tw-font-bold tw-text-black tw-text-sm">
                          {unititem?.common_area} SFT
                        </p>
                      </>
                    ) : (
                      <p className="tw-font-bold tw-text-black tw-text-sm">{0} SFT</p>
                    )}
                  </div>
                </div>
                <div className="tw-flex tw-justify-between tw-mb-1 tw-mr-2  tw-mt-2">
                  <p className="tw-font-bold tw-text-black tw-mt-3 tw-text-sm">
                    Price Details
                  </p>
                  <p className="managecar tw-text-sm tw-mt-3" onClick={() => handleTabChange(1)}>
                    View payment details
                    <ArrowForwardIcon />
                  </p>
                </div>
                <div
                  className="tw-flex tw-justify-between tw-mt-3 tw-text-sm"
                  style={{ borderBottom: "1px solid #DFE1E7" }}
                >
                  <div className="tw-mb-3">
                    <p className=" tw-text-sm tw-flex tw-justify-between">
                      <span>
                        Total Sale Consideration (A)

                      </span>
                      <span style={{ marginRight: '30px' }}>
                        <Tooltip title={
                          <div className='tw-flex tw-flex-col tw-min-h-min tw-w-64 '>
                            <div className="tw-flex tw-justify-between">
                              <p>Basic Rate: <br />
                                <span className="tw-text-gray-400">
                                  (as per selected floor)
                                </span>
                              </p>
                              <span className="text_end">₹ {formatNumberToIndianSystem(unititem?.basic_rate || 0)}</span>
                            </div>
                            {/* <div className="tw-flex tw-justify-between tw-py-2">
                                            <span>Floor Rise Rate</span>
                                            <span className="text_end">₹ {formatNumberToIndianSystem(props?.propertyData?.calculationFields?.floor_rate || 0)}</span>
                                        </div> */}
                            <div className="tw-flex tw-justify-between tw-py-2">
                              <span>Charges For Amenities</span>
                              <span className="text_end">₹ {formatNumberToIndianSystem(unititem?.amenity_amount || 0)}</span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-py-2">
                              <span>Car Parking Charges</span>
                              <span className="text_end">{convertToTBD(formatNumberToIndianSystem(unititem?.parking_charges))}</span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54]">
                              <p>Total Sale Consideration:
                                <br />
                                <span className="fs11 tw-text-gray-400">(without GST)</span>
                              </p>
                              <span>₹ {formatNumberToIndianSystem(unititem?.calculationFields?.total_sale_consideration_without_gst || 0)}</span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-py-2">
                              <span>
                                GST @{" "}
                                {(Number(unititem?.sgst_rate) +
                                  Number(unititem?.cgst_rate)) *
                                  100}
                                %
                              </span>
                              <span className="text_end">₹ {formatNumberToIndianSystem(unititem?.total_gst_amount || 0)}</span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54]">
                              <p>Total Sale Consideration:
                                <br />
                                <span className="fs11 tw-text-gray-400">(including GST)</span>
                              </p>
                              <span>₹ {formatNumberToIndianSystem(unititem?.calculationFields?.total_sale_consideration_with_gst || 0)}</span>
                            </div>
                          </div>
                        }
                          arrow placement='top'
                          classes={{ tooltip: 'custom-tooltip-color' }}
                        >
                          <InfoOutlined style={{ fontSize: '18px', marginLeft: '5px', cursor: 'pointer' }} />
                        </Tooltip>
                      </span>
                    </p>
                    <p className="tw-font-bold tw-text-black">
                      &#8377;{" "}
                      {formatNumberToIndianSystem(
                        unititem?.calculationFields
                          ?.total_sale_consideration_with_gst
                      )}
                    </p>
                  </div>
                  <div>
                    <p className=" tw-text-sm tw-flex tw-justify-between">

                      Other Charges
                      (Payable at the time of registration) (B)

                      <Tooltip
                        title={
                          <div className="tw-flex tw-flex-col tw-h-32 tw-w-64">
                            <div className="tw-flex tw-justify-between tw-py-2">
                              <span>Corpus Fund</span>
                              <span>
                                ₹{" "}
                                {convertToTBD(
                                  formatNumberToIndianSystem(
                                    unititem?.calculationFields?.corpus_fund_amt
                                  )
                                )}
                              </span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-py-2">
                              <p>
                                Maintenance Charges <br />
                                <span className="fs11 tw-text-gray-400 ">
                                  (
                                  {convertToTBD(
                                    (Number(
                                      unititem?.maintenance_gst_rate_central
                                    ) +
                                      Number(
                                        unititem?.maintenance_gst_rate_state
                                      )) *
                                    100
                                  )}
                                  % GST included)
                                </span>
                              </p>
                              <span>
                                ₹{" "}
                                {convertToTBD(
                                  formatNumberToIndianSystem(
                                    unititem?.calculationFields
                                      ?.maintaince_amount_with_gst
                                  )
                                )}
                              </span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-py-2">
                              <p>
                                Legal and Documentation Charges <br />
                                <span className="fs11 tw-text-gray-400 ">
                                  (
                                  {convertToTBD(
                                    (Number(unititem?.legal_gst_rate_central) +
                                      Number(unititem?.legal_gst_rate_state)) *
                                    100
                                  )}
                                  % GST included)
                                </span>
                              </p>
                              <span>
                                ₹{" "}
                                {convertToTBD(
                                  formatNumberToIndianSystem(
                                    unititem?.calculationFields
                                      ?.legal_charges_total
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                        }
                        arrow
                        placement="top"
                        classes={{ tooltip: "custom-tooltip-color" }}
                      >
                        <InfoOutlined
                          style={{ fontSize: "18px", marginLeft: "5px" }}
                        />
                      </Tooltip>

                    </p>
                    <p className="tw-font-bold tw-text-black">
                      &#8377;{" "}
                      {convertToTBD(
                        formatNumberToIndianSystem(
                          unititem?.calculationFields?.document_with_gst
                        )
                      )}
                    </p>
                  </div>

                  <div className="tw-mr-3 tw-ml-7">
                    <p className="tw-text-sm">Total payable for this unit (A+B)</p>
                    <p className="tw-font-bold tw-text-black">
                      ₹{" "}
                      {formatNumberToIndianSystem(
                        unititem?.calculationFields?.total_amount_ts_plus_othchg
                      )}
                    </p>
                  </div>
                </div>

                {secondPurchaserDetails &&
                  secondPurchaserDetails.length > 0 && (
                    <>
                      <p className="tw-font-bold tw-text-black tw-mt-3 tw-text-sm">
                        Joint Applicants
                      </p>

                      {secondPurchaserDetails.map(
                        (purchaser: any, index: number) => (
                          <div key={index}>
                            <Accordion
                              style={{
                                backgroundColor: "#F9FAFA",
                                marginTop: "1rem",
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index + 1}-content`}
                                id={`panel${index + 1}-header`}
                                className="tw-font-bold"
                              >
                                {numberToOrdinals(index + 1)} Joint Applicant
                              </AccordionSummary>
                              <AccordionDetails
                                style={{
                                  backgroundColor: "#FFFFFF",
                                  padding: "16px, 24px, 16px, 24px",
                                  borderRadius: "0.5rem",
                                }}
                                sx={{
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                  margin: "1rem",
                                }}
                              >
                                <p className="tw-font-bold tw-text-black tw-pt-3 tw-mb-3 tw-text-sm">
                                  Personal Details
                                </p>
                                <div className="tw-w-full">
                                  <div className="tw-grid tw-grid-cols-3">
                                    <div>
                                      <p className="tw-text-sm lite tw-mb-1">Full Name</p>
                                      <p className="tw-font-bold tw-text-black tw-text-sm">
                                        {purchaser?.customer_title}.
                                        {purchaser?.full_name}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="tw-text-sm lite tw-mb-1">Date Of Birth</p>
                                      <p className="tw-font-bold tw-text-black tw-text-sm">
                                        {moment(purchaser?.dob).format('DD/MM/YYYY')}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="tw-text-sm lite tw-mb-1">Aadhaar Number</p>
                                      <p className="tw-font-bold tw-text-black tw-text-sm">
                                        {purchaser?.aadhaar_number}
                                      </p>
                                    </div>
                                  </div>
                                </div>


                                <div className="tw-w-full tw-mt-6">
                                  <div className="tw-grid tw-grid-cols-3">
                                    <div>
                                      <p className="tw-text-sm lite tw-mb-1">PAN Details</p>
                                      <p className="tw-font-bold tw-text-black tw-text-sm">
                                        {purchaser?.pan_card}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="tw-text-sm lite tw-mb-1">Mobile Number</p>
                                      <p className="tw-font-bold tw-text-black tw-text-sm">
                                        {purchaser?.mobile_number}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="tw-text-sm lite tw-mb-1">Email ID</p>
                                      <p className="tw-font-bold tw-text-black tw-text-sm">
                                        {purchaser?.email_id}
                                      </p>
                                    </div>
                                  </div>
                                </div>







                                {/* <p className="tw-font-bold tw-text-black tw-p-3">
                                  Resident Type
                                </p> */}
                                {/* 
                                <div className="tw-flex tw-gap-4 tw-items-center">
                                  <label className="text-pri-all">
                                    <Radio
                                      checked={
                                        purchaser?.resident_type === "Resident"
                                      }
                                      disabled
                                    />
                                    Resident
                                  </label>
                                  <label className="text-pri-all">
                                    <Radio
                                      checked={
                                        purchaser?.resident_type === "NRI"
                                      }
                                      disabled
                                    />
                                    NRI
                                  </label>
                                </div> */}
                                <p className="tw-font-bold tw-text-black tw-pt-3 tw-text-sm">
                                  Professional Details
                                </p>
                                <div className="tw-flex tw-justify-between tw-mt-3">
                                  <div className="tw-text-sm">
                                    <p className="lite tw-mb-1">Occupation</p>
                                    <p className="tw-font-bold tw-text-black tw-text-sm">
                                      {purchaser?.occupation}
                                    </p>
                                  </div>
                                  <div className="tw-text-sm" >
                                    <p className="lite tw-mb-1">Designation</p>
                                    <p className="tw-font-bold tw-text-black tw-text-sm">
                                      {purchaser?.designation}
                                    </p>
                                  </div>
                                  <div></div>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        )
                      )}
                    </>
                  )}

                {/* <p className="tw-font-bold tw-text-black tw-mt-5">
                  Other bookings by the customer
                </p>

                <div>
                  <Accordion
                    style={{ backgroundColor: "#DFE1E7", marginTop: "1rem" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <div>
                        <p className="tw-font-bold">
                          {" "}
                          1307, Tower 3, My Home Sayuk
                        </p>

                        <p className="lite">
                          <LocationOnOutlinedIcon />
                          Tellapur, Hyderabad
                        </p>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{
                        backgroundColor: "#FFFFFF",
                        padding: "16px, 24px, 16px, 24px",
                        borderRadius: "0.5rem",
                      }}
                      sx={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        margin: "1rem",
                      }}
                    >
                      <div className="tw-flex tw-justify-between tw-m-3">
                        <div>
                          <span>
                            <img src={saleable_icon} alt="seleable icon" />
                          </span>
                          <p className="lite"> Saleable Area</p>

                          <p className="tw-font-bold tw-text-black">1926 SFT</p>
                        </div>
                        <div>
                          <span>
                            <img src={unit_icon} alt="unit icon" />
                          </span>
                          <p className="lite">Unit type</p>
                          <p className="tw-font-bold tw-text-black">3 BHK</p>
                        </div>
                        <div>
                          <span>
                            <img src={car_icon} alt="car icon" />
                          </span>
                          <p className="lite">Car parking</p>
                          <p className="tw-font-bold tw-text-black">2</p>
                        </div>
                        <div></div>
                      </div>
                      <div className="tw-flex tw-justify-between tw-m-3">
                        <div>
                          <span>
                            <img src={RupeeIcon} alt="rupee icon" />
                          </span>
                          <p className="lite">Total Sale Consideration</p>
                          <span className="tw-font-bold tw-text-black ">
                            ₹ 42,347,43.00{" "}
                          </span>
                          <span className="lite">( includes GST)</span>
                        </div>
                        <div style={{ marginRight: "9rem" }}>
                          <span>
                            <img src={facing_icon} alt="facing icon" />
                          </span>
                          <p className="lite">Facing</p>
                          <p className="tw-font-bold tw-text-black">East</p>
                        </div>
                        <div></div>
                      </div>
                      <div className="tw-flex tw-justify-between tw-mt-5">
                        <div>
                          <AccountCircleIcon />
                          <span className="tw-font-bold tw-text-black">
                            Aarav Sharma
                          </span>

                          <p className="lite tw-ml-5">Sales Executive</p>
                        </div>
                        <div className="lite" style={{ marginLeft: "6rem" }}>
                          <p>
                            <LocalPhoneSharpIcon /> 91 98783746393
                          </p>
                          <p>
                            <MailOutlinedIcon />
                            aravsharma@gmail.com
                          </p>
                        </div>
                        <div></div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div> */}
              </div>
            ))
          ) : currentTab === 1 ? (
            <ViewMilestones currentTab={currentTab} receiptsStatus={receiptsStatus} setReceiptsStatus={setReceiptsStatus} />
          ) : currentTab === 2 ? (
            <Tasks setCurrentTab={setCurrentTab} />
          ) : (
            <Documents />
          )}
        </Grid>
      </Grid>
      {openSendLoginPage && (
        <Dialog open={true} onClose={() => { }}>
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
                  value={customerDetails?.mobile_number}
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
                  value={customerDetails?.email_id}
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
                    backgroundColor: "black",
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
};

export default BookingDetails;


// const DownloadApplication = () => {

//   const {
//     reviewApplicationStatus,
//     mainApplicantDetails,
//     jointApplicantDetails,
//     mainApplicantDocuments,
//     applicantBankDetails,
//     jointApplicantDocuments,
//     customerUnitDetails,
//     getParkingCounts,
//     conditionalSubmit,
//     getDataFromChild,
//     setCustomer,
//     setShowTermsAndConditionsPopup,
//     reviewApplicantDetails,
//     getSortingmilestone,
//   } = ReviewApplicationHooks();


//   const bookingDetailsInfo = reviewApplicantDetails?.customerApplicantDetails?.paymentDetails;


//   return (
//     <>
//       {customerUnitDetails && bookingDetailsInfo && mainApplicantDetails && jointApplicantDocuments &&
//         <div style={{ width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <CustomPDFViewer type="download" buttonElement='' fileName='Review Application' onClose={() => {}} showCloseButton={false}>
//             <ReviewApplicationPDF
//               agreementLetter={
//                 {
//                   projectLogo: getConfigData('projectBanner')?.find((banner: any) => banner?.id === customerUnitDetails?.project_code)?.imgUrl || 'defaultImageUrl',
//                   companyLogo: getConfigData('project_logo_image'),
//                   apartmentNumber: checkForFalsyValues(customerUnitDetails?.tower_code?.replace(/^0+/, "")) + '-' + checkForFalsyValues(parseInt(customerUnitDetails?.floor_no)) + checkForFalsyValues(customerUnitDetails?.unit_no),
//                   customerNumber: checkForFalsyValues(customerUnitDetails?.customer_number?.replace(/^0+/, "")),
//                   bookingNumber: checkForFalsyValues(customerUnitDetails?.booking_no?.replace(/^0+/, "")),
//                   agreementDate: getDateFormateFromTo(customerUnitDetails?.agreement_date),
//                   saleDeedDate: getDateFormateFromTo(customerUnitDetails?.sale_deed_date),
//                   salesRepresentative: checkForFalsyValues(customerUnitDetails?.sales_executive_name) || "N/A",
//                   crmRepresentative: checkForFalsyValues(customerUnitDetails?.crm_executive_name),
//                   place: 'Hyderabad',
//                   date: getDateFormateFromTo("currentdate"),
//                   companyName: checkForFalsyValues(customerUnitDetails?.company_name),
//                   companyAddress: checkForFalsyValues(customerUnitDetails?.company_address),
//                   companyCityAndPin: checkForFalsyValues(customerUnitDetails?.company_city) + '-' + checkForFalsyValues(customerUnitDetails?.company_postal_code)?.split("")?.slice(4)?.join(""),
//                   projectName: checkForFalsyValues(customerUnitDetails?.project_name),
//                   floorNo: checkForFalsyValues((parseInt(customerUnitDetails?.floor_no)?.toString())),
//                   unitNo: checkForFalsyValues(customerUnitDetails?.unit_no),
//                   tower: checkForFalsyValues(customerUnitDetails?.tower_code?.replace(/^0+/, "")),
//                   scaleableArea: checkForFalsyValues(customerUnitDetails?.saleable_area),
//                   bookingTransactionId: bookingDetailsInfo?.booking_transaction_id,
//                   bookingDate: bookingDetailsInfo?.booking_date,
//                   bookingBankName: bookingDetailsInfo?.booking_bank_name,
//                   bookingBranchName: bookingDetailsInfo?.booking_bank_branch_name,
//                   bookingAmountPaid: formatNumberToIndianSystem(checkForFalsyValues(Number(bookingDetailsInfo?.booking_amount_paid))),
//                   bookingAmountPaidInWords: convertNumberToWords(checkForFalsyValues(Number(bookingDetailsInfo?.booking_amount_paid)))?.toUpperCase(),
//                   applicantPhoto: mainApplicantDocuments?.find((doc: any) => doc?.document_name === 'applicant_photo')?.document_url,
//                   jointApplicantsPhotos: reviewApplicantDetails?.customerApplicantDetails?.jointHolderDocumentsDetails
//                     ?.filter((doc: any) => doc?.document_name === 'applicant_photo')
//                     ?.map((data: any, index: any) => (data?.document_url)),
//                   carpetArea: formatNumberToIndianSystemArea(customerUnitDetails?.carpet_area),
//                   balconyArea: formatNumberToIndianSystemArea(customerUnitDetails?.balcony_area),
//                   commonArea: formatNumberToIndianSystemArea(customerUnitDetails?.common_area),
//                   carParkingSlots: convertToTBD(customerUnitDetails?.car_parking_slots),
//                   noOfParking: convertToTBD(getParkingCounts(customerUnitDetails?.car_parking_slots)),
//                   basementLevel: convertToTBD(customerUnitDetails?.basement_level)
//                 }
//               }
//               customerUnitDetails={reviewApplicantDetails?.customerUnitsDetails?.[0]}
//               applicantDetails={reviewApplicantDetails?.customerApplicantDetails?.customerProfileDetails}
//               jointApplicantDetails={reviewApplicantDetails?.customerApplicantDetails?.jointCustomerProfileDetails}
//               applicantBankDetails={reviewApplicantDetails?.customerApplicantDetails?.customerBankDetails}
//               interestedInHomeLoans={reviewApplicantDetails?.customerApplicantDetails?.paymentDetails?.interested_in_home_loans}
//               milestoneData={getSortingmilestone(reviewApplicantDetails?.customerUnitsDetails)}

//             />
//           </CustomPDFViewer>

//         </div>
//       }

//     </>
//   )
// }