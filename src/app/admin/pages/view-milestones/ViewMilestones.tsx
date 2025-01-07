// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import './ViewMilestones.scss';
// import PdfIcon from '@mui/icons-material/PictureAsPdf';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { useNavigate } from 'react-router-dom';
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
// import description_icon from './../../../../assets/Images/DescriptionIcon.png';

// import {
//   Step,
//   StepLabel,
//   Typography,
//   Button,
//   Stepper
// } from '@mui/material';
// import { useParams } from 'react-router-dom';

// function ViewMilestones() {
//     const navigate = useNavigate();
//     const { customerId } = useParams();
//   const {custUnitId}= useParams();
//   const steps: string[] = [
//     'On Booking',
//     'With in 30 days from the date of booking',
//     'After casting of 12th floor slab ',
//     'After casting of 25th floor slab',
//     'After casting of 37th floor slab',
//     'After completion of screeding & putty of the respective unit',
//     'After completion of flooring doors & windows of the respective unit',
//     'All the time of Registration/ Handover / Intimation of Completion(whichever is earlier)'
//   ];

//   const getContent = (stepIndex: number): JSX.Element => {
//     switch (stepIndex) {
//       case 0:
//         return (
//           <div className='tw-ml-5'>
//             <div className='tw-flex tw-justify-between tw-mt-3'>
//               <div>
//                 <p className='lite'>Percentage/ Value</p>
//                 <p className='tw-font-bold tw-text-black'>5%</p>
//               </div>
//               <div>
//                 <p className='lite'>Basic Amount(Pay TDS @1% on basic amount)</p>
//                 <p className='tw-font-bold tw-text-black'> 25,00,000</p>
//               </div>
//               <div  className='tw-mr-10'>
//                 <p className='lite'>GST@5% </p>
//                 <p className='tw-font-bold tw-text-black'>55,000</p>
//               </div>
//             </div>
//             <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//               <div>
//                 <p className='lite'>Total Payable (Excluding TDS) </p>
//                 <p className='tw-font-bold tw-text-black'>65,25,000</p>
//               </div>
//               <div className='invoice_status'>
//                 <p className='lite'>Invoice status</p>
//                 <p className='raised'>Raised</p>
//               </div>
//               <div className='tw-mr-5'>
//                 <p className='lite'>Due date</p>
//                 <p className='tw-font-bold tw-text-black'>12/04/2024</p>
//               </div>
//             </div>
//           </div>
//         );
//       case 1:
//         return (
//           <div className='tw-ml-5'>
//             <div className='tw-flex tw-justify-between tw-mt-3'>
//               <div>
//                 <p className='lite'>Percentage/ Value</p>
//                 <p className='tw-font-bold tw-text-black'>25%</p>
//               </div>
//               <div>
//                 <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//                 <p className='tw-font-bold tw-text-black'> 25,00,000</p>
//               </div>
//               <div  className='tw-mr-10'>
//                 <p className='lite'>GST@5% </p>
//                 <p className='tw-font-bold tw-text-black'>1,25,000</p>
//               </div>
//             </div>
//             <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//               <div>
//                 <p className='lite'>Total Payable (Excluding TDS) </p>
//                 <p className='tw-font-bold tw-text-black'>5,25,000</p>
//               </div>
//               <div  className='invoice_status'>
//                 <p className='lite'>Invoice status </p>
//                 <p className='raised'>Raised</p>
//               </div>
//               <div  className='tw-mr-5'>
//                 <p className='lite'>Due date</p>
//                 <p className='tw-font-bold tw-text-black'>12/04/2024</p>
//               </div>
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className='tw-ml-5'>
//             <div className='tw-flex tw-justify-between tw-mt-3'>
//               <div>
//                 <p className='lite'>Percentage/ Value</p>
//                 <p className='tw-font-bold tw-text-black'>10%</p>
//               </div>
//               <div>
//                 <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//                 <p className='tw-font-bold tw-text-black'> 10,00,000</p>
//               </div>
//               <div  className='tw-mr-10'>
//                 <p className='lite'>GST@5% </p>
//                 <p className='tw-font-bold tw-text-black'>25,000</p>
//               </div>
//             </div>
//             <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//               <div>
//                 <p className='lite'>Total Payable (Excluding TDS) </p>
//                 <p className='tw-font-bold tw-text-black'>25,25,000</p>
//               </div>
//               <div  className='invoice_status'>
//                 <p className='lite'>Invoice status </p>
//                 <p className='raised'>Raised</p>
//               </div>
//               <div  className='tw-mr-5'>
//                 <p className='lite'>Due date</p>
//                 <p className='tw-font-bold tw-text-black'>12/04/2024</p>
//               </div>
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className='tw-ml-5 '>
//             <div className='tw-flex tw-justify-between tw-mt-3'>
//               <div>
//                 <p className='lite'>Percentage/ Value</p>
//                 <p className='tw-font-bold tw-text-black'>10%</p>
//               </div>
//               <div>
//                 <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//                 <p className='tw-font-bold tw-text-black'> 10,00,000</p>
//               </div>
//               <div  className='tw-mr-10'>
//                 <p className='lite'>GST@5% </p>
//                 <p className='tw-font-bold tw-text-black'>50,000</p>
//               </div>
//             </div>
//             <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//               <div>
//                 <p className='lite'>Total Payable (Excluding TDS) </p>
//                 <p className='tw-font-bold tw-text-black'>35,25,000</p>
//               </div>
//               <div  className='invoice_status tw-mr-10'>
//                 <p className='lite'>Invoice status </p>
//                 <p className='upcoming'>Upcoming</p>
//               </div>
//               <div>

