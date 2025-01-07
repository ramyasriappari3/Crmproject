import React, { useContext, useEffect, useState } from 'react';
import { Box, Paper, Tooltip } from '@mui/material';
import moment from 'moment';
import Document from '@Components/document-holder/Document';
import ReceiptsSheetData from "../../pages/receipts/ReceiptsSheet";
import { MyContext } from '@Src/Context/RefreshPage/Refresh';
import { checkForFalsyValues, getDataFromLocalStorage } from '@Src/utils/globalUtilities';
import './Receipts.scss';
import Api from "../../api/Api";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@Src/app/hooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import userSessionInfo from "../../util/userSessionInfo";
import axios from "axios";
import { MODULES_API_MAP } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import RecieptsTab from '@Src/components/reciepts-tab/RecieptsTab'

const Reciepts = () => {
  const userDetails: any = JSON.parse(getDataFromLocalStorage('user_details') || '{}');
  const [receiptId, setReceiptId] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const { cust_unit_id } = useContext(MyContext);
  const { customerId, custUnitId } = useParams();
  const [receiptData,setReceiptData] =  useState<any>([]);
  const dispatch = useAppDispatch();
  const [receiptSheetData, setReceipt] = useState<any>(null);
  

  const getCustomerReceipts = async () => {
    const { data, status, message }: any = await Api.get(
      "crm_get_all_customer_receipts",
      { cust_unit_id: custUnitId }
    );
    dispatch(showSpinner());
    if (status) {
      setReceiptData(data);
    }else{
      setReceiptData([]);
    }
    dispatch(hideSpinner());
  };

  useEffect(() => {
    getCustomerReceipts();
  }, []);

  const downloadReceipt8 = async (receiptId: any) => {
    let documentObj ={
        "cust_unit_id":custUnitId,
        "receipt_id":receiptId,
        "cust_profile_id":customerId
    }
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get(
      "crm_get_single_receipt",
      documentObj
    );
    dispatch(showSpinner());
    if(responseStatus){
      // console.log("downloadData",data?.pdfUrl);
      window.open(data?.pdfUrl, '_blank');
    }
    dispatch(hideSpinner());
  };


  const downloadReceipt = async (receiptId: string) => {
    let documentObj = {
      cust_unit_id: custUnitId,
      receipt_id: receiptId,
      cust_profile_id: customerId,
    };
  
    const { data, status: responseStatus, message }: any = await Api.get(
      "crm_get_single_receipt",
      documentObj
    );
  
    if (responseStatus) {
      console.log("downloadData", data?.pdfUrl);
      const userToken = userSessionInfo.getJwtToken();
      const customHeaders: any = {
        headers: {
          "client-code": "myhome",
          key: userToken?.key,
        },
      };
      const reqObj = {
        file_url: data?.pdfUrl,
      };
  
      try {
        const res = await axios.post(
          `${MODULES_API_MAP.AUTHENTICATION + GLOBAL_API_ROUTES.DOWNLOAD_DOCUMNETS}`,
          reqObj,
          {
            headers: customHeaders.headers,
            responseType: "blob", // Ensure Axios treats the response as a blob
          }
        );
  
        if (res.data && res.data instanceof Blob) {
          let file_name: any =
            data?.pdfUrl?.split("/").pop() || "downloaded_file.pdf";
          file_name = file_name.includes(".pdf") ? file_name : `${file_name}.pdf`; 
  
          const url = window.URL.createObjectURL(res.data); 
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", file_name); 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          console.error("Unexpected response type, expected a Blob:", res.data);
        }
      } catch (error) {
        console.error("Error downloading the file", error);
      }
    }
  };
  


  const getSingleReceipt = async (receiptId: any) => {
    try {
      dispatch(showSpinner());
      const { data, status: responseStatus }: any = await Api.get("crm_get_single_receipt", {
        cust_unit_id: custUnitId,
        receipt_id: receiptId,
        type: 'View',
        "cust_profile_id": customerId
      });
      if (responseStatus) {
        // console.log("data",data)
        setReceipt(data[0] || {});
      }
      dispatch(hideSpinner());
    } catch (error) {
      // Handle error
      // console.error(error);
      dispatch(hideSpinner());
    }
  };

 

  const handleViewClick = (receiptId: any) => {
    setReceiptId(receiptId);
    setShowModal(true);
    getSingleReceipt(receiptId)
  };
  // console.log("receipt",receiptSheetData)

  return (
    <div className='RecieptsCont'>
      {/* <h3>Receipts</h3> */}
      <RecieptsTab/>
      {/* {receiptData?.map((data:any, index:number) => (
        <div className='tw-relative tw-group' key={data.receipt_id}>
          <div className='tw-flex tw-items-center tw-w-full tw-justify-between tw-mt-3'>
            <div className='tw-flex tw-items-center'>
              <div>
                <img src='/images/pdfIcon.svg' alt='PDF Icon' />
              </div>
              <div className='tw-flex tw-flex-col'>
                <div>Receipt {index + 1}</div>
                <div>{checkForFalsyValues(moment(data.receipt_date).format('DD/MM/YYYY'))}</div>
              </div>
            </div>
            <div className='tw-flex tw-gap-2 tw-opacity-0 group-hover:tw-opacity-100'>
              <Tooltip title={'View Receipts'} arrow placement='top'>
                <button onClick={() => handleViewClick(data.receipt_id)} className='tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125'>
                  <img src='/images/view-icon.svg' alt='View' />
                </button>
              </Tooltip>
              <Tooltip title={'Download'} arrow placement='top'>
                <button onClick={() => downloadReceipt(data.receipt_id)} className='tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125'>
                  <img src='/images/download-icon.svg' alt='Download' />
                </button>
              </Tooltip>
            </div>
          </div>
          
           {
            showModal && receiptSheetData !=null &&
            <ReceiptsSheetData
              showModal={showModal}
              setShowModal={setShowModal}
              custUnitId={cust_unit_id}
              receiptId={receiptId}
              receiptSheetData={receiptSheetData}
            />
           }
        
        </div>
      ))} */}
    </div>
  );
};

export default Reciepts;
