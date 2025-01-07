import React, { FC, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import MobileTabs from '@Components/mobile-tabs/MobileTabs';
// import './ReviewApplication.scss'
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';
import { Dialog } from '@mui/material';
import Api from '../../api/Api';
import { useParams } from 'react-router-dom';
import SentApplication from '../sent-application/SentApplication';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import moment from 'moment';
import ReviewApplicationInfo from './ReviewApplicationInfo';
import ReviewSecondPage from '@Components/review-second-page/ReviewSecondpage';
import ReviewThirdPage from '@Components/review-third-page/ReviewThirdPage';
import ReviewFourthPage from '@Components/review-fourth-page/ReviewFourthPage';
import ReviewFivePage from '@Components/review-five-page/ReviewFivePage';
import ReviewSixPage from '@Components/review-six-page/ReviewSixPage';
import ReviewSevenPage from '@Components/review-seven-page/ReviewSevenPage';
import ReviewEightPage from '@Components/review-eight-page/ReviewEightPage';
import userSessionInfo from '../../util/userSessionInfo';
import TermsAndConditions from '@Components/terms-and-conditions/TermsAndConditions';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import ReviewApplicationPDF from '@Components/react-pdf/ReviewApplicationPDF';
import { PDFViewer, BlobProvider } from '@react-pdf/renderer';
import { checkForFalsyValues, convertNumberToWords, convertToTBD, formatNumberToIndianSystem, formatNumberToIndianSystemArea, getDataFromLocalStorage, getDateFormateFromTo, isWindowsOrMac } from '@Src/utils/globalUtilities';
import {getConfigData} from '@Src/config/config';
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';
import { MODULES_API_MAP } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import axios from 'axios';
import CustomPDFViewer from '@Components/custom-pdf-viewer/CustomPDFViewer';
import ReviewApplicationHooks from './ReviewApplicationHooks';


interface propsType {
    setIsFaqSidebar: any,
    setIsBookingDetailSidebar: any,
    setIsCloseFormPopUp: any
}

const ReviewApplication: FC<propsType> = ({ setIsFaqSidebar, setIsBookingDetailSidebar, setIsCloseFormPopUp }) => {

    const {
        reviewApplicationStatus,
        mainApplicantDetails,
        jointApplicantDetails,
        mainApplicantDocuments,
        applicantBankDetails,
        bookingDetailsInfo,
        jointApplicantDocuments,
        customerUnitDetails,
        getParkingCounts,
        conditionalSubmit,
        getDataFromChild,
        setCustomer,
        setShowTermsAndConditionsPopup,
        reviewApplicantDetails,
        getSortingmilestone,
        financeDetails
    } = ReviewApplicationHooks();

    console.log(mainApplicantDetails, "mainApplicantDetails")

    return (
        <>
            <div className='md:tw-hidden tw-flex tw-flex-col tw-gap-3'>
                <div className='tw-flex tw-justify-between'>
                    <div className='tw-flex tw-items-center tw-gap-4'>
                        <div
                            onClick={() => { setIsCloseFormPopUp(true) }}
                        >
                            <CloseIcon />
                        </div>
                        <div className='tw-font-bold text-pri-all'>Review Application</div>
                    </div >
                    <div className='tw-flex tw-items-center tw-gap-4'>
                        <button
                            onClick={() => { setIsBookingDetailSidebar(true) }}
                        ><InfoIcon /></button>
                        <button
                            onClick={() => { setIsFaqSidebar(true) }}
                        ><QuestionMarkIcon /></button>
                    </div>
                </div >
                <MobileTabs index={3} />
            </div >
            <div className={reviewApplicationStatus ? 'tw-hidden' : ''}>
                <p className="tw-font-bold md:tw-block tw-hidden tw-text-xl tw-text-black">Review Application</p>
                <p className="md:tw-text-sm tw-text-xs">
                    Carefully evaluate and confirm the accuracy of the information provided by the application before submission.
                </p>
            </div>
            {reviewApplicationStatus == false ?
                <div style={{ position: 'relative', width: "100%", height: "calc(100vh - 150px)", display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "20px" }}>


                    {customerUnitDetails && bookingDetailsInfo && mainApplicantDetails && jointApplicantDocuments &&
                        // <PDFViewer showToolbar={false} style={{ width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CustomPDFViewer type="" buttonElement='' fileName='hello_world.pdf' onClose={( )=>{}} showCloseButton={false}>
                                <ReviewApplicationPDF
                                    agreementLetter={
                                        {
                                            projectLogo: checkForFalsyValues(customerUnitDetails?.project_banner),
                                            companyLogo: checkForFalsyValues(customerUnitDetails?.project_logo),
                                            apartmentNumber: checkForFalsyValues(customerUnitDetails?.tower_code?.replace(/^0+/, "")) + '-' + checkForFalsyValues(parseInt(customerUnitDetails?.floor_no)) + checkForFalsyValues(customerUnitDetails?.unit_no),
                                            customerNumber: checkForFalsyValues(customerUnitDetails?.customer_number?.replace(/^0+/, "")),
                                            bookingNumber: checkForFalsyValues(customerUnitDetails?.booking_no?.replace(/^0+/, "")),
                                            agreementDate: getDateFormateFromTo(customerUnitDetails?.agreement_date),
                                            saleDeedDate: getDateFormateFromTo(customerUnitDetails?.sale_deed_date),
                                            salesRepresentative: checkForFalsyValues(customerUnitDetails?.sales_executive_name) || "N/A",
                                            crmRepresentative: checkForFalsyValues(customerUnitDetails?.crm_executive_name),
                                            place: 'Hyderabad',
                                            date: getDateFormateFromTo("currentdate"),
                                            companyName: checkForFalsyValues(customerUnitDetails?.company_name),
                                            companyAddress: checkForFalsyValues(customerUnitDetails?.company_address),
                                            companyCityAndPin: checkForFalsyValues(customerUnitDetails?.company_city) + '-' + checkForFalsyValues(customerUnitDetails?.company_postal_code)?.split("")?.slice(4)?.join(""),
                                            projectName: checkForFalsyValues(customerUnitDetails?.project_name),
                                            floorNo: checkForFalsyValues((parseInt(customerUnitDetails?.floor_no)?.toString())),
                                            unitNo: checkForFalsyValues(customerUnitDetails?.unit_no),
                                            tower: checkForFalsyValues(customerUnitDetails?.tower_code?.replace(/^0+/, "")),
                                            scaleableArea: checkForFalsyValues(customerUnitDetails?.saleable_area),
                                            bookingTransactionId: bookingDetailsInfo?.booking_transaction_id,
                                            bookingDate: bookingDetailsInfo?.booking_date,
                                            bookingBankName: bookingDetailsInfo?.booking_bank_name,
                                            bookingBranchName: bookingDetailsInfo?.booking_bank_branch_name,
                                            bookingAmountPaid: formatNumberToIndianSystem(checkForFalsyValues(bookingDetailsInfo?.booking_amount_paid)),
                                            bookingAmountPaidInWords: convertNumberToWords(checkForFalsyValues(bookingDetailsInfo?.booking_amount_paid))?.toUpperCase(),
                                            applicantPhoto: mainApplicantDocuments?.find((doc: any) => doc?.document_name === 'applicant_photo')?.document_url,
                                            jointApplicantsPhotos: jointApplicantDocuments
                                                ?.filter((doc: any) => doc?.document_name === 'applicant_photo')
                                                ?.map((data: any, index: any) => (data?.document_url)),
                                            carpetArea: formatNumberToIndianSystemArea(customerUnitDetails?.carpet_area),
                                            balconyArea: formatNumberToIndianSystemArea(customerUnitDetails?.balcony_area),
                                            commonArea: formatNumberToIndianSystemArea(customerUnitDetails?.common_area),
                                            carParkingSlots: convertToTBD(customerUnitDetails?.car_parking_slots),
                                            noOfParking: convertToTBD(getParkingCounts(customerUnitDetails?.car_parking_slots)),
                                            basementLevel: convertToTBD(customerUnitDetails?.basement_level)
                                        }
                                    }
                                    customerUnitDetails={customerUnitDetails}
                                    applicantDetails={mainApplicantDetails}
                                    jointApplicantDetails={jointApplicantDetails}
                                    applicantBankDetails={applicantBankDetails}
                                    interestedInHomeLoans={financeDetails?.interested_in_home_loans}
                                    milestoneData={getSortingmilestone(reviewApplicantDetails.customerUnitsDetails)}

                                />
                            </CustomPDFViewer>

                        </div>

                        // </PDFViewer>
                    }


                    {/* <div className='tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-flex tw-justify-center tw-items-center tw-h-full tw-bg-black/50 tw-animate-pulse'>
                        </div> */}

                </div >
                : conditionalSubmit() === 'customer' ? ''
                    // <TermsAndConditions
                    //     bookingDetailsdata={reviewApplicantDetails.customerUnitsDetails?.[0]}
                    //     applicantDetails={mainApplicantDetails}
                    //     //isSubmitClicked={showTermsAndConditionsPopup}
                    //     isSubmitClicked={true}
                    //     setIsSubmitClicked={setShowTermsAndConditionsPopup}
                    //     setCustomer={setCustomer}
                    //     onSendDataToParent={getDataFromChild}
                    // />
                    :
                    <SentApplication />
            }

        </>

    );
}

export default ReviewApplication;

{/* <div className="review-application-pages tw-mb-36">
                        <ReviewApplicationInfo
                            customerUnitDetails={reviewApplicantDetails.customerUnitsDetails != undefined ? reviewApplicantDetails.customerUnitsDetails[0] : []}
                            mainApplicantDocuments={mainApplicantDocuments}
                            jointApplicantDocuments={jointApplicantDocuments}
                            bookingDetailsInfo={bookingDetailsInfo}
                        />

                        <div className='page-2 page'>
                            <ReviewSecondPage data={mainApplicantDetails} />
                        </div>

                        {
                            jointApplicantDetails?.slice().sort((a: any, b: any) => parseInt(a.joint_profile_sequence_number) - parseInt(b.joint_profile_sequence_number)).map((m: any, i: any) => (
                                <div className='page-3 page' key={i}>
                                    <ReviewThirdPage data={m} index={i} />
                                </div>
                            ))
                        }


                        <div className='page-4 page'>
                            <ReviewFourthPage
                                applicantBankDetails={applicantBankDetails}
                                jointData={jointApplicantDetails}
                            />
                        </div>

                        <div className='page-5 page'>
                            <ReviewFivePage
                                customerUnitDetails={reviewApplicantDetails.customerUnitsDetails != undefined ? reviewApplicantDetails.customerUnitsDetails[0] : []}
                                costCalculationData={reviewApplicantDetails.customerUnitsDetails != undefined ? reviewApplicantDetails.customerUnitsDetails[0].calculationFields : {}}
                                jointData={jointApplicantDetails}
                                applicationData={mainApplicantDetails}
                                reviewApplicationData={reviewApplicantDetails}
                            />
                        </div>


                        <div className='page-6 page'>
                            <ReviewSixPage
                                jointData={jointApplicantDetails}
                                milestoneData={getSortingmilestone(reviewApplicantDetails.customerUnitsDetails)}
                                applicationData={reviewApplicantDetails.customerUnitsDetails != undefined ? reviewApplicantDetails.customerUnitsDetails[0] : []}
                            />
                        </div>

                        <div className='page-7 page'>
                            <ReviewSevenPage
                                data={mainApplicantDetails}
                                jointData={jointApplicantDetails}
                                customerUnitDetails={reviewApplicantDetails.customerUnitsDetails != undefined ? reviewApplicantDetails.customerUnitsDetails[0] : []}
                            />
                        </div>

                        <div className='page-8 page'>
                            <ReviewEightPage
                                data={mainApplicantDetails}
                                jointData={jointApplicantDetails}
                            />
                        </div>

                    </div> */}