import React, { useState, useRef, useEffect } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import "./FileUploadElement.scss"
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import { log } from 'console';
const FileUploadElement = (props: {
    fileUrl: any,
    handleFileUpload: any,
    doctype_id: any,
    filedata: any,
    application_profile_id: any,
    application_id: any,
    getApplicantDocuments: (e: any) => {}
}) => {
    const [showInput, setShowInput] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [docUrl, setDocUrl] = useState(props.fileUrl);
    const [showUploadButton, setShowUploadButton] = useState(false)
    const [progress, setProgress] = useState(0);
    const [progressBarColor, setProgressBarColor] = useState("#FF0006")
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch()
    const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const [errorMessage, setErrorMessage] = useState<any>(false);
    const [showModal, setShowModal] = useState(false);
    const [previewImageURL, setPreviewImageURL] = useState('');
    const [fileSize, setFileSize] = useState<any>();


    useEffect(() => {
        if (props?.fileUrl && props?.fileUrl !== "") {
            // Assuming props.fileUrl is a valid URL of the file
            const fileName = props.fileUrl.substring(props.fileUrl.lastIndexOf('/') + 1);
            const fakeFile = new File([], fileName);
            setFile(fakeFile);
            setShowInput(false);
            setShowPreview(true);

            // //console.log("All props received:", props);
            // //console.log("File data received:", props.filedata);

        }
    }, [props?.fileUrl]);


    const handleUpload = async () => {
        setShowProgressBar(true);
        setShowUploadButton(true);
        setProgress(0);

        const updateProgress = async () => {
            setShowUploadButton(false);
            for (let progress = 1; progress <= 100; progress++) {
                setProgress(progress);
                await new Promise(resolve => setTimeout(resolve, 30));
                if (progress === 100) {
                    setProgressBarColor("#2cba00");
                }
            }
        };
        const uploadFile = await props.handleFileUpload(file, props?.doctype_id, props?.application_profile_id, props?.application_id);

        await Promise.all([updateProgress(), uploadFile]);

        setTimeout(() => {
            setTimeout(() => {
                setShowProgressBar(false);
                setShowPreview(true);
            }, 1000);
        }, 1000);

        setShowUploadButton(false);
    };


    const handleRemove = async () => {

        dispatch(showSpinner());
        let reqObj = { "document_identifier": props?.filedata?.document_identifier }
        if (props?.filedata?.document_identifier && props?.application_id) {
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.DELETE_JOINT_APPLICANT_DOCUMENTS).POST(reqObj);
            if (apiResponse?.success) {
                setShowUploadButton(false)
                setShowProgressBar(false);
                setShowPreview(false);
                setFile(null);
                setPreviewImageURL("");
                props?.getApplicantDocuments(props?.doctype_id);
            }
        } else {
            setPreviewImageURL("");
            props?.getApplicantDocuments(props?.doctype_id);
        }
        if (props?.filedata?.document_identifier) {
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.DELETE_APPLICANT_DOCUMENTS).POST(reqObj);
            if (apiResponse?.success) {
                setShowUploadButton(false)
                setShowProgressBar(false);
                setShowPreview(false);
                setFile(null);
                setPreviewImageURL("");
                props?.getApplicantDocuments(props?.doctype_id);
            }
        } else {
            setPreviewImageURL("");
            props?.getApplicantDocuments(props?.doctype_id);
        }
        setShowUploadButton(false)
        setShowProgressBar(false);
        setShowPreview(false);
        setFile(null);


        // if (inputRef.current) {
        //     inputRef.current.value = '';
        // }
        dispatch(hideSpinner())

    }

    const handleReplace = async () => {
        setShowModal(true);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(showSpinner())
        const uploadedFile = event.target.files && event.target.files[0];
        ////console.log(uploadedFile?.size);
        const uploadedFileSizeInKB = (uploadedFile?.size ?? 0) / 1024;
        setFileSize(uploadedFileSizeInKB);

        if (!uploadedFile) {
            setErrorMessage(false);
            dispatch(hideSpinner());
            return;
        }

        if (props?.doctype_id === 'applicant_photo' && (uploadedFile.type === 'application/pdf' || !SUPPORTED_FILE_TYPES.includes(uploadedFile.type))) {
            ////console.log(props?.doctype_id);
            setErrorMessage('Please select a JPEG, JPG, PNG file.');
            setShowUploadButton(false);
            setFileSize(null);
            dispatch(hideSpinner());
            return;
        }

        if (!uploadedFile || !SUPPORTED_FILE_TYPES.includes(uploadedFile.type)) {
            setErrorMessage('Please select a JPEG, JPG, PNG or PDF file.');
            setShowUploadButton(false);
            setFileSize(null);
            dispatch(hideSpinner());
            return;
        }

        if (!uploadedFile || (uploadedFileSizeInKB < 20 || uploadedFileSizeInKB > 2048)) {
            ////console.log("inside size check");
            setErrorMessage(`Document size should be more than 20KB and less than 2MB.`);
            setShowUploadButton(false);
            dispatch(hideSpinner());
            return;
        }

        setPreviewImageURL(URL.createObjectURL(uploadedFile));
        setFile(uploadedFile);
        setShowUploadButton(true);
        setErrorMessage(false);
        dispatch(hideSpinner());
    };

    const getFileType = (fileName: string) => {
        const extension = fileName?.split('.').pop()?.toLowerCase();
        return extension;
    };


    const isDocument = (fileName: any) => {
        const extension = getFileType(fileName);
        return extension === 'pdf';
    };

    return (
        <div className='file-upload-element tw-w-full'>
            <div className="md:tw-p-2 tw-w-full">
                <div className='tw-flex tw-items-center tw-justify-between'>
                    {!showPreview && <div className='section-container tw-flex tw-gap-1 tw-items-center tw-justify-between tw-p-1 tw-w-full'>
                        <input ref={inputRef} className="tw-block tw-w-max tw-m-1 file:tw-mr-8 text-pri-header fs14 file:tw-cursor-pointer file:tw-font-semibold file:tw-border-0
                        file:tw-p-3 tw-border-none file:tw-rounded-lg file:tw-border-[#EEEEEE] 
                        tw-text-black focus:tw-outline-none file:tw-bg-color[#EEEEEE]
                        hover:file:tw-cursor-pointer hover:file:tw-bg-sky-50
                      hover:file:tw-text-sky-700"
                            type="file" onChange={handleFileChange} />
                        {showProgressBar &&
                            <div className="progressbar">
                                <ProgressBar
                                    completed={progress}
                                    bgColor={progressBarColor}
                                    baseBgColor='#DFE1E7'
                                    height='5px'
                                    margin='0px'
                                    transitionDuration='0.3s'
                                    labelAlignment='outside'
                                    labelSize='14px'
                                    labelColor='#828282'
                                    width='70%'

                                />
                            </div>
                        }
                        {showUploadButton && <button onClick={() => handleUpload()} className='upload-button'>Upload</button>}
                        {errorMessage && <div className='tw-text-red-500 tw-my-1'>{errorMessage}</div>}
                    </div>}
                    {/* {showPreview && isDocument(file!.name) &&
                        <div className="doucuments-container tw-w-full">
                            <div className="tw-flex tw-gap-2">
                                <div>
                                    <div className='replace-remove-section tw-w-[270px] tw-h-12 tw-ml-40 tw-rounded-[12px] tw-absolute tw-flex tw-gap-4 tw-bg-gray-500/40 tw-justify-center tw-items-center '>
                                        <button onClick={handleRemove} className='btn btn--black tw-w-24 tw-mx-auto'>Remove</button>
                                        <button onClick={handleReplace} className='btn btn--black tw-w-24 tw-mx-auto'>Replace</button>
                                    </div>
                                </div>
                                <div className='tw-w-6'>
                                    <img
                                        src="/images/GDocsLogo.png"
                                        height={'30px'}
                                        alt="Google Docs Logo"
                                        className="google-docs-logo tw-w-full"
                                    />
                                </div>
                                <a href={props?.fileUrl} target='_blank'>
                                    <p className='fs13 tw-font-semibold text-pri-all tw-underline'>
                                        {file?.name}
                                    </p>
                                    <p className='fs12 tw-font-semibold text-pri-all'>
                                        {Math.round(file!.size / 1024)} KB
                                    </p>
                                </a>
                            </div>

                        </div>
                    } */}
                    {showPreview && (
                        <div className="documents-container tw-w-full">
                            <div className='tw-flex md:tw-justify-start tw-justify-center'>
                                <div className='replace-remove-section tw-w-72 md:tw-w-80 tw-h-40 tw-rounded-[12px] tw-absolute tw-flex tw-flex-col tw-gap-4 tw-bg-gray-500/40 tw-justify-center tw-content-center tw-items-center'>
                                    <button onClick={handleRemove} className='btn btn--black tw-w-32 tw-mx-auto'>Remove</button>
                                    <button onClick={handleReplace} className='btn btn--black tw-w-32 tw-mx-auto'>Replace</button>
                                </div>
                                {isDocument(file?.name) ? (
                                    <iframe
                                        className='tw-w-80 tw-h-40'
                                        src={previewImageURL || props?.fileUrl}
                                        title="PDF Preview"
                                    />
                                ) : (
                                    <img className='tw-w-80 tw-h-40 tw-rounded-lg tw-overflow-hidden' src={previewImageURL || props?.fileUrl} alt="preview" />
                                )}
                            </div>
                            <p className='fs13 tw-mt-4 tw-flex tw-flex-col md:tw-items-start tw-items-center'>
                                <div className='file-name'>
                                    {(file === null || file === undefined) ? ' ' : (`File Name: ${file?.name}`)}
                                </div>
                                <div className='file-size'>
                                    {(fileSize === null || fileSize === undefined) ? ' ' :
                                        (fileSize > 1024 ? `File Size: ${(fileSize / 1024)?.toFixed(2)} MB` :
                                            `File Size: ${(fileSize)?.toFixed(0)} KB`)
                                    }
                                </div>
                            </p>
                        </div>
                    )}


                </div>
            </div>


            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={showModal}
                onClose={() => setShowModal(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={showModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90vw', sm: '70vw', md: '50vw', lg: '30vw' },
                        bgcolor: '#EAECEF',
                        borderRadius: '1%',
                        boxShadow: 24,
                        padding: { xs: 2, sm: 3, md: 4 },
                    }}>
                        <input ref={inputRef} className="tw-w-full tw-m-1 file:tw-mr-8 text-pri-header fs14 file:tw-cursor-pointer file:tw-font-semibold file:tw-border-0
                file:tw-p-3 tw-border-none file:tw-rounded-lg file:tw-border-[#EEEEEE] 
                tw-text-black focus:tw-outline-none file:tw-bg-color[#EEEEEE]
                hover:file:tw-cursor-pointer hover:file:tw-bg-sky-50
                hover:file:tw-text-sky-700"
                            type="file" onChange={handleFileChange} />

                        {errorMessage && <div className='error-message'>{errorMessage}</div>}
                        {showProgressBar && (
                            <div className="progressbar">
                                <ProgressBar
                                    completed={progress}
                                    bgColor={progressBarColor}
                                    baseBgColor='#DFE1E7'
                                    height='5px'
                                    margin='2px auto'
                                    transitionDuration='0.3s'
                                    labelAlignment='outside'
                                    labelSize='14px'
                                    labelColor='#828282'
                                    width='70%'
                                />
                            </div>
                        )}
                        <div className="button-group tw-flex tw-justify-between tw-mt-4">
                            {showUploadButton && <button onClick={() => handleUpload()} className='upload-button tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded'>Upload</button>}
                            <button onClick={() => setShowModal(false)} className='cancel-button tw-bg-gray-500 tw-text-white tw-px-4 tw-py-2 tw-rounded'>Close</button>
                        </div>
                    </Box>
                </Fade>
            </Modal>


        </div >
    );
}

export default FileUploadElement;