import MobileTabs from '@Components/mobile-tabs/MobileTabs';
import { checkForFalsyValues, convertNumberToWords, formatNumberToIndianSystem, getDateFormateFromTo } from '@Src/utils/globalUtilities';
import {getConfigData} from '@Src/config/config';
import moment from 'moment';
import './ReviewApplication.scss';

function ReviewApplicationInfo(props: any) {
    const { customerUnitDetails, mainApplicantDocuments, jointApplicantDocuments, bookingDetailsInfo } = props;

    // let jointApplicantDocument = jointApplicantDocuments!=undefined?jointApplicantDocuments?.flatMap():[];
    return (
        <>
            <div className='md:tw-hidden tw-block tw-py-4'>
                <div className='tw-flex tw-justify-between'>
                    <div className='tw-flex tw-items-center tw-gap-2'>
                        {/* <div onClick={() => setIsCloseFormPopUp(true)}><CloseIcon /></div> */}
                        <div className='tw-font-bold text-pri-all'>Review Application</div>
                    </div>
                    <div className='tw-flex tw-items-center tw-gap-2'>
                        {/* <div onClick={() => { setIsBookingDetailSidebar(true) }}><InfoIcon /></div>
                <div onClick={() => { setIsFaqSidebar(true) }}><QuestionMarkIcon /></div> */}
                    </div>
                </div>
                <MobileTabs index={3} />
            </div>

            <p className='tw-font-bold tw-hidden  md:tw-block  tw-text-2xl text-pri-all'>Review Application</p>
            <p className='fs14 sh'>Carefully evaluate and confirm the accuracy of the information provided in your application before submission.</p>

            <div className='page-1 page'>

                <div className='logo'>
                    <div className='logo-home'>
                        <img src={getConfigData('projectBanner').find((banner: any) => banner?.id === customerUnitDetails?.project_code)?.imgUrl || 'defaultImageUrl'} alt="Project Banner" className='tw-w-full tw-h-auto' />
                    </div>
                    <div className='tech-logo'>
                        <img src={getConfigData('project_logo_image')} alt="" />
                    </div>
                </div>

                <div className='review-info-section'>
                    <div className="review-left-section">
                        <div className='left-text'>
                            <span className='light-text'>Apartment Number</span>
                            <span className=''>:</span>
                            <span className='dark-text'>{checkForFalsyValues(customerUnitDetails?.tower_code?.replace(/^0+/, ""))}-{checkForFalsyValues(parseInt(customerUnitDetails?.floor_no))}{checkForFalsyValues(customerUnitDetails?.unit_no)}</span>
                        </div>

                        <div className='left-text'>
                            <span className='light-text'>Customer Number</span>
                            <span className=''>:</span>
                            <span className='dark-text'>{checkForFalsyValues(customerUnitDetails?.customer_number?.replace(/^0+/, ""))}</span>
                        </div>

                        <div className='left-text'>
                            <span className='light-text'>Booking Number</span>
                            <span className=''>:</span>
                            <span className='dark-text'>{checkForFalsyValues(customerUnitDetails?.booking_no?.replace(/^0+/, ""))}</span>
                        </div>
                        <div className='left-text'>
                            <span className='light-text'>Agreement Date</span>
                            <span className=''>:</span>
                            <span className='dark-text'>{getDateFormateFromTo(customerUnitDetails?.agreement_date)}</span>
                        </div>
                        <div className='left-text'>
                            <span className='light-text'>Sale Deed Date</span>
                            <span className=''>:</span>
                            <span className='dark-text'>{getDateFormateFromTo(customerUnitDetails?.sale_deed_date)}</span>
                        </div>
                        <div className='left-text'>
                            <span className='light-text'>Sales Representative</span>
                            <span className=''>:</span>
                            <span className='dark-text'>{checkForFalsyValues(customerUnitDetails?.sales_executive_name) || "N/A"}</span>
                        </div>
                        <div className='left-text'>
                            <span className='light-text'>CRM Representative</span>
                            <span className=''>:</span>
                            <span className='dark-text'>{checkForFalsyValues(customerUnitDetails?.crm_executive_name)}</span>
                        </div>
                    </div>
                    <div className="right-section md:tw-mt-1 tw-mt-2">
                        <div className='right-text'>
                            <span className='light-text'>Place</span>
                            <span className=''>:</span>
                            <span className='dark-text'>Hyderabad</span>
                        </div>
                        <div className='right-text'>
                            <span className='light-text'>Date</span>
                            <span className=''>:</span>
                            <span className='dark-text'>{getDateFormateFromTo("currentdate")}</span>
                        </div>
                    </div>
                </div>
                <br></br><br></br>
                <div className="sub-image">
                    <div className="sub">
                        <p className=''>To,</p> <br />
                        <p className=''>The Director,</p>
                        <p className='fs15'>
                        {customerUnitDetails?.company_name
                          ?.toLowerCase()
                          .replace(/\b\w/g, (char :string) => char.toUpperCase())}</p>
                        <p className=''>{checkForFalsyValues(customerUnitDetails?.company_address)}</p>
                        <p className='tw-text-red-500'>{checkForFalsyValues(customerUnitDetails?.company_city)}-{checkForFalsyValues(customerUnitDetails?.company_postal_code)?.split("")?.slice(4)}</p>
                        {/* <p>{checkForFalsyValues(customerUnitDetails?)</p> */}
                    </div>
                    <div className="image applicant-images-div">
                        <div className="images">
                            {
                                mainApplicantDocuments && mainApplicantDocuments?.some((doc: any) => doc?.document_name === 'applicant_photo') && (
                                    <img
                                        src={mainApplicantDocuments?.find((doc: any) => doc?.document_name === 'applicant_photo')?.document_url}
                                        alt="Applicant"
                                    />
                                )
                            }

                        </div>
                        {
                            jointApplicantDocuments && jointApplicantDocuments?.some((doc: any) => doc?.document_name === 'applicant_photo') && (
                                jointApplicantDocuments
                                    ?.filter((doc: any) => doc?.document_name === 'applicant_photo')
                                    ?.map((data: any, index: any) => (
                                        <div className="images" key={index}>
                                            {data?.document_url ?
                                                <img
                                                    src={data?.document_url}
                                                    alt={`Profile of ${data?.first_name || ""} ${data?.last_name || ""}`}
                                                />
                                                : ' '
                                            }
                                        </div>
                                    ))
                            )
                        }


                    </div>
                </div>

                <div className='tw-text-justify agreement-sec tw-text-base tw-leading-7'>
                    I/We am/are interested to purchase Residential Flat in your Project named <span>"{checkForFalsyValues(
                                        customerUnitDetails?.project_name
                                            ?.toLowerCase()
                                            .replace(/\b\w/g, (char: string) => char.toUpperCase())
                                        )}"</span>,<br />
                    Flat No. <span> &nbsp;&nbsp; {checkForFalsyValues((parseInt(customerUnitDetails?.floor_no)?.toString()))}{checkForFalsyValues(customerUnitDetails?.unit_no)} &nbsp;&nbsp; </span>,  Floor <span>&nbsp;&nbsp; {checkForFalsyValues(parseInt(customerUnitDetails?.floor_no))} &nbsp;&nbsp; </span>,
                    Tower <span>&nbsp;&nbsp;{checkForFalsyValues(customerUnitDetails?.tower_code?.replace(/^0+/, ""))}&nbsp;&nbsp;</span> with a Saleable Area of <span>&nbsp;&nbsp;{checkForFalsyValues(customerUnitDetails?.saleable_area)}&nbsp;&nbsp;</span> Sq.ft.,<br /><br />
                    I/We have read understood and hereby agree to abide by all the terms and conditions attached to this Application Form and also agree to sign and execute, as and when desired by the Company, the Agreement of Sale and other required documents. <br /><br />
                    I/We am/are enclosing herewith a Demand Draft / Cheque No.<span className='tw-mx-1'>{bookingDetailsInfo?.booking_transaction_id}</span>dated<span className='tw-mx-1'>{moment(bookingDetailsInfo?.booking_date).format('DD/MM/YYYY')}</span>
                    drawn on <span>{bookingDetailsInfo?.booking_bank_name},</span><span className='tw-mx-1'>{bookingDetailsInfo?.booking_bank_branch_name}</span>
                    Branch, for an amount of <span>₹ {formatNumberToIndianSystem(checkForFalsyValues(bookingDetailsInfo?.booking_amount_paid))}
                    </span> ({convertNumberToWords(checkForFalsyValues(bookingDetailsInfo?.booking_amount_paid || 0))?.toUpperCase() || 'N/A'} ) being the initial booking amount.
                    <p className='tw-mt-10'>I/We further agree to pay the instalments and other amounts/charges as per the payment terms.</p>
                    {/* <p className='tw-text-right tw-mt-28'>Signature of applicant</p> */}
                </div>
                <p className="page-num">1</p>
            </div>
        </>
    );
}

export default ReviewApplicationInfo;