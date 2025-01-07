import React, { FC, useState } from 'react';
import MobileTabs from '@Components/mobile-tabs/MobileTabs';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, MenuItem, OutlinedInput, Select, Radio, Autocomplete, TextField, InputAdornment } from '@mui/material';
import './FinanceDetails.scss';
import { Button } from '@mui/material';
import { getCreateApplicationInfo, getStepperActiveInfo, setCustomerFormInfo } from '@App/admin/redux/features/create.application.info.slice';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import {getConfigData} from '@Src/config/config';
import SearchIcon from '@mui/icons-material/Search';
import UploadFinanceDetails from './UploadFinanceDetails';
import { Style } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';


interface propsType {
	setIsFaqSidebar: any,
	setIsBookingDetailSidebar: any,
	setIsCloseFormPopUp: any
}

const FinanceDetails: FC<propsType> = ({ setIsFaqSidebar, setIsBookingDetailSidebar, setIsCloseFormPopUp }) => {
	const dispatch = useAppDispatch();
	const applicationInfo = useAppSelector((state: any) => {
		//console.log(state);
		return state.applicationInfo;
	});
	const financeDetails = applicationInfo.customerProfileForm.finance_details;
	const errorInfo = applicationInfo.customerProfileForm.is_error_form.errorList;

	const handleChange = (e: any) => {
		dispatch(setCustomerFormInfo({ key_name: e.target.name, key_value: e.target.value, group_type: "financedetails", activeTabIndex: "" }));
	}

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
					<div className='tw-flex tw-items-center tw-gap-4'>
						<div
							onClick={() => { setIsCloseFormPopUp(true) }}
						>
							<CloseIcon />
						</div>
						<div className='tw-font-bold text-pri-all'>Finance Details</div>
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
				<MobileTabs index={1} />
			</div >
			<p className='tw-font-bold md:tw-block tw-hidden tw-text-xl tw-text-black'>Finance Details</p>

			<div className=" tw-bg-white tw-p-5 tw-rounded-xl md:tw-border-none tw-border-2 tw-border-black/10 tw-flex tw-flex-col tw-gap-4">
				<div>
					<p className='tw-font-bold tw-text-base tw-text-black'>Customer Bank Account</p>
					<p className='text-pri-header tw-text-xs'>Please provide your banking information for any reimbursement </p>
				</div>
				<div className='tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4'>

					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span><span className='fs13 text-pri-black !tw-text-xs'>Bank Name</span></div>

						<FormControl fullWidth>
							<Autocomplete
								value={financeDetails.bank_name}
								options={getConfigData('indianBanks').map((option: any) => option.name)}
								onChange={(event: any, newValue) => {
									let e = { 'target': { 'name': "bank_name", 'value': newValue } };
									handleChange(e);
								}}
								onBlur={(e: any) => {
									if (e != null) {
										handleChange(e);
									}
								}}
								renderInput={(params) => <TextField {...params} InputProps={{
									...params.InputProps,
									style: { fontSize: "14px" },
									startAdornment: (
										<InputAdornment className="tw-ml-2 tw-opacity-60" position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}} placeholder="Select or Search bank" name='bank_name' />} />
							<p className='validation-msg'>{errorInfo?.bank_name}</p>
						</FormControl>

					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span><span className='fs13 text-pri-black !tw-text-xs'>Branch Name</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='bank_branch'
								value={financeDetails.bank_branch}
								onChange={handleChange}
								placeholder="Enter branch name" inputProps={{ style: { fontSize: "14px" } }} />
							<p className='validation-msg'>{errorInfo?.bank_branch}</p>
						</FormControl>
					</div>

					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span><span className='fs13 text-pri-black !tw-text-xs'>Account Number</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='bank_account_number'
								value={financeDetails.bank_account_number}
								onChange={handleChange}
								placeholder="Enter account number"
								inputProps={{ style: { fontSize: "14px" } }} />
							<p className='validation-msg'>{errorInfo?.bank_account_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span><span className='fs13 text-pri-black !tw-text-xs'>IFSC Code</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='bank_ifsc_code'
								value={financeDetails.bank_ifsc_code}
								onChange={handleChange}
								placeholder="Enter IFSC code" inputProps={{ style: { fontSize: "14px" } }} />
							<p className='validation-msg'>{errorInfo?.bank_ifsc_code}</p>
						</FormControl>
					</div>

					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span><span className='fs13 text-pri-black !tw-text-xs'>Name of the Account Holder</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='name_as_on_bank_account'
								value={financeDetails.name_as_on_bank_account}
								onChange={handleChange}
								placeholder="Enter your full name" inputProps={{ style: { fontSize: "14px" } }} />
							<p className='validation-msg'>{errorInfo?.name_as_on_bank_account}</p>
						</FormControl>
					</div>
				</div>
			</div>

			<div className="tw-bg-white tw-p-5 tw-rounded-xl md:tw-border-none tw-border-2 tw-border-black/10 tw-flex tw-flex-col tw-gap-4">
				<UploadFinanceDetails />
			</div>

			<div className="tw-bg-white tw-p-5 tw-rounded-xl md:tw-border-none tw-border-2 tw-border-black/10 tw-flex tw-flex-col tw-gap-4">
				<div className=''><span className='tw-font-bold tw-text-base tw-text-black'>Home Loan</span></div>
				<div>
					<div className=''><span className='red-star !tw-text-xs'>*</span><span className='fs14 text-pri-black !tw-text-xs'>Interested to avail home loan service by My Home Group</span></div>
					<div className='tw-flex tw-gap-4 tw-items-center'>
						<label className='text-pri-all'>
							<Radio checked={financeDetails.interested_in_home_loans?.toString() == 'true' ? true : false} onChange={handleChange} value={true} name="interested_in_home_loans" />
							Yes
						</label>
						<label className='text-pri-all'>
							<Radio checked={financeDetails.interested_in_home_loans?.toString() == 'false' ? true : false} onChange={handleChange} value={false} name="interested_in_home_loans" />
							No
						</label>
					</div>
					<p className='validation-msg'>{errorInfo?.interested_in_home_loans}</p>
				</div>

			</div>

			{/* <div className="section-container tw-mt-4 tw-p-6">
					<div className='tw-mt-4'>
						<div className='tw-mb-1'><span className='text-pri-all'>TDS info</span></div>
						<div className='tw-my-4'><span className='text-pri-all fs14 tw-font-medium'>TDS: TDS is applicable on Sale Consideration (excluding GST) and shall be paid by the Applicant/s (only) and<br></br> submit the challan copy for our records. Credit to your (Applicant/s) account will be made only after submission of<br></br> challan copy and reflection of the said payment in Company's form 26 AS.</span></div>
					</div>
				</div> */}


		</div>
	);
}

export default FinanceDetails;