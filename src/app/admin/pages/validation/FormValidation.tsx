import moment from "moment";
import * as yup from "yup";

const loginFormSchema = yup.object().shape({
  user_login_name: yup.string().max(50, 'Email must not reach 50 characters').required('User Id is required'),
  password: yup.string().required('Password is required')
});

const applicantFormSchema = yup.object().shape({
  "cust_profile_id": yup.string().required('cust profile id is required'),
  "customer_title": yup.string().max(10, 'Title must not reach 10 characters').nullable(),
  "full_name": yup.string().trim().max(50, 'Full Name should not be more than 50 characters').required('Full Name is required'),
  "applicant_relation_id": yup.string().max(5, 'S/O, D/O, W/O, H/O must not reach 5 characters').required('S/O, D/O, W/O, H/O is required'),
  "parent_or_spouse_name": yup.string().trim().max(50, 'Parent/Spouse Name should not be more than 50 characters').required('Parent/Spouse Name is required'),
  dob: yup.string()
    .required("Applicant's Date Of Birth is required")
    .test('age', function (value: any) {
      if (value !== "Invalid Date") {
        // if(moment().diff(moment(value, ['ddd MMM DD YYYY HH:mm:ss ZZ', 'YYYY-MM-DD']), 'years') >= 18){
        //   return true;
        // }else{
        //   throw this.createError({ message: 'You must be at least 18 years old' });
        // }
        return true;
      } else {
        throw this.createError({ message: 'Date format is not correct or invalid DD/MM/YYYY' });
      }
    }),
  "resident_type": yup.string().required('Residential status is required'),
  "aadhaar_number": yup.string().trim().when('resident_type', {
    is: (val: string) => val === 'Resident',
    then: (schema) => schema.required('Aadhaar number is required').matches(/^\d{4}\s\d{4}\s\d{4}$/, 'Must be in the format XXXX XXXX XXXX'),
    otherwise: (schema) => schema.notRequired().nullable().test('is-aadhaar', 'Must be in the format XXXX XXXX XXXX', function (value) {
      const isNotEmpty = !!value && value.trim().length > 0;
      if (isNotEmpty) {
        return /^\d{4}\s\d{4}\s\d{4}$/.test(value);
      }
      return true;
    })
  }),
  "passport_number": yup.string().trim().when(['resident_type', 'pan_card'], {
    is: (resident_type: any, pan_card: any) => resident_type === 'NRI' && pan_card === '',
    then: (schema) => schema.required('Passport number is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  // "passport_number": yup.string().when('resident_type', {
  // 	is: (val: string) => val === 'NRI',
  // 	then: (schema) => schema.required('Passport number is required'),
  // 	otherwise: (schema) => schema.notRequired()
  // }),
  "pan_card": yup.string().trim().when('resident_type', {
    is: (val: string | undefined) => val === 'Resident',
    then: (schema) => schema.required('PAN is required').matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Must be in format ABCTY1234D'),
    otherwise: (schema) => schema
      .nullable()
      .test('is-valid-or-null', 'Must be in format ABCTY1234D', function (value: any) {
        if (value === null || value === '') return true;
        return /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(value);
      }),
  }),
  "gstin_number": yup.string().trim().optional().notRequired().test('is-gstin', 'Must be in the format 12ABCDE1234F1Z2', function (value) {
    const isNotEmpty = !!value && value.trim().length > 0;
    if (isNotEmpty) {
      return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value);
    }
    return true; // Passes validation if empty
  }),

  // "aadhaar_number": yup.string().nullable().notRequired().test('is-aadhaar', 'Must be in the format XXXX XXXX XXXX', function (value) {
  //     const isNotEmpty = !!value && value.trim().length > 0;
  //     if (isNotEmpty) {
  //         return /^\d{4}\s\d{4}\s\d{4}$/.test(value);
  //     }
  //     return true; // Passes validation if empty
  // }),
  // "aadhaar_number":yup.string().max(40, 'Aadhaar Number must not reach 40 characters').required('Aadhaar Number is required'),
  //"gstin_number":yup.string().max(50, 'GSTIN Number must not reach 50 characters').notRequired(),
  "occupation": yup.string().trim().max(50, 'Occupation must not reach 50 characters').required('Occupation is required'),
  "organisation_name": yup.string().trim().max(50, 'Organisation name must not reach 50 characters').required('Organisation name is required'),
  "designation": yup.string().trim().max(50, 'Designation must not reach 50 characters').required('Designation is required'),
  "organisation_address": yup.string().trim().max(250, 'Organisation address must not reach 250 characters').required('Organisation address is required'),

  "first_name": yup.string().trim().max(60, 'First Name must not reach 60 characters').notRequired(),
  "middle_name": yup.string().trim().max(60, 'Middle Name must not reach 60 characters').notRequired(),
  "last_name": yup.string().trim().max(60, 'Last Name must not reach 60 characters').notRequired(),
  "mobile_number": yup.string().trim().min(9, 'Mobile number must be between 9 and 16 digits').max(16, 'Mobile number must be between 9 and 16 digits').required('Mobile Number is required'),
  "fax": yup.string().trim().test('is-valid-fax', 'Fax must be between 9 and 16 digits', (value: any) => {
    if (value === '' || (value.length >= 9 && value.length <= 16)) {
      return true;
    } else {
      return false;
    }
  }).notRequired(),
  "land_line_number": yup.string().trim().test('is-valid-fax', 'Residence phone number must be between 9 and 16 digits', (value: any) => {
    if (value === '' || (value.length >= 9 && value.length <= 16)) {
      return true;
    } else {
      return false;
    }
  }).notRequired(),
  "office_phone": yup.string().trim().test('is-valid-fax', 'Office phone number must be between 9 and 16 digits', (value: any) => {
    if (value === '' || (value.length >= 9 && value.length <= 16)) {
      return true;
    } else {
      return false;
    }
  }).notRequired(),
  email_id: yup.string().trim().required('Email is required').test('is-alternate', 'Invalid Email Format',
    function (value) {
      const isNotEmpty = !!value && value.trim().length > 0;
      if (isNotEmpty) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      }
      return true;
    }),
  "alternate_mobile": yup.string().trim().test('is-valid-fax', 'Alternate mobile number must be between 9 and 16 digits', (value: any) => {
    if (value === '' || (value.length >= 9 && value.length <= 16)) {
      return true;
    } else {
      return false;
    }
  }).notRequired(),
  alternate_email_id: yup.string().trim().optional().notRequired().test('is-alternate', 'Invalid Email Format',
    function (value) {
      const isNotEmpty = !!value && value.trim().length > 0;
      if (isNotEmpty) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      }
      return true;
    }),
  //"marital_status":yup.string().max(50, 'Marital Status must not reach 50 characters').required('Marital status  is required'),
  // "passport_number": yup.string().max(50, 'Email must not reach 50 characters').required('User Id is required'),
  pin_code: yup.string().when('resident_type', {
		is: (val: string) => val === 'Resident',
		then: (schema) => schema.required('Pin/Postal/Zip Code is required').matches(/^\d{6}$/, 'Must be a valid 6-digit pincode'),
		otherwise: (schema) => schema.required('Pin/Postal/Zip Code is required').matches(/^[a-zA-Z0-9]{6,12}$/, 'Must be a valid 6-12 character alphanumeric pincode')
	}),
  "customer_flat_house_number": yup.string().trim().max(50, 'House/Flat number must not reach 60 characters').required('House/Flat number is required'),
  "address_street1": yup.string().trim().max(100, 'Street Address 1 must not reach 100 characters').required('Street Address 1 is required'),
  "address_street2": yup.string().trim().max(100, 'street Address 2 must not reach 100 characters').required('Street Address 2 is required'),
  "address_city": yup.string().trim().max(50, 'City/Town/District must not reach 50 characters').required('City/Town/District is required'),
  // "address_state": yup.string().when('resident_type', {
  //   is: (val: string) => val !== 'NRI',
  //   then: (schema) => schema.required('State is required'),
  //   otherwise: (schema) => schema.notRequired()
  // }),

  "address_state": yup.string().trim().max(20, 'State must not reach 20 characters').required('State is required'),
  "address_country": yup.string().trim().max(50, 'Country must not reach 50 characters').required('Country is required')
});

