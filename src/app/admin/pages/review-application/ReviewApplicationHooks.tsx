import React, { useEffect, useState } from 'react'
import userSessionInfo from '../../util/userSessionInfo';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import Api from '../../api/Api';

const ReviewApplicationHooks = () => {

    const { customerId } = useParams();
    const sessionCustomerId = sessionStorage.getItem('cust_profile_id');
    const [reviewApplicantDetails, setReviewApplicantDetails]: any = useState({ customerUnitDetails: [] });
    const [isCustomer, setCustomer] = useState(false);
    const [showTermsAndConditionsPopup, setShowTermsAndConditionsPopup] = useState(false);
    const dispatch = useAppDispatch();
    const applicationInfo = useAppSelector((state: any) => {
        return state.applicationInfo;
    });
    const financeDetails = applicationInfo.customerProfileForm.finance_details;
    const reviewApplicationStatus = applicationInfo.customerProfileForm.review_application_action.reviewAppStatus;
    const mainApplicantDetails = applicationInfo.customerProfileForm.applicant_details;
    const jointApplicantDetails = applicationInfo.customerProfileForm.joint_applicant_details;
    const mainApplicantDocuments = applicationInfo.customerProfileForm.upload_documents;
    const applicantBankDetails = applicationInfo.customerProfileForm.finance_details;
    const bookingDetailsInfo = applicationInfo.customerProfileForm.customer_booking_amount_details;
    const jointApplicantDocuments = applicationInfo.customerProfileForm.joint_applicant_documents.flatMap((item: any) => {
        const key = Object.keys(item)[0];
        return item[key];
    });

    const getReviewApplicantionDetails = async () => {
        const paramsInfo = { cust_profile_id: customerId || sessionCustomerId };
        const { data, status, message }: any = await Api.get('customer_review_application', paramsInfo);
        if (status) {
            setReviewApplicantDetails(data);
        } else {
            setReviewApplicantDetails({ customerUnitDetails: [] });
        }
    }

    const getSortingmilestone = (customerUnitsDetails: any) => {
        let result = [];
        if (customerUnitsDetails != undefined) {
            result = customerUnitsDetails[0].unit_milestones?.sort((lista: any, listb: any) => {
                return lista.milestone_sequence - listb.milestone_sequence;
            });
        }
        return result;
    }

    useEffect(() => {
        getReviewApplicantionDetails();
    }, []);

    const conditionalSubmit = () => {
        const userType = userSessionInfo.getUserType();
        if (userType === 'customer') {
            return "customer";
        } else {
            return "crm";
        }
    }

    const getDataFromChild = (data: any) => {

    }

    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }, []);

    const getParkingCounts = (carParkingSlots: any) => {
        if (carParkingSlots === '' || carParkingSlots === null || carParkingSlots === undefined) {
            return
        }
        const regex = /\b[a-zA-Z]+\d+\b/g;
        const matches = carParkingSlots.match(regex);
        return matches ? matches.length : 0;
    }

    const customerUnitDetails = reviewApplicantDetails?.customerUnitsDetails?.[0];

    return {
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
    }
}

export default ReviewApplicationHooks