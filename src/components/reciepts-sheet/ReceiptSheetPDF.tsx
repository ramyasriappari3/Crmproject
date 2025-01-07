import { useEffect, useState, useContext } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link, Font, PDFViewer } from '@react-pdf/renderer';
import { useAppDispatch } from '@Src/app/hooks';
import { capitalizeFirstLetter, checkForFalsyValues, convertNumberToWords, formatNumberToIndianSystem, getTitleNameWithDots } from '@Src/utils/globalUtilities';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { MyContext } from '@Src/Context/RefreshPage/Refresh';
import moment from 'moment';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { Dialog } from '@mui/material';
import { Block } from '@mui/icons-material';
import userSessionInfo from "../../app/admin/util/userSessionInfo";
import Api from "../../app/admin/api/Api";
import { useParams } from "react-router-dom";
import CustomPDFViewer from '@Components/custom-pdf-viewer/CustomPDFViewer';
import Times from '../../assets/fonts/times.ttf';
import TimesBold from '../../assets/fonts/timr65w.ttf'

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

const styles = StyleSheet.create({
	page: {
		padding: 10,
	},
	companyLogo: {
		width: 100,
		height: 100,
		position: 'absolute',
		top: 0,
		left: 10
	},
	section: {
		marginBottom: 10,
	},
	header: {
		fontSize: 18,
		fontFamily: "timesBold",
		textAlign: 'center',
		marginBottom: 8
	},
	subHeader: {
		fontSize: 14,
		marginBottom: 10,
		textAlign: 'center',
	},
	text: {
		fontSize: 11,
		fontFamily: 'timesNew',
		// marginBottom: 5,
		lineHeight: 2.5,
	},
	boldText: {
		fontSize: 10,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	underlineText: {
		textDecoration: 'underline',
	},
	columnFlex: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		marginBottom: 1.5,
	},
	rowFlex: {
		display: 'flex',
		flexDirection: 'row',
	},

	borderBottom: {
		borderBottom: '1px solid #000',
	},
	receiptBorder: {
		border: '1px solid #000',
	},
	hyperLink: {
		textDecoration: 'none',
		fontSize: 10,
		color: '#000',
	}
});

interface RecieptsSheetPDFProps {
	showModal?: boolean;
	setShowModal?: (show: boolean) => void;
	receiptId: string | null;
}

