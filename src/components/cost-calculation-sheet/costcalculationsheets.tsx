import { Page, Text, View, Document, StyleSheet, Font, Image, PDFViewer } from '@react-pdf/renderer';
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBold from "../../assets/fonts/Roboto-Bold.ttf";
import RobotoBoldItalic from "../../assets/fonts/Roboto-BoldItalic.ttf";
import RobotoThin from "../../assets/fonts/Roboto-Thin.ttf";
import { convertToTBD, formatNumberToIndianSystem, getTitleNameWithDots } from '@Src/utils/globalUtilities';
import moment from 'moment';
import { Dialog } from '@mui/material';
import timesRomanNormal from "../../assets/fonts/times-ro.ttf"
import timesRomanBold from "../../assets/fonts/timr65w.ttf"
import CustomPDFViewer from '@Components/custom-pdf-viewer/CustomPDFViewer';



Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: RobotoThin,
            fontWeight: 100,
        },
        {
            src: RobotoRegular,
            fontWeight: 400,
        },
        {
            src: RobotoBold,
            fontWeight: 700,
        },
        {
            src: RobotoBoldItalic,
            fontWeight: 700,
        },
    ]
})

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
        padding: 35,
        position: 'relative',
        fontSize: 10
    },

    p: {
        fontSize: 13,
    },

    flexRow: {
        flexDirection: 'row',
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    wrap: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    },

    tableContainer: {
        width: "100%",
        border: "1px solid black"
    },

    leftSidetable: {
        marginRight: "2px",
        fontWeight: "bold",
        width: '20%'
    },

    borderRight: {
        borderRight: "1px solid black"
    },

    borderTop: {
        borderTop: "1px solid black"
    },

    rupeeAlignment: {
        textAlign: 'right',
        paddingRight: 2,
        paddingTop: 2
    },

    bold: {
        fontWeight: 700,
        fontFamily: "timesRoman",
        fontSize: 11,
    },

    normalText: {
        fontWeight: 400,
        fontFamily: "timesRoman",
        fontSize: 10,
        paddingTop: 6
    },

});




