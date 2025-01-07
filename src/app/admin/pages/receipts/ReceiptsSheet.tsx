import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@mui/material';
import moment from 'moment';
import { GridCloseIcon } from '@mui/x-data-grid';
import Api from "../../api/Api";
import { useParams } from "react-router-dom";
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import './ReceiptsSheet.scss';
import { checkForFalsyValues, formatNumberToIndianSystem, convertNumberToWords } from '@Src/utils/globalUtilities';

const ReceiptsSheetData = (props: {
  showModal: any,
  setShowModal: any,
  custUnitId: any,
  receiptId: any,
  receiptSheetData:any
}) => {
  const dispatch = useAppDispatch();
  const [receipt, setReceipt] = useState<any>(null);
  const { custUnitId, customerId } = useParams();
//   const getSingleReceipt = async (receiptId: any) => {
//     try {
//       dispatch(showSpinner());
//       const { data, status: responseStatus }: any = await Api.get("crm_get_single_receipt", {
//         cust_unit_id: custUnitId,
//         receipt_id: receiptId,
//         type: 'View',
//         "cust_profile_id": customerId
//       });
//       if (responseStatus) {
//         setReceipt(data[0] || []);
//       }
//       dispatch(hideSpinner());
//     } catch (error) {
//       // Handle error
//       console.error(error);
//       dispatch(hideSpinner());
//     }
//   };
  useEffect(() => {
    setReceipt(props?.receiptSheetData)
  }, [ props.receiptId]);

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
            <span className='tw-text-right tw-cursor-pointer tw-mb-4' onClick={() => props?.setShowModal(false)}>
              <GridCloseIcon />
            </span>
          </Tooltip>
        </div>
        <div className='tw-border-2 tw-border-black tw-text-black tw-text-sm'>
          <header className='tw-flex tw-justify-start'>
            <div>
              <img src={'/logo.png'} alt='' className='tw-inline-block tw-p-4' />
            </div>
            <div className='tw-flex tw-flex-col'>
              <h2 className='tw-font-bold tw-text-2xl tw-text-center'>
                {receipt?.company_name}
              </h2>
              <p className='tw-text-center'>
                {receipt?.company_address}, <br />
                {receipt?.company_city} - {receipt?.company_postal_code}, {receipt?.project_state}
              </p>
            </div>
          </header>
          <div className='tw-flex tw-justify-center'>
            <p className='tw-flex tw-border-2 tw-border-black tw-justify-center tw-w-fit tw-font-bold tw-px-8 tw-py-4 tw-bg-[#D3D3D3] tw-rounded-xl'>
              RECEIPT
            </p>
          </div>
          <div className='tw-flex tw-justify-between tw-mt-4 tw-py-2 tw-px-10 tw-border-black tw-border-y-2'>
            <p>Receipt No. :{receipt?.receipt_number}</p>
            <p>Date : {checkForFalsyValues(moment(receipt?.receipt_date).format('DD.MM.YYYY'))}</p>
          </div>

          <div className='tw-flex tw-flex-col tw-items-end tw-p-10 tw-gap-24 tw-leading-[3rem]'>
            <p className='tw-text-justify tw-underline-offset-4'>
              Received with thanks from
              <span className='tw-underline tw-capitalize tw-mx-2'>{receipt?.customer_title} {receipt?.full_name} ({receipt?.customer_number})</span>
              <br />
              a sum of Rs.
              <span className='tw-underline tw-mx-2'>{formatNumberToIndianSystem(receipt?.receipt_amount)}</span> Rupees
              <span className='tw-underline tw-mx-2'>{convertNumberToWords(receipt?.receipt_amount)} only</span>
              <br />
              by Cheque No. / RTGS /
              <br />
              D.D. No. <span className='tw-underline'>{checkForFalsyValues(receipt?.receipt_document_number)}</span> Date
              <span className='tw-underline'> {checkForFalsyValues(moment(receipt?.transaction_date).format('DD.MM.YYYY'))}</span> Drawn on
              <span className='tw-underline tw-mx-2'>{receipt?.bank_details}</span>
              <br />
              Towards <span className='tw-underline'>Flat No-{parseInt(receipt?.floor_no)}{receipt?.unit_no} Block-{parseInt(receipt?.tower_code)} {receipt?.project_name}</span>.
            </p>
            <p>
              For {receipt?.company_name}
            </p>
          </div>
          <p className='tw-ml-10 tw-mb-2'>
            (Cheques are subject to realisation)
          </p>
          <div className='tw-flex tw-justify-evenly tw-border-black tw-border-t-2 tw-divide-x-2 tw-divide-black'>
            <p className='tw-font-bold '>CIN: {receipt?.company_cin_number}</p>
            <p>Email: myhomecons@rediffmail.com</p>
            <p><a href={`${receipt?.company_website}`}>{receipt?.company_website}</a></p>
          </div>
        </div>
        <div>
          <p className='tw-text-black tw-font-bold'>
            No signature is required as this is a system generated document.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReceiptsSheetData;
