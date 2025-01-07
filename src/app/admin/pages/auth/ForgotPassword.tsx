import React, { useState } from 'react';
import "./ForgotPassword.scss";
import LeftBanner from '@Components/left-banner/LeftBanner';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { toast } from 'react-toastify';
import Carousel from 'better-react-carousel';
import { useNavigate, useParams } from 'react-router-dom';
import { httpService, MODULES_API_MAP } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VALIDATION_REGEX_PATTERN } from '@Constants/constants';
import { FormControl, OutlinedInput } from '@mui/material';
import { useAppDispatch } from '@Src/app/hooks';
import { setEmailOnForgotPassword, setOtpOnForgotPassword } from '@Src/features/global/globalSlice';
import { setDataOnLocalStorage } from '@Src/utils/globalUtilities';
import Api from '../../api/Api';
import userSessionInfo from '../../util/userSessionInfo';
import { defaultColumn } from 'react-table';

const forgetSchema = yup.object().shape(
    {
        login_user_id: yup.string().max(50).required('Login UserId Is Required.'),
    }

)
const ForgetPasswordPage = () => {
    const navigate = useNavigate();
    userSessionInfo.isLoginRoute();
    const [sendMail, setSendMail] = useState<boolean>(false)
    const [link,setlink] = useState("")
    const dispatch = useAppDispatch();
    const [errorMessage,setErrorMessage] = useState("")
    const
        { register, handleSubmit, formState: { errors, touchedFields, isSubmitted }, getFieldState, setError, clearErrors } = useForm({
            resolver: yupResolver(forgetSchema),
            defaultValues: {
                login_user_id: ''
            },
        });
    const sendResetLinkToUser = async (reqdata: any) => {
        let reqObj = {
            user_login_name: reqdata.login_user_id,
            user_type_id: "internal"
        }

      

        const { success, message, data } = await Api.postLogin("crm_forgot_password", reqObj);
        if(success){
            console.log("data",data)
            // userSessionInfo.setSessionData("user_info", data.user_info);
            // userSessionInfo.setSessionData("key", data.token_info.key);
            // userSessionInfo.setSessionData("token_info", data.token_info);
            toast.success('Please check the Email')
            // dispatch(setOtpOnForgotPassword({ payload: response.data?.otp }))
            // dispatch(setEmailOnForgotPassword({ payload: data.login_user_id }))
            setSendMail(true);
            setlink(data?.data?.resetLink)
            setErrorMessage('')
            //setError('')
           // navigate('/crm/login');
        }else{
            setErrorMessage(message)
            setError('login_user_id', { type: 'custom', message: message })
        }
        // let response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.FORGOT_PASSWORD, false).POST(reqObj)
        //     .catch((err) => {
        //         let errorMessage = err.response.data.errors[0]?.message;
        //         setError('login_user_id', { type: 'custom', message: errorMessage })
        //     })
        // if (response?.success) {
        //     toast.success("Email Sent Successfully");
        //     setDataOnLocalStorage('session', response?.data?.session);
        //     setDataOnLocalStorage('timeStamp', response?.data?.timeStamp);
        //     dispatch(setOtpOnForgotPassword({ payload: response.data?.otp }))
        //     dispatch(setEmailOnForgotPassword({ payload: data.login_user_id }))
        //     setSendMail(true);
        // }
    }
    const arrowBack = () => {
        navigate('/crm/login');
    }
    const clearAllErrors = () => {
        clearErrors();
    };
    return (
        <div className='forget-password-page tw-flex md:tw-mt-0 tw-pr-4 tw-justify-center  tw-pt-10'>
            {/* <LeftBanner /> */}
            <div className='right-section-1 md:tw-w-1/2  tw-p-0 tw-bg-white' style={{borderRadius:'0.5rem',width : '500px'}}>
                <div className='tw-flex  md:tw-w-full md:tw-mr-40 tw-mt-3 tw-mb-8'style={{paddingLeft : '3rem'}}>
                    <img className='tw-h-14 tw-w-[102px] md:tw-mr-14' src={'/logo.png'} alt='' />
                </div>
                {!sendMail && <div className='tw-p-2 tw-flex tw-items-center tw-justify-center'>
                    <div>
                        <form onSubmit={handleSubmit(sendResetLinkToUser)}>
                            <div className=''>
                                <h1 className='section-heading !tw-text-[32px] tw-mb-1'>Forgot Password</h1>
                                <p className='tw-mt-2 forget-pass-p'>Enter the email associated with your account and we’ll send an email with instructions to reset your password.</p>
                                <div className='tw-mt-8'>
                                    <label className='tw-mt-8 tw-text-sm' htmlFor='email'>Enter your Login User ID</label>
                                </div>
                                <div className='tw-flex flex-col tw-mt-2  '>
                                    <div className='tw-w-full'>
                                        <FormControl sx={{ width: '100%' }}>
                                            <OutlinedInput {...register("login_user_id")} id="login_user_id" placeholder="Enter your Login User ID" className='primary-text-1 tw-font-semibold tw-text-sm  tw-w-full email-input' />
                                            <p className='validation-msg'>
                                                {getFieldState('login_user_id').error?.message}
                                            </p>
                                        </FormControl>
                                        {/* {getFieldState('login_user_id').error?.message != 'Login UserId Is Required.' && errorMessage ? <div className="tw-text-red-500 tw-my-1">{errorMessage}</div> : ""} */}
                                    </div>
                                </div>
                                <div className='tw-mt-8'>
                                    <button className='common-btn-forget-password tw-flex tw-items-center tw-justify-center tw-w-full tw-cursor-pointer'>Send Instructions</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>}

                {sendMail && <div className='tw-flex tw-items-center tw-justify-center tw-flex-col'>
                    <img className='tw-size-16' src="https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/Letter+Unread.svg" alt='' />
                    <h1 className='forget-pass-h1 tw-font-bold'>Check your mail</h1>
                    <p className='forget-pass-text tw-text-center '>We have sent a password recover instructions to your email.</p>
                    <div className='tw-mt-4'>
                        <button className='tw-w-[270px] common-btn-forget-password tw-flex tw-items-center tw-justify-center tw-cursor-pointer'>
                            {/* <a href='mailto:' target='_blank' rel="noreferrer" className='tw-block' >Open email</a> */}
                            <a href={link} target='_blank' rel="noreferrer" className='tw-block' >Open email</a>
                            {link}
                        </button>
                    </div>
                </div>}

                <div  className='tw-flex tw-mt-4 tw-justify-center tw-gap-2 tw-cursor-pointer tw-items-center'>
                    <div><ArrowBackIcon onClick={arrowBack} /></div>
                    <div>Back</div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPasswordPage;