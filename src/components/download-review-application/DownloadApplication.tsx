import CustomPDFViewer from "@Components/custom-pdf-viewer/CustomPDFViewer";
import ReviewApplicationPDF from "@Components/react-pdf/ReviewApplicationPDF";
import ReviewApplicationHooks from "@Src/app/admin/pages/review-application/ReviewApplicationHooks";
import { checkForFalsyValues, convertNumberToWords, convertToTBD, formatNumberToIndianSystem, formatNumberToIndianSystemArea, getDateFormateFromTo } from "@Src/utils/globalUtilities";

export const DownloadApplication = ({ type, displayName }: { type: string, displayName: string }) => {
    const {
        reviewApplicationStatus,
        mainApplicantDetails,
        jointApplicantDetails,
        mainApplicantDocuments,
        applicantBankDetails,
        jointApplicantDocuments,
        customerUnitDetails,
        getParkingCounts,
        conditionalSubmit,
        getDataFromChild,
        setCustomer,
        setShowTermsAndConditionsPopup,
        reviewApplicantDetails,
        getSortingmilestone,
    } = ReviewApplicationHooks();

    // console.log(mainApplicantDetails, "mainApplicantDetails")

    const bookingDetailsInfo = reviewApplicantDetails?.customerApplicantDetails?.paymentDetails;

    // console.log(reviewApplicantDetails, "reviewApplicantDetails");

    console.log(reviewApplicantDetails, "mainApplicantDocuments");

    return (
        <>
            {customerUnitDetails && bookingDetailsInfo && mainApplicantDetails && jointApplicantDocuments &&
                <div style={{ width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CustomPDFViewer type={type} buttonElement={displayName} fileName='Review Application' onClose={() => { }}>
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
                                    bookingAmountPaid: formatNumberToIndianSystem(checkForFalsyValues(Number(bookingDetailsInfo?.booking_amount_paid))),
                                    bookingAmountPaidInWords: convertNumberToWords(checkForFalsyValues(Number(bookingDetailsInfo?.booking_amount_paid)))?.toUpperCase(),
                                    applicantPhoto: reviewApplicantDetails?.customerApplicantDetails?.customerProfileDocumentsDetails?.find((doc: any) => doc?.document_name === 'applicant_photo')?.document_url,
                                    jointApplicantsPhotos: reviewApplicantDetails?.customerApplicantDetails?.jointHolderDocumentsDetails
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
                            customerUnitDetails={reviewApplicantDetails?.customerUnitsDetails?.[0]}
                            applicantDetails={reviewApplicantDetails?.customerApplicantDetails?.customerProfileDetails}
                            jointApplicantDetails={reviewApplicantDetails?.customerApplicantDetails?.jointCustomerProfileDetails}
                            applicantBankDetails={reviewApplicantDetails?.customerApplicantDetails?.customerBankDetails}
                            interestedInHomeLoans={reviewApplicantDetails?.customerApplicantDetails?.paymentDetails?.interested_in_home_loans}
                            milestoneData={getSortingmilestone(reviewApplicantDetails?.customerUnitsDetails)}

                        />
                    </CustomPDFViewer>

                </div>
            }

        </>
    )
}