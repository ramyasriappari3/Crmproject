
import React, { useState } from 'react';
import './AboutProperty.scss';
import { checkForFalsyValues, convertToTBD, downloadFiles, formatNumberToIndianSystem, formatNumberToIndianSystemArea, numberToOrdinals, onlyOrdinals } from '@Src/utils/globalUtilities';
import { InfoOutlined, WidthFull } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import ReactPlayer from 'react-player';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DownloadApplication } from '@Components/download-review-application/DownloadApplication';
import { BlobProvider } from '@react-pdf/renderer';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import Captions from 'yet-another-react-lightbox/plugins/captions';

// interface AboutPropertyProps {
//     unit_type: string;
//     balcony_area: string;
//     carpet_area: string;
//     facing: string;
//     project_description: string;
//     floor_no: string;
//     bhk: number;
//     tower_name: string;
//     account_bank: string;
//     developer_bank_branch_name: string;
//     account_ifsc_code: string;
//     account_number: string;
//     parking_count: number;
//     parking_slots: string;
//     due_amount: number;
//     first_name: string;
//     last_name: string;
//     covered_area: string;
//     saleable_area: number;
//     typical_floor_plan: string;
//     other_charges: string;
//     total_amount: string;
//     appartment_no: number;
//     common_area: string;
//     user_name: string;
// }

