import React from 'react'
import "./NoResultFound.scss"
const NoResultFound = (props: { description: string }) => {
    console.log(props?.description);
    return (
        <div className='tw-w-full tw-flex tw-justify-center tw-items-center tw-h-full'>
            {/* <div className='img-container tw-w-16 tw-mx-auto'>
                <img src='https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/no-results-found.jpg' className='tw-w-full' alt='no-result-image' />
            </div> */}
            <div className='tw-my-1 tw-text-center'>
                <p className='text-pr-all tw-font-bold tw-text-xl'>{props.description}</p>
                {/* <p className='fs14 tw-my-1'>{props.description}</p> */}
            </div>
        </div>
    )
}

export default NoResultFound