//               </div>
//             </div>
//           </div>
//         );
//       case 4:
//         return (
//           <div className='tw-ml-5'>
//             <div className='tw-flex tw-justify-between tw-mt-3'>
//               <div>
//                 <p className='lite'>Percentage/ Value</p>
//                 <p className='tw-font-bold tw-text-black'>10%</p>
//               </div>
//               <div>
//                 <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//                 <p className='tw-font-bold tw-text-black'> 15,00,000</p>
//               </div>
//               <div  className='tw-mr-10'>
//                 <p className='lite'>GST@5% </p>
//                 <p className='tw-font-bold tw-text-black'>50,000</p>
//               </div>
//             </div>
//             <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//               <div>
//                 <p className='lite'>Total Payable (Excluding TDS) </p>
//                 <p className='tw-font-bold tw-text-black'>45,25,000</p>
//               </div>
//               <div  className='invoice_status'>
//                 <p className='lite'>Invoice status </p>
//                 <p className='tw-font-bold tw-text-black'>Not Raised</p>
//               </div>
//               <div>
//               </div>
//             </div>
//           </div>
//         );
//       case 5:
//         return (
//           <div className='tw-ml-5'>
//             <div className='tw-flex tw-justify-between tw-mt-3'>
//               <div>
//                 <p className='lite'>Percentage/ Value</p>
//                 <p className='tw-font-bold tw-text-black'>10%</p>
//               </div>
//               <div>
//                 <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//                 <p className='tw-font-bold tw-text-black'> 15,00,000</p>
//               </div>
//               <div  className='tw-mr-10'>
//                 <p className='lite'>GST@5% </p>
//                 <p className='tw-font-bold tw-text-black'>50,000</p>
//               </div>
//             </div>
//             <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//               <div>
//                 <p className='lite'>Total Payable (Excluding TDS) </p>
//                 <p className='tw-font-bold tw-text-black'>45,25,000</p>
//               </div>
//               <div  className='invoice_status'>
//                 <p className='lite'>Invoice status </p>
//                 <p className='tw-font-bold tw-text-black'>Not Raised</p>
//               </div>
//               <div>
//               </div>
//             </div>
//           </div>
//         );
//       case 6:
//         return (
//           <div className='tw-ml-5'>
//             <div className='tw-flex tw-justify-between tw-mt-3'>
//               <div>
//                 <p className='lite'>Percentage/ Value</p>
//                 <p className='tw-font-bold tw-text-black'>10%</p>
//               </div>
//               <div>
//                 <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//                 <p className='tw-font-bold tw-text-black'> 15,00,000</p>
//               </div>
//               <div  className='tw-mr-10'>
//                 <p className='lite'>GST@5% </p>
//                 <p className='tw-font-bold tw-text-black'>50,000</p>
//               </div>
//             </div>
//             <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//               <div>
//                 <p className='lite'>Total Payable (Excluding TDS) </p>
//                 <p className='tw-font-bold tw-text-black'>45,25,000</p>
//               </div>
//               <div  className='invoice_status'>
//                 <p className='lite'>Invoice status </p>
//                 <p className='tw-font-bold tw-text-black'>Not Raised</p>
//               </div>
//               <div>
//               </div>
//             </div>
//           </div>
//         );
//       case 7:
//         return (
//           <div className='tw-ml-5'>
//             <div className='tw-flex tw-justify-between tw-mt-3'>
//               <div>
//                 <p className='lite'>Percentage/ Value</p>
//                 <p className='tw-font-bold tw-text-black'>10%</p>
//               </div>
//               <div>
//                 <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//                 <p className='tw-font-bold tw-text-black'> 15,00,000</p>
//               </div>
//               <div  className='tw-mr-10'>
//                 <p className='lite'>GST@5% </p>
//                 <p className='tw-font-bold tw-text-black'>50,000</p>
//               </div>
//             </div>
//             <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//               <div>
//                 <p className='lite'>Total Payable (Excluding TDS) </p>
//                 <p className='tw-font-bold tw-text-black'>45,25,000</p>
//               </div>
//               <div  className='invoice_status'>
//                 <p className='lite'>Invoice status </p>
//                 <p className='tw-font-bold tw-text-black'>Not Raised</p>
//               </div>
//               <div>
//               </div>
//             </div>
//           </div>
//         );
//       default:
//         return <Typography>Step Content Not Found</Typography>;
//     }
//   };
//   const  handleButtonClick = (name:string) =>{
//     switch(name){
//       case "Payment_Proofs":
//        return navigate(`/crm/paymentproofs/${customerId}/${custUnitId}`);
//         case "payment_recipt":
//          return  navigate("/crm/paymentproofs");
//           case "tds":
//             return navigate(`/crm/tdsdetails/${customerId}/${custUnitId}`);
//             default:navigate("/crm/paymentproofs");
//     }

