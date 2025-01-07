import React from 'react'
import './ApplicationSubmitted.scss'
import { useNavigate } from 'react-router-dom'

const ApplicationSubmitted = () => {
  const navigate = useNavigate();
  return (
    <div className='tw-flex tw-justify-center tw-items-center tw-mt-3'>
      <div className='application-submitted-cont tw-w-[90vw] md:tw-ml-[10rem] sm:tw-w-[70vw] md:tw-w-[60vw] lg:tw-w-[50vw] tw-p-14'>
        <div className='tw-mx-auto tw-w-12 sm:tw-w-16'>
          <img src="/images/checked-icon.svg" alt="" className='tw-w-full' />
        </div>
        <p className='tw-text-center text-pri-all tw-text-xl sm:tw-text-2xl tw-font-bold tw-mt-4'>Application submitted successfully</p>
        <p className='tw-text-center tw-text-base sm:tw-text-lg tw-mt-4'>Your application has been successfully submitted. Our CRM executive will review it and provide you with an update shortly.</p>
        <button onClick={() => navigate('/my-home')} className='btnsd tw-mt-6 tw-w-full sm:tw-w-auto'>Done</button>
      </div>
    </div>
  )
}

export default ApplicationSubmitted