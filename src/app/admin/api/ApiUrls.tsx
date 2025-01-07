const api_urls: any = {
    "auth_login": "/crmadminlogin",
    "auth_logout": "/auth/logout",
    "refresh_token": "/token/refresh",
    "onboard_customers": "/crmOnBoardCustomerDetails",
    "manager_customers": "/crmManagerCustomerDetails",
    "get_customer_application_data": "/crmgetCustomerProfileDetails",
    "documents_upload": "/crmuploadDocuments",
    "customer_review_application": "/crmreviewApplication",
    "create_customer_application": "/crmPostapplication",
    "get_customer_units_list": "/crmgetCustomerUnitsList",
    "get_project_towers": "/crmProjectTowerData",
    "get_crm_review_application": "/crmreviewApplication",
    "crm_verify_application": "/crmVerifyApplication",
    "crm_payment_proofs": "/crmPaymentProofs",
    "crm_update_payment_reconclied": "/crmupdateReconclied",
    "crm_tds_documents": "/crmCustomerTdsDocuments",
    "crm_document_type_values": "/getDocumentTypesValues",
    "crm_aggrement_sale": "/crmAggrementOfSale",
    "crm_customer_unit_documents": "/crmCustomerUnitDocuments",
    "crm_customer_tds_documents": "/crmCustomerTdsDocuments",
    "crm_customer_profile_documents": "/crmuploadCustomerProfileDocuments",
    "crm_download_documents": "/convertUrlToBlob",
    "crm_download_customer_unit_documents": "/crmDeleteDocuments",
    "crm_milestones_tab_view": "/crmCustomerUnitDetails",
    "crm_invoices": "/crmCustomerUnitInvoicesDetails",
    "crm_forgot_password": "/crmforgotPassword",
    "updatePassword": "/updatePassword",
    "crm_update_profile_pic": "/crmUpdateProfilePic",
    "crm_details": "/crmgetCrmDetails",
    "crm_download_application": "/crmdownloadApplication",
    "crm_application_status_info": "/crmDashboardApplicationStatusInf",
    "crm_get_all_customer_receipts": "/crmgetCustomerReceipts",
    "crm_get_single_receipt": "/crmgetCustomerReceiptsById",
    "crm_property_documents_tasks": "/crmCreatePropertyDocTasks",
    "crm_tasks_list": "/crmgetTaskList",
    "crm_joint_cust_delete": "/crmDeleteJointCustomerDetails",
    "crm_aggrement_status": "/crmDashboardAggrementStatus",
    "crm_get_parking_projects": "/crmgetCarParkingProject",
    "crm_get_parking_project_towers": "/crmgetParkingTowerList",
    "crm_get_parking_towers_flat_types": "/crmgetBedRooms",
    "crm_get_parking_towers_flat_sizes": "/crmgetScalableArea",
    "crm_get_parking_towers_floors": "/crmgetTotalNoOfFloors",
    "crm_get_parking_towers_locations": "/crmgetParkingLocationList",
    "crm_post_construction_images": "/crmPostConstruction",
    "crm_get_construction_images": "/crmgetConstructionImages",
    "crm_projects_list": "/crmgetProjects",
    "crm_get_faqs": "/getFaqs",
    "crm_post_faqs": "/crmPostFaqs",
    "crm_get_project_images": "/crmProjectsImages",
    "get_enum_values": "/enumValues",
    "delete_crm_delete": "/crmdeleteData",
    "crm_post_project_images": "/crmCreateProjectImages",
    "crm_post_project_advertisement": "/crmCreateAdvertisements",
    "crm_get_projects_advertisements": "/crmProjectsAdvertisements",
    "crm_update_project_logs": "/crmUpdateProjectLogo",
    "crm_marketing_images": "/crmCreateMarketingImages",
    "crm_get_marketing_images": "/crmMarketingImages",
    "crm_get_terms_and_conditions_info": "/crmgetTermsAndConditions",
    "crm_add_terms_and_conditions": "/crmCreateTermsAndConditions",
    "crm_get_tds_info": "/crmgetTermsAndConditions",
    "crm_post_tds_info": "/crmCreateTermsAndConditions",
    "crm_update_existing_document": "/crmUpdateExistingDocument",
    "crm_get_parking_project_list": "/crmgetCarParkingProject",
    "crm_get_parking_tower_list": "/crmgetParkingTowerList",
    "crm_get_parking_location_list": "/crmgetParkingLocationList",
    "crm_get_parking_slots": "/crmgetParkingLocationSlots",
    "crm_get_parking_update": "/crmUpdateParkingStatus",
    "crm_post_parking_rules": "/crmCreateCarParkingRules",
    "crm_get_parking_rules_versions": "/crmgetRulesByTowerAndProject",
    "crm_update_parking_rules_version_in_force": "/crmUpdateInforce",
    "crm_get_check_parking_rules":"/crmcheckParkingRules",
    "crm_get_customer_booked_parking":"/crmgetCustomerBookedParking",
    "crm_reset_password":"/crmResetPassword",
    "crm_create_doc_template":"/crmCreateDocumentTemplates",
    "crm_doc_template_list":"/crmgetDocumentTemplateList",
    "crm_update_document_template":"/crmUpdateDocumentTemplates",
    "crm_get_heirachy_personal_details":"/crmgetHeirarchyPersonnalDetails",
    "crm_get_Notification":"/crmgetNotification",
    "crm_update_CustomerNotification":"/updateCustomerNotification"

    
};
function getApiUrlInfo(apiName = "") {
    const checkCrm = window.location.href.includes("crm");
    let apiUrl = `${process.env.REACT_APP_CRM_AUTH_API_URL}`;
    if (checkCrm) {
        if (apiName) {
            apiUrl += api_urls[apiName];
        }
    } else {
        if (apiName === "get_customer_application_data") {
            apiUrl += "/getCustomerProfileDetails";
        } else if (apiName === "create_customer_application") {
            apiUrl += "/customerApplication";
        } else if (apiName === "crm_joint_cust_delete") {
            apiUrl += "/deleteJointCustomerDetails";
        } else if (apiName === "documents_upload") {
            apiUrl += "/uploadDocuments";
        }
        else if (apiName === 'customer_review_application') {
            apiUrl += "/reviewApplication";
        }
    }

    // if(apiName){
    //     apiUrl += api_urls[apiName];
    // }
    return apiUrl;
}
const getApiUrl = { getApiUrlInfo };
export default getApiUrl;