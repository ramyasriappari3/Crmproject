
import moment from "moment";
import "./ReviewSecondPage.scss";
import { calculateAgeInYears, checkForFalsyValues, getTitleNameWithDots } from "@Src/utils/globalUtilities";
import {getConfigData} from "@Src/config/config";
const ReviewSecondPage = (props: { data: any }) => {
    const modifyCustomerTitle = (title: string) => {
        if (title === 'Miss')
            return 'Miss'
        else {
            return title?.concat('.');
        }
    }

    return (
        <div className='review'>
            <div className='page2-cont'>
                <h2 className="heading">
                    Applicant Details/Correspondence Address
                </h2>
                <div className="personal-details">
                    <h3>Personal Details</h3>
                    <div className="personal-details-cont" >
                        <div className="leftDtl">
                            <div>
                                <p className="label">Title</p>
                                <p className="label-text" >
                                    {checkForFalsyValues(getTitleNameWithDots(props?.data?.customer_title))}
                                </p>
                            </div>
                            <div>
                                <p className="label">{checkForFalsyValues(props?.data?.applicant_relation_id)}</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.parent_or_spouse_name)}</p>
                            </div>

                            <div>
                                <p className="label">Date of Birth</p>
                                <p className="label-text" >{checkForFalsyValues(moment(props?.data?.dob).format('DD/MM/YYYY'))}</p>
                            </div>
                            <div>
                                <p className="label">PAN Card</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.pan_card)}</p>
                            </div>
                            <div>
                                <p className="label">GSTIN</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.gstin_number)}</p>
                            </div>
                        </div>
                        <div className="rightDtl">
                            <div>
                                <p className="label">Full Name</p>
                                <p className="label-text">{checkForFalsyValues(props?.data?.full_name)}</p>
                            </div>

                            <div>
                                <p className="label">Age</p>
                                <p className="label-text" >{checkForFalsyValues(calculateAgeInYears(props?.data?.dob))}</p>
                            </div>
                            <div>
                                <p className="label">Aadhaar Number</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.aadhaar_number?.replace(/(\d{4})(?=\d)/g, '$1 '))}</p>
                            </div>
                            <div>
                                <p className="label">Passport Number</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.passport_number)}</p>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="Professional-details">
                    <h3>Professional Details</h3>
                    <div className="Professional-details-cont" >
                        <div className="leftDtl">
                            <div>
                                <p className="label">Occupation</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.occupation)}</p>
                            </div>
                            <div>
                                <p className="label">Designation</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.designation)}</p>
                            </div>

                        </div>
                        <div className="rightDtl">
                            <div>
                                <p className="label">Organisation Name</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.organisation_name)}</p>
                            </div>
                            <div>
                                <p className="label">Organisation Address</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.organisation_address)}</p>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="Address-details">
                    <h3>Address details</h3>

                    <div className="Address-up-cont">
                        <div>
                            <p className="label">Residential Status</p>
                            <p className="label-text" >{checkForFalsyValues(props?.data?.resident_type)}</p>
                        </div>
                        <div>
                            <p className="label">House/Flat No.</p>
                            <p className="label-text" >{checkForFalsyValues(props?.data?.customer_flat_house_number)}</p>
                        </div>
                        <div>
                            <p className="label">Street Address 1</p>
                            <p className="label-text" >{checkForFalsyValues(props?.data?.address_street1)}
                            </p>
                        </div>
                        <div>
                            <p className="label">Street Address 2</p>
                            <p className="label-text" >{checkForFalsyValues(props?.data?.address_street2)}
                            </p>
                        </div>
                    </div>
                    <div className="Address-down-cont" >
                        <div className="leftDtl">
                            <div>
                                <p className="label">City/Town/District</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.address_city)}</p>
                            </div>
                            <div>
                                <p className="label">Pin/Postal/Zip Code</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.pin_code)}</p>
                            </div>
                            <div>
                                <p className="label">Office Phone</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.office_phone)}</p>
                            </div>
                            <div>
                                <p className="label">Mobile Number</p>
                                <p className="label-text" >{checkForFalsyValues(props.data?.mobile_number)}</p>
                            </div>
                            <div>
                                <p className="label" >Alternate Mobile Number</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.alternate_mobile)}</p>
                            </div>
                            <div>
                                <p className="label" >Alternate Email ID</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.alternate_email_id)} </p>
                            </div>
                        </div>
                        <div className="rightDtl">
                            <div>
                                <p className="label">State</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.address_state)}</p>
                            </div>
                            <div>
                                <p className="label">Country</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.address_country)}</p>
                            </div>
                            <div>
                                <p className="label">Phone Residence</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.land_line_number)}</p>
                            </div>
                            <div>
                                <p className="label">Fax</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.fax)}</p>
                            </div>
                            <div>
                                <p className="label">Email ID</p>
                                <p className="label-text" >{checkForFalsyValues(props?.data?.email_id)}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <p className='page-num' >2</p>
        </div >
    );
};

export default ReviewSecondPage;