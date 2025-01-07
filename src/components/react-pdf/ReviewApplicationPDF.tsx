import React, { FC, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBold from "../../assets/fonts/Roboto-Bold.ttf";
import RobotoBoldItalic from "../../assets/fonts/Roboto-BoldItalic.ttf";
import RobotoItalic from "../../assets/fonts/Roboto-Italic.ttf";
import RobotoThin from "../../assets/fonts/Roboto-Thin.ttf";
import MerriweatherRegular from '../../assets/fonts/Merriweather-Regular.ttf';
import MarriweatherBold from '../../assets/fonts/Merriweather-Bold.ttf';
import TimesNewRoman from '../../assets/fonts/times-ro.ttf';
import TimesNewRomanBold from '../../assets/fonts/timr65w.ttf';
import {getConfigData} from '@Src/config/config';
import { getTitleNameWithDots, checkForFalsyValues, calculateAgeInYears, formatNumberToIndianSystemArea, formatNumberToIndianSystem, convertToTBD, getDataFromLocalStorage, convertNumberToWords, capitalizeFirstLetter, spaceAfterComma, numberToOrdinals } from "@Src/utils/globalUtilities";
import moment from 'moment';
import Check from "../../assets/Images/check.png";
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';
import { MODULES_API_MAP } from '@Src/services/httpService';
import axios from 'axios';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import PTserifRegular from '../../assets/fonts/pt-serif.regular.ttf';
import PTserifBold from '../../assets/fonts/pt-serif.bold.ttf';
import { boolean } from 'yup';

Font.register(
    {
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
                src: RobotoItalic,
                fontWeight: 400,
            },
            {
                src: RobotoBoldItalic,
                fontWeight: 700,
            },
        ]
    },
)

// Font.register(
//     {
//         family: 'Times',
//         fonts: [
//             {
//                 src: TimesNewRoman,
//                 fontWeight: 400,
//             },
//             {
//                 src: TimesNewRomanBold,
//                 fontWeight: 700,
//             },
//         ]
//     },
// )
Font.register(
    {
        family: 'Merriweather',
        fonts: [
            {
                src: MerriweatherRegular,
                fontWeight: 400,
            },
            {
                src: MarriweatherBold,
                fontWeight: 700,
            }
        ]
    },
)

Font.register({
    family: 'PT Serif',
    fonts: [
        {
            src: PTserifRegular,
            fontWeight: 400,
        },
        {
            src: PTserifBold,
            fontWeight: 700,
        },


    ],
});


Font.register({
    family: 'Poppins',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/poppins/v1/TDTjCH39JjVycIF24TlO-Q.ttf',
        },

    ],
});

Font.registerHyphenationCallback((word) => {
    return [word];
});

// Global styles
const globalStyles = StyleSheet.create({
    page: {
        padding: 35,
        position: 'relative'
    },

    pageNo: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 10,
    },

    underline: {
        fontFamily: "Poppins",
        textDecoration: "underline"
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
        padding: 6,
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

    underlineText: {
        textDecoration: 'underline',
    },

    watermark: {
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        opacity: 0.2,
        fontSize: 60,
        color: '#656C7B',
    },

});

// Page 1 styles
const page1 = StyleSheet.create({

    //fonts
    bold: {
        fontFamily: "Roboto",
        fontWeight: 700,
    },

    underline: {
        fontFamily: "Roboto",
        textDecoration: "underline",
        // fontStyle: 'italic'
    },

    p1: {
        fontSize: 10,
        fontFamily: "Roboto"
    },

    p2: {
        fontSize: 12,
        fontFamily: "Roboto",
        lineHeight: 1.6
    },


    //section 1
    section1: {
        width: "100%",
        height: 100,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        position: "relative",
    },
    projectLogo: {
        width: 200,
        height: 100,
    },
    companyLogo: {
        width: 70,
        height: 70,
        position: 'absolute',
        top: -30,
        right: 0,
    },

    //section 2
    section2: {
        marginTop: 40,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        position: "relative",

    },

    //Section 2 part 1
    part1: {
        width: "42%",
        flexDirection: 'column',
        gap: 15,
    },
    part1SubSection: {
        display: 'flex',
        flexDirection: 'row',
        gap: 18,
    },
    part1LabelSection: {
        flexDirection: 'row',
        justifyContent: "space-between",
        width: "60%",
    },
    part1TextSection: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        width: "40%",
    },

    //Section 2 part 1
    part2: {
        width: "42%",
        flexDirection: 'column',
        gap: 15,
    },

    part2SubSection: {
        display: 'flex',
        flexDirection: 'row',
    },

    part2LabelSection: {
        flexDirection: 'row',
        justifyContent: "space-between",
        width: "25%",
    },
    part2TextSection: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        width: "60%",
    },


    //Profile Photo Section
    profilePhotoSection: {
        position: "absolute",
        bottom: 5,
        right: 0,
        gap: 15,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },

    photoContainer: {
        height: 100,
        width: 80,
        borderRadius: 5,
        overflow: 'hidden'
    },

    //Section 3
    section3: {
        marginTop: 20,
        width: '100%'
    },

    //Signature
    signatureContainer: {
        position: 'absolute',
        bottom: 35,
        right: 40,
        justifyContent: 'center',
        gap: 8
    },

    signatureImage: {
        height: 50,
        width: 100,
        backgroundColor: 'black'
    }

});

const tableStyles = StyleSheet.create({
    //fonts
    bold: {
        fontWeight: 700,
        fontFamily: "Merriweather"
    },

    header1: {
        fontSize: 14,
        fontFamily: "PT Serif",
        marginBottom: 5,
        fontWeight: 700,
    },

    header2: {
        fontSize: 10,
        fontFamily: "PT Serif",
        fontWeight: 700,
    },
    header3: {
        fontSize: 9.5,
        fontFamily: "PT Serif",
        fontWeight: 600,
    },

    pSmall: {
        fontSize: 8,
        fontFamily: "PT Serif",
        fontWeight: 400

    },

    p: {
        fontSize: 10,
        fontFamily: "PT Serif",
        lineHeight: 1.6,
        fontWeight: 400
    },

    p2: {
        fontSize: 10,
        fontFamily: "PT Serif",
        fontWeight: 400,
    },

    p3: {
        fontSize: 9,
        fontFamily: "PT Serif",
        fontWeight: 400
    },


    //Sections Container
    section: {
        marginBottom: 15
    },

    textWrap: {
        display: "flex",
        flexWrap: "wrap",
        flexGrow: 1,
        flexBasis: 0,
        padding: 2,
    },
})

const page2 = StyleSheet.create({
    h1: {
        fontSize: 16,
        marginBottom: 7,
    },
    h2: {
        fontSize: 12,
        marginTop: 10,
    },
    title: {
        fontSize: 10,
        fontWeight: 'thin',
        color: "#8c8c8c",
        marginBottom: 5
    },
    p: {
        fontSize: 10,
        fontWeight: 'normal'
    },

})


