import React, { useRef, useState } from 'react';
import { Backdrop, Box, Fade, Modal, IconButton, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import ProgressBar from '@ramonak/react-progress-bar';
import Api from "@App/admin/api/Api";
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import getEnqueueSnackbar from '../../util/msgformate';
import CloseIcon from '@mui/icons-material/Close';
import { getCustomerConfigData } from '@Src/config/config';


console.log(getCustomerConfigData('CustomerDocuments'))

function FileUploadDocs(props: any) {
    //const errorApplicantPhoto = props?.applicationInfo?.customerProfileForm?.is_error_form?.errorList?.document_url;
    const allTypeErrorList = props?.applicationInfo?.customerProfileForm?.is_error_form?.errorList;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { customerId } = useParams();
    const { fileUplodDocuments, handleFileChangeEvent, applicantForm, applicationInfo } = props;
    const [fileSize, setFileSize] = useState<any>();
    //console.log(props);
    const ctrlTitle: any = {
        applicant_photo: "Applicant Photo (" + (applicantForm?.full_name).trim() + ")",
        Aadhaar_number: applicantForm?.aadhaar_number ? "Aadhaar Card " + "(" + applicantForm?.aadhaar_number + ")" : "Aadhaar Card",
        PAN: applicantForm?.pan_card ? "PAN Card " + "(" + applicantForm?.pan_card + ")" : "PAN Card",
        passport_number: applicantForm?.passport_number ? "Passport Number" + "(" + applicantForm.passport_number + ")" : "Passport Number",
        bank_account_proof: "Cancelled cheque/ Bank statement with account details/ Passbook",
    };
    const customerDocuments = getCustomerConfigData('CustomerDocuments');
    const documentTypes = customerDocuments.documentTypes;

    // Helper function to convert size string to bytes
    const convertSizeToBytes = (sizeString: string): number => {
        const [value, unit] = sizeString.split('-');
        const numericValue = parseFloat(value);
        const lowerCaseUnit = unit.toLowerCase();

        if (lowerCaseUnit === 'kb') {
            return numericValue * 1024;
        } else if (lowerCaseUnit === 'mb') {
            return numericValue * 1024 * 1024;
        }
        return numericValue; // Default to bytes if unit is not recognized
    };

    // Function to get document-specific validation rules
    const getDocumentValidationRules = (documentName: string) => {
        const defaultRules = {
            SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'image/webp'],
            supportedFormat: 'JPG,JPEG,PNG,PDF,WEBP',
            minSize: '20-KB',
            maxSize: '2-MB'
        };

        const specificRules = documentTypes[documentName] || {};

        return { ...defaultRules, ...specificRules };
    };

    const ctrlValid: any = Object.fromEntries(
        Object.entries(documentTypes).map(([key, value]: [string, any]) => [
            key,
            `Supported files: ${value.supportedFormat} (File Size ${value.minSize} to ${value.maxSize})`
        ])
    );
    const ctrlDesc: any = {
        applicant_photo: "Click 'Choose File' to find one of your own photos on your computer, then click 'Upload'. Photo should be at least 180x180 pixels and in jpg format.",
        Aadhaar_number: "",
        PAN: "",
        bank_account_proof: "For the document upload make sure the name of the account holder, banker details, and other account details are visible in the Uploaded File",
    };
    const ctrlFileFormats: any = Object.fromEntries(
        Object.entries(documentTypes).map(([key, value]: [string, any]) => [
            key,
            `.${value.supportedFormat.toLowerCase().split(',').join(',.')}`
        ])
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileErrorMsg, setFileErrorMsg]: any = useState("");
    const [fileEvents, setFileEvents]: any = useState({
        progressBarColor: '#FF0006', progressBarCount: 0,
        showUploadButton: false, fileInfo: {}, showModal: false, showViewModal: false
    });

    const handleFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        const uploadedFileSizeInKB = (selectedFile?.size ?? 0) / 1024;
        setFileSize(uploadedFileSizeInKB);

        const docRules = getDocumentValidationRules(fileUplodDocuments.document_name);
        const minSizeInBytes = convertSizeToBytes(docRules.minSize);
        const maxSizeInBytes = convertSizeToBytes(docRules.maxSize);

        if (!docRules.SUPPORTED_FILE_TYPES.includes(selectedFile.type)) {
            setFileErrorMsg(`Only ${docRules.supportedFormat} are allowed`);
            setFileEvents({ ...fileEvents, showUploadButton: false, "fileInfo": { [e.target.name]: selectedFile } });
            return;
        }

        if (selectedFile) {
            if (selectedFile.size < minSizeInBytes) {
                setFileErrorMsg(`File size is less than ${docRules.minSize}.`);
            } else if (selectedFile.size > maxSizeInBytes) {
                setFileErrorMsg(`Document size should be more than ${docRules.minSize} and less than ${docRules.maxSize}.`);
                setFileEvents({ ...fileEvents, showUploadButton: false, "fileInfo": { [e.target.name]: selectedFile } });
            } else {
                setFileErrorMsg("");
                setFileEvents({ ...fileEvents, showUploadButton: true, "fileInfo": { [e.target.name]: selectedFile } });
            }
        }
    }

    const handleUpload = async () => {
        let count = 5;
        const myInterval = setInterval(function () {
            if (count <= 70) {
                setFileEvents({ ...fileEvents, progressBarCount: count });
            }
            count += 5;
        }, 1000);
        let url_name = "documents_upload"
        const formData: any = new FormData();
        formData.append('file', fileEvents.fileInfo[fileUplodDocuments.document_name]);
        formData.append('cust_profile_id', customerId);
        formData.append('document_name', fileUplodDocuments.document_name);
        const { status, data, message } = await Api.post(url_name, formData);
        for (let i = 70; i <= 100; i++) {
            setFileEvents({ ...fileEvents, progressBarCount: i, progressBarColor: '#2cba00' });
        }
        count = 5;
        clearInterval(myInterval);
        setFileEvents({ ...fileEvents, progressBarCount: 0, progressBarColor: '#FF0006', showUploadButton: false, showModal: false });
        if (status) {
            enqueueSnackbar(message, getEnqueueSnackbar.alertMsgInfo("success"));
            const fileInfo = { "document_name": fileUplodDocuments.document_name, document_url: data.data };
            props.handleFileChangeEvent(fileInfo);
        } else {
            enqueueSnackbar(message, getEnqueueSnackbar.alertMsgInfo("error"));
        }
    }

    const isShowModal = (active: boolean) => {
        setFileEvents({ ...fileEvents, showModal: active, showUploadButton: false });
        if (!active) {
            setFileErrorMsg("");
        }
    }

    const isShowViewModal = (active: boolean) => {
        setFileEvents({ ...fileEvents, showViewModal: active });
    }

    function isFileImage(fileUrl: string) {
        let regExpression = new RegExp(/[^\s]+(.*?).(jpg|jpeg|png|JPG|JPEG|PNG)$/);
        return regExpression.test(fileUrl) ? true : false;
    }

    const handleRemove = (fileUplodDocuments: any) => {
        //console.log(fileUplodDocuments,fileUplodDocuments)
        setFileErrorMsg('');
        const fileInfo = { "document_name": fileUplodDocuments.document_name, document_url: "" };
        props.handleFileChangeEvent(fileInfo);
    }

    const getFileUploadErrorMessages = () => {
        //console.log(applicationInfo?.customerProfileForm.tab_active_key_info.active_stepper_name);
        //console.log(allTypeErrorList);
        let errorMsg = "";
        if (allTypeErrorList !== undefined) {
            if (applicationInfo?.customerProfileForm.tab_active_key_info.active_stepper_name === "upload_documents") {
                allTypeErrorList?.flatMap((item: any) => {
                    const key = Object.keys(item)[0];
                    if (item[key][fileUplodDocuments?.document_name] !== undefined) {
                        errorMsg = item[key][fileUplodDocuments?.document_name]
                    }
                });
            } else if (applicationInfo?.customerProfileForm.tab_active_key_info.active_stepper_name === "finance_details") {
                errorMsg = "";
            } else {
                allTypeErrorList?.flatMap((item: any) => {
                    const key = Object.keys(item)[0];
                    if (key === applicationInfo?.customerProfileForm.tab_active_key_info.active_stepper_name) {
                        if (item[key][fileUplodDocuments?.document_name] !== undefined) {
                            errorMsg = item[key][fileUplodDocuments?.document_name]
                        }
                    }
                });
            }
        }
        return errorMsg;
    }

    //applicantForm.passport_number
    const errorMessage = "";
    const previewImageURL = "";
    const file = "";
    const fileUrl = "";
    return (
        <div className='tw-flex tw-flex-col'>
            <p className='tw-text-xs tw-text-black tw-mb-4'>
                {ctrlTitle[fileUplodDocuments.document_name]}
            </p>
            <div className="tw-p-4 tw-rounded-lg md:tw-p-2 !tw-bg-[#EAECEF]">
                <div className="file-upload-element">
                    <div className="md:tw-p-2">
                        <div className="tw-flex tw-items-center tw-justify-between">
                            {!fileUplodDocuments.document_url && (
                                <div className="tw-bg-white tw-rounded-lg md:!tw-flex-row !tw-flex-col !tw-flex tw-gap-2 tw-items-center tw-justify-between tw-p-2 tw-w-full">
                                    <input
                                        ref={inputRef}
                                        className="tw-block md:tw-w-max tw-w-full tw-m-1 file:tw-mr-8 text-pri-header fs14 file:tw-cursor-pointer file:tw-font-semibold file:tw-border-0
                        file:tw-p-3 tw-border-none file:tw-rounded-lg file:tw-border-[#EEEEEE] 
                        tw-text-black focus:tw-outline-none file:tw-bg-[#EEEEEE]
                        hover:file:tw-cursor-pointer hover:file:tw-bg-sky-50
                      hover:file:tw-text-sky-700"
                                        name={fileUplodDocuments.document_name}
                                        accept={getDocumentValidationRules(fileUplodDocuments.document_name).supportedFormat.split(',').map((format: any) => `.${format.toLowerCase()}`).join(',')}
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    {fileEvents.progressBarCount > 0 && (
                                        <div className="progressbar">
                                            <ProgressBar
                                                completed={fileEvents.progressBarCount}
                                                bgColor={fileEvents.progressBarColor}
                                                baseBgColor="#DFE1E7"
                                                height="5px"
                                                margin="0px"
                                                transitionDuration="0.3s"
                                                labelAlignment="outside"
                                                labelSize="14px"
                                                labelColor="#828282"
                                                width="70%"
                                            />
                                        </div>
                                    )}
                                    {fileErrorMsg && <div className="tw-text-red-500 tw-my-1">{fileErrorMsg}</div>}
                                    {fileEvents.showUploadButton && (
                                        <button
                                            onClick={() => handleUpload()}
                                            className="upload-button md:!tw-w-fit !tw-w-3/4"
                                        >
                                            Upload
                                        </button>
                                    )}
                                    {errorMessage && <div className="tw-text-red-500 tw-my-1">{errorMessage}</div>}
                                </div>
                            )}

                            {fileUplodDocuments.document_url && (
                                <div className="tw-w-full tw-flex tw-flex-col">
                                    <div className="tw-mb-4 tw-flex tw-flex-col tw-w-fit">
                                        <div className="tw-w-72 md:tw-w-80 tw-h-40 tw-absolute tw-flex tw-flex-col tw-gap-4 tw-justify-center tw-content-center tw-items-center">
                                            <button
                                                onClick={() => isShowModal(true)}
                                                className="tw-rounded tw-z-10 tw-bg-white tw-text-black tw-px-3 tw-py-2 tw-drop-shadow-md tw-w-25 tw-mx-auto"
                                            >
                                                Replace
                                            </button>
                                            <button
                                                onClick={() => handleRemove(fileUplodDocuments)}
                                                className="tw-rounded tw-z-10 tw-bg-white tw-text-black tw-px-3 tw-py-2 tw-drop-shadow-md tw-w-25 tw-mx-auto"
                                            >
                                                Remove
                                            </button>
                                            <button
                                                onClick={() => isShowViewModal(true)}
                                                className="tw-rounded tw-z-10 tw-bg-white tw-text-black tw-px-3 tw-py-2 tw-drop-shadow-md tw-w-25 tw-mx-auto"
                                            >
                                                View
                                            </button>
                                        </div>
                                        <div className="tw-relative">
                                            {isFileImage(fileUplodDocuments.document_url) ? (
                                                <div>
                                                    <img
                                                        className="tw-w-80 tw-h-40 tw-object-center tw-rounded-lg"
                                                        src={fileUplodDocuments.document_url}
                                                        alt="preview"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <iframe
                                                        className="tw-w-[17rem] md:tw-w-fit tw-h-40 tw-object-center tw-object-contain tw-rounded-lg"
                                                        src={fileUplodDocuments.document_url}
                                                        title="PDF Preview"
                                                    />
                                                </div>
                                            )}
                                            <div className="tw-absolute tw-inset-0 tw-bg-black tw-opacity-25 tw-rounded-lg"></div>
                                        </div>
                                    </div>
                                    <p className="!tw-text-xs">{fileUplodDocuments.document_url.split('/').pop()}</p>
                                    <p className="!tw-text-xs tw-mt-1">
                                        {fileSize === null || fileSize === undefined
                                            ? ' '
                                            : fileSize > 1024
                                                ? `File Size: ${(fileSize / 1024)?.toFixed(2)} MB`
                                                : `File Size: ${fileSize?.toFixed(0)} KB`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <p className="validation-msg">
                {/* {fileUplodDocuments?.document_name === "applicant_photo"
        ? errorApplicantPhoto : ""} */}
                {getFileUploadErrorMessages()}
            </p>
            <p className="fs13 tw-mt-2 !tw-text-xs">
                {ctrlValid[fileUplodDocuments.document_name]}
            </p>
            <p className="fs13 tw-mt-2 !tw-text-xs tw-mb-3">
                {ctrlDesc[fileUplodDocuments.document_name]}
            </p>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={fileEvents.showModal}
                onClose={() => isShowModal(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={fileEvents.showModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90vw', sm: '70vw', md: '50vw', lg: '30vw' },
                            bgcolor: '#EAECEF',
                            borderRadius: '1%',
                            boxShadow: 24,
                            padding: { xs: 2, sm: 3, md: 4 },
                        }}
                    >
                        <input
                            ref={inputRef}
                            className="tw-w-full tw-m-1 file:tw-mr-8 text-pri-header fs14 file:tw-cursor-pointer file:tw-font-semibold file:tw-border-0
                        file:tw-p-3 tw-border-none file:tw-rounded-lg file:tw-border-[#EEEEEE] 
                        tw-text-black focus:tw-outline-none file:tw-bg-color[#EEEEEE]
                        hover:file:tw-cursor-pointer hover:file:tw-bg-sky-50
                        hover:file:tw-text-sky-700"
                            name={fileUplodDocuments.document_name}
                            type="file"
                            onChange={handleFileChange}
                            accept={getDocumentValidationRules(fileUplodDocuments.document_name).supportedFormat.split(',').map((format: any) => `.${format.toLowerCase()}`).join(',')}
                        />

                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        {fileEvents.progressBarCount > 0 && (
                            <div className="progressbar">
                                <ProgressBar
                                    completed={fileEvents.progressBarCount}
                                    bgColor={fileEvents.progressBarColor}
                                    baseBgColor="#DFE1E7"
                                    height="5px"
                                    margin="2px auto"
                                    transitionDuration="0.3s"
                                    labelAlignment="outside"
                                    labelSize="14px"
                                    labelColor="#828282"
                                    width="70%"
                                />
                            </div>
                        )}

                        <div className="button-group tw-flex tw-justify-between tw-mt-4">
                            {fileErrorMsg && <div className="tw-text-red-500 tw-my-1">{fileErrorMsg}</div>}
                            {fileEvents.showUploadButton && (
                                <button
                                    onClick={() => handleUpload()}
                                    className="upload-button tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded"
                                >
                                    Upload
                                </button>
                            )}
                            <button
                                onClick={() => isShowModal(false)}
                                className="cancel-button tw-bg-gray-500 tw-text-white tw-px-4 tw-py-2 tw-rounded"
                            >
                                Close
                            </button>
                        </div>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="view-modal-title"
                aria-describedby="view-modal-description"
                open={fileEvents.showViewModal}
                onClose={() => isShowViewModal(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={fileEvents.showViewModal}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90vw', sm: '70vw', md: '50vw', lg: '30vw' },
                            bgcolor: '#EAECEF',
                            borderRadius: '1%',
                            boxShadow: 24,
                            padding: { xs: 2, sm: 3, md: 4 },
                        }}
                    >
                        <IconButton
                            aria-label="close"
                            onClick={() => isShowViewModal(false)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 0,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <div className="tw-relative">
                            {isFileImage(fileUplodDocuments.document_url) ? (
                                <div className="tw-w-full tw-h-80 tw-flex tw-justify-center">
                                    <img
                                        className="tw-w-full tw-h-auto tw-object-contain tw-object-center tw-rounded-lg"
                                        src={fileUplodDocuments.document_url}
                                        alt="Doc Preview"
                                    />
                                </div>
                            ) : (
                                <div className="tw-w-full tw-flex tw-justify-center tw-p-4">
                                    <iframe
                                        className="tw-w-full tw-h-96 tw-object-center tw-object-contain tw-rounded-lg"
                                        src={fileUplodDocuments.document_url}
                                        title="PDF Preview"
                                    />
                                </div>
                            )}
                        </div>
                        <Button onClick={() => isShowViewModal(false)}>Close</Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default FileUploadDocs;
