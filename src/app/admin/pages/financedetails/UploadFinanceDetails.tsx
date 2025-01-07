import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import FileUploadDocs from '../../components/common/FileUploadDocs';
import { getCreateApplicationInfo, getStepperActiveInfo, setCustomerFormInfo} from '@App/admin/redux/features/create.application.info.slice';
//import './UploadDocuments.scss';

function UploadFinanceDetails(props:any) {
	const dispatch = useAppDispatch();
	
	const applicationInfo = useAppSelector((state: any) => {
		//console.log(state.applicationInfo);
		return state.applicationInfo;
	});
	//console.log(applicationInfo);
	//console.log("applicationInfo.customerProfileForm",applicationInfo.customerProfileForm)
	const applicantForm = applicationInfo.customerProfileForm.applicant_details;
	const stepperList = applicationInfo.customerProfileForm.tab_list;
	const stepperActiveKeyInfo = applicationInfo.customerProfileForm.tab_active_key_info;
	const customerBankUploadDocs = applicationInfo.customerProfileForm.customer_bank_documents;
	
	//console.log(customerUploadDocs);
	const handleChange = (formInfo: any) => {
		dispatch(setCustomerFormInfo({key_name: formInfo.document_name, key_value: formInfo.document_url, group_type: "customerbankdocuments", activeTabIndex: ""}));
	};

    return (
    	<>
		<div className='upload-page-docs'>
            <FileUploadDocs  applicantForm={applicantForm} fileUplodDocuments={customerBankUploadDocs} handleFileChangeEvent={handleChange} applicationInfo={applicationInfo} />
		</div>
		</>    
    );
}

export default UploadFinanceDetails;