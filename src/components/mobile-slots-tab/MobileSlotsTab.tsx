import React from 'react';
import "./MobileSlotsTab.scss"
const MobileSlotsTab = (props: { index: number }) => {
    return (
        <div className='booking-mobile-tabs tw-flex md:tw-hidden tw-w-full'>
            <div className={`lines ${props.index >= 1 ? 'lines--active' : ''}`}></div>
            <div className={`lines ${props.index >= 2 ? 'lines--active' : ''}`}></div>
        </div>
    );
};

export default MobileSlotsTab;