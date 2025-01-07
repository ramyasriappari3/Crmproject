import React from 'react'
import './ReviewEightPage.scss'
import { checkForFalsyValues, formatNumberToIndianSystem } from '@Src/utils/globalUtilities';
const ReviewEightPage = (props: { data: any, jointData: any }) => {

    let jointUsersNumber = Object.keys(props?.jointData ?? {}).length

    return (
        <div className='' >
            <div className='page-8-cont' >
                <div className='tnc-paragh' >
                    <div>
                        <p className='p-left' >12.</p>
                        <p className='p-right' >The Purchaser(s) shall contribute/pay Rs. 72/- per Sq.ft. on Saleable Area towards
                            regular maintenance charges for First 2 years for Phase-I(Towers : 1 to 6)
                            and Rs.36/- per Sq.ft. for first 1 year for Phase-II (Towers : 7 to 12).
                            The common date of commencement of maintenance of the complex will be decided by the Developer.
                            The Project shall be managed either by the Developer or by its nominated Maintenance Agency during the initial period.
                            Date of Commencement of Maintenance charges shall be on or after receipt of Occupation Certificate for the project.
                        </p>
                    </div>
                    <div>
                        <p className='p-left' >13.</p>
                        <p className='p-right' >All statutory charges, GST and any other levies including any incidence of enhancement therein demanded or imposed by the Concerned Authorities shall be payable by the Purchaser(s) as per the demand made by the Company/ Developer.</p>
                    </div>
                    <div>
                        <p className='p-left' >14.</p>
                        <p className='p-right' >  Purchaser(s) having NRI/PIO status or being foreign nationals shall be solely responsible to comply with the necessary formalities as laid down in Foreign Exchange Management Act 1999 and/or any other statutory provisions governing this transaction which may inter-alia involve remittance of payments / considerations and acquisition of immovable assets in India. For NRI&#039;s- Payments are to be made from their Own NRI A/C, NRE or NRO A/c only. If payment is made from NRE or NRO A/C, PAN Card details should be submitted (Xerox copy).</p>
                    </div>
                    <div>
                        <p className='p-left' >15.</p>
                        <p className='p-right' >
                            The Purchaser(s) shall get his/her/their complete postal address registered with the Developer at the time of booking and it shall be his/her/their responsibility to inform the Developer by registered A.D letter/registered email id about all subsequent changes in his/her/their address, failing which all demand notices and letters posted at the first registered address will be deemed to have been received by Purchaser(s) at the time when those should originally reach at such address and Purchaser(s) shall be responsible for any default in making payment and other consequences that might occur there from.
                        </p>
                    </div>
                    <div>
                        <p className='p-left' >16.</p>
                        <p className='p-right' >In case of Joint Purchaser(s), all communications shall be sent by the Developer to the Purchaser(s) whose name appears first in this Application Form at the address given by him/her for mailing and which shall for all purposes be considered as served on to all the applicants and no separate communication shall be necessary to the other named applicants/purchasers.</p>
                    </div>
                    <div>
                        <p className='p-left' >17.</p>
                        <p className='p-right' >The Purchaser(s) understands, acknowledges and agrees that visiting a particular apartment during construction is unsafe and also agrees not to ask for permission to visit the apartment until it is completed in all aspects. The purchaser(s) agrees to visit the apartment at a predetermined time and should follow all safety procedures and protocols therein.</p>
                    </div>
                    <div>
                        <p className='p-left' >18.</p>
                        <p className='p-right' >Architectural features like Elevation, Colour/Colour Combinations or any other feature affecting the aesthetics of the building, shown in the Marketing Brochures/Collaterals are indicative only; Developer reserves the right to change the same.
                        </p>
                    </div>
                    <div>
                        <p className='p-left' >19.</p>
                        <p className='p-right' >
                            The Purchaser(s) understands, acknowledges and agrees that there shall be no requests for any (minor or major) modifications/customizations in the flat/apartment (either internal or external). The flat/apartment shall be constructed by the Developer as per standard specifications mentioned in the Agreement of Sale.</p>
                    </div>
                    <div>
                        <p className='p-left' >20.</p>
                        <p className='p-right' >All interior works shall be allowed only after the particular apartment is handed over/ taken over by the Purchaser(s). All Interior work should be completed within 3 months from the date of taking over the physical possession of the Apartment. Interior works shall only be done between 8.00A.M. to 7.00P.M only. No person/interior worker shall be permitted to reside in the flat.
                        </p>
                    </div>
                    <div>
                        <p className='p-left' >21.</p>
                        <p className='p-right' >
                            The Purchaser(s)/ Apartment Owners shall have to pay user charges for various facilities availed such as Club
                            facilities, swimming pool, Gym., etc as may be decided by the Developer at the time of commencement of such
                            facilities during the period it is maintained by the Developer and later as decided by the association.
                        </p>
                    </div>
                    <div>
                        <p className='p-left' >22.</p>
                        <p className='p-right' >The Purchaser(s) are hereby informed that, the Developer may/can avail the required Corporate General Purpose Loans / construction finance by duly mortgaging the project site, including the development in progress, and / or hypothecating the receivable out of sales made from the Banks / Financial Institutions and others and the Developer obtains/provides the required No Objection Certificate while executing the Sale Deed in favour of the Purchaser(s) or as may be required by the bankers of the Purchaser(s).</p>
                    </div>
                    <div>
                        <p className='p-left' >23.</p>
                        <p className='p-right' >The terms and conditions mentioned in this Application form will be superseded by the Agreement of Sale/Sale Deed, as and when they are executed, if the same are contrary to the terms and conditions mentioned in this Application..</p>
                    </div>
                    <div>
                        <p className='p-left' >24.</p>
                        <p className='p-right' >The Courts at Ranga Reddy District shall have the exclusive jurisdiction in case of any dispute.
                        </p>
                    </div>
                </div>
                <p className='final-tnc' >I/We, the above Purchaser(s) do herein declare that the above particulars given by me/us are true and correct to the best of my/our knowledge &amp; information. Any allotment against this application is subject to the terms and conditions enclosed to this application and as per the Sale Agreement. I/We undertake to inform the Company of any change in my/our address or in any other particulars/information given above.</p>
                {/* <div className='tnc-signs' >
                    <p>Signature of Applicant(s)</p>
                    <p>Sales Representative</p>
                    <p>Authorized Signatory</p>
                </div> */}
                <p className='page-num' >{2 + jointUsersNumber + 5}  </p>
            </div>

        </div>
    )
}

export default ReviewEightPage