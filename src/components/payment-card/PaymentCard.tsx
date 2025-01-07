import { useState } from "react";
import { Tooltip } from "@mui/material";
import { checkForFalsyValues, formatNumberToIndianSystem, formatTimeDifference } from "@Src/utils/globalUtilities";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import moment from "moment";
import { useDispatch } from "react-redux";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import Invoicesheets from "@Components/invoice-sheet/InvoiceSheets";
import Api from "../../app/admin/api/Api";
import { useParams } from "react-router-dom";
import userSessionInfo from "../../app/admin/util/userSessionInfo";
import "./PaymentCard.scss";
import { BlobProvider } from "@react-pdf/renderer";
import InvoiceSheetsData from "./InvoiceSheetsData";
import DemandLetter from "@Components/demandLetter/DemandLetter";
import { TbFileInvoice } from "react-icons/tb";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";

const PaymentCard = (props: { paymentsData: any; unitId: any; custUnitId: any; totalPaymentsData: any; }) => {
    const [showModal, setShowModal] = useState(false);
    const [paymentMilestoneId, setPaymentMilestoneId] = useState<any>();
    const [milestoneDescription, setMilestoneDescription] = useState<any>();
    const [invoiceDataForMilestone, setInvoiceDataForMilestone]: any = useState();
    const { custUnitId, customerId } = useParams();
    const [showDemandLetterModal, setShowDemandLetterModal] = useState<Boolean>(false);
    const [demandLetterURL, setDemandLetterURL] = useState('');
    const dispatch = useDispatch();

    var timeoutId: any;
    function cancelTimeout(): any {
        let downloadPdfId = document.getElementById("download_pdf_file_id");
        downloadPdfId?.click();
        clearTimeout(timeoutId);
        dispatch(hideSpinner());
    }

    const downloadInvoice = async (milestoneId: any) => {
        try {
            dispatch(showSpinner());
            const userInfo = userSessionInfo.logUserInfo();
            if (!userInfo) {
                const url = `${GLOBAL_API_ROUTES.GET_MILESTONE_INVOICE_DATA}?cust_unit_id=${props.custUnitId}&unit_id=${props.unitId}&milestone_id=${milestoneId}&type=${"View"}`.trim();
                const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, url).GET();
                if (apiResponse?.success) {
                    setInvoiceDataForMilestone(apiResponse?.data?.resultData[0]);
                    window.setTimeout(cancelTimeout, 2000);
                } else {
                    dispatch(hideSpinner());
                    throw new Error();
                }
            } else if (userInfo?.user_type_id == "internal") {
                const { data, status: responseStatus, message, }: any = await Api.get("crm_invoices", {
                    cust_unit_id: props.custUnitId,
                    unit_id: props.unitId,
                    milestone_id: milestoneId,
                    type: 'View'
                });
                if (responseStatus) {
                    setInvoiceDataForMilestone(data?.resultData[0]);
                    window.setTimeout(cancelTimeout, 2000);
                } else {
                    dispatch(hideSpinner());
                    throw new Error();
                }
            }
        } catch (error) {
            //console.log(error);
        } finally {
            //dispatch(hideSpinner());
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
            <div className="transition duration-300 ease-in-out transform hover:scale-105 tw-bg-white tw-border tw-border-solid tw-border-[#DFE1E7] tw-rounded-2xl tw-text-black tw-w-full">
                <div className="tw-w-fit tw-flex md:tw-flex-row tw-flex-col md:tw-gap-2 tw-px-3 tw-pt-2 md:tw-items-center">
                    <p className="tw-font-bold tw-text-lg">Payment Details
                    </p>
                    {milestoneDescription ?
                        <p className="tw-text-[#FF0006] tw-font-semibold">
                            {milestoneDescription}
                        </p>
                        :
                        <p className="tw-text-white">hi</p>
                    }
                </div>
                <div className="tw-overflow-auto tw-w-full tw-flex tw-flex-col">
                    <table className="tw-w-full tw-text-[14px]">
                        <thead>
                            <tr className="tw-border-b tw-border-gray-300">
                                <th className="tw-font-bold tw-text-center tw-p-2">S.No.</th>
                                <th className="tw-font-bold tw-text-center tw-p-2">Milestone Percentage</th>
                                <th className="tw-font-bold tw-text-center tw-p-2">Milestone Amount</th>
                                <th className="tw-font-bold tw-text-center tw-p-2">
                                    GST <br /> Amount <br /> @ {gstPercentage} %
                                </th>
                                <th className="tw-font-bold tw-text-center tw-p-2">
                                    TDS <br />Amount
                                </th>
                                <th className="tw-font-bold tw-text-center tw-p-2">
                                    Total Payable Amount less TDS
                                </th>
                                <th className="tw-font-bold tw-text-center tw-p-2">Invoice Status</th>
                                <th className="tw-font-bold tw-text-center tw-p-2">Payment Due Date</th>
                                <th className="tw-font-bold tw-text-center tw-p-2">User Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props?.paymentsData
                                .sort((a: any, b: any) => a.milestone_sequence - b.milestone_sequence)
                                .map((payment: any, index: any) => {
                                    let color = "";
                                    let paymentDueDateStatus = payment?.payment_due_date;
                                    const dueMoment = moment(paymentDueDateStatus);
                                    let currentDate = moment();
                                    const differenceInDays = currentDate.diff(dueMoment, "days");
                                    const isOverdue = currentDate > dueMoment;
                                    let milestoneStatus = payment?.milestone_status?.charAt(0)?.toUpperCase()?.concat(payment?.milestone_status?.slice(1));
                                    if (payment?.milestone_status === "raised") {
                                        color = "invoice-Raised";
                                        milestoneStatus = "Raised";
                                    } else if (payment?.milestone_status === "upcoming") {
                                        color = "invoice-Upcoming";
                                    } else if (payment?.milestone_status === "future") {
                                        color = "invoice-Future";
                                    }

                                    const tooltipTitle = isOverdue ? `OverDue By ${checkForFalsyValues(formatTimeDifference(differenceInDays))}` : "";
                                    const paymentDueDate = payment?.payment_due_date ? moment(payment.payment_due_date).format("DD/MM/YYYY") : "";

                                    return (
                                        <tr
                                            key={payment?.milestone_id}
                                            onMouseEnter={() => setMilestoneDescription(payment?.milestone_description)}
                                            onMouseLeave={() => setMilestoneDescription(null)}
                                            className="tw-transition tw-duration-300 tw-ease-in-out tw-transform tw-border-b tw-border-gray-300"
                                        >
                                            <td className="tw-text-center tw-p-2">{payment?.milestone_sequence}</td>
                                            {payment?.milestone_sequence === 1 ? (
                                                <td rowSpan={2} className="tw-align-middle tw-text-center tw-border tw-p-2">
                                                    {combinedMilestonePercentage}%
                                                </td>
                                            ) : payment?.milestone_sequence !== 2 && (
                                                <td className="tw-text-center tw-p-2">
                                                    {Number(payment?.applied_milestone_percentage) * 100 || 0}%
                                                </td>
                                            )}
                                            <td className="tw-text-right tw-p-2">
                                                ₹{formatNumberToIndianSystem(payment?.milestone_amount)}
                                            </td>
                                            <td className="tw-text-right tw-p-2">
                                                ₹{formatNumberToIndianSystem(payment?.gst_amount)}
                                            </td>
                                            <td className="tw-text-right tw-p-2">
                                                ₹{formatNumberToIndianSystem(payment?.tds_amount)}
                                            </td>
                                            <td className="tw-text-right tw-p-2">
                                                ₹{formatNumberToIndianSystem(payment?.total_payable_amount_less_tds)}
                                            </td>
                                            <td className="tw-text-center tw-p-2">
                                                <span className={color}>{milestoneStatus}</span>
                                            </td>
                                            <td className="tw-text-center tw-p-2">
                                                {payment?.milestone_status === "raised" && (
                                                    <div>
                                                        {payment?.invoice_payment_due_status !== "closed" ? (
                                                            <Tooltip
                                                                title={tooltipTitle}
                                                                arrow
                                                                placement="top"
                                                                classes={{ tooltip: "custom-tooltip-color" }}
                                                            >
                                                                <span>{paymentDueDate}</span>
                                                            </Tooltip>
                                                        ) : (
                                                            <span>{paymentDueDate}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="tw-text-center tw-p-2">
                                                {payment?.milestone_status === "raised" && (
                                                    <div className="tw-flex tw-justify-evenly tw-gap-2">
                                                        <Tooltip
                                                            title={"View Invoice"}
                                                            arrow
                                                            placement="top"
                                                            classes={{ tooltip: "custom-tooltip-color" }}
                                                        >
                                                            <button
                                                                onClick={() => handleViewClick(payment?.milestone_id)}
                                                                className="tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125"
                                                            >
                                                                <LiaFileInvoiceDollarSolid size={18} />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={"View Demand Letter"}
                                                            arrow
                                                            placement="top"
                                                            classes={{ tooltip: "custom-tooltip-color" }}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    setDemandLetterURL(payment.demand_letter_url)
                                                                    setShowDemandLetterModal(true)
                                                                }}
                                                                className="tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125"
                                                            >
                                                                <TbFileInvoice size={18} />
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            <tr className="tw-bg-gray-50 tw-border-b tw-border-gray-300">
                                <td colSpan={2} className="tw-font-bold tw-text-center tw-p-2">
                                    <p className="tw-ml-[3rem]">Total</p>
                                </td>
                                <td className="tw-font-bold tw-text-right tw-p-2">
                                    ₹{formatNumberToIndianSystem(props?.totalPaymentsData?.sum_of_milestone_amount)}
                                </td>
                                <td className="tw-font-bold tw-text-right tw-p-2">
                                    ₹{formatNumberToIndianSystem(props?.totalPaymentsData?.sum_of_gst_amount)}
                                </td>
                                <td className="tw-font-bold tw-text-right tw-p-2">
                                    ₹{formatNumberToIndianSystem(props?.totalPaymentsData?.sum_of_tds_amount)}
                                </td>
                                <td className="tw-font-bold tw-text-right tw-p-2">
                                    ₹{formatNumberToIndianSystem(props?.totalPaymentsData?.sum_of_total_payable_tds_amount)}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={9} className="tw-text-left tw-font-bold tw-text-sm tw-leading-5 tw-p-2 tw-px-4">
                                    Note: <span className="tw-font-normal tw-italic">The payment and TDS information provided here is for reference purposes only.
                                        TDS (Tax Deducted at Source) rates are subject to government regulations. Customers
                                        are advised to deduct and remit TDS as per applicable laws. The developer does not take
                                        responsibility for any errors or non-compliance in TDS deductions.</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <Invoicesheets
                showModal={showModal}
                setShowModal={setShowModal}
                unitId={props?.unitId}
                custUnitId={props?.custUnitId}
                paymentMilestoneId={paymentMilestoneId}
            />

            {showDemandLetterModal && (
                <DemandLetter
                    showDemandLetterModal={showDemandLetterModal}
                    setShowDemandLetterModal={setShowDemandLetterModal}
                    demandLetterURL={demandLetterURL}
                />
            )}

            <BlobProvider
                document={
                    <InvoiceSheetsData
                        invoiceDataForMilestone={invoiceDataForMilestone}
                    />
                }
            >
                {({ blob, url, loading, error }) => {
                    if (loading) {
                        return <p>Loading</p>;
                    }
                    if (url) {
                        return (
                            <a
                                id="download_pdf_file_id"
                                href={url}
                                download={invoiceDataForMilestone?.invoice_number + ".pdf"}
                                style={{ display: "none" }}
                            >
                                Download
                            </a>
                        );
                    }
                }}
            </BlobProvider>
        </div>
    );
};

export default PaymentCard;