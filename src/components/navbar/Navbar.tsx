import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import "./Navbar.scss";
import { Box, ClickAwayListener } from '@mui/material';
// import { logout } from '@Src/features/global/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import FaqSideBar from '@Components/faq-sidebar/FaqSideBar';
import BookingDetailsSidebar from '@Components/booking-details-sidebar/BookingDetailsSidebar';
import LogoutIcon from '@mui/icons-material/Logout';
import { getDataFromLocalStorage, removeDataFromLocalStorage } from '@Src/utils/globalUtilities';
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';
import { logout } from '@Src/features/auth/authSlice';
import { AppRouteURls } from '@Constants/app-route-urls';

const Navbar = () => {
	const [isFaqSidebar, setIsFaqSidebar] = useState(false);
	const [isBookingDetailSidebar, setIsBookingDetailSidebar] = useState(false);
	const [currentPath, setCurrentURLPath] = useState('');

	const navigate = useNavigate()
	const dispatchLogout = useAppDispatch()
	const userDetails: any = JSON.parse(getDataFromLocalStorage('user_details') || "{}")

	const logoutHandler = () => {
		removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY);
		removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS);
		removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_TOKEN);
		dispatchLogout(logout());
		navigate(`/${AppRouteURls.LOG_IN}`);
	}

	const location = useLocation();
	const URLPath = location.pathname;

	const setCurrentURLPathHandler = () => {
		setCurrentURLPath(URLPath);
	};

	useEffect(() => {
		setCurrentURLPathHandler();
	}, [URLPath]);

	return (
		<div className='tw-hidden md:tw-block navbar'>
			<div className='nav-content'>
				<div className='tw-flex tw-justify-between tw-items-center'>
					<div className='tw-flex tw-items-start left-section'>
						<img className='navbar-img' src="/logo.png?w=540" alt="" />
						<ul className='nav-list'>
							{/* <NavLink to={`/sessions/0`} className={`nav-list__item`}>
								<li>Dashboard</li>
							</NavLink> */}
						</ul>
					</div>
					<div className='tw-flex tw-items-start tw-items-center tw-gap-4 right-section'>
						<div className='tw-flex tw-items-center tw-gap-8'>
							{URLPath.includes('my-home') && (
								<button onClick={logoutHandler} className='bg-white-btn-util'>
									Log Out
								</button>
							)}
							{URLPath.includes('my-application-form') && (
								<>
									<button onClick={() => { setIsFaqSidebar(true) }} className='tw-cursor-pointer tw-font-bold fs14 text-pri-all'>
										FAQ
									</button>
									<button onClick={() => { setIsBookingDetailSidebar(true) }} className='bg-white-btn-util'>
										Booking Details
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			{
				isFaqSidebar && <FaqSideBar isFaqSidebar={isFaqSidebar} setIsFaqSidebar={setIsFaqSidebar} />
			}
			{
				isBookingDetailSidebar && <BookingDetailsSidebar isBookingDetailSidebar={isBookingDetailSidebar} setIsBookingDetailSidebar={setIsBookingDetailSidebar} />
			}
		</div>
	);
};

export default Navbar;




