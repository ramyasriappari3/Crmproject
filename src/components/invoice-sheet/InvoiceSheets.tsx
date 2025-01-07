import { Page, Text, View, Document, StyleSheet, Font, PDFViewer } from '@react-pdf/renderer';
import React, { useEffect, useRef, useState } from 'react';
import { capitalizeFirstLetter, checkForFalsyValues, convertNumberToWords, formatNumberToIndianSystem, formatNumberToIndianSystemArea, getSumOfArrayObjectKey, numberToOrdinals } from '@Src/utils/globalUtilities';
import './InvoiceSheet.scss';
import { IAPIResponse } from '@Src/types/api-response-interface'
import { MODULES_API_MAP, httpService } from '@Src/services/httpService'
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes'
import { useAppDispatch } from '@Src/app/hooks'
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice'
import moment from 'moment';
import { Dialog } from '@mui/material';
import Times from '../../assets/fonts/times.ttf';
import TimesBold from '../../assets/fonts/timr65w.ttf'
import CustomPDFViewer from '@Components/custom-pdf-viewer/CustomPDFViewer';
import Api from "../../app/admin/api/Api";
import { useParams } from "react-router-dom";
import userSessionInfo from "../../app/admin/util/userSessionInfo";

Font.register({
    family: 'timesNew',
    fonts: [
        {
            src: Times,
            fontWeight: 400,

        },
    ]
})

Font.register(
    {
        family: 'timesBold',
        fonts: [
            {
                src: TimesBold,
                fontWeight: 700,
            },
        ]
    },
)

