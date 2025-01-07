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
import { capitalizeFirstLetter, checkForFalsyValues, formatNumberToIndianSystem, formatNumberToIndianSystemArea, getTitleNameWithDots } from '@Src/utils/globalUtilities';
import moment from 'moment';
import React from 'react';
import timesRomanNormal from "../../assets/fonts/times-ro.ttf"
import timesRomanBold from "../../assets/fonts/timr65w.ttf"
import { Padding } from '@mui/icons-material';
import CustomPDFViewer from '@Components/custom-pdf-viewer/CustomPDFViewer';


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
    }
});




// Create Document Component
const Statements = (props: { showAccountStatementModel: any, setShowAccountStatementModel: any, unitId: any, custUnitId: any, custProfileId: any }) => {
    const dispatch = useAppDispatch();
    const [accountStatementData, setAccountStatementData] = useState<any>();
    const [lastRaisedMilestoneData, setLastRaisedMilestoneData] = useState<any>();
    const [statmentData, setStatmentData] = useState<any>();
    const modalRef = useRef<HTMLDivElement>(null);

    const getAccountStatementData = async () => {
        try {
            const URL = `${GLOBAL_API_ROUTES.GET_STATEMENT_OF_ACCOUNT}?cust_profile_id=${props?.custProfileId}&cust_unit_id=${props?.custUnitId}&type=${'View'}`.trim();
            const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, URL).GET();
            if (response?.success) {
                setAccountStatementData(response?.data);
                setStatmentData(response?.data?.statement || {});
                setLastRaisedMilestoneData(response?.data?.unit_milestones?.filter((milestone: any) => milestone.milestone_status === 'raised').pop());
            }
        } catch (error) {
            console.error('Error downloading the Account Statment:', error);
        }
    };

    useEffect(() => {
        if (props?.custUnitId && props?.custProfileId) {
            getAccountStatementData();
        }
    }, [props?.custUnitId]);

    return (
        <Dialog
            open={props?.showAccountStatementModel}
            onClose={() => props?.setShowAccountStatementModel(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{ style: { width: '100%', height: '100%' } }}
        >
            <CustomPDFViewer
                type='view'
                buttonElement=''
                fileName=''
                onClose={() => props?.setShowAccountStatementModel(false)} // Close dialog when PDF is closed
            >
                <Document>
                    <Page id='1' debug={false} size={'A4'} style={{ ...globalStyles.page, }}>
                        <View>
                            <View style={{ ...globalStyles.center, marginBottom: 20 }} fixed>
                                <Text style={{ ...globalStyles.bold, fontSize: 12 }}>
                                    {accountStatementData?.company_name}
                                </Text>
                                <Text style={{ ...globalStyles.bold, fontSize: 10 }}>
                                    Demands Vs Receipts Summary Report as on {moment(new Date()).format('DD.MM.YYYY')}
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.flexRow, ...{ justifyContent: 'space-between', alignItems: 'flex-end', } }}>
                                <View>
                                    <View style={{ ...globalStyles.flexRow }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 100, }}>Project Name</Text>
                                        <Text style={{ ...globalStyles.bold }}>: {accountStatementData?.project_name}</Text>
                                    </View>
                                    <View style={{ ...globalStyles.flexRow }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 100 }}>Customer Name</Text>
                                        <Text style={globalStyles.bold}>:
                                        </Text>
                                        <Text style={{ ...globalStyles.bold, width: 215, paddingLeft: 2 }}>
                                            {getTitleNameWithDots(accountStatementData?.customer_title)} {accountStatementData?.full_name}
                                            {accountStatementData?.joint_customer_names?.map((customer: any, index: any) => {
                                                return (
                                                    <Text key={index} style={{ paddingLeft: 4 }}>
                                                        &nbsp;& {getTitleNameWithDots(customer?.customer_title)} {customer?.full_name}
                                                    </Text>
                                                )
                                            })}
                                        </Text>
                                    </View>
                                    <View style={{ ...globalStyles.flexRow }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 100 }}>Customer No.</Text>
                                        <Text style={{ ...globalStyles.bold, }}>: {accountStatementData?.customer_number}</Text>
                                    </View>
                                    <View style={{ ...globalStyles.flexRow }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 100 }}>Block/Tower Name</Text>
                                        <Text style={{ ...globalStyles.bold, }}>: Block {parseInt(accountStatementData?.tower_code)?.toString()}</Text>
                                    </View>
                                </View>
                                <View>
                                    <View style={{ ...globalStyles.flexRow, justifyContent: 'flex-end', }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, textAlign: 'right' }}>Flat No:</Text>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 80, textAlign: 'right' }}> {parseInt(accountStatementData?.floor_no)}{accountStatementData?.unit_no}</Text>
                                    </View>
                                    <View style={{ ...globalStyles.flexRow, justifyContent: 'flex-end' }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, textAlign: 'right' }}>Sale Area:</Text>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 80, textAlign: 'right' }}>{formatNumberToIndianSystem(accountStatementData?.saleable_area)}</Text>
                                    </View>
                                    <View style={{ ...globalStyles.flexRow, justifyContent: 'flex-end' }}>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, textAlign: 'right' }}>Cost of the Flat:</Text>
                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 80, textAlign: 'right' }}>{formatNumberToIndianSystem(accountStatementData?.total_sale_consideration_with_gst)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ ...globalStyles.flexRow, ...{ border: '1.5px solid black', backgroundColor: "#808080", height: 20, alignItems: "flex-end", marginBottom: 5 } }} fixed>
                                <Text style={{ ...globalStyles.bold, width: 68 }}>DATE</Text>
                                <Text style={{ ...globalStyles.bold, width: 110 }}>TYPE</Text>
                                <Text style={{ ...globalStyles.bold, width: 140, }}>NARRATION</Text>
                                <Text style={{ ...globalStyles.bold, width: 90, textAlign: 'right' }}>DEMANDS</Text>
                                <Text style={{ ...globalStyles.bold, width: 120, textAlign: 'right' }}>RECEIPTS</Text>
                            </View>
                            <View style={globalStyles.tableContainerNew}>
                                {statmentData && Object.keys(statmentData).map((dateKey, index) => {
                                    const data = statmentData[dateKey];
                                    return (
                                        <View key={index}>
                                            {data?.invoiceData?.map((invoice: any, idx: any) => (
                                                <React.Fragment key={`invoice-${idx}`}>
                                                    <View style={globalStyles.tableRow}>
                                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 70 }}>{checkForFalsyValues(moment(invoice?.milestone_completion_date || invoice?.transaction_date || invoice?.invoice_date).format('DD.MM.YYYY'))}</Text>
                                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 50 }}>{invoice?.rcpt_text || 'Inst'}</Text>
                                                        <Text style={{ ...globalStyles.normalText, lineHeight: 1.2, paddingTop: 5, width: 200 }}>{checkForFalsyValues(invoice?.milestone_description || invoice?.payment_narration || invoice?.invoice_description)}</Text>
                                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 90, textAlign: 'right' }}>
                                                            {checkForFalsyValues(formatNumberToIndianSystem(invoice?.milestone_amount || invoice?.receipt_amount || invoice?.invoice_amount))}
                                                        </Text>
                                                        <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 120, textAlign: 'right' }}>0.00</Text>
                                                    </View>
                                                    ...globalStyles.normalText, paddingTop:5,
                                                    {invoice?.cgst_amount && (
                                                        <View style={globalStyles.tableRow}>
                                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 70 }}>{checkForFalsyValues(moment(invoice?.milestone_completion_date || invoice?.transaction_date || invoice?.invoice_date).format('DD.MM.YYYY'))}</Text>
                                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 50 }}>Drcr</Text>
                                                            <Text style={{ ...globalStyles.normalText, lineHeight: 1.2, paddingTop: 5, width: 200 }}>Central Tax Charged</Text>
                                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 90, textAlign: 'right' }}>
                                                                {checkForFalsyValues(formatNumberToIndianSystem(Math.round(parseFloat(invoice?.cgst_amount))))}
                                                            </Text>
                                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 120, textAlign: 'right' }}>0.00</Text>
                                                        </View>
                                                    )}

                                                    {invoice?.sgst_amount && (
                                                        <View style={globalStyles.tableRow}>
                                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 70 }}>{checkForFalsyValues(moment(invoice?.milestone_completion_date || invoice?.transaction_date || invoice?.invoice_date).format('DD.MM.YYYY'))}</Text>
                                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 50 }}>Drcr</Text>
                                                            <Text style={{ ...globalStyles.normalText, lineHeight: 1.2, paddingTop: 5, width: 200 }}>State Tax Charged</Text>
                                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 90, textAlign: 'right' }}>
                                                                {checkForFalsyValues(formatNumberToIndianSystem(Math.round(parseFloat(invoice?.sgst_amount))))}
                                                            </Text>
                                                            <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 120, textAlign: 'right' }}>0.00</Text>
                                                        </View>
                                                    )}
                                                </React.Fragment>
                                            ))}

                                            {data?.ReceiptData?.map((receipt: any, idx: any) => (
                                                <View key={`receipt-${idx}`} wrap={false} style={{ ...globalStyles.tableRow }}>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 70 }}>
                                                        {checkForFalsyValues(moment(receipt?.receipt_date).format('DD.MM.YYYY'))}
                                                    </Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 50 }}>{capitalizeFirstLetter(receipt?.rcpt_text)}</Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, lineHeight: 1.2, width: 200, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        {capitalizeFirstLetter(receipt?.payment_narration)}
                                                    </Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 90, textAlign: 'right' }}>0.00</Text>
                                                    <Text style={{ ...globalStyles.normalText, paddingTop: 5, width: 120, textAlign: 'right' }}>
                                                        {checkForFalsyValues(formatNumberToIndianSystem(receipt?.receipt_amount))}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    );
                                })}
                            </View>
                            );
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ borderTop: '1px solid black', borderBottom: '1px solid black' } }}>
                            <Text style={{ width: 179 }}></Text>
                            <Text style={{ ...globalStyles.bold, fontSize: 11, width: 140 }}>Total</Text>
                            <Text style={{ ...globalStyles.bold, fontSize: 11, width: 90, textAlign: 'right' }}>{formatNumberToIndianSystem(accountStatementData?.total_amount_with_taxes)}</Text>
                            <Text style={{ ...globalStyles.bold, fontSize: 11, width: 120, textAlign: 'right' }}>{formatNumberToIndianSystem(accountStatementData?.total_payable_amount)}</Text>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', } }}>
                            <View style={{ ...globalStyles.flexRow, ...{ borderBottom: '1px solid black', width: '66.3%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' } }}>
                                <View style={globalStyles.flexRow}>
                                    <Text style={{ ...globalStyles.bold, fontSize: 11, width: 100 }}>Net Balance</Text>
                                    <Text style={{ ...globalStyles.bold, fontSize: 11, width: 116, textAlign: 'right' }}>{formatNumberToIndianSystem(accountStatementData?.net_balance_amount)}</Text>
                                    <Text style={{}}></Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.pagenumber, ...globalStyles.normalText, fontSize: 8, paddingTop: 5, }} fixed>
                            <Text>
                                **If any discrepancies in the Demand Vs Receipts statement kindly revert back to us immediately
                            </Text>
                            <Text
                                render={({ pageNumber, totalPages }) => `Page:  ${pageNumber} of ${totalPages}`}
                            />
                        </View>
                    </Page>
                </Document>
            </CustomPDFViewer>
        </Dialog >
    );
}

export default Statements;