//   }

//   const handleBackToGrid = () => {
//     navigate('/crm/managecustomer');
//   };

//   return (
//     <div>

//       <Box sx={{ flexGrow: 1 }}>
//               <div>
//                     <div> <div className='tw-flex tw-justify-between  tw-mt-7'>
//                       <p className='tw-font-bold tw-text-black'>Payment milestones</p>
//                       <div className='tw-flex tw-justify-end tw-gap-2 tw-mr-7 tw-mb-5 '>
//                         <Button variant="outlined" sx={{ color: 'black', borderColor: '#3C4049', fontWeight: 'bold', borderRadius: '0.5rem'}} onClick={() => handleButtonClick("Payment_Proofs")} className='text_transform' >
//                           Payment Proofs
//                         </Button>
//                         <Button variant="outlined" sx={{ color: 'black', borderColor: '#3C4049', fontWeight:'bold',borderRadius : '0.5rem'}} onClick={() => handleButtonClick("payment_recipt")} className='text_transform'>
//                           Payment receipts
//                         </Button>
//                         <Button variant="outlined" sx={{ color: 'black', borderColor: '#3C4049', fontWeight: 'bold' ,borderRadius : '0.5rem'}} onClick={() => handleButtonClick("tds")} className='text_transform'>
//                           View tds details
//                         </Button>
//                       </div>
//                     </div>
//                       <Stepper orientation="vertical" >
//                         {steps.map((label, index) => (
//                           label === "After casting of 25th floor slab" ?
//                           <Step key={label} sx={{border: '2px solid #EB9F0C', borderRadius: '10px',marginRight : '1.5rem'}}>
//                             <div className='tw-flex tw-justify-between '>
//                               <div >{index !== 2 ? <StepLabel><p className='stepstyle'>{label}</p></StepLabel> : <StepLabel><p className='stepstyle'>{label}</p>
//                               <p>Payment Over due by <span style={{color:'red', fontWeight:'bold'}}>7 Days</span></p></StepLabel>}</div>
//                               {index != 3 ?
//                             <div className='tw-flex tw-justify-between tw-items-center '>
//                             <Button sx={{ color: 'black', borderColor: 'black' }}>
//                               <img src={description_icon} alt="PDF Icon" style={{ width: 23.93, height: 32 }} /> <span className='text_transform'>View Invoice</span>
//                             </Button>
//                             <div> <MoreVertIcon /></div>
//                           </div> :   <div className='tw-flex tw-justify-between tw-items-center'>
//                             <Button sx={{ color: 'black', borderColor: 'black' }}>
//                               <NotificationsNoneIcon />Send Reminder
//                             </Button>
//                             <div> <MoreVertIcon /></div>
//                           </div>
//                             }
//                             </div>
//                             {getContent(index)}
//                           </Step> : <Step  style={{border: '1px solid #DFE1E7', borderRadius: '10px',marginRight: '1.5rem' }} key={label}>
//                             <div className='tw-flex tw-justify-between '>
//                               <div >{index !== 2 ? <StepLabel><p className='stepstyle'>{label}</p></StepLabel> : <StepLabel><p className='stepstyle'>{label}</p>
//                               <p>Payment Over due by <span style={{color:'red', fontWeight:'bold'}}>7 Days</span></p></StepLabel>}</div>
//                               {index != 3 ?
//                             <div className='tw-flex tw-justify-between tw-items-center '>
//                             <Button sx={{ color: 'black', borderColor: 'black' }}>
//                             <img src={description_icon} alt="PDF Icon" style={{ width: 23.93, height: 25, marginRight: '1rem'}} />  <span className='text_transform'>View Invoice</span>
//                             </Button>
//                             <div> <MoreVertIcon /></div>
//                           </div> :   <div className='tw-flex tw-justify-between tw-items-center'>
//                             <Button sx={{ color: 'black', borderColor: 'black' }}>
//                               <NotificationsNoneIcon />Send Reminder
//                             </Button>
//                             <div> <MoreVertIcon /></div>
//                           </div>
//                             }
//                             </div>
//                             {getContent(index)}
//                           </Step>
//                         ))}
//                       </Stepper></div>

