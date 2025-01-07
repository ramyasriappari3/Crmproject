import { useContext, useEffect, useState } from 'react';
import "./LoginPage.scss";
import { FormControl, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import LeftBanner from '@Components/left-banner/LeftBanner';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '@Src/app/hooks';
import { useForm } from 'react-hook-form';
import { getDataFromLocalStorage, setDataOnLocalStorage } from '@Src/utils/globalUtilities';
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';
import { AppRouteURls } from '@Constants/app-route-urls';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { loginWithPasswordAction } from '@Src/features/auth/authSlice';
import { MyContext } from '@Src/Context/RefreshPage/Refresh';
import userSessionInfo from '@Src/app/admin/util/userSessionInfo';

const loginValidationSchema = yup.object().shape({
    pan_card: yup.string().required('UserID is required'),
    password: yup.string().required('Password is Required'),
    user_type_id: yup.string().required().default('customer')
})

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, touchedFields, isSubmitted }, getFieldState, setError } = useForm<{ pan_card: string, password: string, user_type_id: string }>({ resolver: yupResolver(loginValidationSchema) })
    const [showPassword, setShowPassword] = useState(false);
    let user_details = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS);
    const { userApplicationStatus } = useContext(MyContext);


    useEffect(() => {
        if (getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY) && userApplicationStatus === 'Approved') {
            navigate(`${AppRouteURls.DASHBOARD}`);
        }
        else {
            navigate(`/${AppRouteURls.LOG_IN}`);
        }
    }, [])

    const realStateProcess = (res: IAPIResponse) => {
        const { email, cust_profile_id, pan_card, user_type_id, login_user_id, session, sessionDetails } = res.data;
        const { token } = sessionDetails;
        setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY, res.data?.session);
        setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS, JSON.stringify(res.data));
        setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.TOKEN_INFO, JSON.stringify({ "key": res.data?.session, "access_token": "", "refresh_token": "" }));
        // dispatch(setUserData({ isLoggedIn: true, user: { pan_card, userId } }));
        navigate(`/${AppRouteURls.MY_HOME}`);
    }

    const onUserLoginWithPassword = (formValue: { pan_card: string, password: string, user_type_id: string }) => {
        userSessionInfo.getClearSessionData();
        const updatedFormValue = {
            ...formValue,
            pan_card: formValue?.pan_card?.toUpperCase()
        };
        dispatch(
            loginWithPasswordAction(updatedFormValue)
        ).unwrap()
            .then((res) => {
                if (res.success) {
                    realStateProcess(res);
                }
            }).catch((err) => {
                if (err.message == undefined) {
                    let errorMessage = err?.errors[0]?.message;
                    setError('password', { type: 'custom', message: errorMessage })
                }
                else {
                    setError('password', { type: 'custom', message: "Invalid Credentials" })
                }
            })
    }


    return (
        <div className='tw-flex tw-overflow-y-hidden'>
            <LeftBanner />
            <div className='tw-min-h-[100vh] tw-w-full tw-bg-white tw-flex tw-flex-col tw-gap-4 tw-p-6'>
                <div className='tw-flex md:tw-justify-end tw-mr-10 tw-mt-4'>
                    <img className='tw-w-24' src={'/logo.png'} alt='' />
                </div>
                <div className='form-container md:tw-px-[18%]'>
                    <div className='section-heading'>Welcome </div>
                    <div className='tw-font-normal tw-mb-8 text-pri-blue-65 tw-text-sm'>Please enter your login details</div>
                    <div>
                        <form onSubmit={handleSubmit(onUserLoginWithPassword)}>
                            <div className='tw-mb-8'>
                                <div>
                                    <FormControl sx={{ width: '100%' }}>
                                        <label className='text-pri-blue-75 tw-font-normal tw-mb-2 tw-text-sm'>Login User ID</label>
                                        <OutlinedInput {...register("pan_card")} inputProps={{ style: { fontFamily: '14px' } }} placeholder="User ID" className='tw-font-semibold tw-text-sm tw-w-full' />
                                        <p className='validation-msg'>
                                            {(getFieldState('pan_card')?.isTouched || isSubmitted) && getFieldState('pan_card')?.error?.message}
                                        </p>
                                    </FormControl>
                                </div>
                            </div>
                            <div className='tw-mb-8'>
                                <div>
                                    <FormControl sx={{ width: '100%' }}>
                                        <label className='text-pri-blue-75 tw-font-normal tw-mb-2 tw-text-sm'>Password</label>
                                        <OutlinedInput {...register('password')}
                                            inputProps={{ style: { fontFamily: '14px' } }}
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => { setShowPassword(!showPassword) }}
                                                        edge="end"
                                                        className='!tw-mr-4'
                                                    >
                                                        {showPassword ? <img src="/images/eye.svg" alt="show password" /> : <img src="/images/eye-off.svg" alt="hide password" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="Password" className='tw-font-semibold tw-text-sm tw-w-full' />
                                        <p className='validation-msg'>
                                            {(getFieldState('password')?.isTouched || isSubmitted) && getFieldState('password')?.error?.message}
                                        </p>
                                    </FormControl>
                                </div>
                            </div>

                            <div className='tw-flex tw-justify-end'>
                                <Link to={'/forget-password'} className='tw-text-sm tw-mb-8 text-pri-all tw-cursor-pointer'>Forgot Password</Link>
                            </div>
                            <button type="submit" className='tw-rounded-lg tw-text-white tw-bg-[#241F20] tw-px-3 tw-py-3 tw-flex tw-items-center tw-justify-center tw-w-full'>
                                Sign in
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
