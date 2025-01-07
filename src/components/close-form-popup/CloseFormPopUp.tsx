import React from 'react';
import "./CloseFormPopUp.scss";
import ReactDOM from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
const CloseFormPopUp = (props: { setIsCloseFormPopUp: any, isCloseFormPopUp: boolean }) => {
    const navigate = useNavigate()
    return ReactDOM.createPortal(
        <div onClick={() => props.setIsCloseFormPopUp(false)} className={`${props.isCloseFormPopUp ? 'close-form-component-modal ' : ''}`}>
            <div onClick={(e) => { e.stopPropagation() }} className='modal-content' >
                <div className='tw-flex tw-justify-between tw-text-lg tw-w-full tw-font-bold text-pri-all'>
                    <div className='text-pri-all fs14 tw-font-medium tw-mb-4'>Are you sure you want to exit</div>
                    <div onClick={() => props.setIsCloseFormPopUp(false)}><CloseIcon /></div>
                </div>
                <div>Your progress up until now has been saved</div>

                <div className='tw-flex tw-justify-end tw-my-4 tw-gap-6 tw-pr-8'>
                    <button
                        onClick={() => { navigate('/my-home') }}
                        className='tw-flex tw-items-center tw-justify-center md:tw-ml-8 tw-py-2 tw-px-6 tw-font-bold fs14 text-pri-all tw-cursor-pointer brd'
                    >Exit</button>
                    <button
                        onClick={() => props.setIsCloseFormPopUp(false)}
                        className='tw-flex tw-items-center tw-justify-center tw-p-2 btn btn--black fs14 tw-cursor-pointer '
                    >Keep Working</button>
                </div>
            </div>
        </div>
        , document.querySelector('body')!);
};

export default CloseFormPopUp;