import React, { useContext, useEffect, useState } from 'react';
import "./UploadComponents.scss"
import { FormControl, MenuItem, Select } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReactDOM from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@Src/app/hooks';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { toast } from 'react-toastify';
import { generateRandomNumber, getDataFromLocalStorage } from '@Src/utils/globalUtilities';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { MyContext } from '@Src/Context/RefreshPage/Refresh';
interface optionType {
    "id": number,
    "name": string,
    "description": string,
    "is_approval_required": number,
    "type": string,
    "is_personal_document": number
}

const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const UploadComponents = (props: { tdsDataForUpload?: any, setShowSheet: any, showSheet: boolean, dropDownOptions?: any, getMyDocuments?: any, getTdsInfo?: any, documentTypeValue?: any, mainApplicant?: any }) => {
    const defaultOption = props.dropDownOptions?.length > 0 ? props.dropDownOptions[0].value : '';
    const [selectedOption, setSelectedOption] = useState<any>(defaultOption);
    const dispatch = useAppDispatch();
    const [selectedFile, setSelectedFile] = useState<any>();
    const [errorMessage, setErrorMessage] = useState<any>();
    const [showUploadButton, setShowUploadButton] = useState<any>();
    const userDetails: any = JSON.parse(getDataFromLocalStorage('user_details') || "{}")
    const handleChange = (event: any) => {
        setSelectedOption(event.target.value as string);
    };
    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        const uploadedFileSizeInKB = (file?.size ?? 0) / 1024;
        if (selectedOption === 'applicant_photo' && (!SUPPORTED_FILE_TYPES.includes(file.type) || file.type === 'application/pdf')) {
            setErrorMessage('Please select a JPEG, JPG or PNG file.');
            setShowUploadButton(false);
            return;
        }
        if (!file || !SUPPORTED_FILE_TYPES.includes(file.type)) {
            setErrorMessage('Please select a JPEG, PNG or PDF file.');
            setShowUploadButton(false);
            return;
        }
        if (!file || (uploadedFileSizeInKB < 20 || uploadedFileSizeInKB > 2048)) {
            setErrorMessage(`Document size should be more than 20KB and less than 2MB.`);
            setShowUploadButton(false);
        }
        else {
            setSelectedFile(file);
            setShowUploadButton(true);
            setErrorMessage(null);
        }
    };


    const handleFileUpload = async (file: any) => {
        try {
            dispatch(showSpinner());
            let documentName = selectedOption;
            if (props?.tdsDataForUpload) {
                documentName = 'tds_proof';
                setSelectedOption(documentName);
            }
            const customHeaders: any = {
                'Content-Type': 'multipart/form-data'
            };
            let reqObj: any = {
                file: file,
                cust_profile_id: userDetails?.cust_profile_id,
                document_name: documentName,
            }
            const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.UPLOAD_DOCUMENTS, true, true, customHeaders).POST(reqObj);
            if (response?.success) {
                return response?.data?.data;
            }
        }
        catch {
            ////console.log("error in file")
        }
        finally {
            dispatch(hideSpinner());
        }
    }
    const onSubmit = async () => {
        try {
            dispatch(showSpinner());
            const uploadedFile = await handleFileUpload(selectedFile);
            let reqObj: any;
            if (props?.tdsDataForUpload) {
                let documentName = selectedOption;
                documentName = 'tds_proof';
                setSelectedOption(documentName);
                reqObj = {
                    cust_unit_id: props?.tdsDataForUpload?.cust_unit_id,
                    document_name: documentName,
                    document_type: props?.tdsDataForUpload?.document_type,
                    document_number: generateRandomNumber(6),
                    document_url: uploadedFile,
                    last_modified_by: userDetails?.user_login_name
                }
                const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.UPLOAD_TDS_PROOFS).POST(reqObj);
                if (response?.success) {
                    toast.success(response?.message);
                    props?.setShowSheet(false)
                    props?.getTdsInfo?.();
                }
            }
            else {
                reqObj = {
                    document_name: selectedOption,
                    document_url: uploadedFile,
                    document_type: props?.documentTypeValue,
                    document_number: generateRandomNumber(6),
                    last_modified_by: userDetails?.user_login_name
                }
                const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.UPLOAD_CUSTOMER_DOCUMENT).POST(reqObj);
                if (response?.success) {
                    toast.success(response?.message);
                    props?.setShowSheet(false)
                    props?.getMyDocuments?.();
                }
            }

        } catch (err) {
            toast.error("Failed to update documents. Please try again.");
            console.error(err);
        }
        finally {
            dispatch(hideSpinner());
        }
    }

    return ReactDOM.createPortal(
        <div onClick={() => props.setShowSheet(false)} className={`${props.showSheet ? 'upload-component-modal' : 'tw-hidden'}`}>
            <div onClick={(e) => { e.stopPropagation() }} className='modal-content' >
                <div className='tw-flex tw-justify-between content-upper ' >
                    <p className='text-pri-all tw-text-2xl tw-font-bold' >Upload Files</p>
                    <div className='tw-cursor-pointer' onClick={() => { props?.setShowSheet(false) }}><CloseIcon /></div>
                </div>
                {props?.tdsDataForUpload ?
                    <p className='fs14'>You can Upload Your TDS proof here</p>
                    :
                    <>
                        <p className='fs14'>You have the option to upload your ID related documents by choosing the file type</p>
                    </>
                }

                <div className='select-category-cont' >
                    {
                        props?.tdsDataForUpload ? ' ' :
                            <>
                                <p className='fs14 tw-mb-2 tw-mt-4' >Select Category</p>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedOption || ''}
                                        placeholder="Select one"
                                        onChange={handleChange}
                                        IconComponent={KeyboardArrowDownIcon}
                                    >
                                        <MenuItem disabled value="">
                                            Select one
                                        </MenuItem>
                                        {props?.dropDownOptions.map((options: any) => {
                                            return (
                                                <MenuItem value={options.value}>
                                                    {options.name}
                                                </MenuItem>)
                                        })}
                                    </Select>
                                </FormControl>
                            </>
                    }


                    <div className='tw-mt-4 tw-w-full'>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className='tw-p-2 tw-w-full tw-rounded-lg'
                        />
                        {errorMessage && <div className='tw-text-red-500 tw-my-1'>{errorMessage}</div>}
                    </div>
                    <p className='tw-my-4 fs13 tw-font-medium tw-text-[#989FAE]'>Supported files : JPEG, PNG, PDF</p>
                    <div className='tw-flex tw-justify-end tw-gap-4 tw-items-center tw-mt-4'>
                        <button onClick={() => { props?.setShowSheet(false) }} className='bg-white-btn-util'>Close</button>
                        {showUploadButton && <button onClick={onSubmit} className='bg-black-btn-util tw-cursor-pointer'>Upload</button>}
                    </div>
                </div>
            </div>
        </div>
        , document.querySelector('body')!);
};

export default UploadComponents;