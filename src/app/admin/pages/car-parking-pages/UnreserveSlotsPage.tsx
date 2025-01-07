import React, { useState , useEffect } from 'react';
import { toast } from "react-toastify";
import Api from '@App/admin/api/Api';
import userSessionInfo from "../../util/userSessionInfo";
import SlotBookingPopup from '../../components/car-parking/SlotBookingPopup';


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
}

interface ParkingSlot {
    car_parking_code: string;
    car_parking_slot_number: string;
    parking_slot_status: string;
    location_desc: string;
    full_name: string;
    unit_no: string;
    customer_number:string
}

type SlotStatus = 'booked_by_customer' | 'available' | 'reserved';

interface UnreservedSlotsPageProps {
    parkingSlots: ParkingSlot[];
    parkingLocation: ParkingLocation;
    onBack: () => void;
}

interface SelectedSlot {
    car_parking_slot_number: string;
    car_parking_code: string;
}
const UnreservedSlotsPage: React.FC<UnreservedSlotsPageProps> = ({ parkingSlots, parkingLocation, onBack }) => {
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [isConfirmUnreserve, setIsConfirmUnreserve] = useState<boolean>(false);
    const [parkingSlotsData,setParkingSlotsData] = useState(parkingSlots);
    


    const getSlots = async ()=>{
        const { data, status: responseStatus, message }: any = await Api.get("crm_get_parking_slots", {
            project_id: parkingLocation?.project_id,
            tower_id: parkingLocation?.tower_id,
            parking_location_code:parkingLocation.parking_location_code
        });
        setParkingSlotsData(data);
    }

    useEffect(()=>{
        getSlots()
    },[])

    const updateSlotStatus = async (slots: {
        project_code: string;
        tower_code: string;
        location_code: string;
        car_parking_slot_number: string;
        car_parking_code: string;
        cust_unit_id: string;
        booked_by: string | null;
        booked_date: string | null;
        cancelled_by: string | null;
        cancelled_date: string | null;
        cancelled_reason: string | null;
        last_modified_by: string;
        last_modified_at: string;
        parking_slot_status: SlotStatus;
    }[]) => {
        try {
            const response = await Api.post("crm_get_parking_update", { 
                parking_slots: slots
            });
            
            if (response.status) {
                console.log(`Successfully updated slots`);
                return true;
            } else {
                console.error(`Failed to update slots: ${response.message}`);
                return false;
            }
        } catch (error) {
            console.error(`Error updating slots:`, error);
            return false;
        }
    };

    const handleSlots = (parkingCode: string) => {
        const slot = parkingSlotsData?.find(slot => slot.car_parking_code === parkingCode);
        if (!slot) return;

        const status = slot.parking_slot_status as SlotStatus;
        if (status === 'reserved') {
            setSelectedSlots(prev => 
                prev.includes(parkingCode) 
                    ? prev.filter(code => code !== parkingCode) 
                    : [...prev, parkingCode]
            );
        }
    }

    const onConfirmUnreserve = async () => {
        if (selectedSlots.length === 0) return;

        const currentDate = new Date().toISOString().split('T')[0]; 
        const userInfo = userSessionInfo.logUserInfo();
        console.log(userInfo);

        const slotsToUpdate = selectedSlots.map(slotCode => {
            const slot = parkingSlotsData?.find(s => s.car_parking_code === slotCode);
            return {
                project_code: parkingLocation.project_code,
                tower_code: parkingLocation.tower_code,
                location_code: parkingLocation.parking_location_code,
                car_parking_slot_number: slot?.car_parking_slot_number || '',
                car_parking_code: slotCode,
                cust_unit_id: userInfo.custUnitId, 
                booked_by: null,
                booked_date: null,
                cancelled_by: userInfo.userId,
                cancelled_date: currentDate,
                cancelled_reason: 'Unreserved by user',
                last_modified_by: userInfo.userId,
                last_modified_at: currentDate,
                parking_slot_status: 'available' as SlotStatus
            };
        });

        const success = await updateSlotStatus(slotsToUpdate);

        if (success) {
            toast.success("Slots unreserved successfully!");
            const { data, status: responseStatus, message }: any = await Api.get("crm_get_parking_slots", {
                project_id: parkingLocation?.project_id,
                tower_id: parkingLocation?.tower_id,
                parking_location_code:parkingLocation.parking_location_code
            });
            setParkingSlotsData(data);
            setSelectedSlots([]);
            setIsConfirmUnreserve(false);
        } else {
            toast.error("Failed to unreserve slots. Please try again.");
        }
    };

    // const getSelectedSlotNumbers = () => {
    //     return selectedSlots.map(slotCode => {
    //         const slot = parkingSlots.find(slot => slot.car_parking_code === slotCode);
    //         return slot ? slot.car_parking_slot_number : slotCode;
    //     });
    // }

    const getSelectedSlotNumbers = (): SelectedSlot[] => {
        return selectedSlots.map(slotCode => {
            const slot = parkingSlotsData?.find(slot => slot.car_parking_code === slotCode);
            return {
                car_parking_slot_number: slot ? slot.car_parking_slot_number : slotCode, // If found, use the slot number, otherwise fallback to slotCode
                car_parking_code: slotCode // Use the slotCode as the parking code
            };
        });
    };
    

    const renderParkingSlots = () => {
        if (!parkingSlotsData || parkingSlotsData?.length === 0) {
            return <p>No parking slots available for this location.</p>;
        }

        const sortedSlots = [...parkingSlotsData].sort((a, b) => 
            a.car_parking_code.localeCompare(b.car_parking_code)
        );

        return sortedSlots.map((slot, index) => {
            if (!slot || typeof slot !== 'object') {
                console.error(`Invalid slot data at index ${index}:`, slot);
                return null;
            }

            const status = slot.parking_slot_status as SlotStatus;
            const isSelected = selectedSlots.includes(slot.car_parking_code);
            
            return (
                <button
                    key={slot.car_parking_code || `slot-${index}`}
                    onClick={() => handleSlots(slot.car_parking_code)}
                    className={`slot-button ${
                        isSelected
                            ? 'red-slots color-red-white'
                            : status === 'reserved'
                                ? 'red-slots color-red-white'
                                : status === 'booked_by_customer'
                                    ? 'orange-slots color-orange-white'
                                    : 'green-slots color-green-white'
                    }`}
                    title={`${slot.location_desc || ''} - ${slot.car_parking_slot_number || ''}`}
                >
                    {slot.car_parking_slot_number || `Slot ${index + 1}`}
                </button>
            );
        }).filter(Boolean);
    }

    return (
                    <div className=''>
                        <div className='tw-my-4 tw-flex tw-justify-end tw-gap-8'>
                            <div className='tw-flex tw-items-center tw-gap-2'>
                                <div className="green circle"></div>
                                <div className='fs14'>Available</div>
                            </div>
                            <div className='tw-flex tw-items-center tw-gap-2'>
                                <div className="orange circle"></div>
                                <div className='fs14'>Booked</div>
                            </div>
                            <div className='tw-flex tw-items-center tw-gap-2'>
                                <div className="red circle"></div>
                                <div className='fs14'>Reserved</div>
                            </div>
                        </div>
                        <div className="section-container lg:tw-p-4">
                            <p className='text-pri-all tw-mb-4'>Total slots: {parkingLocation.total_slots}</p>
                            <p className='text-pri-all tw-mb-4'>Selected slots: {selectedSlots.length}</p>
                            <div className='tw-flex tw-gap-2 tw-flex-wrap'>
                                {renderParkingSlots()}
                            </div>
                        </div>
                    
            {isConfirmUnreserve && (
                <SlotBookingPopup 
                    selectedSlots={getSelectedSlotNumbers()} 
                    onConfirm={onConfirmUnreserve} 
                    onCancel={() => setIsConfirmUnreserve(false)} 
                    isUnreserving={true}
                    projectName={parkingLocation.project_name}
                    towerName={parkingLocation.tower_name}
                    parkingLocationName={parkingLocation.parking_location_name}
                />
            )}
            <div className="tw-mt-4 tw-flex tw-justify-between">
                {selectedSlots.length > 0 && (
                    <button 
                        onClick={() => setIsConfirmUnreserve(true)} 
                        className="tw-bg-red-500 tw-text-white tw-py-2 tw-px-4 tw-rounded"
                    >
                        Unreserve Selected Slots
                    </button>
                )}
            </div>
        </div>
    );
};

export default UnreservedSlotsPage;