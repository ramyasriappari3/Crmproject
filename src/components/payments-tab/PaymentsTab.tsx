import { useEffect, useState } from 'react'
import './PaymentsTab.scss'
import PaymentCard from '@Components/payment-card/PaymentCard'
import { useNavigate } from 'react-router-dom'
import { Ipayment } from '@Constants/global-interfaces'
import { useAppDispatch } from '@Src/app/hooks'
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice'
import { IAPIResponse } from '@Src/types/api-response-interface'
import { MODULES_API_MAP, httpService } from '@Src/services/httpService'
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes'
import { convertToTBD, formatNumberToIndianSystem, getDataFromLocalStorage } from '@Src/utils/globalUtilities'
import CostCalculationSheet from '@Components/cost-calculation-sheet/CostCalculationSheet'
import UploadPaymentProof from '@Components/payment-proof-upload/UploadPaymentProof'
import Costcalculationsheets from '@Components/cost-calculation-sheet/costcalculationsheets'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import styled from '@emotion/styled'
// interface PaymentsTabProps {
//     unit_Id: string
// }

const StyledTableCell = styled(TableCell)(({ theme: any }) => ({
    fontFamily: 'Inter',
    fontSize: '14px',
    color: '#25272D',
    border: 'none',
    verticalAlign: 'top',
}));

const PaymentsTab = (props: { unit_Id: any }) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const [showCostCalculationSheet, setShowCostCalculationSheet] = useState(false)
    const [paymentsData, setPaymentsData] = useState<Ipayment[]>([]);
    const [costCalculationData, setCostCalculationData] = useState<any>();
    const [custUnitId, setCustUnitId] = useState<any>();
    const [totalPaymentsData, setTotalPaymentsData] = useState<any>();
    const userDetails = JSON.parse(getDataFromLocalStorage('user_details'));

    const getPayment = async () => {
        try {
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.GET_SINGLE_UNIT_DETAILS}?unit_id=${props?.unit_Id}`).GET();
            if (apiResponse?.success) {
                setPaymentsData(apiResponse?.data?.resultData?.[0]?.unit_milestones);
                setTotalPaymentsData({
                    sum_of_milestone_amount: apiResponse?.data?.resultData?.[0]?.sum_of_milestone_amount,
                    sum_of_gst_amount: apiResponse?.data?.resultData?.[0]?.sum_of_gst_amount,
                    sum_of_tds_amount: apiResponse?.data?.resultData?.[0]?.sum_of_tds_amount,
                    sum_of_total_payable_tds_amount: apiResponse?.data?.resultData?.[0]?.sum_of_total_payable_tds_amount,
                    sum_of_percentages: apiResponse?.data?.resultData?.[0]?.sum_of_percentages
                });
            }
        } catch (error) {

        }
    };
    const getCostCalculationData = async () => {
        try {
            dispatch(showSpinner());
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.GET_COST_CALCULATION_DATA}?unit_id=${props?.unit_Id}&type=${'View'}`).GET();
            if (apiResponse?.success) {
                ////console.log(apiResponse?.data?.resultData?.[0]?.first_name);
                setCostCalculationData(apiResponse?.data?.resultData?.[0] || [])
                setCustUnitId(apiResponse?.data?.resultData?.[0]?.cust_unit_id)
            }

            dispatch(hideSpinner());
        } catch (error) {
            ////console.log(error);
        }
    };


    useEffect(() => {
        getPayment()
        getCostCalculationData()
    }, [props?.unit_Id])

    return (
        <div className='payments-tab-cont' >
            <div className='tw-flex tw-justify-between tw-my-4'>
                <div>
                    <p className='fs14 tw-font-bold tw-text-[#25272D]'>Payments</p>
                    <p className='fs13 tw-font-normal tw-text-[#656C7B]'>Payment Schedule</p>
                </div>
                <div className="tw-flex tw-w-4/5 tw-flex-wrap tw-gap-4 tw-justify-end" >
                    <button className='head-buttons' onClick={() => navigate(`/payments-proof/${custUnitId}/${userDetails?.cust_profile_id}`)}>Payment Proof Reconciliation</button>
                    <button className='head-buttons' onClick={() => navigate(`/tds-info/unitId/${props?.unit_Id}/custUnitId/${custUnitId}`)} >View TDS details</button>
                    <button className='head-buttons' onClick={() => setShowCostCalculationSheet(true)} >
                        <img src="/images/ruppee-icon.svg" alt="" className='tw-size-4 tw-mx-1' />Cost calculation sheet
                    </button>
                </div>
            </div>
            <div>
                {paymentsData && <PaymentCard
                    paymentsData={paymentsData}
                    unitId={props?.unit_Id}
                    custUnitId={custUnitId}
                    totalPaymentsData={totalPaymentsData}
                />}
            </div>
            <div className='other-charges-cont'>
                <p className='tw-font-semibold tw-my-5 tw-text-[#25272D]' >Other charges</p>
                <TableContainer
                    component={Paper}
                    variant='outlined'
                    sx={{
                        backgroundColor: '#fff',
                        border: '1px solid #DFE1E7',
                        borderRadius: '16px'
                    }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell sx={{ fontWeight: '700' }}>Particulars</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: '700', textAlign: 'center' }}>Rate</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: '700', textAlign: 'center' }}>Amount</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: '700', textAlign: 'center' }}>GST</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: '700', textAlign: 'center' }}>Total</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <StyledTableCell>Legal and Documentation Charges</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'center' }}>--</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.legal_charges_amt))}</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.legal_charges_gst))}</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.legal_charges_total))}</StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell>Maintenance Charges (For First Two Years) - per SFT</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.maintenance_per_sft_rate))}</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.maintaince_amount))}</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.maintaince_amount_gst))}</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.maintaince_amount_with_gst))}</StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell>Corpus Fund - per SFT</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.corpus_per_sft_rate))}</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.corpus_fund_amt))}</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'center' }}>--</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.corpus_fund_amt))}</StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell sx={{ fontWeight: '700' }}>Total of Other Charges payable at the time of registration- (B)</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right', fontWeight: '700' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.document_without_gst))}</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right', fontWeight: '700' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.document_gst))}</StyledTableCell>
                                <StyledTableCell sx={{ textAlign: 'right', fontWeight: '700' }}>{convertToTBD(formatNumberToIndianSystem(costCalculationData?.calculationFields?.document_with_gst))}</StyledTableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>


            {/* <CostCalculationSheet
                showCostCalculationSheet={showCostCalculationSheet}
                setShowCostCalculationSheet={setShowCostCalculationSheet}
                unit_Id={props?.unit_Id}
                costCalculationData={costCalculationData}
            /> */}
            {
                showCostCalculationSheet &&
                <Costcalculationsheets
                    showCostCalculationSheet={showCostCalculationSheet}
                    setShowCostCalculationSheet={setShowCostCalculationSheet}
                    unit_Id={props?.unit_Id}
                    costCalculationData={costCalculationData}
                />
            }


            {/* <PDFDownloadLink document={<Costcalculationsheets
                showCostCalculationSheet={showCostCalculationSheet}
                setShowCostCalculationSheet={setShowCostCalculationSheet}
                unit_Id={props?.unit_Id}
                costCalculationData={costCalculationData} />} fileName="somename.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download now!'
                }
            </PDFDownloadLink> */}
        </div >
    )
}

export default PaymentsTab