const jointApplicantFormSchema = yup.object().shape({
  "customer_title": yup.string().max(10, 'Title must not reach 10 characters').nullable(),
  "full_name": yup.string().trim().max(50, 'Full Name should not be more than 50 characters').required('Full Name is required'),
  "joint_customer_id": yup.string().optional().notRequired().max(150, 'Joint applicant Id must not reach 150 characters'),
  "cust_profile_id": yup.string().required('cust profile id is required'),
  "applicant_relation_id": yup.string().max(5, 'S/O, D/O, W/O, H/O must not reach 5 characters').required('S/O, D/O, W/O, H/O is required'),
  "parent_or_spouse_name": yup.string().trim().max(50, 'Parent/Spouse Name should not be more than 50 characters').required('Parent/Spouse Name is required'),
  //"aadhaar_number": yup.string().max(40, 'Aadhaar Number must not reach 40 characters').required(' Aadhaar Number is required'),
  //"pan_card": yup.string().max(20, 'PAN Number  must not reach 20 characters').required('PAN Number is required'),
  //"resident_type": yup.string().required('Residential status is required'),
  //   "aadhaar_number": yup.string().when('resident_type', {
  // 	is: (val: string) => val === 'Resident',
  // 	then: (schema) => schema.required('Aadhaar number is required').matches(/^\d{4}\s\d{4}\s\d{4}$/, 'Must be in the format XXXX XXXX XXXX'),
  // 	otherwise: (schema) => schema.notRequired().nullable().test('is-aadhaar', 'Must be in the format XXXX XXXX XXXX', function (value) {
  // 		const isNotEmpty = !!value && value.trim().length > 0;
  // 		if (isNotEmpty) {
  // 			return /^\d{4}\s\d{4}\s\d{4}$/.test(value);
  // 		}
  // 		return true;
  // 	})
  // }),
  // "passport_number": yup.string().when('resident_type', {
  // 	is: (val: string) => val === 'NRI',
  // 	then: (schema) => schema.required('Passport number is required'),
  // 	otherwise: (schema) => schema.notRequired()
  // }),
  "passport_number": yup.string().trim().when(['resident_type', 'pan_card'], {
    is: (resident_type: any, pan_card: any) => { console.log(resident_type);return resident_type === 'NRI' && pan_card === ''},
    then: (schema) => schema.required('Passport number is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  "aadhaar_number": yup.string().trim().when('resident_type', {
    is: (val: string) => val === 'Resident',
    then: (schema) => schema.required('Aadhaar number is required').matches(/^\d{4}\s\d{4}\s\d{4}$/, 'Must be in the format XXXX XXXX XXXX'),
    otherwise: (schema) => schema.notRequired().nullable().test('is-aadhaar', 'Must be in the format XXXX XXXX XXXX', function (value) {
      const isNotEmpty = !!value && value.trim().length > 0;
      if (isNotEmpty) {
        return /^\d{4}\s\d{4}\s\d{4}$/.test(value);
      }
      return true;
    })
  }),
  dob: yup.string().optional().notRequired()
    .required("Applicant's Date Of Birth is required")
    .test('age', function (value: any) {
      if (value !== "Invalid Date") {
        // if(moment().diff(moment(value, ['ddd MMM DD YYYY HH:mm:ss ZZ', 'YYYY-MM-DD']), 'years') >= 18){
        //   return true;
        // }else{
        //   throw this.createError({ message: 'You must be at least 18 years old' });
        // }
        return true;
      } else {
        throw this.createError({ message: 'Date format is not correct or invalid DD/MM/YYYY' });
      }
    }),
  "pan_card": yup.string().trim().optional().notRequired().when('resident_type', {
    is: (val: string | undefined) => val === 'Resident',
    then: (schema) => schema.required('PAN is required').matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Must be in format ABCTY1234D'),
    otherwise: (schema) => schema
      .nullable()
      .test('is-valid-or-null', 'Must be in format ABCTY1234D', function (value: any) {
        if (value === null || value === '') return true;
        return /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(value);
      }),
  }),
  "gstin_number": yup.string().trim().optional().notRequired().test('is-gstin', 'Must be in the format 12ABCDE1234F1Z2', function (value) {
    const isNotEmpty = !!value && value.trim().length > 0;
    if (isNotEmpty) {
      return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value);
    }
    return true; // Passes validation if empty
  }),
  "address_state": yup.string().trim().max(60, 'State must not reach 60 characters').required('State is required'),
  // "address_state": yup.string().when('resident_type', {
  // 	is: (val: string) => val !== 'NRI',
  // 	then: (schema) => schema.required('State is required'),
  // 	otherwise: (schema) => schema.notRequired()
  // }),
  email_id: yup.string().trim().required('Email is required').test('is-alternate', 'Invalid Email Format',
    function (value) {
      const isNotEmpty = !!value && value.trim().length > 0;
      if (isNotEmpty) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      }
      return true;
    }),
  alternate_email_id: yup.string().trim().optional().notRequired().test('is-alternate', 'Invalid Email Format',
    function (value) {
      const isNotEmpty = !!value && value.trim().length > 0;
      if (isNotEmpty) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      }
      return true;
    }),
  "mobile_number": yup.string().trim().min(9, 'Mobile number must be between 9 and 16 digits').max(16, 'Mobile number must be between 9 and 16 digits').required('Mobile Number is required'),
  "fax": yup.string().trim().test('is-valid-fax', 'Fax must be between 9 and 16 digits', (value: any) => {
    if (value === '' || (value.length >= 9 && value.length <= 16)) {
      return true;
    } else {
      return false;
    }
  }).notRequired(),
  "land_line_number": yup.string().trim().test('is-valid-fax', 'Residence phone number must be between 9 and 16 digits', (value: any) => {
    if (value === '' || (value.length >= 9 && value.length <= 16)) {
      return true;
    } else {
      return false;
    }
  }).notRequired(),
  "office_phone": yup.string().trim().test('is-valid-fax', 'Office phone number must be between 9 and 16 digits', (value: any) => {
    if (value === '' || (value.length >= 9 && value.length <= 16)) {
      return true;
    } else {
      return false;
    }
  }).notRequired(),
  // "gstin_number": yup.string().max(100, 'Joint applicant Id must not reach 50 characters').required('Joint Applicant Id is required'),
  //"email_id": yup.string().max(60, 'Email  must not reach 60 characters').required('Email id is required'),
  // "alternate_mobile": yup.string().max(100, 'Joint applicant Id must not reach 50 characters').required('Joint Applicant Id is required'),
  // "alternate_email_id": yup.string().max(100, 'Joint applicant Id must not reach 50 characters').required('Joint Applicant Id is required'),
  // "first_name": yup.string().max(100, 'Joint applicant Id must not reach 50 characters').required('Joint Applicant Id is required'),
  // "middle_name": yup.string().max(100, 'Joint applicant Id must not reach 50 characters').required('Joint Applicant Id is required'),
  // "last_name": yup.string().max(100, 'Joint applicant Id must not reach 50 characters').required('Joint Applicant Id is required'),
  //"dob": yup.string().required('Applicant-s Date Of Birth is required'),
  //"marital_status": yup.string().max(100, 'Marital status must not reach 50 characters').required('Marital status is required'),
  "occupation": yup.string().trim().max(50, 'Occupation must not reach 50 characters').required('Occupation is required'),
  "organisation_name": yup.string().trim().max(40, 'Organisation name must not reach 50 characters').required('Organisation Name is required'),
  "designation": yup.string().trim().max(30, 'Designation must not reach 50 characters').required('Designation is required'),
  "organisation_address": yup.string().trim().max(100, 'Organisation address must not reach 50 characters').required('Organisation address is required'),
  //"resident_type": yup.string().max(50, 'Residential Status must not reach 50 characters').required('Residential Status is required'),
  pin_code: yup.string().when('resident_type', {
		is: (val: string) => val === 'Resident',
		then: (schema) => schema.required('Pin/Postal/Zip Code is required').matches(/^\d{6}$/, 'Must be a valid 6-digit pincode'),
		otherwise: (schema) => schema.required('Pin/Postal/Zip Code is required').matches(/^[a-zA-Z0-9]{6,12}$/, 'Must be a valid 6-12 character alphanumeric pincode')
	}),
  "customer_flat_house_number": yup.string().trim().max(50, 'House/Flat number must not reach 30 characters').required('House/Flat number is required'),
  "address_street1": yup.string().trim().max(100, 'Street Address 1 must not reach 100 characters').required('Street Address 1 is required'),
  "address_street2": yup.string().trim().max(100, 'Street Address 2 must not reach 100 characters').required('Street Address 2 is required'),
  "address_city": yup.string().trim().max(100, 'City/Town/District must not reach 50 characters').required('City/Town/District is required'),
  "address_country": yup.string().trim().max(60, 'Country must not reach 50 characters').required('Country is required'),
});

