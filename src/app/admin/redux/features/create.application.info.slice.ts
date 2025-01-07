import Api from "@App/admin/api/Api";
import getApiUrl from "@App/admin/api/ApiUrls";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { numberToOrdinals } from "@Src/utils/globalUtilities";
const jointCustomerKeysInfo: any = {
    "full_name": "", //not send to db
    "joint_customer_id": "",
    "cust_profile_id": "",
    "aadhaar_number": "",
    "pan_card": "",
    "mobile_number": "",
    "fax": "",
    "land_line_number": "",
    "office_phone": "",
    "gstin_number": "",
    "email_id": "",
    "alternate_mobile": "",
    "alternate_email_id": "",
    "customer_title": "",
    "first_name": "",
    "middle_name": "",
    "last_name": "",
    "dob": null,
    "marital_status": "",
    "applicant_relation_id": "",
    "occupation": "",
    "organisation_name": "",
    "designation": "",
    "organisation_address": "",
    "parent_or_spouse_name": "",
    "resident_type": "",
    "pin_code": "",
    "customer_flat_house_number": "",
    "address_street1": "",
    "address_street2": "",
    "address_city": "",
    "address_state": "",
    "address_country": "",
    "passport_number":"",
    "same_as_primary_applicant": ""//on
    // "joint_profile_sequence_number": "",
    // "created_on": "",
    // "sap_mobile_number2": "",
    // "sap_mobile_number3": "",
    // "sap_email_2": "",
    // "sap_email_3": "",
    // "last_modified_by": "",
    // "last_modified_at": ""
};
 
const jointCustomerDocsKeysInfo = {
    "document_identifier": "",
    "joint_customer_id": "",
    "document_name": "",
    "document_type": "",
    "document_number": "",
    "document_url": ""
};
//PAN applicant_photo applicant_photo 
const applicantUploadDocumentsKey = {
    "document_identifier": "",
    "cust_profile_id": "",
    "document_name": "",
    "document_type": "",
    "document_number": "",
    "document_url": "",
};
 
const customerBookingAmountDetailsKey = {
    "booking_transaction_id":"",
    "booking_bank_name": "",
    "booking_bank_branch_name": "",
    "booking_date":null,
    "booking_amount_paid": "",
    "cust_unit_id": ""
};
 
const documentsTypes = ["PAN", "applicant_photo", "Aadhaar_number", "passport_number"]; //passport_number
 
const customerProfileForm: any = {
    tab_active_key_info: { active_stepper_name: "applicant_details", parent_index: 0, child_index: "" },
    tab_list: [
        {
            name: "Primary Applicant's Details", key_name: "applicant_details", active_tab: false, active_tab_color: false,
            sub_list: [
                // {name: "Joint Applicant Details 1", key_name: "joint_applicant_details_1", active_tab: false, active_tab_color: false},
                // {name: "Joint Applicant Details 2", key_name: "joint_applicant_details_2", active_tab: false, active_tab_color: false},
                // {name: "Joint Applicant Details 3", key_name: "joint_applicant_details_3", active_tab: false, active_tab_color: false},
                { name: "Finance Details", key_name: "finance_details", active_tab: false, active_tab_color: false }
            ]
        },
        {
            name: "Upload Primary Applicant's Documents", key_name: "upload_documents", active_tab: false, active_tab_color: false,
            sub_list: [
                // {name: "Joint Applicant Documents 1", key_name: "joint_applicant_documents_1", active_tab: false, active_tab_color: false},
                // {name: "Joint Applicant Documents 2", key_name: "joint_applicant_documents_2", active_tab: false, active_tab_color: false},
                // {name: "Joint Applicant Documents 3", key_name: "joint_applicant_documents_3", active_tab: false, active_tab_color: false},
            ]
        },
        {
            name: "Booking Amount Details", key_name: "booking_amount_details", active_tab: false, active_tab_color: false,
            sub_list: []
        },
        {
            name: "Review Application", key_name: "review_application", active_tab: false, active_tab_color: false,
            sub_list: []
        },
    ],
    applicant_details: {
        "cust_profile_id": "",
        "aadhaar_number": "",
        "pan_card": "",
        "resident_type": "",
        "mobile_number": "",
        "fax": "",
        "land_line_number": "",
        "office_phone": "",
        "gstin_number": "",
        "email_id": "",
        "alternate_mobile": "",
        "alternate_email_id": "",
        "customer_title": "",
        "full_name": "", // not send to db 
        "first_name": "",
        "middle_name": "",
        "last_name": "",
        "dob": "",
        "marital_status": "",
        "applicant_relation_id": "",
        "occupation": "",
        "organisation_name": "",
        "designation": "",
        "organisation_address": "",
        "parent_or_spouse_name": "",
        "passport_number": "",
        "pin_code": "",
        "customer_flat_house_number": "",
        "address_street1": "",
        "address_street2": "",
        "address_city": "",
        "address_state": "",
        "address_country": "",
        //"customer_address":"" // remove it
        "last_modified_by": ""
    },
    joint_applicant_details: [],
    finance_details: {
        "bank_account_number": "",
        "name_as_on_bank_account": "",
        "bank_ifsc_code": "",
        "bank_address": "",
        "bank_branch": "",
        "bank_account_micr_code": "",
        "bank_swift_code": "",
        "domestic_bank": true,
        "bank_name": "",
        "interested_in_home_loans": true,
        //"sales_order_id": "",
        "cust_profile_id": ""
    },
    customer_bank_documents: {
        "cust_unit_id": "",
        "document_identifier": "",
        "document_name": "Proofs",
        "document_type": "bank_account_proof",
        "document_number": "",
        "document_url": ""
    },
    customer_booking_amount_details:{
        "booking_transaction_id":"",
        "booking_bank_name": "",
        "booking_bank_branch_name": "",
        "booking_date": "",
        "booking_amount_paid": "",
        "cust_unit_id": ""
    },
    upload_documents: [],
    joint_applicant_documents: [],
    review_application_action: { reviewAppStatus: false },
    is_error_form: { status: false, errorList: {} }
};
 