//               </div>

//       </Box>

//     </div>
//   );
// }

// export default ViewMilestones;

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import "./ViewMilestones.scss";
import PdfIcon from "@mui/icons-material/PictureAsPdf";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import description_icon from "./../../../../assets/Images/DescriptionIcon.png";

import { Step, StepLabel, Typography, Button, Stepper } from "@mui/material";
import { useParams } from "react-router-dom";
import PaymentCard from "@Components/payment-card/PaymentCard";
import { Ipayment } from "@Constants/global-interfaces";

import { IAPIResponse } from "@Src/types/api-response-interface";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import Api from "../../api/Api";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { useAppDispatch } from "@Src/app/hooks";
import PaymentMilestone from "../../pages/view-milestones/PaymentMilestone";
import Receipts from "../../pages/receipts/Receipts";
import { AnyAaaaRecord } from "dns";




function ViewMilestones(props:{currentTab:any,receiptsStatus:any,setReceiptsStatus:any}) {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [paymentsData, setPaymentsData] = useState<Ipayment[]>([]);
  const [totalPaymentsData, setTotalPaymentsData] = useState<any>();
  const [unitId, setUnitId] = useState("");
  const dispatch = useAppDispatch();

  const getPayment = async () => {
    try {
      const {
        data,
        status: responseStatus,
        message,
      }: any = await Api.get("crm_milestones_tab_view", {
        cust_unit_id: custUnitId,
        cust_profile_id: customerId,
      });
      dispatch(showSpinner());
      if (responseStatus) {
        setPaymentsData(data?.resultData?.[0]?.unit_milestones);
        setUnitId(data?.resultData[0]?.unit_id);
        setTotalPaymentsData({
          sum_of_milestone_amount:
            data?.resultData?.[0]?.sum_of_milestone_amount,
          sum_of_gst_amount: data?.resultData?.[0]?.sum_of_gst_amount,
          sum_of_tds_amount: data?.resultData?.[0]?.sum_of_tds_amount,
          sum_of_total_payable_tds_amount:
            data?.resultData?.[0]?.sum_of_total_payable_tds_amount,
          sum_of_percentages: data?.resultData?.[0]?.sum_of_percentages,
        });
      }
      dispatch(hideSpinner());
    } catch (error) {}
  };

  const { custUnitId } = useParams();
//const [receiptsStatus , setReceiptsStatus] = useState(false)
  const handleButtonClick = (name: string) => {
    switch (name) {
      case "Payment_Proofs":
        return navigate(`/crm/paymentproofs/${customerId}/${custUnitId}`);
      case "Receipts":
        props.setReceiptsStatus(true); 
        return
      case "tds":
        return navigate(`/crm/tdsdetails/${customerId}/${custUnitId}`);
      default:
        navigate("/crm/paymentproofs");
    }
  };

  const handleBackToGrid = () => {
    navigate("/crm/managecustomer");
  };


  useEffect(() => {
    getPayment();
  }, []);
  return (
    <div>
      <div className="tw-flex tw-justify-between  tw-mt-7">
        <p className="tw-font-bold tw-text-black tw-ml-3">Payment milestones</p>
        <div className="tw-flex tw-justify-end tw-gap-2 tw-mr-7 tw-mb-5 ">
          <Button
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "#3C4049",
              fontWeight: "bold",
              borderRadius: "0.5rem",
            }}
            onClick={() => handleButtonClick("Payment_Proofs")}
            className="text_transform tw-text-sm"
          >
            Payment Proofs
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "#3C4049",
              fontWeight: "bold",
              borderRadius: "0.5rem",
            }}
            onClick={() => handleButtonClick("Receipts")}
            className="text_transform tw-text-sm"
          >
            Payment receipts
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "#3C4049",
              fontWeight: "bold",
              borderRadius: "0.5rem",
            }}
            onClick={() => handleButtonClick("tds")}
            className="text_transform tw-text-sm"
          >
            View TDS details
          </Button>
        </div>
      </div>

      {paymentsData?.length > 0 && !props?.receiptsStatus && (
        <PaymentCard
          paymentsData={paymentsData}
          unitId={unitId}
          custUnitId={custUnitId}
          totalPaymentsData={totalPaymentsData}
        />
      )}
      {
        props?.receiptsStatus && (
          <div>
            <Receipts/>
          </div>
        )
      }
    </div>
  );
}