const financeDetailsFormSchema = yup.object().shape({
  "bank_account_number": yup.string().trim().required('A/C Number is required').matches(/^\d+$/, "A/C Number must contain only numbers").min(11, "Account number must be in range of 11-16 digits").max(16, 'Account number must be in range of 11-16 digits'),
  "name_as_on_bank_account": yup.string().trim().max(100, 'Name of the A/C Holder must not reach 100 characters').required('Name of the A/C Holder is required'),
  "bank_ifsc_code": yup.string().trim().required('IFSC code is required').matches(/[A-Z]{4}[0-9]{7}$/, "Must be in the format WXYZ1234567").max(11, 'IFSC Code must not reach 20 characters'),
  // "bank_address": yup.string().max(100, 'Email must not reach 100 characters').required('User Id is required'),
  "bank_branch": yup.string().trim().max(100, 'Branch must not reach 100 characters').required('Branch is required'),
  // "bank_account_micr_code": yup.string().max(30, 'Email must not reach 30 characters').required('User Id is required'),
  // "bank_swift_code": yup.string().max(30, 'Email must not reach 30 characters').required('User Id is required'),
  // "domestic_bank": yup.string().max(, 'Email must not reach 50 characters').required('User Id is required'),
  "bank_name": yup.string().trim().max(255, 'Bank Name must not reach 255 characters').required('Bank Name  is required'),
  "interested_in_home_loans": yup.string().max(50, 'Home Loan must not reach 50 characters').required('Home Loan is required'),
  // "sales_order_id": yup.string().max(50, 'Email must not reach 50 characters').required('User Id is required'),
  "cust_profile_id": yup.string().max(150, 'Email must not reach 50 characters').required('cust profile Id is required')
});


