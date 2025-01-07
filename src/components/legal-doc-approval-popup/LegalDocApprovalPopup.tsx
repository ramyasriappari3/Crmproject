import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { toast } from 'react-toastify';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { httpService, MODULES_API_MAP } from '@Src/services/httpService';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { downloadFiles, getDataFromLocalStorage } from '@Src/utils/globalUtilities';
import './LegalDocApprovalPopup.scss';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface IFormInputs {
    subject: string;
    content: string;
}

const schema = yup.object().shape({
    subject: yup.string().required('Subject is required'),
    content: yup.string().required('Content is required'),
});

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    message: string;
    confirmationType: string;
    getMyTasks: () => void;

}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onClose, message, confirmationType, getMyTasks }) => (
    <Dialog open={open} onClose={() => { onClose(); getMyTasks(); }} maxWidth="sm" fullWidth>
        <DialogTitle>{confirmationType === 'approve' ? 'Document Approved' : 'Change Request Sent'}</DialogTitle>
        <DialogContent>
            <div className='tw-flex tw-flex-col tw-items-center'>
                <img src="/images/green-tick-mark.svg" alt="" className='tw-w-20 tw-mb-10' />
                <p>{message}</p>
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => { onClose(); getMyTasks(); }} >Close</Button>
        </DialogActions>
    </Dialog>
);

