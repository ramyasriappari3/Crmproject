import { FC, useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl';
import { MenuItem, OutlinedInput, Select, TextField, Autocomplete, InputAdornment, Tooltip, FormControlLabel, Switch, Dialog, DialogActions, IconButton } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getAddDeleteJointApplicant, setCustomerFormInfo, setIsErrorFormInfo } from '@App/admin/redux/features/create.application.info.slice';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import { getConfigData } from '@Src/config/config';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { calculateAgeInYears, numberToOrdinals } from '@Src/utils/globalUtilities';
import Api from '../../api/Api';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import MobileTabs from '@Components/mobile-tabs/MobileTabs';
import { enqueueSnackbar } from 'notistack';
import getEnqueueSnackbar from '../../util/msgformate';
import './PurchaserDetails.scss'

interface propsType {
	setIsFaqSidebar: any,
	setIsBookingDetailSidebar: any,
	setIsCloseFormPopUp: any
}

const PurchaserDetails: FC<propsType> = ({ setIsFaqSidebar, setIsBookingDetailSidebar, setIsCloseFormPopUp }) => {

	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const applicationInfo = useAppSelector((state: any) => {
		return state.applicationInfo;
	});
	const stepperActiveKeyInfo = applicationInfo.customerProfileForm.tab_active_key_info;
	const activeTabIndex = stepperActiveKeyInfo.child_index;
	const jointApplicantInfo = applicationInfo?.customerProfileForm.joint_applicant_details[activeTabIndex];
	const errorInfo = applicationInfo.customerProfileForm.is_error_form.errorList;
	const applicantInfo = applicationInfo.customerProfileForm.applicant_details;
	const handleCheckBoxChange = (e: any) => {
		if (e.target.checked) {
			dispatch(setCustomerFormInfo({ key_name: e.target.name, key_value: 'on', group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "customer_flat_house_number", key_value: applicantInfo.customer_flat_house_number, group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_state", key_value: applicantInfo.address_state, group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_street1", key_value: applicantInfo.address_street1, group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_street2", key_value: applicantInfo.address_street2, group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_city", key_value: applicantInfo.address_city, group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_country", key_value: applicantInfo.address_country, group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "pin_code", key_value: applicantInfo.pin_code, group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
		} else {
			dispatch(setCustomerFormInfo({ key_name: e.target.name, key_value: 'off', group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "customer_flat_house_number", key_value: "", group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_state", key_value: "", group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_street1", key_value: "", group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_street2", key_value: "", group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_city", key_value: "", group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "address_country", key_value: "", group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
			dispatch(setCustomerFormInfo({ key_name: "pin_code", key_value: "", group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
		}
	}
	const handleChange = (e: any) => {
		let e_target_value = e.target.value;
		if (e.target.value === null) {
			e_target_value = "";
		}
		if (e.target.name != null && e.target.name !== undefined) {
			dispatch(setCustomerFormInfo({ key_name: e.target.name, key_value: e_target_value, group_type: "jointapplicant", activeTabIndex: activeTabIndex }));
		}
	};
	const deleteJointApplicant = async () => {

		if (jointApplicantInfo.joint_customer_id !== "") {
			const { data, status, message }: any = await Api.post("crm_joint_cust_delete", { "joint_customer_id": jointApplicantInfo.joint_customer_id });
			console.log(data, status, message);
			if (status) {
				setIsModalOpen(false);
				dispatch(getAddDeleteJointApplicant({ action_type: "deletejoint", joint_applicant_id: jointApplicantInfo.joint_customer_id, stepper_active_key_info: stepperActiveKeyInfo }));
				dispatch(setIsErrorFormInfo([]));
				enqueueSnackbar(message, getEnqueueSnackbar.alertMsgInfo("success"));
			}
		} else {
			setIsModalOpen(false);
			let message = 'Deleted Successfully';
			dispatch(getAddDeleteJointApplicant({ action_type: "deletejoint", joint_applicant_id: jointApplicantInfo.joint_customer_id, stepper_active_key_info: stepperActiveKeyInfo }));
			dispatch(setIsErrorFormInfo([]));
			enqueueSnackbar(message, getEnqueueSnackbar.alertMsgInfo("success"));

		}

	}

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
	}, []);

	useEffect(() => {
		// Loop through the error object
		for (const key in errorInfo) {
			if (errorInfo.hasOwnProperty(key) && errorInfo[key]) {
				const element = document.getElementsByName(key)[0];
				if (element) {
					element.focus();
					break;
				}
			}
		}
	}, [errorInfo]);

	return (
		<div className='tw-flex tw-flex-col tw-gap-4' key={stepperActiveKeyInfo.stepperActiveKeyInfo}>
			<div className='md:tw-hidden tw-flex tw-flex-col tw-gap-3'>
				<div className='tw-flex tw-justify-between'>
					<div className='tw-flex tw-items-center tw-gap-4'>
						<div
							onClick={() => { setIsCloseFormPopUp(true) }}
						>
							<CloseIcon />
						</div>
						<div className='tw-font-bold text-pri-all'>Joint Applicant Details {activeTabIndex + 1}</div>
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
			<div className='tw-flex tw-justify-between tw-items-center'>
				<p className='tw-font-bold tw-block tw-text-xl tw-text-black'>{`${numberToOrdinals(activeTabIndex + 1)} Joint Applicant's Details`}</p>
				<button className='tw-flex tw-justify-between tw-gap-2 tw-items-center hover:tw-bg-black/10 tw-p-2 tw-rounded-lg tw-transition-all tw-duration-300' onClick={() => setIsModalOpen(true)}>
					<img src="/images/trash-icon.svg" alt="delete joint purchaser" />
					<p className='tw-font-bold tw-text-black tw-text-xs'>Remove Joint Applicant</p>
				</button>
			</div>
			<div className=" tw-bg-white tw-p-5 tw-rounded-xl md:tw-border-none tw-border-2 tw-border-black/10 tw-flex tw-flex-col tw-gap-4">
				<p className='tw-font-bold tw-text-base tw-text-black'>Personal Details</p>
				{/* <div className='tw-w-full tw-mt-4'>
						<div className='tw-mb-1'><span className='red-star'>*</span><span className='fs13 text-pri-black'>Residential Status</span></div>

						<div className='tw-flex tw-gap-4 tw-items-center'>

							<label className='text-pri-all'>
								<Radio checked={(jointApplicantInfo?.resident_type!=null && jointApplicantInfo?.resident_type == "Resident") ? true : false} onChange={handleChange} value={'Resident'} name="resident_type" />
								Resident
							</label>
							<label className='text-pri-all'>
								<Radio checked={(jointApplicantInfo?.resident_type!=null && jointApplicantInfo?.resident_type == "NRI") ? true : false} onChange={handleChange} value={'NRI'} name="resident_type" />
								NRI
							</label>
						</div>
						<p className='validation-msg'>{errorInfo?.resident_type}</p>
					</div> */}
				<div className='tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4'>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Title</span></div>

						<FormControl fullWidth>
							<Select
								name='customer_title'
								MenuProps={{ disableScrollLock: true }}
								id="title"
								displayEmpty
								value={jointApplicantInfo?.customer_title || ''}
								//onBlur={handleBlur}
								onChange={handleChange}
								style={{ fontSize: "13px" }}
								renderValue={
									(value) => {
										if (!value) {
											return <span className='tw-text-[#989FAE] !tw-text-sm'>--</span>;
										}
										const selected = getConfigData('title_data').find((type: any) => type.id === value);
										return selected && selected.name !== '--' ? selected.name : '--';
									}
								}
							>
								<MenuItem style={{ fontSize: '13px' }} disabled>Select</MenuItem>
								{
									getConfigData('title_data')?.map((type: any) => {
										return (
											<MenuItem style={{ fontSize: '13px' }} key={type.id} value={type.id}>{type.name}</MenuItem>
										)
									})
								}
							</Select>
							<p className='validation-msg'>{errorInfo?.customer_title}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star'>*</span>
							<span className='text-pri-black tw-mr-1 tw-text-xs'>Full Name</span>
							<Tooltip
								title="The applicant's name should match the name on their Aadhaar or PAN card."
								placement="top"
								arrow
								classes={{ tooltip: 'custom-tooltip-color' }}
								enterTouchDelay={0}
								leaveTouchDelay={4000}>
								<InfoOutlinedIcon style={{ fontSize: '13px', cursor: 'pointer' }} />
							</Tooltip>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='full_name'
								value={jointApplicantInfo?.full_name}
								placeholder="Enter full name"
								onChange={handleChange}
								inputProps={{ maxLength: 50, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.full_name}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star  !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>S/O, D/O, W/O, H/O</span></div>

						<FormControl fullWidth>
							<Select
								labelId="relationship-select-label"
								MenuProps={{ disableScrollLock: true }}
								name='applicant_relation_id'
								id="relationship-select"
								displayEmpty
								value={jointApplicantInfo?.applicant_relation_id || ''}
								//onBlur={handleBlur}
								style={{ fontSize: "13px" }}
								onChange={handleChange}
								renderValue={
									(value) => {
										if (!value) {
											return <span className='tw-text-[#989FAE] !tw-text-sm'>Select One</span>;
										}
										const selected = getConfigData('applicant_relationship_info').find((type: any) => type.id == value);
										return selected ? selected.name : <p className='tw-text-[#989FAE]'>{jointApplicantInfo?.applicant_relation_id}</p>;
									}
								}
							>
								<MenuItem style={{ fontSize: '13px' }} disabled>Select</MenuItem>
								{
									getConfigData('applicant_relationship_info')?.map((type: any) => {
										return (
											<MenuItem style={{ fontSize: '13px' }} key={type.id} value={type.id}>{type.name}</MenuItem>
										)
									})
								}
							</Select>
							<p className='validation-msg'>{errorInfo?.applicant_relation_id}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Parent/Spouse Name</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='parent_or_spouse_name'
								value={jointApplicantInfo?.parent_or_spouse_name}
								onChange={handleChange}
								placeholder="Enter parent/spouse name"
								inputProps={{ maxLength: 50, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.parent_or_spouse_name}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Applicant's Date of Birth</span></div>
						<FormControl className='tw-w-full'>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									open={open}
									onOpen={() => setOpen(true)}
									onClose={() => setOpen(false)}
									inputFormat="dd/MM/yyyy"
									value={jointApplicantInfo?.dob || null}
									onChange={(e: any) => {
										const formattedDate = moment(e).format('YYYY-MM-DD');
										let el = { 'target': { 'name': "dob", 'value': formattedDate } };
										handleChange(el)
									}}
									maxDate={new Date()}
									views={['year', 'month', 'day']}
									renderInput={(params) => (
										<TextField
											{...params}
											inputProps={{ ...params.inputProps, readOnly: true, placeholder: 'Select your DOB', style: { fontSize: "13px", cursor: 'pointer' } }}
											onClick={() => setOpen(!open)}
											error={false}
										/>
									)
									}
									InputAdornmentProps={{ style: { marginRight: 15 } }}
								/>
							</LocalizationProvider>
							<p className='validation-msg'>{errorInfo?.dob}</p>
						</FormControl>


						{/* <TextField id="date-of-birth" type="date" name='dob' value={jointApplicantInfo?.dob} defaultValue="yyyy-MM-dd" onChange={handleChange}
								InputLabelProps={{ shrink: true, }} placeholder="dd/mm/yyyy" fullWidth />
							<p className='validation-msg'>{errorInfo?.dob}</p> */}

					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black !tw-text-xs'>Age</span></div>
						<FormControl className='tw-w-full !tw-cursor-none'>
							<OutlinedInput
								readOnly={true}
								name='age'
								placeholder='Age will automatically gets displayed once you select your DOB'
								value={jointApplicantInfo?.dob ? calculateAgeInYears(jointApplicantInfo?.dob) : ""}
								inputProps={{ style: { fontSize: "13px" } }}
								sx={{
									'& .MuiOutlinedInput-notchedOutline': {
										border: '1px solid #c4c4c4',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										border: '1px solid #c4c4c4',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										border: '1px solid #c4c4c4',
									},
								}}
							/>
							<p className='validation-msg'>{errorInfo?.age}</p>
						</FormControl>

						{/* <div className='tw-mb-1'>
								<span className='fs13 text-pri-black'>Marital Status</span>
							</div>
							<FormControl fullWidth>
								<Select
									labelId="relationship-select-label"
									MenuProps={{ disableScrollLock: true }}
									name='marital_status'
									id="marital-status-select"
									displayEmpty
									value={jointApplicantInfo.marital_status != null && jointApplicantInfo.marital_status}
									//onBlur={handleBlur}
									onChange={handleChange}
									renderValue={
										(value) => {
											const selected = getConfigData('marital_status_data').find((type: any) => type.id == value);
											return selected ? selected.name : <p className='tw-text-[#989FAE]'>Select Marital Status</p>;
										}
									}
								>
									<MenuItem disabled>Select One</MenuItem>
									{
										getConfigData('marital_status_data')?.map((type: any) => {
											return (
												<MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
											)
										})
									}

								</Select>
								<p className='validation-msg'>{errorInfo?.marital_status}</p>
							</FormControl> */}
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							{applicantInfo?.resident_type !== "NRI" && <span className='red-star !tw-text-xs'>*</span>}
							<span className='fs13 text-pri-black !tw-text-xs'>PAN Card (Format:ABCDE1234F)</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='pan_card'
								value={jointApplicantInfo?.pan_card}
								onChange={handleChange}
								placeholder="Enter PAN (e.g., ABCDE1234F)"
								inputProps={{ maxLength: 10, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.pan_card}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							{applicantInfo?.resident_type !== "NRI" && <span className='red-star !tw-text-xs'>*</span>}
							<span className='fs13 text-pri-black !tw-text-xs'>Aadhaar Number</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								value={jointApplicantInfo?.aadhaar_number}
								name="aadhaar_number"
								onChange={handleChange}
								placeholder="Enter Aadhaar number(e.g.,XXXX XXXX XXXX)"
								inputProps={{ maxLength: 14, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.aadhaar_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black !tw-text-xs'>GSTIN (Format:12ABCDE1234F1Z2)</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name="gstin_number"
								value={jointApplicantInfo?.gstin_number}
								onChange={handleChange}
								placeholder="Enter GSTIN (e.g., 12ABCDE1234F1Z2)"
								inputProps={{ maxLength: 15, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.gstin_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							{(applicantInfo.resident_type === "NRI" && jointApplicantInfo.pan_card === '') && <span className='red-star !tw-text-xs'>*</span>}
							{/* {jointApplicantInfo?.resident_type === "NRI" && <span className='red-star'>*</span>} */}
							<span className='fs13 text-pri-black !tw-text-xs'>Passport Number</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								value={jointApplicantInfo?.passport_number}
								name="passport_number"
								onChange={handleChange}
								placeholder="Enter Passport number"
								inputProps={{ maxLength: 20, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.passport_number}</p>
						</FormControl>
					</div>
				</div>
				<p className='tw-font-bold tw-text-base tw-text-black tw-mt-2'>Professional details</p>
				<div className='tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4'>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star'>*</span>
							<span className='fs13 text-pri-black'>Occupation</span>
						</div>

						<FormControl fullWidth>
							<Select
								labelId="occupation-select-label"
								id="occupation-select"
								name='occupation'
								MenuProps={{ disableScrollLock: true }}
								value={jointApplicantInfo?.occupation || ''}
								onChange={handleChange}
								displayEmpty
								renderValue={
									(value) => {
										if (!value) {
											return <span className='tw-text-[#989FAE] !tw-text-sm'>Enter Your Occupation</span>;
										}
										const selected = getConfigData('occupation_data').find((type: any) => type.id == value);
										return selected ? selected.name : <p className='tw-text-[#989FAE]'>Select Occupation</p>;
									}
								}
							>
								{
									getConfigData('occupation_data')?.map((type: any) => {
										return (
											<MenuItem style={{ fontSize: '13px' }} key={type.id} value={type.id}>{type.name}</MenuItem>
										)
									})
								}
							</Select>
							<p className='validation-msg'>{errorInfo?.occupation}</p>
						</FormControl>

					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star'>*</span>
							<span className='fs13 text-pri-black'>Organisation Name</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='organisation_name'
								value={jointApplicantInfo?.organisation_name}
								placeholder="Enter your organisation name"
								onChange={handleChange}
								inputProps={{ maxLength: 50, style: { fontSize: "13px", textTransform: 'uppercase' } }}
							/>
							<p className='validation-msg'>{errorInfo?.organisation_name}</p>
						</FormControl>
					</div>

					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star'>*</span>
							<span className='fs13 text-pri-black'>Designation</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='designation'
								value={jointApplicantInfo?.designation}
								placeholder="Enter your designation"
								onChange={handleChange}
								inputProps={{ maxLength: 30, style: { fontSize: "13px", textTransform: 'uppercase' } }}
							/>
							<p className='validation-msg'>{errorInfo?.designation}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star'>*</span>
							<span className='fs13 text-pri-black'>Organisation Address</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='organisation_address'
								value={jointApplicantInfo?.organisation_address}
								placeholder="Enter your work location"
								onChange={handleChange}
								inputProps={{ maxLength: 100, style: { fontSize: "13px", textTransform: 'uppercase' } }}
							/>
							<p className='validation-msg'>{errorInfo?.organisation_address}</p>
						</FormControl>
					</div>
				</div>
				<p className='tw-font-bold tw-text-base tw-text-black tw-mt-2'>Address details</p>
				<div>
					<FormControlLabel
						control={<Switch
							name="same_as_primary_applicant"
							checked={jointApplicantInfo.same_as_primary_applicant === 'on' ? true : false}
							onChange={handleCheckBoxChange}
						/>}
						label='Same as Primary Applicant'
					/>
				</div>
				<div className='tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4'>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>House/Flat No.</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='customer_flat_house_number'
								value={jointApplicantInfo?.customer_flat_house_number}
								placeholder="Enter your house/flat number"
								onChange={handleChange}
								inputProps={{ maxLength: 50, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.customer_flat_house_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							{/* {jointApplicantInfo?.resident_type !== "NRI" && <span className='red-star'>*</span>} */}
							<span className='fs13 text-pri-black !tw-text-xs'>State</span>
						</div>
						<FormControl fullWidth>
							{applicantInfo.resident_type == "Resident" ?
								<Autocomplete
									id="free-solo-demo"
									value={jointApplicantInfo?.address_state || ''} // Ensure there's a default empty string
									options={getConfigData('indianStates').map((option: any) => option?.name)}
									onChange={(event: any, newValue) => {
										let e = { target: { name: "address_state", value: newValue } };
										handleChange(e); // Trigger change with new value
									}}
									onInputChange={(e: any, newInputValue) => {
										if (newInputValue != null) {
											let e = { target: { name: "address_state", value: newInputValue } };
											handleChange(e); // Trigger input change for the text field
										}
									}}
									inputValue={jointApplicantInfo?.address_state || ''} // Ensure empty string fallback
									renderInput={(params) => (
										<TextField
											{...params}
											InputProps={{
												...params.InputProps,
												style: { fontSize: "13px" },
												startAdornment: (
													<InputAdornment className="tw-ml-2 tw-opacity-60" position="start">
														<SearchIcon />
													</InputAdornment>
												),
											}}
											inputProps={{
												...params.inputProps,
												maxLength: 40,
											}}
											placeholder="Select or Search state"
											name="address_state"
										/>
									)}
								/>
								:
								<OutlinedInput name='address_state' value={jointApplicantInfo.address_state} placeholder="Enter your state"
									onChange={handleChange} inputProps={{ maxLength: 40, style: { fontSize: "13px" } }} />
							}
							<p className='validation-msg'>{errorInfo?.address_state}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Street Address 1</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='address_street1'
								value={jointApplicantInfo?.address_street1}
								placeholder='Enter street address 1'
								onChange={handleChange} inputProps={{ maxLength: 50, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.address_street1}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span><span className='fs13 text-pri-black !tw-text-xs'>Street Address 2</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='address_street2'
								value={jointApplicantInfo?.address_street2}
								placeholder='Enter street address 2'
								onChange={handleChange} inputProps={{ maxLength: 50, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.address_street2}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>City/Town/District</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='address_city'
								value={jointApplicantInfo?.address_city}
								placeholder="Enter your city/town/district"
								onChange={handleChange} inputProps={{ maxLength: 40, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.address_city}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Country</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='address_country'
								value={jointApplicantInfo?.address_country}
								placeholder="Enter your country"
								onChange={handleChange} inputProps={{ maxLength: 40, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.address_country}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Pin/Postal/Zip Code</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='pin_code'
								value={jointApplicantInfo?.pin_code}
								placeholder="Enter your pin/postal/zip code"
								onChange={handleChange}
								inputProps={{
									maxLength: applicationInfo.resident_type === "Resident" ? 6 : 12,
									style: { fontSize: "13px" }
								}}
							/>
							<p className='validation-msg'>{errorInfo?.pin_code}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black !tw-text-xs'>Phone Residence</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='land_line_number'
								value={jointApplicantInfo?.land_line_number}
								placeholder="Enter your residence phone number"
								onChange={handleChange}
								inputProps={{ maxLength: 16, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.land_line_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black !tw-text-xs'>Office Phone</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='office_phone'
								value={jointApplicantInfo?.office_phone}
								placeholder="Enter office phone number"
								onChange={handleChange}
								inputProps={{ maxLength: 16, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.office_phone}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black !tw-text-xs'>Fax</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='fax'
								value={jointApplicantInfo?.fax}
								placeholder="Enter fax number"
								onChange={handleChange}
								inputProps={{ maxLength: 16, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.fax}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Mobile</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='mobile_number'
								value={jointApplicantInfo?.mobile_number}
								placeholder="Enter mobile number"
								onChange={handleChange}
								inputProps={{ maxLength: 16, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.mobile_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Email ID</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='email_id'
								value={jointApplicantInfo?.email_id}
								placeholder="Enter mail ID"
								onChange={handleChange}
								inputProps={{ maxLength: 60, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.email_id}</p>
						</FormControl>
					</div>
				</div>
			</div>
			<Dialog
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				aria-labelledby="confirm-delete-title"
				aria-describedby="confirm-delete-description"
			>
				<div className="tw-flex tw-justify-between tw-items-start tw-p-6">
					<p className='tw-font-bold'>Are you sure you want to remove the joint purchaser?</p>
					<IconButton aria-label="" onClick={() => setIsModalOpen(false)}>
						<CloseIcon />
					</IconButton>
				</div>

				<p className='tw-px-6 tw-pb-4'>
					Removing the joint purchaser will delete all information associated with them. This action cannot be undone
				</p>

				<DialogActions>
					<button className='bg-white-btn-util' onClick={deleteJointApplicant} >
						Remove
					</button>
					<button className='bg-black-btn-util' onClick={() => setIsModalOpen(false)} >
						Cancel
					</button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default PurchaserDetails;