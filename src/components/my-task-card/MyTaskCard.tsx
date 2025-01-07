import { useContext, useEffect, useState } from 'react'
import './MyTaskCard.scss'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { AppRouteURls } from '@Constants/app-route-urls'
import { capitalizeFirstLetter, checkForFalsyValues, formatNumberToIndianSystem, getDataFromLocalStorage } from '@Src/utils/globalUtilities'
import { MyContext } from '@Src/Context/RefreshPage/Refresh'
import LegalDocApprovalPopup from '@Components/legal-doc-approval-popup/LegalDocApprovalPopup'
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel'
import userSessionInfo from "../../app/admin/util/userSessionInfo";
import { useParams } from "react-router-dom";
import ViewMilestones from '@Src/app/admin/pages/view-milestones/ViewMilestones'


export interface myTaskCardProps {
    task_title: string
    task_description: string
    task_type: string
    booking_id: number
    task_due_date: string
    button_text: string
    icon: string
    status: string
    created_on: string
    updated_on: any
    project_name: string
    address: string
    project_no: number
    tower_no: number
    tower_name: string
    floor_name: string
    floor_no: number
    route: string
    unit_id: number
    date_of_completion: string
    applied_milestone_percentage: string
    invoice_amount: string
    invoice_date: string
    task_status: string
    doc_task_status: string
}