const LegalDocApprovalPopup = (props: {
    open: boolean,
    onClose: () => void,
    custUnitDetails: any,
    legalTask: any,
    getMyTasks: any
}) => {
    const dispatch = useAppDispatch();
    const [showChangeRequestDetails, setShowChangeRequestDetails] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [confirmationType, setConfirmationType] = useState('');
    const userDetails: any = JSON.parse(getDataFromLocalStorage('user_details') || "{}");

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });

    const approveDocument = async () => {
        const post_data = {
            task_id: props?.legalTask?.task_id,
            doc_task_status: "closed",
            last_modified_by: userDetails?.user_login_name,
        };
        try {
            dispatch(showSpinner());
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.APPROVE_LEGAL_DOCUMENTS}`).POST(post_data);
            if (apiResponse?.success) {
                setConfirmationMessage("You have successfully approved the document.");
                setShowConfirmation(true);
                setConfirmationType('approve');
            }
        } catch (err) {
            toast.error("Error approving document");
        } finally {
            dispatch(hideSpinner());
        }
    };

    const editDocument: SubmitHandler<IFormInputs> = async (data) => {
        const post_data = {
            task_id: props?.legalTask?.task_id,
            doc_task_status: "assigned_to_RM",
            subject: data.subject,
            task_notes_responder: data.content,
            last_modified_by: userDetails?.user_login_name,
        };
        try {
            dispatch(showSpinner());
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.APPROVE_LEGAL_DOCUMENTS}`).POST(post_data);
            if (apiResponse?.success) {
                setConfirmationMessage("You’re change request has been sent succesfully");
                setShowConfirmation(true);
                setConfirmationType('change_request');
                props?.getMyTasks();
            } else {
                toast.error(apiResponse?.message);
            }
        } catch (err) {
            toast.error("Error submitting change request");
        } finally {
            dispatch(hideSpinner());
        }
    };

    const renderContent = () => {
        switch (props?.legalTask?.doc_task_status) {
            case 'assigned_to_customer':
            case 'assigned_existing_document_to_customer':
            case 'assigned_new_document_to_customer':
            case 'task_generated':
                return (
                    <>
                        <DialogContent>
                            <p className='tw-text-[#656C7B] tw-font-bold tw-pb-4'>
                                {`T${parseInt(props?.custUnitDetails?.tower_code)}-${parseInt(props?.custUnitDetails?.floor_no)}${props?.custUnitDetails?.unit_no}, ${props?.custUnitDetails?.project_name}`}
                            </p>
                            <p>Please ensure you have downloaded and thoroughly reviewed the document. If you find that all the data included in the document is satisfactory and can be processed further, kindly approve it. However, if any changes are necessary, please submit a request for revisions.</p>
                        </DialogContent>
                        <DialogActions className='tw-flex tw-flex-col md:tw-flex-row'>
                            <Button onClick={() => downloadFiles(props?.legalTask?.document_url, 'Agreement of Sale.pdf')}>Download the Document</Button>
                            <Button onClick={() => setShowChangeRequestDetails(true)}>Request a change</Button>
                            <Button onClick={approveDocument} color="primary">Approve</Button>
                            <Button onClick={props.onClose}>Close</Button>
                        </DialogActions>
                    </>
                );
            case 'assigned_to_RM':
                return (
                    <>
                        <DialogContent>
                            <p>Your change request has been sent successfully. We'll notify you once it's processed.</p>
                        </DialogContent>
                        <DialogActions className='tw-flex tw-flex-col md:tw-flex-row'>
                            <Button onClick={() => downloadFiles(props?.legalTask?.document_url, 'Agreement of Sale.pdf')}>Download the Document</Button>
                            <Button onClick={() => setShowChangeRequestDetails(true)}>View Change Request</Button>
                            <Button onClick={props.onClose}>Close</Button>
                        </DialogActions>
                    </>
                );
            case 'closed':
                return (
                    <>
                        <DialogContent>
                            <p className='tw-text-[#656C7B] tw-font-bold tw-pb-4'>
                                {`T${parseInt(props?.custUnitDetails?.tower_code)}-${parseInt(props?.custUnitDetails?.floor_no)}${props?.custUnitDetails?.unit_no}, ${props?.custUnitDetails?.project_name}`}
                            </p>
                            <p>You have approved the Agreement of Sale. No further changes can be made to the document. For any inquiries, please contact your Relationship Manager.</p>
                        </DialogContent>
                        <DialogActions className='tw-flex tw-flex-col md:tw-flex-row'>
                            <Button onClick={() => downloadFiles(props?.legalTask?.document_url, 'Agreement of Sale.pdf')}>Download the Document</Button>
                            <Button onClick={props.onClose}>Close</Button>
                        </DialogActions>
                    </>
                );
            default:
                return (
                    <>
                        <DialogContent><p>Unknown status</p></DialogContent>
                        <DialogActions>
                            <Button onClick={props.onClose}>Close</Button>
                        </DialogActions>
                    </>
                );
        }
    };

    return (
        <>
            <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    Document Approval
                    <IconButton
                        aria-label="close"
                        onClick={props.onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                {renderContent()}
            </Dialog>

            <Dialog open={showChangeRequestDetails} onClose={() => setShowChangeRequestDetails(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <p className='tw-ml-4'>
                        {props?.legalTask?.doc_task_status === 'assigned_to_RM' ? 'Your Submitted Change Request' : 'Request a change'}
                    </p>
                    <IconButton
                        aria-label="back"
                        onClick={() => setShowChangeRequestDetails(false)}
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <IconButton
                        aria-label="close"
                        onClick={() => setShowChangeRequestDetails(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(editDocument)} className='tw-flex tw-flex-col tw-gap-3'>
                        {(props?.legalTask?.doc_task_status === 'assigned_to_customer' ||
                            props?.legalTask?.doc_task_status === 'assigned_new_document_to_customer' ||
                            props?.legalTask?.doc_task_status === 'assigned_existing_document_to_customer' ||
                            props?.legalTask?.doc_task_status === 'task_generated') && (
                                <p>Please specify the changes you would like to request for the new draft. Only changes to demographic data or booked unit details will be considered.</p>
                            )}
                        <FormControl fullWidth margin="normal">
                            <p>Subject</p>
                            <TextField
                                {...register('subject')}
                                defaultValue={props?.legalTask?.subject || ''}
                                placeholder="Content subject"
                                error={!!errors.subject}
                                helperText={errors.subject?.message}
                                inputProps={{ maxLength: 80 }}
                                disabled={props?.legalTask?.doc_task_status === 'assigned_to_RM'}
                                sx={{
                                    border: '1px solid #DFE1E7',
                                    color: props?.legalTask?.doc_task_status === 'assigned_to_RM' ? '#656C7B' : 'inherit',
                                    backgroundColor: props?.legalTask?.doc_task_status === 'assigned_to_RM' ? '#EAECEF' : 'inherit',
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <p>Content Details</p>
                            <TextField
                                {...register('content')}
                                placeholder='Write your change request here...'
                                defaultValue={props?.legalTask?.task_notes_responder || ''}
                                error={!!errors.content}
                                rows={4}
                                helperText={errors.content?.message}
                                inputProps={{ maxLength: 300 }}
                                disabled={props?.legalTask?.doc_task_status === 'assigned_to_RM'}
                                sx={{
                                    border: '1px solid #DFE1E7',
                                    color: props?.legalTask?.doc_task_status === 'assigned_to_RM' ? '#656C7B' : 'inherit',
                                    backgroundColor: props?.legalTask?.doc_task_status === 'assigned_to_RM' ? '#EAECEF' : 'inherit',
                                }}
                            />
                        </FormControl>
                        {
                            (props?.legalTask?.doc_task_status === 'task_generated' ||
                                props?.legalTask?.doc_task_status === 'assigned_to_customer' ||
                                props?.legalTask?.doc_task_status === 'assigned_new_document_to_customer' ||
                                props?.legalTask?.doc_task_status === 'assigned_existing_document_to_customer')
                            &&
                            <Button type='submit'>Send Request</Button>
                        }
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowChangeRequestDetails(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <ConfirmationDialog
                open={showConfirmation}
                onClose={() => {
                    setShowConfirmation(false);
                    props.onClose();
                }}
                confirmationType={confirmationType}
                message={confirmationMessage}
                getMyTasks={props?.getMyTasks}
            />
        </>
    );
};

export default LegalDocApprovalPopup;
