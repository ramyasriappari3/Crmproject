import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./SlotSelectionPage.scss";
import userSessionInfo from "../../util/userSessionInfo";
import ReservedSlotsPage from './ReserveSlotsPage';
import UnreservedSlotsPage from './UnreserveSlotsPage';
import BasementSelectedPopup from '@Src/app/admin/components/car-parking/BasementSelectedPopup';
import Api from '@App/admin/api/Api';

interface ParkingLocation {
    project_name: string;
    project_code: string;
    project_id: string;
    tower_id: string;
    tower_code: string;
    tower_name: string;
    parking_location_code: string;
    parking_location_name: string;
    total_slots: string;
    location_url: string;
}

interface ParkingSlot {
    car_parking_code: string;
    car_parking_slot_number: string;
    parking_slot_status: string;
    location_desc: string;
    full_name: string;
    unit_no: string;
    customer_number: string;
}

interface SlotSelectionPageProps {
    onActiveTab: () => void;
    index: number;
    parkingLocation: ParkingLocation;
    parkingSlots: ParkingSlot[];
    location_url: string;
}

type SlotStatus = 'booked_by_customer' | 'available' | 'reserved';
const userInfo = userSessionInfo.logUserInfo();

const SlotSelectionPage: React.FC<SlotSelectionPageProps> = (props) => {
    const location = useLocation();
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [isImgPopUp, setIsImgPopUp] = useState<boolean>(false);
    const [parkingSlotsData,setParkingSlotsData] = useState(props?.parkingSlots);

    const renderActionContent = () => {
        switch (selectedAction) {
            case 'reserve':
                return (
                    <ReservedSlotsPage 
                        parkingSlots={parkingSlotsData} 
                        parkingLocation={props.parkingLocation} 
                        onBack={() => setSelectedAction('')}
                    />
                );
            case 'unreserve':
                return (
                    <UnreservedSlotsPage 
                        parkingSlots={parkingSlotsData} 
                        parkingLocation={props.parkingLocation} 
                        onBack={() => setSelectedAction('')} 
                    />
                );
            default:
                return null;
        }
    };

    const handleActionChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAction(event.target.value);
        const { data, status: responseStatus, message }: any = await Api.get("crm_get_parking_slots", {
            project_id: props.parkingLocation?.project_id,
            tower_id: props.parkingLocation?.tower_id,
            parking_location_code:props.parkingLocation.parking_location_code
        });
        setParkingSlotsData(data);
    };

    return (
        <div className='car-parking-booking-page tw-flex'>
            <div className={`${userInfo.user_type_id === 'internal' ? 'tw-w-3/4' : 'tw-w-full'}`}>
                <div className='tw-flex tw-justify-between tw-items-center tw-mt-6'>
                    {/* Added margin-top for spacing above the button */}
                    <div className="tw-mb-4">
                        <button 
                            onClick={props.onActiveTab} 
                            className="tw-bg-blue-500 tw-text-white tw-py-2 tw-px-4 tw-rounded"
                        >
                            Back to Selection
                        </button>
                    </div>
                    {/* Conditionally render the dropdown based on user type */}
                    {userInfo.user_type_id !== "internal" && (
                        <div className="tw-mb-4"> {/* Added margin-top for spacing above the dropdown */}
                            <select 
                                value={selectedAction}
                                onChange={handleActionChange}
                                className="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-48 tw-p-2.5"
                            >
                                <option value="">Select an action</option>
                                <option value="reserve">Reserve Slots</option>
                                <option value="unreserve">Unreserve Slots</option>
                            </select>
                        </div>
                    )}
                </div>
                <div className='right-section'>
                    <div className="section-container lg:tw-p-4">
                        <p className='text-pri-all tw-text-2xl tw-font-bold'>{props?.parkingLocation.project_name}</p>
                        <p className='text-pri-all tw-font-bold'>
                            Select your parking slot for {props?.parkingLocation?.project_name}, {props?.parkingLocation?.tower_name}, {props?.parkingLocation?.parking_location_name}
                        </p>
                        <p className='fs14'>The parking slot grid provided below is for slot selection purposes only. Please review the parking floor plan to understand the actual layout before finalising your parking slot.</p>
                        <div className=''>
                            <p className='text-pri-all tw-font-semibold tw-my-4'>Floor Plan</p>
                            <div onClick={() => setIsImgPopUp(true)} className="img-section tw-cursor-pointer">
                                <img src={props?.parkingLocation.location_url} alt="Basement Floor Plan" />
                            </div>
                        </div>
                        {renderActionContent()}
                    </div>
            
                    {isImgPopUp && (
                        <BasementSelectedPopup 
                            isImgPopUp={isImgPopUp} 
                            setIsImgPopUp={setIsImgPopUp}
                            location_url={props?.parkingLocation.location_url}
                            parkingLocation={props?.parkingLocation}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlotSelectionPage;