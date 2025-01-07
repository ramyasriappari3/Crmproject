import React from "react";
import './NewApplicationSubmissionCard.scss'
// import { url } from "inspector";
import { useNavigate } from "react-router-dom";
const NewApplicationSubmissionCard = () => {
	const navigate = useNavigate()
	return (
		<div className='new-submission-card  tw-w-full tw-bg-gradient-to-r tw-from-[#fee6be] tw-via-[#fee6be] tw-to-[#e5cee8] tw-px-8 tw-py-6 -tw-mt-3 tw-rounded-2xl'>
			<div>
				<h1 className='tw-text-lg tw-text-[#3C4049] tw-font-bold tw-mb-1'>
					New application submission ready: Take the next step!
				</h1>
				<p className='tw-text-[#3C4049] tw-font-medium tw-text-sm'>
					Your relationship manager has initiated the application for
					reserving Skyline Tower-01 unit. Kindly complete the forms
					and confirm the payment plans as previously discussed.
				</p>
			</div>
			<button className='tw-px-4 tw-py-2 tw-bg-[#241F20] tw-rounded-lg tw-text-white tw-font-bold tw-mt-5' onClick={()=> navigate("/my-application-form") } >
				Complete the Application
			</button>
		</div>
	);
};

export default NewApplicationSubmissionCard;