// Define the types for the state
interface ApplicationInfoState {
    loading: boolean;
    resStatus: boolean | null;
    resStatusCode: number | null;
    responseData: any;
    message: string;
    customerProfileForm: any;
    orgCustomerProfileForm: any;
}
 
// Define the initial state
const initialState: ApplicationInfoState = {
    loading: false,
    resStatus: false,
    resStatusCode: 200,
    responseData: [],
    message: '',
    customerProfileForm: customerProfileForm,
    orgCustomerProfileForm: {}
};
 
export const getCreateApplicationInfo = createAsyncThunk(
    'createApplicationInfo/getCreateApplicationInfo',
    async (data: any) => {
        const { url_name, params_data } = data;
        return await Api.get(url_name, params_data);
        // return await axios.post(url, loginForm).catch((e)=>{
        //       return e.response.data;
        //     });
    }
);
 
const createApplicationInfoSlice = createSlice({
    name: 'createApplicationInfo',
    initialState: initialState,
    reducers: {
        setIsErrorFormInfo: function (state, action) {
            // {status: false, errorList:{}}
            state.customerProfileForm.is_error_form = action.payload;
        },
        getAddDeleteJointApplicant: function (state, action){
            if(action.payload.action_type === "addjoint"){
                const index = state.customerProfileForm.joint_applicant_details.length + 1;
                const stepperActiveKeyInfo = state.customerProfileForm.tab_active_key_info;
                let tabKeyDocName = "joint_applicant_documents_" + index;
                const jointCustTabList:any = [];
                for(let i=1; i<=index; i++){
                    let tabKeyName = "joint_applicant_details_"+(i);
                    if(stepperActiveKeyInfo.active_stepper_name === tabKeyName){
                        jointCustTabList.push({ name: `${numberToOrdinals(i)} Joint Applicant's Details`, key_name: tabKeyName, active_tab: true, active_tab_color: true });
                    }
                    else{
                        jointCustTabList.push({ name: `${numberToOrdinals(i)} Joint Applicant's Details`, key_name: tabKeyName, active_tab: false, active_tab_color: false });
                    } 
                }
                jointCustTabList.push({ name: "Finance Details", key_name: "finance_details", active_tab: false, active_tab_color: false });
                state.customerProfileForm.tab_list[0].sub_list = jointCustTabList;
                const jointInfo:any = {}
                for (let keyName in jointCustomerKeysInfo) {
                    jointInfo[keyName] = jointCustomerKeysInfo[keyName];
                }
                jointInfo.cust_profile_id = state.customerProfileForm.applicant_details.cust_profile_id;
                jointInfo.resident_type = state.customerProfileForm.applicant_details.resident_type || 'Resident';
                state.customerProfileForm.joint_applicant_details.push(jointInfo);
                const jointCustDocsList:any = [];
                documentsTypes.forEach((docType: any) => {
                    let jointCustDoc = {
                        "document_identifier": "",
                        "joint_customer_id": "",
                        "document_name": docType,
                        "document_type": "ID Document",
                        "document_number": "",
                        "document_url": ""
                    };
                    jointCustDocsList.push(jointCustDoc);
                });
                const jointCustDocsTabList = { name: `${numberToOrdinals(index)} Joint Applicant's Documents`, key_name: tabKeyDocName, active_tab: false, active_tab_color: false };
                state.customerProfileForm.tab_list[1].sub_list.push(jointCustDocsTabList);
                state.customerProfileForm.joint_applicant_documents.push({[tabKeyDocName]: jointCustDocsList });
            }else if(action.payload.action_type === "deletejoint"){
                // console.log(action.payload);
                //if(action.payload.joint_applicant_id == null || action.payload.joint_applicant_id == ""){
                    const jointApplicantList = state.customerProfileForm.joint_applicant_details;
                    const jointApplicant:any = [];
                    jointApplicantList.forEach((list: any, indx: any)=>{
                        if(action.payload.stepper_active_key_info.child_index != indx){
                            jointApplicant.push(list);
                        }
                    });
                    state.customerProfileForm.joint_applicant_details = jointApplicant;
                    const jointCustTabList:any = [];
                    for(let i=1; i<=jointApplicant.length; i++){
                        let tabKeyName = "joint_applicant_details_"+(i);
                        jointCustTabList.push({ name: `${numberToOrdinals(i)} Joint Applicant's Details`, key_name: tabKeyName, active_tab: false, active_tab_color: false });
                    }
                    jointCustTabList.push({ name: "Finance Details", key_name: "finance_details", active_tab: false, active_tab_color: false });
                    state.customerProfileForm.tab_active_key_info ={ active_stepper_name: "applicant_details", parent_index: 0, child_index: "" };
                    state.customerProfileForm.tab_list[0].sub_list = jointCustTabList;
 
                    const jointApplicantDocumentsList = state.customerProfileForm.joint_applicant_documents;
                    const jointCustDocsList:any = [];
                    jointApplicantDocumentsList.forEach((list: any, indx: any)=>{
                        
                        if(action.payload.stepper_active_key_info.child_index != indx){
                            jointCustDocsList.push(list);
                        }
                    });
                    const jointCustDocsTabList:any =[];
                    for(let i=1; i<=jointCustDocsList.length; i++){
                        let tabKeyDocName = "joint_applicant_documents_" + i;
                        jointCustDocsTabList.push({ name: `${numberToOrdinals(i)} Joint Applicant's Documents`, key_name: tabKeyDocName, active_tab: false, active_tab_color: false });
                    }
                    state.customerProfileForm.tab_list[1].sub_list = jointCustDocsTabList;
                    state.customerProfileForm.joint_applicant_documents = jointCustDocsList;
                    //If joint customer is removed then it will move to the previous step
                    if(jointApplicant.length === 0){
                        state.customerProfileForm.tab_active_key_info = { active_stepper_name: "applicant_details", parent_index: 0, child_index: "" };
                    } else {
                        let previousIndex = jointApplicant.length;
                        let previousTabKeyName = "joint_applicant_details_" + previousIndex;
                        state.customerProfileForm.tab_active_key_info = { active_stepper_name: previousTabKeyName, parent_index: 0, child_index: previousIndex - 1 };
                    }
                    //state.customerProfileForm.tab_list[0].sub_list = jointCustTabList;
                    // if((countJoint-1) == 0 ){
                    //     state.customerProfileForm.tab_active_key_info = { active_stepper_name: "applicant_details", parent_index: 0, child_index: "" };
                    // }else{
                    //     let tabKeyNames = "joint_applicant_details_"+(countJoint-1);
                    //     state.customerProfileForm.tab_active_key_info = { active_stepper_name:"joint_applicant_details_"+(countJoint-1), parent_index:0, child_index: countJoint-2 };
                    // }
                    // if(action.payload.stepper_active_key_info.child_index == 0){
                    //     state.customerProfileForm.tab_active_key_info ={ active_stepper_name: "applicant_details", parent_index: 0, child_index: "" };
                    // }
                //}else{
                    
                    //joint_customer_id
                //}
            }  
        },
        getStepperActiveInfo: function (state, action) {
            //{"tabKeyName": tabKeyName, "parentIndex": parentIndex, "childIndex": childIndex};
            //console.log(action.payload);
            state.customerProfileForm.tab_active_key_info = { "active_stepper_name": action.payload.tabKeyName, "parent_index": action.payload.parentIndex, "child_index": action.payload.childIndex };
            //state.responseData[action.payload.ctrlIndex].ctrlValue = action.payload.keyValue;
            //state.responseData[action.payload.ctrlIndex].errorText = "";
        },
        setCustomerFormInfo: function (state, action) {
            //{key_name: e.target.name, key_value: e.target.value, group_type: "applicant", activeTabName: "", activeTabIndex: activeTabIndex}
            //console.log(action);
 
            //Validation For Main Applicants
            if (action.payload.group_type === "applicant") {
                if(action.payload.key_name==='aadhaar_number'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = displayFormatAadhar(action.payload.key_value);
                }else if(action.payload.key_name==='pan_card'){
                    if(validatePanCardFormat(action.payload.key_value))
                    {
                        state.customerProfileForm.applicant_details[action.payload.key_name] = action.payload.key_value?.toUpperCase();
                    }
                }else if(action.payload.key_name==="fax"){
                    if(mobileNoFormat(action.payload.key_value)){
                        state.customerProfileForm.applicant_details[action.payload.key_name] = action.payload.key_value;
                    }
                }else if(action.payload.key_name==="passport_number"){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = getAlphaNumericValues(action.payload.key_value).toUpperCase();
                }else if(action.payload.key_name==="office_phone"){
                    if(mobileNoFormat(action.payload.key_value)){
                        state.customerProfileForm.applicant_details[action.payload.key_name] = action.payload.key_value;
                    }
                }else if(action.payload.key_name==="land_line_number"){
                    if(mobileNoFormat(action.payload.key_value)){
                        state.customerProfileForm.applicant_details[action.payload.key_name] = action.payload.key_value;
                    }
                }else if(action.payload.key_name==='mobile_number'){
                   if(mobileNoFormat(action.payload.key_value)){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = action.payload.key_value;
                   }
                   //state.customerProfileForm.applicant_details[action.payload.key_name] = allowNumericFormat(action.payload.key_value);
                }else if(action.payload.key_name==='alternate_mobile'){
                    if(mobileNoFormat(action.payload.key_value)){
                        state.customerProfileForm.applicant_details[action.payload.key_name] = action.payload.key_value;
                    }
                    //state.customerProfileForm.applicant_details[action.payload.key_name] = allowNumericFormat(action.payload.key_value);
                }else if(action.payload.key_name==='parent_or_spouse_name'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowAlphabetSpacesAndDotsNumbers(action.payload.key_value);
                }else if(action.payload.key_name==='gstin_number'){
                    if(validateGstinNumber(action.payload.key_value)){
                        state.customerProfileForm.applicant_details[action.payload.key_name] = action.payload.key_value.toUpperCase();
                    }
                }else if(action.payload.key_name === 'customer_flat_house_number'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowAddressCharactersOnly(action.payload.key_value);
                }else if(action.payload.key_name === 'address_street1'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowAddressCharactersOnly(action.payload.key_value)
                }else if(action.payload.key_name === 'address_street2'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowAddressCharactersOnly(action.payload.key_value)
                }else if(action.payload.key_name === 'address_country'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowWordsAndSpaces(action.payload.key_value);
                }else if(action.payload.key_name === 'address_state'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowAlphaNumericHyphenSpaces(action.payload.key_value)
                }else if(action.payload.key_name === "pin_code"){
                    if(state.customerProfileForm.applicant_details['resident_type']==='NRI')
                    {
                        state.customerProfileForm.applicant_details[action.payload.key_name] = allowAlphaNumericHyphenSpaces(action.payload.key_value);
                    }
                    else if(state.customerProfileForm.applicant_details['resident_type']==='Resident')
                    {
                        state.customerProfileForm.applicant_details[action.payload.key_name] = allowSixDigitOnly(action.payload.key_value);
                    }
                }else if(action.payload.key_name === 'full_name'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowAlphabetSpacesAndDotsNumbers(action.payload.key_value);
                }
                else if(action.payload.key_name === 'organisation_name'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowAlphabetSpacesAndDotsNumbers(action.payload.key_value);
                }
                else if(action.payload.key_name === 'designation'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowAlphabetSpacesAndDotsNumbers(action.payload.key_value);
                }
                else if(action.payload.key_name === 'organisation_address'){
                    state.customerProfileForm.applicant_details[action.payload.key_name] = allowAddressCharactersOnly(action.payload.key_value);
                }
                else{
                    state.customerProfileForm.applicant_details[action.payload.key_name] = action.payload.key_value;    
                }
            } 
            // Validation For Joint Applicants
            else if(action.payload.group_type === "jointapplicant") {
                if(action.payload.key_name==="aadhaar_number"){
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = displayFormatAadhar(action.payload.key_value);
                }else if(action.payload.key_name==='pan_card'){
                    if(validatePanCardFormat(action.payload.key_value))
                    {
                        state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = action.payload.key_value?.toUpperCase();
                    }
                }else if(action.payload.key_name==="fax"){
                    if(mobileNoFormat(action.payload.key_value)){
                        state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = action.payload.key_value;
                    }
                }else if(action.payload.key_name==="passport_number"){
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = getAlphaNumericValues(action.payload.key_value).toUpperCase();
                }else if(action.payload.key_name==="office_phone"){
                    if(mobileNoFormat(action.payload.key_value)){
                        state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = action.payload.key_value;
                    }
                }else if(action.payload.key_name==="land_line_number"){
                    if(mobileNoFormat(action.payload.key_value)){
                        state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = action.payload.key_value;
                    }
                }else if(action.payload.key_name==='mobile_number'){
                    if(mobileNoFormat(action.payload.key_value)){
                        state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = action.payload.key_value;
                    }
                    //state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = allowNumericFormat(action.payload.key_value);
                }else if(action.payload.key_name==='alternate_mobile'){
                    if(mobileNoFormat(action.payload.key_value)){
                        state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = action.payload.key_value;
                    }
                    //state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = allowNumericFormat(action.payload.key_value);
                }else if(action.payload.key_name==='parent_or_spouse_name'){
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = allowAlphabetSpacesAndDotsNumbers(action.payload.key_value);
                }else if(action.payload.key_name==='gstin_number'){
                    if(validateGstinNumber(action.payload.key_value)){
                        state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name]  = action.payload.key_value.toUpperCase();
                    }
                }else if(action.payload.key_name === 'customer_flat_house_number'){
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name]  = allowAddressCharactersOnly(action.payload.key_value);
                }else if(action.payload.key_name === 'address_street1'){
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name]  = allowAddressCharactersOnly(action.payload.key_value);
                }else if(action.payload.key_name === 'address_street2'){
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name]  = allowAddressCharactersOnly(action.payload.key_value);
                }else if(action.payload.key_name === 'address_country'){
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name]  = allowWordsAndSpaces(action.payload.key_value);
                }else if(action.payload.key_name === 'address_state'){
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name]  = allowAlphaNumericHyphenSpaces(action.payload.key_value);
                }else if(action.payload.key_name === "pin_code"){
                    if(state.customerProfileForm.applicant_details['resident_type']==='NRI')
                        {
                            state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = allowAlphaNumericHyphenSpaces(action.payload.key_value);
                        }
                        else if(state.customerProfileForm.applicant_details['resident_type']==='Resident')
                        {
                            state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = allowSixDigitOnly(action.payload.key_value);
                        }
                }else if(action.payload.key_name === 'full_name'){
                    
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = allowAlphabetSpacesAndDotsNumbers(action.payload.key_value);
                }
                else if(action.payload.key_name === 'organisation_name'){
                     state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = allowAlphabetSpacesAndDotsNumbers(action.payload.key_value);
                }
                else if(action.payload.key_name === 'designation'){
                     state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = allowAlphabetSpacesAndDotsNumbers(action.payload.key_value);
                }
                else if(action.payload.key_name === 'organisation_address'){
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = allowAddressCharactersOnly(action.payload.key_value);
               }
                else{
                    state.customerProfileForm.joint_applicant_details[action.payload.activeTabIndex][action.payload.key_name] = action.payload.key_value;
                }
            }
            // Validation for Finance Details Step
            else if(action.payload.group_type === "financedetails") {
               if(action.payload.key_name === "bank_account_number"){
                    const bankAccountNumber = allowNumericFormat(action.payload.key_value);
                    if(bankAccountNumber.length <= 16){
                        state.customerProfileForm.finance_details[action.payload.key_name] = allowNumericFormat(action.payload.key_value);
                    }
               }else if(action.payload.key_name === "bank_name"){
                state.customerProfileForm.finance_details[action.payload.key_name] = allowBankNameCharactersOnly(action.payload.key_value);
               }else if(action.payload.key_name === "bank_branch"){
                state.customerProfileForm.finance_details[action.payload.key_name] = allowAddressCharactersOnly(action.payload.key_value);
               }else if(action.payload.key_name === "bank_ifsc_code"){
                if(validateIfscCode(action.payload.key_value))
                {
                    state.customerProfileForm.finance_details[action.payload.key_name] = action.payload.key_value.toUpperCase();
                }
               }else if(action.payload.key_name === "name_as_on_bank_account"){
                    state.customerProfileForm.finance_details[action.payload.key_name] = allowAlphabetSpacesAndDotsNumbers(action.payload.key_value)?.toUpperCase();
               }else{
                    state.customerProfileForm.finance_details[action.payload.key_name] = action.payload.key_value;
               }
               state.customerProfileForm.finance_details['cust_profile_id'] =state.customerProfileForm.applicant_details.cust_profile_id; 
            }else if(action.payload.group_type === "customerbankdocuments"){
                //"Proofs"
                if( action.payload.key_name === state.customerProfileForm.customer_bank_documents.document_name) {
                    state.customerProfileForm.customer_bank_documents.document_url = action.payload.key_value;
                }
            }
            // Validation for Intial Booking Amount Step
            else if(action.payload.group_type === "cust_booking_amount"){
                if(action.payload.key_name === "booking_transaction_id"){
                    state.customerProfileForm.customer_booking_amount_details[action.payload.key_name]=allowAlphaNumericOnly(action.payload.key_value);
                }
                else if(action.payload.key_name === "booking_bank_name")
                {
                    state.customerProfileForm.customer_booking_amount_details[action.payload.key_name]=allowAlphaNumericHyphenSpaces(action.payload.key_value);
                }
                else if(action.payload.key_name === "booking_bank_branch_name")
                {
                    state.customerProfileForm.customer_booking_amount_details[action.payload.key_name]=allowAlphaNumericHyphenSpaces(action.payload.key_value);
                }     
                else if(action.payload.key_name === "booking_amount_paid")
                {
                    state.customerProfileForm.customer_booking_amount_details[action.payload.key_name]=allowNumbersWithDots(action.payload.key_value);
                }
                else{
                    state.customerProfileForm.customer_booking_amount_details[action.payload.key_name] = action.payload.key_value;
                }
            }
            
            else if(action.payload.group_type === "uploaddocuments") {
                state.customerProfileForm.upload_documents.forEach((doclist: any) => {
                    if(doclist.document_name == action.payload.key_name) {
                        doclist.document_url = action.payload.key_value;
                    }
                });
            }
            
            else if(action.payload.group_type === "jointuploaddocuments") {
                state.customerProfileForm.joint_applicant_documents[action.payload.activeTabIndex][action.payload.activeTabName].forEach((doclist: any) => {
                    if(doclist.document_name == action.payload.key_name) {
                        doclist.document_url = action.payload.key_value;
                    }
                });
            }
            else if(action.payload.group_type === "reviewapplicationaction") {
                state.customerProfileForm.review_application_action.reviewAppStatus = action.payload.key_value;
            }
        }
 
    },
    extraReducers: (builder) => {
        builder.addCase(getCreateApplicationInfo.pending, (state: ApplicationInfoState, action) => {
            state.customerProfileForm = customerProfileForm;
            state.loading = true;
        }).addCase(getCreateApplicationInfo.fulfilled, (state: ApplicationInfoState, action: PayloadAction<any>) => {
            //console.log(action.payload);
            state.loading = false;
            state.resStatus = action.payload.status;
            state.resStatusCode = action.payload.statuscode;
            state.responseData = action.payload.data;
 
            if (action.payload.data.customerProfileDetails != undefined) {
                for (let keyName in state.customerProfileForm.applicant_details) {
                    state.customerProfileForm.applicant_details[keyName] = removeNullEmptyStringvalue(action.payload.data.customerProfileDetails[keyName]);
                }
            }
            // let fullName = "";
            // if (state.customerProfileForm.applicant_details.first_name) {
            //     fullName = state.customerProfileForm.applicant_details.first_name;
            // }
            // if (state.customerProfileForm.applicant_details.middle_name) {
            //     fullName += removeNullvalue(state.customerProfileForm.applicant_details.middle_name);
            // }
            // if (state.customerProfileForm.applicant_details.last_name) {
            //     fullName += removeNullvalue(state.customerProfileForm.applicant_details.last_name);
            // }
            // state.customerProfileForm.applicant_details.full_name = fullName.trim();
 
            state.customerProfileForm.applicant_details.aadhaar_number= displayFormatAadhar(state.customerProfileForm.applicant_details.aadhaar_number);
 
            if (action.payload.data.customerBankDetails != undefined && Object.keys(action.payload.data.customerBankDetails).length > 0) {
                for (let keyName in state.customerProfileForm.finance_details) {
                    state.customerProfileForm.finance_details[keyName] = removeNullEmptyStringvalue(action.payload.data.customerBankDetails[keyName]);
                }
                state.customerProfileForm.finance_details["interested_in_home_loans"] = (action.payload.data.paymentDetails.interested_in_home_loans);
            }else{
                state.customerProfileForm.finance_details["interested_in_home_loans"] = (action.payload.data.paymentDetails.interested_in_home_loans);
            }
 
            const customerBankDocumentsDetails = action.payload.data.customerBankDocumentsDetails;
            let customerBankDoclist: any = getCustomerRelatedDocs("bank_account_proof", [customerBankDocumentsDetails]);
            let custBankDoc = {
                "cust_unit_id": action.payload.data.paymentDetails.cust_unit_id,
                "document_identifier": action.payload.data.customerBankDocumentsDetails?.document_identifier,
                "document_name": "bank_account_proof",
                "document_type": "Proofs",
                "document_number": "",
                "document_url": ""
            };
            if(customerBankDoclist.status){
                custBankDoc.document_url = customerBankDoclist.resultData.document_url;
            }
            state.customerProfileForm.customer_bank_documents = removeNullEmptyStringvalue(custBankDoc);
 
            const customerProfileDocumentsDetails = action.payload.data.customerProfileDocumentsDetails;
            const custDocsList: any = [];
            documentsTypes.forEach((docType: any) => {
                let customerDoclist: any = getCustomerRelatedDocs(docType, customerProfileDocumentsDetails);
                let custDoc = {
                    "cust_profile_id": state.customerProfileForm.applicant_details.cust_profile_id,
                    "document_identifier": "",
                    "document_name": docType,
                    "document_type": "ID Document",
                    "document_number": "",
                    "document_url": ""
                };
                if (customerDoclist.status) {
                    custDoc.cust_profile_id = customerDoclist.resultData.cust_profile_id;
                    custDoc.document_identifier = customerDoclist.resultData.document_identifier;
                    custDoc.document_type = removeNullEmptyStringvalue(customerDoclist.resultData.document_type);
                    custDoc.document_number = removeNullEmptyStringvalue(customerDoclist.resultData.document_number);
                    custDoc.document_url = removeNullEmptyStringvalue(customerDoclist.resultData.document_url);
                }
                custDocsList.push(custDoc);
            });
            state.customerProfileForm.upload_documents = custDocsList;
 
            const customerBookingAmount = action.payload.data.paymentDetails;
            let custBookingAmount: any = {};
            for (let keyName in customerBookingAmountDetailsKey) {
                custBookingAmount[keyName] = removeNullEmptyStringvalue(customerBookingAmount[keyName]);
            }
            state.customerProfileForm.customer_booking_amount_details = custBookingAmount;
 
            //{name: "Joint Applicant Details 1", key_name: "joint_applicant_details_1", active_tab: false, active_tab_color: false},
            //state.customerProfileForm.joint_applicant_details
            //start joint customers
            if (action.payload.data.jointCustomerProfileDetails != undefined) {
                if (action.payload.data.jointCustomerProfileDetails.length > 0) {
                    const jointCustTabList: any = [];
                    const jointCustDataList: any = [];
 
                    const jointHolderDocumentsDetails = action.payload.data.jointHolderDocumentsDetails;
                    const jointCustDocsTabList: any = [];
                    const jointCustDocsList: any = [];
                    action.payload.data.jointCustomerProfileDetails.forEach((list: any, i: number) => {
                        let index = i + 1;
                        let tabKeyName = "joint_applicant_details_" + index;
                        let tabKeyDocName = "joint_applicant_documents_" + index;
 
                        jointCustDocsTabList.push({ name: `${numberToOrdinals(index)} Joint Applicant's Documents`, key_name: tabKeyDocName, active_tab: false, active_tab_color: false });
                        const jointCustDocsGroup: any = [];
                        documentsTypes.forEach((docType: any) => {
                            let jointCustomerDoclist: any = getJointCustomerRelatedDocs(list.joint_customer_id, docType, jointHolderDocumentsDetails);
                            let jointCustDoc = {
                                "document_identifier": "",
                                "joint_customer_id": list.joint_customer_id,
                                "document_name": docType,
                                "document_type": "ID Document",
                                "document_number": "",
                                "document_url": ""
                            };
                            if (jointCustomerDoclist.status) {
                                jointCustDoc.document_identifier = jointCustomerDoclist.resultData.document_identifier;
                                jointCustDoc.document_type = jointCustomerDoclist.resultData.document_type;
                                jointCustDoc.document_number = jointCustomerDoclist.resultData.document_number;
                                jointCustDoc.document_url = removeNullEmptyStringvalue(jointCustomerDoclist.resultData.document_url);
                            }
                            jointCustDocsGroup.push(jointCustDoc);
                        });
                        jointCustDocsList.push({ [tabKeyDocName]: jointCustDocsGroup });
                        //console.log(list);
                        //if(checkDuplicate(state.customerProfileForm.tab_list[0].sub_list, tabKeyName).length == 0){
                        jointCustTabList.push({ name: `${numberToOrdinals(index)} Joint Applicant's Details`, key_name: tabKeyName, active_tab: false, active_tab_color: false });
                        let jointInfo: any = { full_name: "" };
                        for (let keyName in jointCustomerKeysInfo) {
                            // if (keyName != "full_name" && keyName != "first_name" && keyName != "middle_name" && keyName != "last_name") {
                            //     jointInfo[keyName] = removeNullEmptyStringvalue(list[keyName]);
                            // }
                            if(keyName == "aadhaar_number"){
                                jointInfo[keyName] = displayFormatAadhar(removeNullEmptyStringvalue(list[keyName]));
                            }else{
                                jointInfo[keyName] = removeNullEmptyStringvalue(list[keyName]);
                            }
                        }
                        //jointInfo.full_name = (list.first_name + removeNullvalue(list.middle_name) + removeNullvalue(list.last_name)).trim();
                        // console.log(state.customerProfileForm.applicant_details.resident_type);
                        jointInfo.resident_type = state.customerProfileForm.applicant_details.resident_type!=null ? state.customerProfileForm.applicant_details.resident_type : "Resident";
                        // console.log(jointInfo.resident_type);
                        //jointInfo.resident_type = "Resident"
                        jointCustDataList.push(jointInfo);
                        //}
                    });
                    if (jointCustTabList.length > 0) {
                        state.customerProfileForm.tab_list[0].sub_list.unshift(...jointCustTabList);
                        state.customerProfileForm.joint_applicant_details.push(...jointCustDataList);
 
                        state.customerProfileForm.tab_list[1].sub_list.unshift(...jointCustDocsTabList);
                        state.customerProfileForm.joint_applicant_documents.push(...jointCustDocsList);
                    }
                }
            }
            //action.payload.data.jointCustomerProfileDetails

            //Assigning for comparing original and changed object for logging purpose
            state.orgCustomerProfileForm=state.customerProfileForm;

            if (!action.payload.status) {
                state.message = action.payload.message;
            }
        }).addCase(getCreateApplicationInfo.rejected, (state: ApplicationInfoState, action) => {
            state.loading = false;
            state.message = 'Something went wrong!';
        });
    }
});
 
