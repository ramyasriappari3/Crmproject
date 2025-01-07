import { useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl';
import { MenuItem, OutlinedInput, Select, TextField, Radio, Autocomplete, InputAdornment, Tooltip } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { setCustomerFormInfo } from '@App/admin/redux/features/create.application.info.slice';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import { getConfigData } from '@Src/config/config';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { calculateAgeInYears } from '@Src/utils/globalUtilities';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import MobileTabs from '@Components/mobile-tabs/MobileTabs';
import './ApplicationInformation.scss'
import moment from 'moment';

interface propsType {
	setIsFaqSidebar: any,
	setIsBookingDetailSidebar: any,
	setIsCloseFormPopUp: any
}

const ApplicationInformation: React.FC<propsType> = ({ setIsFaqSidebar, setIsBookingDetailSidebar, setIsCloseFormPopUp }) => {

	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(false);
	const applicationData = useAppSelector((state: any) => {
		return state.applicationInfo.customerProfileForm;
	});
	const applicationInfo = applicationData.applicant_details;
	const errorInfo = applicationData.is_error_form.errorList;

	const handleChange = (e: any) => {
		let e_target_value = e.target.value;
		if (e.target.value === null) {
			e_target_value = "";
		}
		//setFormData({...formdata,[e.target.name]:e.target.value});
		dispatch(setCustomerFormInfo({ key_name: e.target.name, key_value: e_target_value, group_type: "applicant", activeTabIndex: "" }));
	};
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
		<div className='tw-flex tw-flex-col tw-gap-4'>
			<div className='md:tw-hidden tw-flex tw-flex-col tw-gap-3'>
				<div className='tw-flex tw-justify-between'>
					<div className='tw-flex tw-items-center tw-gap-4'>
						<div
							onClick={() => { setIsCloseFormPopUp(true) }}
						>
							<CloseIcon />
						</div>
						<p className='tw-font-bold text-pri-all'>Primary Applicant's Information</p>
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
			<div className=''>
				<p className='tw-font-bold md:tw-block tw-hidden tw-text-xl tw-text-black'>Primary Applicant's Information</p>
				<p className='md:tw-text-sm tw-text-xs'>Please fill in the information carefully, as these details will be used in preparing the legal documentation, including the 'Agreement of Sale' and 'Sale Deed'</p>
			</div>
			<div className=" tw-bg-white tw-p-5 tw-rounded-xl md:tw-border-none tw-border-2 tw-border-black/10 tw-flex tw-flex-col tw-gap-4">
				<p className='tw-font-bold tw-text-base tw-text-black tw-mt-2'>Personal Details</p>
				<div className='tw-w-full'>
					<p className='tw-text-xs tw-text-black'>Residential Status</p>
					<div className='tw-flex tw-gap-4 tw-items-center !tw-text-sm'>

						<label className='text-pri-all'>
							{/* disabled */}
							<Radio disabled checked={applicationInfo.resident_type == "Resident" ? true : false} onChange={handleChange} value={'Resident'} name="resident_type" />
							Resident
						</label>
						<label className='text-pri-all'>
							<Radio disabled checked={applicationInfo.resident_type == "NRI" ? true : false} onChange={handleChange} value={'NRI'} name="resident_type" />
							NRI
						</label>
					</div>
					<p className='validation-msg'>{errorInfo?.resident_type}</p>
				</div>
				<div className='tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4'>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star '>*</span>
							<span className='fs13 text-pri-black tw-mr-1'>Title</span>
							<Tooltip
								// title="The applicant's name should match the name on their Aadhaar or PAN card."
								title='Kindly reach out to your Relationship Manager (RM) to update the pre-filled information.'
								placement="top" arrow
								classes={{ tooltip: 'custom-tooltip-color' }}
								enterTouchDelay={0}
								leaveTouchDelay={4000}
							>
								<InfoOutlinedIcon style={{ fontSize: '13px', cursor: 'pointer' }} />
							</Tooltip>
						</div>
						<FormControl fullWidth>
							<Select
								sx={{
									backgroundColor: '#EAECEF'
								}}
								name='customer_title'
								MenuProps={{ disableScrollLock: true }}
								placeholder='Enter Your Title'
								style={{ fontSize: '13px' }}
								displayEmpty
								value={applicationInfo?.customer_title || ''}
								//onBlur={handleBlur}
								onChange={handleChange}
								disabled={true}
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
								<MenuItem disabled style={{ fontSize: '13px' }}>Select</MenuItem>
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
						<div className='tw-mb-1'><span className='red-star'>*</span>
							<span className='text-pri-black tw-mr-1 fs13'>Full Name</span>
							<Tooltip
								// title="The applicant's name should match the name on their Aadhaar or PAN card."
								title='Kindly reach out to your Relationship Manager (RM) to update the pre-filled information.'
								placement="top" arrow
								classes={{ tooltip: 'custom-tooltip-color' }}
								enterTouchDelay={0}
								leaveTouchDelay={4000}
							>
								<InfoOutlinedIcon style={{ fontSize: '13px', cursor: 'pointer' }} />
							</Tooltip>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								sx={{
									backgroundColor: '#EAECEF'
								}}
								name='full_name'
								disabled={true}
								value={applicationInfo.full_name}
								placeholder="Enter full name"
								onChange={handleChange}
								inputProps={{ maxLength: 50, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.full_name}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star fs13'>*</span>
							<span className='fs13 text-pri-black'>S/O, D/O, W/O, H/O</span>
						</div>
						<FormControl fullWidth>
							<Select
								labelId="relationship-select-label"
								MenuProps={{ disableScrollLock: true }}
								name='applicant_relation_id'
								id="relationship-select"
								style={{ fontSize: "13px" }}
								displayEmpty
								value={applicationInfo?.applicant_relation_id || ''}
								//onBlur={handleBlur}
								onChange={handleChange}
								renderValue={
									(value) => {
										if (!value) {
											return <span className='tw-text-[#989FAE] fs13'>Select One</span>;
										}
										const selected = getConfigData('applicant_relationship_info').find((type: any) => type.id == value);
										return selected ? selected.name : <p className='tw-text-[#989FAE]'>{applicationInfo.applicant_relation_id}</p>;
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
							<span className='red-star fs13'>*</span>
							<span className='fs13 text-pri-black'>Parent/Spouse Name</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='parent_or_spouse_name'
								value={applicationInfo.parent_or_spouse_name}
								onChange={handleChange}
								placeholder="Enter parent/spouse name"
								inputProps={{ maxLength: 50, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.parent_or_spouse_name}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star fs13'>*</span>
							<span className='fs13 text-pri-black'>Applicant's Date of Birth</span>
						</div>
						<FormControl className='tw-w-full'>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									open={open}
									onOpen={() => setOpen(true)}
									onClose={() => setOpen(false)}
									inputFormat="dd/MM/yyyy"
									value={applicationInfo?.dob || ''}
									className='!tw-text-sm'
									onChange={(e) => {
										if (e) {
											// Format the date to 'YYYY-MM-DD'
											const formattedDate = moment(e).format('YYYY-MM-DD');
											let el = { 'target': { 'name': "dob", 'value': formattedDate } };
											handleChange(el);
										}
									}}
									maxDate={new Date()}
									views={['year', 'month', 'day']}
									renderInput={(params) => (
										<TextField
											id="main-applicant-dob"
											{...params}
											sx={{ fontSize: "13px" }}
											inputProps={{ ...params.inputProps, readOnly: true, placeholder: 'Select your DOB', style: { fontSize: '13px', cursor: 'pointer' } }}
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

						{/* <TextField id="date-of-birth" type="date" name='dob' value= {applicationInfo.dob} defaultValue="dd/MM/yyyy" onChange={handleChange} 
									InputLabelProps={{shrink: true,}} placeholder="dd/mm/yyyy" fullWidth /> */}
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='fs13 text-pri-black'>Age</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								readOnly={true}
								name='age'
								placeholder='Age will automatically gets displayed once you select your DOB'
								value={applicationInfo?.dob ? calculateAgeInYears(applicationInfo?.dob) : ""}
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
						</FormControl>

						{/* <div className='tw-mb-1'><span className='fs13 text-pri-black'>Marital Status</span></div>
							<FormControl className='tw-w-full'>
								<Select
									labelId="relationship-select-label"
									MenuProps={{ disableScrollLock: true }}
									name='marital_status'
									id="marital-status-select"
									displayEmpty
									value={applicationInfo.marital_status != null ? applicationInfo.marital_status : ''}
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
							{applicationInfo.resident_type !== "NRI" && <span className='red-star fs13'>*</span>}
							<span className='fs13 text-pri-black'>PAN Card (Format: ABCDE1234F)</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='pan_card'
								value={applicationInfo.pan_card}
								onChange={handleChange}
								placeholder="Enter PAN (e.g., ABCDE1234F)"
								inputProps={{ maxLength: 10, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.pan_card}</p>
						</FormControl>

					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							{applicationInfo.resident_type !== "NRI" && <span className='red-star '>*</span>}
							<span className='fs13 text-pri-black '>Aadhaar Number</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								value={applicationInfo.aadhaar_number}
								name="aadhaar_number"
								onChange={handleChange}
								placeholder="Enter Aadhaar number(e.g.,XXXX XXXX XXXX)"
								inputProps={{ maxLength: 14, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.aadhaar_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black '>GSTIN (Format: 12ABCDE1234F1Z2)</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name="gstin_number"
								value={applicationInfo.gstin_number}
								onChange={handleChange}
								placeholder="Enter GSTIN (e.g., 12ABCDE1234F1Z2)"
								inputProps={{ maxLength: 15, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.gstin_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							{(applicationInfo.resident_type === "NRI" && applicationInfo.pan_card === '') && <span className='red-star '>*</span>}
							<span className='fs13 text-pri-black '>Passport Number</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name="passport_number"
								value={applicationInfo.passport_number}
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
						<div className='tw-mb-1'><span className='red-star '>*</span><span className='fs13 text-pri-black '>Occupation</span></div>

						<FormControl fullWidth>
							<Select
								labelId="occupation-select-label"
								id="occupation-select"
								MenuProps={{ disableScrollLock: true }}
								value={applicationInfo.occupation}
								name='occupation'
								style={{ fontSize: '13px' }}
								onChange={handleChange}
								displayEmpty
								renderValue={
									(value) => {
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
						<div className='tw-mb-1'><span className='red-star '>*</span><span className='fs13 text-pri-black '>Organisation Name</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='organisation_name'
								value={applicationInfo.organisation_name}
								placeholder="Enter your organisation name"
								onChange={handleChange}
								inputProps={{ maxLength: 50, style: { fontSize: "13px", textTransform: 'uppercase' } }} />
							<p className='validation-msg'>{errorInfo?.organisation_name}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star'>*</span><span className='fs13 text-pri-black '>Designation</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='designation'
								value={applicationInfo.designation}
								placeholder="Enter your designation"
								onChange={handleChange}
								inputProps={{ maxLength: 30, style: { fontSize: "13px", textTransform: 'uppercase' } }}
							/>
							<p className='validation-msg'>{errorInfo?.designation}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star '>*</span><span className='fs13 text-pri-black '>Organisation Address</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='organisation_address'
								value={applicationInfo.organisation_address}
								placeholder="Enter your work location"
								onChange={handleChange}
								inputProps={{ maxLength: 100, style: { fontSize: "13px", textTransform: 'uppercase' } }} />
							<p className='validation-msg'>{errorInfo?.organisation_address}</p>
						</FormControl>
					</div>
				</div>
				<p className='tw-font-bold tw-text-base tw-text-black tw-mt-2'>Address details</p>
				<div className='tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4'>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star '>*</span><span className='fs13 text-pri-black '>House/Flat No.</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='customer_flat_house_number'
								value={applicationInfo.customer_flat_house_number}
								placeholder="Enter your house/flat number"
								onChange={handleChange}
								inputProps={{ maxLength: 50, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.customer_flat_house_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							{/* {applicationInfo.resident_type == "Resident" ? <span className='red-star'>*</span> : ""} */}
							<span className='red-star '>*</span>
							<span className='fs13 text-pri-black '>State</span>
						</div>
						<FormControl fullWidth>
							{applicationInfo.resident_type == "Resident" ?
								<Autocomplete
									id="free-solo-demo"
									value={applicationInfo?.address_state || ''} // Ensure there's a default empty string
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
									inputValue={applicationInfo?.address_state || ''} // Ensure empty string fallback
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
								<OutlinedInput
									name='address_state'
									value={applicationInfo?.address_state}
									placeholder="Enter your state"
									onChange={handleChange}
									inputProps={{ maxLength: 40, style: { fontSize: "13px" } }} />
							}
							<p className='validation-msg'>{errorInfo?.address_state}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star '>*</span><span className='fs13 text-pri-black '>Street Address 1</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='address_street1'
								value={applicationInfo.address_street1}
								placeholder='Enter street address 1'
								onChange={handleChange}
								inputProps={{ maxLength: 50, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.address_street1}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star '>*</span><span className='fs13 text-pri-black '>Street Address 2</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='address_street2'
								value={applicationInfo.address_street2}
								placeholder='Enter street address 2'
								onChange={handleChange} inputProps={{ maxLength: 50, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.address_street2}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black '><span className='red-star '>*</span>City/Town/District</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='address_city'
								value={applicationInfo.address_city}
								placeholder="Enter your city/town/district"
								onChange={handleChange} inputProps={{ maxLength: 40, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.address_city}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black '><span className='red-star '>*</span>Country</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='address_country'
								value={applicationInfo.address_country}
								placeholder="Enter your country"
								onChange={handleChange} inputProps={{ maxLength: 40, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.address_country}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star '>*</span><span className='fs13 text-pri-black '>Pin/Postal/Zip Code</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='pin_code'
								value={applicationInfo.pin_code}
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
						<div className='tw-mb-1'><span className='fs13 text-pri-black '>Phone Residence</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='land_line_number'
								value={applicationInfo.land_line_number}
								placeholder="Enter your residence phone number"
								onChange={handleChange}
								inputProps={{ maxLength: 16, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.land_line_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black '>Office Phone</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='office_phone'
								value={applicationInfo.office_phone}
								placeholder="Enter office phone number"
								onChange={handleChange}
								inputProps={{ maxLength: 16, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.office_phone}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black '>Fax</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='fax'
								value={applicationInfo.fax}
								placeholder="Enter fax number"
								onChange={handleChange}
								inputProps={{ maxLength: 16, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.fax}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'>
							<span className='red-star '>*</span>
							<span className='fs13 text-pri-black '>Mobile</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='mobile_number'
								value={applicationInfo.mobile_number}
								placeholder="Enter your mobile number"
								onChange={handleChange}
								inputProps={{ maxLength: 16, style: { fontSize: "13px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.mobile_number}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star '>*</span><span className='fs13 text-pri-black '>Email ID</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='email_id'
								value={applicationInfo.email_id}
								placeholder="Enter mail ID"
								onChange={handleChange} inputProps={{ maxLength: 60, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.email_id}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black '>Alternate Mobile</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='alternate_mobile'
								value={applicationInfo.alternate_mobile}
								placeholder="Enter alternate mobile number"
								onChange={handleChange}
								inputProps={{ maxLength: 16, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.alternate_mobile}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='fs13 text-pri-black '>Alternate Email ID</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='alternate_email_id'
								value={applicationInfo.alternate_email_id}
								placeholder="Enter alternate mail ID"
								onChange={handleChange} inputProps={{ maxLength: 60, style: { fontSize: "13px" } }} />
							<p className='validation-msg'>{errorInfo?.alternate_email_id}</p>
						</FormControl>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ApplicationInformation;