const MyTaskCard = (props: { task: myTaskCardProps, custUnitDetails?: any, setCurrentTab: any, getMyTasks: any }) => {
    const navigate = useNavigate();
    const [showCard, setShowCard] = useState(false);
    const [legalTask, setLegalTask] = useState<any>();
    const unit_id = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.UNIT_ID);
    const cust_unit_id = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.CUST_UNIT_ID);
    const userInfo = userSessionInfo.logUserInfo();
    const { custUnitId, customerId } = useParams();
    const [receiptsStatus, setReceiptsStatus] = useState(false)

    const handleButtonRoute = () => {
        if (props?.task?.task_type === "agreement_of_sale") {
            setLegalTask(props?.task);
            setShowCard(true);
        }
        else if (props?.task?.task_type === "tds" && !userInfo) {
            navigate(`/tds-info/unitId/${unit_id}/custUnitId/${cust_unit_id}`)
        }
        else if (props?.task?.task_type === "payment" && !userInfo) {
            navigate(`/my-property-details/unitId/${unit_id}/payments`)
        }
        else if (props?.task?.task_type === "tds") {
            navigate(`/crm/tdsdetails/${customerId}/${custUnitId}`)
        } else if (props?.task?.task_type === "payment") {
            setReceiptsStatus(true);
            props?.setCurrentTab(1)

        }
    }

    const getTaskTitle = (taskType: any) => {
        if (taskType === "payment") {
            if (props?.task?.task_status === 'open') {
                return `Payment Due-${props?.task?.task_title}`
            }
            else {
                return `Payment Done-${props?.task?.task_title}`
            }
        }
        else {
            return props?.task?.task_title;
        }
    }

    const getInvoiceDueDate = (dateString: string): string => {
        return moment(dateString)?.add(15, 'days').format('DD/MM/YYYY');
    };

    const getInvoiceDueDateStatus = (dateString: string): 'overdue' | 'due' => {
        const dateAfter15Days = moment(dateString)?.add(15, 'days');
        return dateAfter15Days?.isBefore(moment()) ? 'overdue' : 'due';
    };


    const getTDSAmount = (TDSPercentage: any, invoiceAmount: any) => {
        if (!TDSPercentage || !invoiceAmount) {
            return;
        }
        const formattedTDSPercentage = parseFloat(TDSPercentage) * 100;
        const formattedInvoiceAmount = parseFloat(invoiceAmount);
        const tdsAmount = (formattedTDSPercentage * formattedInvoiceAmount) / 100;
        return tdsAmount.toFixed(2);
    }

    const renderTaskContent = (taskType: string) => {
        switch (taskType) {
            case 'payment':
                return (
                    <span>
                        Please pay {(parseFloat(props?.task?.applied_milestone_percentage) * 100)?.toFixed(0)}%
                        payment of the total sale consideration, amounting to ₹ {formatNumberToIndianSystem(parseFloat(props?.task?.invoice_amount)?.toFixed(2))}.
                    </span>
                );
            case 'agreement_of_sale':
                switch (props?.task?.doc_task_status) {
                    case 'task_generated':
                    case 'assigned_to_customer':
                        return (
                            <span>
                                You can download the document, review it, and if everything looks good, please approve it. Respond back if there are any changes required.
                            </span>
                        );
                    case 'assigned_to_RM':
                        return (
                            <span>
                                Your change request has been submitted to the Relationship Manager. You will be notified once the updated document is available for review.
                            </span>
                        );
                    case 'assigned_existing_document_to_customer':
                        return (
                            <span>
                                Your change request has been reviewed. The RM has sent back the same draft as only demographic data (with supporting KYC documents) or booked unit details (in case of mistakes) can be modified. Please review the document and either approve it or request a change to your demographic information.
                            </span>
                        );
                    case 'assigned_new_document_to_customer':
                        return (
                            <span>
                                A new version of the Agreement of Sale has been uploaded by your Relationship Manager (RM). Please download the new draft, review it thoroughly, and either approve it or request changes.
                            </span>
                        );
                    case 'closed':
                        return (
                            <span>
                                Your approval has been successfully submitted. The document will now proceed to the next stage of processing.
                            </span>
                        );
                    default:
                        return (
                            <span>
                                The agreement of sale is being processed. Please check back later for updates.
                            </span>
                        );
                }
            case 'tds':
                return (
                    <span>
                        Please pay {parseFloat(props?.task?.applied_milestone_percentage) * 100}% of
                        ₹ {formatNumberToIndianSystem(parseFloat(props?.task?.invoice_amount)?.toFixed(2))}
                        (₹ {formatNumberToIndianSystem(getTDSAmount(props?.task?.applied_milestone_percentage, props?.task?.invoice_amount))})
                        and upload the TDS challan.
                    </span>
                );
            default:
                return (
                    <span>
                        No specific task type found.
                    </span>
                );
        }
    };

    const getTaskActionText = (taskType: string) => {
        if (!taskType) return '';
        switch (taskType) {
            case 'payment':
                return 'Go to Payments Tab';
            case 'tds':
                return 'Go to TDS Tab';
            case 'agreement_of_sale':
                switch (props?.task?.doc_task_status) {
                    case 'assigned_to_customer':
                    case 'task_generated':
                        return 'Approve The docs';
                    case 'assigned_to_RM':
                    case 'assigned_existing_document_to_customer':
                    case 'assigned_new_document_to_customer':
                        return 'View Details';
                    case 'closed':
                        return 'View Agreement of Sale';
                    default:
                        return '';
                }
            default:
                return '';
        }
    };

    return (
        <div className='task-cont'>
            <div className='task-up-cont'>
                <div>
                    {props?.task?.task_type === 'payment' ?
                        <img className='tw-max-w-8' src='/images/rupee-icon.svg' alt="" />
                        :
                        <img className='tw-max-w-8' src='/images/task-icon.svg' alt="" />
                    }
                </div>
                <div className="task-right">
                    <div className='fs13 tw-mb-1'>
                        <span>
                            {`${capitalizeFirstLetter(props?.custUnitDetails?.project_name)}, Tower ${parseInt(props?.custUnitDetails?.tower_code)}, Unit ${parseInt(props?.custUnitDetails?.floor_no)}${props?.custUnitDetails?.unit_no}`}
                        </span>
                    </div>
                    {props?.task?.task_type === 'payment' && props?.task?.task_status !== 'closed' &&
                        <div className={`${getInvoiceDueDateStatus(props?.task?.invoice_date) === 'due' ? 'tw-text-[#828282]' : 'tw-text-[#CF1322]'} fs13 tw-mb-1`}>
                            Due By {getInvoiceDueDate(props?.task?.invoice_date)}
                        </div>}
                    {/* {
                        (props?.task?.task_status === 'closed' || props?.task?.doc_task_status === 'closed') &&
                        <div className='fs13 tw-mb-1 tw-text-[#00BD35]'>
                            Task Completion Date {checkForFalsyValues(moment(props?.task?.date_of_completion).format('DD/MM/YYYY'))}
                        </div>
                    } */}
                    <div className='fs14 text-pri-all tw-font-bold tw-mb-1'>
                        {getTaskTitle(props?.task?.task_type)}
                    </div>
                    <div className='fs13 tw-mb-1 tw-w-[100%] tw-text-[#3C4049]'>
                        {renderTaskContent(props?.task?.task_type)}
                    </div>
                </div>
            </div>
            <div className='task-down-cont'>
                {
                    <button onClick={handleButtonRoute}>
                        <img src="/images/arrow-right.svg" alt="" />
                        {getTaskActionText(props?.task?.task_type)}
                    </button>
                }
            </div>
            {
                showCard &&
                <LegalDocApprovalPopup
                    getMyTasks={props?.getMyTasks}
                    open={showCard}
                    onClose={() => setShowCard(false)}
                    custUnitDetails={props?.custUnitDetails}
                    legalTask={legalTask}
                />
            }


        </div>
    )
}

export default MyTaskCard