import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadElement from '@Components/file-upload-element/FileUploadElement';
import { toast } from 'react-toastify';
import FileUploadDocs from '../../components/common/FileUploadDocs';
import { getCreateApplicationInfo, getStepperActiveInfo, setCustomerFormInfo } from '@App/admin/redux/features/create.application.info.slice';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import './PurchaserDocument.scss';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import MobileTabs from '@Components/mobile-tabs/MobileTabs';
import { numberToOrdinals } from '@Src/utils/globalUtilities';

interface propsType {
	setIsFaqSidebar: any,
	setIsBookingDetailSidebar: any,
	setIsCloseFormPopUp: any
}

const PurchaserDocuments: React.FC<propsType> = ({ setIsFaqSidebar, setIsBookingDetailSidebar, setIsCloseFormPopUp }) => {
	const dispatch = useAppDispatch();
	const applicationInfo = useAppSelector((state: any) => {
		return state.applicationInfo;
	});
	//const stepperList = applicationInfo.customerProfileForm.tab_list;
	const active_tab_name = applicationInfo.customerProfileForm.tab_active_key_info.active_stepper_name
	const jointApplicantForm = applicationInfo.customerProfileForm.joint_applicant_details[active_tab_name.charAt(active_tab_name.length - 1) - 1];
	const stepperActiveKeyInfo = applicationInfo.customerProfileForm.tab_active_key_info;
	const jointUploadDocs = applicationInfo.customerProfileForm.joint_applicant_documents[stepperActiveKeyInfo.child_index][stepperActiveKeyInfo.active_stepper_name];
	const activeTabIndex = stepperActiveKeyInfo.child_index;


	const handleChange = (formInfo: any) => {
		dispatch(setCustomerFormInfo({ key_name: formInfo.document_name, key_value: formInfo.document_url, group_type: "jointuploaddocuments", activeTabName: stepperActiveKeyInfo.active_stepper_name, activeTabIndex: stepperActiveKeyInfo.child_index }));
	};

	React.useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
	}, []);

	return (
		<><div className='upload-page-docs tw-mb-36'>
			<div className='md:tw-hidden tw-flex tw-flex-col tw-gap-3'>
				<div className='tw-flex tw-justify-between'>
					<div className='tw-flex tw-items-center tw-gap-4'>
						<div
							onClick={() => { setIsCloseFormPopUp(true) }}
						>
							<CloseIcon />
						</div>
						<p className='tw-text-lg tw-font-bold text-pri-all'>{`Upload ${numberToOrdinals(activeTabIndex + 1)} Joint Applicant's Documents`}</p>
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
				<MobileTabs index={2} />
			</div >
			<p className='tw-font-bold md:tw-block tw-hidden tw-text-xl text-pri-all'>{`Upload ${numberToOrdinals(activeTabIndex + 1)} Joint Applicant's Documents`}</p>
			<p className='md:tw-text-sm tw-text-xs'>Please upload clear and readable copies of the KYC documents for verification.</p>
			<div className="section-container ext md:tw-p-6 tw-bg-white no-hover tw-p-5">
				<p className='tw-font-bold tw-text-base tw-mb-6 text-pri-all'>{jointApplicantForm?.full_name}'s Documents</p>
				{
					jointUploadDocs.map((docsInfo: any, index: any) => {
						return <div key={stepperActiveKeyInfo.active_stepper_name + "_" + index}><FileUploadDocs applicantForm={jointApplicantForm} fileUplodDocuments={docsInfo} handleFileChangeEvent={handleChange} applicationInfo={applicationInfo} /></div>
					})
				}
			</div>
		</div>
		</>
	);

};

export default PurchaserDocuments;