export default ViewMilestones;

// const steps: string[] = [
//   'On Booking',
//   'With in 30 days from the date of booking',
//   'After casting of 12th floor slab ',
//   'After casting of 25th floor slab',
//   'After casting of 37th floor slab',
//   'After completion of screeding & putty of the respective unit',
//   'After completion of flooring doors & windows of the respective unit',
//   'All the time of Registration/ Handover / Intimation of Completion(whichever is earlier)'
// ];

// const getContent = (stepIndex: number): JSX.Element => {
//   switch (stepIndex) {
//     case 0:
//       return (
//         <div className='tw-ml-5'>
//           <div className='tw-flex tw-justify-between tw-mt-3'>
//             <div>
//               <p className='lite'>Percentage/ Value</p>
//               <p className='tw-font-bold tw-text-black'>5%</p>
//             </div>
//             <div>
//               <p className='lite'>Basic Amount(Pay TDS @1% on basic amount)</p>
//               <p className='tw-font-bold tw-text-black'> 25,00,000</p>
//             </div>
//             <div  className='tw-mr-10'>
//               <p className='lite'>GST@5% </p>
//               <p className='tw-font-bold tw-text-black'>55,000</p>
//             </div>
//           </div>
//           <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//             <div>
//               <p className='lite'>Total Payable (Excluding TDS) </p>
//               <p className='tw-font-bold tw-text-black'>65,25,000</p>
//             </div>
//             <div className='invoice_status'>
//               <p className='lite'>Invoice status</p>
//               <p className='raised'>Raised</p>
//             </div>
//             <div className='tw-mr-5'>
//               <p className='lite'>Due date</p>
//               <p className='tw-font-bold tw-text-black'>12/04/2024</p>
//             </div>
//           </div>
//         </div>
//       );
//     case 1:
//       return (
//         <div className='tw-ml-5'>
//           <div className='tw-flex tw-justify-between tw-mt-3'>
//             <div>
//               <p className='lite'>Percentage/ Value</p>
//               <p className='tw-font-bold tw-text-black'>25%</p>
//             </div>
//             <div>
//               <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//               <p className='tw-font-bold tw-text-black'> 25,00,000</p>
//             </div>
//             <div  className='tw-mr-10'>
//               <p className='lite'>GST@5% </p>
//               <p className='tw-font-bold tw-text-black'>1,25,000</p>
//             </div>
//           </div>
//           <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//             <div>
//               <p className='lite'>Total Payable (Excluding TDS) </p>
//               <p className='tw-font-bold tw-text-black'>5,25,000</p>
//             </div>
//             <div  className='invoice_status'>
//               <p className='lite'>Invoice status </p>
//               <p className='raised'>Raised</p>
//             </div>
//             <div  className='tw-mr-5'>
//               <p className='lite'>Due date</p>
//               <p className='tw-font-bold tw-text-black'>12/04/2024</p>
//             </div>
//           </div>
//         </div>
//       );
//     case 2:
//       return (
//         <div className='tw-ml-5'>
//           <div className='tw-flex tw-justify-between tw-mt-3'>
//             <div>
//               <p className='lite'>Percentage/ Value</p>
//               <p className='tw-font-bold tw-text-black'>10%</p>
//             </div>
//             <div>
//               <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//               <p className='tw-font-bold tw-text-black'> 10,00,000</p>
//             </div>
//             <div  className='tw-mr-10'>
//               <p className='lite'>GST@5% </p>
//               <p className='tw-font-bold tw-text-black'>25,000</p>
//             </div>
//           </div>
//           <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//             <div>
//               <p className='lite'>Total Payable (Excluding TDS) </p>
//               <p className='tw-font-bold tw-text-black'>25,25,000</p>
//             </div>
//             <div  className='invoice_status'>
//               <p className='lite'>Invoice status </p>
//               <p className='raised'>Raised</p>
//             </div>
//             <div  className='tw-mr-5'>
//               <p className='lite'>Due date</p>
//               <p className='tw-font-bold tw-text-black'>12/04/2024</p>
//             </div>
//           </div>
//         </div>
//       );
//     case 3:
//       return (
//         <div className='tw-ml-5 '>
//           <div className='tw-flex tw-justify-between tw-mt-3'>
//             <div>
//               <p className='lite'>Percentage/ Value</p>
//               <p className='tw-font-bold tw-text-black'>10%</p>
//             </div>
//             <div>
//               <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//               <p className='tw-font-bold tw-text-black'> 10,00,000</p>
//             </div>
//             <div  className='tw-mr-10'>
//               <p className='lite'>GST@5% </p>
//               <p className='tw-font-bold tw-text-black'>50,000</p>
//             </div>
//           </div>
//           <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//             <div>
//               <p className='lite'>Total Payable (Excluding TDS) </p>
//               <p className='tw-font-bold tw-text-black'>35,25,000</p>
//             </div>
//             <div  className='invoice_status tw-mr-10'>
//               <p className='lite'>Invoice status </p>
//               <p className='upcoming'>Upcoming</p>
//             </div>
//             <div>

