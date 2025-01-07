import React, { useEffect, useState } from 'react'
import './TdsPage.scss'
import Document from '@Components/document-holder/Document'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { useAppDispatch } from '@Src/app/hooks';
import { IAPIResponse, ITdsInfo } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { getDataFromLocalStorage, formatNumberToIndianSystem } from '@Src/utils/globalUtilities';
import UploadComponents from '@Components/upload-component/UploadComponents';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { getConfigData } from '@Src/config/config';


interface optionType {
    "id": number,
    "name": string,
    "description": string,
    "is_approval_required": number,
    "type": string,
    "is_personal_document": number
}

const TdsPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showSheet, setShowSheet] = useState(false);
    const userDetails: any = JSON.parse(getDataFromLocalStorage('user_details') || "{}")
    const [tdsDocuments, setTdsDocuments] = useState<any>();
    const [dropDownOptions, setDropDownOptions] = useState<any>();
    const [sellerData, setSellerData] = useState<any>();
    const [tdsInfoData, setTdsInfoData] = useState<any>();
    const location = useLocation();

    const getUrlParamsValue = () => {
        const { pathname } = location;
        const pathParts = pathname.split('/');
        const unitIdIndex = pathParts.indexOf('unitId');
        const custUnitIdIndex = pathParts.indexOf('custUnitId');
        const unitId = unitIdIndex !== -1 ? pathParts[unitIdIndex + 1] : null;
        const custUnitId = custUnitIdIndex !== -1 ? pathParts[custUnitIdIndex + 1] : null;
        return { unitId, custUnitId };
    }

    const { unitId, custUnitId } = getUrlParamsValue();


    const getTdsInfo = async () => {
        dispatch(showSpinner());
        try {
            const URL = `${GLOBAL_API_ROUTES.TDS_DETAILS}?cust_unit_id=${custUnitId}&unit_id=${unitId}`.trim();
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, URL).GET();
            if (apiResponse?.success) {
                setTdsDocuments(apiResponse?.data?.paymentTdsData || []);
                setSellerData(apiResponse?.data?.sellerData || {});
                setTdsInfoData(apiResponse?.data || {});
                setDropDownOptions(getConfigData('documentNames'))
                // dispatch(hideSpinner);
            }

        } catch (error) {
            //console.log(error)
        }
        finally {
            dispatch(hideSpinner());
        }
    }


    useEffect(() => {
        getTdsInfo();
    }, [])

    const [showPreview, setShowPreview] = useState(false);
    const handleImagePreview = (event: React.MouseEvent<HTMLButtonElement>) => {
        setShowPreview(true)
    }

    const [showFileInfo, setShowFileInfo] = React.useState({ isOpen: false, file_url: "", file_type: "" });
    const showDocumentsInPopUp = (fileInfo: any) => {
        setShowFileInfo(fileInfo)
    }

    const tdsDataForUpload = {
        cust_unit_id: custUnitId,
        document_type: 'Proofs',
    }

    return (
        <div>
            {/* <button className="tds-back-button" onClick={() => { return navigate(`/my-property-details/unitId/${propertyId}`) }} > <ArrowBackIcon /> Back</button> */}
            <div className='tw-flex md:tw-flex-row tw-flex-col tw-gap-4'>
                <div className='md:tw-w-[70%] tw-w-full tw-bg-white tw-p-6 tw-border tw-border-zinc-400/50 tw-rounded-xl tw-flex-col tw-flex tw-gap-5'>
                    <p className='tw-text-2xl tw-font-bold tw-text-black'>TDS Details</p>
                    <p className='tw-text-sm tw-font-semibold'>TDS Summary information</p>
                    <div className="tw-p-5 tw-rounded-xl tw-border tw-flex tw-flex-col tw-gap-4 tw-justify-between tw-text-sm tw-text-black tw-overflow-auto">
                        <div className='tw-flex tw-flex-col tw-justify-between tw-gap-4'>
                            <div className='tw-flex tw-justify-between tw-gap-2'>
                                <div className='tw-min-w-[180px] tw-text-start'>
                                    <p className='tw-text-black tw-font-bold tw-mb-4'>Total Invoice Amount</p>
                                    <p className=''><span className='tw-font-bold'>₹</span>  {formatNumberToIndianSystem(tdsInfoData?.total_billed_amount) || 0}</p>
                                </div>
                                <div className='tw-min-w-[120px]'>
                                    <p className='tw-text-black tw-font-bold tw-mb-4'>TDS @ 1%</p>
                                    <p className='tds-amount'><span className='tw-font-bold'>₹</span> {formatNumberToIndianSystem(tdsInfoData?.oneperGST) || 0}</p>
                                </div>
                                <div className='tw-min-w-[120px]'>
                                    <p className='tw-text-black tw-font-bold tw-mb-4'>TDS Paid</p>
                                    <p className='tw-text-black'><span className='tw-font-bold'>₹</span> {formatNumberToIndianSystem(tdsInfoData?.TDSDone) || 0}</p>
                                </div>
                                <div className='tw-min-w-[120px]'>
                                    <p className='tw-text-black tw-font-bold tw-mb-4'>Balance TDS</p>
                                    <p className=''><span className='tw-font-bold'>₹</span> {formatNumberToIndianSystem(tdsInfoData?.balanceTDS) || 0} </p>
                                </div>
                            </div>
                            <hr />
                            <div className='tw-flex tw-w-full'>
                                <p className='tw-flex-1 tw-text-[#25272D] tw-leading-5 fs13'>
                                    <strong>Note:</strong><em>The payment and TDS information provided here is for reference purposes only.
                                        TDS (Tax Deducted at Source) rates are subject to government regulations. Customers
                                        are advised to deduct and remit TDS as per applicable laws. The developer does not take
                                        responsibility for any errors or non-compliance in TDS deductions.</em>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='' >
                        <div className='tw-flex tw-justify-between tw-mb-4 tw-text-sm tw-text-black' >
                            <div>
                                <p className='tw-text-base tw-font-bold'>TDS Challans and 26QB Forms</p>
                                <p className='tw-text-black/50' >All uploaded TDS challans and 26QB forms are listed here</p>
                            </div>
                            <button className='tw-border tw-border-black tw-p-2 tw-font-bold tw-rounded-lg' onClick={() => setShowSheet(true)}>Upload 26QB Forms and TDS Challans</button>
                        </div>
                        {
                            tdsDocuments?.map((data: any) => {
                                return (
                                    <Document
                                        key={data.document_identifier}
                                        file_date={data.created_on}
                                        fileUrl={data.document_url}
                                        viewDocumentsInPopUp={showDocumentsInPopUp}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
                <div className='tw-flex tw-gap-2 tw-flex-col tw-bg-white md:tw-w-[30%] tw-w-full tw-p-6 tw-border tw-border-zinc-400/50 tw-rounded-xl tw-text-black' >
                    <div>
                        <h3 className='tw-font-bold tw-text-[1.4rem] ' >Seller's TDS info </h3>
                        <p className='tw-text-[#656C7B]' >Please use the details below while ITR filing. </p>

                    </div>

                    <hr />
                    <div className=''>
                        <p className='tw-text-[#656C7B]' >PAN of the seller</p>
                        <h3 className='tw-font-bold' >{sellerData?.developer_pan || 'N/A'}</h3>
                        {/* <div className='tw-pt-2 tw-flex tw-items-center tw-cursor-pointer' onClick={() => setShowPreview(true)}>
                            <p className='tw-text-[#1F69FF] tw-mr-2'>View PAN card</p>
                            <img src="/images/arrow-left.svg" alt="" />
                        </div> */}
                    </div>
                    {/* <div>
                        <p className='tw-text-[#656C7B]'>Aadhaar number</p>
                        <p className='tw-font-bold' >{sellerData?.aadhar_no || 'N/A'}</p>
                    </div> */}
                    <div>
                        <p className='tw-text-[#656C7B]'>GST number</p>
                        <p className='tw-font-bold' >{sellerData?.developer_gst_number || 'N/A'}</p>
                    </div>
                    <div>
                        <p className='tw-text-[#656C7B]'>Name of the seller</p>
                        <p className='tw-font-bold' >{sellerData?.company_name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className='tw-text-[#656C7B]'>Category of PAN</p>
                        <p className='tw-font-bold' >Company</p>
                    </div>
                    <div>
                        <p className='tw-text-[#656C7B]'>Address</p>
                        <p className='tw-font-bold' >{sellerData?.company_address || 'N/A'}, {sellerData?.company_city || 'N/A'}</p>
                    </div>
                    <div>
                        <p className='tw-text-[#656C7B]'>Mobile Number</p>
                        <div className='tw-flex'>
                            <a href={`tel:${sellerData?.mobile_number || "N/A"}`} className='tw-flex md:tw-hidden' >
                                <span className='tw-text-base tw-font-bold' >{sellerData?.mobile_number || "N/A"}</span>
                            </a>
                            <div className='tw-hidden md:tw-flex' >
                                <span className='tw-text-base tw-font-bold' >{sellerData?.mobile_number || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className='tw-text-[#656C7B]'>Email ID</p>
                        <span>
                            <a href={`mailto:${sellerData?.email_id || "N/A"}`} className='tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-text-base tw-font-bold' >
                                {sellerData?.email_id || "N/A"}
                            </a>
                        </span>
                    </div>
                    <div>
                        <p className='tw-text-[#656C7B]'>More than one seller?</p>
                        <p className='tw-font-bold' >No</p>
                    </div>

                </div>
            </div >
            {showSheet &&
                <UploadComponents tdsDataForUpload={tdsDataForUpload} getTdsInfo={getTdsInfo} setShowSheet={setShowSheet} showSheet={showSheet} dropDownOptions={dropDownOptions} />
            }
            <div className={showPreview ? "tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-z-50 tw-flex tw-justify-center tw-items-center" : "tw-hidden"} >
                <div className='tw-p-4 tw-md:p-6 tw-lg:p-8 tw-max-w-4xl tw-w-full tw-mx-4 tw-md:mx-0 tw-overflow-auto tw-max-h-full' >
                    <div className='tw-flex tw-justify-end tw-w-full tw-rounded-full tw-p-6 tw-size-28 tw-cursor-pointer' >
                        <img className="tw-block tw-w-max" src="/images/cross-icon.svg" alt="close icon" onClick={() => setShowPreview(false)} />
                    </div>
                    <div className='tw-flex tw-justify-center tw-max-w-full tw-h-auto' >
                        <figure>
                            <img className="" src="https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/myhome/application-documents/63/pan-Card.jpg" alt="preview" />
                            <figcaption>Static Image</figcaption>
                        </figure>
                    </div>
                </div>
            </div>

            <Dialog
                open={showFileInfo.isOpen}
                keepMounted
                onClose={() => showDocumentsInPopUp({ isOpen: false, file_url: "", file_type: "" })}
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {
                            showFileInfo.file_type == "pdf" ?
                                <embed id="fgh" src={showFileInfo.file_url} type="application/pdf" width="400" height="400" />
                                :
                                <img src={showFileInfo.file_url} width="400px" height="200px" />
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => showDocumentsInPopUp({ isOpen: false, file_url: "", file_type: "" })}>Close</Button>
                </DialogActions>
            </Dialog>

        </div >
    )
}

export default TdsPage