import React, { useState } from 'react'
import FormControl from '@mui/material/FormControl';
import { MenuItem, OutlinedInput, Select, TextField, Radio, Autocomplete, InputAdornment, Tooltip } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { setCustomerFormInfo } from '@App/admin/redux/features/create.application.info.slice';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import {getConfigData} from '@Src/config/config';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import MobileTabs from '@Components/mobile-tabs/MobileTabs';

interface propsType {
	setIsFaqSidebar: any,
	setIsBookingDetailSidebar: any,
	setIsCloseFormPopUp: any
}

const BookingDetails: React.FC<propsType> = ({ setIsFaqSidebar, setIsBookingDetailSidebar, setIsCloseFormPopUp }) => {

	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(false);
	const applicationData = useAppSelector((state: any) => {
		return state.applicationInfo.customerProfileForm;
	});
	const customerBookingInfo = applicationData.customer_booking_amount_details;
	const errorInfo = applicationData.is_error_form.errorList;

	const handleChange = (e: any) => {
		let e_target_value = e.target.value;

		if (e_target_value === null) {
			e_target_value = "";
		}

		console.log(e);
		//setFormData({...formdata,[e.target.name]:e.target.value});
		dispatch(setCustomerFormInfo({ key_name: e.target.name, key_value: e_target_value, group_type: "cust_booking_amount", activeTabIndex: "" }));
	};

	React.useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
	}, []);

	return (
		<div className='tw-flex tw-flex-col tw-gap-4 tw-min-h-[78vh]'>
			<div className='md:tw-hidden tw-flex tw-flex-col tw-gap-3'>
				<div className='tw-flex tw-justify-between'>
					<div className='tw-flex tw-items-center tw-gap-4'>
						<div
							onClick={() => { setIsCloseFormPopUp(true) }}
						>
							<CloseIcon />
						</div>
						<div className='tw-font-bold text-pri-all'>Booking Amount Details</div>
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
				<MobileTabs index={3} />
			</div >
			<div>
				<p className='tw-font-bold tw-block tw-text-xl tw-text-black'>Booking Amount Details</p>
				<p className='md:tw-text-sm tw-text-xs'>Please provide the details of your booking payment below.</p>
			</div>
			<div className="tw-bg-white tw-p-5 tw-rounded-xl md:tw-border-none tw-border-2 tw-border-black/10 tw-flex tw-flex-col tw-gap-4">
				<p className='tw-font-bold tw-text-base text-pri-all'>Booking Details</p>
				<div className='tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4'>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Demand Draft / Cheque No / Transaction Id</span>
						</div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='booking_transaction_id'
								value={customerBookingInfo.booking_transaction_id}
								placeholder="Enter Demand Draft / Cheque No"
								onChange={handleChange}
								inputProps={{ maxLength: 20, style: { fontSize: "14px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.booking_transaction_id}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Date of transaction</span></div>
						<FormControl className='tw-w-full'>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									open={open}
									onOpen={() => setOpen(true)}
									onClose={() => setOpen(false)}
									inputFormat="dd/MM/yyyy"
									value={customerBookingInfo.booking_date || ''}
									onChange={(e) => {
										if (e) {
											// Format the date to 'YYYY-MM-DD'
											const formattedDate = moment(e).format('YYYY-MM-DD');
											let el = { 'target': { 'name': "booking_date", 'value': formattedDate } };
											handleChange(el);
										}
									}}
									maxDate={new Date()}
									views={['year', 'month', 'day']}
									renderInput={(params) => (
										<TextField
											name='transaction-date'
											{...params}
											inputProps={{ ...params.inputProps, readOnly: true, placeholder: 'Date of transaction', style: { fontSize: "14px" } }}
											onClick={() => setOpen(!open)}
											error={false}
										/>
									)
									}
									InputAdornmentProps={{ style: { marginRight: 15 } }}
								/>
							</LocalizationProvider>
							<p className='validation-msg'>{errorInfo?.booking_date}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Bank Name</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='booking_bank_name'
								value={customerBookingInfo.booking_bank_name}
								onChange={handleChange}
								placeholder="Enter Bank Name"
								inputProps={{ maxLength: 35, style: { fontSize: "14px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.booking_bank_name}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Branch Name</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='booking_bank_branch_name'
								value={customerBookingInfo.booking_bank_branch_name}
								onChange={handleChange}
								placeholder="Enter Branch Name "
								inputProps={{ maxLength: 35, style: { fontSize: "14px" } }}
							/>
							<p className='validation-msg'>{errorInfo?.booking_bank_branch_name}</p>
						</FormControl>
					</div>
					<div className='tw-w-full'>
						<div className='tw-mb-1'><span className='red-star !tw-text-xs'>*</span>
							<span className='fs13 text-pri-black !tw-text-xs'>Booking Amount (in Rupees)</span></div>
						<FormControl className='tw-w-full'>
							<OutlinedInput
								name='booking_amount_paid'
								value={customerBookingInfo.booking_amount_paid}
								placeholder="Enter Booking Amount"
								onChange={handleChange}
								inputProps={{ maxLength: 10, style: { fontSize: "14px" } }} />
							<p className='validation-msg'>
								{errorInfo?.booking_amount_paid}</p>
						</FormControl>
					</div>
				</div>
			</div>
		</div >
	);
}

export default BookingDetails;