//             </div>
//           </div>
//         </div>
//       );
//     case 4:
//       return (
//         <div className='tw-ml-5'>
//           <div className='tw-flex tw-justify-between tw-mt-3'>
//             <div>
//               <p className='lite'>Percentage/ Value</p>
//               <p className='tw-font-bold tw-text-black'>10%</p>
//             </div>
//             <div>
//               <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//               <p className='tw-font-bold tw-text-black'> 15,00,000</p>
//             </div>
//             <div  className='tw-mr-10'>
//               <p className='lite'>GST@5% </p>
//               <p className='tw-font-bold tw-text-black'>50,000</p>
//             </div>
//           </div>
//           <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//             <div>
//               <p className='lite'>Total Payable (Excluding TDS) </p>
//               <p className='tw-font-bold tw-text-black'>45,25,000</p>
//             </div>
//             <div  className='invoice_status'>
//               <p className='lite'>Invoice status </p>
//               <p className='tw-font-bold tw-text-black'>Not Raised</p>
//             </div>
//             <div>
//             </div>
//           </div>
//         </div>
//       );
//     case 5:
//       return (
//         <div className='tw-ml-5'>
//           <div className='tw-flex tw-justify-between tw-mt-3'>
//             <div>
//               <p className='lite'>Percentage/ Value</p>
//               <p className='tw-font-bold tw-text-black'>10%</p>
//             </div>
//             <div>
//               <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//               <p className='tw-font-bold tw-text-black'> 15,00,000</p>
//             </div>
//             <div  className='tw-mr-10'>
//               <p className='lite'>GST@5% </p>
//               <p className='tw-font-bold tw-text-black'>50,000</p>
//             </div>
//           </div>
//           <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//             <div>
//               <p className='lite'>Total Payable (Excluding TDS) </p>
//               <p className='tw-font-bold tw-text-black'>45,25,000</p>
//             </div>
//             <div  className='invoice_status'>
//               <p className='lite'>Invoice status </p>
//               <p className='tw-font-bold tw-text-black'>Not Raised</p>
//             </div>
//             <div>
//             </div>
//           </div>
//         </div>
//       );
//     case 6:
//       return (
//         <div className='tw-ml-5'>
//           <div className='tw-flex tw-justify-between tw-mt-3'>
//             <div>
//               <p className='lite'>Percentage/ Value</p>
//               <p className='tw-font-bold tw-text-black'>10%</p>
//             </div>
//             <div>
//               <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//               <p className='tw-font-bold tw-text-black'> 15,00,000</p>
//             </div>
//             <div  className='tw-mr-10'>
//               <p className='lite'>GST@5% </p>
//               <p className='tw-font-bold tw-text-black'>50,000</p>
//             </div>
//           </div>
//           <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//             <div>
//               <p className='lite'>Total Payable (Excluding TDS) </p>
//               <p className='tw-font-bold tw-text-black'>45,25,000</p>
//             </div>
//             <div  className='invoice_status'>
//               <p className='lite'>Invoice status </p>
//               <p className='tw-font-bold tw-text-black'>Not Raised</p>
//             </div>
//             <div>
//             </div>
//           </div>
//         </div>
//       );
//     case 7:
//       return (
//         <div className='tw-ml-5'>
//           <div className='tw-flex tw-justify-between tw-mt-3'>
//             <div>
//               <p className='lite'>Percentage/ Value</p>
//               <p className='tw-font-bold tw-text-black'>10%</p>
//             </div>
//             <div>
//               <p className='lite'>Basic Amount (Pay TDS @1% on basic amount)</p>
//               <p className='tw-font-bold tw-text-black'> 15,00,000</p>
//             </div>
//             <div  className='tw-mr-10'>
//               <p className='lite'>GST@5% </p>
//               <p className='tw-font-bold tw-text-black'>50,000</p>
//             </div>
//           </div>
//           <div className='tw-flex tw-justify-between tw-mb-5 tw-mt-8'>
//             <div>
//               <p className='lite'>Total Payable (Excluding TDS) </p>
//               <p className='tw-font-bold tw-text-black'>45,25,000</p>
//             </div>
//             <div  className='invoice_status'>
//               <p className='lite'>Invoice status </p>
//               <p className='tw-font-bold tw-text-black'>Not Raised</p>
//             </div>
//             <div>
//             </div>
//           </div>
//         </div>
//       );
//     default:
//       return <Typography>Step Content Not Found</Typography>;
//   }
// };

