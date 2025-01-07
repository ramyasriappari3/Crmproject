export const GLOBAL_API_ROUTES = {
    FORGOT_PASSWORD: "/forgetPassword",
    RESET_PASSWORD: "/reset-password",
    LOGIN_WITH_PASSWORD: '/login',
    LOGOUT: '/logout',
    LOGIN: '/login',
    APPLICANT_DETAILS: '/applicationDetails',
    APPLICANT_DOCUMENTS: '/getApplicationDocuments',
    MY_PROPERTY: '/getAllPropertyList',
    PROPERTY_DETAILS: '/getPropertyDetails',
    MY_TASKS: '/getTaskList',
    UPDATE_PROFILE: '/updateProfile',
    POST_FINANCE_DETAILS: '/customerPostBankDetails',
    GET_FINANCE_DETAILS: '/getCustomerProfileDetails',
    FAQ_QUESTIONS: "/getFaqs", //TYPE,SEARCH KEY
    BookingDetails: '/getPropertyDetails', //?unit_id=1' 
    HomepageFaqs: "/getFaqs",
    REVIEW_DOCUMENTS: "/reviewApplication",
    UPLOAD_DOCUMENTS: "/uploadDocuments",
    UPDATE_DOCUMENTS: "/updateDocuments",
    DOCUMENTS__TYPES: "/documentTypes",
    GET_ALL_ADVERTISEMENT: "/getAllAdvertisement",
    DELETE_APPLICANT_DOCUMENTS: "/deleteCustomerDocuments",
    DELETE_JOINT_APPLICANT_DOCUMENTS: "/deleteJointHolderDocuments",
    BOOKING_DOCUMENTS: "/getCustomerUnitDocuments",
    // BookingDetails:'/getAllPropertyList',
    // HomepageFaqs:"/homepageFaqs",
    GET_RECEIPTS: '/getCustomerReceipts',
    GET_SINGLE_RECEIPT:'/getCustomerReceiptsById',
    GET_UNIT_UPDATES: '/getConstructionUpdates',
    GET_SCHEDULED_PAYMENT: '/getScheduledPayments',
    TDS_DETAILS : '/getCustomerTdsDocuments',
    UPLOAD_TDS_PROOFS:'/uploadTDSProofs',
    UPLOAD_PAYMENT_PROOFS:'/uploadPaymentProofs',
    APPROVE_LEGAL_DOCUMENTS:'/approvePropertyDocument',
    SUBMIT_REVIEW : '/submitApplicationReview',
    GET_TOWERS :'/getTowers',
    GET_PROJECTS : '/getProjects',
    GET_LOCATIONS :'/getLocations',
    GET_PARKING_OPTIONS: "/getParkingOption",
    GET_PARKING_SLOTS: "/getParkingSlots",
    Book_CAR_PARKING: "/bookCarParking",
    BOOKED_PARKINGS: '/bookedParkings',
    UPDATE_USER_PROFILE:'/updateProfilePic',
    UPDATE_PASSWORD:"/resetPassword",
    DOWNLOAD_DOCUMNETS: "/convertUrlToBlob",
    CUSTOMER_UNITS:"/getCustomerUnitsList",
    CUSTOMER_APPLICATION_DETAILS:"/getCustomerProfileDetails",
    UPDATE_CUSTOMER_APPLICATION_DETAILS:"/updateCustomerApplicationDetails",
    UPDATE_JOINT_HOLDER_APPLICATION_DETAILS:"/updateJointHolderApplicationDetails",
    GET_SINGLE_UNIT_DETAILS:"/getCustomerUnitDetails",
    GET_COST_CALCULATION_DATA:"/getCostCalculationData",
    GET_MILESTONE_INVOICE_DATA:"/getCustomerUnitInvoicesDetails",
    GET_STATEMENT_OF_ACCOUNT:"/unitStatementOfAccount",
    UPLOAD_CUSTOMER_DOCUMENT:"/uploadCustomerProfileDocuments",
    UPLOAD_JOINT_CUSTOMER_PROFILE_DOCUMENTS: "/uploadJointCustomerProfileDocuments",
    DOWNLOAD_REVIEW_APPLICATION:"/downloadApplication",
    UPDATE_APPLICATION_STATUS_STAGE:"/updateApplicationStageAndStatus",
    GET_ONBOARD_CUSTOMERS:"/crmOnBoardCustomerDetails",
    GET_CUSTOMER_PAYMENT_PROOFS:"/getPaymentProofs",
    GET_ADVERTISEMENTS:"/crmProjectsAdvertisements",
    GET_MARKETING_IMAGES:"/marketingImages",
    GET_NOTIFICATIONS:"/getCustomerNotification",
    UPDATE_NOTIFICATION:"/updateCustomerNotification"
}