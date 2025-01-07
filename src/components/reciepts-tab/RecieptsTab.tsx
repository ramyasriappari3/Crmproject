import "./RecieptsTab.scss";
import { useContext, useEffect, useState } from "react";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { useAppDispatch } from "@Src/app/hooks";
import {
	capitalizeFirstLetter,
	checkForFalsyValues,
	convertNumberToWords,
	downloadFiles,
	formatNumberToIndianSystem,
	getTitleNameWithDots,
} from "@Src/utils/globalUtilities";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import { Tooltip } from "@mui/material";
import ReceiptSheetPDF from "@Components/reciepts-sheet/ReceiptSheetPDF";
import { MyContext } from "@Src/Context/RefreshPage/Refresh";
import moment from "moment";
import Times from '../../assets/fonts/times.ttf';
import TimesBold from '../../assets/fonts/timr65w.ttf'
import {
	BlobProvider,
	Document,
	Font,
	Image,
	Link,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import userSessionInfo from "../../app/admin/util/userSessionInfo";
import Api from "../../app/admin/api/Api";
import { useParams } from "react-router-dom";


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
const RecieptsTab = () => {
	const dispatch = useAppDispatch();
	const [receipts, setReceipts] = useState<any>();
	const [receiptId, setReceiptId] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const { unit_id, cust_unit_id, cust_profile_id } = useContext(MyContext);
	const userInfo = userSessionInfo.logUserInfo();
	const { custUnitId, customerId } = useParams();
	const [currReceipt, setCurrReceipt] = useState<any>();
	const [applicantLine, setApplicantLine] = useState<boolean>(false);
	const [amountLine, setAmountLine] = useState<boolean>(false);

	const getAllReceipts = async () => {
		try {
			dispatch(showSpinner());
			if (!userInfo) {
				const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.GET_RECEIPTS}?cust_unit_id=${cust_unit_id}`).GET();
				if (apiResponse?.success) {
					setReceipts((apiResponse?.data || []).sort((a: any, b: any) => moment(b.receipt_date).diff(moment(a.receipt_date))));
				}
			} else if (userInfo?.user_type_id == "internal") {
				const { data, status, message }: any = await Api.get("crm_get_all_customer_receipts", { cust_unit_id: custUnitId });
				setReceipts((data || []).sort((a: any, b: any) => moment(b.receipt_date).diff(moment(a.receipt_date))));
			}
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(hideSpinner());
		}
	};

	var timeoutId: any;

	function cancelTimeout(): any {
		let downloadPdfId = document.getElementById("download_pdf_file_id");
		downloadPdfId?.click();
		clearTimeout(timeoutId);
		dispatch(hideSpinner());
	}

	const downloadReceipt = async (receiptId: any) => {
		try {
			dispatch(showSpinner());
			if (!userInfo) {
				const url = `${GLOBAL_API_ROUTES.GET_SINGLE_RECEIPT}?cust_profile_id=${cust_profile_id}&cust_unit_id=${cust_unit_id}&receipt_id=${receiptId}&type=${"View"}`.trim();
				const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, url).GET();
				if (apiResponse?.success) {
					setCurrReceipt(apiResponse?.data?.[0]);
					window.setTimeout(cancelTimeout, 2000);
				} else {
					dispatch(hideSpinner());
					throw new Error();
				}

			} else if (userInfo?.user_type_id == "internal") {
				const { data, status, message }: any = await Api.get("crm_get_single_receipt", { cust_unit_id: custUnitId, receipt_id: receiptId, type: 'View', cust_profile_id: customerId });
				if (status) {
					setCurrReceipt(data?.[0]);
					window.setTimeout(cancelTimeout, 2000);
				} else {
					dispatch(hideSpinner());
					throw new Error();
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleViewClick = (receiptId: any) => {
		setReceiptId(receiptId);
		setShowModal(true);
	};

	useEffect(() => {
		getAllReceipts();
	}, [unit_id]);

	useEffect(() => {
		if (currReceipt) {
			const applicantsLine = getTitleNameWithDots(currReceipt?.customer_title) + ' ' + currReceipt?.full_name + currReceipt?.joint_customer_names?.map((customer: any, index: any) => (` & ${getTitleNameWithDots(customer?.customer_title)} ${capitalizeFirstLetter(customer?.full_name)}`)) + ' ' + `(${currReceipt?.customer_number})`;
			const amountLine = convertNumberToWords(currReceipt?.receipt_amount)?.toUpperCase();
			setApplicantLine(applicantsLine?.length > 93);
			setAmountLine(amountLine?.length >= 57);
		}
	}, [currReceipt]);

	return (
		<div className="RecieptsCont">
			<h3 className="tw-my-4">Receipts</h3>
			{(receipts || [])?.map((data: any, index: any) => {
				return (
					<div className="tw-relative tw-group" key={index}>
						<div className="tw-flex tw-items-center tw-w-full tw-justify-between tw-p-1 fs13">
							<div className="tw-flex tw-items-center tw-gap-2">
								<div>
									<img src="/images/pdfIcon.svg" alt="" className="tw-size-8" />
								</div>
								<div className="tw-flex tw-flex-col">
									<div className="tw-text-[#25272D]">
										Receipt{index + 1}.pdf
									</div>
									<div className="tw-text-[#989FAE]">
										added on{" "}
										{checkForFalsyValues(
											moment(data?.receipt_date).format("DD/MM/YYYY")
										)}
									</div>
								</div>
							</div>
							<div className="tw-flex tw-gap-2 tw-opacity-0 group-hover:tw-opacity-100">
								<Tooltip title={"View Receipts"} arrow placement="top">
									<button
										onClick={() => handleViewClick(data?.receipt_id)}
										className="tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125"
									>
										<img src="/images/view-icon.svg" alt="View" />
									</button>
								</Tooltip>
								{/* <Tooltip title={'Download'} arrow placement='top'>
									<PDFDownloadLink
										document={<ReceiptSheetPDF receiptId={data?.receipt_id} />}
										fileName={`Receipt${index + 1}.pdf`}
									>
										{({ loading }) => (
											<button className="tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125">
												<img src="/images/download-icon.svg" alt="Download" />
											</button>
										)}
									</PDFDownloadLink>
								</Tooltip> */}
								<Tooltip title={"Download"} arrow placement="top">
									<button
										onClick={() => downloadReceipt(data?.receipt_id)}
										className="tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125"
									>
										<img src="/images/download-icon.svg" alt="Download" />
									</button>
								</Tooltip>
							</div>
						</div>
					</div>
				);
			})}
			{
				<ReceiptSheetPDF
					showModal={showModal}
					setShowModal={setShowModal}
					receiptId={receiptId}
				/>
			}
			{/* Render RecieptsSheet component when showModal is true */}
			{/* {
				showModal &&
				<RecieptsSheet
					showModal={showModal}
					setShowModal={setShowModal}
					receiptId={receiptId}
				/>
			} */}
			<BlobProvider
				document={
					<ReceiptPDF
						receipt={currReceipt}
						amountLine={amountLine}
						applicantLine={applicantLine}
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
								download={currReceipt?.receipt_number + ".pdf"}
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

export default RecieptsTab;

const ReceiptPDF = ({
	receipt,
	applicantLine,
	amountLine,
}: {
	receipt: any;
	applicantLine: any;
	amountLine: any;
}) => {
	return (
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
						<Text style={{ ...styles.text, borderRight: '1px solid #000', lineHeight: 0, paddingTop: 5, width: "33.3%", paddingRight: 5, paddingLeft: 2, textAlign: 'left', paddingBottom: '1' }}>E-mail:      {receipt?.project_email}</Text>
						<Link style={{ ...styles.hyperLink, paddingTop: 5, paddingLeft: "4", textAlign: 'left', width: "33.4%", paddingBottom: '1' }} src="#receipt?.company_website">{receipt?.company_website}</Link>
					</View>
				</View>
				<View style={styles.section}>
					<Text style={{ ...styles.text, fontSize: 11, fontFamily: "timesBold" }}>
						No signature is required as this is a system-generated document.
					</Text>
				</View>
			</Page>
		</Document>
	);
};
