import React, { useEffect, useState } from 'react';
import "./BasementsPage.scss";
import BasementSelectedPopup from '@Components/basement-selected-popup/BasementSelectedPopup';
import CarParkingBookingPage from '../car-parking-booking-page/CarParkingBookingPage';
import CarParkingSuccessPage from '../car-parking-success/CarParkingSuccessPage';
import ProgressBar from '@ramonak/react-progress-bar';
import { triggerSaveAndExitEvent } from '@Src/features/global/globalSlice';
import { useAppDispatch } from '@Src/app/hooks';
import { useParams } from 'react-router-dom';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
export interface slots {
	parking_no: number
	parking_id: number
	basement_level_id: number
	basement: string
	is_booked: number
}
const BasementsPage = () => {
	const [selectedBasementIndex, setSelectedBasementIndex] = useState(null);
	const [activeTab, setActiveTab] = useState('');
	const [basementArray, setBasementArray] = useState<any[]>([]);
	const [basementFirst, setBasementFirst] = useState<slots[]>();
	const [basementSecond, setBasementSecond] = useState<slots[]>();
	const dispatch = useAppDispatch();
	const basement = [
		{
			id: 1,
			name: "Basement 1"
		},
		{
			id: 2,
			name: "Basement 2"
		}
	]

	const handleTabClick = (tab: any) => {
		setActiveTab(tab);
	};

	let { unitId, optionId } = useParams();

	const getParkingSlots = async () => {
		let response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.GET_PARKING_SLOTS}?unit_id=${unitId}&option_id=${optionId}`).GET();
		if (response.success) {
			const basementParking: any = {};
			response?.data.forEach((parking: any) => {
				const basement = parking.basement;
				if (!basementParking[basement]) {
					basementParking[basement] = [];
				}
				basementParking[basement].push(parking);
			});

			// Convert the object into an array of arrays
			const basementArrayData: any = Object.values(basementParking);
			const basementArray: any = basementArrayData.sort((a: any, b: any) => {
				const basementA = a[0]?.basement.toUpperCase();
				const basementB = b[0]?.basement.toUpperCase();
				if (basementA < basementB) {
					return -1;
				}
				if (basementA > basementB) {
					return 1;
				}
				return 0;
			});
			setBasementArray(basementArray)
			setBasementFirst(basementArray[0]);
			setBasementSecond(basementArray[1]);
			setActiveTab(`${basementArray[0][0]?.basement}`);
			////console.log(basementArray);
		}
	}
	useEffect(() => {
		getParkingSlots();
	}, [])




	return (
		<div>
			<div className='basements-slot-page tw-mt-4'>
				<div className='left-section-tabs tw-w-1/4'>
					<div className='left-sidebar tw-mt-4 tw-w-1/4'>
						{basementArray.map((basement, index) => (
							<div key={index} className='tw-mt-1'>
								<div className='tw-flex tw-gap-2 tw-mb-1'>
									<div className=''>
										<div className="greencircle">{index + 1}</div>
									</div>
									<div onClick={() => handleTabClick(basement[0]?.basement)} className='tabs tw-p-1'>
										<p
											className={`fs14 tw-cursor-pointer ${activeTab === basement[0]?.basement ? 'text-pri-all tw-font-bold' : ''}`}
										>{basement[0]?.basement}</p>
									</div>
								</div>
								{index < basementArray.length - 1 && <div className='greenline'></div>}
							</div>
						))}
						<div className='tw-mt-2'>
							<p className='fs14 tw-font-bold text-pri-all'>Need Help?</p>
							<p className='fs13 cols'>support@myhomeconstructions.com</p>
							<p className='fs13 cols'>Visit FAQ</p>
						</div>
					</div>
				</div>
				<div>
					{basementArray.map((basement, index) => (
						activeTab === basement[0]?.basement && (
							<div key={index} className=''>
								<CarParkingBookingPage
									basement={basement}
									basementArray={basementArray}
									onActiveTab={handleTabClick}
									index={index}
									unitId={unitId}
									optionId={optionId}
								/>
							</div>
						)
					))}
					{activeTab === 'BasementSuccess' && (
						<div className=''>
							{/* <CarParkingSuccessPage /> */}
						</div>
					)}
				</div>



			</div>
			<div className='application-footer tw-w-full'>
				{/* <ProgressBar
					completed={40}
					bgColor='#3C4049'
					isLabelVisible={false}
					height='3px'
				/> */}
				<div className='tw-flex tw-gap-6 tw-py-3 tw-justify-end tw-pr-8'>
					<button
						type="submit"
						onClick={() => { dispatch(triggerSaveAndExitEvent({ payload: true })) }}
						className='btn btn--black tw-cursor-pointer'
					>Continue</button>
				</div>
			</div>
		</div>
	);
};

export default BasementsPage;