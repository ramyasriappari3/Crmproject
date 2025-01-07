import './ReviewSixPage.scss'
import { checkForFalsyValues, formatNumberToIndianSystem, formatNumberToIndianSystemArea } from '@Src/utils/globalUtilities';
const ReviewSixPage = (props: { applicantBankDetails?: any, milestoneData: any, applicationData: any, reviewApplicationData?: any, jointData: any, appData?: any }) => {

    let jointUsersNumber = Object.keys(props?.jointData ?? {}).length
    let home_loan_value = props?.applicantBankDetails?.interested_in_home_loans || props?.applicationData?.interested_in_home_loans?.toString();
    let cumulativeMilestoneAmount = 0;
    return (
        <div className='review' >
            <div className='page6-cont' >
                <h3 className='tw-mb-4'>PAYMENT SCHEDULE</h3>
                <div className='tw-w-full'>
                    <table>
                        <tr>
                            <th className='sl-no' >Sl.No</th>
                            <th className='prtl' >Particulars</th>
                            <th className='dtl' >Details</th>
                            <th className='cons' >Consideration</th>
                            <th className='gst' >GST</th>
                            <th className='t-amt' >Total Amount</th>
                        </tr>
                        {
                            (props?.milestoneData || []).map((milestone: any, index: number) => {
                                let detailsForMileStonePercentage = `${(parseFloat(milestone?.applied_milestone_percentage) * 100)?.toFixed(0)}`;
                                let totalSaleConsideration = parseFloat(props?.applicationData?.calculationFields?.total_sale_consideration_without_gst);
                                if (milestone?.milestone_sequence === 1 || milestone?.milestone_sequence === 2) {
                                    cumulativeMilestoneAmount += parseFloat(milestone?.milestone_amount);
                                }

                                if (milestone?.milestone_sequence === 1) {
                                    detailsForMileStonePercentage = `Rs. ${formatNumberToIndianSystem(milestone?.milestone_amount)}/- + GST `
                                }
                                else if (milestone?.milestone_sequence === 2) {
                                    let modifiedPercentage = Math.round((cumulativeMilestoneAmount / totalSaleConsideration) * 100);
                                    detailsForMileStonePercentage = `${modifiedPercentage}% of Sale Consideration (less booking amount) + GST`
                                }
                                else {
                                    detailsForMileStonePercentage = `${detailsForMileStonePercentage}% of Sale Consideration + GST`
                                }
                                return (
                                    <tr key={milestone?.milestone_id}>
                                        <td>{index + 1}</td>
                                        <td>{milestone?.milestone_description || 'N/A'}</td>
                                        <td>{detailsForMileStonePercentage || 0}</td>
                                        <td className='rupee-alignment'>Rs. {formatNumberToIndianSystem(milestone?.milestone_amount) || 0}</td>
                                        <td className='rupee-alignment'>Rs. {formatNumberToIndianSystem(parseFloat(milestone?.gst_amount)) || 0}</td>
                                        <td className='rupee-alignment'>Rs. {formatNumberToIndianSystem(milestone?.total_milestone_amount) || 0}</td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                            <td></td>
                            <td>
                                <p className='tw-text-center'>
                                    <b>TOTAL</b>
                                </p>
                            </td>
                            <td className='!tw-text-center'><b>{checkForFalsyValues((Math.round(Number(props?.applicationData?.sum_of_percentages)) * 100))} %</b></td>
                            <td className='rupee-alignment'><b> Rs. {formatNumberToIndianSystem(props?.applicationData?.calculationFields?.total_sale_consideration_without_gst) || 0}</b></td>
                            <td className='rupee-alignment'><b> Rs. {formatNumberToIndianSystem(props?.applicationData?.sum_of_gst_amount) || 0}</b></td>
                            <td className='rupee-alignment'><b> Rs. {formatNumberToIndianSystem(props?.applicationData?.sum_of_milestone_amount) || 0}</b></td>
                        </tr>
                    </table>
                </div>

                <div className='note' >
                    <p><b><i>NOTE: &nbsp; </i></b></p>
                    <p><b><i>Corpus Fund, Maintenance Charges and Legal  & Documentation Charges are payable at the time of Registration / Handover / Intimation of completion.</i></b>
                        <br /> <br />
                        <i>Interested to avail home loan service by My Home Group:</i>
                        <form action="#">
                            <label className="square-radio">
                                &nbsp;Yes
                                <input type="radio" name="example" checked={home_loan_value === 'true' ? true : false} disabled />
                                <span className="custom-radio"></span>
                            </label>

                            <label className="square-radio">
                                No
                                <input type="radio" name="example" checked={home_loan_value === 'false' ? true : false} disabled />
                                <span className="custom-radio"></span>
                            </label>

                        </form>
                    </p>

                </div>
                <div className='tds' >
                    <p><i>TDS: &nbsp; </i></p>
                    <p><i>TDS is applicable on Sale Consideration (excluding GST ) and shall be paid by the applicant/s (only) and submit the challan copy for our records. credit to your (Applicant/s) account will be made only after submission of challan copy and reflection of the said payment in Company's form 26 AS.</i></p>

                </div>
                {/* <div className='tnc-signs' >
                    <p>Signature of Applicant(s)</p>
                    <p>Sales Representative</p>
                    <p>Authorized Signatory</p>
                </div> */}
            </div>
            <p className="page-num">{2 + jointUsersNumber + 3}</p>
        </div>
    )
}

export default ReviewSixPage