interface AgreementLetter {
    companyLogo: string;
    projectLogo: string;
    apartmentNumber: string;
    customerNumber: string;
    bookingNumber: string;
    agreementDate: string;
    saleDeedDate: string;
    salesRepresentative: string;
    crmRepresentative: string;
    place: string;
    date: string;
    companyName: string;
    companyAddress: string;
    companyCityAndPin: string;
    projectName: string;
    floorNo: string;
    unitNo: string;
    tower: string;
    scaleableArea: string;
    bookingTransactionId: string;
    bookingDate: string;
    bookingBankName: string;
    bookingBranchName: string;
    bookingAmountPaid: string;
    bookingAmountPaidInWords: string;
    applicantPhoto: string;
    jointApplicantsPhotos: string[];
    carpetArea: string;
    balconyArea: string;
    commonArea: string;
    carParkingSlots: string;
    basementLevel: string;
    noOfParking: string;

}

// Define the applicantDetails for ReviewApplicationPDF component
interface ReviewApplicationPDFapplicantDetails {
    agreementLetter: AgreementLetter;
    applicantDetails: any,
    jointApplicantDetails: any,
    applicantBankDetails: any,
    customerUnitDetails: any,
    milestoneData: any,
    interestedInHomeLoans: string;
    // Include other applicantDetails if there are any
}

const formatWithRupee = (value: any) => {
    if (value != 0 && value != null && value != undefined && value != '') {
        return `Rs. ${value}/- Per Sq.ft.`;
    }
    else {
        return 'TBD';
    }
};

const formatWithRupeeForAmount = (value: any) => {
    if (value != 0 && value != null && value != undefined && value != '') {
        return `Rs. ${value}/-`;
    }
    else {
        return 'TBD';
    }
}

const convertImage = async (urlName = "") => {
    // console.log(urlName, "url123")
    if (urlName) {
        const customHeaders: any = {
            headers: {
                key: getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY),
                'client-code': 'myhome',
            },
            responseType: 'blob',
        };
        let reqObj: any = {
            file_url: urlName,
        };
        const res = await axios.post(
            `${MODULES_API_MAP.AUTHENTICATION + GLOBAL_API_ROUTES.DOWNLOAD_DOCUMNETS
            }`,
            reqObj,
    {
                headers: customHeaders.headers,
                responseType: 'blob',
            }
        );
        if (res.data) {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            // console.log(url, "url123");
            return url;
        } else {
            return "";
        }
    } else {
        return "";
    }
}

const getWatermarkText = (text: string) => {
    switch (text) {
        case "Submitted":
        case "Re-Draft":
            return "Pending Approval";
        case "Approved":
            return "Approved";
        default:
            return "Pending Approval";
    }
}

