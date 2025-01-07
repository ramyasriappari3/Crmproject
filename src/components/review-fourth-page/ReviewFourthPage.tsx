
import { checkForFalsyValues } from "@Src/utils/globalUtilities";
import "./ReviewFourthPage.scss";
const ReviewFourthPage = (props: { applicantBankDetails: any, jointData: any }) => {

    let jointUsersNumber = Object.keys(props?.jointData ?? {}).length

    return (
        <div className='review'>
            <div className='page4-cont'>
                <h2 className="heading">
                    Bank Details
                </h2>
                <div className="personal-details">
                    <h3>Personal Details</h3>
                    <div className="personal-details-cont" >
                        <div className="leftDtl">
                            <div>
                                <p className="label">Bank</p>
                                <p className="label-text" >{checkForFalsyValues(props?.applicantBankDetails?.bank_name)}</p>
                            </div>
                            <div>
                                <p className="label">Account Number</p>
                                <p className="label-text" >{checkForFalsyValues(props?.applicantBankDetails?.bank_account_number)}</p>
                            </div>
                            <div>
                                <p className="label">Name of A/C holder</p>
                                <p className="label-text" >{checkForFalsyValues(props?.applicantBankDetails?.name_as_on_bank_account)}</p>
                            </div>
                        </div>
                        <div className="rightDtl">
                            <div>
                                <p className="label">Branch</p>
                                <p className="label-text" >{checkForFalsyValues(props?.applicantBankDetails?.bank_branch)}</p>
                            </div>
                            <div>
                                <p className="label">IFSC code</p>
                                <p className="label-text" >{checkForFalsyValues(props?.applicantBankDetails?.bank_ifsc_code)}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <p className="page-num">{2 + jointUsersNumber + 1}</p>
        </div>
    );
};

export default ReviewFourthPage;