{
  /* <Box sx={{ flexGrow: 1 }}> 
              <div>
                    <div> <div className='tw-flex tw-justify-between  tw-mt-7'>
                      <p className='tw-font-bold tw-text-black'>Payment milestones</p>
                      <div className='tw-flex tw-justify-end tw-gap-2 tw-mr-7 tw-mb-5 '>
                        <Button variant="outlined" sx={{ color: 'black', borderColor: '#3C4049', fontWeight: 'bold', borderRadius: '0.5rem'}} onClick={() => handleButtonClick("Payment_Proofs")} className='text_transform' >
                          Payment Proofs
                        </Button>
                        <Button variant="outlined" sx={{ color: 'black', borderColor: '#3C4049', fontWeight:'bold',borderRadius : '0.5rem'}} onClick={() => handleButtonClick("payment_recipt")} className='text_transform'>
                          Payment receipts
                        </Button>
                        <Button variant="outlined" sx={{ color: 'black', borderColor: '#3C4049', fontWeight: 'bold' ,borderRadius : '0.5rem'}} onClick={() => handleButtonClick("tds")} className='text_transform'>
                          View tds details
                        </Button>
                      </div>
                    </div>
                      <Stepper orientation="vertical" >
                        {steps.map((label, index) => (
                          label === "After casting of 25th floor slab" ?
                          <Step key={label} sx={{border: '2px solid #EB9F0C', borderRadius: '10px',marginRight : '1.5rem'}}>
                            <div className='tw-flex tw-justify-between '>
                              <div >{index !== 2 ? <StepLabel><p className='stepstyle'>{label}</p></StepLabel> : <StepLabel><p className='stepstyle'>{label}</p>
                              <p>Payment Over due by <span style={{color:'red', fontWeight:'bold'}}>7 Days</span></p></StepLabel>}</div>
                              {index != 3 ? 
                            <div className='tw-flex tw-justify-between tw-items-center '>
                            <Button sx={{ color: 'black', borderColor: 'black' }}>
                              <img src={description_icon} alt="PDF Icon" style={{ width: 23.93, height: 32 }} /> <span className='text_transform'>View Invoice</span>
                            </Button>
                            <div> <MoreVertIcon /></div>
                          </div> :   <div className='tw-flex tw-justify-between tw-items-center'>
                            <Button sx={{ color: 'black', borderColor: 'black' }}>
                              <NotificationsNoneIcon />Send Reminder
                            </Button>
                            <div> <MoreVertIcon /></div>
                          </div>
                            }
                            </div>
                            {getContent(index)}
                          </Step> : <Step  style={{border: '1px solid #DFE1E7', borderRadius: '10px',marginRight: '1.5rem' }} key={label}>
                            <div className='tw-flex tw-justify-between '>
                              <div >{index !== 2 ? <StepLabel><p className='stepstyle'>{label}</p></StepLabel> : <StepLabel><p className='stepstyle'>{label}</p>
                              <p>Payment Over due by <span style={{color:'red', fontWeight:'bold'}}>7 Days</span></p></StepLabel>}</div>
                              {index != 3 ? 
                            <div className='tw-flex tw-justify-between tw-items-center '>
                            <Button sx={{ color: 'black', borderColor: 'black' }}>
                            <img src={description_icon} alt="PDF Icon" style={{ width: 23.93, height: 25, marginRight: '1rem'}} />  <span className='text_transform'>View Invoice</span>
                            </Button>
                            <div> <MoreVertIcon /></div>
                          </div> :   <div className='tw-flex tw-justify-between tw-items-center'>
                            <Button sx={{ color: 'black', borderColor: 'black' }}>
                              <NotificationsNoneIcon />Send Reminder
                            </Button>
                            <div> <MoreVertIcon /></div>
                          </div>
                            }
                            </div>
                            {getContent(index)}
                          </Step>
                        ))}
                      </Stepper></div>
                

              </div> 
           
      </Box> */
}
