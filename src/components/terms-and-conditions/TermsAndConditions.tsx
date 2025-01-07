import React, { useState } from 'react';
import './TermsAndConditions.scss';
import ReactDOM from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import ApplicationSubmitted from '@Components/application-submitted/ApplicationSubmitted';
import { Slide, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

const TermsAndConditions = (props: {
    isTermsModal?: boolean,
    isModelActionEvent: (data: any) => void,
    isActionEventType: (data: any) => void
}) => {
    const [showApplicationSubmittedPopup, setShowApplicationSubmittedPopup] = useState(false);

    const onSubmitReview = () => {
        props.isActionEventType("send-verification");
        props.isModelActionEvent(false);
        setShowApplicationSubmittedPopup(true);
        const element: HTMLElement | null = document.getElementById('send-verification-submit-btn') as HTMLElement;
        element.style.display = 'none';
    };

    const handleClose = () => {
        props.isModelActionEvent(false);
    };

    return (
        <>
            <Dialog
                open={props.isTermsModal || false}
                TransitionComponent={Slide}
                TransitionProps={{ timeout: { enter: 800, exit: 800 } }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth
                maxWidth="md"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '16px',
                        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
                        padding: '10px',
                    }
                }}
            >
                <DialogTitle>
                    <div className='tw-flex tw-justify-between tw-items-center'>
                        <div className='tw-font-bold tw-text-2xl text-pri-all'>Declaration by Purchaser(s)</div>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='tw-text-justify tw-leading-relaxed'>
                        I/We, the above Purchaser(s), do herein declare that the above particulars given by me/us are true
                        and correct to the best of my/our knowledge & information. Any allotment against this application
                        is subject to the terms and conditions enclosed to this application and as per the Sale Agreement.
                        I/We undertake to inform the Company of any change in my/our address or in any other particulars/information given above.
                    </div>
                    <div className='tw-flex tw-flex-wrap tw-justify-end tw-gap-4 tw-mt-4'>
                        <button onClick={handleClose} className='bg-white-btn-util tw-w-full sm:tw-w-auto'>Decline</button>
                        <button onClick={onSubmitReview} className='bg-black-btn-util tw-w-full sm:tw-w-auto'>Accept</button>
                    </div>
                </DialogContent>
            </Dialog>
            {showApplicationSubmittedPopup && <ApplicationSubmitted />}
        </>
    );
};

export default TermsAndConditions;