const ReceiptSheetPDF = ({ showModal = false, setShowModal, receiptId }: RecieptsSheetPDFProps) => {
	const dispatch = useAppDispatch();
	const [receipt, setReceipt] = useState<any>(null);
	const { cust_profile_id, cust_unit_id } = useContext(MyContext);
	const [applicantLine, setApplicantLine] = useState<boolean>(false);
	const [amountLine, setAmountLine] = useState<boolean>(false);
	const [amountLineWidth, setAmountLineWidth] = useState<string>('');
	const userInfo = userSessionInfo.logUserInfo();
	const { custUnitId, customerId } = useParams();
	const companyWebsite = receipt?.company_website;
	const url = companyWebsite && !companyWebsite.startsWith('http') ? `https://${companyWebsite}` : companyWebsite

	const getSingleReceipt = async (receiptId: string) => {
		try {
			dispatch(showSpinner());
			if (!userInfo) {
				const url = `${GLOBAL_API_ROUTES.GET_SINGLE_RECEIPT}?cust_profile_id=${cust_profile_id}&cust_unit_id=${cust_unit_id}&receipt_id=${receiptId}&type=${'View'}`.trim();
				const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, url).GET();
				if (apiResponse?.success) {
					setReceipt(apiResponse?.data?.[0] || []);
				}
			} else if (userInfo?.user_type_id == "internal") {
				let documentObj = {
					"cust_unit_id": custUnitId,
					"receipt_id": receiptId,
					"cust_profile_id": customerId,
					"type": "View"
				}
				const { data, status: responseStatus, message, }: any = await Api.get("crm_get_single_receipt", documentObj);
				setReceipt(data?.[0] || []);
			}

			dispatch(hideSpinner());
		} catch (error) {
			// Handle error
		}
	};

	useEffect(() => {
		if (receiptId) {
			getSingleReceipt(receiptId);
		}
	}, [receiptId]);

	useEffect(() => {
		if (receipt) {
			const applicantsLine = getTitleNameWithDots(receipt?.customer_title) + ' ' + receipt?.full_name + receipt?.joint_customer_names?.map((customer: any, index: any) => (` & ${getTitleNameWithDots(customer?.customer_title)} ${capitalizeFirstLetter(customer?.full_name)}`)) + ' ' + `(${receipt?.customer_number})`;
			const amountLine = convertNumberToWords(receipt?.receipt_amount)?.toUpperCase();
			const amountLineWidth = formatNumberToIndianSystem(receipt?.receipt_amount)?.length;
			setApplicantLine(applicantsLine?.length > 93);
			setAmountLine(amountLine?.length >= 57);
			setAmountLineWidth((amountLineWidth - 1) + '%');
		}
	}, [receipt]);

	return (
		<Dialog
			open={Boolean(showModal)}
			onClose={() => setShowModal && setShowModal(false)}
			maxWidth="md"
			fullWidth
			PaperProps={{ style: { width: '100%', height: '100%' } }}
		>
			<CustomPDFViewer type='' buttonElement='' fileName='' onClose={() => { setShowModal && setShowModal(false) }}>
				{/* <PDFViewer width="100%" height="100%" showToolbar={true}> */}
				<Document>
					<Page size="A4" style={styles.page}>
						<View style={styles.receiptBorder}>
							<View style={{ ...styles.columnFlex, paddingLeft: 10, paddingRight: 10 }}>
								<Text style={{ ...styles.header }}>{capitalizeFirstLetter(receipt?.company_name)}</Text>
								<View style={{ ...styles.companyLogo, marginTop: '22' }}>
									<Image style={{ height: "50%", width: "100%" }} src='/logo.png' />
								</View>
								<Text style={{ ...styles.text, lineHeight: '1', textAlign: 'center' }}>
									{receipt?.company_address},
								</Text>
								<Text style={{ ...styles.text, lineHeight: '1.5', textAlign: 'center' }}>
									{receipt?.company_city} - {receipt?.company_postal_code}, {receipt?.project_state}
								</Text>
								<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ textAlign: 'center', fontSize: 12, fontFamily: 'timesBold', padding: 5, backgroundColor: '#c7c7c7', display: 'flex', width: 90, marginTop: 5, borderRadius: 8, border: '1px solid #000' }}>
										RECEIPT
									</Text>
								</View>
							</View>

							<View style={{ ...styles.rowFlex, borderTop: '1px solid black', borderBottom: '1px solid black', paddingTop: 10, paddingLeft: 15, paddingBottom: 3, paddingRight: 15 }} >
								<Text style={{ ...styles.text, width: "33%", lineHeight: 0 }}>Receipt No.: {receipt?.receipt_number}</Text>
								<View style={{ ...styles.rowFlex, width: "34%" }}>
								</View>
								<Text style={{ ...styles.text, width: "33%", lineHeight: 0 }}>Date: {checkForFalsyValues(moment(receipt?.receipt_date).format('DD.MM.YYYY'))}</Text>
							</View>

							<View style={{ marginTop: '25px', padding: '10px', paddingLeft: 20 }}>
								<View style={{ flexDirection: 'row', ...styles.text, alignItems: 'center', position: 'relative', paddingBottom: !applicantLine ? 27 : 0 }}>
									<Text style={{ flexWrap: 'wrap', gap: 1, }}>Received with thanks from  {getTitleNameWithDots(receipt?.customer_title)} {receipt?.full_name}{receipt?.joint_customer_names?.map((customer: any, index: any) => (` & ${getTitleNameWithDots(customer?.customer_title)} ${capitalizeFirstLetter(customer?.full_name)}`))} {`(${receipt?.customer_number})`}</Text>
									<View id='applicant-line-1' style={{ position: 'absolute', right: 0, top: 13, height: 1, width: '78%', backgroundColor: 'black' }}>
									</View>
									<View id='applicant-line-2' style={{ position: 'absolute', right: 0, top: 38, height: 1, width: '100%', backgroundColor: 'black' }}>
									</View>
								</View>
								<View style={{ flexDirection: 'row', ...styles.text, alignItems: 'center', position: 'relative', paddingBottom: !amountLine ? 27 : 0, flexWrap: 'wrap' }}>
									<Text>
										a sum of Rs. {(formatNumberToIndianSystem(receipt?.receipt_amount) + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " ").substring(0, 20)} Rupees  {convertNumberToWords(receipt?.receipt_amount)?.toUpperCase()}
									</Text>
									<View id='amount-line-1' style={{ position: 'absolute', left: 55, top: 13, height: 1, width: '14.5%', backgroundColor: 'black' }}>
									</View>
									<View id='amount-line-2' style={{ position: 'absolute', right: 0, top: 13, height: 1, width: '68%', backgroundColor: 'black' }}>
									</View>
									<View id='amount-line-3' style={{ position: 'absolute', left: 0, top: 38, height: 1, width: '80%', backgroundColor: 'black' }}>
									</View>
									<Text style={{ ...styles.text, position: 'absolute', right: 0, top: 26, width: '100%', textAlign: 'right' }}>by Cheque No. / RTGS /</Text>
								</View>
								<View style={{ ...styles.text, flexDirection: 'row', gap: 3 }}>
									<Text>D.D. No.</Text>
									<View style={{ width: '26%', position: 'relative' }}>
										<Text>{checkForFalsyValues(receipt?.receipt_document_number)}</Text>
										<View style={{ position: 'absolute', left: 0, top: 13, height: 1, width: '100%', backgroundColor: 'black' }}>
										</View>
									</View>
									<Text>Date</Text>
									<View style={{ width: '25%', position: 'relative' }}>
										<Text>{checkForFalsyValues(moment(receipt?.transaction_date).format('DD.MM.YYYY'))}</Text>
										<View style={{ position: 'absolute', left: 0, top: 13, height: 1, width: '100%', backgroundColor: 'black' }}>
										</View>
									</View>
									<Text>Drawn on</Text>
									<View style={{ width: '28%', position: 'relative' }}>
										<Text>{receipt?.bank_details}</Text>
										<View style={{ position: 'absolute', left: 0, top: 13, height: 1, width: '100%', backgroundColor: 'black' }}>
										</View>
									</View>
								</View>
								<View style={{ ...styles.text, flexDirection: 'row', gap: 5 }}>
									<Text>
										Towards
									</Text>
									<View style={{ width: '95%', position: 'relative' }}>
										<Text>
											Flat No-{parseInt(receipt?.floor_no)}{receipt?.unit_no} Block-{parseInt(receipt?.tower_code)} {receipt?.project_name}
										</Text>
										<View id='amount-line-2' style={{ position: 'absolute', right: 0, top: 13, height: 1, width: '100%', backgroundColor: 'black' }}>
										</View>
									</View>
								</View>
							</View>

							<Text style={{ ...styles.text, textAlign: 'center', paddingTop: '6%', paddingLeft: '50%' }}>For {capitalizeFirstLetter(receipt?.company_name)}</Text>
							<Text style={{ ...styles.text, fontSize: 10, lineHeight: 1.5, paddingLeft: '3%' }}>(Cheques are subject to realisation)</Text>
							<View style={{ ...styles.rowFlex, borderTop: '1px solid #000', fontSize: 9 }}>
								<Text style={{ ...styles.text, fontFamily: "timesBold", textAlign: 'center', marginBottom: 0, borderRight: '1px solid #000', width: "33.3%", lineHeight: 0, padding: '5', paddingBottom: '1' }}>CIN: {receipt?.company_cin_number}</Text>
								<Link style={{ ...styles.hyperLink, paddingTop: 5, paddingLeft: "4", textAlign: 'left', width: "33.4%", paddingBottom: '1' }} src={`mailto:${receipt?.project_email}`}>{receipt?.project_email}</Link>
								<Link style={{ ...styles.hyperLink, paddingTop: 5, paddingLeft: "4", textAlign: 'left', width: "33.4%", paddingBottom: '1' }} src={url}>{receipt?.company_website}</Link>
							</View>
						</View>
						<View style={styles.section}>
							<Text style={{ ...styles.text, fontSize: 11, fontFamily: "timesBold" }}>
								No signature is required as this is a system-generated document.
							</Text>
						</View>
					</Page>
				</Document>
				{/* </PDFViewer> */}
			</CustomPDFViewer>

		</Dialog >
	);
};

export default ReceiptSheetPDF;
