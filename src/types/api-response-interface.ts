export interface IAPIResponse {
	message: string;
	success: boolean;
	data: any;
}

export interface IFinanceDetails {
	cust_profile_id:string
	bank_name: string
	bank_branch: string
	bank_ifsc_code: string
	name_as_on_bank_account: string
	bank_account_number: string
	home_loan: string
}
export interface ICRMExecutive{
	crm_executive_no: number

}

export interface IApplicantDetails {
	userId: number
	email: string
	mainProfileDetails: IMainProfileDetails
	jointUsers: IJointUser[]
}

export interface ITdsInfo {
	totalPaymentReceived: number
	basicAmount: number
	tdsAmount: number
	tdsAmountPaid: number
	balanceTdsAmount: number
	sellerTdsInfo: SellerTdsInfo
	tdsChallans: any[]
}

export interface SellerTdsInfo {
	pan_no: string
	aadhar_no: string
	name: string
	address: string
	gst_no: string
	pan_category: string
	phone_no: string
	email: string
	no_of_seller:string;
}

export interface IMainProfileDetails {
	id: number
	user_id: number
	first_name: string
	last_name: string
	application_id: number
	dob: string
	phone: string
	email: string
	applicant_relation_id: number
	parent_spouse_name: string
	aadhar_number: string
	gstin_number: string
	occupation: string
	organisation_name: string
	designation: string
	organisation_address: string
	resident: number
	is_joint_user: number
	street_address: string
	pincode: string
	phone_residence: string
	phone_office: string
	fax: string
	created_on: string
}

export interface IJointUser {
	id: number
	user_id: number
	first_name: string
	last_name: string
	application_id: number
	dob: string
	phone: string
	email: string
	applicant_relation_id: number
	parent_spouse_name: string
	aadhar_number: string
	gstin_number: string
	occupation: string
	organisation_name: string
	designation: string
	organisation_address: string
	resident: number
	is_joint_user: number
	street_address: string
	pincode: string
	phone_residence: string
	phone_office: string
	fax: string
	created_on: string
}