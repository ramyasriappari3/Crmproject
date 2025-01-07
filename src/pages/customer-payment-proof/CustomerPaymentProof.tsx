import { Paper, Dialog, DialogContent, IconButton, CircularProgress, DialogTitle } from '@mui/material';
import { DataGrid, GridCloseIcon, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Visibility as EyeIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { httpService, MODULES_API_MAP } from '@Src/services/httpService';
import { IAPIResponse } from '@Src/types/api-response-interface';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { downloadFiles, formatNumberToIndianSystem } from '@Src/utils/globalUtilities';
import moment from 'moment';
import UploadPaymentProof from '@Components/payment-proof-upload/UploadPaymentProof';
import './CustomerPaymentProof.scss';

interface PaymentProofDetails {
    document_identifier: string;
    cust_unit_id: string;
    document_name: string;
    document_type: string;
    document_number: string;
    document_url: string;
    created_on: string;
    last_modified_by: string;
    payment_type: string;
    amount: string;
    payment_date: string;
    reconciled: boolean;
}

const CustomerPaymentProof = () => {
    const dispatch = useAppDispatch();
    const [paymentProofData, setPaymentProofData] = useState<PaymentProofDetails[]>([]);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentSheet, setShowPaymentSheet] = useState(false);
    const getURLParameters = useParams();

    const getPaymentProof = async () => {
        try {
            setLoading(true); // Start loading
            dispatch(showSpinner());
            const url = `${GLOBAL_API_ROUTES.GET_CUSTOMER_PAYMENT_PROOFS}?cust_unit_id=${getURLParameters.cust_unit_id}&cust_profile_id=${getURLParameters.cust_profile_id}`.trim();
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, url).GET();
            if (apiResponse?.success) {
                setPaymentProofData(apiResponse?.data?.paymentProofsData || []);
            }
        } catch (error) {
            console.error('Error fetching payment proof data:', error);
        } finally {
            setLoading(false); // Stop loading
            dispatch(hideSpinner());
        }
    };

    useEffect(() => {
        getPaymentProof();
    }, []);

    const handleOpenDialog = (url: string) => {
        setDocumentUrl(url);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDocumentUrl(null);
    };

    const handleDownloadDocument = (url: string, documentName: string) => {
        const fileExtension = url.split('.').pop()?.toLowerCase() || '';
        const fullFileName = `${documentName}.${fileExtension}`;
        downloadFiles(url, fullFileName);
    };

    const columns: GridColDef[] = [
        {
            field: 'amount',
            headerName: 'Amount Paid',
            flex: 1,
            minWidth: 200,
            resizable: false,
            valueGetter: (params) => Number(params),
            valueFormatter: (params: any) => params ? `₹ ${formatNumberToIndianSystem(params)}` : '',
            sortable: true,
            disableColumnMenu: true,
        },
        {
            field: 'payment_date',
            headerName: 'Payment Date',
            flex: 1,
            minWidth: 200,
            valueFormatter: (params: any) => params ? moment(params).format('DD/MM/YYYY') : '',
            resizable: false,
            disableColumnMenu: true,

        },
        {
            field: 'document_number',
            headerName: 'UTR / Cheque No.',
            flex: 1,
            minWidth: 200,
            resizable: false,
            disableColumnMenu: true,
            sortable: false
        },
        {
            field: 'created_on',
            headerName: 'Date Uploaded',
            flex: 1,
            minWidth: 200,
            valueFormatter: (params: any) => params ? moment(params).format('DD/MM/YYYY') : '',
            resizable: false,
            disableColumnMenu: true,

        },
        {
            field: 'reconciled',
            headerName: 'Reconciliation Done',
            flex: 1,
            // align:'left',
            minWidth: 200,
            renderCell: (params) => (
                <div className='tw-text-center tw-mr-6'>
                    {params.value ? "Yes" : "No"}
                </div>
            ),
            resizable: false,
            disableColumnMenu: true,

        },
        {
            field: 'view',
            headerName: 'Action',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <div className="tw-flex tw-gap-2">
                    <button onClick={() => handleOpenDialog(params.row.document_url)}>
                        <EyeIcon sx={{ color: '#7A7D7F' }} />
                    </button>
                    <button onClick={() => handleDownloadDocument(params.row.document_url, `Payment Proof`)}>
                        <DownloadIcon sx={{ color: '#7A7D7F' }} />
                    </button>
                </div>
            ),
            resizable: false,
            disableColumnMenu: true,
            sortable: false
        }
    ];

    const renderDocumentViewer = () => {
        if (!documentUrl) return null;

        const fileExtension = documentUrl?.split('.').pop()?.toLowerCase();
        if (fileExtension === 'pdf') {
            return (
                <iframe
                    src={documentUrl}
                    width="100%"
                    height="500px"
                    title="Document Viewer"
                />
            );
        } else if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
            return <img src={documentUrl} alt="Document" style={{ width: '100%', height: 'auto' }} />;
        } else {
            return <p>Unsupported file type: {fileExtension}</p>;
        }
    };

    return (
        <div className='section-container tw-p-4'>
            <div className='tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-gap-12 tw-mb-5'>
                <h2 className="tw-font-bold tw-text-black tw-text-lg">Payment Proof Reconciliation</h2>
                <button className='bg-white-btn-util' onClick={() => setShowPaymentSheet(true)}>Upload Payment Proof</button>
            </div>
            {loading ? (
                <div className="tw-flex tw-justify-center tw-my-5">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {paymentProofData?.length > 0 ? (
                        <div className='tw-w-full'>
                            <DataGrid
                                disableColumnResize={false}
                                rows={paymentProofData.map((row, index) => ({ id: index, ...row }))}
                                columns={columns}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                autoHeight
                            />
                        </div>
                    ) : (
                        <div className="tw-no-payment-proofs">
                            <p className="tw-no-payment-proofs-text">
                                No Payment Proofs Available
                            </p>
                        </div>
                    )}
                </>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    Payment Proof
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <GridCloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {renderDocumentViewer()}
                </DialogContent>
            </Dialog>
            {
                showPaymentSheet && <UploadPaymentProof
                    getPaymentProof={getPaymentProof}
                    setShowSheet={setShowPaymentSheet}
                    showSheet={showPaymentSheet}
                />
            }
        </div>
    );
}

export default CustomerPaymentProof;
