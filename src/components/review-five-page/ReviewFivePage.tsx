import React, { useEffect, useState } from 'react'
import './ReviewFivePage.scss'
import { checkForFalsyValues, convertToTBD, formatNumberToIndianSystem, formatNumberToIndianSystemArea } from '@Src/utils/globalUtilities';
const ReviewFivePage = (props: { costCalculationData: any, applicationData: any, reviewApplicationData: any, jointData: any, customerUnitDetails: any }) => {


    const jointUsersNumber = Object.keys(props?.jointData ?? {}).length
    const formatWithRupee = (value: any) => {
        if (value != 0 && value != null && value != undefined && value != '') {
            return `Rs.${value}/- Per Sq.ft.`;
        }
        else {
            return 'TBD';
        }
    };
    const formatWithRupeeForAmount = (value: any) => {
        if (value != 0 && value != null && value != undefined && value != '') {
            return `Rs.${value}/-`;
        }
        else {
            return 'TBD';
        }
    };
    const getParkingCounts = (carParkingSlots: any) => {
        if (carParkingSlots === '' || carParkingSlots === null || carParkingSlots === undefined) {
            return
        }
        const regex = /\b[a-zA-Z]+\d+\b/g;
        const matches = carParkingSlots.match(regex);
        return matches ? matches.length : 0;
    }

    const spaceAfterComma = (carParkingSlots: any) => {
        if (carParkingSlots === '' || carParkingSlots === null || carParkingSlots === undefined) {
            return
        }
        const outputString = carParkingSlots?.replace(/,/g, ", ");
        return outputString;
    }
    return (
        <div className='review' >
            <div className='page5-cont' >
                <div className='flat-details' >
                    <h3>FLAT DETAILS :</h3>
                    <div>
                        <p>
                            Flat No. <span className='API-TEXT' >&nbsp;{checkForFalsyValues(parseInt(props?.customerUnitDetails?.floor_no)?.toString())}{checkForFalsyValues(props?.customerUnitDetails?.unit_no)} </span>,
                            Floor <span className='API-TEXT' >&nbsp;{checkForFalsyValues(parseInt(props?.customerUnitDetails?.floor_no))} </span>,
                            Tower <span className='API-TEXT' > &nbsp;{checkForFalsyValues(parseInt(props?.customerUnitDetails?.tower_code))} </span>,
                            <>
                                {props?.customerUnitDetails?.saleable_area != 0 && (
                                    <span>
                                        with a Saleable Area of <span className='API-TEXT'>&nbsp;{formatNumberToIndianSystemArea(props?.customerUnitDetails?.saleable_area)} </span> Sq.ft.,
                                        <br />
                                    </span>
                                )}
                                {(props?.customerUnitDetails?.carpet_area != 0 || props?.customerUnitDetails?.balcony_area != 0 || props?.customerUnitDetails?.common_area != 0) && (
                                    <span>
                                        {props?.customerUnitDetails?.carpet_area != 0 && (
                                            <span>
                                                (Carpet Area <span className='API-TEXT'>&nbsp;{formatNumberToIndianSystemArea(props?.customerUnitDetails?.carpet_area)} </span> Sq.ft.
                                            </span>
                                        )}
                                        {props?.customerUnitDetails?.balcony_area != 0 && (
                                            <span>
                                                , Exclusive Balcony Area <span className='API-TEXT'>&nbsp;{formatNumberToIndianSystemArea(props?.customerUnitDetails?.balcony_area)} </span> Sq.ft.
                                            </span>
                                        )}
                                        {props?.customerUnitDetails?.common_area != 0 && (
                                            <span>
                                                , Common Area (Including External <br /> walls) <span className='API-TEXT'>&nbsp;{formatNumberToIndianSystemArea(props?.customerUnitDetails?.common_area)} </span> Sq.ft.
                                            </span>
                                        )}
                                        )
                                    </span>
                                )}
                            </>
                        </p>
                        <p>No. of Parkings <span className='API-TEXT' >{convertToTBD(getParkingCounts(props?.customerUnitDetails?.car_parking_slots))
                        }</span>,
                            Basement Level  <span className='API-TEXT' >{convertToTBD(props?.customerUnitDetails?.basement_level)}</span>,
                            Parking Numbers <span className='API-TEXT' >{convertToTBD(spaceAfterComma(props?.customerUnitDetails?.car_parking_slots))}</span>.</p>
                    </div>
                </div>
                <div className='consi-details' >
                    <h3>DETAILS OF CONSIDERATION</h3>
                    <div className='tw-w-full tw-overflow-x-scroll'>
                        <table>
                            <tr>
                                <th>S.No. </th>
                                <th>Particulars</th>
                                <th>Details</th>
                                <th>Amount (in Rs.)</th>
                            </tr>

                            <tr>
                                <td>1</td>
                                <td>Basic Rate (On Saleable Area , as per Selected Floor )</td>
                                <td className='rupee-alignment'>Rs. <span className='API-TEXT' >{formatNumberToIndianSystem(parseFloat(props?.customerUnitDetails?.price_per_sq_ft) + parseFloat(props?.customerUnitDetails?.floor_rise_rate))}</span> Per Sq.ft.</td>
                                <td className='rupee-alignment'>Rs. {formatNumberToIndianSystem(parseFloat(props?.customerUnitDetails?.basic_rate))}</td>

                            </tr>

                            {/* <tr>
                                <td>2</td>
                                <td>Floor Rise Rate</td>
                                <td className='rupee-alignment'>Rs. <span className='API-TEXT' >{props?.customerUnitDetails?.floor_rise_rate || 0}</span> Per Sq.ft.</td>
                                <td className='rupee-alignment'>Rs. {formatNumberToIndianSystem(props?.costCalculationData?.floor_rate || 0)}</td>

                            </tr> */}

                            <tr>
                                <td>2</td>
                                <td colSpan={2} ><b>Amenities, infrastructure and other charges:</b> <br />
                                    TSSPDCL. HMWS & SB Connection Charges, <br />
                                    Club Facilities , Piped Gas Connection , DG Sets, STP tes.,
                                </td>
                                <td className='rupee-alignment'>Rs. {formatNumberToIndianSystem(props?.customerUnitDetails?.amenity_amount) || 0}</td>
                            </tr>

                            <tr>
                                <td>3</td>
                                <td colSpan={2}>Car Parking</td>
                                {/* <td className='tw-w-[20rem]'>Basement - I (each Rs.4,00,000/-)x <span className='API-TEXT' > API TEXT </span></td> */}
                                <td className='rupee-alignment'>{convertToTBD(formatNumberToIndianSystem(props?.customerUnitDetails?.car_parking_amount))}</td>
                            </tr>

                            {/* <tr>
                                <td >Basement - II (each Rs.4,00,000/-)x<span className='API-TEXT' > API TEXT </span></td>
                                <td>Rs.</td>
                            </tr>
                            <tr>
                                <td >Basement - III (each Rs.4,00,000/-)x<span className='API-TEXT' > API TEXT </span></td>
                                <td>Rs.</td>
                            </tr>

                            <tr>
                                <td >Basement - IV (each Rs.4,00,000/-)x<span className='API-TEXT' > API TEXT </span></td>
                                <td>Rs.</td>
                            </tr> */}
                            <tr>
                                <td></td>
                                <td colSpan={2} ><b>TOTAL SALE CONSIDERATION</b></td>
                                <td className='rupee-alignment'><b>{`Rs. ${formatNumberToIndianSystem(props?.costCalculationData?.total_sale_consideration_without_gst)}` || 0}</b></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className='below_amounts' >
                    <h3>Below amounts are payable at the time of registration</h3>
                    <div className='scroll'>
                        <table>
                            <tr>
                                <td colSpan={2}>Corpus Fund (On Saleable Area)</td>
                                <td className='rupee-alignment'><span className='API-TEXT' >{formatWithRupee(formatNumberToIndianSystem(props?.customerUnitDetails?.corpus_per_sft_rate))}</span></td>
                                <td className='rupee-alignment'>{formatWithRupeeForAmount(formatNumberToIndianSystem(props?.costCalculationData?.corpus_fund_amt))}</td>
                            </tr>
                            <tr>
                                <td colSpan={2}>Maintenance Charges</td>
                                <td className='rupee-alignment'><span className='API-TEXT' >{formatWithRupee(props?.customerUnitDetails?.maintenance_per_sft_rate)}</span></td>
                                <td className='rupee-alignment'> {formatWithRupeeForAmount(formatNumberToIndianSystem(props?.costCalculationData?.maintaince_amount))}</td>
                            </tr>
                            <tr>
                                <td colSpan={3}>Legal & Documetation Charges</td>
                                <td className='rupee-alignment'> {formatWithRupeeForAmount(formatNumberToIndianSystem(props?.customerUnitDetails?.legal_charges_amt))}</td>
                            </tr>
                            <tr>
                                <td colSpan={3}><b>TOTAL </b></td>
                                <td className='rupee-alignment'> {formatWithRupeeForAmount(formatNumberToIndianSystem(props?.costCalculationData?.document_without_gst))}</td>
                            </tr>

                        </table>
                    </div>
                </div>
                <div className='reg-stmp-chrg'>
                    <h3>Registration & Stamp Duty Charges</h3>
                    <p><i><b>No seperate Stamp duty and Registration charges shall be payable by the Purchaser(s) on saledeed registration.</b></i></p>

                    <h3> <u> Applicable Rates & Taxes </u></h3>
                    <p><b><u>GST:</u></b></p>
                    <p><b>1.</b>{(parseFloat(props?.customerUnitDetails?.cgst_rate) + parseFloat(props?.customerUnitDetails?.sgst_rate)) * 100}% on Sale Consideration</p>
                    <p><b>2.</b>{convertToTBD((parseFloat(props?.customerUnitDetails?.maintenance_gst_rate_state) + parseFloat(props?.customerUnitDetails?.maintenance_gst_rate_central)) * 100)}% on Maintenance Charges and Legal & Documentation Charges</p>
                    <p><i><b>Note:</b> The above GST/Taxes are subject to change as per the rules / laws from time to time.</i></p>

                    <h3><u>Car Parking Allocation:</u></h3>
                    <p>Car Parking allocation in Basement I/ Basement II / Basement III/ Basement IV is subject to availability on the date of allotment and Car Parking charges will be applicable as mentioned above</p>
                </div>
                {/* <div className='tnc-signs' >
                    <p>Signature of Applicant(s)</p>
                    <p>Sales Representative</p>
                    <p>Authorized Signatory</p>
                </div> */}
            </div>
            <p className="page-num">{2 + jointUsersNumber + 2}</p>
        </div>
    )
}

export default ReviewFivePage 