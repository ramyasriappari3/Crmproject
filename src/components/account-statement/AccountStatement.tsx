import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import moment from 'moment';
import { checkForFalsyValues, downloadFiles, formatNumberToIndianSystem, getTitleNameWithDots } from '@Src/utils/globalUtilities';
import Tooltip from '@mui/material/Tooltip';
import './AccountStatement.scss';


const AccountStatement = (props: { showAccountStatementModel: any, setShowAccountStatementModel: any, unitId: any, custUnitId: any, custProfileId: any }) => {
    const dispatch = useAppDispatch();
    const [accountStatementData, setAccountStatementData] = useState<any>();
    const [lastRaisedMilestoneData, setLastRaisedMilestoneData] = useState<any>();
    const [statmentData, setStatmentData] = useState<any>();
    const modalRef = useRef<HTMLDivElement>(null);

    const getAccountStatementData = async () => {
        try {
            dispatch(showSpinner());
            const URL = `${GLOBAL_API_ROUTES.GET_STATEMENT_OF_ACCOUNT}?cust_profile_id=${props?.custProfileId}&cust_unit_id=${props?.custUnitId}&type=${'View'}`.trim();
            const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, URL).GET();
            if (response?.success) {
                setAccountStatementData(response?.data);
                setStatmentData(response?.data?.statement || {});
                setLastRaisedMilestoneData(response?.data?.unit_milestones?.filter((milestone: any) => milestone.milestone_status === 'raised').pop());
            }
            dispatch(hideSpinner());
        } catch (error) {
            console.error('Error downloading the Account Statment:', error);
            dispatch(hideSpinner());
        }
    };

    const downloadAccountStatement = async () => {
        try {
            dispatch(showSpinner());
            const URL = `${GLOBAL_API_ROUTES.GET_STATEMENT_OF_ACCOUNT}?cust_profile_id=${props?.custProfileId}&cust_unit_id=${props?.custUnitId}`.trim();
            const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, URL).GET();
            if (response?.success) {
                const fileUrl = response?.data?.pdfUrl;
                downloadFiles(fileUrl, `Account Statment as of ${moment(checkForFalsyValues(lastRaisedMilestoneData?.invoice_date))?.format('DD/MM/YYYY')?.concat('.pdf')}`)
            }
        } catch (error) {
            console.error('Error downloading the Account Statment:', error);
        }
        finally {
            dispatch(hideSpinner());
        }
    };

    useEffect(() => {
        if (props?.custUnitId && props?.custProfileId) {
            getAccountStatementData();
        }
    }, [props?.custUnitId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                props.setShowAccountStatementModel(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalRef]);

    return (
        <div className={props?.showAccountStatementModel ? "account-statement !tw-p-0" : "tw-hidden"}>
            <div className='modal-content md:!tw-w-[70vw]  !tw-w-[100vw] md:!tw-h-[90vh] !tw-h-[100vh] md:!tw-pb-0 !tw-pb-32' ref={modalRef}>
                <div className='tw-flex tw-gap-4 tw-justify-end'>
                    <Tooltip title={'Download Statement of Account'} arrow placement='top'>
                        <button onClick={downloadAccountStatement} className="tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125">
                            <img src="/images/download-icon.svg" alt="Download" />
                        </button>
                    </Tooltip>
                    <Tooltip title="Close" arrow placement='top'>
                        <button onClick={() => props?.setShowAccountStatementModel(false)} className='tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125'>
                            <img src="/images/cross-icon.svg" className="tw-cursor-pointer" alt="" />
                        </button>
                    </Tooltip>
                </div>
                <div className='sheet-table'>
                    <h1 className="table-heading tw-mb-3">MY HOME CONSTRUCTIONS PVT LIMITED
                        <br /> Demands Vs Receipts Summary Report as on {moment(checkForFalsyValues(lastRaisedMilestoneData?.invoice_date))?.format('DD.MM.YYYY')}</h1>
                    <div className="tw-flex tw-justify-between tw-text-black">
                        <table>
                            <tr>
                                <td>Project Name</td>
                                <td>:</td>
                                <td><strong>{accountStatementData?.project_name}</strong></td>
                            </tr>
                            <tr>
                                <td className='tw-align-top'>Customer Name</td>
                                <td className='tw-align-top'>:</td>
                                <td className='tw-align-top'>
                                    <div className='tw-flex tw-flex-wrap tw-align-top tw-font-bold'>
                                        <div className='tw-mr-1'>
                                            {getTitleNameWithDots(accountStatementData?.customer_title)}
                                            {accountStatementData?.full_name}
                                        </div>
                                        {accountStatementData?.joint_customer_names?.map((customer: any, index: any) => {
                                            return (
                                                <div key={index} className='tw-mr-1 tw-min-w-max'>
                                                    & {getTitleNameWithDots(customer?.customer_title)} {customer?.full_name}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Customer No</td>
                                <td>:</td>
                                <td><strong>{accountStatementData?.customer_number}</strong></td>
                            </tr>
                            <tr>
                                <td>Block/Tower Name</td>
                                <td>:</td>
                                <td><strong>Block {parseInt(accountStatementData?.tower_code)?.toString()}</strong></td>
                            </tr>
                        </table>
                        <div className="right-items tw-mt-10">
                            <table>
                                <tr>
                                    <td>Flat No</td>
                                    <td>:</td>
                                    <td className="!tw-text-right">{parseInt(accountStatementData?.floor_no)}{accountStatementData?.unit_no}</td>
                                </tr>
                                <tr>
                                    <td>Sale Area</td>
                                    <td>:</td>
                                    <td className="!tw-text-right">{formatNumberToIndianSystem(accountStatementData?.saleable_area)}</td>
                                </tr>
                                <tr>
                                    <td>Cost of the Flat</td>
                                    <td>:</td>
                                    <td className="!tw-text-right">{formatNumberToIndianSystem(accountStatementData?.total_sale_consideration)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <table className='tw-text-black statement-table'>
                    <thead>
                        <tr className='tw-bg-[#d4d4d4] tw-text-left' tw-p-4>
                            <th>DATE</th>
                            <th>TYPE</th>
                            <th className='tw-text-center'>NARRATION</th>
                            <th className='!tw-text-right'>DEMANDS</th>
                            <th className='!tw-text-right'>RECEIPTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statmentData && Object?.keys(statmentData)?.map((dateKey, index) => {
                            const data = statmentData[dateKey];
                            return (
                                <React.Fragment key={index}>
                                    {data?.invoiceData?.map((invoice: any, idx: any) => (
                                        <React.Fragment key={`invoice-${idx}`}>
                                            <tr>
                                                <td>{checkForFalsyValues(moment(invoice?.milestone_completion_date).format('DD.MM.YYYY'))}</td>
                                                <td>Inst</td>
                                                <td>{checkForFalsyValues(invoice?.milestone_description || invoice?.payment_narration)}</td>
                                                <td className='!tw-text-right'>
                                                    {checkForFalsyValues(formatNumberToIndianSystem(invoice?.milestone_amount || invoice?.receipt_amount))}
                                                </td>
                                                <td className='!tw-text-right'>0.00</td>
                                            </tr>
                                            {invoice?.cgst_amount && (
                                                <tr>
                                                    <td>{checkForFalsyValues(moment(invoice?.milestone_completion_date).format('DD.MM.YYYY'))}</td>
                                                    <td>Drcr</td>
                                                    <td>Central Tax Charged</td>
                                                    <td className='!tw-text-right'>{checkForFalsyValues(formatNumberToIndianSystem(Math.round(parseFloat(invoice?.cgst_amount))))}</td>
                                                    <td className='!tw-text-right'>0.00</td>
                                                </tr>
                                            )}
                                            {invoice?.sgst_amount && (
                                                <tr>
                                                    <td>{checkForFalsyValues(moment(invoice?.milestone_completion_date).format('DD.MM.YYYY'))}</td>
                                                    <td>Drcr</td>
                                                    <td>State Tax Charged</td>
                                                    <td className='!tw-text-right'>{checkForFalsyValues(formatNumberToIndianSystem(Math.round(parseFloat(invoice?.sgst_amount))))}</td>
                                                    <td className='!tw-text-right'>0.00</td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {data?.ReceiptData?.map((receipt: any, idx: any) => (
                                        <tr key={`receipt-${idx}`}>
                                            <td className='!tw-align-top'>{checkForFalsyValues(moment(receipt?.receipt_date).format('DD.MM.YYYY'))}</td>
                                            <td className='!tw-align-top'>Recpt</td>
                                            <td>
                                                <p className='tw-break-words'>
                                                    {checkForFalsyValues(receipt?.payment_narration)}
                                                </p>
                                            </td>
                                            <td className='!tw-text-right !tw-align-top'>0.00</td>
                                            <td className='!tw-text-right !tw-align-top'>{checkForFalsyValues(formatNumberToIndianSystem(receipt?.receipt_amount))}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                        <tr className='tw-border-2 tw-border-y-black tw-border-x-transparent'>
                            <td></td>
                            <td></td>
                            <td className='tw-font-bold'>Total</td>
                            <td className='!tw-text-right tw-font-bold'>{formatNumberToIndianSystem(accountStatementData?.total_amount_with_taxes)}</td>
                            <td className='!tw-text-right tw-font-bold'>{formatNumberToIndianSystem(accountStatementData?.total_payable_amount)}</td>
                        </tr>
                        <tr className='tw-border-2 tw-border-b-black tw-border-x-transparent'>
                            <td></td>
                            <td></td>
                            <td className='tw-font-bold'>Net Balance</td>
                            <td className='!tw-text-right tw-font-bold'>{formatNumberToIndianSystem(accountStatementData?.net_balance_amount)}</td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    **If any discrepancies in the Demand Vs Receipts statement kindly revert back to us immediately
                </p>
            </div>
        </div>
    );
}

export default AccountStatement;
