import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import './App.scss';
import Loader from '@Components/loader/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthGuardRoute from './guards/AuthGaurdRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getDataFromLocalStorage } from './utils/globalUtilities';
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';
import { AppRouteURls } from '@Constants/app-route-urls';
import { setUserData } from './features/auth/authSlice';
import { RoutersList } from './app/admin/route/RoutersList';
import DycRouteSettingConfig from './app/admin/route/DycRouteSettingConfig';
import ForgetPasswordPage from '@Pages/forget-password/ForgetPasswordPage';
import ResetPassword from '@Pages/reset-password/ResetPassword';
import { IAPIResponse } from './types/api-response-interface';
import { MODULES_API_MAP, httpService } from './services/httpService';
import { GLOBAL_API_ROUTES } from './services/globalApiRoutes';
import { MyContextProvider } from './Context/RefreshPage/Refresh';
import TestPDF from '@Components/react-pdf/TestPDF';

const Layout = React.lazy(() => import("@Components/layout/Layout"));
const LoginPage = React.lazy(() => import("@Pages/login/LoginPage"));

function App() {
	const location = useLocation();

	const dispatch = useAppDispatch();
	const globalState = useAppSelector((state: any) => state.global);
	const navigate = useNavigate();
	// const getMyPropertyData = async () => {
	// 	const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.CUSTOMER_UNITS}`).GET();
	// 	if (!apiResponse?.success) {
	// 		navigate('/login');
	// 	}
	// }
	useEffect(() => {
		if (!location.pathname.includes("crm")) {
			//getMyPropertyData();
		}
	}, [])

	useEffect(() => {
		let user_details = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS);

		if (user_details) {
			let parsed_data = JSON.parse(user_details);
			if (parsed_data) {
				dispatch(setUserData({ isLoggedIn: true, user: { ...parsed_data } }));
			}
		}

	}, [])


	const ResolveRoutes = () => {
		if (RoutersList) {
			return RoutersList.map((routes: any, i) => {
				return <React.Suspense fallback={<Loader />} key={"route_" + i}>
					<div className='-tw-ml-3'>
						<DycRouteSettingConfig key={i}
							routeLayout={routes.RouteLayout}
							protectRoute={routes.ProtectRoute}
							routeList={routes.RouteList}
							index={i}
						/>
					</div>
				</React.Suspense>
			});
		}
	}

	return (
		<>
			{/* {globalState.loading ? <Loader /> : null} */}
			{location.pathname.includes("crm") ?

				ResolveRoutes()

				: <Routes>
					<Route
						path={`/${AppRouteURls.LOG_IN}`} element={
							<React.Suspense fallback={<Loader />}>
								<LoginPage />
							</React.Suspense>
						}
					/>
					{/* <Route
						path={'/'} element={
							<Navigate to={'/login'} />
						}
					/> */}

					<Route
						path={AppRouteURls.FORGET_PASSWORD}
						element={
							<ForgetPasswordPage />
						}
					/>
					<Route
						path={AppRouteURls.RESET_PASSWORD}
						element={
							<ResetPassword />
						}
					/>
					<Route
						path={AppRouteURls.TEST}
						element={
							<TestPDF />
						}
					/>

					<Route path='/*' element={
						<React.Suspense fallback={<Loader />}>
							<MyContextProvider>
								<AuthGuardRoute>
									<Layout />
								</AuthGuardRoute>
							</MyContextProvider>
						</React.Suspense>
					} />
				</Routes>
			}

			<div>
				<ToastContainer
					position="top-right"
					autoClose={600}
					hideProgressBar={true}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					limit={2}
					toastClassName={'theme-toast'}
				/>
			</div>

		</>
	);
}

export default App;