// Define global styles for the document
const styles = StyleSheet.create({
    bold: {
        fontWeight: 700,
        fontFamily: "timesBold",
    },
    centeredContainer: {
        width: '100%', // Centered content width, adjusted for padding
        //marginHorizontal: 'auto', // Center horizontally
        paddingHorizontal: 1, // Equal padding on left and right
    },
    page: {
        position: 'relative',
        padding: 35, // Padding from page edges
    },
    contentContainer: {
        marginLeft: '2mm', // Margin around the border container
    },
    borderContainer: {
        border: '1px solid black', // Solid border around the container
        position: 'relative',
        paddingBottom: '0px', // Padding at the bottom to fit the lines correctly
        width: 510,
    },
    firstLineContainer: {

        borderBottom: '1px solid black', // Border for the first line

        display: 'flex', // Background to ensure text visibility
        flexDirection: 'row',

    },
    flexItem: {
        flex: 1, // Each item takes an equal amount of space
        alignItems: 'center',
        fontSize: 8.5,
        fontWeight: 'black',
        textAlign: 'left', // Align text to the left
        position: 'relative',
        borderRight: '1px solid black', // Add border-right for separation
        padding: '0 2mm', // Padding inside each flex item
    },
    verticalLine: {
        borderLeft: '1px solid black',
        height: '15mm', // Make vertical line span the height of the container
        position: 'absolute',
        top: 0,
        width: '1px', // Width of the vertical line
    },
    textItem: {
        textAlign: 'left',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    lastColumn: {
        borderRight: 'none', // Remove the right border for the last column in each row
    },
    secondLineContainer: {
        flexDirection: 'row', // Arrange columns side by side
        height: '30mm', // Height for the second line container
        borderBottom: '1px solid black',
    },
    column: {
        flex: 1, // Each column takes up 50% width
        borderRight: '1px solid black', // Border-right for separation
        padding: '2mm 2mm 2mm 0mm', // Padding inside each column
        display: 'flex',
        flexDirection: 'column', // Stack text vertically
    },
    column1: {
        flex: 1, // Each column takes up 50% width
        display: 'flex',
        flexDirection: 'column', // Stack text vertically
    },

    thirdLineContainer: {
        padding: '2mm 2mm 2mm 0mm', // Padding inside the third line container
        borderBottom: '1px solid black', // Border for the third line
        height: '2mm', // Height for the third line container
        flexDirection: 'row',
        alignItems: 'center',
    },

    tableContainer: {
        borderBottom: '1px solid black', // Border for the third line
        flexDirection: 'row',
        alignItems: 'center',
    },
    ninthtLineContainer: {
        padding: '2mm 2mm 2mm 0mm', // Padding inside the third line container
        borderBottom: '1px solid black', // Border for the third line
        height: '2mm', // Height for the third line container
        flexDirection: 'row',
        alignItems: 'center',
    },
    irnText: {
        fontSize: 8.5,
        textAlign: 'left',
        paddingTop: '2px'
    },
    hsnText: {
        fontSize: 8.5,
        textAlign: 'left',
        paddingTop: '2px'
    },
    fourthLineContainer: {
        flexDirection: 'row', // Arrange columns side by side
        height: '5mm', // Height for the fourth line container
        borderBottom: '1px solid black', // Border for the fourth line
    },
    fifthLineContainer: {
        flexDirection: 'row', // Arrange columns side by side
        height: '30mm', // Height for the fourth line container
        borderBottom: '1px solid black', // Border for the fourth line
    },
    sixthLineContainer: {
        display: 'flex',
        flexDirection: 'row', // Arrange columns side by side
        borderBottom: '1px solid black', // Border for the fourth line
    },
    seventhLineContainer: {
        display: 'flex',
        flexDirection: 'row', // Arrange columns side by side
        borderBottom: '1px solid black', // Border for the fourth line
    },
    eleventhLineContainer: {
        display: 'flex',
        flexDirection: 'row', // Arrange columns side by side
        height: '5mm', // Height for the fourth line container
        borderBottom: '1px solid black', // Border for the fourth line
    },
    twelvethLineContainer: {
        display: 'flex',
        flexDirection: 'row', // Arrange columns side by side
        height: '10mm', // Height for the fourth line container
        borderBottom: '1px solid black', // Border for the fourth line
    },
    thirteenLineContainer: {
        display: 'flex',
        flexDirection: 'row', // Arrange columns side by side
        borderBottom: '1px solid black', // Border for the fourth line
    },
    fourteenLineContainer: {
        display: 'flex',
        flexDirection: 'row', // Arrange columns side by side
        height: '15mm', // Height for the fourth line container
        borderBottom: '1px solid black', // Border for the fourth line
    },
    fiftheenLineContainer: {
        display: 'flex',
        borderBottom: '1px solid black', // Border for the fourth line
        marginBottom: '2px'
    },
    sixteenLineContainer: {
        display: 'flex',
    },
    centerColumn: {
        flex: 1, // Each column takes up 50% width
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        borderRight: '1px solid black', // Border-right for separation
        textAlign: 'center',
    },
    centerColumn1: {
        flex: 1, // Each column takes up 50% width
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        textAlign: 'center',
    },
    remainingLinesContainer: {
        marginTop: '15mm', // Space between the fourth line and remaining lines
    },
    line: {
        borderBottom: '1px solid black',
        width: '100%', // Line extends to the full width of the border container
        marginVertical: '5mm', // Space between lines
    },
    section1: {
        marginBottom: '5mm', // Margin below section 1
        textAlign: 'center',
    },
    section2: {
        marginBottom: '0mm',
        textAlign: 'center', // Margin below section 2
    },

    subColumn70: {
        flex: 6, // 70% width
        padding: '1mm', // Padding inside each sub-column
    },
    subColumn30: {
        flex: 4, // 30% width
        padding: '1mm', // Padding inside each sub-column
    },

    padYHead: {
        paddingTop: 2,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 2
    },

    padHead: {
        padding: '2mm 2mm 0mm 2mm'
    },
    borderRight: {
        borderRight: "1px solid black"

    },
    column3: {
        flex: 0.3, // 5% width of the container
        borderRight: '1px solid black', // Border-right for separation
        padding: '1mm', // Padding inside each column
    },
    column10: {
        flex: 0.5, // 10% width of the container
        borderRight: '1px solid black', // Border-right for separation
        padding: '1mm', // Padding inside each column
    },
    column25: {
        flex: 2.5, // 30% width of the container
        borderRight: '1px solid black', // Border-right for separation
        padding: '1mm', // Padding inside each column
        textAlign: 'center'
    },
    column12_5: {
        flex: 1.25, // 12.5% width of the container
        borderRight: '1px solid black', // Border-right for separation
        padding: '1mm', // Padding inside each column
    },

    part1: {
        width: "42%",
        flexDirection: 'column',
        gap: 15,
    },
    part1SubSection: {
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
    },
    part1LabelSection: {
        flexDirection: 'row',
        justifyContent: "space-between",
        width: "30%",
    },
    part1LabelSections: {
        flexDirection: 'row',
        justifyContent: "space-between",
        width: "15%",
    },
    part1TextSection: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        width: "50%",
    },
    row: {
        display: 'flex',
        flexDirection: 'row', // Arrange columns horizontally
        borderBottom: '1px solid black', // Border between rows
        height: '20mm', // Set row height
    },
    firstColumn: {
        flex: 0.5, // Example: first column can have a different width if needed
    },
    text: {
        fontSize: 8.5,
        textAlign: 'center',
    },
    pSmall: {
        fontSize: 8.5,
        fontFamily: "timesNew",
    },

    p1: {
        fontSize: 8.5,
        fontFamily: "timesNew",
        alignItems: 'flex-start',
    },
    p2: {
        fontSize: 8.5,
        fontFamily: "timesNew",
        alignItems: 'flex-end',
    },
    borderTop: {
        borderTop: "1px solid black"
    },
    emptyLine: {
        height: '15mm', // Adjust the height for empty lines
    },
    section3: {
        marginTop: '10mm', // Margin above section 3
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexRows: {
        flexDirection: 'row',
        height: '30%'
    },
    watermark: {
        position: 'absolute',
        marginTop: '50%',
        transform: 'rotate(-45deg)',
        opacity: 0.2,
        fontSize: 60,
        color: '#656C7B',
    },
});

// Create Document Component
const Invoicesheets = (props: { showModal: any, setShowModal: any, unitId: any, custUnitId: any, paymentMilestoneId: any }) => {


    const [invoiceDataForMilestone, setInvoiceDataForMilestone] = useState<any>();
    const dispatch = useAppDispatch();
    const getInvoiceData = async (milestoneId: any) => {
        try {
            dispatch(showSpinner())
            const userInfo = userSessionInfo.logUserInfo();
            if (!userInfo) {
                const url = `${GLOBAL_API_ROUTES.GET_MILESTONE_INVOICE_DATA}?cust_unit_id=${props.custUnitId}&unit_id=${props.unitId}&milestone_id=${props?.paymentMilestoneId}&type=${'View'}`.trim();
                const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, url).GET();
                if (apiResponse?.success) {
                    // console.log(apiResponse?.data);
                    setInvoiceDataForMilestone(apiResponse?.data?.resultData[0]);
                }
                else {
                    throw new Error();
                }

            } else if (userInfo?.user_type_id == "internal") {
                const {
                    data,
                    status: responseStatus,
                    message,
                }: any = await Api.get("crm_invoices", {
                    cust_unit_id: props.custUnitId,
                    unit_id: props.unitId,
                    milestone_id: props?.paymentMilestoneId,
                    type: 'View'
                });
                if (responseStatus) {
                    setInvoiceDataForMilestone(data?.resultData[0]);
                }

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

    return (
        <Dialog
            open={props?.showModal}
            onClose={() => props?.setShowModal(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{ style: { width: '100%', height: '100%' } }}
        >
            <div style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <CustomPDFViewer type="" buttonElement='' fileName='' onClose={() => {props?.setShowModal(false)}} >
                    <Document>
                        <Page debug={false} size="A4" style={{ ...styles.page, position: "relative" }}>
                            {/* Content Container */}
                            <View style={styles.centeredContainer}>
                                <View>
                                    <Text style={{ ...styles.watermark }}>For Reference Only</Text>
                                </View>
                                <View style={styles.contentContainer}>
                                    {/* Section 1 */}
                                    <View style={styles.section1}>
                                        <Text style={{ ...styles.p1, ...styles.bold, fontSize: 14 }}>INVOICE</Text>
                                    </View>
                                    {/* Section 2 */}
                                    <View style={styles.section2}>
                                        <Text style={styles.p1}>Project Location: {checkForFalsyValues(invoiceDataForMilestone?.project_address)},
                                            {` ${checkForFalsyValues(invoiceDataForMilestone?.project_city)}`},
                                            {` ${checkForFalsyValues(invoiceDataForMilestone?.project_state)}`}-
                                            {`${checkForFalsyValues(invoiceDataForMilestone?.project_postal_code)}`}</Text>
                                    </View>

                                    {/* Border Container */}
                                    <View style={styles.borderContainer}>
                                        {/* First Line with Text and Vertical Lines */}
                                        <View style={styles.firstLineContainer}>
                                            <View style={{ ...styles.column, flexDirection: "row", padding: '0mm 0mm 0mm 0mm' }}>
                                                <Text style={{ ...styles.p1, borderRight: "1px", width: "51%", padding: '1mm 0mm 1mm 0mm' }}>GST No: {invoiceDataForMilestone?.developer_gst_number || 'N/A'}</Text>
                                                <Text style={{ ...styles.p1, padding: '1mm 0mm 1mm 0mm' }}>PAN No: {invoiceDataForMilestone?.developer_pan || 'N/A'}</Text>
                                            </View>
                                            <View style={{ ...styles.column1, flexDirection: "row" }}>
                                                <Text style={{ borderRight: "1px", width: "7%", paddingLeft: '1px' }}></Text>
                                                <Text style={{ ...styles.p1, borderRight: "1px", width: "50%", alignItems: "center", padding: '1mm 0mm 1mm 1mm' }}>Original for Buyer</Text>
                                                <Text style={{ borderRight: "1px", width: "7%" }}></Text>
                                                <Text style={{ ...styles.p1, padding: '1mm 0mm 1mm 1mm' }}>Duplicate for Seller</Text>
                                            </View>
                                        </View>
                                        {/* Second Line with Two Columns and Duplicate Text */}
                                        <View style={styles.secondLineContainer}>
                                            <View style={{ ...styles.column, paddingRight: '0px' }}>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            SAP Reference No
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {invoiceDataForMilestone?.invoice_number || 'N/A'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            GST Invoice No
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {invoiceDataForMilestone?.gst_invoice_number || 'N/A'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            Invoice Date
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {invoiceDataForMilestone?.invoice_date ? moment(invoiceDataForMilestone.invoice_date).format('DD.MM.YYYY') : 'N/A'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            State
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateName || 'N/A'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ ...styles.part1SubSection }}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            State Code
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={{ ...styles.part1TextSection }}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateCode || 'N/A'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.column1, paddingLeft: '1px' }}>
                                                <View style={styles.part1SubSection}>
                                                    <View style={{ ...styles.part1LabelSection, width: "50%", paddingTop: "5px" }}>
                                                        <Text style={{ ...styles.p1, ...styles.bold, fontSize: "10px" }}>
                                                            Sale Reference Data
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            Project Name
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {invoiceDataForMilestone?.project_name}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            Block/Tower No
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            Tower {parseInt((invoiceDataForMilestone?.tower_name)?.split(" ")[2]).toString()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            Floor Number
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {numberToOrdinals(invoiceDataForMilestone?.floor_no)}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            Flat Number
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {parseInt(invoiceDataForMilestone?.floor_no).toString()}{invoiceDataForMilestone?.unit_no}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSection}>
                                                        <Text style={styles.p1}>
                                                            Area
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {invoiceDataForMilestone?.saleable_area}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        {/* Third Line with IRN Number Text */}
                                        <View style={styles.thirdLineContainer}>
                                            <Text style={styles.irnText}>IRN Number:{checkForFalsyValues(invoiceDataForMilestone?.irn_number)}</Text>
                                        </View>
                                        {/* Fourth Line with Two Centered Columns */}
                                        <View style={styles.fourthLineContainer}>
                                            <View style={styles.centerColumn}>
                                                <Text style={styles.p1}>Billed to:</Text>
                                            </View>
                                            <View style={styles.centerColumn1}>
                                                <Text style={styles.p1}>Shipped to:</Text>
                                            </View>
                                        </View>
                                        {/* Fifth Line with Two Centered Columns */}
                                        <View style={styles.fifthLineContainer}>
                                            <View style={styles.column}>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSections}>
                                                        <Text style={styles.p1}>
                                                            Name
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={{ ...styles.part1TextSection }}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {invoiceDataForMilestone?.full_name}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSections}>
                                                        <Text style={styles.p1}>
                                                            Address
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={{ ...styles.part1TextSection, width: "70%" }}>
                                                        <View>
                                                            <Text style={styles.p1}>{invoiceDataForMilestone?.customer_flat_house_number}, {invoiceDataForMilestone?.address_street1}</Text>
                                                            <Text style={styles.p1}>{invoiceDataForMilestone?.address_street2}</Text>
                                                            <Text style={styles.p1}>{invoiceDataForMilestone?.address_city} , {invoiceDataForMilestone?.pin_code}  Ph No: {invoiceDataForMilestone?.mobile_number}</Text>
                                                        </ View>
                                                    </View>
                                                </View>
                                                <View style={styles.flexRow}>
                                                    <View style={{ ...styles.part1SubSection, gap: 24 }}>
                                                        <View style={{ ...styles.part1LabelSections }}>
                                                            <Text style={{ ...styles.p1 }}>
                                                                PAN NO :
                                                            </Text>
                                                        </View>
                                                        <View style={styles.part1TextSection}>
                                                            <Text style={{ ...styles.p1 }}>
                                                                {checkForFalsyValues(invoiceDataForMilestone?.pan_card)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ ...styles.part1SubSection, gap: 18 }}>
                                                        <View style={styles.part1LabelSections}>
                                                            <Text style={styles.p1}>
                                                                / GSTIN :
                                                            </Text>
                                                        </View>
                                                        <View style={{ ...styles.part1TextSection }}>
                                                            <Text style={{ ...styles.p1 }}>
                                                                {checkForFalsyValues(invoiceDataForMilestone?.gstin_number)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.column1, padding: '2mm 2mm 2mm 0mm' }}>
                                                <View style={{ ...styles.part1SubSection }}>
                                                    <View style={styles.part1LabelSections}>
                                                        <Text style={styles.p1}>
                                                            Name
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {invoiceDataForMilestone?.full_name}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.part1SubSection}>
                                                    <View style={styles.part1LabelSections}>
                                                        <Text style={styles.p1}>
                                                            Address
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={{ ...styles.part1TextSection, width: "70%" }}>
                                                        <View>
                                                            <Text style={styles.p1}>{invoiceDataForMilestone?.customer_flat_house_number}, {invoiceDataForMilestone?.address_street1}</Text>
                                                            <Text style={styles.p1}>{invoiceDataForMilestone?.address_street2}</Text>
                                                            <Text style={styles.p1}>{invoiceDataForMilestone?.address_city} , {invoiceDataForMilestone?.pin_code}</Text>
                                                        </ View>
                                                    </View>
                                                </View>
                                                <View style={styles.flexRow}>
                                                    <View style={{ ...styles.part1SubSection, gap: 24 }}>
                                                        <View style={styles.part1LabelSections}>
                                                            <Text style={styles.p1}>
                                                                PAN NO :
                                                            </Text>
                                                        </View>
                                                        <View style={styles.part1TextSection}>
                                                            <Text style={{ ...styles.p1 }}>
                                                                {checkForFalsyValues(invoiceDataForMilestone?.pan_card)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ ...styles.part1SubSection, gap: 18 }}>
                                                        <View style={styles.part1LabelSections}>
                                                            <Text style={styles.p1}>
                                                                / GSTIN :
                                                            </Text>
                                                        </View>
                                                        <View style={styles.part1TextSection}>
                                                            <Text style={{ ...styles.p1 }}>
                                                                {checkForFalsyValues(invoiceDataForMilestone?.gstin_number)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        {/* Sixth Line with Two Centered Columns */}
                                        <View style={styles.sixthLineContainer}>
                                            <View style={{ ...styles.column, flexDirection: "row", borderRight: "1px", padding: '0mm 0mm 0mm 0mm' }}>
                                                <View style={{ ...styles.p1, flexDirection: "row" }}>
                                                    <Text style={{ paddingRight: "30mm", paddingTop: "2mm", borderRight: "1px" }}>
                                                        State for GST : {getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateName || 'N/A'}
                                                    </Text>
                                                    <Text style={{ paddingTop: "2mm", paddingLeft: "2mm" }}>
                                                        State Code   :   {getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateCode || 'N/A'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.column1, flexDirection: "row", padding: '0mm 0mm 0mm 0mm' }}>
                                                <View style={{ ...styles.p1, flexDirection: "row" }}>
                                                    <Text style={{ paddingRight: "60mm" }}>
                                                    </Text>
                                                    <Text style={{ borderLeft: "1px", paddingTop: "2mm", paddingLeft: "2mm" }}>
                                                        State Code   :   {getStateAndStateCode(invoiceDataForMilestone?.project_location)?.stateCode || 'N/A'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        {/* Seventh Line with HSN Code  Text */}
                                        <View style={styles.seventhLineContainer}>
                                            <Text style={styles.hsnText}>HSN Code : {invoiceDataForMilestone?.hsn_code}</Text>
                                        </View>
                                        {/* Eight Line  */}
                                        <View style={{ ...styles.tableContainer }}>
                                            <View id='Header-Container' style={{ ...styles.flexRow, flex: '1' }}>
                                                <View style={[styles.padYHead, styles.borderRight, { width: "3%" }]}>
                                                    <Text style={styles.p1}>
                                                        Sl. No
                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, styles.borderRight, { width: "25%" }]}>
                                                    <Text style={styles.text}>
                                                        Name of Product/Milestone
                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, styles.borderRight, { width: "15%" }]}>
                                                    <Text style={styles.text}>
                                                        Gross Value
                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, styles.borderRight, { width: "15%" }]}>
                                                    <Text style={styles.text}>
                                                        Land Value
                                                    </Text>
                                                    <Text style={styles.text}>
                                                        (Note)
                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, styles.borderRight, { width: "15%" }]}>
                                                    <Text style={styles.text}>
                                                        Taxable Value
                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, styles.borderRight, { width: "13.5%" }]}>
                                                    <Text style={styles.text}>
                                                        CGST
                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, { width: "13.5%" }]}>
                                                    <Text style={styles.text}>
                                                        SGST
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Ninth Line  */}
                                        <View style={{ ...styles.tableContainer }}>
                                            <View style={{ ...styles.flexRow, flex: 1 }}>
                                                <View style={[styles.padYHead, styles.borderRight, { width: "3%" }]}>
                                                    <Text style={styles.p1}>

                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, styles.borderRight, { width: "25%" }]}>
                                                    <Text style={styles.text}>

                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, styles.borderRight, { width: "15%" }]}>
                                                    <Text style={styles.text}>
                                                        Rs.
                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, styles.borderRight, { width: "15%" }]}>
                                                    <Text style={styles.text}>
                                                        Rs.
                                                    </Text>
                                                </View>
                                                <View style={[styles.padHead, styles.borderRight, { width: "15%" }]}>
                                                    <Text style={styles.text}>
                                                        Rs.
                                                    </Text>
                                                </View>
                                                <View style={{ width: "13.5%" }}>
                                                    <View style={styles.flexRow}>
                                                        <Text style={{ ...styles.text, padding: '2mm 2mm 0mm 2mm', ...styles.borderRight, width: "40%" }} >
                                                            Rate
                                                        </Text>
                                                        <Text style={{ ...styles.text, padding: '2mm 2mm 0mm 2mm', ...styles.borderRight, width: "60%" }}>
                                                            Amount
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ width: "13.5%" }}>
                                                    <View style={styles.flexRow}>
                                                        <Text style={{ ...styles.text, padding: '2mm 2mm 0mm 2mm', ...styles.borderRight, width: "40%" }} >
                                                            Rate
                                                        </Text>
                                                        <Text style={{ ...styles.text, padding: '2mm 2mm 0mm 2mm', width: "60%" }}>
                                                            Amount
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ ...styles.tableContainer }}>
                                            <View style={{ ...styles.flexRow }}>
                                                <View style={{ ...styles.borderRight, width: "3%" }}>
                                                    <Text style={{ ...styles.p1, paddingTop: '2mm' }}>
                                                        1 .
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.borderRight, paddingTop: '2mm', width: "25%" }}>
                                                    <Text style={styles.p1}>
                                                        On Completion of 30 Days from
                                                    </Text>
                                                    <Text style={styles.p1}>
                                                        the Booking date
                                                    </Text>
                                                    <Text style={styles.p1}>
                                                        (As per the agreement of Sale /
                                                    </Text>
                                                    <Text style={styles.p1}>
                                                        Application for booking of flat)
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.borderRight, ...styles.p2, padding: "2mm 2mm 0mm 0mm", width: "15%" }}>
                                                    <Text>
                                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.gross_value).toFixed(2))}
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.borderRight, ...styles.p2, padding: "2mm 2mm 0mm 0mm", width: "15%" }}>
                                                    <Text>
                                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.land_value).toFixed(2))}
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.borderRight, ...styles.p2, padding: "2mm 2mm 0mm 0mm", width: "15%" }}>
                                                    <Text>
                                                        {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.taxable_value).toFixed(2))}
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.borderRight, width: "13.5%" }}>
                                                    <View style={{ ...styles.flexRow, flex: 1 }}>
                                                        <Text style={{ ...styles.p2, ...styles.borderRight, paddingTop: "5px", paddingLeft: '2px', width: "40%" }} >
                                                            {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.CGST_rate_on_taxable_vale))}%
                                                        </Text>
                                                        <Text style={{ ...styles.p2, width: "60%", padding: "5px 1px 0px 2px" }}>
                                                            {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.CGST_amount_on_taxable_value))}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ width: "13.5%" }}>
                                                    <View style={{ ...styles.flexRow, flex: 1 }}>
                                                        <Text style={{ ...styles.p2, ...styles.borderRight, paddingTop: "5px", paddingLeft: '2px', width: "40%" }} >
                                                            {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.SGST_rate_on_taxable_value))}%
                                                        </Text>
                                                        <Text style={{ ...styles.p2, width: "60%", padding: "5px 1px 0px 2px" }}>
                                                            {formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.SGST_amount_on_taxable_value))}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ ...styles.eleventhLineContainer }}>
                                        </View>
                                        <View style={{ ...styles.twelvethLineContainer }}>
                                            <View style={{ ...styles.column, paddingRight: '0px' }}>
                                                <View>
                                                    <Text style={{ ...styles.p1 }}>Note: Deduction of land value from the Gross Value as per</Text>
                                                    <Text style={{ ...styles.p1 }}>Notification 11/2017 Central Tax</Text>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.column1, flexDirection: "row" }} >
                                                <View style={{ ...styles.column, width: "50%", padding: "3px 0px 3px 0px" }}>
                                                    <View style={{ borderBottom: "1px" }}>
                                                        <Text style={{ ...styles.p1, ...styles.bold, fontSize: "10px", paddingBottom: '2px' }}>Total Amount Before GST:</Text>
                                                    </View>
                                                    <View style={{ ...styles.p1, padding: "2px 0px 2px 0px" }}>
                                                        <Text>Add Central Tax (CGST):</Text>
                                                    </View>
                                                </View>
                                                <View style={{ ...styles.column, borderRight: "0px", width: "50%", padding: "3px 0px 3px 0px" }}>
                                                    <View style={{ borderBottom: "1px", alignItems: 'flex-end', padding: "3px 2px 3px 0px" }}>
                                                        <Text style={{ ...styles.p1, paddingBottom: '2px' }}>{formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoice_amount)?.toFixed(2))}</Text>
                                                    </View>
                                                    <View style={{ ...styles.p1, alignItems: 'flex-end', padding: "3px 2px 3px 0px" }}>
                                                        <Text style={{ ...styles.p1 }}>{formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.CGST_amount_on_taxable_value))}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ ...styles.thirteenLineContainer }}>
                                            <View style={{ ...styles.column, paddingRight: '0px' }}>
                                                <Text style={{ ...styles.p1, ...styles.bold, fontSize: "10px" }}>Bank Details</Text>
                                                <View style={{ ...styles.part1SubSection, gap: 2 }}>
                                                    <View style={{ ...styles.part1LabelSection }}>
                                                        <Text style={styles.p1}>
                                                            Name of the A/C
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {capitalizeFirstLetter(invoiceDataForMilestone?.developer_bank_account_payee_details)}
                                                        </Text>
                                                    </View>

                                                </View>
                                                <View style={{ ...styles.part1SubSection, gap: 2 }}>
                                                    <View style={{ ...styles.part1LabelSection }}>
                                                        <Text style={styles.p1}>
                                                            Bank & Branch
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {invoiceDataForMilestone?.developer_bank_account_name},
                                                        </Text>
                                                        <Text style={{ ...styles.p1, paddingLeft: "25px" }}>
                                                            {invoiceDataForMilestone?.developer_bank_branch_name}.
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ ...styles.part1SubSection, gap: 2 }}>
                                                    <View style={{ ...styles.part1LabelSection }}>
                                                        <Text style={styles.p1}>
                                                            Account Number
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={styles.part1TextSection}>
                                                        <Text style={{ ...styles.p1 }}>
                                                            {invoiceDataForMilestone?.developer_bank_account_number}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={{ ...styles.part1SubSection, gap: 2, }}>
                                                    <View style={{ ...styles.part1LabelSection }}>
                                                        <Text style={styles.p1}>
                                                            IFSC Code
                                                        </Text>
                                                        <Text style={styles.p1}>
                                                            :
                                                        </Text>
                                                    </View>
                                                    <View style={{ ...styles.part1TextSection, width: 180, }}>
                                                        <View style={{ ...styles.p1, ...styles.flexRow }}>
                                                            <Text>{invoiceDataForMilestone?.developer_bank_account_ifsc_code}; SWIFT Code:   {invoiceDataForMilestone?.developer_bank_swift_code}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.column1, flexDirection: "row" }} >
                                                <View style={{ ...styles.column, width: "50%", paddingRight: "0px" }}>
                                                    <View style={{ borderBottom: "1px", paddingBottom: "1px" }}>
                                                        <Text style={styles.p1}>Add State Tax (SGST):</Text>
                                                    </View>
                                                    <View style={{ ...styles.p1, ...styles.bold }}>
                                                        <Text style={{ padding: "20px 0px 5px", fontSize: "10px" }}>Total GST:</Text>
                                                    </View>
                                                </View>
                                                <View style={{ ...styles.column, borderRight: "0px", width: "50%", paddingRight: "0px" }}>
                                                    <View style={{ borderBottom: "1px", alignItems: 'flex-end', paddingBottom: "1px" }}>
                                                        <Text style={{ ...styles.p1, paddingRight: "2px" }}>{formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.SGST_amount_on_taxable_value))}</Text>
                                                    </View>
                                                    <View style={{ ...styles.p1, alignItems: 'flex-end' }}>
                                                        <Text style={{ padding: "20px 2px 5px" }}>{formatNumberToIndianSystem(parseFloat(invoiceDataForMilestone?.invoiceCalculatedFields?.total_GST_amount))}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ ...styles.fourteenLineContainer }}>
                                            <View style={{ ...styles.column, paddingRight: '0px' }}>
                                                <View>
                                                    <Text style={styles.text}>Total Invoice Amount in Words:</Text>
                                                    <Text style={styles.text}>{convertNumberToWords(invoiceDataForMilestone?.invoiceCalculatedFields?.total_amount_including_GST)?.toUpperCase()} </Text>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.column1, flexDirection: "row" }}>
                                                <View style={{ ...styles.column, width: "50%", paddingRight: "0px" }}>
                                                    <View style={{ paddingBottom: "1px" }}>
                                                        <Text style={{ ...styles.p1, ...styles.bold, alignItems: 'center', fontSize: "10px" }}>Total Amount Including GST</Text>
                                                        <Text style={styles.p1}>(Rounded off to  the nearest rupee value)</Text>
                                                    </View>
                                                </View>
                                                <View style={{ ...styles.column, borderRight: "0px", width: "50%", paddingRight: "0px" }}>
                                                    <View style={{ alignItems: 'flex-end', paddingBottom: "1px" }}>
                                                        <Text style={{ ...styles.p1, paddingRight: "2px" }}>{formatNumberToIndianSystem(Math.round(parseInt(invoiceDataForMilestone?.invoiceCalculatedFields?.total_amount_including_GST)))}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ ...styles.fiftheenLineContainer }}>
                                            <View>
                                                <Text style={{ ...styles.text, paddingTop: '2px' }}>Terms and Conditions</Text>
                                            </View>
                                            <View>
                                                <View style={{ ...styles.flexRow, ...styles.p1, marginBottom: '2px' }}>
                                                    <Text>
                                                        1.
                                                    </Text>
                                                    <Text>
                                                        This Invoice Amount is to be received on or before {checkForFalsyValues(moment(invoiceDataForMilestone?.invoice_due_date)?.format('DD.MM.YYYY')) || 'N/A'}.
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.flexRow, ...styles.p1, marginBottom: '2px' }}>
                                                    <Text>
                                                        2.
                                                    </Text>
                                                    <Text>
                                                        Fail to pay with in due date attracts Interest @{formatNumberToIndianSystemArea(parseInt(invoiceDataForMilestone?.late_payment_interest))}%, subject to your agreement.
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.flexRow, ...styles.p1, marginBottom: '2px' }}>
                                                    <Text>
                                                        3.
                                                    </Text>
                                                    <Text>
                                                        If the amount is remitted through RTGS, till the intimation of UTR Nos, it will be considered as unpaid.
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.flexRow, ...styles.p1, marginBottom: '2px' }}>
                                                    <Text>
                                                        4.
                                                    </Text>
                                                    <Text>
                                                        Cheques / DDs shall be drawn in favour of {capitalizeFirstLetter(invoiceDataForMilestone?.developer_bank_account_payee_details || 'N/A')}.
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.flexRow, ...styles.p1, marginBottom: '2px' }}>
                                                    <Text style={{ paddingRight: 1 }}>
                                                        5.
                                                    </Text>
                                                    <Text>
                                                        No tax is payable on reverse charge basis on this invoice.
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.flexRow, ...styles.p1, marginBottom: '2px' }}>
                                                    <Text>
                                                        6.
                                                    </Text>
                                                    <Text style={{ paddingBottom: '2px' }}>
                                                        1% TDS has to be paid by customer only on the invoice value excluding GST/Taxes as per due date and copy of challan to be provided to us.
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ ...styles.sixteenLineContainer }}>
                                            <View style={{ ...styles.p2 }}>
                                                <Text style={{ paddingBottom: '2px' }}>Certified that the particulars given above are true and correct.</Text>
                                                <Text style={{ paddingBottom: '2px' }}>For My Home Infrastructures Private Limited.</Text>
                                            </View>
                                            <View style={styles.emptyLine} />

                                            <View style={{ ...styles.p2, paddingBottom: '2px' }}>
                                                <Text>Authorized Signatory</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={{ ...styles.p1 }}>*This is a reference copy of the invoice. The original invoice has been sent to your registered email address.</Text>
                                    </View>
                                </View>
                            </View>
                        </Page>
                    </Document>
                </CustomPDFViewer>
            </div>
        </Dialog>
    );
};

export default Invoicesheets;
