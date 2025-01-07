import React from 'react';
import "./CarParkingHomePage.scss";
import ReactDOM from 'react-dom';
import ClearIcon from '@mui/icons-material/Clear';
import BasementsPage from './basements-page/BasementsPage';
import BookSlots from './book-slots/BookSlots';

const CarParkingHomePage = (props: { isCarParkingHomePage: any, setIsCarParkingHomePage: any }) => {
    return ReactDOM.createPortal(
        <div onClick={() => props.setIsCarParkingHomePage(false)} className={`${props.isCarParkingHomePage ? 'carparking-modal' : 'tw-hidden'}`}>
            <div onClick={(e) => { e.stopPropagation() }} className='modal-content tw-p-4'>
                <div className='tw-bg-white navbar'>
                    <div className='nav-content'>
                        <div className='tw-flex tw-justify-between tw-items-center'>
                            <div className='tw-flex tw-items-start left-section'>
                                <img className='navbar-img' src="/logo.png?w=540" alt="" />
                            </div>
                            <div onClick={() => props.setIsCarParkingHomePage(false)} className='tw-flex tw-items-center tw-cursor-pointer text-pri-all-65 tw-font-medium tw-gap-1 right-section'>
                                <p>Close</p>
                                <ClearIcon />
                            </div>
                        </div>
                    </div>
                </div>
                <BookSlots />
            </div>
        </div>
        , document.querySelector('body')!);
};

export default CarParkingHomePage;