const uploadDocumentsSchema = yup.object({
  document_name: yup.string().required('Applicant Photo is Required'),
  document_type: yup.string().default('ID Document'),
  document_url: yup.string().required('Applicant Photo is Required')
});


const uploadDocumentsDycSchema = () => {
  //docType:string
  // let docTypeName = ""; 
  // if(docType === "applicant_photo"){
  //   docTypeName = "Applicant Photo";
  // }else if(docType === "PAN"){
  //   docTypeName = "PAN";
  // }else if(docType === "Aadhaar_number"){
  //   docTypeName = "Aadhaar number";
  // }else if(docType === "passport_number"){
  //   docTypeName = "Passport number ";
  // }
  // return yup.object({
  //   document_name: yup.string().required(docTypeName + ' is Required'),
  //   document_type: yup.string().default('ID Document'),
  //   document_url: yup.string().required(docTypeName + ' is Required')
  // });

  const itemSchema = yup.object().shape({
    document_name: yup.string().required((params) => `The ${params.path} field is required`),
    document_type: yup.string().default('ID Document'),
    document_url: yup.string().required((params) => `The ${params.path} field is required`)
  });
  return yup.array().of(itemSchema).required('Array is required');
}

const jointApplicantDocumentsSchema = yup.object({
  document_name: yup.string().required('Applicant Photo is Required'),
  document_type: yup.string().default('ID Document'),
  document_url: yup.string().required('Applicant Photo is Required')
});

const custBookingAmountSchema = yup.object({
  "booking_transaction_id": yup.string().trim().required('Demand draft/cheque Number is Required'),
  "booking_bank_name": yup.string().trim().required('Bank name is Required'),
  "booking_bank_branch_name": yup.string().trim().required('Branch Name is Required'),
  "booking_date": yup.string().required("Date of transaction is Required").test('age', function (value: any) {
    if (value !== "Invalid Date") {
      return true;
    } else {
      throw this.createError({ message: 'Date format is not correct or invalid DD/MM/YYYY' });
    }
  }),
  "booking_amount_paid": yup.string().trim().required('Booking amount is required').matches(/^\d+(\.\d+)?$/, 'Booking amount must be valid number'),
  "cust_unit_id": yup.string().required('Customer unitid is Required')
});


const FormValidation = { loginFormSchema, applicantFormSchema, jointApplicantFormSchema, financeDetailsFormSchema, uploadDocumentsSchema, jointApplicantDocumentsSchema, uploadDocumentsDycSchema, custBookingAmountSchema };

export default FormValidation;