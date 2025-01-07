import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Modal, OutlinedInput, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { getDataFromLocalStorage } from '@Src/utils/globalUtilities';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { useAppDispatch } from "@Src/app/hooks";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import "./UploadPaymentProof.scss";
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';

const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const isFile = (value: unknown): value is File => {
    return value instanceof File;
};

const modalContentStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 'auto',
    width: '90%',
    maxWidth: '500px',
    bgcolor: 'white',
    borderRadius: '6px',
    boxShadow: 24,
    padding: '24px',
    overflowY: 'auto',
    '@media (max-width: 600px)': {
        width: '90%',
    }
};

const schema = yup.object().shape({
    paymentAmount: yup
        .string()
        .required('Payment amount is required')
        .matches(/^\d+(\.\d+)?$/, 'Amount must be a positive number')
        .test('is-greater-than-zero', 'Amount must be greater than 0', value => parseFloat(value) > 0),
    paymentDate: yup
        .date()
        .typeError('Payment Date is required')
        .nullable('Payment Date is required')
        .required("Payment date is required")
        .max(new Date(), "Payment date cannot be in the future")
        .min(new Date('1950-01-01'), "Payment date cannot be earlier than 1950"),
    documentNumber: yup.string().required("UTR/Cheque number is required").min(6, "UTR/Cheque number must be at least 6 characters"),
    document: yup.mixed()
        .required("Document is required")
        .test("notNull", "Document is required", (value) => value !== null)
        .test("fileType", "Unsupported file format", (value) => isFile(value) && SUPPORTED_FILE_TYPES.includes(value.type))
        .test("fileSize", "File size should be between 20KB and 2MB", (value) =>
            isFile(value) && value.size > 20 * 1024 && value.size <= 2048 * 1024
        ),
});

interface IFormInputs {
    paymentAmount: number | null;
    paymentDate: Date | null;
    documentNumber: string;
    document: File | null;
}

