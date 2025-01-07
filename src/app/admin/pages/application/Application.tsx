import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import './Application.scss';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Stepper, Step, StepLabel, StepContent, StepConnector, Typography, IconButton } from '@mui/material';
import ApplicationInformation from '../applicant-information/ApplicationInformation';
import FinanceDetails from '../financedetails/FinanceDetails';
import UploadDocuments from '../upload-documents/UploadDocuments';
import ReviewApplication from '../review-application/ReviewApplication';
import { getCreateApplicationInfo, getStepperActiveInfo, setCustomerFormInfo, setIsErrorFormInfo, getAddDeleteJointApplicant } from '@App/admin/redux/features/create.application.info.slice';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import { Navigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import getEnqueueSnackbar from '../../util/msgformate';
import PurchaserDetails from '../purchaser-details/PurchaserDetails';
import PurchaserDocuments from '../purchaser-documents/PurchaserDocument';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Api from '../../api/Api';
import FormValidation from '../validation/FormValidation';
import { useNavigate } from "react-router-dom";
import { AppRouteURls } from "@Constants/app-route-urls";
import { styled, alpha } from '@mui/material/styles';
import * as yup from "yup";
import userSessionInfo from '../../util/userSessionInfo';
import BookingDetails from '../booking-details/BookingDetails';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import moment from 'moment';
import BookingDetailsSidebar from '@Components/booking-details-sidebar/BookingDetailsSidebar';
import FaqSideBar from '@Components/faq-sidebar/FaqSideBar';
import CloseFormPopUp from '@Components/close-form-popup/CloseFormPopUp';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import TermsAndConditions from '@Components/terms-and-conditions/TermsAndConditions';
import { compareObjects } from '@Src/utils/globalUtilities';
// const useStyles = makeStyles((theme:any) => ({
//   root: {
//     width: '100%',
//   },
//   connectorActive: {
//     '& $line': {
//       borderColor: '#00BD35',
//     },
//   },
//   line: {
//     borderColor: 'grey',
//   },
//   stepLabelActive: {
//     color: '#00BD35 !important',
//   },
//   stepLabelCompleted: {
//     color: '#00BD35 !important',
//   },
// }));

// const CustomConnector = (props:any) => {
//   const classes = useStyles();
//   return <StepConnector {...props} classes={{ active: classes.connectorActive, line: classes.line }} />;
// };

interface propsType {
  bottomBarPosition: string
}

const Application: FC<propsType> = ({ bottomBarPosition }) => {
  const navigate = useNavigate();
  const { customerId, custUnitId } = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const userType = userSessionInfo.getUserType();
  const [submitButtonText, setSubmitButtonText] = useState('');
  const [isFaqSidebar, setIsFaqSidebar] = useState(false);
  const [isBookingDetailSidebar, setIsBookingDetailSidebar] = useState(false);
  const [isCloseFormPopUp, setIsCloseFormPopUp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({ isSaveExitModal: false, isTermsModal: false });
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);


  const applicationInfo = useAppSelector((state: any) => {
    //console.log(state.applicationInfo.customerProfileForm.tab_active_key_info);
    return state.applicationInfo;
  });
  const stepperList = applicationInfo.customerProfileForm.tab_list;
  const stepperActiveKeyInfo = applicationInfo.customerProfileForm.tab_active_key_info;
  const reviewApplicationStatus = applicationInfo.customerProfileForm.review_application_action.reviewAppStatus;
  //console.log(applicationInfo.customerProfileForm.tab_list);
  const getProfileInfo = async () => {
    //dispatch(getCreateApplicationInfo({ url_name: "get_customer_application_data", params_data: { cust_profile_id: customerId } }));
    dispatch(showSpinner());
    const { status, data, message } = await dispatch(getCreateApplicationInfo({ url_name: "get_customer_application_data", params_data: { cust_profile_id: customerId, cust_unit_id: custUnitId } })).unwrap();
    if (data?.paymentDetails?.application_status === 'Submitted' && userType === 'customer') {
      navigate('/my-home');
    }
    // if (status) {
    //   enqueueSnackbar(message, getEnqueueSnackbar.alertMsgInfo("success"));
    // } else {4
    //   enqueueSnackbar(message, getEnqueueSnackbar.alertMsgInfo("error"));
    // }
    dispatch(hideSpinner());
  }

  useEffect(() => {
    getProfileInfo();
    if (userType === 'customer') {
      setSubmitButtonText('Submit');
    }
    else {
      setSubmitButtonText('Send for Customer Verification')
    }
  }, []);

  const activeTabEvent = (actionType: string, activeStepper: string) => {
    const arrangeOrder: any = [];
    const arrangeOrderInfo: any = {};
    stepperList.forEach((list: any, pIndex: number) => {
      arrangeOrder.push(list.key_name);
      arrangeOrderInfo[list.key_name] = { parent_index: pIndex, child_index: "" };
      list.sub_list.forEach((sublist: any, cIndex: number) => {
        arrangeOrder.push(sublist.key_name);
        arrangeOrderInfo[sublist.key_name] = { parent_index: pIndex, child_index: cIndex };
      });
    });
    let indexNumber = arrangeOrder.indexOf(activeStepper);
    if (indexNumber != -1) {
      let forwardBackword = indexNumber + (actionType === "back" ? -1 : 1);
      let activeStepperName = arrangeOrder[forwardBackword];
      let parentIndex = arrangeOrderInfo[activeStepperName].parent_index;
      let childIndex = arrangeOrderInfo[activeStepperName].child_index;
      // console.log({ "tabKeyName": activeStepperName, "parentIndex": parentIndex, "childIndex": childIndex });
      dispatch(getStepperActiveInfo({ "tabKeyName": activeStepperName, "parentIndex": parentIndex, "childIndex": childIndex }));
    }
  }

  const checkFormDataValidation = async (applicantForm: any, formType: string = "") => {
    // console.log(applicantForm);  jointApplicantDocumentsSchema
    //console.log(formType);
    const result = { status: false, errorList: [] };
    const documentTypes: any = { "PAN": "PAN", "applicant_photo": "Applicant photo", "Aadhaar_number": "Aadhaar card", "passport_number": "Passport" };
    try {
      if (formType == "applicant_details") {
        await FormValidation.applicantFormSchema.validate(applicantForm, { abortEarly: false });
      } else if (formType == "joint_applicant_details") {
        await FormValidation.jointApplicantFormSchema.validate(applicantForm, { abortEarly: false });
      } else if (formType == "finance_details") {
        await FormValidation.financeDetailsFormSchema.validate(applicantForm, { abortEarly: false });
      } else if (formType == "booking_amount_details") {
        await FormValidation.custBookingAmountSchema.validate(applicantForm, { abortEarly: false });
      } else if (formType == "upload_documents") {
        const pan_card = applicationInfo.customerProfileForm.applicant_details.pan_card;
        const passport_number = applicationInfo.customerProfileForm.applicant_details.passport_number;
        const aadhaar_number = applicationInfo.customerProfileForm.applicant_details.aadhaar_number;
        const filterApplicantForm = applicantForm.filter((list: any) => {
          if (list.document_name === "PAN") {
            return pan_card != null && pan_card != ""
          } else if (list.document_name === "applicant_photo") {
            return true;
          } else if (list.document_name === "Aadhaar_number") {
            return aadhaar_number != null && aadhaar_number != ""
          } else if (list.document_name === "passport_number") {
            return passport_number != null && passport_number != ""
          }
        });
        const itemSchema = yup.object().shape({
          document_name: yup.string().required((params) => { return `The ${params.path} field is required` }),
          document_type: yup.string().default('ID Document'),
          //document_url: yup.string().required((params) => { console.log(params); return `The ${params.path} field is required`}),
          document_url: yup.string().test('document-url-required', function (value) {
            const { document_name } = this.parent; // Access the current object
            if (!value) {
              return this.createError({
                message: { "upload_documents": { [document_name]: `${documentTypes[document_name]} is required` } }
              });
            }
            return true;
          }),
        });
        const arraySchema = yup.array().of(itemSchema).required('Array is required');
        arraySchema.validate(filterApplicantForm, { abortEarly: false, recursive: true })
          .then(() => {
            result.status = false;
            result.errorList = [];
          }).catch((err: any) => {
            result.status = true;
            result.errorList = err.errors;
            // console.log('Validation error details:', err.inner);
          });

        // for (let i = 0; i < applicantForm.length; i++) {
        //   let appdocument = applicantForm[i];
        //   if(appdocument.document_name === 'PAN'){
        //     //await FormValidation.uploadDocumentsSchema.validate(applicantForm[i], { abortEarly: false });
        //     await FormValidation.uploadDocumentsDycSchema(appdocument.document_name).validate(applicantForm[i], { abortEarly: false });
        //   }else if(appdocument.document_name === 'applicant_photo'){
        //     await FormValidation.uploadDocumentsDycSchema(appdocument.document_name).validate(applicantForm[i], { abortEarly: false });
        //   }else if(appdocument.document_name === 'Aadhaar_number'){
        //     await FormValidation.uploadDocumentsDycSchema(appdocument.document_name).validate(applicantForm[i], { abortEarly: false });
        //   }else if(appdocument.document_name === 'passport_number'){
        //     await FormValidation.uploadDocumentsDycSchema(appdocument.document_name).validate(applicantForm[i], { abortEarly: false });
        //   }
        // }
      } else if (formType === "joint_applicant_documents") {
        //console.log(stepperActiveKeyInfo.active_stepper_name);
        let joint_applicant_documents: any = [];
        for (let i = 0; i < applicantForm.length; i++) {
          let joint_applicant_document = applicantForm[i];
          // Iterate through possible keys like joint_applicant_documents_1, joint_applicant_documents_2, etc.
          for (let key in joint_applicant_document) {
            if (joint_applicant_document.hasOwnProperty(key)) {
              if (key === stepperActiveKeyInfo.active_stepper_name) {
                joint_applicant_documents = joint_applicant_document[key];
              }
            }
          }
        }
        const currentIndex = stepperActiveKeyInfo.active_stepper_name.slice(-1) - 1;
        const pan_card = applicationInfo.customerProfileForm.joint_applicant_details[currentIndex].pan_card;
        const passport_number = applicationInfo.customerProfileForm.joint_applicant_details[currentIndex].passport_number;
        const aadhaar_number = applicationInfo.customerProfileForm.joint_applicant_details[currentIndex].aadhaar_number;
        const filterJointApplicantForm = joint_applicant_documents.filter((list: any) => {
          if (list.document_name === "PAN") {
            return pan_card != null && pan_card != ""
          } else if (list.document_name === "applicant_photo") {
            return true;
          } else if (list.document_name === "Aadhaar_number") {
            return aadhaar_number != null && aadhaar_number != ""
          } else if (list.document_name === "passport_number") {
            return passport_number != null && passport_number != ""
          }
        });

        const itemSchema = yup.object().shape({
          document_name: yup.string().required((params) => { return `The ${params.path} field is required` }),
          document_type: yup.string().default('ID Document'),
          document_url: yup.string().test('document-url-required', function (value) {
            const { document_name } = this.parent; // Access the current object
            if (!value) {
              return this.createError({
                message: { [stepperActiveKeyInfo.active_stepper_name]: { [document_name]: `${documentTypes[document_name]} is required` } }
              });
            }
            return true;
          }),
        });
        //console.log(filterJointApplicantForm);
        const arraySchema = yup.array().of(itemSchema).required('Array is required');
        arraySchema.validate(filterJointApplicantForm, { abortEarly: false, recursive: true })
          .then(() => {
            result.status = false;
            result.errorList = [];
          }).catch((err: any) => {
            result.status = true;
            result.errorList = err.errors;
            // console.log('Validation error details:', err.inner);
          });
        //console.log(result);
        return result;
        // for (let i = 0; i < applicantForm.length; i++) {
        //   let joint_applicant_document = applicantForm[i];
        //   console.log(joint_applicant_document); // Optional: Log the entire joint_applicant_document object for debugging
        //   // Iterate through possible keys like joint_applicant_documents_1, joint_applicant_documents_2, etc.
        //   for (let key in joint_applicant_document) {
        //     if (joint_applicant_document.hasOwnProperty(key)) {
        //       let documentsArray = joint_applicant_document[key];
        //       // Iterate through the documentsArray
        //       for (let j = 0; j < documentsArray.length; j++) {
        //         let document = documentsArray[j];
        //         console.log(document.document_name);
        //         // Check if document_name is 'applicant_photo'
        //         if (document.document_name === 'applicant_photo') {
        //           //console.log(document); // Optional: Log the document for debugging purposes
        //           // Validate the document against the schema
        //           await FormValidation.jointApplicantDocumentsSchema.validate(document, { abortEarly: false });
        //         }else if(document.document_name === 'applicant_photo'){
        //         }
        //       }
        //     }
        //   }
        // }

      }


    } catch (validationErrors: any) {
      let erros: any = {};
      validationErrors.inner?.forEach((error: any) => {
        if (erros[error.path] === undefined) {
          erros[error.path] = error.message;
        }
      });
      result.status = true;
      result.errorList = erros;
    }
    return result;

  }
  //console.log(applicationInfo.customerProfileForm.joint_applicant_documents);
  const validaionFormEvent = async (activeStepper: any, activeStepperName: any) => {
    let isValid = { status: false, errorList: {} };
    if (activeStepper == "applicant_details") {
      const applicantForm = applicationInfo.customerProfileForm.applicant_details;
      isValid = await checkFormDataValidation(applicantForm, "applicant_details");
    } else if (activeStepperName == "joint_applicant_details") {
      let id = activeStepper.split("_").pop() - 1;
      const applicantForm = applicationInfo.customerProfileForm.joint_applicant_details[id];
      isValid = await checkFormDataValidation(applicantForm, "joint_applicant_details");
    } else if (activeStepper == "finance_details") {
      const applicantForm = applicationInfo.customerProfileForm.finance_details;
      isValid = await checkFormDataValidation(applicantForm, "finance_details");
    } else if (activeStepper == "booking_amount_details") {
      const applicantForm = applicationInfo.customerProfileForm.customer_booking_amount_details;
      isValid = await checkFormDataValidation(applicantForm, "booking_amount_details");
    } else if (activeStepper == "upload_documents") {
      const applicantForm = applicationInfo.customerProfileForm.upload_documents;
      // console.log(applicantForm);
      isValid = await checkFormDataValidation(applicantForm, "upload_documents");
    } else if (activeStepperName == "joint_applicant_documents") {
      //let id = activeStepper.split("_").pop() - 1;
      const applicantForm = applicationInfo.customerProfileForm.joint_applicant_documents;
      isValid = await checkFormDataValidation(applicantForm, "joint_applicant_documents");
    }
    return isValid;
  }

  const actionEventType = async (actionType: string) => {
    dispatch(setIsErrorFormInfo([]));
    const activeStepper = stepperActiveKeyInfo.active_stepper_name;
    let activeStepperName = activeStepper;
    let joint_applicant_details: any = activeStepper.search("joint_applicant_details");
    if (joint_applicant_details != -1) {
      //joint_applicant_details = "joint_applicant_details";
      activeStepperName = "joint_applicant_details";
    }
    let joint_applicant_docs_details: any = activeStepper.search("joint_applicant_documents");
    if (joint_applicant_docs_details != -1) {
      //joint_applicant_details = "joint_applicant_documents";
      activeStepperName = "joint_applicant_documents";
    }

    if (actionType === "back") {
      activeTabEvent(actionType, activeStepper);
    } else if (actionType === "next") {
      const isValid = await validaionFormEvent(activeStepper, activeStepperName);
      console.log(isValid);
      if (isValid.status) {
        dispatch(setIsErrorFormInfo(isValid));
      } else {
        //dispatch(setIsErrorFormInfo([]));
        activeTabEvent(actionType, activeStepper);
        setCompletedSteps(prevSteps => [...prevSteps, activeStepper]);
      }

    } else if (actionType === "save-and-exit") {
      const isValid = await validaionFormEvent(activeStepper, activeStepperName);
      if (isValid.status) {
        dispatch(setIsErrorFormInfo(isValid));
      } else {
        //dispatch(setIsErrorFormInfo([]));
        submitCustomerForm(actionType, activeStepperName);
      }
    } else if (actionType === "send-verification") {
      submitCustomerForm(actionType, activeStepperName);
    }
  }

  const getRemoveSpaceBetweenWords = (dataValue: string) => {
    let result = "";
    if (dataValue) {
      result = dataValue?.replace(/\s+/g, '');
    }
    return result;
  }
  const getCustomerFormObject = (dataInfo: any, typeForm: string) => {
    let changeToUpperCase: any = ['organisation_name', 'designation', 'organisation_address']
    let formData: any = {};
    for (const key in dataInfo) {
      if (typeForm === "joint") {
        if (key === "resident_type" || key === "same_as_primary_applicant") {
          continue;
        }
      }
      if (key == "aadhaar_number") {
        formData[key] = getRemoveSpaceBetweenWords(dataInfo[key]);
      }
      else if (changeToUpperCase.includes(key)) {
        formData[key] = dataInfo[key]?.toUpperCase();
      }
      else if (key == "last_modified_by") {
        formData[key] = userSessionInfo.logUserId;
      }
      else if (key == "marital_status" || key == "first_name" || key == "middle_name" || key == "last_name") {
        continue;
      }
      else {
        if (key == "dob") {
          if (dataInfo[key].length > 11) {
            formData[key] = moment(dataInfo[key], 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)').format('YYYY-MM-DD');
          } else {
            formData[key] = moment(dataInfo[key], 'YYYY-MM-DD').format('YYYY-MM-DD');
          }

        } else {
          formData[key] = dataInfo[key] != null ? (dataInfo[key]).trim() : "";
        }
      }

    }
    return formData;
  }
  const getCustomerDocsFormObject = (dataInfo: any) => {
    const docformlist: any = [];
    dataInfo.forEach((doclist: any) => {
      if (doclist?.document_identifier || doclist?.document_url) {
        docformlist.push(doclist);
      }
    });
    return docformlist;
  }

  const submitCustomerForm = async (submitType: string = "", activeStepperName: string) => {
    dispatch(showSpinner());
    const stepperActiveNumber = stepperActiveKeyInfo.active_stepper_name.slice(-1) - 1;
    const jointApplicantData: any = [];
    applicationInfo.customerProfileForm.joint_applicant_details.forEach((jointApplicant: any, index: any) => {
      if (activeStepperName === 'joint_applicant_details') {
        if (stepperActiveNumber >= index) {
          jointApplicantData.push(getCustomerFormObject(jointApplicant, "joint"));
        }
      }
      else {
        jointApplicantData.push(getCustomerFormObject(jointApplicant, "joint"));
      }
    });


    const JointDocumentsList = applicationInfo.customerProfileForm.joint_applicant_documents.flatMap((item: any, index: any) => {
      const key = Object.keys(item)[0];
      const newObject = JSON.parse(JSON.stringify(item[key]));
      const itemList: any = newObject.map((list: any) => {
        list.sequence = index + 1;
        return list;
      })

      if (activeStepperName === 'joint_applicant_documents') {
        if (stepperActiveNumber >= index) {
          return itemList;
        }
      } else {
        return itemList;
      }

    });

    const mainApplicantInfo: any = applicationInfo.customerProfileForm.applicant_details;

    const customerFormData: any = {
      customerProfileDetails: getCustomerFormObject(mainApplicantInfo, "applicant"),
      cust_unit_id: custUnitId,
      application_status: submitType == 'save-and-exit' ? 'Not Submitted' : 'Submitted',
      application_stage: getApplicatntStage()
    };

    if (submitType === 'save-and-exit') {
      const checkActiveObject: any = {
        "applicant_details": false,
        "joint_applicant_details": false,
        "finance_details": false,
        "joint_applicant_documents": false,
        "upload_documents": false,
        "booking_amount_details": false,
      }

      for (const key in checkActiveObject) {
        checkActiveObject[key] = true;
        if (key === activeStepperName) {
          break;
        }
      }
      if (checkActiveObject.joint_applicant_details) {
        customerFormData["jointCustomerProfileDetails"] = jointApplicantData;
      }
      if (checkActiveObject.finance_details) {
        customerFormData["customerBankDetails"] = applicationInfo.customerProfileForm.finance_details;
        customerFormData["customerBankDocumentsDetails"] = applicationInfo.customerProfileForm.customer_bank_documents;
        // if (applicationInfo.customerProfileForm.customer_bank_documents.document_url !== "" && applicationInfo.customerProfileForm.customer_bank_documents.document_url !== null) {
        //   customerFormData["customerBankDocumentsDetails"] = applicationInfo.customerProfileForm.customer_bank_documents;
        // }
      }
      if (checkActiveObject.joint_applicant_documents) {
        customerFormData["jointHolderDocumentsDetails"] = getCustomerDocsFormObject(JointDocumentsList);
      }
      if (checkActiveObject.upload_documents) {
        customerFormData["customerProfileDocumentsDetails"] = getCustomerDocsFormObject(applicationInfo.customerProfileForm.upload_documents);
      }
      if (checkActiveObject.booking_amount_details) {
        customerFormData["paymentDetails"] = applicationInfo.customerProfileForm.customer_booking_amount_details;
      }

      //   if (activeStepperName === "joint_applicant_details") {
      //     customerFormData["jointCustomerProfileDetails"] = jointApplicantData;
      //   } else if (activeStepperName === "finance_details") {
      //     customerFormData["customerBankDetails"] = applicationInfo.customerProfileForm.finance_details;
      //     if (applicationInfo.customerProfileForm.customer_bank_documents.document_url !== "" && applicationInfo.customerProfileForm.customer_bank_documents.document_url !== null) {
      //       customerFormData["customerBankDocumentsDetails"] = applicationInfo.customerProfileForm.customer_bank_documents;
      //     }
      //   } else if (activeStepperName === "joint_applicant_documents") {
      //     customerFormData["jointHolderDocumentsDetails"] = getCustomerDocsFormObject(JointDocumentsList);
      //   } else if (activeStepperName === "upload_documents") {
      //     customerFormData["customerProfileDocumentsDetails"] = getCustomerDocsFormObject(applicationInfo.customerProfileForm.upload_documents);
      //   } else if (activeStepperName === "booking_amount_details") {
      //     customerFormData["paymentDetails"] = applicationInfo.customerProfileForm.customer_booking_amount_details;
      //   }
    } else {
      customerFormData["jointCustomerProfileDetails"] = jointApplicantData;
      customerFormData["customerProfileDocumentsDetails"] = getCustomerDocsFormObject(applicationInfo.customerProfileForm.upload_documents);
      customerFormData["jointHolderDocumentsDetails"] = getCustomerDocsFormObject(JointDocumentsList);
      customerFormData["customerBankDetails"] = applicationInfo.customerProfileForm.finance_details;
      customerFormData["paymentDetails"] = applicationInfo.customerProfileForm.customer_booking_amount_details;
      customerFormData["customerBankDocumentsDetails"] = applicationInfo.customerProfileForm.customer_bank_documents;
      // if (applicationInfo.customerProfileForm.customer_bank_documents.document_url !== "" && applicationInfo.customerProfileForm.customer_bank_documents.document_url !== null) {
      //   customerFormData["customerBankDocumentsDetails"] = applicationInfo.customerProfileForm.customer_bank_documents;
      // }
    }


    //console.log(customerFormData,"financialDetails");

    //Below we are exlcuding the objects which we dont want in our changeObject variable, this is for logging purpose
    //Start
    let changedObject = JSON.parse(JSON.stringify(compareObjects(applicationInfo.orgCustomerProfileForm, applicationInfo.customerProfileForm)));
    let excludeObject = ['tab_active_key_info', 'tab_list', 'review_application_action', 'is_error_form'];
    excludeObject.forEach(key => {
      delete changedObject[key];
    });
    customerFormData['customerFormLogs'] = changedObject;
    //End
    const { data, status, message }: any = await Api.post('create_customer_application', customerFormData);
    dispatch(hideSpinner());
    if (status) {
      if (submitType === "send-verification") {
        dispatch(setCustomerFormInfo({ key_name: "reviewAppStatus", key_value: "true", group_type: "reviewapplicationaction", activeTabName: "", activeTabIndex: "" }));
        setCompletedSteps(prevSteps => [...prevSteps, activeStepperName]);
      } else if (submitType === 'save-and-exit') {
        let customMessage = 'Application Saved successfully';
        enqueueSnackbar(customMessage, getEnqueueSnackbar.alertMsgInfo("success"));
        if (userType === 'customer') {
          setIsModalOpen({ ...isModalOpen, isSaveExitModal: true });
        }
        else {
          navigate(`/crm/customerslist`);
        }
      }
    } else {
      enqueueSnackbar(message, getEnqueueSnackbar.alertMsgInfo("error"));
    }
  }

  const getApplicatntStage = () => {
    const stepperActiveKeyName = stepperActiveKeyInfo.active_stepper_name;
    let getActiveStage = {
      applicant_details: "application_data_capture",
      joint_applicant_details: "application_data_capture",
      finance_details: "application_data_capture",
      upload_documents: "document_upload",
      joint_applicant_documents: "document_upload",
      review_application: "review_application",
      booking_amount_details: "document_upload"
    }
    let joint_applicant_details: any = stepperActiveKeyName.search("joint_applicant_details");
    if (joint_applicant_details != -1) {
      joint_applicant_details = stepperActiveKeyName;
    }
    let joint_applicant_docs_details: any = stepperActiveKeyName.search("joint_applicant_documents");
    if (joint_applicant_docs_details != -1) {
      joint_applicant_docs_details = stepperActiveKeyName;
    }
    switch (stepperActiveKeyName) {
      case "applicant_details":
        return getActiveStage['applicant_details'];
      case "finance_details":
        return getActiveStage['finance_details'];
      case "upload_documents":
        return getActiveStage['upload_documents'];
      case "review_application":
        return getActiveStage['review_application'];
      case joint_applicant_details:
        return getActiveStage['joint_applicant_details'];
      case joint_applicant_docs_details:
        return getActiveStage['joint_applicant_documents'];
      case "booking_amount_details":
        return getActiveStage['booking_amount_details'];
      default:
        return getActiveStage['applicant_details'];
    }
  }

  const getStepperActiveContent = (stepperActiveKeyName = "") => {
    let joint_applicant_details: any = stepperActiveKeyName.search("joint_applicant_details");
    if (joint_applicant_details != -1) {
      joint_applicant_details = stepperActiveKeyName;
    }
    let joint_applicant_docs_details: any = stepperActiveKeyName.search("joint_applicant_documents");
    if (joint_applicant_docs_details != -1) {
      joint_applicant_docs_details = stepperActiveKeyName;
    }

    //console.log(stepperActiveKeyInfo);
    switch (stepperActiveKeyName) {
      case "applicant_details":
        return (
          <ApplicationInformation
            setIsFaqSidebar={setIsFaqSidebar}
            setIsBookingDetailSidebar={setIsBookingDetailSidebar}
            setIsCloseFormPopUp={setIsCloseFormPopUp}

          />);
      case "finance_details":
        return (<FinanceDetails
          setIsFaqSidebar={setIsFaqSidebar}
          setIsBookingDetailSidebar={setIsBookingDetailSidebar}
          setIsCloseFormPopUp={setIsCloseFormPopUp}
        />);
      case "upload_documents":
        return (<UploadDocuments
          setIsFaqSidebar={setIsFaqSidebar}
          setIsBookingDetailSidebar={setIsBookingDetailSidebar}
          setIsCloseFormPopUp={setIsCloseFormPopUp}
        />);
      case "review_application":
        return (<ReviewApplication
          setIsFaqSidebar={setIsFaqSidebar}
          setIsBookingDetailSidebar={setIsBookingDetailSidebar}
          setIsCloseFormPopUp={setIsCloseFormPopUp}
        />);
      case joint_applicant_details:
        return (<PurchaserDetails
          setIsFaqSidebar={setIsFaqSidebar}
          setIsBookingDetailSidebar={setIsBookingDetailSidebar}
          setIsCloseFormPopUp={setIsCloseFormPopUp}
        />);
      case joint_applicant_docs_details:
        return (<PurchaserDocuments
          setIsFaqSidebar={setIsFaqSidebar}
          setIsBookingDetailSidebar={setIsBookingDetailSidebar}
          setIsCloseFormPopUp={setIsCloseFormPopUp}
        />);
      case "booking_amount_details":
        return (<BookingDetails
          setIsFaqSidebar={setIsFaqSidebar}
          setIsBookingDetailSidebar={setIsBookingDetailSidebar}
          setIsCloseFormPopUp={setIsCloseFormPopUp}
        />);
      default:
        return "Not Found";
    }
  };

  const getJointApplicantActiveContent = () => {
    const count = applicationInfo.customerProfileForm.joint_applicant_details.length;
    const stepperActiveNumber = stepperActiveKeyInfo.active_stepper_name.slice(-1);
    if (count == 0 && stepperActiveKeyInfo.active_stepper_name === 'applicant_details') {
      return true;
    } else if (count == stepperActiveNumber && stepperActiveKeyInfo.active_stepper_name.search("joint_applicant_details") == 0) {
      if (count >= 3) {
        return false;
      }
      else {
        return true;
      }
    } else {
      return false;
    }
  }

  const addJointApplicant = () => {
    const count = applicationInfo.customerProfileForm.joint_applicant_details.length;
    if (count > 2) {
      let msg = 'Cannot add more than 3 joint applicant';
      enqueueSnackbar(msg, getEnqueueSnackbar.alertMsgInfo("error"));
    } else {
      let msg = 'Joint Applicant added successfully';
      enqueueSnackbar(msg, getEnqueueSnackbar.alertMsgInfo("success"));
      dispatch(getAddDeleteJointApplicant({ action_type: "addjoint" }));
    }
  }

  const eventActiveStepper = (tabKeyName: string, parentIndex: number, childIndex: any) => {
    const arrangeOrder: any = [];
    stepperList.forEach((list: any, pIndex: number) => {
      arrangeOrder.push(list.key_name);
      list.sub_list.forEach((sublist: any, cIndex: number) => {
        arrangeOrder.push(sublist.key_name);
      });
    });
    let currentIndex = arrangeOrder.indexOf(tabKeyName);
    let oldIndex = arrangeOrder.indexOf(stepperActiveKeyInfo.active_stepper_name);
    if (oldIndex >= currentIndex) {
      const activeStepperInfo = { "tabKeyName": tabKeyName, "parentIndex": parentIndex, "childIndex": childIndex };
      dispatch(getStepperActiveInfo(activeStepperInfo));
    }
  }

  const actionEventTermsType = (isModelVal = false) => {
    setIsModalOpen({ ...isModalOpen, isTermsModal: isModelVal });
  }

  return (
    <div className={`tw-pt-2 ${bottomBarPosition ? "md:tw-h-[calc(100vh-80px)]" : "md:tw-h-[calc(100vh-65px)]"}  tw-h-[calc(100vh-18px)] tw-flex tw-flex-col tw-overflow-hidden tw-gap-[10px]`}>
      <div className='tw-relative tw-px-[5%] tw-flex tw-gap-4 md:tw-h-[calc(100vh-140px)] tw-overflow-auto'>
        <div className='md:tw-w-3/12 md:tw-block tw-hidden'>
          <div style={{ position: "fixed", display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* connector={<CustomConnector />} */}
            <Stepper
              activeStep={stepperActiveKeyInfo.parent_index}
              orientation="vertical"
              sx={{
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "#00BD35",
                },
                "& .MuiStepLabel-root .Mui-active": {
                  color: "#00BD35",
                },
                "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
                  color: "#38a832"
                },
                "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                  fill: "#fff"
                },
                "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                  borderColor: "#00BD35",
                },
              }} >
              {
                stepperList.map((tabList: any, index: number) => {
                  // active={true} expanded
                  return <Step key={"stepper_main_" + tabList.key_name} expanded completed={completedSteps.includes(tabList.key_name)}>
                    <StepLabel>
                      <button disabled={reviewApplicationStatus === 'true'} onClick={() => { eventActiveStepper(tabList.key_name, index, "") }} className={stepperActiveKeyInfo.active_stepper_name == tabList.key_name ? 'transform_text_active' : 'transform_text_inactive'}>
                        {tabList.name}
                      </button>
                    </StepLabel>
                    <StepContent>
                      <Typography>
                        <div className='tw-ml-2'>
                          {tabList.sub_list.map((subTabList: any, subIndex: number) => (
                            <div key={"stepper_sub_" + subTabList.key_name}>
                              <Button disabled={reviewApplicationStatus === 'true'} onClick={() => eventActiveStepper(subTabList.key_name, index, subIndex)} className={stepperActiveKeyInfo.active_stepper_name == subTabList.key_name ? 'transform_text_active' : 'transform_text_inactive'}>
                                {subTabList.name}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Typography>
                    </StepContent>
                  </Step>
                })
              }
            </Stepper>
            <div>
              <p className='tw-text-sm tw-font-bold tw-text-black'>Need Help?</p>
              <p className='tw-text-[13px] tw-font-normal tw-text-[#989FAE] tw-cursor-pointer'> <a href="mailto:support@myhomeconstructions.com">support@myhomeconstructions.com</a></p>
            </div>
          </div>
        </div>
        <div style={{ paddingBottom: bottomBarPosition === "fixed" ? "" : "80px" }} className='md:tw-w-9/12 tw-w-full md:tw-pr-[8%]'>
          {getStepperActiveContent(stepperActiveKeyInfo.active_stepper_name)}

          {
            getJointApplicantActiveContent() == true && <div className="tw-bg-white tw-rounded-xl tw-border-2 tw-border-black/50 tw-border-dashed tw-p-6 tw-mt-5  tw-cursor-pointer">
              <div style={{ textAlign: 'center' }} onClick={addJointApplicant}>
                <AddRoundedIcon className='tw-text-black tw-mb-2' />
                <p className='tw-font-bold tw-text-black' style={{ fontSize: 'large' }}>Add a Joint applicant</p>
                <p>You can include up to three joint purchasers.</p>
              </div>
            </div>
          }
        </div>
      </div>
      <div className='tw-flex tw-justify-between tw-w-full tw-bg-white tw-px-[5%] tw-py-2 tw-h-[60px]'>
        <div>
          {
            !reviewApplicationStatus && stepperActiveKeyInfo.active_stepper_name !== "applicant_details" &&
            (<button className='tw-text-sm tw-py-2 tw-px-8 tw-bg-white tw-border tw-border-black tw-rounded-lg tw-font-semibold tw-text-black' onClick={() => actionEventType("back")} >
              Back
            </button>)
          }
        </div>
        {
          <div className='tw-flex tw-gap-6'>
            {
              stepperActiveKeyInfo.active_stepper_name !== "review_application" &&
              <button className='md:tw-block tw-hidden tw-text-sm tw-py-2 tw-px-8 tw-bg-white tw-border tw-border-black tw-rounded-lg tw-font-semibold tw-text-black' onClick={() => actionEventType("save-and-exit")} >
                Save and Exit
              </button>
            }

            {
              stepperActiveKeyInfo.active_stepper_name !== "review_application" &&
              <button className='tw-text-sm tw-py-2 tw-px-10 tw-bg-black tw-border tw-border-black tw-rounded-lg tw-font-semibold tw-text-white' onClick={() => actionEventType("next")} >
                Next
              </button>
            }

            {
              stepperActiveKeyInfo.active_stepper_name === "review_application" && (
                userType !== 'customer' ?
                  <button id="send-verification-submit-btn" className='tw-text-sm tw-py-2 tw-px-10 tw-bg-black tw-border tw-border-black tw-rounded-lg tw-font-semibold tw-text-white' onClick={() => actionEventType("send-verification")}>
                    {submitButtonText}
                  </button>
                  :
                  <button id="send-verification-submit-btn" className='tw-text-sm tw-py-2 tw-px-10 tw-bg-black tw-border tw-border-black tw-rounded-lg tw-font-semibold tw-text-white' onClick={() => actionEventTermsType(true)}>
                    {submitButtonText}
                  </button>
              )

            }
          </div>
        }
      </div>
      {
        isFaqSidebar && <FaqSideBar isFaqSidebar={isFaqSidebar} setIsFaqSidebar={setIsFaqSidebar} />
      }
      {
        isBookingDetailSidebar && <BookingDetailsSidebar isBookingDetailSidebar={isBookingDetailSidebar} setIsBookingDetailSidebar={setIsBookingDetailSidebar} />
      }
      {
        isCloseFormPopUp && <CloseFormPopUp isCloseFormPopUp={isCloseFormPopUp} setIsCloseFormPopUp={setIsCloseFormPopUp} />
      }
      <Dialog
        open={isModalOpen.isSaveExitModal}
        onClose={() => setIsModalOpen({ isSaveExitModal: false, isTermsModal: false })}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <div className='tw-flex tw-justify-end'>
          <DialogTitle id="confirm-delete-title">Are you sure you want to exit?</DialogTitle>
          <IconButton aria-label="" onClick={() => setIsModalOpen({ ...isModalOpen, isSaveExitModal: false })}>
            <CloseIcon />
          </IconButton>
        </div>
        <div>
          <DialogContent>
            <DialogContentText id="confirm-delete-description">
              Your progress up until now has been saved
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className='bg-white-btn-util' onClick={() => { navigate('/my-home'); }} >
              Exit
            </button>
            <button className='bg-black-btn-util' onClick={() => setIsModalOpen({ ...isModalOpen, isSaveExitModal: false })} >
              Keep working
            </button>
          </DialogActions>
        </div>
      </Dialog>
      {
        <TermsAndConditions isTermsModal={isModalOpen.isTermsModal} isModelActionEvent={actionEventTermsType} isActionEventType={actionEventType} />
      }
    </div>

  );
}

export default Application;