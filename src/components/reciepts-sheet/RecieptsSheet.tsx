import './RecieptsSheet.scss'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice'
import { useAppDispatch } from '@Src/app/hooks'
import { capitalizeFirstLetter, checkForFalsyValues, convertNumberToWords, formatNumberToIndianSystem, getTitleNameWithDots } from '@Src/utils/globalUtilities'
import { IAPIResponse } from '@Src/types/api-response-interface'
import { MODULES_API_MAP, httpService } from '@Src/services/httpService'
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes'
import { Tooltip } from '@mui/material'
import moment from 'moment'
import { GridCloseIcon } from '@mui/x-data-grid'
import { MyContext } from '@Src/Context/RefreshPage/Refresh'

const RecieptsSheet = (props: {
	showModal: any,
	setShowModal: any,
	receiptId: any
}) => {

	const dispatch = useAppDispatch();
	const [receipt, setReceipt] = useState<any>(null);
	const { cust_profile_id, cust_unit_id } = useContext(MyContext);
	const getSingleReceipt = async (receiptId: any) => {
		try {
			dispatch(showSpinner());
			const url = `${GLOBAL_API_ROUTES.GET_SINGLE_RECEIPT}?cust_profile_id=${cust_profile_id}&cust_unit_id=${cust_unit_id}&receipt_id=${receiptId}&type=${'View'}`?.trim();
			const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, url).GET();
			if (apiResponse?.success) {
				setReceipt(apiResponse?.data?.[0] || [])
			}
			dispatch(hideSpinner());
		} catch (error) {
			////console.log(error);
		}
	};

	useEffect(() => {
		if (props?.receiptId) {
			getSingleReceipt(props?.receiptId);
		}
	}, [props?.receiptId])

	const modalRef = useRef<HTMLDivElement>(null);
	const handleBackgroundClick = (event: any) => {
		if (modalRef.current && !modalRef.current.contains(event.target)) {
			props?.setShowModal(false);
		}
	};
	return (
		<div className={props?.showModal ? "modal-box-receipt" : "tw-hidden"} onClick={handleBackgroundClick}>
			<div ref={modalRef} className="modal-box-content-receipt">
				<div className='tw-flex tw-justify-end'>
					<Tooltip title="Close" arrow placement='top'>
						<span className='tw-text-right tw-cursor-pointer tw-mb-4' onClick={() => props?.setShowModal(false)}><GridCloseIcon></GridCloseIcon></span>
					</Tooltip>
				</div>
				<div className='tw-border-2 tw-border-black tw-text-black tw-text-sm'>
					<div className='tw-flex tw-gap-16'>
						<div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-5'>
							<img src={'/logo.png'} alt='' className='tw-block' />
						</div>
						<header className='tw-flex tw-justify-center'>
							<div className='tw-flex tw-flex-col tw-items-center tw-gap-4'>
								<h2 className='tw-font-bold tw-text-2xl tw-text-center'>
									{capitalizeFirstLetter(receipt?.company_name)}
								</h2>
								<p className='tw-text-center'>
									{receipt?.company_address}, <br />
									{receipt?.company_city} - {receipt?.company_postal_code}, {receipt?.project_state}
								</p>
								<p className='tw-flex tw-border-2 tw-border-black tw-justify-center tw-w-fit tw-font-bold tw-px-10 tw-py-3 tw-bg-[#D3D3D3] tw-rounded-xl'>
									RECEIPT
								</p>
							</div>
						</header>
					</div>
					<div className='tw-flex tw-justify-between tw-mt-4 tw-py-2 tw-px-10 tw-border-black tw-border-y-2'>
						<p>Receipt No. :{receipt?.receipt_number}</p>
						<p>Date : {checkForFalsyValues(moment(receipt?.receipt_date).format('DD.MM.YYYY'))}</p>
					</div>

					<div className=" tw-flex tw-flex-col tw-gap-5 tw-p-10 tw-text-justify">
						<div className='tw-flex'>
							<p className="tw-flex-1 tw-leading-10">
								<span>
									Received with thanks from
								</span>
								<span className='tw-border-black tw-border-b-2'>
									<span className="tw-capitalize tw-mx-1">
										{getTitleNameWithDots(receipt?.customer_title)} {receipt?.full_name} ({receipt?.customer_number})
									</span>
									{receipt?.joint_customer_names?.map((customer: any, index: any) => {
										return (
											<span key={index} className="tw-mx-2">
												& {getTitleNameWithDots(customer?.customer_title)} {capitalizeFirstLetter(customer?.full_name)}
											</span>
										)
									})}
								</span>
							</p>
						</div>

						<div className='tw-inline-block'>
							<span>a sum of Rs.</span>
							<span className="tw-border-black tw-border-b-2 tw-mx-2">
								{formatNumberToIndianSystem(receipt?.receipt_amount)}
							</span>
							<span className='tw-mx-2'>
								Rupees
							</span>
							<span className="tw-border-black tw-border-b-2 tw-text-wrap tw-leading-10">
								{convertNumberToWords(receipt?.receipt_amount)?.toUpperCase()} 
							</span>

						</div>

						<div className='tw-flex tw-justify-between'>
							<p className="tw-border-black tw-border-b-2  tw-flex-1"></p>
							<p>by Cheque No. / RTGS /</p>
						</div>

						<div className='tw-inline-block'>
							<span>D.D. No. </span>
							<span className="tw-inline-block tw-mx-2 tw-w-52 tw-border-black tw-border-b-2">
								{checkForFalsyValues(receipt?.receipt_document_number)}
							</span>
							<span>Date</span>
							<span className="tw-inline-block tw-mx-2 tw-w-52 tw-border-black tw-border-b-2">
								{checkForFalsyValues(moment(receipt?.transaction_date).format('DD.MM.YYYY'))}
							</span>
							<span className="tw-mx-2">Drawn on</span>
							<span className="tw-border-black tw-border-b-2 tw-text-wrap tw-leading-10">
								{receipt?.bank_details}
							</span>
						</div>

						<div className='tw-flex tw-gap-4'>
							<p>Towards</p>
							<p className="tw-border-black tw-border-b-2 tw-flex-1">
								<span>Flat No-{parseInt(receipt?.floor_no)}{receipt?.unit_no} Block-{parseInt(receipt?.tower_code)} {receipt?.project_name}</span>.
							</p>
						</div>
						<p className="tw-text-right tw-mt-10 tw-mr-10">For {receipt?.company_name}</p>
					</div>
					<p className="tw-mx-10 tw-my-2">(Cheques are subject to realisation)</p>
					<div className='tw-flex tw-justify-evenly tw-border-black tw-border-t-2 tw-divide-x-2 tw-divide-black'>
						<p className='tw-font-bold tw-p-2 tw-ml-3'>CIN: {receipt?.company_cin_number}</p>
						<p className='tw-p-2'>Email: myhomecons@rediffmail.com</p>
						<p className='tw-p-2'><a href={`${receipt?.company_website}`}>{receipt?.company_website}</a></p>
					</div>
				</div>
				<div>
					<p className='tw-text-black tw-font-bold'>
						No signature is required as this is a system generated document.
					</p>
				</div>
			</div>
		</div >
	)
}

export default RecieptsSheet