// Create Document Component
const ReviewApplicationPDF: FC<ReviewApplicationPDFapplicantDetails> = ({ agreementLetter, applicantDetails, jointApplicantDetails, applicantBankDetails, customerUnitDetails, milestoneData, interestedInHomeLoans }) => {
    let jointUsersNumber = Object.keys(jointApplicantDetails ?? {}).length;
    let home_loan_value = interestedInHomeLoans !== undefined ? JSON.parse(interestedInHomeLoans) : true;
    let cumulativeMilestoneAmount = 0;
    const watermarkText = getWatermarkText(customerUnitDetails?.application_status);
    return (
        <Document>
            <Page id='1' debug={false} size={'A4'} style={{ ...globalStyles.page, }}>
                {/* Watermark component to be used on every page */}
                <Text style={{ ...globalStyles.watermark, ...(watermarkText === 'Approved' ? { left: '40%' } : { left: '20%' }) }}>
                    {watermarkText}
                </Text>
                <View style={page1.section1}>
                    <View style={{ ...page1.companyLogo, }}>
                        <Image style={{ objectFit: "contain", height: '100%', width: "100%", }} src={convertImage(agreementLetter?.companyLogo)} />
                    </View>
                    <View style={{ ...page1.projectLogo, }}>
                        <Image style={{ objectFit: "contain", objectPosition: "start", height: "100%", width: "100%" }} src={convertImage(agreementLetter?.projectLogo)} />
                    </View>
                </View>
                <View style={page1.section2}>
                    <View style={page1.part1}>
                        <View style={page1.part1SubSection}>
                            <View style={page1.part1LabelSection}>
                                <Text style={page1.p1}>
                                    Apartment No
                                </Text>
                                <Text style={page1.p1}>
                                    :
                                </Text>
                            </View>
                            <View style={page1.part1TextSection}>
                                <Text style={{ ...page1.p1, ...page1.bold }}>
                                    {agreementLetter?.apartmentNumber}
                                </Text>
                            </View>
                        </View>
                        <View style={page1.part1SubSection}>
                            <View style={page1.part1LabelSection}>
                                <Text style={page1.p1}>
                                    Customer No
                                </Text>
                                <Text style={page1.p1}>
                                    :
                                </Text>
                            </View>
                            <View style={page1.part1TextSection}>
                                <Text style={{ ...page1.p1, ...page1.bold }}>
                                    {agreementLetter?.customerNumber}
                                </Text>
                            </View>
                        </View>
                        <View style={page1.part1SubSection}>
                            <View style={page1.part1LabelSection}>
                                <Text style={page1.p1}>
                                    Booking No
                                </Text>
                                <Text style={page1.p1}>
                                    :
                                </Text>
                            </View>
                            <View style={page1.part1TextSection}>
                                <Text style={{ ...page1.p1, ...page1.bold }}>
                                    {agreementLetter?.bookingNumber}
                                </Text>
                            </View>
                        </View>
                        <View style={page1.part1SubSection}>
                            <View style={page1.part1LabelSection}>
                                <Text style={page1.p1}>
                                    Agreement Date
                                </Text>
                                <Text style={page1.p1}>
                                    :
                                </Text>
                            </View>
                            <View style={page1.part1TextSection}>
                                <Text style={{ ...page1.p1, ...page1.bold }}>
                                    {agreementLetter?.agreementDate}
                                </Text>
                            </View>
                        </View>
                        <View style={page1.part1SubSection}>
                            <View style={page1.part1LabelSection}>
                                <Text style={page1.p1}>
                                    Sale Deed Date
                                </Text>
                                <Text style={page1.p1}>
                                    :
                                </Text>
                            </View>
                            <View style={page1.part1TextSection}>
                                <Text style={{ ...page1.p1, ...page1.bold }}>
                                    {agreementLetter?.saleDeedDate}
                                </Text>
                            </View>
                        </View>
                        <View style={page1.part1SubSection}>
                            <View style={page1.part1LabelSection}>
                                <Text style={page1.p1}>
                                    Sales Representative
                                </Text>
                                <Text style={page1.p1}>
                                    :
                                </Text>
                            </View>
                            <View style={page1.part1TextSection}>
                                <Text style={{ ...page1.p1, ...page1.bold }}>
                                    {agreementLetter?.salesRepresentative}
                                </Text>
                            </View>
                        </View>
                        <View style={page1.part1SubSection}>
                            <View style={page1.part1LabelSection}>
                                <Text style={page1.p1}>
                                    CRM Representative
                                </Text>
                                <Text style={page1.p1}>
                                    :
                                </Text>
                            </View>
                            <View style={page1.part1TextSection}>
                                <Text style={{ ...page1.p1, ...page1.bold }}>
                                    {agreementLetter?.crmRepresentative}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ ...page1.p2, ...{ marginBottom: 4 } }}>
                                To,
                            </Text>
                            <Text style={page1.p2}>
                                The Director,
                            </Text>
                            <Text style={page1.p2}>
                                {capitalizeFirstLetter(agreementLetter?.companyName)}
                            </Text>
                            <Text style={page1.p2}>
                                {agreementLetter?.companyAddress}
                            </Text>
                            <Text style={page1.p2}>
                                {agreementLetter?.companyCityAndPin}
                            </Text>
                        </View>
                    </View>
                    <View style={page1.part2}>
                        <View style={page1.part1SubSection}>
                            <View style={page1.part1LabelSection}>
                                <Text style={page1.p1}>
                                    Place
                                </Text>
                                <Text style={page1.p1}>
                                    :
                                </Text>
                            </View>
                            <View style={page1.part1TextSection}>
                                <Text style={{ ...page1.p1, ...page1.bold }}>
                                    {agreementLetter?.place}
                                </Text>
                            </View>
                        </View>
                        <View style={page1.part1SubSection}>
                            <View style={page1.part1LabelSection}>
                                <Text style={page1.p1}>
                                    Date
                                </Text>
                                <Text style={page1.p1}>
                                    :
                                </Text>
                            </View>
                            <View style={page1.part1TextSection}>
                                <Text style={{ ...page1.p1, ...page1.bold }}>
                                    {agreementLetter?.date}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={page1.profilePhotoSection}>
                        <View style={{ ...globalStyles.flexRow, ...{ gap: 15 } }}>
                            <View style={page1.photoContainer}>
                                <Image style={{ objectFit: "contain", height: "100%", width: "100%" }} src={convertImage(agreementLetter?.applicantPhoto)} />
                            </View>
                            {agreementLetter?.jointApplicantsPhotos[0] && <View style={page1.photoContainer}>
                                <Image style={{ objectFit: "contain", height: "100%", width: "100%" }} src={convertImage(agreementLetter?.jointApplicantsPhotos[0])} />
                            </View>}
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ gap: 15 } }}>
                            {agreementLetter?.jointApplicantsPhotos[1] && <View style={page1.photoContainer}>
                                <Image style={{ objectFit: "contain", height: "100%", width: "100%" }} src={convertImage(agreementLetter?.jointApplicantsPhotos[1])} />
                            </View>}
                            {agreementLetter?.jointApplicantsPhotos[2] && <View style={page1.photoContainer}>
                                <Image style={{ objectFit: "contain", height: "100%", width: "100%" }} src={convertImage(agreementLetter?.jointApplicantsPhotos[2])} />
                            </View>}
                        </View>

                    </View>
                </View>
                <View style={page1.section3}>
                    <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                        <Text style={page1.p2}>
                            I/We am/are interested to purchase Residential Flat in your Project named "{capitalizeFirstLetter(agreementLetter?.projectName)}",
                        </Text>
                        <View style={{ position: 'relative' }}>
                            <Text style={page1.p2}>Flat No.                 .  Floor                     .  Tower                  with a Saleable Area of               Sq.ft.,</Text>

                            <View style={{ position: 'absolute', top: 0, left: "9%", width: '10%' }}>
                                <View style={{ position: 'relative', width: '100%' }}>
                                    <Text style={{ ...page1.p2, ...page1.bold, textAlign: 'center' }}>  {agreementLetter?.floorNo + agreementLetter?.unitNo}</Text>
                                    <View style={{ position: 'absolute', top: 13, left: 0, width: '100%', height: 1.2, backgroundColor: 'black' }}></View>
                                </View>
                            </View>

                            <View style={{ position: 'absolute', top: 0, left: "27%", width: '12%' }}>
                                <View style={{ position: 'relative', width: '100%' }}>
                                    <Text style={{ ...page1.p2, ...page1.bold, textAlign: 'center' }}>{agreementLetter?.floorNo}</Text>
                                    <View style={{ position: 'absolute', top: 13, left: 0, width: '100%', height: 1.2, backgroundColor: 'black' }}></View>
                                </View>
                            </View>

                            <View style={{ position: 'absolute', top: 0, left: "48%", width: '10%' }}>
                                <View style={{ position: 'relative', width: '100%' }}>
                                    <Text style={{ ...page1.p2, ...page1.bold, textAlign: 'center' }}>{agreementLetter?.tower}</Text>
                                    <View style={{ position: 'absolute', top: 13, left: 0, width: '100%', height: 1.2, backgroundColor: 'black' }}></View>
                                </View>
                            </View>
                            <View style={{ position: 'absolute', top: 0, left: "85%", width: '8%' }}>
                                <View style={{ position: 'relative', width: '100%' }}>
                                    <Text style={{ ...page1.p2, ...page1.bold, textAlign: 'center' }}>{agreementLetter?.scaleableArea}</Text>
                                    <View style={{ position: 'absolute', top: 13, left: 0, width: '100%', height: 1.2, backgroundColor: 'black' }}></View>
                                </View>
                            </View>

                        </View>
                        {/* <Text style={{ ...page1.p2, ...page1.bold, ...page1.underline }}>{agreementLetter?.floorNo + agreementLetter?.unitNo}</Text> */}
                        {/* <Text style={page1.p2}>  </Text> */}
                        {/* <Text style={{ ...page1.p2, ...page1.bold, ...page1.underline }}>{agreementLetter?.floorNo}</Text> */}
                        {/* <Text style={page1.p2}>.  </Text> */}
                        {/* <Text style={{ ...page1.p2, ...page1.bold, ...page1.underline }}>{agreementLetter?.tower} </Text> */}
                        {/* <Text style={page1.p2}>  </Text> */}
                        {/* <Text style={{ ...page1.p2, ...page1.bold, ...page1.underline }}>{agreementLetter?.scaleableArea}</Text> */}
                        {/* <Text style={page1.p2}> </Text> */}
                    </View>
                    <Text style={page1.p2}>I/We have read understood and hereby agree to abide by all the terms and conditions attached to this Application Form and also agree to sign and execute, as and when desired by the Company, the Agreement of Sale and other required documents. </Text>
                    <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                        <Text style={page1.p2}>I/We am/are enclosing herewith a Demand Draft / Cheque No. </Text>
                        <Text style={{ ...page1.p2, ...page1.bold, ...page1.underline }}> {agreementLetter?.bookingTransactionId} </Text>
                        <Text style={page1.p2}>  dated </Text>
                        <Text style={{ ...page1.p2, ...page1.bold, ...page1.underline }}> {moment(agreementLetter?.bookingDate).format('DD/MM/YYYY')} </Text>
                        <Text style={page1.p2}> drawn on </Text>
                        <Text style={{ ...page1.p2, ...page1.bold, ...page1.underline }}> {agreementLetter?.bookingBankName}, {agreementLetter?.bookingBranchName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: "wrap", position: 'relative' }}>
                        <Text style={page1.p2}>Branch, for an amount of Rs.                                               ({agreementLetter?.bookingAmountPaidInWords} ) being the initial booking amount.</Text>
                        <View style={{ position: 'absolute', top: 0, left: "30%", width: '24%' }}>
                            <View style={{ position: 'relative', width: '100%' }}>
                                <Text style={{ ...page1.p2, ...page1.bold, textAlign: 'center' }}>&#x20B9; {agreementLetter?.bookingAmountPaid}</Text>
                                <View style={{ position: 'absolute', top: 13, left: 0, width: '100%', height: 1.2, backgroundColor: 'black' }}></View>
                            </View>
                        </View>
                        {/* <Text style={{ ...page1.p2, ...page1.bold, ...page1.underline }}>&#x20B9; {agreementLetter?.bookingAmountPaid} </Text>
                        <Text style={page1.p2}></Text> */}
                    </View>
                    <Text style={{ ...page1.p2, ...{ marginTop: 20 } }}>
                        I/We further agree to pay the instalments and other amounts/charges as per the payment terms.
                    </Text>
                </View>
                {/* <View style={page1.signatureContainer}>
                <View style={page1.signatureImage}>
                </View>
                <Text style={page1.p1}>
                    Signature of applicant
                </Text>
            </View> */}
                <Text style={globalStyles.pageNo} render={({ pageNumber, totalPages }) => (
                    `${pageNumber}`
                )} fixed />
            </Page>
            <Page id='2' size={'A4'} style={globalStyles.page}>
                <Text style={{ ...globalStyles.watermark, ...(watermarkText === 'Approved' ? { left: '40%' } : { left: '20%' }) }}>
                    {watermarkText}
                </Text>
                <Text style={{ ...page2.h1, ...page1.bold }}>
                    Primary Applicant's Details/Correspondence Address
                </Text>
                <Text style={{ ...page2.h2, ...page1.bold }}>
                    Personal Details
                </Text>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Title
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(getTitleNameWithDots(applicantDetails?.customer_title))}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Full Name
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.full_name)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            {checkForFalsyValues(applicantDetails?.applicant_relation_id)}
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.parent_or_spouse_name)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Age
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(calculateAgeInYears(applicantDetails?.dob))}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Date of Birth
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(moment(applicantDetails?.dob).format('DD/MM/YYYY'))}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Aadhaar Number
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.aadhaar_number?.replace(/(\d{4})(?=\d)/g, '$1 '))}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            PAN Details
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.pan_card)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Passport Number
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.passport_number)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            GSTIN Number
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.gstin_number)}
                        </Text>
                    </View>
                </View>
                <Text style={{ ...page2.h2, ...page1.bold, ...{ marginTop: 15 } }}>
                    Professional Details
                </Text>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Occupation
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.occupation)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Organisation Name
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.organisation_name?.toUpperCase())}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Designation
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.designation?.toUpperCase())}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Organisation Address
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.organisation_address?.toUpperCase())}
                        </Text>
                    </View>
                </View>
                <Text style={{ ...page2.h2, ...page1.bold, ...{ marginTop: 15 } }}>
                    Address Details
                </Text>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Residential status
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.resident_type)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            House/Flat No.
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.customer_flat_house_number)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '100%' }}>
                        <Text style={page2.title}>
                            Street Address 1
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.address_street1)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '100%' }}>
                        <Text style={page2.title}>
                            Street Address 2
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.address_street2)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            City/Town/District
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.address_city)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            State
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.address_state)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Pin/Postal/Zip Code
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.pin_code)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Country
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.address_country)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Office Phone
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.office_phone)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Phone Residence
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.land_line_number)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Mobile Number
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.mobile_number)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Fax
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.fax)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Email ID
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.email_id)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Alternate Mobile Number
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.alternate_mobile)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Alternate Email ID
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantDetails?.alternate_email_id)}
                        </Text>
                    </View>
                </View>
                <Text style={globalStyles.pageNo} render={({ pageNumber, totalPages }) => (
                    `${pageNumber}`
                )} fixed />
            </Page>
            {
                jointApplicantDetails?.slice().sort((a: any, b: any) => parseInt(a.joint_profile_sequence_number) - parseInt(b.joint_profile_sequence_number)).map((jointHolderDetails: any, i: any) => (
                    <Page key={i} id='3' size={'A4'} style={globalStyles.page}>
                        <Text style={{ ...globalStyles.watermark, ...(watermarkText === 'Approved' ? { left: '40%' } : { left: '20%' }) }}>
                            {watermarkText}
                        </Text>
                        <Text style={{ ...page2.h1, ...page1.bold }}>
                            {numberToOrdinals(i + 1)} Joint Applicant's Details
                        </Text>
                        <Text style={{ ...page2.h2, ...page1.bold }}>
                            Personal Details
                        </Text>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Title
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(getTitleNameWithDots(jointHolderDetails?.customer_title))}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Full Name
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.full_name)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    {checkForFalsyValues(jointHolderDetails?.applicant_relation_id)}
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.parent_or_spouse_name)}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Age
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(calculateAgeInYears(jointHolderDetails?.dob))}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Date of Birth
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(moment(jointHolderDetails?.dob).format('DD/MM/YYYY'))}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Aadhaar Number
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.aadhaar_number?.replace(/(\d{4})(?=\d)/g, '$1 '))}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    PAN Details
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.pan_card)}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Passport Number
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.passport_number)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    GSTIN Number
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.gstin_number)}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ ...page2.h2, ...page1.bold, ...{ marginTop: 15 } }}>
                            Professional Details
                        </Text>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Occupation
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.occupation)}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Organisation Name
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.organisation_name?.toUpperCase())}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Designation
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.designation?.toUpperCase())}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Organisation Address
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.organisation_address?.toUpperCase())}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ ...page2.h2, ...page1.bold, ...{ marginTop: 15 } }}>
                            Address Details
                        </Text>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Residential status
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(applicantDetails?.resident_type)}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    House/Flat No.
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.customer_flat_house_number)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '100%' }}>
                                <Text style={page2.title}>
                                    Street Address 1
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.address_street1)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '100%' }}>
                                <Text style={page2.title}>
                                    Street Address 2
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.address_street2)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    City/Town/District
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.address_city)}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    State
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.address_state)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Pin/Postal/Zip Code
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.pin_code)}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Country
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.address_country)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Office Phone
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.office_phone)}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Phone Residence
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.land_line_number)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Mobile Number
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.mobile_number)}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Fax
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.fax)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...globalStyles.flexRow, ...{ marginTop: 12 } }}>
                            <View style={{ width: '50%' }}>
                                <Text style={page2.title}>
                                    Email ID
                                </Text>
                                <Text style={page2.p}>
                                    {checkForFalsyValues(jointHolderDetails?.email_id)}
                                </Text>
                            </View>
                        </View>
                        <Text style={globalStyles.pageNo} render={({ pageNumber, totalPages }) => (
                            `${pageNumber}`
                        )} fixed />
                    </Page>
                ))
            }
            <Page id='4' size={'A4'} style={globalStyles.page}>
                <Text style={{ ...globalStyles.watermark, ...(watermarkText === 'Approved' ? { left: '40%' } : { left: '20%' }) }}>
                    {watermarkText}
                </Text>
                <Text style={{ ...page2.h1, ...page1.bold }}>
                    Bank Details
                </Text>
                <Text style={{ ...page2.h2, ...page1.bold }}>
                    Personal Details
                </Text>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 15 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Bank
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantBankDetails?.bank_name)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Branch
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantBankDetails?.bank_branch)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 15 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Account Number
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantBankDetails?.bank_account_number)}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            IFSC Number
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantBankDetails?.bank_ifsc_code)}
                        </Text>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 15 } }}>
                    <View style={{ width: '50%' }}>
                        <Text style={page2.title}>
                            Name of the A/C Holder
                        </Text>
                        <Text style={page2.p}>
                            {checkForFalsyValues(applicantBankDetails?.name_as_on_bank_account)}
                        </Text>
                    </View>
                </View>
                <Text style={globalStyles.pageNo} render={({ pageNumber, totalPages }) => (
                    `${pageNumber}`
                )} fixed />
            </Page>
            <Page id='5' size={'A4'} style={globalStyles.page}>
                <Text style={{ ...globalStyles.watermark, ...(watermarkText === 'Approved' ? { left: '40%' } : { left: '20%' }) }}>
                    {watermarkText}
                </Text>
                <View style={tableStyles.section}>
                    <Text style={{ ...tableStyles.header1, ...tableStyles.bold }}>FLAT DETAILS :</Text>
                    <View style={{ ...globalStyles.wrap, ...{ marginBottom: 7 } }}>
                        <Text style={tableStyles.p2}>Flat No. </Text>
                        <View style={{ width: 65, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ ...tableStyles.p2, }}>{agreementLetter.floorNo}{agreementLetter.unitNo}</Text>
                        </View>
                        <Text style={tableStyles.p2}>, Floor </Text>
                        <View style={{ width: 65, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ ...tableStyles.p2 }}>{agreementLetter.floorNo}</Text>
                        </View>
                        <Text style={tableStyles.p2}>, Tower </Text>
                        <View style={{ width: 65, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ ...tableStyles.p2 }}>{agreementLetter.tower}</Text>
                        </View>
                        <Text style={tableStyles.p2}>, with a Saleable Area of </Text>
                        <View style={{ width: 65, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ ...tableStyles.p2 }}>{agreementLetter.scaleableArea}</Text>
                        </View>
                        <Text style={tableStyles.p2}> Sq.ft., </Text>
                    </View>
                    {(parseInt(agreementLetter.carpetArea) > 0 || parseInt(agreementLetter.balconyArea) > 0 || parseInt(agreementLetter.commonArea) > 0) &&
                        <>
                            <View style={{ ...globalStyles.wrap, ...{ marginBottom: 7 } }}>
                                <Text style={tableStyles.p2}>(</Text>
                                {parseInt(agreementLetter.carpetArea) > 0 && <> <Text style={tableStyles.p2}>Carpet Area </Text>
                                    <View style={{ width: 65, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text style={{ ...tableStyles.p2 }}>{agreementLetter.carpetArea}</Text>
                                    </View>
                                    <Text style={tableStyles.p2}> Sq.ft.,</Text>
                                </>}
                                {parseInt(agreementLetter.balconyArea) > 0 && <>   <Text style={tableStyles.p2}> Exclusive Balocny Area </Text>
                                    <View style={{ width: 65, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text style={{ ...tableStyles.p2 }}>{agreementLetter.balconyArea}</Text>
                                    </View>
                                    <Text style={tableStyles.p2}> Sq.ft., </Text> </>}
                                <Text style={tableStyles.p2}>  Common Area (Including External </Text>
                            </View>
                            <View style={{ ...globalStyles.wrap, ...{ marginBottom: 7 } }}>
                                <Text style={tableStyles.p2}>walls)</Text>
                                <View style={{ width: 65, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{ ...tableStyles.p2 }}>{agreementLetter.commonArea}</Text>
                                </View>
                                <Text style={tableStyles.p2}>, Sq.ft.).</Text>
                            </View>
                        </>}
                    <View style={{ ...globalStyles.wrap, ...{ marginBottom: 7 } }}>
                        <Text style={tableStyles.p2}>No. of Parkings</Text>
                        <View style={{ width: 65, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ ...tableStyles.p2 }}>{agreementLetter.noOfParking}</Text>
                        </View>
                        <Text style={tableStyles.p2}>, Basement Level</Text>
                        <View style={{ width: 65, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ ...tableStyles.p2 }}>{agreementLetter.basementLevel}</Text>
                        </View>
                        <Text style={tableStyles.p2}>, Parking Numbers </Text>
                        <View style={{ width: 140, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ ...tableStyles.p2 }}>{spaceAfterComma(agreementLetter.carParkingSlots)}</Text>
                        </View>
                    </View>
                </View>
                <View style={tableStyles.section}>
                    <Text style={{ ...tableStyles.header1, ...tableStyles.bold }}>DETAILS OF CONSIDERATION :</Text>
                    <View style={globalStyles.tableContainer}>
                        <View id='Header-Container' style={globalStyles.flexRow}>
                            <View style={{ ...globalStyles.padYHead, ...globalStyles.borderRight, ...{ width: "7%" } }}>
                                <Text style={{ ...tableStyles.header2, ...tableStyles.bold }}>
                                    S. No.
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "50%" } }}>
                                <Text style={{ ...tableStyles.header2, ...tableStyles.bold }}>
                                    Particulars
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "23%" } }}>
                                <Text style={{ ...tableStyles.header2, ...tableStyles.bold }}>
                                    Details
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...{ width: "20%" } }}>
                                <Text style={{ ...tableStyles.header2, ...tableStyles.bold }}>
                                    Amount (in Rs).
                                </Text>
                            </View>
                        </View>
                        <View id='Basic-Rate' style={globalStyles.flexRow}>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...globalStyles.center, ...{ width: "7%" } }}>
                                <Text style={tableStyles.p2}>
                                    1
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...{ width: "50%" } }}>
                                <Text style={tableStyles.p2}>
                                    Basic Rate (On Saleable Area, as per Selected Floor)
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...{ width: "23%" } }}>
                                <Text style={tableStyles.p2}>
                                    Rs. {formatNumberToIndianSystem(parseFloat(customerUnitDetails?.price_per_sq_ft) + parseFloat(customerUnitDetails?.floor_rise_rate))} Per Sq.ft.
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderTop, ...{ width: "20%" } }}>
                                <Text style={{ ...tableStyles.p2, textAlign: 'right' }}>
                                    Rs. {formatNumberToIndianSystem(parseFloat(customerUnitDetails?.basic_rate))}
                                </Text>
                            </View>
                        </View>
                        <View id='Amenities-Infrastructure' style={globalStyles.flexRow}>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...globalStyles.center, ...{ width: "7%" } }}>
                                <Text style={tableStyles.p2}>
                                    2
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...{ width: "73%" } }}>
                                <Text style={{ ...tableStyles.p, ...tableStyles.bold }}>
                                    Amenities, Infrastruture and other charges:
                                </Text>
                                <Text style={tableStyles.p}>
                                    TSSPDCL, HMWS & SB Connection Charges,
                                </Text>
                                <Text style={tableStyles.p2}>
                                    Club Facilities, Piped Gas connection, DG Sets, STP etc.,
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderTop, ...{ width: "20%" } }}>
                                <Text style={{ ...tableStyles.p2, textAlign: 'right', top: 15 }}>
                                    Rs. {formatNumberToIndianSystem(customerUnitDetails?.amenity_amount) || 0}
                                </Text>
                            </View>
                        </View>
                        <View id='Car-Parking' style={globalStyles.flexRow}>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...globalStyles.center, ...{ width: "7%" } }}>
                                <Text style={tableStyles.p2}>
                                    3
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...{ width: "73%" } }}>
                                <Text style={tableStyles.p2}>
                                    Car Parking charges
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderTop, ...{ width: "20%" } }}>
                                <Text style={{ ...tableStyles.p2, textAlign: 'right' }}>
                                    {convertToTBD(formatNumberToIndianSystem(customerUnitDetails?.car_parking_amount))}
                                </Text>
                            </View>
                        </View>
                        <View id='Car-Parking' style={globalStyles.flexRow}>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...globalStyles.center, ...{ width: "7%" } }}>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...{ width: "73%" } }}>
                                <Text style={tableStyles.header2}>
                                    TOTAL SALE CONSIDERATION
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderTop, ...{ width: "20%" } }}>
                                <Text style={{ ...tableStyles.header2, textAlign: 'right' }}>
                                    Rs. {formatNumberToIndianSystem(customerUnitDetails?.calculationFields?.total_sale_consideration_without_gst)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={tableStyles.section}>
                    <Text style={{ ...tableStyles.header1, ...tableStyles.bold }}>Below amounts are payable at the time of registration.</Text>
                    <View style={globalStyles.tableContainer}>
                        <View id='Corpus-Fund' style={globalStyles.flexRow}>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "57%" } }}>
                                <Text style={tableStyles.p2}>
                                    Corpus Fund (On Saleable Area)
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "23%" } }}>
                                <Text style={tableStyles.p2}>
                                    {formatWithRupee(formatNumberToIndianSystem(customerUnitDetails?.corpus_per_sft_rate)) === "TBD" ? formatWithRupee(formatNumberToIndianSystem(customerUnitDetails?.corpus_per_sft_rate)) : formatWithRupee(formatNumberToIndianSystem(customerUnitDetails?.corpus_per_sft_rate))}
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...{ width: "20%" } }}>
                                <Text style={{ ...tableStyles.p2, textAlign: 'right' }}>
                                    {formatWithRupeeForAmount(formatNumberToIndianSystem(customerUnitDetails?.calculationFields?.corpus_fund_amt))}
                                </Text>
                            </View>
                        </View>
                        <View id='Maintenance-Charge' style={globalStyles.flexRow}>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...globalStyles.center, ...{ width: "57%", alignItems: 'flex-start' } }}>
                                <Text style={tableStyles.p2}>
                                    Maintenance Charges
                                </Text>
                            </View>
                            {/* <View style={{ ...globalStyles.borderRight, ...globalStyles.borderTop, ...{ width: "58%" } }}>
                            <View style={{ ...globalStyles.flexRow, ...{ width: '100%' } }}>
                                <View style={{ ...globalStyles.padHead, ...globalStyles.center, ...globalStyles.borderRight, ...{ width: '60.5%' } }}>
                                    <Text style={tableStyles.pSmall}>
                                        Phase - I : Towers 1 to 6 (For first 2 years)
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.padHead, ...{ width: '39.5%' } }}>
                                    <Text style={tableStyles.p2}>
                                        Rs._______ /- per Sq.ft.
                                    </Text>
                                </View>
                            </View>
                            <View style={{ ...globalStyles.flexRow, ...globalStyles.borderTop, ...{ width: '100%' } }}>
                                <View style={{ ...globalStyles.padHead, ...globalStyles.center, ...globalStyles.borderRight, ...{ width: '60.5%' } }}>
                                    <Text style={tableStyles.pSmall}>
                                        Phase - I : Towers 1 to 6 (For first 2 years)
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.padHead, ...{ width: '39.5%' } }}>
                                    <Text style={tableStyles.p2}>
                                        Rs._______ /- per Sq.ft.
                                    </Text>
                                </View>
                            </View>
                        </View> */}
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...{ width: "23%" } }}>
                                <Text style={tableStyles.p2}>
                                    {formatWithRupee(customerUnitDetails?.maintenance_per_sft_rate) === "TBD" ? formatWithRupee(customerUnitDetails?.maintenance_per_sft_rate) : formatWithRupee(customerUnitDetails?.maintenance_per_sft_rate)}
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderTop, ...{ width: "20%", } }}>
                                <Text style={{ ...tableStyles.p2, textAlign: 'right' }}>
                                    {formatWithRupeeForAmount(formatNumberToIndianSystem(customerUnitDetails?.calculationFields?.maintaince_amount))}
                                </Text>
                            </View>
                        </View>
                        <View id='Legal-N-Documentation-Charge' style={globalStyles.flexRow}>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...{ width: "80%" } }}>
                                <Text style={tableStyles.p2}>
                                    Legal & Documentation Charges
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderTop, ...{ width: "20%" } }}>
                                <Text style={{ ...tableStyles.p2, textAlign: 'right' }}>
                                    {formatWithRupeeForAmount(formatNumberToIndianSystem(customerUnitDetails?.legal_charges_amt))}
                                </Text>
                            </View>
                        </View>
                        <View id='Total' style={globalStyles.flexRow}>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.borderTop, ...{ width: "80%" } }}>
                                <Text style={tableStyles.header2}>
                                    TOTAL
                                </Text>
                            </View>
                            <View style={{ ...globalStyles.padHead, ...globalStyles.borderTop, ...{ width: "20%" } }}>
                                <Text style={{ ...tableStyles.p2, textAlign: 'right' }}>
                                    {formatWithRupeeForAmount(formatNumberToIndianSystem(customerUnitDetails?.calculationFields?.document_without_gst))}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={tableStyles.section}>
                    <Text style={{ ...tableStyles.p2, ...globalStyles.underline, ...{ marginTop: 10 } }}>
                        Registration & Stamp Duty Charges:
                    </Text>
                    <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>
                        No separate Stamp suty and Registration charges shall be payable by the Purchaser(s) on sale deed registration.
                    </Text>
                    <Text style={{ ...tableStyles.p2, ...globalStyles.underline, ...{ marginTop: 10 } }}>
                        Applicable Rates & Taxes:
                    </Text>
                    <Text style={{ ...tableStyles.p2, ...tableStyles.bold, ...globalStyles.underline }}>
                        GST:
                    </Text>
                    <View style={globalStyles.wrap}>
                        <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>1. </Text>
                        <Text style={tableStyles.p2}>{(parseFloat(customerUnitDetails?.cgst_rate) + parseFloat(customerUnitDetails?.sgst_rate)) * 100}% on Sale Consideration.</Text>
                    </View>
                    <View style={globalStyles.wrap}>
                        <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>2. </Text>
                        <Text style={tableStyles.p2}>{convertToTBD((parseFloat(customerUnitDetails?.maintenance_gst_rate_state) + parseFloat(customerUnitDetails?.maintenance_gst_rate_central)) * 100) === "TBD" ? convertToTBD((parseFloat(customerUnitDetails?.maintenance_gst_rate_state) + parseFloat(customerUnitDetails?.maintenance_gst_rate_central)) * 100) : convertToTBD((parseFloat(customerUnitDetails?.maintenance_gst_rate_state) + parseFloat(customerUnitDetails?.maintenance_gst_rate_central)) * 100) + '%'} on Maintenance Charges and Legal & Documentation Charges.</Text>
                    </View>
                    <View style={globalStyles.wrap}>
                        <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>Note: </Text>
                        <Text style={tableStyles.p2}>The above GST/Taxes are subject to change as per the rules / laws from time to time. </Text>
                    </View>
                    <Text style={{ ...tableStyles.p2, ...globalStyles.underline, ...{ marginTop: 10 } }}>
                        Car Parking Allocation:
                    </Text>
                    <Text style={tableStyles.p2}>Car Parking allocation in Basement I/ Basement II / Basement III/ Basement IV is subject to availability on the date of allotment and Car Parking charges will be applicable as mentioned above</Text>
                </View>
                <Text style={globalStyles.pageNo} render={({ pageNumber, totalPages }) => (
                    `${pageNumber}`
                )} fixed />
            </Page>
            <Page id='6' size={'A4'} style={globalStyles.page}>
                <Text style={{ ...globalStyles.watermark, ...(watermarkText === 'Approved' ? { left: '40%' } : { left: '20%' }) }}>
                    {watermarkText}
                </Text>
                <View style={globalStyles.center}>
                    <Text style={{ ...tableStyles.header1, ...tableStyles.bold, ...{ marginBottom: 2 } }}>
                        PAYMENT SCHEDULE
                    </Text>
                    {/* <Text style={tableStyles.header2}>
                        (Tower: 1 to 6)
                    </Text> */}
                </View>
                <View style={{ ...globalStyles.tableContainer, ...{ marginTop: 10 } }}>
                    <View id='Header-Container' style={{ ...globalStyles.flexRow, ...{ backgroundColor: '#e6e6e6' } }}>
                        <View style={{ ...globalStyles.padYHead, ...globalStyles.borderRight, ...{ width: "6%", paddingLeft: 1, } }}>
                            <Text style={{ ...tableStyles.p2, ...tableStyles.bold, }}>
                                S.No
                            </Text>
                        </View>
                        <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "25%" } }}>
                            <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>
                                Particulars
                            </Text>
                        </View>
                        <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "20%" } }}>
                            <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>
                                Details
                            </Text>
                        </View>
                        <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "22%" } }}>
                            <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>
                                Consideration
                            </Text>
                        </View>
                        <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.center, ...{ width: "21%" } }}>
                            <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>
                                GST
                            </Text>
                        </View>
                        <View style={{ ...globalStyles.padHead, ...{ width: "22%" } }}>
                            <Text style={{ ...tableStyles.p2, ...tableStyles.bold, textAlign: 'center' }}>
                                Total Amount
                            </Text>
                        </View>
                    </View>
                    {(milestoneData || []).map((milestone: any, index: number) => {
                        let detailsForMileStonePercentage = `${(parseFloat(milestone?.applied_milestone_percentage) * 100)?.toFixed(0)}`;
                        let totalSaleConsideration = customerUnitDetails.calculationFields?.total_sale_consideration_without_gst;
                        if (milestone?.milestone_sequence === 1 || milestone?.milestone_sequence === 2) {
                            cumulativeMilestoneAmount += parseFloat(milestone?.milestone_amount);
                        }

                        if (milestone?.milestone_sequence === 1) {
                            detailsForMileStonePercentage = `Rs. ${formatNumberToIndianSystem(milestone?.milestone_amount)}/- + GST `
                        }
                        else if (milestone?.milestone_sequence === 2) {
                            let modifiedPercentage = Math.round((cumulativeMilestoneAmount / totalSaleConsideration) * 100);
                            detailsForMileStonePercentage = `${modifiedPercentage}% of Sale Consideration (less booking amount) + GST`
                        }
                        else {
                            detailsForMileStonePercentage = `${detailsForMileStonePercentage}% of Sale Consideration + GST`
                        }

                        return (
                            <View key={index} id='On-Booking' style={{ ...globalStyles.flexRow, ...globalStyles.borderTop }}>
                                <View style={{ ...globalStyles.padYHead, ...globalStyles.borderRight, ...globalStyles.center, ...{ width: "6%" } }}>
                                    <Text style={tableStyles.p2}>
                                        {index + 1}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...globalStyles.center, ...{ width: "25%", alignItems: 'flex-start' } }}>
                                    <Text style={tableStyles.p2}>
                                        {milestone?.milestone_description || 'N/A'}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "20%" } }}>
                                    <Text style={tableStyles.p2}>
                                        {detailsForMileStonePercentage || 0}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "22%", textAlign: 'right' } }}>
                                    <Text style={tableStyles.p3}>
                                        Rs. {formatNumberToIndianSystem(milestone?.milestone_amount) || 0}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "21%", textAlign: 'right' } }}>
                                    <Text style={tableStyles.p3}>
                                        Rs. {formatNumberToIndianSystem(parseFloat(milestone?.gst_amount)) || 0}
                                    </Text>
                                </View>
                                <View style={{ ...globalStyles.padHead, ...{ width: "22%", textAlign: 'right' } }}>
                                    <Text style={tableStyles.p3}>
                                        Rs. {formatNumberToIndianSystem(milestone?.total_milestone_amount) || 0}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                    }
                    <View id='Total' style={{ ...globalStyles.flexRow, ...globalStyles.borderTop }}>
                        <View style={{ ...globalStyles.padYHead, ...globalStyles.borderRight, ...globalStyles.center, ...{ width: "6%", } }}>
                            <Text style={tableStyles.p2}>
                            </Text>
                        </View>
                        <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "25%", justifyContent: 'center' } }}>
                            <Text style={tableStyles.header2}>
                                TOTAL
                            </Text>
                        </View>
                        <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "20%", justifyContent: 'center' } }}>
                            <Text style={{ ...tableStyles.header2, textAlign: 'center' }}>
                                {/* {Math.round(Number(customerUnitDetails?.sum_of_percentages * 100))} % */}
                                100 %
                            </Text>
                        </View>
                        <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "22%" } }}>
                            <Text style={{ ...tableStyles.header3, textAlign: 'right' }}>
                                Rs. {formatNumberToIndianSystem(customerUnitDetails?.calculationFields?.total_sale_consideration_without_gst) || 0}
                            </Text>
                        </View>
                        <View style={{ ...globalStyles.padHead, ...globalStyles.borderRight, ...{ width: "21%" } }}>
                            <Text style={{ ...tableStyles.header3, textAlign: 'right' }}>
                                Rs. {formatNumberToIndianSystem(customerUnitDetails?.sum_of_gst_amount) || 0}
                            </Text>
                        </View>,
                        <View style={{ ...globalStyles.padHead, ...{ width: "22%" } }}>
                            <Text style={{ ...tableStyles.header3, textAlign: 'right' }}>
                                Rs. {formatNumberToIndianSystem(customerUnitDetails?.sum_of_milestone_amount) || 0}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 10, gap: 5 } }}>
                    <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>
                        Note:
                    </Text>
                    <View style={{ width: '100%' }}>
                        <Text style={{ ...tableStyles.p2, ...tableStyles.bold }}>
                            Corpus Fund, Maintenance Charges and Legal  & Documentation Charges are payable at the time of Registration / Handover / Intimation of completion.
                        </Text>
                        <View style={{ ...globalStyles.flexRow, ...{ gap: 5, marginTop: 8 } }}>
                            <Text style={tableStyles.p2}>
                                Interested to avail home loan service by My Home Group:
                            </Text>
                            <View style={{ ...globalStyles.flexRow, ...{ gap: 4 } }}>
                                <Text style={tableStyles.p2}>Yes</Text>
                                <View style={{ ...globalStyles.tableContainer, ...globalStyles.center, ...{ height: 11, width: 11, } }}>
                                    {home_loan_value && <Image style={{ objectFit: "contain", height: "100%", width: "100%" }} src={Check} />}
                                </View>
                            </View>
                            <View style={{ ...globalStyles.flexRow, ...{ gap: 4, marginLeft: 10 } }}>
                                <Text style={tableStyles.p2}>No</Text>
                                <View style={{ ...globalStyles.tableContainer, ...globalStyles.center, ...{ height: 11, width: 11 } }}>
                                    {
                                        !home_loan_value &&
                                        <Image style={{ objectFit: "contain", height: "100%", width: "100%" }} src={Check} />
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 10, gap: 5 } }}>
                    <Text style={tableStyles.p2}>
                        TDS:
                    </Text>
                    <Text style={{ ...tableStyles.p2, justifyContent: 'center' }}>
                        TDS is applicable on Sale Consideration (excluding GST ) and shall be paid by the applicant/s (only) and submit the challan copy for our records. credit to your (Applicant/s) account will be made only after submission of challan copy and reflection of the said payment in Company's form 26 AS.
                    </Text>
                </View>
                <Text style={globalStyles.pageNo} render={({ pageNumber, totalPages }) => (
                    `${pageNumber}`
                )} fixed />
            </Page >
            <Page id='7' size={'A4'} style={globalStyles.page}>
                <Text style={{ ...globalStyles.watermark, ...(watermarkText === 'Approved' ? { left: '40%' } : { left: '20%' }) }}>
                    {watermarkText}
                </Text>
                <View style={globalStyles.center}>
                    <Text style={{ ...tableStyles.header1, ...tableStyles.bold, ...{ marginBottom: 2 } }}>
                        TERMS & CONDITIONS
                    </Text>
                </View>
                <View style={{ paddingLeft: '5%', paddingRight: '5%' }}>
                    {customerUnitDetails?.terms_and_conditions?.sort((a: any, b: any) => a.sequence - b.sequence)?.map((term: any, index: any) => (
                        <View key={index} style={{ ...globalStyles.flexRow, ...{ marginTop: 10 } }}>
                            <Text style={{ ...tableStyles.p3, ...{ width: "7%" } }}>
                                {term?.sequence})
                            </Text>
                            <Text style={{ ...tableStyles.p3, ...{ width: "93%", textAlign: 'justify', textJustify: 'inter-word' } }}>
                                {term?.description}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={{ ...globalStyles.flexRow, ...{ marginTop: 10, paddingRight: '5%' } }}>
                    <Text style={{ ...tableStyles.p3, textAlign: 'justify' }}>
                        I/We, the above Purchaser(s) do herein declare that the above particulars given by me/us are true and correct to the best of my/our knowledge &amp; information. Any allotment against this application is subject to the terms and conditions enclosed to this application and as per the Sale Agreement. I/We undertake to inform the Company of any change in my/our address or in any other particulars/information given above.
                    </Text>
                </View>
                <Text style={globalStyles.pageNo} render={({ pageNumber, totalPages }) => (
                    `${pageNumber}`
                )} fixed />
            </Page>
        </Document >
    );
}

export default ReviewApplicationPDF;