import React, { useEffect, useRef, useState } from 'react';
import {
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    useMediaQuery,
    styled,
    Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { checkForFalsyValues, convertNumberToWords, formatNumberToIndianSystem, getSumOfArrayObjectKey, numberToOrdinals } from '@Src/utils/globalUtilities';
import './InvoiceSheet.scss';
import { GridCloseIcon } from '@mui/x-data-grid';
import { IAPIResponse } from '@Src/types/api-response-interface'
import { MODULES_API_MAP, httpService } from '@Src/services/httpService'
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes'
import moment from 'moment';
import { useAppDispatch } from '@Src/app/hooks'
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice'


const InvoiceData = (props: { showModal: any, setShowModal: any, unitId: any, custUnitId: any, paymentMilestoneId: any }) => {

    const [invoiceDataForMilestone, setInvoiceDataForMilestone] = useState<any>();
    const dispatch = useAppDispatch();

    const getInvoiceData = async (milestoneId: any) => {
        try {
            dispatch(showSpinner())
            const url = `${GLOBAL_API_ROUTES.GET_MILESTONE_INVOICE_DATA}?cust_unit_id=${props.custUnitId}&unit_id=${props.unitId}&milestone_id=${props?.paymentMilestoneId}&type=${'View'}`.trim();
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, url).GET();
            if (apiResponse?.success) {
                // console.log(apiResponse?.data);
                setInvoiceDataForMilestone(apiResponse?.data?.resultData[0]);
            }
            else {
                throw new Error();
            }

        } catch (error) {
            //console.log(error);
        }
        finally {
            dispatch(hideSpinner());
        }
    };


    const getStateAndStateCode = (input: any) => {
        if (input === null || input === undefined) {
            return
        }

        const regex = /([a-zA-Z]+)\*(\d+)/;
        const match = input.match(regex);

        if (match) {
            const stateName = match[1];
            const stateCode = match[2];
            return { stateName, stateCode };
        }
    }

    useEffect(() => {
        if (props?.paymentMilestoneId) {
            getInvoiceData(props?.paymentMilestoneId);
        }
    }, [props?.paymentMilestoneId]);



    const modalRef = useRef<HTMLDivElement>(null);

    const handleBackgroundClick = (event: any) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            props?.setShowModal(false);
        }
    };

    const removeCommas = (str: any) => str?.replace(/,/g, '');

    const formattedAddress = [
        removeCommas(invoiceDataForMilestone?.customer_flat_house_number),
        removeCommas(invoiceDataForMilestone?.address_street1),
        removeCommas(invoiceDataForMilestone?.address_street2),
        removeCommas(invoiceDataForMilestone?.address_city),
        invoiceDataForMilestone?.pin_code
    ].filter(Boolean).join(', ');


    return (
        <div className={props?.showModal ? "modal-box" : "tw-hidden"} onClick={handleBackgroundClick}>
            <div ref={modalRef} className="modal-box-content">
                <div className='tw-flex tw-justify-end'>
                    <Tooltip title="Close" arrow placement='top'>
                        <span className='tw-text-right tw-cursor-pointer tw-mr-3' onClick={() => props?.setShowModal(false)}>
                            <GridCloseIcon></GridCloseIcon>
                        </span>
                    </Tooltip>
                </div>
                <div className='tw-mb-10'>
                    <div className="tw-text-center !tw-text-[#000]">
                        <h3 className='tw-font-bold tw-font-[Times New Roman]'>INVOICE</h3>
                        <h4>Project Location: {checkForFalsyValues(invoiceDataForMilestone?.project_address)},
                            {` ${checkForFalsyValues(invoiceDataForMilestone?.project_city)}`},
                            {` ${checkForFalsyValues(invoiceDataForMilestone?.project_state)}`}-
                            {`${checkForFalsyValues(invoiceDataForMilestone?.project_postal_code)}`}
                        </h4>
                    </div>
                    <table className='main-table'>
                        <tbody>
                            <tr className='top-heading-row'>
                                <td>
                                    <p className='tw-w-max tw-pr-3' >
                                        GST No: {invoiceDataForMilestone?.developer_gst_number || 'N/A'}
                                    </p>
                                </td>
                                <td colSpan={2}>
                                    <p className='tw-w-max tw-pr-3' >
                                        PAN No:{invoiceDataForMilestone?.developer_pan || 'N/A'}
                                    </p>
                                </td>
                                <td></td>
                                <td>
                                    <p className='tw-w-max tw-px-3'>
                                        Original for Buyer
                                    </p>
                                </td>
                                <td></td>
                                <td colSpan={3}>
                                    <p className='tw-w-max tw-px-3 '>
                                        Duplicate for Seller
                                    </p>
                                </td>
                            </tr>
                            <tr className='second-row'>
                                <td colSpan={3} className='!tw-align-top'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>SAP Reference No</td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.invoice_number || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td>GST Invoice No</td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.gst_invoice_number || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td>Invoice Date</td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.invoice_date ? moment(invoiceDataForMilestone.invoice_date).format('DD/MM/YYYY') : 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td>State</td>
                                                <td>:</td>
                                                <td>{getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateName || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td>State Code</td>
                                                <td>:</td>
                                                <td>{getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateCode || 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td colSpan={7} className='!tw-align-top'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td colSpan={3} className="tw-font-bold">Sale Reference Data</td>
                                            </tr>
                                            <tr>
                                                <td className="tw-border-none">Project Name</td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.project_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Block/Tower No</td>
                                                <td>:</td>
                                                <td>Tower {parseInt((invoiceDataForMilestone?.tower_name)?.split(" ")[2]).toString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Floor Number</td>
                                                <td>:</td>
                                                <td>{numberToOrdinals(invoiceDataForMilestone?.floor_no)}</td>
                                            </tr>
                                            <tr>
                                                <td>Flat Number</td>
                                                <td>:</td>
                                                <td>{parseInt(invoiceDataForMilestone?.floor_no).toString()}{invoiceDataForMilestone?.unit_no}</td>
                                            </tr>
                                            <tr>
                                                <td>Area</td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.saleable_area}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr className='third-row'>
                                <td colSpan={10}>IRN Number:{checkForFalsyValues(invoiceDataForMilestone?.irn_number)}</td>
                            </tr>
                            <tr className='fourth-row'>
                                <td colSpan={3}>
                                    <p className="tw-text-center">Billed To:</p>
                                </td>
                                <td colSpan={7}>
                                    <p className="tw-text-center">Shipped To:</p>
                                </td>
                            </tr>
                            <tr className='fifth-row'>
                                <td colSpan={3} className='!tw-align-top'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="tw-border-none">Name</td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.full_name}</td>
                                            </tr>
                                            <tr>
                                                <td className='!tw-align-top'>Address</td>
                                                <td className='!tw-align-top'>:</td>
                                                <td>{formattedAddress} Ph No: {invoiceDataForMilestone?.mobile_number}</td>
                                            </tr>
                                            <tr>
                                                <td>PAN No</td>
                                                <td>:</td>
                                                <td>{checkForFalsyValues(invoiceDataForMilestone?.pan_card)}</td>
                                            </tr>
                                            <tr>
                                                <td>GSTIN</td>
                                                <td>:</td>
                                                <td>{checkForFalsyValues(invoiceDataForMilestone?.gstin_number)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td colSpan={7} className='!tw-align-top'>
                                    <table className="tw-table-auto tw-w-full !tw-border-none">
                                        <tbody>
                                            <tr>
                                                <td className="tw-border-none">Name</td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.full_name}</td>
                                            </tr>
                                            <tr>
                                                <td className='!tw-align-top'>Address</td>
                                                <td className='!tw-align-top'>:</td>
                                                <td>{formattedAddress}</td>
                                            </tr>
                                            <tr>
                                                <td>PAN No</td>
                                                <td>:</td>
                                                <td>{checkForFalsyValues(invoiceDataForMilestone?.pan_card)}</td>
                                            </tr>
                                            <tr>
                                                <td>GSTIN</td>
                                                <td>:</td>
                                                <td>{checkForFalsyValues(invoiceDataForMilestone?.gstin_number)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>

                            </tr>
                            <tr className='sixth-row'>
                                <td>State for GST :
                                    {getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateName || 'N/A'}
                                </td>

                                <td colSpan={2}>State Code :
                                    {getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateCode || 'N/A'}
                                </td>
                                <td colSpan={4}></td>
                                <td colSpan={3}>State Code :
                                    {getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateCode || 'N/A'}
                                </td>
                            </tr>
                            <tr className='seventh-row'>
                                <td colSpan={9}>HSN Code : {invoiceDataForMilestone?.hsn_code}</td>
                            </tr>
                            <tr className='eighth-row'>
                                <td className='!tw-text-center'>
                                    Sl. No
                                </td>
                                <td className='!tw-text-center'>Name of Product/Milestone</td>
                                <td className='!tw-text-center'>Gross Value</td>
                                <td className='!tw-text-center'>Land Value (Note)</td>
                                <td className='!tw-text-center'>Taxable Value</td>
                                <td colSpan={2} className='!tw-text-center'>CGST</td>
                                <td colSpan={2} className='!tw-text-center'>SGST</td>
                            </tr>
                            <tr className='ninth-row'>
                                <td></td>
                                <td></td>
                                <td className='tw-text-center'>Rs.</td>
                                <td className='tw-text-center'>Rs.</td>
                                <td className='tw-text-center'>Rs.</td>
                                <td className='tw-text-center'>Rate</td>
                                <td className='tw-text-center'>Amount</td>
                                <td className='tw-text-center'>Rate</td>
                                <td className='tw-text-center'>Amount</td>
                            </tr>
                            <tr className='tenth-row'>
                                <td>
                                    1
                                </td>

                                <td>
                                    <p>
                                        {invoiceDataForMilestone?.milestone_description}
                                    </p>
                                    <br />
                                    <span>
                                        (As per the agreement of sale / Application for booking of flat)
                                    </span>
                                </td>

                                <td className='!tw-align-top tw-text-right'>
                                    <p className='tw-px-1'>
                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.gross_value).toFixed(2))}
                                    </p>
                                </td>

                                <td className='!tw-align-top tw-text-right'>
                                    <p className='tw-px-1'>
                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.land_value).toFixed(2))}
                                    </p>
                                </td>

                                <td className='!tw-align-top tw-text-right'>
                                    <p className='tw-px-1'>
                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.taxable_value).toFixed(2))}
                                    </p>
                                </td>

                                <td className='!tw-align-top tw-text-right'>
                                    <p className='tw-px-1'>
                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.CGST_rate_on_taxable_vale))}%
                                    </p>
                                </td>

                                <td className='!tw-align-top tw-text-right'>
                                    <p className='tw-px-1'>
                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.CGST_amount_on_taxable_value))}
                                    </p>
                                </td>

                                <td className='!tw-align-top tw-text-right'>
                                    <p className='tw-px-1'>
                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.SGST_rate_on_taxable_value))}%
                                    </p>
                                </td>

                                <td className='!tw-align-top tw-text-right'>
                                    <p className='tw-px-1'>
                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.SGST_amount_on_taxable_value))}
                                    </p>
                                </td>
                            </tr>

                            <tr className='eleventh-row'>
                                <td colSpan={3} rowSpan={2}>
                                    Note: Deduction of Land value from the Gross value as per Notification 11/2017 Central tax
                                </td>
                                <td colSpan={3}>
                                    <strong>Total Amount Before GST:</strong>
                                </td>
                                <td colSpan={4} className='!tw-text-right'>
                                    <p>
                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoice_amount)?.toFixed(2))}
                                    </p>
                                </td>
                            </tr>
                            <tr className='twelveth-row'>
                                <td colSpan={3}>Add Central Tax (CGST):</td>
                                <td colSpan={4} className='!tw-text-right'>
                                    {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.CGST_amount_on_taxable_value))}
                                </td>
                            </tr>
                            <tr className='thirteenth-row'>
                                <td colSpan={3} rowSpan={3}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Bank Details</th>
                                            </tr>
                                        </thead>
                                        <tbody className='bank-details-table-body'>
                                            <tr>
                                                <td className='tw-w-1/3'><p>Name Of A/C</p></td>
                                                <td>:</td>
                                                <td className='tw-w-2/3'>
                                                    {invoiceDataForMilestone?.developer_bank_account_payee_details}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='tw-w-1/3'><p>Bank & Branch</p></td>
                                                <td>:</td>
                                                <td>
                                                    {invoiceDataForMilestone?.developer_bank_account_name} <br />
                                                    {invoiceDataForMilestone?.developer_bank_branch_name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='tw-w-1/3'><p>Account Number</p></td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.developer_bank_account_number}</td>
                                            </tr>
                                            <tr>
                                                <td className='tw-w-1/3'><p>IFSC Code</p></td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.developer_bank_account_ifsc_code}</td>
                                                <td>;</td>
                                                <td><p>Swift Code</p></td>
                                                <td>:</td>
                                                <td>{invoiceDataForMilestone?.developer_bank_swift_code}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>

                            </tr>
                            <tr className='fourteenth-row !tw-h-3'>
                                <td colSpan={3}>Add State Tax (SGST): </td>
                                <td colSpan={4} className='!tw-text-right'>
                                    {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.SGST_amount_on_taxable_value))}
                                </td>
                            </tr>
                            <tr className='fifteenth-row'>
                                <td colSpan={3}>
                                    <strong>Total GST:</strong>
                                </td>
                                <td colSpan={4} className='!tw-text-right'>
                                    {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.total_GST_amount))}
                                </td>
                            </tr>
                            <tr className='sixteenth-row'>
                                <td colSpan={3}>
                                    <p className='tw-text-center'>
                                        Total Invoice Amount in Words: <br />
                                        {convertNumberToWords(invoiceDataForMilestone?.invoiceCalculatedFields?.total_amount_including_GST)?.toUpperCase() || 'N/A'} <br />
                                    </p>
                                </td>
                                <td colSpan={3}>
                                    <strong>Total Amount Including GST</strong>
                                    <br />
                                    (Rounded off to the nearest rupee value)
                                </td>
                                <td colSpan={4} className='!tw-text-right'>
                                    {formatNumberToIndianSystem(Math.round(parseInt(invoiceDataForMilestone?.invoiceCalculatedFields?.total_amount_including_GST)))}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={9}>
                                    <p className="tw-flex tw-flex-col ">
                                        <span className="tw-self-center"><strong>Terms and Conditions</strong></span>
                                        <span>
                                            1. This Invoice Amount is to be received on or before
                                            <span className='tw-mx-1'>
                                                {checkForFalsyValues(moment(invoiceDataForMilestone?.invoice_due_date)?.format('DD.MM.YYYY')) || 'N/A'}.
                                            </span>
                                        </span>
                                        <span>
                                            2. Fail to pay within due date attracts Interest
                                            @{parseFloat(invoiceDataForMilestone?.late_payment_interest)?.toFixed(2) || 'N/A'}%, subject to your agreement.
                                        </span>
                                        <span>
                                            3. If the amount is remitted through RTGS, till the intimation of UTR Nos, it will be considered as unpaid.
                                        </span>
                                        <span>
                                            4. Cheques / DDs shall be drawn in favour of {invoiceDataForMilestone?.developer_bank_account_payee_details || 'N/A'}.
                                        </span>
                                        <span>
                                            5. No tax is payable on reverse charge basis on this invoice.
                                        </span>
                                        <span>
                                            6. 1% TDS has to be paid by customer only on the invoice value excluding GST/Taxes as per due date and copy of challan to be provided to us.
                                        </span>
                                    </p>

                                </td>
                            </tr>
                            <tr className="last_row">
                                <td colSpan={9}>
                                    <p className='tw-text-right'>
                                        <span>
                                            Certified that the particulars given above are true and correct.
                                            <br />
                                            For My Home Infrastructures Private Limited.
                                        </span>
                                        <br />
                                        <span className='tw-inline-block tw-mt-8'>
                                            Authorized Signatory
                                        </span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default InvoiceData;