const getCustomerRelatedDocs = (docType: string, customerProfileDocumentsDetails: any) => {
    const result = { status: false, resultData: null };
    if (customerProfileDocumentsDetails.length > 0) {
        const resultData = customerProfileDocumentsDetails.filter((doclist: any) => {
            return doclist.document_name === docType
        });
        if (resultData.length > 0) {
            result.resultData = resultData[0];
            result.status = true;
        }
    }
    return result;
}
const getJointCustomerRelatedDocs = (jointCustomerId: string, docType: string, jointHolderDocumentsDetails: any = []) => {
    const result = { status: false, resultData: null };
    if (jointHolderDocumentsDetails.length > 0) {
        const resultData = jointHolderDocumentsDetails.filter((doclist: any) => {
            return doclist.joint_customer_id === jointCustomerId && doclist.document_name === docType
        });
        if (resultData.length > 0) {
            result.resultData = resultData[0];
            result.status = true;
        }
    }
    return result;
}
 
const checkDuplicate = (tabList: any, tabKeyName: string) => {
    return tabList.filter((list: any) => {
        return list.key_name === tabKeyName;
    });
}
 
const checkDuplicateDocs = (tabList: any, tabKeyName: string) => {
    return tabList.filter((list: any) => {
        return list.key_name === tabKeyName;
    });
}
 
