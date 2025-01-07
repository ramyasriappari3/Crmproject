import React from 'react'

import "./MobileTabs.scss"

const MobileTabs = (props: { index: number }) => {
    return (
        <div className='onboarding-mobile-tabs tw-flex md:tw-hidden tw-w-full'>
            <div className={`lines ${props.index >= 1 ? 'lines--active' : ''}`}></div>
            <div className={`lines ${props.index >= 2 ? 'lines--active' : ''}`}></div>
            <div className={`lines ${props.index >= 3 ? 'lines--active' : ''}`}></div>
        </div>
    )
}

export default MobileTabs