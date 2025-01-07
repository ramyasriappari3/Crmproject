
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled, Tooltip } from '@mui/material';
import { formatNumberToIndianSystem,checkForFalsyValues,formatTimeDifference } from '@Src/utils/globalUtilities';
import './PaymentMilestone.scss';
import { IAPIResponse } from '@Src/types/api-response-interface'
import { MODULES_API_MAP, httpService } from '@Src/services/httpService'
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes'
import moment from 'moment';
import InvoiceData from '@Components/invoice-sheet/InvoiceSheet';
import { toast } from 'react-toastify';
import {getConfigData} from '@Src/config/config';
import AdminInvoice from '../../pages/admin-invoice/AdminInvoice'
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { useAppDispatch } from "@Src/app/hooks";
import Api from "../../api/Api";
 
const PaymentMilestone = (props: { paymentsData: any, unitId: any, custUnitId: any, totalPaymentsData: any }) => {
    const [showModal, setShowModal] = useState(false);
    const [paymentMilestoneId, setPaymentMilestoneId] = useState<any>();
    const [milestoneDescription, setMilestoneDescription] = useState<any>();
    const dispatch = useAppDispatch();
 
    const StyledTableCell = styled(TableCell)(({ theme: any }) => ({
        fontFamily:'Inter',
        fontSize: '14px',
        fontWeight: 'normal',
        color: 'black',
        padding: '8px',
        verticalAlign: 'top',
        // border: '1px solid rgba(224, 224, 224)',
        textAlign:'right'
    }));
 
    const downloadInvoice = async (milestoneId: any) => {
        try {
            dispatch(showSpinner())
            const {
                data,
                status: responseStatus,
                message,
              }: any = await Api.get("crm_invoices", {
                cust_unit_id: props.custUnitId,
                unit_id:props.unitId,
                milestone_id:milestoneId,
                type:'download'
              });
              if(responseStatus){
                const fileUrl = data?.pdfUrl;
                window.open(fileUrl, '_blank');
              }
              dispatch(hideSpinner())
        } catch (error) {
            toast.error('Unable To Download File, please try after sometime');
        }
    };
 
    const handleViewClick = (milestoneId: any) => {
        setPaymentMilestoneId(milestoneId);
        setShowModal(true);
    };
 
    let gstPercentage = Number(props?.paymentsData?.[0]?.gst_percentage) * 100;
    let firstMilestonePercentage = parseFloat(props?.paymentsData?.find((data: any) => data?.milestone_sequence === 1)?.applied_milestone_percentage);
    let secondMilestonePercentage = parseFloat(props?.paymentsData?.find((data: any) => data?.milestone_sequence === 2)?.applied_milestone_percentage);
    let combinedMilestonePercentage = ((firstMilestonePercentage + secondMilestonePercentage) * 100)?.toFixed(0);
    return (
        <div>
             <TableContainer
                component={Paper}
                elevation={3}
                variant="elevation"
                className="tw-mt-4 transition duration-300 ease-in-out transform hover:scale-105"
            >
                <div className="tw-m-2 tw-flex tw-flex-row tw-justify-start tw-items-center tw-gap-2">
                    <h1 className='tw-font-bold tw-text-lg'>Payment Details</h1>
                    {milestoneDescription && (
                        <h3 className=" tw-text-[#FF0006] tw-font-semibold">
                            {milestoneDescription}
                        </h3>
                    )}
                </div>

                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell className='!tw-font-bold !tw-text-center'>S.No.</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold !tw-text-center'>Milestone Percentage</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold !tw-text-center'>Milestone Amount</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold !tw-text-center'>GST <br /> Amount <br /> @ {gstPercentage} %</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold !tw-text-center'>TDS <br />Amount</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold !tw-text-center'>Total Payable Amount less TDS</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold !tw-text-center'>Invoice Status</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold !tw-text-center'>Payment Due Date</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold !tw-text-center'>User Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props?.paymentsData
                            ?.sort((a: any, b: any) => a.milestone_sequence - b.milestone_sequence)
                            .map((payment: any, index: any) => {
                                let color = '';
                                let paymentDueDateStatus = payment?.payment_due_date;
                                const dueMoment = moment(paymentDueDateStatus);
                                let currentDate = moment();
                                const differenceInDays = currentDate.diff(dueMoment, 'days');
                                const isOverdue = currentDate > dueMoment;
                                let milestoneStatus = payment?.milestone_status?.charAt(0)?.toUpperCase()?.concat(payment?.milestone_status?.slice(1));
                                if (payment?.milestone_status === 'raised') {
                                    color = 'invoice-Raised';
                                    milestoneStatus = 'Raised';
                                } else if (payment?.milestone_status === 'upcoming') {
                                    color = 'invoice-Upcoming';
                                } else if (payment?.milestone_status === 'future') {
                                    color = 'invoice-Future';
                                }

                                const tooltipTitle = isOverdue ? `OverDue By ${checkForFalsyValues(formatTimeDifference(differenceInDays))}` : '';
                                const paymentDueDate = payment?.payment_due_date
                                    ? moment(payment.payment_due_date).format('DD/MM/YYYY')
                                    : '';
                                return (
                                    <TableRow
                                        key={payment?.milestone_id}
                                        onMouseEnter={() => setMilestoneDescription(payment?.milestone_description)}
                                        onMouseLeave={() => setMilestoneDescription(null)}
                                        // className={`${payment?.invoice_payment_due_status === 'closed' ? '!tw-bg-blue-50' : ''} tw-transition tw-duration-300 tw-ease-in-out tw-transform`}
                                        className='tw-transition tw-duration-300 tw-ease-in-out tw-transform'
                                    >
                                        <StyledTableCell className='!tw-text-center'>{payment?.milestone_sequence}</StyledTableCell>
                                        {payment?.milestone_sequence === 1 && (
                                            <StyledTableCell rowSpan={2} className='!tw-align-middle !tw-text-center !tw-border'>{combinedMilestonePercentage}%</StyledTableCell>
                                        )}
                                        {payment?.milestone_sequence !== 1 && payment?.milestone_sequence !== 2 && (
                                            <StyledTableCell className='!tw-text-center'>{Number(payment?.applied_milestone_percentage) * 100 || 0}%</StyledTableCell>
                                        )}
                                        <StyledTableCell>₹{formatNumberToIndianSystem(payment?.milestone_amount)}</StyledTableCell>
                                        <StyledTableCell>₹{formatNumberToIndianSystem(payment?.gst_amount)}</StyledTableCell>
                                        <StyledTableCell>₹{formatNumberToIndianSystem(payment?.tds_amount)}</StyledTableCell>
                                        <StyledTableCell>₹{formatNumberToIndianSystem(payment?.total_payable_amount_less_tds)}</StyledTableCell>
                                        <StyledTableCell className='!tw-text-center'><span className={color}>{milestoneStatus}</span></StyledTableCell>
                                        <StyledTableCell>
                                            {
                                                payment?.milestone_status === 'raised' &&
                                                <div>
                                                    {
                                                        payment?.invoice_payment_due_status !== 'closed' ? (
                                                            <Tooltip title={tooltipTitle} arrow placement='top' classes={{ tooltip: 'custom-tooltip-color' }}>
                                                                <span>
                                                                    {paymentDueDate}
                                                                </span>
                                                            </Tooltip>
                                                        ) : (
                                                            <span>
                                                                {paymentDueDate}
                                                            </span>
                                                        )
                                                    }
                                                </div>
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {payment?.milestone_status === 'raised' &&
                                                <div className="tw-flex tw-justify-evenly tw-gap-2">
                                                    <Tooltip title={'View Invoice'} arrow placement='top'
                                                        classes={{ tooltip: 'custom-tooltip-color' }}>
                                                        <button onClick={() => handleViewClick(payment?.milestone_id)} className="tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125">
                                                            <img src="/images/view-icon.svg" alt="View" />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title={'Download'} arrow placement='top'
                                                        classes={{ tooltip: 'custom-tooltip-color' }}>
                                                        <button onClick={() => downloadInvoice(payment?.milestone_id)} className="tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125">
                                                            <img src="/images/download-icon.svg" alt="Download" />
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            }
                                        </StyledTableCell>
                                    </TableRow>
                                );
                            })}
                        <TableRow>
                            <StyledTableCell colSpan={2} className='!tw-font-bold !tw-text-center'>
                                <p className='tw-ml-[3rem]'>Total</p>
                            </StyledTableCell>
                            <StyledTableCell className='!tw-font-bold'>₹{formatNumberToIndianSystem(props?.totalPaymentsData?.sum_of_milestone_amount)}</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold'>₹{formatNumberToIndianSystem(props?.totalPaymentsData?.sum_of_gst_amount)}</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold'>₹{formatNumberToIndianSystem(props?.totalPaymentsData?.sum_of_tds_amount)}</StyledTableCell>
                            <StyledTableCell className='!tw-font-bold'>₹{formatNumberToIndianSystem(props?.totalPaymentsData?.sum_of_total_payable_tds_amount)}</StyledTableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
 
            <AdminInvoice
                showModal={showModal}
                setShowModal={setShowModal}
                unitId={props?.unitId}
                custUnitId={props?.custUnitId}
                paymentMilestoneId={paymentMilestoneId}
            />
        </div>
    );
};
 
export default PaymentMilestone;
 
 