const displayFormatAadhar = (value: any) => {
    let result = "";
    if(value!=null){
        result = value?.replace(/\D/g, '')?.replace(/(.{4})/g, '$1 ')?.trim();
    }
    return result;
}
 
const validatePanCardFormat = (value: any) => {
    const inputValue = value.toUpperCase();
    let isValid = false;
  
    if (inputValue.length <= 5) {
      // The first 5 characters must be alphabets (A-Z)
      isValid = /^[A-Z]*$/.test(inputValue);
    } else if (inputValue.length > 5 && inputValue.length <= 9) {
      // First 5 characters alphabets (A-Z), next 4 must be digits (0-9)
      isValid = /^[A-Z]{5}[0-9]*$/.test(inputValue);
    } else if (inputValue.length === 10) {
      // First 5 characters alphabets, next 4 digits, and the last must be an alphabet
      isValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(inputValue);
    }
  
    return isValid;
  }
  
 
function isValidInteger(value:any) {
    if(value==""){
        return true;
    }else{
        return /^\d+$/.test(value);
    }
}
 
const mobileNoFormat = (value: any) => {
    
    if(isValidInteger(value)){
        return true;
    }else{
        //console.log("91+");
        //const regex = /^\+\d*(-\d*)?$/
        //const regex = /^\+\d*(-\d*)(-\d*)?$/
        const regex = /^\+\d*(-\d*){0,1}$/;
        return regex.test(value);
    }
}
const allowNumericFormat = (value: any) => {
    return value?.replace(/\D/g, '');
}
 
