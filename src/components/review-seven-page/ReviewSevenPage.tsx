import React from 'react'
import './ReviewSevenPage.scss'
const ReviewSevenPage = (props: { data?: any, jointData: any, customerUnitDetails?: any }) => {
    let jointUsersNumber = Object.keys(props?.jointData ?? {}).length

    console.log(props?.data)
    return (
        <div className='' >
            <div className='page-7-cont' >
                <h1>TERMS & CONDITIONS</h1>
                <div className='tnc-paragh' >
                    <div className='line-para'>
                        <div className='p-left' >1.</div>
                        <div className='p-right' >
                            In the event of any person signing this Application Form on behalf of purchaser(s)/firm/Company, such person shall submit proper documentation i.e.
                            Authorization/Power of Attorney/ Board Resolution as may be applicable. Once the sign is affixed to the document the terms and conditions shall be
                            irrevocable and binding.
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >2.</div>
                        <div className='p-right' >
                            If for any reason the Developer is not in a position to allot the flat opted for, the developer will consider allotment of
                            an alternative flat/property or refund the amount deposited without any interest. However, the Developer shall not be liable for any compensation
                            on this account.
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >3.</div>
                        <div className='p-right' >
                            The intending allottee shall solely be responsible for compliance with all applicable laws, notifications, guidelines, FEMA/RBI regulations etc.
                            for purchase of immovable property in India.
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >4.</div>
                        <div className='p-right' >
                            <div>
                                <div>Parking Allocation as Follows:</div>
                                <div>
                                    <ul typeof="disc">
                                        <li>1 Parking for 2BHK & 2.5BHK , 2 Parking for 3BHK </li>
                                        <li>Basement I reserved for Ground to 4 and 35 to 39th Floors </li>
                                        <li>Basement II reserved for 25 to 34&quot; Floors</li>
                                        <li>Basement III reserved for 15 to 24&quot;h Floors </li>
                                        <li>Basement IV reserved for 5&quot; to 14th Floors</li>
                                        <li> Car Parking allocation in Basement I/ Basement II/ Basement III/ Basement IV is subject to
                                            availability on the date of allotment and Car Parking charges will be charged as applicable.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >5.</div>
                        <div className='p-right' >
                            If 10% of the total sale consideration is not paid within 30 days from the date of the booking, the Developer shall have the
                            right to cancel the booking and also levy cancellation charges @5% on the total sale consideration at the discretion of the developer.
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >6.</div>
                        <div className='p-right' >
                            If the Purchaser(s) cancels the Booking of the apartment, such cancellation shall attract 5% cancellation charges on total
                            consideration of the apartment (including Amenities). The refund amount (if any) shall be made by the Developer only on completion of Project
                            or when the Developer finds an alternative buyer for that particular flat whichever is earlier. Other than the refund
                            (including the cancellation charges as mentioned above) the Purchaser(s) shall not be entitled for any other compensation.
                            For refund the Cheque accepted by the Purchaser(s) or RTGS made by the Developer is final for concluding the cancellation
                            procedure in all respects as given in the application.
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >7.</div>
                        <div className='p-right' >
                            The Purchaser(s) undertakes to pay all the installments on time as per the Payment Schedule Annexed herewith and agrees to pay
                            interest @ 13% P.A for the delayed payments / installments beyond 15 days from the due date of each installment.
                            The Developer reserves the right to cancel the booking in case of delay of such payments/installments exceeds 3 months
                            and allot/alienate this booking to any third party without any further notice to the Purchaser(s). The Advance paid by the Purchaser(s)
                            shall be refunded subject to the deductions, charges and taxes applicable as per the terms and conditions mentioned herein.
                            The same shall be refunded by Developer on completion of Project or when the Developer finds an alternative buyer for that
                            particular flat whichever is earlier.
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >8.</div>
                        <div className='p-right' >
                            If the Agreement of Sale is not entered into between the Purchaser(s) and the Developer within 30 days from the date of this booking,
                            the Developer reserves the right to cancel the booking and alienate this booking to a third party without any further notice to the Purchaser(s).
                            The Advance paid shall be refunded only after finding alternative buyer for the particular flat.
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >9.</div>
                        <div className='p-right' >
                            The Purchaser(s) is/are not allowed/permitted to re-sale, transfer or shift the booking/s till execution of sale deed in Purchaser(s) favour.
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >10.</div>
                        <div className='p-right' >
                            The payments shall be paid/transferred from Purchaser(s) account only by way of Account payee Cheque/Demand Draft/RTGS
                            favoring &quot; <span>{props?.customerUnitDetails?.company_name} - {props?.customerUnitDetails?.project_name} </span> &quot;. In case of cheque dishonor/return,
                            an amount of Rs.500/- per each return will be charged as cheque dishonor/ return charges.
                            Interest will accrue from the due date and company reserves right to initiate legal recovery measures.
                        </div>
                    </div>
                    <div className='line-para'>
                        <div className='p-left' >11.</div>
                        <div className='p-right' >
                            The Purchaser(s) shall contribute
                            Rs.60/-Per Sq.ft. on Saleable Area towards the Corpus Fund meant for the
                            purpose of long term maintenance of the complex. This amount shall be paid to the Developer before the Registration of Sale deed.
                            The Corpus Fund amount will be transferred to Association after completion of the two year/s maintenance period, along with transfer
                            of maintenance of the complex to the Association. No interest accrues on the corpus fund.
                        </div>
                    </div>
                </div>
                {/* <div className='tnc-signs' >
                    <p>Signature of Applicant(s)</p>
                    <p>Sales Representative</p>
                    <p>Authorized Signatory</p>
                </div> */}
                <p className='page-num' >{2 + jointUsersNumber + 4}</p>
            </div>

        </div>
    )
}

export default ReviewSevenPage