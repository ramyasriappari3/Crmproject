import { Page, Text, View, Document, StyleSheet, Font, PDFViewer } from '@react-pdf/renderer';
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBold from "../../assets/fonts/Roboto-Bold.ttf";
import RobotoBoldItalic from "../../assets/fonts/Roboto-BoldItalic.ttf";
import RobotoThin from "../../assets/fonts/Roboto-Thin.ttf";
import { render } from '@testing-library/react';
import { useEffect, useState, useRef } from 'react';
import { showSpinner } from '@Src/features/global/globalSlice';
import { useAppDispatch } from '@Src/app/hooks';
import { httpService, MODULES_API_MAP } from '@Src/services/httpService';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { Dialog } from '@mui/material';
import { capitalizeFirstLetter, checkForFalsyValues, convertNumberToWords, formatNumberToIndianSystem, formatNumberToIndianSystemArea, getDataFromLocalStorage, getTitleNameWithDots } from '@Src/utils/globalUtilities';
import moment from 'moment';
import React from 'react';
import timesRomanNormal from "../../assets/fonts/times-ro.ttf";
import timesRomanBold from "../../assets/fonts/timr65w.ttf";
import CustomPDFViewer from '@Components/custom-pdf-viewer/CustomPDFViewer';
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';
import axios from 'axios';


Font.register({
    family: 'Courier',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});
Font.register({
    family: 'timesRoman',
    fonts: [

        {
            src: timesRomanNormal,
            fontWeight: 400,
        },
        {
            src: timesRomanBold,
            fontWeight: 700,
        },
    ]
})

Font.registerHyphenationCallback((word) => {
    return [word];
});

// Global styles
const globalStyles = StyleSheet.create({
    page: {
        padding: 50,
        position: 'relative',
        fontSize: 10,
        // fontFamily: 'timesRoman'

    },
    flexRow: {
        flexDirection: 'row',
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    wrap: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    },

    padYHead: {
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 3,
        paddingRight: 3
    },

    padHead: {
        paddingTop: 10
    },

    tableContainer: {
        width: "100%",
        border: "1px solid black"
    },

    borderRight: {
        borderRight: "1px solid black"
    },

    borderTop: {
        borderTop: "1px solid black"
    },
    gapbetween: {
        gap: 30
    },
    pagenumber: {
        position: "absolute",
        textAlign: "center",
        bottom: 30,
        left: 35,
        right: 35,
        borderTop: '1px solid black',
        paddingTop: 5,
        fontSize: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 30
    },
    //New Styles
    tableContainerNew: {
        width: '100%',
    },
    tableRow: {
        flexDirection: 'row',
        paddingTop: 4,
        paddingBottom: 2
    },

    bold: {
        fontWeight: 700,
        fontFamily: "timesRoman",
        fontSize: 9

    },

    normalText: {
        fontWeight: 400,
        fontFamily: "timesRoman",
        fontSize: 10
        // lineHeight: 1.1
    },

});

const demandLetterStyles = StyleSheet.create({

    normalText: {
        fontWeight: 400,
        fontFamily: "timesRoman",
        fontSize: 12
        // lineHeight: 1.1
    },
    bold: {
        fontWeight: 700,
        fontFamily: "timesRoman",
        fontSize: 12

    },
    flexRow: {
        flexDirection: 'row',
    },

});




