import React from 'react';
import ReactDOM from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import "./ConfirmCarBookingPopup.scss";
const ConfirmCarBookingPopup = (props: { setIsConfirmBooking: any, isConfirmBooking: boolean, onSubmit: any, selectedSlots: any }) => {
    let selectedParking = props?.selectedSlots.map((d: any) => {
        let parkingNumber = d.parking_no;
        if (parkingNumber < 10) {
            return "00" + parkingNumber;
        } else if (parkingNumber < 100) {
            return "0" + parkingNumber;
        } else {
            return parkingNumber;
        }
    })
    let basement = props?.selectedSlots[0]?.basement
    let number = basement.match(/\d+/)[0];
    let result = "B" + number + "-";
    let parkingSlots = selectedParking.map((item:any) => result + item).join(', ');

    return ReactDOM.createPortal(
        <div onClick={() => props.setIsConfirmBooking(false)} className={`${props.isConfirmBooking ? 'confirm-component-modal' : ''}`}>
            <div onClick={(e) => { e.stopPropagation() }} className='modal-content' >
                <div className='tw-flex tw-justify-between tw-text-lg tw-font-bold text-pri-all'>
                    <div>Confirm the slot selection</div>
                    <div onClick={() => props.setIsConfirmBooking(false)}><CloseIcon /></div>
                </div>
                <div className='tw-my-6'>
                    Are you sure you want confirm the slot selection of <strong>{parkingSlots}</strong> for 1307, Tower 3, My Home Sayuk, <strong>{basement}</strong>
                </div>
                <div className='tw-flex tw-justify-end tw-my-4 tw-gap-6 tw-pr-8'>
                    <button
                        onClick={() => props.setIsConfirmBooking(false)}
                        className='tw-flex tw-items-center tw-justify-center tw-p-2 tw-font-bold fs14 text-pri-all tw-cursor-pointer brd'
                    >Close</button>
                    <button
                        onClick={() => props.onSubmit()}
                        className='btn btn--black tw-cursor-pointer'
                    >Confirm & continue</button>
                </div>
            </div>
        </div>
        , document.querySelector('body')!);
};

export default ConfirmCarBookingPopup;