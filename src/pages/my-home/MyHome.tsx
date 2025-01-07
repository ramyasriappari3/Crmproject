import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import facingIcon from './../../assets/Images/Layer_1.png';
import SucessIcon from './../../assets/Images/Congrats.png';
import ApproveIcon from './../../assets/Images/Approve.png';
import ReDraftIcon from './../../assets/Images/reDraft.png';
import RejectIcon from './../../assets/Images/Reject.png';
import correctIcon from './../../assets/Images/correct.png';
import incorrectIcon from './../../assets/Images/incorrect.png'
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import CarIcon from './../../assets/Images/car.png';
import { Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { getDataFromLocalStorage, removeDataFromLocalStorage, formatNumberToIndianSystem, formatNumberToIndianSystemArea, convertToTBD, capitalizeFirstLetter, downloadFiles, setDataOnLocalStorage, checkForFalsyValues, getDateFormateFromTo, convertNumberToWords } from '@Src/utils/globalUtilities';
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';
import { logout } from '@Src/features/auth/authSlice';
import { AppRouteURls } from '@Constants/app-route-urls';
import RupeeIcon from './../../assets/Images/currency-rupee.png';
import Crm_exec_profile_icon from './../../assets/Images/CRM_profile_img.png';
import { MyContext } from '@Src/Context/RefreshPage/Refresh';
import "./MyHome.scss";
import ReviewApplicationHooks from '@Src/app/admin/pages/review-application/ReviewApplicationHooks';
import CustomPDFViewer from '@Components/custom-pdf-viewer/CustomPDFViewer';
import ReviewApplicationPDF from '@Components/react-pdf/ReviewApplicationPDF';
import { getConfigData } from '@Src/config/config';
import { DownloadApplication } from '@Components/download-review-application/DownloadApplication';


const MyHome = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { setUserApplicationStatus, setModifiedBy, setCustUnitId, setCustProfileId, cust_profile_id, cust_unit_id } = useContext(MyContext);
    const [bookingDetailsData, setBookingDetailsData] = useState<any>([]);
    const dispatchLogout = useAppDispatch()
    const gstRateForTooltip = (Number(bookingDetailsData?.sgst_rate) + Number(bookingDetailsData?.cgst_rate)) * 100;

    interface Status {
        Status: string;
        color: string;
        IconType: JSX.Element;
        headerText: JSX.Element;
        subText1: string;
        ButtonText: string;
    }
    const userDetails: any = JSON.parse(getDataFromLocalStorage('user_details') || "{}")
    //setModifiedBy(userDetails?.user_login_name);
    const StatusList: Record<string, Status> = {
        "Not Submitted": {
            Status: "Not Submitted",
            color: "#1F69FF",
            IconType: <img src={SucessIcon} alt='' />,
            headerText: <h2 className='tw-text-2xl tw-font-bold' style={{ color: '#25272D' }} > Welcome to My Home, {bookingDetailsData?.full_name}</h2>,
            subText1: "Your relationship manager has set up the dashboard for you. Feel free to complete the application form and begin tracking the construction progress and updates.",
            ButtonText: "Complete the application",
        },
        "Submitted": {
            Status: "Submitted",
            color: "#EB9F0C",
            IconType: <img src={SucessIcon} alt='' />,
            headerText: <div className='tw-text-2xl tw-font-bold '><h2> Your application has been submitted successfully.</h2></div>,
            subText1: "You have successfully submitted the application form, which is currently under review. Our CRM executive will assess it and share an update soon.",
            ButtonText: "Download the application"
        },
        "Approved": {
            Status: "Approved",
            color: "#00BD35",
            IconType: <img src={ApproveIcon} alt='' />,
            headerText: <div className='tw-text-2xl tw-font-bold '><h2> Your application has been</h2> <p className='tw-flex tw-justify-center'>successfully accepted!</p></div>,
            subText1: "Our CRM executive has thoroughly reviewed your application and granted full approval. You can now access the dashboard to monitor construction progress and track payment milestones.",
            ButtonText: "Go to dashboard"
        },
        "Re-Draft": {
            Status: "Re-Draft",
            color: "#EB9F0C",
            IconType: <img src={ReDraftIcon} alt='' />,
            headerText: <div className='tw-text-2xl tw-font-bold '><h2>Oops! Your application needs a little </h2> <p className='tw-flex tw-justify-center'>touch-up. Let's fix it together!</p></div>,
            subText1: "It appears there are mismatches in your entered data. Please revisit the  application and make necessary corrections for accuracy.",
            ButtonText: "Go back to application",

        },
        "Rejected": {
            Status: "Rejected",
            color: "#FF0006",
            IconType: <img src={RejectIcon} alt='' />,
            headerText: <div className='tw-text-2xl tw-font-bold '><h2> Unfortunately, your application has been</h2>  <p className='tw-flex tw-justify-center'> rejected.</p></div>,
            subText1: "Your application has been declined due to unforeseen circumstances. Kindly contact your relationship manager for further assistance.",
            ButtonText: "",
        }
    }



    const BookingDetails = async () => {
        try {
            dispatch(showSpinner());
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.CUSTOMER_UNITS).GET();
            if (apiResponse?.success) {
                setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.CUST_UNIT_ID, apiResponse?.data?.resultData?.[0]?.cust_unit_id);
                setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.UNIT_ID, apiResponse?.data?.resultData?.[0]?.unit_id);
                setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.CUST_PROFILE_ID, apiResponse?.data?.resultData?.[0]?.cust_profile_id);
                setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.APPLICATION_STATUS, apiResponse?.data?.resultData?.[0]?.application_status);
                setBookingDetailsData(apiResponse?.data?.resultData?.[0]);
                setUserApplicationStatus(apiResponse?.data?.resultData?.[0]?.application_status);
                setCustProfileId(apiResponse?.data?.resultData?.[0]?.cust_profile_id);
                setCustUnitId(apiResponse?.data?.resultData?.[0]?.cust_unit_id);
            }
        } catch (error) {

        }
        finally {
            dispatch(hideSpinner());
        }

    }

    const applicationDownload = async () => {
        try {
            dispatch(showSpinner());
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.DOWNLOAD_REVIEW_APPLICATION}`).GET();
            if (apiResponse?.success) {
                return apiResponse?.data?.application_pdf?.resultData;
            }
        } catch (error) {

        }
        finally {
            dispatch(hideSpinner());
        }

    }

    const getNavigationPath = async (status: string) => {
        switch (status) {
            case 'Not Submitted':
                return `/my-application-form/${cust_profile_id}/${cust_unit_id}`;
            case 'Submitted':
                return '/my-home';
            case 'Approved':
                return '/dashboard';
            case 'Re-Draft':
                return `/my-application-form/${cust_profile_id}/${cust_unit_id}`;
            case 'Rejected':
                return `/my-application-form/${cust_profile_id}/${cust_unit_id}`;
            default:
                return '/my-home';
        }
    }

    const getStatusClass = (status: any) => {
        switch (status) {
            case 'Approved':
                return 'Approve';
            case 'Rejected':
                return 'Reject';
            case 'Re-Draft':
                return 'Re-Draft';
            case 'Submitted':
                return 'Under_review';
            case 'Not Submitted':
                return 'incomplete';
            default:
                return 'incomplete';
        }
    };

    const getRedraftReasons = () => {
        const redraft_Application_comment = bookingDetailsData?.redraft_application_comments;
        const redraft_document_comment = bookingDetailsData?.redraft_document_comments;
        switch (bookingDetailsData?.application_redraft_reasons) {
            case "Application Form":
                return { redraft_Application_comment };
            case "Document Upload":
                return { redraft_document_comment };
            case "both":
                return { redraft_document_comment, redraft_Application_comment };
            default:
                break;
        }
    }

    const logoutHandler = () => {
        removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY);
        removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS);
        removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_TOKEN);
        dispatchLogout(logout());
        navigate(`/${AppRouteURls.LOG_IN}`);
    }

    useEffect(() => {
        BookingDetails();
    }, [])
    return (
        <div className='my-home-page'>
            <div className='tw-bg-white navbar md:tw-hidden tw-block'>
                <div className='nav-content'>
                    <div className='tw-flex tw-justify-between'>
                        <div className='tw-flex tw-items-start left-section'>
                            <img className='navbar-img' src="/logo.png?w=540" alt="" />
                            <ul className='nav-list'>
                                {/* <NavLink to={`/sessions/0`} className={`nav-list__item`}>
								<li>Dashboard</li>
							</NavLink> */}
                            </ul>
                        </div>
                        <div className='tw-flex tw-items-start tw-gap-4 right-section'>
                            <div className='tw-flex tw-items-center tw-gap-4'>
                                <div onClick={logoutHandler} className='booking-details tw-cursor-pointer tw-font-bold fs14 text-pri-all'>
                                    Log out
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='tw-flex tw-justify-center tw-px-4' >
                <div className='home-page padd-page md:tw-flex md:tw-w-4/5 tw-w-full tw-justify-center tw-gap-8  md:tw-p-2 md:tw-mt-4 tw-mt-[4.2rem]'>
                    <div className="left-container lg:tw-w-[53%] tw-rounded-2xl tw-h-min md:tw-p-0 tw-p-4">
                        <div className='tw-flex tw-flex-col tw-justify-between tw-items-center' >
                            <div className='tw-mt-6  tw-text-black'>
                                {StatusList[bookingDetailsData?.application_status || 'Not Submitted']?.IconType}
                            </div>
                            <div className='tw-text-center  tw-text-black'>
                                {StatusList[bookingDetailsData?.application_status || 'Not Submitted']?.headerText}
                            </div>
                            <p className='tw-text-left tw-mt-3 tw-px-8 tw-text-sm tw-mb-2' >
                                {StatusList[bookingDetailsData?.application_status || 'Not Submitted']?.subText1}
                            </p>
                        </div>
                        <div className='md:tw-px-8 tw-pb-8'>
                            <div className='tw-border-[1px] tw-border-[#DFE1E7] tw-rounded-lg  tw-p-5'>
                                <div className='tw-flex md:tw-flex-row tw-flex-col md:tw-gap-0 tw-gap-2 tw-justify-between tw-items-center' >
                                    <h3 className='tw-font-bold tw-text-lg text_color' style={{ color: '#25272D' }} >Application for flat allotment</h3>
                                    <div className={`${getStatusClass(bookingDetailsData?.application_status)} tw-px-5 tw-py-1 tw-rounded-md tw-text-white tw-text-sm`} >
                                        {StatusList[bookingDetailsData?.application_status || 0]?.Status}
                                    </div>
                                </div>
                                <hr className='tw-my-4' />
                                <div className='tw-flex tw-mb-6 tw-justify-between' >
                                    <div className='tw-size-10'>
                                        <img src={'/images/peopleLogo.svg'} alt="peopleLogo" className='!tw-max-w-10' />
                                    </div>
                                    <div className='tw-flex tw-flex-col tw-mr-auto tw-ml-3' >
                                        <div className='tw-font-bold tw-text-base tw-text-black'>Application Information </div>
                                        <div className='tw-text-sm'
                                        >
                                            {
                                                (bookingDetailsData?.application_status === 'Re-Draft'
                                                    && bookingDetailsData?.redraft_application_comments) ?
                                                    <span className='reject-comments'>
                                                        {getRedraftReasons()?.redraft_Application_comment}
                                                    </span>
                                                    :
                                                    <span>
                                                        Provide accurate and complete information of personal details for efficient processing of your application.
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    {
                                        (bookingDetailsData.application_stage === 'application_data_capture' ||
                                            bookingDetailsData.application_stage === 'document_upload' ||
                                            bookingDetailsData.application_stage === 'booking_amount_details' ||
                                            bookingDetailsData.application_stage === 'review_application' ||
                                            bookingDetailsData.application_status === 'Submitted') && (bookingDetailsData?.application_status !== "Re-Draft") || (bookingDetailsData?.application_status === "Re-Draft" && bookingDetailsData?.redraft_application_comments == null) ?
                                            <div>
                                                {/* {!bookingDetailsData?.redraft_application_comments &&
                                                <img src={correctIcon} alt='' className='!tw-max-w-10' />
                                            } */}
                                                <img src={correctIcon} alt='' className='!tw-max-w-10' />

                                            </div>
                                            :
                                            <div></div>
                                    }
                                    {
                                        (bookingDetailsData.application_status === 'Re-Draft' &&
                                            getRedraftReasons()?.redraft_Application_comment) ?
                                            <div>
                                                <img src={incorrectIcon} alt='' className='!tw-max-w-10' />
                                            </div>
                                            :
                                            <div>

                                            </div>
                                    }
                                </div>
                                <div className='tw-flex tw-mb-6 tw-justify-between'>
                                    <div className='tw-size-10'>
                                        <img src={'/images/uploadLogo.svg'} alt="uploadLogo" className='!tw-max-w-10' />
                                    </div>
                                    <div className='tw-flex tw-flex-col tw-mr-auto tw-ml-3'>
                                        <div className='tw-font-bold tw-text-base tw-text-black'>Upload Documents </div>
                                        <div className='tw-text-sm'>
                                            {
                                                (bookingDetailsData.application_status === 'Re-Draft' &&
                                                    getRedraftReasons()?.redraft_document_comment) ?
                                                    <span className='reject-comments'>
                                                        {getRedraftReasons()?.redraft_document_comment}
                                                    </span>
                                                    :
                                                    <span>
                                                        Upload your KYC documents.
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    {
                                        // !bookingDetailsData.redraft_document_comments ?
                                        (bookingDetailsData.application_stage === 'document_upload' ||
                                            bookingDetailsData.application_stage === 'booking_amount_details' ||
                                            bookingDetailsData.application_stage === 'review_application' ||
                                            bookingDetailsData.application_status === 'Submitted') &&
                                            !(bookingDetailsData.application_status === "Re-Draft") ||
                                            (bookingDetailsData?.application_status === "Re-Draft" && bookingDetailsData.redraft_document_comments == null) ?
                                            <div>
                                                <img src={correctIcon} alt='' className='!tw-max-w-10' />
                                            </div>
                                            :
                                            <div>

                                            </div>
                                    }
                                    {
                                        (bookingDetailsData.application_status === 'Re-Draft' &&
                                            getRedraftReasons()?.redraft_document_comment) &&
                                        <div>
                                            <img src={incorrectIcon} alt='' className='!tw-max-w-10' />
                                        </div>
                                    }
                                </div>
                                <div className='tw-flex tw-mb-6 tw-justify-between'>
                                    <div className='tw-size-10'>
                                        <img src={'/images/cvLogo.svg'} alt="cvLogo" className='!tw-max-w-10' />
                                    </div>
                                    <div className='tw-flex tw-flex-col tw-mr-auto tw-ml-3' >
                                        <div className='tw-font-bold tw-text-base tw-text-black'>
                                            Review Application
                                        </div>
                                        <div className='tw-text-sm'>
                                            {
                                                (bookingDetailsData.application_status === 'Re-Draft') ?
                                                    <span className='reject-comments'>
                                                        Would you mind making the requested changes and resubmitting the review application? we'd really appreciate it. Thanks a lot!"
                                                    </span>
                                                    :
                                                    <span>
                                                        Review the information provided, price breakup and confirm.
                                                    </span>
                                            }
                                        </div>
                                    </div>

                                    {
                                        // !(bookingDetailsData.redraft_document_comments || bookingDetailsData.redraft_application_comments) ?
                                        (bookingDetailsData.application_stage === 'review_application' ||
                                            bookingDetailsData.application_status === 'Submitted') && !(bookingDetailsData.application_status === "Re-Draft") ?
                                            <div>
                                                <img src={correctIcon} alt='' className='!tw-max-w-10' />
                                            </div>
                                            :
                                            <div></div>
                                    }
                                    {
                                        (bookingDetailsData.application_status === 'Re-Draft') &&
                                        <div>
                                            <img src={incorrectIcon} alt='' className='!tw-max-w-10' />
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                        <div className='tw-flex tw-justify-center tw-items-center md:tw-mt-0 tw-my-4'>
                            {bookingDetailsData?.application_status === 'Submitted' ?
                                <button className='tw-w-[90%] tw-mb-4 tw-py-3 tw-p-2 tw-bg-[#241F20] tw-rounded-lg tw-text-white tw-text-lg tw-font-medium'>
                                    <DownloadApplication type="download" displayName="Download the Application" />
                                </button>
                                : <button onClick={async () => navigate(await getNavigationPath(bookingDetailsData?.application_status || 'Not Submitted'))} className='tw-w-[90%] tw-mb-4 tw-py-3 tw-p-2 tw-bg-[#241F20] tw-rounded-lg tw-text-white tw-text-lg tw-font-medium' >
                                    {StatusList[bookingDetailsData?.application_status || 'Not Submitted']?.ButtonText}
                                </button>}
                        </div>
                    </div>
                    <div className="right-container lg:tw-w-[33%] md:tw-mt-0 tw-mt-8"  >
                        <div className="tw-rounded-3xl m-1 right-up-cont text-sm tw-overflow-y-hidden">
                            {
                                <img src={(bookingDetailsData?.project_images?.find((image: any) => image?.image_type === 'booking detail card image')?.images_url) || '/images/Home.png'}
                                    alt="Home" className='tw-w-full tw-object-cover' />
                            }
                            <div className='tw-p-6' >
                                <p className='tw-font-bold tw-text-black tw-text-lg'>
                                    {capitalizeFirstLetter(bookingDetailsData?.project_name) || "N/A"},
                                    Tower {parseInt(bookingDetailsData?.tower_code, 10).toString() || "N/A"},
                                    Unit {parseInt(bookingDetailsData?.floor_no, 10).toString() || "N/A"}
                                    {bookingDetailsData?.unit_no || "N/A"}
                                </p>
                                <div className='tw-flex tw-gap-0'>
                                    <img src="/images/location-icon.svg" alt="" className='tw-w-min tw-h-5 tw-mr-1' />
                                    <p className='fs14'>{bookingDetailsData?.project_city || "N/A"}, {bookingDetailsData?.project_state || "N/A"} </p>
                                </div>
                                <div className='tw-flex tw-justify-between tw-mt-3' >
                                    <div>
                                        <img src="/images/resize.svg" alt="" className='tw-w-min tw-h-6' />
                                        <p className='fs13' >Saleable Area&nbsp;
                                            <Tooltip title={
                                                <div className='tw-flex tw-flex-col tw-h-auto tw-w-auto tw-p-1'>
                                                    {bookingDetailsData?.carpet_area != 0 &&
                                                        <div className="tw-flex tw-justify-between tw-py-2">
                                                            <span>Carpet Area:</span>
                                                            <span className="text_end">
                                                                {formatNumberToIndianSystemArea(bookingDetailsData?.carpet_area)} SFT
                                                            </span>
                                                        </div>
                                                    }
                                                    {bookingDetailsData?.balcony_area != 0 &&
                                                        <div className="tw-flex tw-justify-between tw-py-2">
                                                            <span>Balcony Area:</span>
                                                            <span className="text_end">
                                                                {formatNumberToIndianSystemArea(bookingDetailsData?.balcony_area)} SFT
                                                            </span>
                                                        </div>
                                                    }
                                                    {bookingDetailsData?.common_area != 0 &&
                                                        <div className="tw-flex tw-justify-between tw-py-2">
                                                            <span>Common Area:</span>
                                                            <span className="text_end">
                                                                {formatNumberToIndianSystemArea(bookingDetailsData?.common_area)} SFT
                                                            </span>
                                                        </div>
                                                    }
                                                    {bookingDetailsData?.uds_area != 0 &&
                                                        <div className="tw-flex tw-justify-between tw-py-2">
                                                            <span>UDS Area:</span>
                                                            <span className="text_end">
                                                                {formatNumberToIndianSystemArea(bookingDetailsData?.uds_area)} SFT
                                                            </span>
                                                        </div>
                                                    }
                                                    {bookingDetailsData?.saleable_area != 0 &&
                                                        <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54]">
                                                            <span>Total Saleable Area:</span>
                                                            <span className="text_end">
                                                                {formatNumberToIndianSystemArea(bookingDetailsData?.saleable_area)} SFT
                                                            </span>
                                                        </div>
                                                    }
                                                </div>
                                            }
                                                arrow placement='top'
                                                classes={{ tooltip: 'custom-tooltip-color' }}
                                                enterTouchDelay={0}
                                                leaveTouchDelay={5000}
                                            >
                                                <InfoOutlinedIcon style={{ fontSize: '18px', color: '#25272D', cursor: 'pointer' }} />
                                            </Tooltip>
                                        </p>
                                        <p className='tw-font-bold fs13 text-pri-all' >{formatNumberToIndianSystemArea(bookingDetailsData?.saleable_area) || 0} SFT</p>
                                    </div>
                                    <div>
                                        <img src={"/images/floor-plan-icon.svg"} alt="" className='tw-w-min tw-h-6' />
                                        <p className=' fs13'>Unit Type</p>
                                        <p className='tw-font-bold fs13 text-pri-all'>{bookingDetailsData?.bedrooms || '0 BHK'}</p>
                                    </div>
                                    <div>
                                        <img src={"/images/car-icon.svg"} alt="" className='tw-w-min tw-h-6' />
                                        <p className='fs13'>Car parking</p>
                                        <p className='tw-font-bold fs13 text-pri-all'>{bookingDetailsData?.no_of_parkings || 0}</p>
                                    </div>
                                </div>
                                <div className='tw-flex tw-mt-3'>
                                    <div className='tw-mt-3 tw-mr-5' >
                                        <div className="tw-w-6 tw-h-6">
                                            <img src="/images/ruppee-icon.svg" alt="" className='tw-w-min tw-h-6' />
                                        </div>
                                        <p className=' fs13'>Total sale consideration&nbsp;
                                            <Tooltip title={
                                                <div className='tw-flex tw-flex-col tw-min-h-max tw-w-fit md:tw-w-64'>
                                                    <div className="tw-flex tw-justify-between tw-py-2">
                                                        <p>Basic Rate: <br />
                                                            <span className="tw-text-gray-400">
                                                                (as per selected floor)
                                                            </span>
                                                        </p>
                                                        <span>₹ {formatNumberToIndianSystem(bookingDetailsData?.basic_rate || 0)}</span>
                                                    </div>
                                                    <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                                        <span>Charges For Amenities:</span>
                                                        <span>₹ {formatNumberToIndianSystem(bookingDetailsData?.amenity_amount || 0)}</span>
                                                    </div>
                                                    <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                                        <span>Car Parking Charges:</span>
                                                        <span>{convertToTBD(formatNumberToIndianSystem(bookingDetailsData?.parking_charges))}</span>
                                                    </div>
                                                    <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54] tw-gap-2">
                                                        <p>Total Sale Consideration:
                                                            <br />
                                                            <span className="fs11 tw-text-gray-400">(without GST)</span>
                                                        </p>
                                                        <span>₹ {formatNumberToIndianSystem(bookingDetailsData?.calculationFields?.total_sale_consideration_without_gst || 0)}</span>
                                                    </div>
                                                    <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                                        <span>GST @ {gstRateForTooltip}%:</span>
                                                        <span>₹ {formatNumberToIndianSystem(bookingDetailsData?.total_gst_amount || 0)}</span>
                                                    </div>
                                                    <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54] tw-gap-2">
                                                        <p>Total Sale Consideration:
                                                            <br />
                                                            <span className="fs11 tw-text-gray-400">(including GST)</span>
                                                        </p>
                                                        <span>₹ {formatNumberToIndianSystem(bookingDetailsData?.calculationFields?.total_sale_consideration_with_gst || 0)}</span>
                                                    </div>
                                                </div>

                                            }
                                                arrow placement='top'
                                                classes={{ tooltip: 'custom-tooltip-color' }}
                                                enterTouchDelay={0}
                                                leaveTouchDelay={5000}
                                            >
                                                <InfoOutlinedIcon
                                                    style={{ fontSize: '18px', color: '#25272D', cursor: 'pointer' }}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        const tooltip = event.currentTarget.parentElement;
                                                        if (tooltip) {
                                                            tooltip.dispatchEvent(new Event('touchstart'));
                                                            setTimeout(() => {
                                                                document.addEventListener('touchstart', () => {
                                                                    tooltip.dispatchEvent(new Event('touchend'));
                                                                }, { once: true });
                                                            }, 0);
                                                        }
                                                    }}
                                                />
                                            </Tooltip>
                                        </p>
                                        <p className='tw-font-bold fs13 text-pri-all' >₹ {formatNumberToIndianSystem(bookingDetailsData?.calculationFields?.total_sale_consideration_with_gst) || 0} <span style={{ fontWeight: 'normal', color: 'gray' }}>(includes GST)</span> </p>
                                    </div>
                                    <div className='tw-mt-3' >
                                        <img src={"/images/compass-icon.svg"} alt="" className='tw-w-min tw-h-6' />
                                        <p className='fs13'>Facing</p>
                                        <p className='tw-font-bold fs13 text-pri-all'>{(bookingDetailsData?.facing || "N/A")?.split(' ')?.[0]}</p>
                                    </div>
                                </div>
                                <hr className='tw-mt-5' />
                                <div className='tw-flex' >
                                    <img className='tw-size-12 tw-mt-5' src={bookingDetailsData?.sales_executive_image || Crm_exec_profile_icon} alt="crm" />
                                    <div className='tw-ml-3 tw-mb-3'>
                                        <h5 className='tw-font-bold fs15 tw-mt-6 tw-text-black '>{bookingDetailsData?.sales_executive_name || "N/A"}</h5>
                                        <p className='tw-font-light fs13'>Sales Executive</p>
                                    </div>
                                </div>
                                <div className='tw-mt-2 tw-flex tw-flex-col' >
                                    <div className='tw-flex'>
                                        <a href={`tel:${bookingDetailsData?.sales_executive_mobile_number || "N/A"}`} className='tw-flex md:tw-hidden' >
                                            <img src={'/images/phone.svg'} alt="" className='tw-mr-2' />
                                            <span className='fs13 tw-font-light ' >+91 {bookingDetailsData?.sales_executive_mobile_number || "N/A"}</span>
                                        </a>
                                        <div className='tw-hidden md:tw-flex' >
                                            <img src={'/images/phone.svg'} alt="" className='tw-mr-2' />
                                            <span className='fs13 tw-font-light ' >+91 {bookingDetailsData?.sales_executive_mobile_number || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className=''>
                                        <a href={`mailto:${bookingDetailsData?.sales_executive_email || "N/A"}`} className='tw-flex' >
                                            <img src={'/images/mail.svg'} alt="" className='tw-mr-2' />
                                            <span className='fs13 tw-font-light tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap ' >{bookingDetailsData?.sales_executive_email || "N/A"}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='right-down-cont tw-mt-3 ' >
                            <p className='tw-font-bold tw-text-black' > Need Help?</p>
                            {/* <p>+91 8638973648</p> */}
                            <p className='fs13 tw-font-normal tw-text-[#989FAE] tw-cursor-pointer'> <a href="mailto:support@myhomeconstructions.com">support@myhomeconstructions.com</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MyHome;