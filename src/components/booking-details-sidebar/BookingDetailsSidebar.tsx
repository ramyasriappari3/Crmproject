// Start of Selection
import React, { useState, useEffect, FC } from 'react';
import ReactDOM from 'react-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip, Slide, Dialog, Skeleton } from '@mui/material';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import Crm_exec_profile_icon from './../../assets/Images/CRM_profile_img.png';
import { capitalizeFirstLetter, convertToTBD, formatNumberToIndianSystem, formatNumberToIndianSystemArea } from '@Src/utils/globalUtilities';
import ReviewApplicationHooks from '@Src/app/admin/pages/review-application/ReviewApplicationHooks';
import './BookingDetailsSideBar.scss';

interface BookingDetailsSidebarProps {
    setIsBookingDetailSidebar: (value: boolean) => void;
    isBookingDetailSidebar: boolean;
}

interface ProjectImage {
    image_type: string;
    images_url: string;
}

interface CalculationFields {
    total_sale_consideration_without_gst: number;
    total_sale_consideration_with_gst: number;
}

interface BookingDetailsData {
    project_name: string;
    tower_code: string;
    floor_name: string;
    unit_no: string;
    project_city: string;
    project_state: string;
    carpet_area: number;
    balcony_area: number;
    common_area: number;
    uds_area: number;
    saleable_area: number;
    bedrooms: number;
    no_of_parkings: number;
    basic_rate: number;
    amenity_amount: number;
    parking_charges: number;
    sgst_rate: number;
    cgst_rate: number;
    total_gst_amount: number;
    facing: string;
    sales_executive_image: string;
    sales_executive_name: string;
    sales_executive_mobile_number: string;
    sales_executive_email: string;
    project_images: ProjectImage[];
    calculationFields: CalculationFields;
}

