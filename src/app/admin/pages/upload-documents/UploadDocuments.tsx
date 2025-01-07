import React, { FC, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import FileUploadDocs from '../../components/common/FileUploadDocs';
import { getCreateApplicationInfo, getStepperActiveInfo, setCustomerFormInfo } from '@App/admin/redux/features/create.application.info.slice';
import './UploadDocuments.scss';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import MobileTabs from '@Components/mobile-tabs/MobileTabs';

interface propsType {
	setIsFaqSidebar: any,
	setIsBookingDetailSidebar: any,
	setIsCloseFormPopUp: any
}

const UploadDocuments: FC<propsType> = ({ setIsFaqSidebar, setIsBookingDetailSidebar, setIsCloseFormPopUp }) => {
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
	const customerUploadDocs = applicationInfo.customerProfileForm.upload_documents;

	//console.log(customerUploadDocs);
	const handleChange = (formInfo: any) => {
		dispatch(setCustomerFormInfo({ key_name: formInfo.document_name, key_value: formInfo.document_url, group_type: "uploaddocuments", activeTabIndex: "" }));
	};

	React.useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
	}, []);

	return (

		<div className='tw-flex tw-flex-col tw-gap-4'>
			<div className='md:tw-hidden tw-flex tw-flex-col tw-gap-3'>
				<div className='tw-flex tw-justify-between'>
					<div className='tw-flex tw-items-center tw-gap-4 '>
						<div
							onClick={() => { setIsCloseFormPopUp(true) }}
						>
							<CloseIcon />
						</div>
						<p className='tw-font-bold text-pri-all'>Upload Primary Applicant's Documents</p>
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
			<div>
				<p className='tw-font-bold md:tw-block tw-hidden tw-text-xl tw-text-black'>Upload Primary Applicant's Documents</p>
				<p className='md:tw-text-sm tw-text-xs'>Please upload clear and readable copies of your KYC documents for verification.</p>
			</div>
			<div className="tw-bg-white tw-p-5 tw-rounded-xl md:tw-border-none tw-border-2 tw-border-black/10 tw-flex tw-flex-col tw-gap-4 tw-ml-2">
				<p className='tw-font-bold pdl tw-text-base text-pri-all no-hover'>{applicantForm?.full_name}'s Documents</p>
				{
					customerUploadDocs.map((docsInfo: any, index: any) => {
						return <div key={stepperActiveKeyInfo.active_stepper_name + "_" + index}>
							<FileUploadDocs applicantForm={applicantForm} fileUplodDocuments={docsInfo} handleFileChangeEvent={handleChange} applicationInfo={applicationInfo} />
						</div>
					})
				}
			</div>
		</div>

	);
}

export default UploadDocuments;