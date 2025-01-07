import React, { useState } from 'react';
import "./BasementSelectedPopup.scss";
import ReactDOM from 'react-dom';
import ClearIcon from '@mui/icons-material/Clear';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const BasementSelectedPopup = (props: { isImgPopUp: any, setIsImgPopUp: any }) => {
    const [zoomLevel, setZoomLevel] = useState(100); // Initial zoom level

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 200)); // Increase zoom level by 10%
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(prevZoom - 10, 10)); // Decrease zoom level by 10%
    };

    return ReactDOM.createPortal(
        <div onClick={() => props.setIsImgPopUp(false)} className={`${props.isImgPopUp ? 'carparking-img-popup-modal' : 'tw-hidden'}`}>
            <div onClick={(e) => { e.stopPropagation() }} className='modal-content tw-p-4'>
                <div className='header tw-flex tw-justify-between tw-p-3'>
                    <div className='tw-font-bold tw-text-lg tw-text-white'>My Properties / My Home Sayuk, Tower 3, 1307</div>
                    <div className='tw-flex tw-gap-4'>
                        <div className='tw-text-white tw-cursor-pointer' onClick={handleZoomIn}><ZoomInIcon /></div>
                        <div className='tw-text-white tw-cursor-pointer' onClick={handleZoomOut}><ZoomOutIcon /></div>
                        <div onClick={() => props.setIsImgPopUp(false)} className='tw-text-white tw-cursor-pointer'><ClearIcon /></div>
                    </div>
                </div>
                <div className='tw-mt-20 tw-mx-auto'>
                    <img
                        className='tw-w-full tw-cursor-pointer'
                        src='https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/Artboard.png'
                        alt=''
                        style={{ transform: `scale(${zoomLevel / 100})`, width:'100%',backgroundColor:'#fff',zIndex:'1' }}
                    />
                </div>
            </div>
        </div>
        , document.querySelector('body')!);
};

export default BasementSelectedPopup;