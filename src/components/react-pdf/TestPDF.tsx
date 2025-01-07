import { Document, Image, Page, PDFViewer, View } from '@react-pdf/renderer'
import {getConfigData} from '@Src/config/config'
import React, { FC } from 'react'

const TestPDF: FC = () => {
    return (
        <PDFViewer style={{ height: '100vh', width: "100%" }}>
            <Document>
                <Page id='1' debug={false} size={'A4'} >
                    <View style={{ height: "100%", width: "50%", backgroundColor: 'pink' }}>
                        <Image src={getConfigData('project_logo_image')} />
                        <Image style={{ objectFit: "contain", height: "100%", width: "100%" }} src={"https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/myhome/customer-profile-documents/e3286c02-e3ad-5f69-aa09-32bfcb864adb/applicant_photo/08-26-2024-11-52-19/Pan-Card.jpg"} />
                        <Image src={"https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/myhome/customer-profile-documents/e3286c02-e3ad-5f69-aa09-32bfcb864adb/applicant_photo/08-26-2024-15-08-42/4ccd086a8b7970c7a1ab4961e9bfcafc.jpg"} />
                        <Image src={"https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/myhome/customer-profile-documents/e3286c02-e3ad-5f69-aa09-32bfcb864adb/applicant_photo/08-26-2024-15-09-23/84fb3b82c7de88656e6ea770bec71b3e.jpg"} />
                        <Image src={"https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/myhome/customer-profile-documents/e3286c02-e3ad-5f69-aa09-32bfcb864adb/applicant_photo/08-26-2024-15-10-36/360_F_277758134_N1DrPaZUdmXarAC1R5d624FkNZ1qD0hR.jpg"} />
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    )
}

export default TestPDF;