const UploadPaymentProof: React.FC<{ getPaymentProof: () => void, showSheet: boolean, setShowSheet: (show: boolean) => void }> = (props) => {
    const dispatch = useAppDispatch();
    const userDetails: any = JSON.parse(getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS));
    const cust_unit_id = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.CUST_UNIT_ID)
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const { control, handleSubmit, setValue, trigger, clearErrors, reset, formState: { errors } } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });

    const handleFileUpload = async (document: File | null) => {
        try {
            if (!document) {
                return;
            }
            const customHeaders: any = {
                'Content-Type': 'multipart/form-data'
            };
            let reqObj: any = {
                file: document,
                cust_profile_id: userDetails.cust_profile_id,
                document_name: 'payment_proof'
            };
            const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.UPLOAD_DOCUMENTS, true, true, customHeaders).POST(reqObj);
            if (response.success) {
                return response?.data?.data;
            } else {
                toast.error(response?.message);
            }
        } catch {
            toast.error("Error uploading the file");
        }
    };

    const uploadPaymentProof = async (data: IFormInputs) => {
        try {
            dispatch(showSpinner());
            let uploadedFile = await handleFileUpload(data?.document);
            let reqObj: any = {
                amount: data.paymentAmount,
                payment_type: 'payment',
                cust_unit_id: cust_unit_id,
                document_name: 'payment_proof',
                document_type: 'Proofs',
                document_number: data.documentNumber,
                document_url: uploadedFile,
                last_modified_by: userDetails?.user_login_name,
                payment_date: moment(data.paymentDate).format('YYYY-MM-DD'),
            };
            const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.UPLOAD_PAYMENT_PROOFS}`).POST(reqObj);
            if (response.success) {
                toast.success('Payment Proof Uploaded Successfully');
                props.setShowSheet(false);
                props.getPaymentProof();
                reset();
            }
            else {
                toast.error(response?.message);
            }
            dispatch(hideSpinner());
        } catch (error) {
            console.error('Error uploading payment proof:', error);
            toast.error("Error uploading payment proof");
        }
    };

    const onSubmit = async (data: IFormInputs) => {
        await uploadPaymentProof(data);
        props.setShowSheet(false);
    };

    const handleClose = () => {
        props.setShowSheet(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setValue('document', file);
        trigger('document');
    }

    return (
        <div>
            <Modal open={props.showSheet} onClose={handleClose}>
                <Box sx={modalContentStyle}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="tw-flex tw-justify-between">
                            <p className="tw-font-bold tw-text-2xl tw-text-black">Upload Payment Proof</p>
                            <p className='tw-cursor-pointer' onClick={handleClose}><CloseIcon /></p>
                        </div>
                        <p className="tw-my-4 fs14">Feel free to upload your payment proof here along with relevant information below.</p>
                        <div className="tw-flex tw-flex-col tw-flex-start">
                            <div className='tw-mb-1'><span className='tw-text-red-500'>*</span><span className='fs13 text-pri-black'>Payment Amount</span></div>
                            <Controller
                                name="paymentAmount"
                                control={control}
                                render={({ field }) => (
                                    <OutlinedInput
                                        fullWidth
                                        {...field}
                                        placeholder="₹ Enter your paid amount"
                                        error={!!errors.paymentAmount}
                                        onFocus={() => clearErrors('paymentAmount')}
                                        onBlur={() => trigger('paymentAmount')}
                                        inputProps={{ maxLength: 10 }}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            const sanitizedValue = value.replace(/[^0-9.]/g, '');
                                            if (sanitizedValue.split('.').length <= 2) {
                                                field.onChange(sanitizedValue);
                                            }
                                        }}
                                    />
                                )}
                            />
                            <p className="tw-text-red-500">{errors.paymentAmount?.message}</p>

                            <div className='tw-mb-1 tw-mt-2'><span className='tw-text-red-500'>*</span><span className='fs13 text-pri-black'>Payment Date</span></div>
                            <Controller
                                name="paymentDate"
                                control={control}
                                render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            {...field}
                                            open={open}
                                            onOpen={() => setOpen(true)}
                                            onClose={() => setOpen(false)}
                                            maxDate={new Date()}
                                            minDate={new Date('1950-01-01')}
                                            value={selectedDate}
                                            onChange={(date: any) => {
                                                field.onChange(date);
                                                setSelectedDate(date);
                                                // clearErrors('paymentDate');
                                            }}
                                            inputFormat="dd/MM/yyyy"
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    {...params}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    className='!tw-mr-2'
                                                                    aria-label="toggle date picker"
                                                                    onClick={() => setOpen(!open)}
                                                                    edge="end"
                                                                >
                                                                    <CalendarTodayOutlinedIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    placeholder="Enter the Payment Date"
                                                    onClick={() => setOpen(!open)}
                                                    error={!!errors.paymentDate}
                                                    onFocus={() => clearErrors('paymentDate')}
                                                    onBlur={() => trigger('paymentDate')}

                                                />
                                            )}
                                            InputAdornmentProps={{ style: { marginRight: 15 } }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                            <p className="tw-text-red-500">{errors.paymentDate?.message}</p>

                            <div className='tw-mb-1 tw-mt-2'><span className='tw-text-red-500'>*</span><span className='fs13 text-pri-black'>UTR/ Cheque Number</span></div>
                            <Controller
                                name="documentNumber"
                                control={control}
                                render={({ field }) => (
                                    <OutlinedInput
                                        fullWidth
                                        {...field}
                                        placeholder="UTR/ Cheque number"
                                        error={!!errors.documentNumber}
                                        onFocus={() => clearErrors('documentNumber')}
                                        onBlur={() => trigger('documentNumber')}
                                        inputProps={{ maxLength: 20 }}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            const sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
                                            field.onChange(sanitizedValue);
                                        }}
                                    />
                                )}
                            />
                            <p className="tw-text-red-500">{errors.documentNumber?.message}</p>

                            <div className='tw-mb-1 tw-mt-2'><span className='tw-text-red-500'>*</span><span className='fs13 text-pri-black'>Upload document</span></div>
                            <div>
                                <Controller
                                    name="document"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            onFocus={() => clearErrors('document')}
                                            className='tw-block tw-w-full file:tw-mr-8 text-pri-header fs13 file:tw-cursor-pointer
                                            file:tw-font-semibold file:tw-border-1
                                            file:tw-p-1 tw-border-1 file:tw-rounded-md file:tw-border-gray-200 
                                            tw-text-black file:tw-bg-gray-200 file:tw-m-1.5
                                            hover:file:tw-cursor-pointer hover:file:tw-bg-sky-50 tw-rounded-lg
                                            hover:file:tw-text-sky-700'
                                        />
                                    )}
                                />
                                <p className="tw-text-red-500">{errors.document?.message}</p>
                            </div>
                            <p className="fs13">Supported files: jpeg, jpg, png, pdf</p>

                            <div className='tw-flex tw-justify-end tw-gap-6 tw-items-center tw-mt-6'>
                                <button onClick={() => props.setShowSheet(false)} className='bg-white-btn-util'>Close</button>
                                <button type="submit" className='bg-black-btn-util'>Upload</button>
                            </div>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}

export default UploadPaymentProof;