const Costcalculationsheets = (props: { showCostCalculationSheet: any, setShowCostCalculationSheet: any, costCalculationData: any, unit_Id: any }) => {
    return (
        <Dialog
            open={props?.showCostCalculationSheet}
            onClose={() => props?.setShowCostCalculationSheet(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{ style: { width: '100%', height: '100%' } }}
        >
            <CustomPDFViewer type = 'view' buttonElement = '' fileName = '' onClose={() => {props?.setShowCostCalculationSheet(false)}}>
                <Document>
                    <Page id='1' debug={false} size={'A4'} style={{ ...globalStyles.page, }}>
                        <View style={globalStyles.center}>
                            <Text style={{ ...globalStyles.bold, ...globalStyles.p, }}>
                                COST CALCULATION SHEETS
                            </Text>
                            <Text style={{ ...globalStyles.bold, }}>
                                {props?.costCalculationData?.project_name}
                            </Text>
                        </View>
                        <View>
                            <View style={{ ...globalStyles.tableContainer, marginTop: '15px' }}>
                                <View style={globalStyles.flexRow} >
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.leftSidetable, ...globalStyles.borderRight }}>
                                        Customer Name
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, width: '45%', lineHeight:1.1 }}>
                                        {getTitleNameWithDots(props?.costCalculationData?.customer_title)}
                                        {" " + props?.costCalculationData?.full_name}
                                        {props?.costCalculationData?.joint_customer_names?.map((customer: any, index: any) => {
                                            return (
                                                <Text key={index} style={{ marginRight: '4px' }}>
                                                    &nbsp;& {getTitleNameWithDots(customer?.customer_title)} {customer?.full_name}
                                                </Text>
                                            );
                                        })}
                                    </Text>
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, width: '15%' }}>
                                        Area in SFT 
                                        {/* hellodfhdufhd */}
                                    </Text>
                                    <Text style={{ ...{ width: '15%' }, ...globalStyles.normalText }}>
                                        {props?.costCalculationData?.saleable_area}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop }} >
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.leftSidetable, ...globalStyles.borderRight }}>
                                        Block Name
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, width: '45%' }}>
                                        BLOCK {parseInt(props?.costCalculationData?.tower_code)}
                                    </Text>
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, width: '15%' }}>
                                        Date of Booking
                                    </Text>
                                    <Text style={{ ...globalStyles.normalText, width: '15%' }}>
                                        {moment(props?.costCalculationData?.booking_date).format('DD.MM.YYYY')}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop }} >
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.leftSidetable, ...globalStyles.borderRight }}>
                                        Flat No.
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, width: '45%' }}>
                                        {Number(props?.costCalculationData?.floor_no)}{props?.costCalculationData?.unit_no}
                                    </Text>
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, width: '15%' }}>
                                        Customer No.
                                    </Text>
                                    <Text style={{ ...globalStyles.normalText, width: '15%' }}>
                                        {props?.costCalculationData?.customer_number}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop }} >
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.leftSidetable, ...globalStyles.borderRight }}>
                                        Selected Floor
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, width: '45%' }}>
                                        {Number(props?.costCalculationData?.floor_no)}
                                    </Text>
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, width: '15%' }}>
                                        Sale Order No.
                                    </Text>
                                    <Text style={{ ...globalStyles.normalText, width: '15%' }}>
                                        {props?.costCalculationData?.sale_order_number}
                                    </Text>
                                </View>
                            </View>
                            {/* 2nd Table */}
                            <View style={{ ...globalStyles.tableContainer, marginTop: 15 }}>
                                <View style={{ ...globalStyles.flexRow, ...{ backgroundColor: 'rgb(212 212 216)', height: "16px", fontSize: 12, } }} >
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, ...{ width: '45%', textAlign: "center" } }}>
                                        Particulars
                                    </Text>
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, ...{ width: '15%', textAlign: "center" } }}>
                                        Rate
                                    </Text>
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, ...{ width: '20%', textAlign: "center" } }}>
                                        Amount
                                    </Text>
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, ...{ width: '20%', textAlign: "center" } }}>
                                        GST
                                    </Text>
                                    <Text style={{ ...globalStyles.bold, ...{ width: '20%', textAlign: "center" } }}>
                                        Total
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop, height: '30px' }} >
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, width: '45%' }}>
                                        Basic Price - per SFT
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, ...globalStyles.rupeeAlignment, width: '15%', paddingTop: 6 }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.price_per_sq_ft)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.basic_amount)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, width: '20%' }}>
                                    </Text>
                                    <Text style={{ ...{ width: '20%' } }}>
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop, height: 30 }} >
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, width: '45%' }}>
                                        Floor Rise Charges
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, width: '15%', ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.floor_rise_rate)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, width: '20%', ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.floor_rise_amount)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%' } }}>
                                    </Text>
                                    <Text style={{ ...{ width: '20%' } }}>
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop }} >
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, width: '45%', lineHeight: 1.2 }}>
                                        Amenities: TSSPDCL, HMWS & SB Connection Charges, Club Facilities, DG Sets, Piped Gas Connection
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '15%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.amenity_amount)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%' } }}>
                                    </Text>
                                    <Text style={{ ...{ width: '20%' } }}>
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.bold, ...globalStyles.flexRow, ...globalStyles.borderTop, height: '30px' }} >
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '45%', textAlign: "center" } }}>
                                        Sale Consideration-(A)
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '15%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, width: '20%' }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.total_sale_consideration_without_gst)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, width: '20%', ...globalStyles.rupeeAlignment }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.total_gst_amount)}
                                    </Text>
                                    <Text style={{ ...{ width: '20%' }, ...globalStyles.rupeeAlignment }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.total_sale_consideration_with_gst)}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, width: '45%' }}>
                                        Legal and Documentation Charges
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '15%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.legal_charges_amt)) || ' '}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.legal_charges_gst)) || ' '}
                                    </Text>
                                    <Text style={{ ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.legal_charges_total)) || ' '}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <View style={{ width: '45%', ...globalStyles.borderRight, ...globalStyles.normalText, lineHeight: 1.2 }}>
                                        <Text>
                                            Maintenance Charges (For First Two Years)
                                        </Text>
                                        <Text>
                                            - per SFT
                                        </Text>
                                    </View>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '15%', }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.maintenance_per_sft_rate)) || ' '}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.maintaince_rate)) || ' '}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.maintaince_amount_gst)) || ' '}
                                    </Text>
                                    <Text style={{ ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%' }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.maintaince_amount_with_gst)) || ' '}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.normalText, width: '45%' }}>
                                        Corpus Fund - per SFT
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '15%', }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.corpus_per_sft_rate)) || ' '}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.corpus_fund_rate)) || ' '}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.corpus_fund_amt)) || ' '}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.bold, ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '45%', textAlign: "center" } }}>
                                        Other Charges Payable at the time of Registration-(B)
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '15%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%', }, ...globalStyles.rupeeAlignment }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.document_without_gst)) || ' '}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%' }, ...globalStyles.rupeeAlignment }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.document_gst)) || ' '}
                                    </Text>
                                    <Text style={{ ...{ width: '20%' }, ...globalStyles.rupeeAlignment }}>
                                        {convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.document_with_gst)) || ' '}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.bold, ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '45%', textAlign: "center" } }}>
                                        Total Payable-(A + B)
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '15%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%' } }}>

                                    </Text>
                                    <Text style={{ ...{ width: '20%' }, ...globalStyles.rupeeAlignment }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.total_amount_ts_plus_othchg)}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.bold, ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '45%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '15%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%', textAlign: "center" } }}>
                                        Paid Amount
                                    </Text>
                                    <Text style={{ ...{ width: '20%' }, ...globalStyles.rupeeAlignment }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.paid_amount)}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.bold, ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '45%', } }}>
                                    </Text>

                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '15%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%', textAlign: "center" } }}>
                                        Balance Due
                                    </Text>
                                    <Text style={{ ...{ width: '20%' }, ...globalStyles.rupeeAlignment }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.balance_amount)}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.bold, ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '45%', textAlign: "center" } }}>
                                        Amount Considered for Registration
                                    </Text>

                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '15%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%', }, ...globalStyles.rupeeAlignment }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.amount_considered_for_registration)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%' } }}>

                                    </Text>
                                    <Text style={{ ...{ width: '20%' } }}>

                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, ...{ width: '45%', textAlign: "center" } }}>
                                        Registration Charges
                                    </Text>

                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '15%', }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.registration_charge_rate)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.registration_charge_amount)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%' } }}>

                                    </Text>
                                    <Text style={{ ...{ width: '20%' } }}>

                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.bold, ...globalStyles.borderRight, ...{ width: '45%', textAlign: "center" } }}>
                                        Mutation Fees
                                    </Text>

                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '15%', }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.mutation_fee_rate)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...globalStyles.rupeeAlignment, ...globalStyles.normalText, paddingTop: 6, width: '20%', }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.mutation_fee_amount)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%' } }}>

                                    </Text>
                                    <Text style={{ ...{ width: '20%' } }}>

                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.bold, ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ height: '30px' } }} >
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '45%', textAlign: "center" } }}>
                                        Total Registration Charges
                                    </Text>

                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '15%', } }}>

                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%', }, ...globalStyles.rupeeAlignment }}>
                                        {formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.total_registration_charges)}
                                    </Text>
                                    <Text style={{ ...globalStyles.borderRight, ...{ width: '20%' } }}>

                                    </Text>
                                    <Text style={{ ...{ width: '20%' } }}>

                                    </Text>
                                </View>
                            </View>

                        </View>
                    </Page>
                </Document>
            </CustomPDFViewer>
        </Dialog>
    );
}
export default Costcalculationsheets;
