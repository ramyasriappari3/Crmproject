import './CostCalculationSheet.scss';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { convertToTBD, downloadFiles, formatNumberToIndianSystem, getTitleNameWithDots } from '@Src/utils/globalUtilities';
import moment from 'moment';
import { Tooltip, Table, TableBody, TableContainer, TableHead, TableRow, Paper, IconButton, styled, TableCell } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { useRef } from 'react';
import { toast } from 'react-toastify';

const CostCalculationSheet = (props: { showCostCalculationSheet: any, setShowCostCalculationSheet: any, costCalculationData: any, unit_Id: any }) => {
    const dispatch = useAppDispatch();

    const StyledTableCell: any = styled(TableCell)(({ theme }) => ({
        fontFamily: 'crm-font,arial,sans-serif',
        border: '1px solid #000',
        fontSize: '12px',
        margin: '0px !important',
        padding: '6px !important',
        textDecoration: 'none !important',
        color: '#000'
    }));

    const downloadCostCalculationSheet = async () => {
        try {
            dispatch(showSpinner());
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.GET_COST_CALCULATION_DATA}?unit_id=${props?.unit_Id}&type=${'Download'}`).GET();
            if (apiResponse?.success) {
                const fileUrl = apiResponse?.data;
                downloadFiles(fileUrl, `Cost Calculation Sheet.pdf`);
            }
        } catch (error) {
            console.error('Error downloading the cost calculation sheet:', error);
        }
        finally {
            dispatch(hideSpinner());
        }
    };

    const modalRef = useRef<HTMLDivElement>(null);

    const handleBackgroundClick = (event: any) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            props?.setShowCostCalculationSheet(false);
        }
    };

    return (
        <div className={props?.showCostCalculationSheet ? "cost-sheet-cont" : "tw-hidden"} onClick={handleBackgroundClick}>
            <div ref={modalRef} className='modal-content'>
                <div className='tw-flex tw-justify-end tw-gap-4'>
                    <Tooltip title='Download Cost Calculation Sheet' arrow placement='top'>
                        <button onClick={downloadCostCalculationSheet} className='tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125'>
                            <img src="/images/download-icon.svg" alt="Download" />
                        </button>
                    </Tooltip>
                    <Tooltip title='Close' arrow placement='top-start'>
                        <button onClick={() => props?.setShowCostCalculationSheet(false)} className='tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-125'>
                            <img src="/images/cross-icon.svg" alt="" />
                        </button>
                    </Tooltip>
                </div>
                <div className='sheet-table'>
                    <p className="tw-text-center fs14 font-bold">
                        COST CALCULATION SHEET <br />
                        {props?.costCalculationData?.project_name}
                    </p>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <StyledTableCell className='font-bold'>Customer Name</StyledTableCell>
                                    <StyledTableCell>
                                        <div className='tw-flex tw-w-auto tw-flex-wrap'>
                                            <span className='tw-mr-1'>
                                                {getTitleNameWithDots(props?.costCalculationData?.customer_title)}
                                                {props?.costCalculationData?.full_name}
                                            </span>
                                            {props?.costCalculationData?.joint_customer_names?.map((customer: any, index: any) => {
                                                return (
                                                    <span key={index} className='tw-mr-1'>
                                                        & {getTitleNameWithDots(customer?.customer_title)} {customer?.full_name}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell className='font-bold'>Area in SFT</StyledTableCell>
                                    <StyledTableCell>{props?.costCalculationData?.saleable_area}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell className='font-bold'>Block Name</StyledTableCell>
                                    <StyledTableCell>Block {parseInt(props?.costCalculationData?.tower_code)}</StyledTableCell>
                                    <StyledTableCell className='font-bold'>Date Of Booking</StyledTableCell>
                                    <StyledTableCell>{moment(props?.costCalculationData?.booking_date).format('DD.MM.YYYY')}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell className='font-bold'>Flat No.</StyledTableCell>
                                    <StyledTableCell>{Number(props?.costCalculationData?.floor_no)}{props?.costCalculationData?.unit_no}</StyledTableCell>
                                    <StyledTableCell className='font-bold'>Customer No</StyledTableCell>
                                    <StyledTableCell>{props?.costCalculationData?.customer_number}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell className='font-bold'>Selected Floor</StyledTableCell>
                                    <StyledTableCell>{Number(props?.costCalculationData?.floor_no)}</StyledTableCell>
                                    <StyledTableCell className='font-bold'>Sale Order No</StyledTableCell>
                                    <StyledTableCell>{props?.costCalculationData?.sale_order_number}</StyledTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableContainer component={Paper} className='tw-mt-4'>
                        <Table>
                            <TableHead>
                                <TableRow className='tw-bg-[#d4d4d4]'>
                                    <StyledTableCell className='!tw-text-center' >Particulars</StyledTableCell>
                                    <StyledTableCell className='!tw-text-center' >Rate</StyledTableCell>
                                    <StyledTableCell className='!tw-text-center' >Amount</StyledTableCell>
                                    <StyledTableCell className='!tw-text-center' >GST</StyledTableCell>
                                    <StyledTableCell className='!tw-text-center' >Total</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <StyledTableCell>Basic price - per SFT</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.price_per_sq_ft)}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.basic_amount)}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell>Floor rise rate</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.floor_rise_rate)}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.floor_rise_amount)}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell>Amenitites TSSPDCL , HMWS & SB Connection Charges , Club Facilites , DG sets , Piped Gas Connection</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.amenity_amount)}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                                {/* <TableRow>
                                    <StyledTableCell>Car Parking</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell>{formatNumberToIndianSystem(props?.costCalculationData?.car_parking_amount)}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow> */}
                                <TableRow>
                                    <StyledTableCell className='!tw-text-center font-bold'>Sale Consideration-(A)</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='font-bold !tw-text-right '>{formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.total_sale_consideration_without_gst)}</StyledTableCell>
                                    <StyledTableCell className='font-bold !tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.total_gst_amount)}</StyledTableCell>
                                    <StyledTableCell className='font-bold !tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.total_sale_consideration_with_gst)}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell>Legal and Documentation Charges</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.legal_charges_amt)) || ' '}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.legal_charges_gst)) || ' '}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.legal_charges_total)) || ' '}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell>Maintenance Charges (For First Two Years )- per SFT</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.maintenance_per_sft_rate)) || ' '}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.maintaince_rate)) || ' '}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.maintaince_amount_gst)) || ' '}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.maintaince_amount_with_gst)) || ' '}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell>Corpus Fund - per SFT</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.corpus_per_sft_rate)) || ' '}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.corpus_fund_rate)) || ' '}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.corpus_fund_amt)) || ' '}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell className='!tw-text-center font-bold'>Other Charges Payable at the time of Registration - (B)</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='font-bold !tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.document_without_gst)) || ' '}</StyledTableCell>
                                    <StyledTableCell className='font-bold !tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.document_gst)) || ' '}</StyledTableCell>
                                    <StyledTableCell className='font-bold !tw-text-right'>{convertToTBD(formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.document_with_gst)) || ' '}</StyledTableCell>
                                </TableRow>

                                <TableRow>
                                    <StyledTableCell className='!tw-text-center font-bold'>Total payable - (A + B)</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='font-bold !tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.total_amount_ts_plus_othchg)}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='!tw-text-center font-bold'>Paid Amount</StyledTableCell>
                                    <StyledTableCell className='font-bold !tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.paid_amount)}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='!tw-text-center font-bold'>Balance Due</StyledTableCell>
                                    <StyledTableCell className='font-bold !tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.calculationFields?.balance_amount)}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell className='!tw-text-center font-bold'>Amount Considered For Registration</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='!tw-text-right font-bold'>{formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.amount_considered_for_registration)}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell className='!tw-text-center font-bold'>Registration Charges</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.registration_charge_rate)}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.registration_charge_amount)}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell className='!tw-text-center font-bold'>Mutation Fees</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.mutation_fee_rate)}</StyledTableCell>
                                    <StyledTableCell className='!tw-text-right'>{formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.mutation_fee_amount)}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell className='!tw-text-center font-bold'>Total Registration Charges</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell className='!tw-text-right font-bold'>{formatNumberToIndianSystem(props?.costCalculationData?.registrationCharges?.total_registration_charges)}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};

export default CostCalculationSheet;