// Create Document Component
const DemandLetter = (props: { showDemandLetterModal: any, setShowDemandLetterModal: any, demandLetterURL: any }) => {

    const [demandLetterData, setDemandLetterData] = useState<any>();

    // console.log(demandLetterData, "demandLetterData");

    const getDemandLetterData = async () => {

        // console.log("in getDemandLetterData")

        try {
            const customHeaders: any = {
                headers: {
                    key: getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY),
                    'client-code': 'myhome',
                },
            };
            const reqObj = {
                file_url: props?.demandLetterURL
            };
            // console.log(reqObj);

            const response = await axios.post(
                `${MODULES_API_MAP.AUTHENTICATION + GLOBAL_API_ROUTES.DOWNLOAD_DOCUMNETS}`,
                reqObj,
                customHeaders
            );

            // console.log(response.data, "res123");


            if (response) {
                // Handle the response data here
                setDemandLetterData(response.data);
            }
        } catch (error) {
            console.error('Error downloading the Demand Letter:', error);
        }
    };

    useEffect(() => {
        getDemandLetterData()
    }, []);



    return (
        <Dialog
            open={props?.showDemandLetterModal}
            onClose={() => props?.setShowDemandLetterModal(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{ style: { width: '100%', height: '100%' } }}
        >
            {demandLetterData && < CustomPDFViewer
                type='view'
                buttonElement=''
                fileName=''
                onClose={() => props?.setShowDemandLetterModal(false)} // Close dialog when PDF is closed
            >
                <Document>
                    <Page>
                        <View style={{ ...demandLetterStyles.normalText, lineHeight: 1.2, margin: 50, }}>
                            <View style={{ marginTop: 35 }}>
                                <View style={{ ...demandLetterStyles.flexRow, }}>
                                    <Text>Customer Code :</Text>
                                    <Text>{parseInt(demandLetterData?.customerAccountInfo?.customer_number)}</Text>
                                </View>
                                <Text>MHC/MKT/ {parseInt(demandLetterData?.customerAccountInfo?.sale_order_number)}</Text>
                                <Text>Date : {moment((demandLetterData?.unit_milestones[demandLetterData?.unit_milestones.length - 1]?.invoice_date) || (demandLetterData?.unit_milestones[0]?.invoice_date) ).format('DD.MM.YYYY')}</Text>
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Text>To</Text>
                                <Text>{getTitleNameWithDots(demandLetterData.customerAccountInfo?.customer_title)} {demandLetterData.customerAccountInfo?.full_name}</Text>
                                {demandLetterData?.jointCustomerAccountInfo?.map((customer: any, index: any) => (
                                    <Text key={index}>{getTitleNameWithDots(customer?.customer_title ? customer?.customer_title + "" : "")}{customer?.full_name} <br /></Text>
                                ))}
                                <Text>{demandLetterData?.customerAccountInfo?.customer_flat_house_number}</Text>
                                <Text>{demandLetterData?.customerAccountInfo?.address_street1}</Text>
                                <Text>{demandLetterData?.customerAccountInfo?.address_street2}</Text>
                                <Text>{demandLetterData?.customerAccountInfo?.address_city}-{demandLetterData?.customerAccountInfo?.pin_code}</Text>
                            </View>

                            <Text style={{ marginTop: 10, ...demandLetterStyles.bold }}>Sub: Intimation for Payment</Text>

                            <View style={{ marginTop: 20 }}>
                                <Text>Dear Sir/Madam,</Text>
                                <Text style={{ marginTop: 10 }}>Seasons Greetings from {capitalizeFirstLetter(demandLetterData?.customerAccountInfo?.company_name)}</Text>
                            </View>

                            <View style={{ marginTop: 10, }}>
                                <Text style={{textAlign: 'justify'}}>
                                    We are happy to inform you that _______(milestone description (tbd))______ of {demandLetterData?.customerAccountInfo?.project_name} Block {parseInt(demandLetterData?.customerAccountInfo?.tower_code)} has been completed wherein you have booked Flat No {parseInt(demandLetterData?.customerAccountInfo?.floor_no)}{demandLetterData?.customerAccountInfo?.unit_no}. The latest update on the progress of our project construction is updated on our website {demandLetterData?.customerAccountInfo?.company_website}.
                                </Text>
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Text style={{textAlign: 'justify'}}>
                                    As per the statement of account enclosed, a sum of Rs. {formatNumberToIndianSystem(Math.round(parseFloat(demandLetterData?.totalAmounts.totalInvoiceGstSgstAmount)
                                            - parseFloat(demandLetterData?.totalAmounts.totalReceiptAmount)))} ( {convertNumberToWords(Math.round(parseFloat(demandLetterData?.totalAmounts.totalInvoiceGstSgstAmount)
                                                - parseFloat(demandLetterData?.totalAmounts.totalReceiptAmount)))} ) is due for payment.
                                    {parseInt(demandLetterData?.totalAmounts?.totalOverDueAmount) > 0 && (
                                        <>
                                            {" Out of this amount, a sum of Rs. "}{formatNumberToIndianSystem(parseInt(demandLetterData?.totalAmounts?.totalOverDueAmount))}
                                            {" ( "}{convertNumberToWords(parseInt(demandLetterData?.totalAmounts?.totalOverDueAmount))}{") has fallen overdue."}
                                        </>
                                    )}
                                </Text>
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Text style={{textAlign: 'justify'}}>
                                    We request you to make the payment of {parseInt(demandLetterData?.totalAmounts?.totalOverDueAmount) > 0 && (
                                        <>
                                        {"Rs. " }{formatNumberToIndianSystem(parseInt(demandLetterData?.totalAmounts?.totalOverDueAmount))}
                                        {" ( "}{convertNumberToWords(parseInt(demandLetterData?.totalAmounts?.totalOverDueAmount))}{") immediately and balance of"}
                                        </>
                                        // net balance to be paid excluding overdue amount
                                    )} Rs.{formatNumberToIndianSystem(Math.round((parseFloat(demandLetterData?.totalAmounts?.totalInvoiceGstSgstAmount)) -
                                        parseFloat(demandLetterData?.totalAmounts?.totalReceiptAmount) - (parseFloat(demandLetterData?.totalAmounts?.totalOverDueAmount))))} ( {convertNumberToWords(Math.round(parseFloat(demandLetterData?.totalAmounts?.totalInvoiceGstSgstAmount) -
                                            parseFloat(demandLetterData?.totalAmounts?.totalReceiptAmount) - (parseFloat(demandLetterData?.totalAmounts?.totalOverDueAmount))))} ) on or before {new Date(demandLetterData?.totalAmounts?.currentInvoiceDueDate).toLocaleDateString('ru-RU')} in favor of "{demandLetterData?.customerAccountInfo?.developer_bank_account_payee_details}."
                                    [Bank Name: {demandLetterData?.customerAccountInfo?.developer_bank_account_name} A/C No.: {demandLetterData?.customerAccountInfo?.developer_bank_account_number} IFSC Code: {demandLetterData?.customerAccountInfo?.developer_bank_account_ifsc_code} SWIFT Code: {demandLetterData?.customerAccountInfo?.developer_bank_swift_code} Branch: {demandLetterData?.customerAccountInfo?.developer_bank_branch_name}] Payable at {demandLetterData?.customerAccountInfo?.project_city}.
                                </Text>
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Text style={{textAlign: 'justify'}}>For any delayed payments, {parseInt(demandLetterData?.unit_milestones[0]?.late_payment_interest)}% interest will be applied.</Text>
                                <Text style={{ marginTop: 10 }}>
                                    In case you have already made the above payments in the meantime, kindly ignore this letter.
                                </Text>
                                <Text style={{ marginTop: 10 }}>
                                    For any further clarifications, kindly contact us at {demandLetterData?.customerAccountInfo?.crm_mobile_number} or mail us at
                                    {demandLetterData?.customerAccountInfo?.crm_email_id}.
                                </Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{textAlign: 'justify'}}>Thanking and assuring you of our best services always.</Text>
                                <Text style={{ marginTop: 10 }}>For {demandLetterData?.customerAccountInfo?.company_name}</Text>
                                <Text style={{ marginTop: 20 }}>Authorized Signatory</Text>
                            </View>
                        </View>
                    </Page>
                    <Page size="A4" style={globalStyles.page}>
                        <View>
                            {/* Header */}
                            <View style={{ ...globalStyles.center, marginBottom: 20 }} fixed>
                                <Text style={{ ...globalStyles.bold, fontSize: 12 }}>
                                    {demandLetterData?.customerAccountInfo?.company_name}
                                </Text>
                                <Text style={{ ...globalStyles.bold, fontSize: 10 }}>
                                    Demands Vs Receipts Summary Report as on {moment(new Date()).format('DD.MM.YYYY')}
                                </Text>
                            </View>

                            {/* Customer Info */}
                            <View style={{ ...globalStyles.flexRow, justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <View>
                                    {/* Project Name */}
                                    <View style={globalStyles.flexRow}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 100 }}>Project Name</Text>
                                        <Text style={globalStyles.bold}>: {demandLetterData?.customerAccountInfo?.project_name}</Text>
                                    </View>

                                    {/* Customer Name */}
                                    <View style={globalStyles.flexRow}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 100 }}>Customer Name</Text>
                                        <Text style={globalStyles.bold}>:</Text>
                                        <Text style={{ ...globalStyles.bold, width: 215, paddingLeft: 2 }}>
                                            {getTitleNameWithDots(demandLetterData?.customerAccountInfo?.customer_title)} {demandLetterData?.customerAccountInfo?.full_name}
                                            {demandLetterData?.jointCustomerAccountInfo?.map((customer: any, index: any) => (
                                                <Text key={index} style={{ paddingLeft: 4 }}> & {getTitleNameWithDots(customer?.customer_title)} {customer?.full_name}
                                                </Text>
                                            ))}
                                        </Text>
                                    </View>

                                    {/* Customer Number */}
                                    <View style={globalStyles.flexRow}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 100 }}>Customer No.</Text>
                                        <Text style={globalStyles.bold}>: {parseInt(demandLetterData?.customerAccountInfo?.customer_number)}</Text>
                                    </View>

                                    {/* Block/Tower Name */}
                                    <View style={globalStyles.flexRow}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 100 }}>Block/Tower Name</Text>
                                        <Text style={globalStyles.bold}>: Block {parseInt(demandLetterData?.customerAccountInfo?.tower_code)}</Text>
                                    </View>
                                </View>

                                {/* Flat Information */}
                                <View>
                                    <View style={{ ...globalStyles.flexRow, justifyContent: 'flex-end' }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, textAlign: 'right' }}>Flat No:</Text>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 80, textAlign: 'right' }}>
                                            {parseInt(demandLetterData?.customerAccountInfo?.floor_no)}{demandLetterData?.customerAccountInfo?.unit_no}
                                        </Text>
                                    </View>

                                    {/* Sale Area */}
                                    <View style={{ ...globalStyles.flexRow, justifyContent: 'flex-end' }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, textAlign: 'right' }}>Sale Area:</Text>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 80, textAlign: 'right' }}>
                                            {formatNumberToIndianSystem(demandLetterData?.customerAccountInfo?.saleable_area)}
                                        </Text>
                                    </View>

                                    {/* Cost of Flat */}
                                    <View style={{ ...globalStyles.flexRow, justifyContent: 'flex-end' }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, textAlign: 'right' }}>Cost of the Flat:</Text>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 80, textAlign: 'right' }}>
                                            {formatNumberToIndianSystem(parseFloat(demandLetterData?.customerAccountInfo?.total_sale_consideration) + parseFloat(demandLetterData?.customerAccountInfo?.total_gst_amount))}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Table Header */}
                            <View style={{ ...globalStyles.flexRow, border: '1.5px solid black', backgroundColor: '#808080', height: 20, alignItems: 'flex-end', marginBottom: 5 }} fixed>
                                <Text style={{ ...globalStyles.bold, width: 68 }}>DATE</Text>
                                <Text style={{ ...globalStyles.bold, width: 110 }}>TYPE</Text>
                                <Text style={{ ...globalStyles.bold, width: 140 }}>NARRATION</Text>
                                <Text style={{ ...globalStyles.bold, width: 90, textAlign: 'right' }}>DEMANDS</Text>
                                <Text style={{ ...globalStyles.bold, width: 120, textAlign: 'right' }}>RECEIPTS</Text>
                            </View>

                            {/* Table Body */}
                            {demandLetterData?.unit_milestones?.map((milestone: any, idx: any) => (
                                <View key={idx}>
                                    {/* If receipt_id is undefined, display milestone details */}
                                    {milestone.receipt_id === undefined ? (
                                        <>
                                            {/* Milestone Data */}
                                            <View style={globalStyles.tableRow}>
                                                <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 70 }}>
                                                    {moment(milestone.milestone_completion_date || milestone.invoice_date).format('DD.MM.YYYY')}
                                                </Text>
                                                <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 50 }}>Inst</Text>
                                                <Text style={{ ...globalStyles.normalText, lineHeight: 1.2, paddingTop: 5, width: 200 }}>
                                                    {milestone.milestone_description || milestone.invoice_description}
                                                </Text>
                                                <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 90, textAlign: 'right' }}>
                                                    {formatNumberToIndianSystem(milestone.milestone_amount || milestone.invoice_amount)}
                                                </Text>
                                                <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 120, textAlign: 'right' }}>0.00</Text>
                                            </View>

                                            {/* Central Tax */}
                                            {milestone.cgst_amount && (
                                                <View style={globalStyles.tableRow}>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 70 }}>
                                                        {moment(milestone.milestone_completion_date || milestone.invoice_date).format('DD.MM.YYYY')}
                                                    </Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 50 }}>Drcr</Text>
                                                    <Text style={{ ...globalStyles.normalText, lineHeight: 1.2, paddingTop: 5, width: 200 }}>Central Tax Charged</Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 90, textAlign: 'right' }}>
                                                        {formatNumberToIndianSystem(parseFloat(milestone.cgst_amount))}
                                                    </Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 120, textAlign: 'right' }}>0.00</Text>
                                                </View>
                                            )}

                                            {/* State Tax */}
                                            {milestone.sgst_amount && (
                                                <View style={globalStyles.tableRow}>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 70 }}>
                                                        {moment(milestone.milestone_completion_date || milestone.invoice_date).format('DD.MM.YYYY')}
                                                    </Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 50 }}>Drcr</Text>
                                                    <Text style={{ ...globalStyles.normalText, lineHeight: 1.2, paddingTop: 5, width: 200 }}>State Tax Charged</Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 90, textAlign: 'right' }}>
                                                        {formatNumberToIndianSystem(parseFloat(milestone.sgst_amount))}
                                                    </Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 120, textAlign: 'right' }}>0.00</Text>
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <View style={globalStyles.tableRow}>
                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 70 }}>{moment(milestone.receipt_date).format('DD.MM.YYYY')}</Text>
                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 50 }}>Recpt</Text>
                                            <Text style={{ ...globalStyles.normalText, lineHeight: 1.2, paddingTop: 5, width: 200 }}>{milestone.payment_narration}</Text>
                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 90, textAlign: 'right' }}>0.00</Text>
                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 120, textAlign: 'right' }}>
                                                {formatNumberToIndianSystem(milestone.receipt_amount)}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}


                            {/* Footer Total */}
                            <View style={{ ...globalStyles.flexRow, borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                                <Text style={{ width: 179 }}></Text>
                                <Text style={{ ...globalStyles.bold, fontSize: 11, width: 140 }}>Total</Text>
                                <Text style={{ ...globalStyles.bold, fontSize: 11, width: 90, textAlign: 'right' }}>
                                    {formatNumberToIndianSystem(demandLetterData?.totalAmounts?.totalInvoiceGstSgstAmount)}
                                </Text>
                                <Text style={{ ...globalStyles.bold, fontSize: 11, width: 120, textAlign: 'right' }}>
                                    {formatNumberToIndianSystem(demandLetterData?.totalAmounts?.totalReceiptAmount)}
                                </Text>
                            </View>

                            {/* Net Balance */}
                            <View style={{ ...globalStyles.flexRow, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <View style={{ ...globalStyles.flexRow, borderBottom: '1px solid black', width: '66.3%' }}>
                                    <Text style={{ ...globalStyles.bold, fontSize: 11, width: 100 }}>Net Balance</Text>
                                    <Text style={{ ...globalStyles.bold, fontSize: 11, width: 116, textAlign: 'right' }}>
                                        {formatNumberToIndianSystem(Math.round(parseFloat(demandLetterData?.totalAmounts.totalInvoiceGstSgstAmount)
                                            - parseFloat(demandLetterData?.totalAmounts.totalReceiptAmount)))}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Footer Page Number */}
                        <View style={{ ...globalStyles.pagenumber, ...globalStyles.normalText, fontSize: 8, paddingTop: 5, }} fixed>
                            <Text>
                                **If any discrepancies in the Demand Vs Receipts statement kindly revert back to us immediately
                            </Text>
                            <Text render={({ pageNumber, totalPages }) => `Page:  ${pageNumber} of ${totalPages}`} />
                        </View>
                    </Page>
                </Document>
            </CustomPDFViewer>}
        </Dialog >
    );
}

export default DemandLetter;