const AboutProperty = (props: { propertyData: any, mainApplicant: any, jointApplicantDetails: any, projectImages?: any, blueprintImages: any, videoDetail: any }) => {

    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [currentImagePlan, setCurrentImagePlan] = useState<any>();
    const [currentTitle, setCurrentTitle] = useState<any>();

    // Truncate description if it's too long
    const truncatedDescription = showFullDescription ? props?.propertyData?.description : `${props?.propertyData?.description?.slice(0, 236)}`;
    const gstRateForTooltip = (Number(props?.propertyData?.sgst_rate) + Number(props?.propertyData?.cgst_rate)) * 100;
    const gstRateForTooltipMaintenance = (Number(props?.propertyData?.maintenance_gst_rate_central) + Number(props?.propertyData?.maintenance_gst_rate_state)) * 100;
    const gstRateForTooltipLegal = (Number(props?.propertyData?.legal_gst_rate_central) + Number(props?.propertyData?.legal_gst_rate_state)) * 100;

    // Function to toggle between showing full and truncated description
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleClickSitePreview = () => {
        setShowPreview(true);
        setCurrentImagePlan(props?.blueprintImages?.site_layout_plan_url)
        setCurrentTitle('Site Layout Plan')
    }

    const handleClickFloorPreview = () => {
        setShowPreview(true);
        setCurrentImagePlan(props?.blueprintImages?.typical_floor_plan_url)
        setCurrentTitle('Typical Floor Plan')

    }
    const handleClickUnitPreview = () => {
        setShowPreview(true);
        setCurrentImagePlan(props?.blueprintImages?.unit_floor_plan_url)
        setCurrentTitle('Individual Unit Plan')
    }

    const spaceAfterComma = (carParkingSlots: any) => {
        if (carParkingSlots === '' || carParkingSlots === null || carParkingSlots === undefined) {
            return
        }
        const outputString = carParkingSlots?.replace(/,/g, ", ");
        return outputString;
    }

    const BluePrintImages = ({ onClick, imgSource, blueprintImageName = 'Plan' }: { onClick: () => void, imgSource: string | undefined, blueprintImageName: string }) => {
        if (!imgSource) {
            return null;
        }
        return (
            <div className='floor-plan-hover tw-flex tw-flex-col tw-items-center tw-w-full md:tw-w-1/3 tw-gap-2 tw-border tw-rounded-lg tw-border-black' onClick={onClick}>
                <p className='tw-text-center tw-font-bold'>{blueprintImageName}</p>
                <div className='tw-size-40'>
                    <img src={imgSource} alt={blueprintImageName} className='tw-w-full tw-h-full tw-object-contain' />
                </div>
            </div>
        )
    }

    const bankDetailsOfDeveloper: Array<{ title: string; value: string }> = [
        { title: 'Bank', value: 'developer_bank_account_name' },
        { title: 'Branch', value: 'developer_bank_branch_name' },
        { title: 'IFSC Code', value: 'developer_bank_account_ifsc_code' },
        { title: 'A/C Number', value: 'developer_bank_account_number' },
        { title: 'Bank Account Holder Name', value: 'developer_bank_account_payee_details' }
    ];

    return (
        <div className='about-property-cont tw-pt-4'>
            <div className='property-intro-cont'>
                <h2 className='tw-font-bold tw-mb-2'>Luxury city living</h2>
                <p className='section-titles !tw-leading-relaxed'>{truncatedDescription}</p>

                <button className='read-more-btn' onClick={toggleDescription}>
                    {showFullDescription ? 'Read less' : '...Read more'}
                </button>
                {
                    showFullDescription &&
                    <div className='tw-w-full tw-flex tw-justify-center'>
                        <div className='section-container tw-p-4 md:tw-w-4/5 tw-w-full tw-aspect-[16/9]'>
                            <ReactPlayer controls={true} width={"100%"} height={'100%'} url={props?.videoDetail?.[0]?.url} />
                        </div>
                    </div>
                }
            </div>
            <hr className='tw-mt-5 tw-h-[1px] tw-bg-[#DFE1E7]' />
            <div className='tw-mt-5 tw-flex tw-gap-4 tw-flex-col'>
                <h2 className='tw-font-bold tw-mb-2'>Applicant Details</h2>
                <div className='tw-w-[100%] tw-h-[100%] tw-grid tw-grid-cols-3 !tw-text-sm tw-gap-3'>
                    <div className=''>
                        <p className='section-titles !tw-text-sm'>Primary Applicant Name</p>
                        <p className='tw-font-bold'>{props?.mainApplicant?.full_name || ' '} </p>
                    </div>
                    {props?.jointApplicantDetails?.map((applicant: any, index: any) => (
                        <div key={index} className=''>
                            <p className="section-titles !tw-text-sm">{numberToOrdinals(index + 1)} Joint Applicant Name</p>
                            <p className="tw-font-bold">{applicant?.full_name || ' '}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <button className='bg-black-btn-util'>
                        <DownloadApplication type="download" displayName="Download the Application" />
                    </button>
                </div>
            </div>
            <hr className='tw-mt-5 tw-h-[1px] tw-bg-[#DFE1E7]' />
            <div className='tw-mt-5'>
                <h2 className='tw-font-bold tw-mb-2'>Unit Details</h2>
                <div className='tw-w-[100%] tw-grid tw-grid-cols-4 tw-gap-4 !tw-text-sm'>
                    <div className=''>
                        <p className='section-titles !tw-text-sm'>Tower</p>
                        <p className='tw-font-bold'>Tower {Number(props?.propertyData?.tower_code)}</p>
                    </div>
                    <div className=''>
                        <p className='section-titles !tw-text-sm'>Floor</p>
                        <p className='tw-font-bold'>
                            {Number(props?.propertyData?.floor_no)}
                            <sup>
                                {onlyOrdinals(Number(props?.propertyData?.floor_no))}
                            </sup>
                        </p>
                    </div>
                    <div className=''>
                        <p className='section-titles'>Flat Number</p>
                        <p className='tw-font-bold'>{Number(props?.propertyData?.floor_no)}{props?.propertyData?.unit_no}</p>
                    </div>
                    <div className=''>
                        <p className='section-titles'>Unit Type</p>
                        <p className='tw-font-bold'>{props?.propertyData?.bedrooms}</p>
                    </div>
                    <div className=''>
                        <p className='section-titles'>Facing</p>
                        <p className='tw-font-bold'>{(props?.propertyData?.facing)?.split(" ")?.[0]}</p>
                    </div>
                </div>
            </div>
            <hr className='tw-mt-5 tw-h-[1px] tw-bg-[#DFE1E7]' />
            <div className='property-feature-cont tw-mt-5'>
                <h2 className='tw-font-bold tw-mb-2'>Car Parking Details</h2>
                <div className=''>
                    <div className='tw-w-[100%] tw-h-[100%] tw-grid tw-grid-cols-2 !tw-text-sm'>
                        <div className=''>
                            <p className='section-titles !tw-text-sm'>Number of Parkings</p>
                            <p className='tw-font-bold'>{props?.propertyData?.no_of_parkings || 'N/A'}</p>
                        </div>
                        <div className=''>
                            <p className='section-titles !tw-text-sm'>Parking Slots</p>
                            <p className='tw-font-bold'>{spaceAfterComma(props?.propertyData?.car_parking_slots) || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='notes-cont tw-mt-5 tw-text-gray-500'>
                <p className='tw-font-bold'>
                    Please note:Car parkings are allotted on a first-come, first-served basis
                </p>
                <ul className='tw-list-disc tw-ml-4 fs14'>
                    <li>1 parking for 2BHK and 2.5BHK, 2 parkings for 3BHK</li>
                    <li>Basement 1 reserved for ground to 4th and 35th to 39th floors</li>
                    <li>Basement 2 reserved for 25th to 34th floors</li>
                    <li>Basement 3 reserved for 15th to 24th floors</li>
                    <li>Basement 4 reserved for 5th to 14th floors</li>
                </ul>
            </div>
            <hr className='tw-mt-5 tw-h-[1px] tw-bg-[#DFE1E7]' />
            <div className='property-feature-cont'>
                <h2 className='tw-font-bold tw-mb-2 tw-mt-5'>Area Details</h2>
                <div className='tw-w-[100%] tw-grid md:tw-grid-cols-4 tw-grid-cols-3 tw-gap-4 !tw-text-sm tw-mb-5'>
                    {props?.propertyData?.saleable_area != 0 && (
                        <div className=''>
                            <p className='section-titles'>Saleable Area</p>
                            <p className='tw-font-bold'>
                                {formatNumberToIndianSystemArea(props?.propertyData?.saleable_area)} SFT
                            </p>
                        </div>
                    )}
                    {props?.propertyData?.carpet_area != 0 && (
                        <div className=''>
                            <p className='section-titles'>Carpet Area</p>
                            <p className='tw-font-bold'>
                                {formatNumberToIndianSystemArea(props?.propertyData?.carpet_area)} SFT
                            </p>
                        </div>
                    )}
                    {props?.propertyData?.balcony_area != 0 && (
                        <div className=''>
                            <p className='section-titles'>Exclusive Balcony Area</p>
                            <p className='tw-font-bold'>
                                {formatNumberToIndianSystemArea(props?.propertyData?.balcony_area)} SFT
                            </p>
                        </div>
                    )}
                    {props?.propertyData?.common_area != 0 && (
                        <div className=''>
                            <p className='section-titles'>Common Area (including external walls)</p>
                            <p className='tw-font-bold'>
                                {formatNumberToIndianSystemArea(props?.propertyData?.common_area)} SFT
                            </p>
                        </div>
                    )}
                </div>
                <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-6">
                    {
                        props?.blueprintImages?.site_layout_plan_url &&
                        <BluePrintImages
                            onClick={handleClickSitePreview}
                            imgSource={props?.blueprintImages?.site_layout_plan_url}
                            blueprintImageName="Site Layout Plan"
                        />
                    }
                    {
                        props?.blueprintImages?.typical_floor_plan_url &&
                        <BluePrintImages
                            onClick={handleClickFloorPreview}
                            imgSource={props?.blueprintImages?.typical_floor_plan_url}
                            blueprintImageName="Typical Floor Plan"
                        />
                    }
                    {
                        props?.blueprintImages?.unit_floor_plan_url &&
                        <BluePrintImages
                            onClick={handleClickUnitPreview}
                            imgSource={props?.blueprintImages?.unit_floor_plan_url}
                            blueprintImageName="Individual Unit Plan"
                        />
                    }
                </div>
            </div>
            <hr className='tw-mt-5 tw-h-[1px] tw-bg-[#DFE1E7]' />
            <div className='property-feature-cont tw-mt-5'>
                <h2 className='tw-font-bold tw-mb-2'>Price Details</h2>
                <div className='property-features'>
                    <div className='tw-w-[100%] tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-text-xs'>
                        <div>
                            <p className='section-titles'>Total Sale Consideration (A)
                                <Tooltip title={
                                    <div className='tw-flex tw-flex-col tw-min-h-min tw-w-fit md:tw-w-64 '>
                                        <div className="tw-flex tw-justify-between tw-gap-2">
                                            <p>Basic Rate: <br />
                                                <span className="tw-text-gray-400">
                                                    (as per selected floor)
                                                </span>
                                            </p>
                                            <span className="text_end">₹ {formatNumberToIndianSystem(props?.propertyData?.basic_rate || 0)}</span>
                                        </div>
                                        <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                            <span>Charges For Amenities</span>
                                            <span className="text_end">₹ {formatNumberToIndianSystem(props?.propertyData?.amenity_amount || 0)}</span>
                                        </div>
                                        <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                            <span>Car Parking Charges</span>
                                            <span className="text_end">{convertToTBD(formatNumberToIndianSystem(props?.propertyData?.parking_charges))}</span>
                                        </div>
                                        <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54] tw-gap-2">
                                            <p>Total Sale Consideration:
                                                <br />
                                                <span className="fs11 tw-text-gray-400">(without GST)</span>
                                            </p>
                                            <span>₹ {formatNumberToIndianSystem(props?.propertyData?.calculationFields?.total_sale_consideration_without_gst || 0)}</span>
                                        </div>
                                        <div className="tw-flex tw-justify-between tw-py-2 tw-gap-2">
                                            <span>GST @ {gstRateForTooltip}%</span>
                                            <span className="text_end">₹ {formatNumberToIndianSystem(props?.propertyData?.total_gst_amount || 0)}</span>
                                        </div>
                                        <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54] tw-gap-2">
                                            <p>Total Sale Consideration:
                                                <br />
                                                <span className="fs11 tw-text-gray-400">(including GST)</span>
                                            </p>
                                            <span>₹ {formatNumberToIndianSystem(props?.propertyData?.calculationFields?.total_sale_consideration_with_gst || 0)}</span>
                                        </div>
                                    </div>
                                }
                                    arrow placement='top'
                                    classes={{ tooltip: 'custom-tooltip-color' }}
                                    enterTouchDelay={0}
                                    leaveTouchDelay={5000}
                                >
                                    <InfoOutlined style={{ fontSize: '18px', marginLeft: '5px', cursor: 'pointer' }} />
                                </Tooltip>
                            </p>
                            <p className='tw-font-bold !tw-text-sm'>&#8377; {formatNumberToIndianSystem(props?.propertyData?.calculationFields?.total_sale_consideration_with_gst)}</p>
                        </div>
                        <div>
                            <p className='section-titles'>Other Charges
                                (Payable at the time of registration) (B)
                                <Tooltip title={
                                    <div className='tw-flex tw-flex-col tw-min-h-min tw-w-min md:tw-w-max'>
                                        <div className="tw-flex tw-justify-between tw-py-2 tw-gap-4">
                                            <p>Corpus Fund</p>
                                            <p>₹ {convertToTBD(formatNumberToIndianSystem(props?.propertyData?.calculationFields?.corpus_fund_amt))}</p>
                                        </div>
                                        <div className="tw-flex tw-justify-between tw-py-2 tw-gap-4">
                                            <p>Maintenance Charges <br />
                                                <span className="fs11 tw-text-gray-400 ">({convertToTBD(gstRateForTooltipMaintenance)}% GST included)</span>
                                            </p>
                                            <p>₹ {convertToTBD(formatNumberToIndianSystem(props?.propertyData?.calculationFields?.maintaince_amount_with_gst))}</p>
                                        </div>
                                        <div className="tw-flex tw-justify-between tw-py-2 tw-gap-4">
                                            <p>Legal and Documentation Charges  <br />
                                                <span className="fs11 tw-text-gray-400 ">({convertToTBD(gstRateForTooltipLegal)}% GST included)</span>
                                            </p>
                                            <p>₹ {convertToTBD(formatNumberToIndianSystem(props?.propertyData?.calculationFields?.legal_charges_total))}</p>
                                        </div>
                                    </div>
                                }
                                    arrow placement='top'
                                    classes={{ tooltip: 'custom-tooltip-color' }}
                                    enterTouchDelay={0}
                                    leaveTouchDelay={5000}
                                >
                                    <InfoOutlined style={{ fontSize: '18px', marginLeft: '2px', cursor: 'pointer' }} />
                                </Tooltip>
                            </p>
                            <p className='tw-font-bold !tw-text-sm'>₹ {convertToTBD(formatNumberToIndianSystem(props?.propertyData?.calculationFields?.document_with_gst))}</p>
                        </div>
                        <div>
                            <p className='section-titles'>Total Payable for this unit (A+B)</p>
                            <p className='tw-font-bold !tw-text-sm'>₹ {formatNumberToIndianSystem(props?.propertyData?.calculationFields?.total_amount_ts_plus_othchg)}</p>
                        </div>
                    </div>
                </div >
            </div >
            <hr className='tw-mt-5 tw-h-[1px] tw-bg-[#DFE1E7]' />
            <div className='property-bank-cont tw-mt-5'>
                <h2 className='tw-font-bold'>Property Bank Details</h2>
                <p className='section-titles !tw-text-sm'>
                    These are the details for making payments for {props?.propertyData?.project_name?.split(" ")[2]?.toLowerCase() || ""}
                </p>
                <div className='tw-w-full tw-mt-5 tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-text-sm md:tw-pb-0 tw-pb-5'>
                    {bankDetailsOfDeveloper.map(({ title, value }) => (
                        <div key={title} className='tw-flex tw-flex-wrap tw-flex-col'>
                            <p className='section-titles !tw-text-sm'>{title}</p>
                            <p className='tw-font-bold tw-break-words tw-flex-auto'>{props?.propertyData?.[value]}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Lightbox
                open={showPreview}
                close={() => setShowPreview(false)}
                slides={[{ src: currentImagePlan, title: currentTitle }]}
                plugins={[Zoom, Download, Captions]}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null,
                }}
                carousel={{
                    finite: true,
                    preload: 1,
                    imageFit: 'contain',
                    padding: '4%'
                }}
                zoom={{
                    scrollToZoom: true,
                    maxZoomPixelRatio: 5,
                }}
                animation={{
                    zoom: 400
                }}
                toolbar={{
                    buttons: [
                        'zoom',
                        'download',
                        'close',
                    ],
                }}
                styles={{
                    container: { backgroundColor: 'rgba(0, 0, 0, .9)' },
                    captionsTitle: { fontSize: '18px', color: '#fff', position: 'absolute', top: '20px', left: '20px' },
                }}
                controller={{ closeOnBackdropClick: true, }}
                download={{
                    download: ({ slide }) => {
                        const fileName = slide.src.split('/').pop() || 'image';
                        const fileExtension = fileName.split('.').pop() || 'png';
                        downloadFiles(slide.src, `${fileName.split('.')[0]}.${fileExtension}`);
                    },
                }}
            />
        </div >
    );
};

export default AboutProperty;
