import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ClearIcon from '@mui/icons-material/Clear';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import Carousel from 'better-react-carousel'

import "./MobileCarousel.scss"
const MobileCarousel = (props: {
    images: any[];
    showCarousel: boolean;
    setShowCarousel: any;
}) => {

    const [zoomLevel, setZoomLevel] = useState(100); // Initial zoom level

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 200)); // Increase zoom level by 10%
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(prevZoom - 10, 10)); // Decrease zoom level by 10%
    };
    return ReactDOM.createPortal(
        <div onClick={() => props.setShowCarousel(false)} className={`${props.showCarousel ? 'mobile-carousel-popup' : ''}`}>
            <div onClick={(e) => { e.stopPropagation() }} className='modal-content tw-p-4'>
                <div className='header tw-p-3'>
                    <div className='tw-flex tw-justify-between tw-gap-4'>
                        <div onClick={() => props.setShowCarousel(false)} className='tw-text-white tw-cursor-pointer'><ClearIcon /></div>
                        <div className='tw-flex tw-gap-4'>
                            <div className='tw-text-white tw-cursor-pointer'><RotateRightIcon /></div>
                            <div className='tw-text-white tw-cursor-pointer'><RotateLeftIcon /></div>
                        </div>
                    </div>
                </div>
                <div className='tw-mt-20 tw-mx-auto'>
                    <Carousel
                        cols={1} rows={1}
                        hideArrow={false} loop={false}
                        showDots={true}
                        dotColorActive="#1480B7"
                    // autoplay={5000}
                    >
                        {
                            props?.images.map((data , index)=>(
                                    <Carousel.Item key={index+1}>
                                    <img
                                        className='tw-w-full tw-cursor-pointer'
                                        src={data?.url}
                                        alt=''
                                        style={{ transform: `scale(${zoomLevel / 100})`, width: '100%', backgroundColor: '#fff', zIndex: '1' }}
                                    />
                                </Carousel.Item>
                            ))
                        }
                        {/* <Carousel.Item key={1}>
                            <img
                                className='tw-w-full tw-cursor-pointer'
                                src='https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/Artboard.png'
                                alt=''
                                style={{ transform: `scale(${zoomLevel / 100})`, width: '100%', backgroundColor: '#fff', zIndex: '1' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item key={2}>
                            <img
                                className='tw-w-full tw-cursor-pointer'
                                src='https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/Artboard.png'
                                alt=''
                                style={{ transform: `scale(${zoomLevel / 100})`, width: '100%', backgroundColor: '#fff', zIndex: '1' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item key={3}>
                            <img
                                className='tw-w-full tw-cursor-pointer'
                                src='https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/Artboard.png'
                                alt=''
                                style={{ transform: `scale(${zoomLevel / 100})`, width: '100%', backgroundColor: '#fff', zIndex: '1' }}
                            />
                        </Carousel.Item> */}
                    </Carousel>
                </div>
            </div>
        </div>
        , document.querySelector('body')!);
};

export default MobileCarousel;