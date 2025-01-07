import React, { useState } from 'react';
import "./ForgetPasswordPage.scss";
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

const forgetSchema = yup.object().shape(
    {
        login_user_id: yup.string().max(50).required("Login User ID is required"),
    }

)
const ForgetPasswordPage = () => {
    const navigate = useNavigate();
    const [sendMail, setSendMail] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const
        { register, handleSubmit, formState: { errors, touchedFields, isSubmitted }, getFieldState, setError, clearErrors } = useForm({
            resolver: yupResolver(forgetSchema),
            defaultValues: {
                login_user_id: ''
            },
        });
    const sendResetLinkToUser = async (data: any) => {
        let reqObj = {
            pan_card: data.login_user_id,
            user_type_id: "customer"
        }
        let response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.FORGOT_PASSWORD, false).POST(reqObj)
            .catch((err) => {
                let errorMessage = err.response.data.errors[0]?.message;
                setError('login_user_id', { type: 'custom', message: errorMessage })
            })
        if (response?.success) {
            toast.success("Email Sent Successfully");
            setDataOnLocalStorage('session', response?.data?.session);
            setDataOnLocalStorage('timeStamp', response?.data?.timeStamp);
            dispatch(setOtpOnForgotPassword({ payload: response.data?.otp }))
            dispatch(setEmailOnForgotPassword({ payload: data.login_user_id }))
            setSendMail(true);
        }
    }
    const arrowBack = () => {
        navigate('/login');
    }
    const clearAllErrors = () => {
        clearErrors();
    };
    return (
        <div className='tw-flex tw-overflow-y-hidden'>
            <LeftBanner />
            <div className='tw-min-h-[100vh] tw-w-full tw-bg-white tw-flex tw-flex-col tw-gap-4 tw-p-6'>
                <div className='tw-flex md:tw-justify-end tw-mr-10 tw-mt-4'>
                    <img className='tw-w-24' src={'/logo.png'} alt='' />
                </div>
                {!sendMail &&
                    <div className='md:tw-px-[18%] tw-flex tw-items-center tw-justify-center'>
                        <div>
                            <form onSubmit={handleSubmit(sendResetLinkToUser)}>
                                <div>
                                    <h1 className='section-heading tw-mb-1'>Forgot Password</h1>
                                    <p className='tw-mt-2 forget-pass-p'>Enter the email associated with your account and we’ll send an email with instructions to reset your password.</p>
                                    <p className='tw-mt-8 tw-text-sm'>Enter your Login User ID</p>
                                    <div className='tw-flex flex-col tw-mt-2  '>
                                        <div className='tw-w-full'>
                                            <FormControl sx={{ width: '100%' }}>
                                                <OutlinedInput {...register("login_user_id")} id="login_user_id" placeholder="Enter your Login User ID" className='primary-text-1 tw-font-semibold tw-text-sm  tw-w-full email-input' />
                                                <p className='validation-msg'>
                                                    {getFieldState('login_user_id').error?.message}
                                                </p>
                                            </FormControl>
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
                    <p className='forget-pass-text tw-text-center '>We have sent password recovery instructions to your email.</p>
                    <div className='tw-mt-4'>
                        <button className='tw-w-[270px] common-btn-forget-password tw-flex tw-items-center tw-justify-center tw-cursor-pointer'>
                            <a href='mailto:' target='_blank' rel="noreferrer" className='tw-block'>Open email</a>
                        </button>
                    </div>
                </div>}

                <div onClick={arrowBack} className='tw-flex tw-mt-4 tw-justify-center tw-gap-2 tw-cursor-pointer tw-items-center'>
                    <div><ArrowBackIcon /></div>
                    <div>Back</div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPasswordPage;