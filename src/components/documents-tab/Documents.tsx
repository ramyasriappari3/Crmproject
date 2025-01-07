import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import './Documents.scss';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Document from '@Components/document-holder/Document';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { useAppDispatch } from '@Src/app/hooks';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { useParams } from 'react-router-dom';
import { getDataFromLocalStorage } from '@Src/utils/globalUtilities';
import { FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import UploadComponents from '@Components/upload-component/UploadComponents';
import NoResultFound from '@Components/no-result-found/NoResultFound';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {getConfigData} from '@Src/config/config';
import { MyContext } from '@Src/Context/RefreshPage/Refresh';

const Documents = ({ mainApplicant }: { mainApplicant: any }) => {
    const dispatch = useAppDispatch();
    const { propertyId } = useParams();
    const userDetails: any = JSON.parse(getDataFromLocalStorage('user_details') || "{}");
    const { cust_unit_id } = useContext(MyContext);

    const [showSheet, setShowSheet] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [currentTab, setCurrentTab] = useState(2);
    const [selectedOption, setSelectedOption] = useState('Filter By');
    const [documentTypeValue, setDocumentTypeValue] = useState<any>();
    const [showFileInfo, setShowFileInfo] = useState({ isOpen: false, file_url: "", file_type: "" });

    const [uploadDocuments, setUploadDocuments] = useState<DocumentType[]>([]);
    const [fromSellerDocuments, setFromSellerDocuments] = useState<DocumentType[]>([]);
    const [legalDocuments, setLegalDocuments] = useState<DocumentType[]>([]);
    const [paymentProofsDocuments, setPaymentProofsDocuments] = useState<DocumentType[]>([]);
    const [tdsPaymentsDocuments, setTDSPaymentsDocuments] = useState<DocumentType[]>([]);
    const [dropDownOptions, setDropDownOptions] = useState<any>([]);

    interface DocumentType {
        unit_id: string | null;
        approved_by: string | null;
        document_id: number;
        document_url: string;
        document_name: string;
        approved_status: string | null;
        created_on: Date | string | null;
        last_modified_at: Date | string;
    }

    const fetchDocuments = async () => {
        try {
            dispatch(showSpinner());
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.BOOKING_DOCUMENTS}?cust_unit_id=${cust_unit_id}`).GET();
            if (apiResponse?.success) {
                const { myUploadDocuments, paymentProofsData, paymentTdsData, sellerDocumentData, legalDocumentData } = apiResponse?.data;
                setUploadDocuments(myUploadDocuments || []);
                setPaymentProofsDocuments(paymentProofsData || []);
                setTDSPaymentsDocuments(paymentTdsData || []);
                setFromSellerDocuments(sellerDocumentData || []);
                setLegalDocuments(legalDocumentData || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(hideSpinner());
        }
    };

    useEffect(() => {
        fetchDocuments();
        setDropDownOptions(getConfigData('documentNames'));
    }, [cust_unit_id]);

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value.toLowerCase());
    };

    const filterDocuments = (documents: DocumentType[]) => {
        return documents?.filter((doc) => doc.document_url.split("/").pop()?.toLowerCase().includes(searchText));
    };

    const renderDocuments = (documents: DocumentType[] = []) => {
        return Array?.isArray(documents) ? documents?.map((doc) => (
            <Document
                key={doc.document_id}
                file_date={doc.last_modified_at}
                fileUrl={doc.document_url}
                viewDocumentsInPopUp={setShowFileInfo}
            />
        )) : null;
    };
    const renderFilteredDocuments = (title: string, documents: DocumentType[]) => (
        <>
            <div className='tw-flex tw-flex-col tw-w-full'>
                {/* <div className="tw-flex tw-justify-between tw-items-center">
                    <p className='uploads-name tw-my-4'>{title}</p>
                </div> */}
                {searchText ? (
                    filterDocuments(documents).length > 0 ? (
                        <div>
                            {renderDocuments(filterDocuments(documents))}
                        </div>

                    ) : (
                        <NoResultFound description='We cannot find the item you are searching for' />
                    )
                ) : (
                    <div>
                        {renderDocuments(documents)}
                    </div>
                )}
            </div>
        </>
    );

    const renderConditionalDocuments = () => {
        switch (selectedOption) {
            case 'My KYC Documents':
                return (
                    <>
                        <div className='tw-flex tw-flex-col tw-gap-4'>
                            MY KYC Documents
                            {renderFilteredDocuments('My KYC Documents', uploadDocuments)}
                        </div>
                    </>
                );
            case 'Payment Proofs':
                return (
                    <>
                        <div className='tw-flex tw-flex-col tw-gap-4'>
                            Payment Proofs
                            {renderFilteredDocuments('Payment Proofs', paymentProofsDocuments)}
                        </div>
                    </>
                );
            case 'TDS Proofs':
                return (
                    <>
                        <div className='tw-flex tw-flex-col tw-gap-4'>
                            TDS Proofs
                            {renderFilteredDocuments('TDS Proofs', tdsPaymentsDocuments)}
                        </div>
                    </>
                );
            case 'All Documents':
                return (
                    <>
                        <div className='tw-flex tw-flex-col tw-gap-4'>
                            <div>
                                MY KYC Documents
                                {renderFilteredDocuments('My KYC Documents', uploadDocuments)}
                            </div>
                            <div>
                                Payment Proofs
                                {renderFilteredDocuments('Payment Proofs', paymentProofsDocuments)}
                            </div>
                            <div>
                                TDS Proofs
                                {renderFilteredDocuments('TDS Proofs', tdsPaymentsDocuments)}
                            </div>
                        </div>
                    </>
                );
            default:
                return (
                    <>
                        <div className='tw-flex tw-flex-col tw-gap-4'>
                            <div>
                                MY KYC Documents
                                {renderFilteredDocuments('My KYC Documents', uploadDocuments)}
                            </div>
                            <div>
                                Payment Proofs
                                {renderFilteredDocuments('Payment Proofs', paymentProofsDocuments)}
                            </div>
                            <div>
                                TDS Proofs
                                {renderFilteredDocuments('TDS Proofs', tdsPaymentsDocuments)}
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className='documents-cont'>
            <div className="tw-grid tw-grid-cols-2 tw-mt-4 tw-text-[#656C7B] tw-mb-6 tw-text-sm">
                {/* <button
                    className={`tw-flex md:tw-flex-row tw-flex-col tw-items-center tw-gap-2 tw-justify-center tw-p-4 tw-rounded-lg 
                        tw-transition-all tw-duration-200 tw-ease-in-out
                        ${currentTab === 0 ?
                            "tw-text-white tw-font-semibold tw-bg-[#25272D]" :
                            "tw-text-gray-700"}`}
                    onClick={() => {
                        setCurrentTab(0);
                        setDocumentTypeValue('Legal Documents');
                    }}
                >
                    <LegalIconComponent fill={currentTab === 0 ? '#fff' : '#111'} className='tw-size-4' />
 
                    <p>Legal Documents</p>
                </button>
 */}
                <div
                    className={`${currentTab === 2 ? 'tw-border-b-2 tw-border-b-[#25272D] tw-text-[#25272D] tw-font-bold' : 'tw-border-b-[#DFE1E7] '} tw-cursor-pointer tw-border-b-2 tw-flex md:tw-flex-row tw-flex-col tw-items-center tw-gap-2 tw-justify-center tw-p-2 tw-transition-all tw-duration-200 tw-ease-in-out`}
                    onClick={() => {
                        setCurrentTab(2);
                        setDocumentTypeValue('My Uploads');
                    }}
                >
                    <p>My Uploads</p>
                </div>

                <div
                    className={`${currentTab === 1 ? 'tw-border-b-2 tw-border-b-[#25272D] tw-text-[#25272D] tw-font-bold' : 'tw-border-b-[#DFE1E7]'}  tw-cursor-pointer tw-border-b-2 tw-flex md:tw-flex-row tw-flex-col tw-items-center tw-gap-2 tw-justify-center tw-p-2 tw-transition-all tw-duration-200 tw-ease-in-out`}
                    onClick={() => {
                        setCurrentTab(1);
                        setDocumentTypeValue('Seller Documents');
                    }}
                >
                    <p>Seller Documents</p>
                </div>
            </div>

            {currentTab === 0 && (
                <div className='tw-flex tw-flex-col tw-gap-4'>
                    <div className="tw-flex md:tw-flex-row tw-flex-col tw-gap-4 tw-items-center tw-justify-between">

                        <p className='uploads-name !tw-text-xl !tw-font-bold'>Legal Documents</p>

                        {/* <TextField
                            className="tw-w-[25vw]"
                            value={searchText}
                            placeholder='Search Legal Documents'
                            onChange={handleSearchTextChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        /> */}
                        <TextFieldComp
                            value={searchText}
                            placeholder='Search Legal Documents'
                            onChange={handleSearchTextChange}
                        />
                    </div>
                    <div className='tw-w-full'>
                        {renderFilteredDocuments('Legal Documents', legalDocuments)}
                    </div>
                </div>
            )}
            {currentTab === 1 && (
                <div className='tw-flex tw-flex-col tw-gap-4'>
                    <div className="tw-flex md:tw-flex-row tw-flex-col tw-gap-4 tw-items-center tw-justify-between">
                        <div>
                            <p className='uploads-name !tw-text-xl !tw-font-bold'>Seller Documents</p>
                        </div>
                        {/* <TextField
                            className="tw-w-[25vw] tw-mb-4"
                            value={searchText}
                            placeholder='Search Seller Documents'
                            onChange={handleSearchTextChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        /> */}
                        <TextFieldComp
                            value={searchText}
                            placeholder='Search Seller Documents'
                            onChange={handleSearchTextChange}
                        />
                    </div>
                    <div className='tw-flex tw-flex-col tw-gap-4'>
                        <div>
                            Seller Documents
                            {renderFilteredDocuments('Seller Documents', fromSellerDocuments)}
                        </div>
                        <div>
                            Legal Documents
                            {renderFilteredDocuments('Legal Documents', legalDocuments)}
                        </div>
                    </div>
                </div>
            )}

            {currentTab === 2 && (
                <div>
                    <div className='tw-flex md:tw-flex-row tw-flex-col tw-justify-between md:tw-items-center tw-gap-4 tw-mb-4'>
                        <div>
                            <p className='uploads-name !tw-text-xl !tw-font-bold'>My Uploads</p>
                        </div>
                        {/* <TextField
                            className="tw-w-[15vw]"
                            placeholder='Search My Uploads'
                            value={searchText}
                            onChange={handleSearchTextChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        /> */}

                        <div className='tw-flex tw-gap-4 tw-items-center'>
                            <TextFieldComp
                                placeholder='Search My Uploads'
                                value={searchText}
                                onChange={handleSearchTextChange}
                            />
                            <FormControl className='tw-w-40'>
                                <Select
                                    className='!tw-text-xs !tw-font-semibold'
                                    labelId="dropdown-label"
                                    value={selectedOption}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                    sx={{
                                        border: 'none',  // Custom border style
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',  // Remove border
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',  // Remove border on hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',  // Remove border when focused
                                        },
                                    }}
                                >
                                    <MenuItem className='!tw-text-xs' value="Filter By" disabled>Filter By</MenuItem>
                                    <MenuItem className='!tw-text-xs' value="My KYC Documents">My KYC Documents</MenuItem>
                                    <MenuItem className='!tw-text-xs' value="Payment Proofs">Payment Proofs</MenuItem>
                                    <MenuItem className='!tw-text-xs' value="TDS Proofs">TDS Proofs</MenuItem>
                                    <MenuItem className='!tw-text-xs' value="All Documents">All Documents</MenuItem>
                                </Select>
                            </FormControl>

                            <div
                                className='tw-flex tw-p-2 tw-gap-1 tw-items-center tw-text-black tw-cursor-pointer hover:tw-bg-gray-100 hover:tw-rounded-lg tw-text-xs !tw-font-bold'
                                onClick={() => setShowSheet(true)}
                            >
                                <AddIcon className='!tw-text-[20px]' />
                                <p className=''>Add New</p>
                            </div>
                        </div>
                    </div>
                    {renderConditionalDocuments()}
                </div>
            )}

            {showSheet &&
                <UploadComponents setShowSheet={setShowSheet} showSheet={showSheet} dropDownOptions={dropDownOptions} getMyDocuments={fetchDocuments} documentTypeValue={documentTypeValue} mainApplicant={mainApplicant} />
            }

            <Dialog
                open={showFileInfo.isOpen}
                keepMounted
                onClose={() => setShowFileInfo({ isOpen: false, file_url: "", file_type: "" })}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {showFileInfo.file_type === "pdf" ? (
                            <embed id="fgh" src={showFileInfo.file_url} type="application/pdf" width="400" height="400" />
                        ) : (
                            <img src={showFileInfo.file_url} width="400px" height="200px" alt="Document" />
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowFileInfo({ isOpen: false, file_url: "", file_type: "" })}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Documents;

interface InputTextProps {
    value: string;
    placeholder: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextFieldComp: React.FC<InputTextProps> = (props: InputTextProps) => {
    const { value, onChange = () => { }, placeholder } = props;
    return (
        <div
            style={{ background: "white" }}
            className="!tw-px-2 !tw-py-2 tw-border-[1.5px] tw-border-black/30 tw-rounded-lg tw-flex tw-gap-1 tw-items-center"
        >
            <SearchIcon style={{ fontSize: "18px" }} />
            <input
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className="focus:!tw-outline-none focus:!tw-border-none !tw-border-none tw-w-full tw-text-sm placeholder:tw-font-normal placeholder:tw-text-black/60 tw-h-fit"
            />
        </div>
    );
};