const allowAlphaNumericOnly = (value: any) => {
    return value?.replace(/[^a-zA-Z0-9]/g, '');
}
 
const allowNumbersWithDots = (value: any) => {
    return value?.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); 
};
 
const allowAlphabetSpacesAndDots = (value: any) =>{
    return value?.replace(/[^A-Za-z\s.]/g, '');
}
 
const allowAlphabetSpacesAndDotsNumbers = (value: any) =>{
    return value?.replace(/[^A-Za-z0-9\s.]/g, '');
}
 
const allowAlphaNumericHyphenSpaces = (value: any) =>{
    return value?.replace(/[^A-Za-z0-9\s-]/g, '');
}
 
const allowWordsAndSpaces = (value: any) =>{
    return value?.replace(/[^A-Za-z\s]/g, '');
}
 
const validateIfscCode = (value: string) => {
    let inputValue = value.toUpperCase();
    let isValid = false;
  
    if (inputValue.length <= 4) {
      // First 4 characters should be alphabets
      isValid = /^[A-Za-z]*$/.test(inputValue);
    } else if (inputValue.length > 4 && inputValue.length <= 11) {
      // First 4 characters should be alphabets and the rest should be numbers
      isValid = /^[A-Za-z]{4}[0-9]*$/.test(inputValue);
    }
  
    // Return true or false based on validation
    return isValid;
};
  
 
const validateGstinNumber = (value: any) => {
  let inputValue = value.toUpperCase();
    let isValid = false;
    if (inputValue.length <= 2) {
        isValid = /^[0-9]*$/.test(inputValue);
    }else if (inputValue.length > 2 && inputValue.length <= 7) {
        isValid = /^\d{2}[A-Za-z]*$/.test(inputValue);
    }else if (inputValue.length > 7 && inputValue.length <= 11) {
        isValid = /^\d{2}[A-Za-z]{5}\d*$/.test(inputValue);
    }else if (inputValue.length === 12) {
        isValid = /^\d{2}[A-Za-z]{5}\d{4}[A-Z]$/.test(inputValue);
    }else if (inputValue.length === 13) {
        isValid = /^\d{2}[A-Za-z]{5}\d{4}[A-Z][1-9A-Z]$/.test(inputValue);
    }else if (inputValue.length === 14) {
        isValid = /^\d{2}[A-Za-z]{5}\d{4}[A-Z][1-9A-Z]Z$/.test(inputValue);
    }else if (inputValue.length === 15) {
        isValid = /^\d{2}[A-Za-z]{5}\d{4}[A-Z][1-9A-Z]Z[A-Za-z0-9]$/.test(inputValue);
    }
  return isValid;
}
const removeNullvalue = (value:any) => {
    let result = "";
    if(value!==null && value!==undefined){
        result = " " + value;
    }
    return result;
}
const removeNullEmptyStringvalue = (value:any) => {
    let result = '';
    if(value!=null && value!=undefined && value!=" " && value!=""){
        result = value;
    }
    return result;
}
 
function getAlphaNumericValues(value: any) {
    // Regular expression to match alphanumeric characters
    const alphanumericPattern = /[^a-zA-Z0-9]/g;
    //return alphanumericPattern.test(value);
    return value?.replace(alphanumericPattern, '');
}
 
const allowSixDigitOnly = (value: any) => {
    const sanitizedValue = value?.replace(/[^0-9]/g, '');
    return sanitizedValue.length === 6 ? sanitizedValue : sanitizedValue.slice(0, 6);
};
 
const allowAddressCharactersOnly = (value: any) => {
    const sanitizedValue = value?.replace(/[^a-zA-Z0-9\s,.'\-/#()]/g, '');
    return sanitizedValue;
};
 
const allowBankNameCharactersOnly = (value: any) => {
    const sanitizedValue = value?.replace(/[^a-zA-Z\s.'\-()]/g, '');
    return sanitizedValue;
};
 
 
// export const { setHandleFormChange, setHandleFormErrorsChange } = userProfileInfoSlice.actions;
// export default userProfileInfoSlice.reducer;
export const { getStepperActiveInfo, setCustomerFormInfo, setIsErrorFormInfo, getAddDeleteJointApplicant } = createApplicationInfoSlice.actions;
export default createApplicationInfoSlice.reducer;