
import React, { useState } from 'react';
import "./ResetPassword.scss"
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { toast } from 'react-toastify';
import Carousel from 'better-react-carousel';
import { useParams, useNavigate } from 'react-router-dom';
import { httpService, MODULES_API_MAP } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormControl, OutlinedInput, TextField, InputAdornment, IconButton } from '@mui/material';
import LeftBanner from '@Components/left-banner/LeftBanner';
import { useAppSelector } from '@Src/app/hooks';
import { getDataFromLocalStorage } from '@Src/utils/globalUtilities';
import moment from 'moment';


const resetSchema = yup.object().shape(
    {
        password: yup.string().required("Please enter password").min(8, "Password must be at least 8 characters"),
        confirm_password: yup.string().required('Confirm Password Is Required').test('passwords-match', 'Passwords must match', function (value) {
            return this.parent.password === value;
        })
    }

)
const imageBaseUrl = process.env.REACT_APP_MINDLER_PRODUCT_IMAGES_URL;

function ResetPassword() {

    const navigate = useNavigate()

    const [isPassWordReset, setIsPassWordReset] = useState<boolean>(false)

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const resetOtp: any = useAppSelector((state) => state.global.otp);
    const resetEmail: any = useAppSelector((state) => state.global.email);
    const { tokenFromUrl } = useParams();

    const tokenFromLocalStorage = getDataFromLocalStorage('session');
    const timeStampFromLocalStorage = Number(getDataFromLocalStorage('timeStamp'));
    const currentSystemTimeStamp = moment().unix();
    const momentTimeStampFromLocalStorage = moment.unix(timeStampFromLocalStorage);
    const momentCurrentSystemTimeStamp = moment.unix(currentSystemTimeStamp);

    // Calculate the time difference in minutes
    const timeDifferenceInMinutes = momentCurrentSystemTimeStamp.diff(momentTimeStampFromLocalStorage, 'minutes');
    console.log("Time difference in minutes:", timeDifferenceInMinutes);

    const confirmPasswordAndLogin = async (data: any) => {

        let response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.RESET_PASSWORD, false).POST({ password: data.password, email: resetEmail || '', otp: resetOtp || '' })
            .catch((err) => {
                let errorMessage = err.response.data.errors[0]?.message;
                setError('confirm_password', { type: 'custom', message: errorMessage })
            })
        if (response.success) {
            toast.success("Password is Changed Successfully")
            setIsPassWordReset(true)
        }
    }


    const { register, handleSubmit, control, reset, formState: { errors }, setError, clearErrors } = useForm({
        resolver: yupResolver(resetSchema),
        defaultValues: {
            password: '',
            confirm_password: ''
        },
    });

    const clearAllErrors = () => {
        clearErrors();
    };
    return (
        <div className='reset-password-page tw-flex md:tw-mt-0 tw-pr-4'>
            <LeftBanner />
            <div className='right-section tw-w-1/2 tw-p-4'>
                <div className='tw-flex tw-justify-end md:tw-w-full md:tw-ml-6 tw-mt-4 tw-mb-8'>
                    <img className='tw-h-14 tw-w-[102px] md:tw-mr-14' src={'/logo.png'} alt='' />
                </div>
                {!isPassWordReset && <div className='reset-before-section  tw-flex tw-items-center tw-justify-center tw-p-4'>
                    <form onSubmit={handleSubmit(confirmPasswordAndLogin)}>
                        <h1 className='section-heading !tw-text-[32px] tw-mb-1'>Create New password</h1>
                        <p className='tw-text-[#656C7B] tw-font-normal fs14 tw-w-[90%]'>Your new password must be different from previous used passwords </p>
                        <div className='input-section'>
                            <div className='tw-mt-4'>
                                <label htmlFor='fs14 tw-text-[#110D3F]'>Password</label>
                            </div>
                            <div className='tw-mt-2'>
                                <OutlinedInput
                                    className='reset-input'
                                    {...register("password")}
                                    id="outlined-password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password (Must be at least 8 characters)"
                                    endAdornment={
                                        <InputAdornment position="end" sx={{ marginRight: 2 }}>
                                            <span style={{ cursor: 'pointer' }} onClick={() => { setShowPassword(!showPassword) }}>
                                                {showPassword ? "Hide" : "Show"}
                                            </span>
                                        </InputAdornment>
                                    }
                                    onBlur={clearAllErrors}
                                    autoComplete="current-password"
                                />
                                <p className="validation-msg">
                                    {errors?.password?.message}
                                </p>
                            </div>
                            <div className='tw-mt-6'>
                                <label htmlFor='fs14 tw-text-[#110D3F]'>Confirm Password</label>
                            </div>
                            <div className='tw-mt-2'>
                                <OutlinedInput
                                    className='reset-input'
                                    {...register("confirm_password")}
                                    id="outlined-password-input-confirm"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Both passwords must match"
                                    endAdornment={
                                        <InputAdornment position="end" sx={{ marginRight: 2 }}>
                                            <span style={{ cursor: 'pointer' }} onClick={() => { setShowConfirmPassword(!showConfirmPassword) }}>
                                                {showConfirmPassword ? "Hide" : "Show"}
                                            </span>
                                        </InputAdornment>
                                    }
                                    onBlur={clearAllErrors}
                                    autoComplete="confirm_password"
                                />
                                <p className="validation-msg">
                                    {errors?.confirm_password?.message}
                                </p>

                                <button className='reset-btn tw-flex tw-items-center tw-justify-center tw-cursor-pointer tw-mt-6 tw-w-full'> Reset Password</button>
                            </div>
                        </div>
                    </form>



                </div>}

                {isPassWordReset && <div className='reset-after-section tw-flex tw-items-center tw-justify-center tw-flex-col'>
                    <img className='success-img tw-mb-8' src="https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/Group+6944.png" alt='success' />
                    <h1 className='reset-password-h1 tw-mt' >Success</h1>
                    <p className='reset-password-p'>Your password has been reset successfully</p>
                    <button onClick={() => {
                        navigate("/login")
                    }} className='btn btn--black tw-flex tw-items-center tw-justify-center tw-w-full tw-cursor-pointer tw-mt-7 '> Login</button>
                </div>
                }
            </div>
        </div >
    );
}

export default ResetPassword;