const BookingDetailsSidebar: FC<BookingDetailsSidebarProps> = ({ setIsBookingDetailSidebar, isBookingDetailSidebar }) => {
    const [bookingDetailsData, setBookingDetailsData] = useState<BookingDetailsData | null>(null);
    const [projectImage, setProjectImage] = useState<string>('');
    const [isClosing, setIsClosing] = useState(false);
    const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
    const { customerUnitDetails } = ReviewApplicationHooks();

    const fetchBookingDetails = async () => {
        try {
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.CUSTOMER_UNITS).GET();
            if (apiResponse?.success) {
                const resultData: BookingDetailsData[] = apiResponse?.data?.resultData || [];
                const firstData = resultData[0];
                setBookingDetailsData(firstData);
                const bookingImage = firstData?.project_images?.find(image => image.image_type === 'booking detail card image');
                setProjectImage(bookingImage?.images_url || '');
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    useEffect(() => {
        fetchBookingDetails();

        const handlePopState = () => {
            handleClose();
        };
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const gstRateForTooltip = React.useMemo(() => {
        if (!bookingDetailsData) return 0;
        return (Number(bookingDetailsData.sgst_rate) + Number(bookingDetailsData.cgst_rate)) * 100;
    }, [bookingDetailsData]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsBookingDetailSidebar(false);
            setIsClosing(false);
        }, 300);
    };

    return ReactDOM.createPortal(
        <div onClick={handleClose} className={`${isBookingDetailSidebar ? 'modal' : 'tw-hidden'}`}>
            <Slide direction="left" in={isBookingDetailSidebar && !isClosing} timeout={300} mountOnEnter unmountOnExit>
                <div onClick={(e) => e.stopPropagation()} className='modal-content tw-p-4 md:tw-pl-4 tw-pl-8'>
                    <div className='tw-flex tw-gap-4 tw-items-center tw-justify-between tw-mb-4'>
                        <div className='section-heading fs20'>Booking Details</div>
                        <p className='tw-cursor-pointer' onClick={handleClose}>
                            <CloseIcon sx={{ color: '#000000' }} />
                        </p>
                    </div>

                    <div className="tw-flex tw-justify-center tw-flex-col tw-items-center">
                        <div className="property-container tw-shadow tw-rounded-xl tw-overflow-hidden">
                            {projectImage ? (
                                <img src={projectImage} alt="home img" className='tw-w-full tw-object-cover tw-rounded-t-2xl' />
                            ) : (
                                <Skeleton variant="rectangular" width="100%" height={200} className='tw-rounded-t-2xl' />
                            )}
                            <div className='tw-p-4'>
                                {bookingDetailsData ? (
                                    <>
                                        <p className="tw-font-bold tw-text-black tw-text-[1.02rem]">
                                            {capitalizeFirstLetter(bookingDetailsData.project_name) || "NA"}, Tower {parseInt(bookingDetailsData.tower_code).toString() || "NA"}, Unit {parseInt(bookingDetailsData.floor_name).toString() || "NA"}{bookingDetailsData.unit_no || "NA"}
                                        </p>
                                        <div className='tw-flex tw-gap-1'>
                                            <img src="/images/location-icon.svg" alt="Location Icon" className='tw-mr-1' />
                                            <p className='fs13 tw-text-slate-500'>
                                                {bookingDetailsData.project_city || "NA"}, {bookingDetailsData.project_state || "NA"}
                                            </p>
                                        </div>
                                        <div className='tw-flex tw-justify-between tw-mt-3'>
                                            <div>
                                                <img src="/images/resize.svg" alt="Resize Icon" className='tw-w-min tw-h-6' />
                                                <p className='fs13 tw-text-slate-500'>
                                                    Saleable Area&nbsp;
                                                    <Tooltip
                                                        title={
                                                            <div className='tw-flex tw-flex-col tw-h-auto tw-w-fit md:tw-w-auto'>
                                                                {bookingDetailsData.carpet_area != 0 && (
                                                                    <div className="tw-flex tw-justify-between tw-py-2">
                                                                        <span>Carpet Area:</span>
                                                                        <span className="text_end">
                                                                            {formatNumberToIndianSystemArea(bookingDetailsData.carpet_area)} SFT
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {bookingDetailsData.balcony_area != 0 && (
                                                                    <div className="tw-flex tw-justify-between tw-py-2">
                                                                        <span>Balcony Area:</span>
                                                                        <span className="text_end">
                                                                            {formatNumberToIndianSystemArea(bookingDetailsData.balcony_area)} SFT
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {bookingDetailsData.common_area != 0 && (
                                                                    <div className="tw-flex tw-justify-between tw-py-2">
                                                                        <span>Common Area:</span>
                                                                        <span className="text_end">
                                                                            {formatNumberToIndianSystemArea(bookingDetailsData.common_area)} SFT
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {bookingDetailsData.uds_area != 0 && (
                                                                    <div className="tw-flex tw-justify-between tw-py-2">
                                                                        <span>UDS Area:</span>
                                                                        <span className="text_end">
                                                                            {formatNumberToIndianSystemArea(bookingDetailsData.uds_area)} SFT
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {bookingDetailsData.saleable_area != 0 && (
                                                                    <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54]">
                                                                        <span>Total Saleable Area:</span>
                                                                        <span className="text_end">
                                                                            {formatNumberToIndianSystemArea(bookingDetailsData.saleable_area)} SFT
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        }
                                                        arrow
                                                        placement='top'
                                                        classes={{ tooltip: 'custom-tooltip-color' }}
                                                        enterTouchDelay={0}
                                                        leaveTouchDelay={5000}
                                                    >
                                                        <InfoOutlinedIcon style={{ fontSize: '18px', color: '#25272D', cursor: 'pointer' }} />
                                                    </Tooltip>
                                                </p>
                                                <p className='tw-font-bold fs13 text-pri-all'>
                                                    {formatNumberToIndianSystemArea(bookingDetailsData.saleable_area) || 0} SFT
                                                </p>
                                            </div>
                                            <div>
                                                <img src="/images/floor-plan-icon.svg" alt="Floor Plan Icon" className='tw-w-min tw-h-6' />
                                                <p className='fs13 tw-text-slate-500'>Unit Type</p>
                                                <p className='tw-font-bold fs13 text-pri-all'>
                                                    {bookingDetailsData.bedrooms || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <img src="/images/car-icon.svg" alt="Car Icon" className='tw-w-min tw-h-6' />
                                                <p className='fs13 tw-text-slate-500'>Car parking</p>
                                                <p className='tw-font-bold fs13 text-pri-all'>
                                                    {bookingDetailsData.no_of_parkings || 0}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='tw-flex tw-justify-between'>
                                            <div className='tw-mt-5 tw-mr-5'>
                                                <img src="/images/ruppee-icon.svg" alt="Rupee Icon" className='tw-w-min tw-h-6' />
                                                <p className='fs13 tw-text-slate-500'>
                                                    Total sale consideration
                                                    <Tooltip
                                                        title={
                                                            <div className='tw-flex tw-flex-col tw-min-h-max tw-w-fit md:tw-w-auto'>
                                                                <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                                                    <p>
                                                                        Basic Rate: <br />
                                                                        <span className="tw-text-gray-400">(as per selected floor)</span>
                                                                    </p>
                                                                    <span>₹ {formatNumberToIndianSystem(bookingDetailsData.basic_rate)}</span>
                                                                </div>
                                                                <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                                                    <span>Charges For Amenities:</span>
                                                                    <span>₹ {formatNumberToIndianSystem(bookingDetailsData.amenity_amount)}</span>
                                                                </div>
                                                                <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                                                    <span>Car Parking Charges:</span>
                                                                    <span>{convertToTBD(formatNumberToIndianSystem(bookingDetailsData.parking_charges))}</span>
                                                                </div>
                                                                <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54] tw-gap-2">
                                                                    <p>
                                                                        Total Sale Consideration:
                                                                        <br />
                                                                        <span className="fs11 tw-text-gray-400">(without GST)</span>
                                                                    </p>
                                                                    <span>₹ {formatNumberToIndianSystem(bookingDetailsData.calculationFields.total_sale_consideration_without_gst)}</span>
                                                                </div>
                                                                <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                                                    <span>GST @ {gstRateForTooltip}%:</span>
                                                                    <span>₹ {formatNumberToIndianSystem(bookingDetailsData.total_gst_amount)}</span>
                                                                </div>
                                                                <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54] tw-gap-2">
                                                                    <p>
                                                                        Total Sale Consideration:
                                                                        <br />
                                                                        <span className="fs11 tw-text-gray-400">(including GST)</span>
                                                                    </p>
                                                                    <span>₹ {formatNumberToIndianSystem(bookingDetailsData.calculationFields.total_sale_consideration_with_gst)}</span>
                                                                </div>
                                                            </div>
                                                        }
                                                        arrow
                                                        placement='top'
                                                        classes={{ tooltip: 'custom-tooltip-color' }}
                                                        enterTouchDelay={0}
                                                        leaveTouchDelay={5000}
                                                    >
                                                        <InfoOutlinedIcon style={{ fontSize: '18px', marginLeft: '3px', color: '#25272D', cursor: 'pointer' }} />
                                                    </Tooltip>
                                                </p>
                                                <p className='tw-font-bold fs13 text-pri-all'>
                                                    ₹ {formatNumberToIndianSystem(bookingDetailsData.calculationFields.total_sale_consideration_with_gst)}{' '}
                                                    <span className='tw-text-slate-500 tw-font-normal tw-text-xs'>(includes GST)</span>
                                                </p>
                                            </div>
                                            <div className='tw-mt-5'>
                                                <img src="/images/compass-icon.svg" alt="Compass Icon" className='tw-w-min tw-h-6' />
                                                <p className='fs13 tw-text-slate-500'>Facing</p>
                                                <p className='tw-font-bold fs13 text-pri-all'>
                                                    {(bookingDetailsData.facing || "N/A").split(" ")[0]}
                                                </p>
                                            </div>
                                        </div>
                                        <hr className='tw-mt-5' />
                                        <div className='tw-flex tw-mt-4'>
                                            <img className="tw-size-10" src={bookingDetailsData.sales_executive_image || Crm_exec_profile_icon} alt="Sales Executive" />
                                            <div className='tw-ml-3 tw-mb-3'>
                                                <h5 className='tw-font-bold fs14'>{bookingDetailsData.sales_executive_name || "N/A"}</h5>
                                                <p className='tw-text-slate-500 fs13'>Sales Executive</p>
                                            </div>
                                        </div>
                                        <div className='tw-mt-1.5'>
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
                                            <div className='tw-flex tw-mt-2'>
                                                <a href={`mailto:${bookingDetailsData?.sales_executive_email || "N/A"}`} className='tw-flex' >
                                                    <img src={'/images/mail.svg'} alt="" className='tw-mr-2' />
                                                    <span className='fs13 tw-font-light tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap ' >{bookingDetailsData?.sales_executive_email || "N/A"}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Skeleton variant="text" width="80%" height={30} />
                                        <Skeleton variant="text" width="60%" height={20} className='tw-mt-2' />
                                        <div className='tw-flex tw-justify-between tw-mt-3'>
                                            <div>
                                                <Skeleton variant="rectangular" width={50} height={24} />
                                                <Skeleton variant="text" width={100} height={20} className='tw-mt-1' />
                                            </div>
                                            <div>
                                                <Skeleton variant="rectangular" width={50} height={24} />
                                                <Skeleton variant="text" width={50} height={20} className='tw-mt-1' />
                                            </div>
                                            <div>
                                                <Skeleton variant="rectangular" width={50} height={24} />
                                                <Skeleton variant="text" width={80} height={20} className='tw-mt-1' />
                                            </div>
                                        </div>

                                        <div className='tw-flex tw-justify-between tw-mt-5 tw-mr-5'>
                                            <Skeleton variant="text" width="70%" height={20} />
                                            <Skeleton variant="text" width="60%" height={20} />
                                        </div>
                                        <div className='tw-mt-5'>
                                            <Skeleton variant="text" width="50%" height={20} />
                                        </div>
                                        <hr className='tw-mt-5' />
                                        <div className='tw-flex tw-mt-4'>
                                            <Skeleton variant="circular" width={40} height={40} />
                                            <div className='tw-ml-3 tw-mb-3'>
                                                <Skeleton variant="text" width={100} height={24} />
                                                <Skeleton variant="text" width={80} height={18} className='tw-mt-1' />
                                            </div>
                                        </div>
                                        <div className='tw-mt-1.5'>
                                            <div className='tw-flex'>
                                                <Skeleton variant="circular" width={20} height={20} />
                                                <Skeleton variant="text" width={120} height={20} className='tw-ml-3' />
                                            </div>
                                            <div className='tw-flex tw-mt-2'>
                                                <Skeleton variant="circular" width={20} height={20} />
                                                <Skeleton variant="text" width={150} height={20} className='tw-ml-3' />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {bookingDetailsData ? (
                            <>
                                <div className="tnc-container tw-shadow tw-flex tw-justify-between tw-rounded-lg tw-cursor-pointer" onClick={() => setShowTermsAndConditions(true)}>
                                    <p className='fs14 tw-text-slate-800'>Terms and Conditions</p>
                                    <ArrowForwardIcon sx={{ color: '#000000', fontSize: 'large' }} />
                                </div>
                                <div className='tw-w-full tw-h-[20%] tw-mt-1.5'>
                                    <p className='tw-font-bold fs14 tw-text-black'>Need Help?</p>
                                    <p className="fs13 tw-text-slate-400">
                                        <a href="mailto:support@myhomeconstructions.com">support@myhomeconstructions.com</a>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Skeleton variant="rectangular" width="100%" height={40} className='tw-mt-4 tw-rounded-lg' />
                                <Skeleton variant="text" width="60%" height={20} className='tw-mt-2' />
                            </>
                        )}
                    </div>

                    <Dialog open={showTermsAndConditions} onClose={() => setShowTermsAndConditions(false)}>
                        <div className='tw-p-6'>
                            <div className='tw-flex tw-justify-between tw-items-center tw-mb-4'>
                                <div className='tw-font-bold tw-text-2xl text-pri-all'>Terms and Conditions</div>
                                <div className='tw-cursor-pointer' onClick={() => setShowTermsAndConditions(false)}>
                                    <Tooltip title='Close' arrow placement='top'>
                                        <CloseIcon />
                                    </Tooltip>
                                </div>
                            </div>
                            <div>
                                {bookingDetailsData ? (
                                    <div className='tw-flex tw-flex-col tw-gap-2 tw-text-justify'>
                                        {(customerUnitDetails?.terms_and_conditions || []).map((data: any, index: number) => (
                                            <div key={data.id} className='tw-flex'>
                                                <div>{index + 1}.</div>
                                                <div>{data.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='tw-flex tw-flex-col tw-gap-2 tw-text-justify'>
                                        {Array.from(new Array(5)).map((_, index) => (
                                            <Skeleton key={index} variant="text" width="100%" height={20} />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='tw-flex tw-justify-end tw-items-center'>
                                <button onClick={() => setShowTermsAndConditions(false)} className='bg-black-btn-util tw-text-white tw-px-4 tw-py-2 tw-rounded-lg'>
                                    Close
                                </button>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </Slide>
        </div>,
        document.querySelector('body')!
    );
};

export default BookingDetailsSidebar;