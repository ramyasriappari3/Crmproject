import React, { useState } from 'react';
import "./BasementSelectedPopup.scss";
import ReactDOM from 'react-dom';
import ClearIcon from '@mui/icons-material/Clear';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import userSessionInfo from '../../util/userSessionInfo';

const BasementSelectedPopup = (props: { isImgPopUp: any, setIsImgPopUp: any, location_url: string, parkingLocation?: any, parkingLocationName?: any }) => {
    const [zoomLevel, setZoomLevel] = useState(100); // Initial zoom level
    const [rotationAngle, setRotationAngle] = useState(0); // Initial rotation angle
    const userInfo = userSessionInfo.logUserInfo();

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 200)); // Increase zoom level by 10%
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(prevZoom - 10, 10)); // Decrease zoom level by 10%
    };

    const handleRotateLeft = () => {
        setRotationAngle((prevAngle) => prevAngle - 90); // Rotate left by 45 degrees
    };

    const handleRotateRight = () => {
        setRotationAngle((prevAngle) => prevAngle + 90); // Rotate right by 45 degrees
    };

    return ReactDOM.createPortal(
        <div onClick={() => props.setIsImgPopUp(false)} className={`${props.isImgPopUp ? 'carparking-img-popup-modal' : 'tw-hidden'}`}>
            <div onClick={(e) => { e.stopPropagation() }} className='modal-content tw-p-4'>
                <div className='header tw-flex tw-justify-between tw-p-3'>
                    <div className='tw-font-bold tw-text-lg tw-text-white'>
                        {userInfo.user_type_id === 'admin' ? (
                            <>
                                {props.parkingLocation.tower_name}, {props.parkingLocation.project_name}, {props.parkingLocation?.parking_location_name}
                            </>
                        ) : (
                            <>
                                {`${props.parkingLocation.floor_no || ''}${props.parkingLocation.unit_no || ''}, `}
                                {props.parkingLocation.tower_name}, {props.parkingLocation.project_name}, {props.parkingLocationName}
                            </>
                        )}
                    </div>
                    <div className='tw-flex tw-gap-2 tw-items-center'>
                        <div className='tw-text-white tw-cursor-pointer' onClick={handleZoomIn}>
                            <ZoomInIcon />
                        </div>
                        <div className='tw-text-white tw-cursor-pointer' onClick={handleZoomOut}>
                            <ZoomOutIcon />
                        </div>
                        <div className='tw-text-white tw-cursor-pointer' onClick={handleRotateLeft}>
                            <RotateLeftIcon />
                        </div>
                        <div className='tw-text-white tw-cursor-pointer' onClick={handleRotateRight}>
                            <RotateRightIcon />
                        </div>
                        <div onClick={() => props.setIsImgPopUp(false)} className='tw-text-white tw-cursor-pointer'>
                            <ClearIcon />
                        </div>
                    </div>
                </div>
                <div className='tw-mt-20 tw-mx-auto'>
                    <img
                        className='tw-w-full tw-cursor-pointer'
                        src={props?.location_url}
                        alt=''
                        style={{
                            transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)`, // Apply both zoom and rotation
                            width: '100%',
                            backgroundColor: '#fff',
                            zIndex: '1',
                        }}
                    />
                </div>
            </div>
        </div>,
        document.querySelector('body')!
    );
};

export default BasementSelectedPopup;