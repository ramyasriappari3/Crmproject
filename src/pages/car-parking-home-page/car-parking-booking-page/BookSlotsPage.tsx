import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Api from '@App/admin/api/Api';
import userSessionInfo from '@App/admin/util/userSessionInfo';
import BasementSelectedPopup from '@App/admin/components/car-parking/BasementSelectedPopup';
import "./BookSlotsPage.scss";
import VerticalStepper from './VerticalStepper';
import CarParkingSuccessPage from '../car-parking-success/CarParkingSuccessPage';
import SlotBookingPopup from '@Src/app/admin/components/car-parking/SlotBookingPopup';

interface SelectedSlot {
    car_parking_slot_number: string;
    car_parking_code: string;
    location_code?: string;
}

const BookSlotsPageComponent: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { parkingSlots: initialParkingSlots, parkingLocation, selectedParkingOption, location_url } = location.state || {};
    const userInfo = userSessionInfo.logUserInfo();
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const [selectedSlotsState, setSelectedSlotsState] = useState<SelectedSlot[]>([]);
    const [successData, setSuccessData] = useState<any>(null);
    const [allSelectedSlots, setAllSelectedSlots] = useState<any[]>([]);
    const [isImgPopUp, setIsImgPopUp] = useState<boolean>(false);
    const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
    const [basementKey, setBasementKey] = useState<string>(initialParkingSlots[0]?.location_code || '');
    const [selectedSlotsByBasement, setSelectedSlotsByBasement] = useState<{ [key: string]: SelectedSlot[] }>({});
    const [parkingSlots, setParkingSlots] = useState<any[]>(initialParkingSlots || []);
    const [locationUrl, setLocationUrl] = useState<string>(location_url);
    const [parkingLocationName, setParkingLocationName] = useState<string>(parkingLocation.parking_location_name);

    useEffect(() => {
        const currentLocationKey = Object.keys(selectedParkingOption?.locations)[currentLocationIndex];
        if (currentLocationKey) {
            setBasementKey(currentLocationKey);
            fetchNextParkingSlots(currentLocationKey); // Fetch slots for the current location
        }
    }, [currentLocationIndex, selectedParkingOption]);

    const [steps, setSteps] = useState<any>([]);

    const generateTitleFromKey = (key: string): string => {
        const numberPart = key.replace('ZB', ''); // Remove 'ZB' prefix
        return `Basement ${numberPart}`; // Return formatted title
    };
    
    useEffect(() => {

        const curr = Object.keys(selectedParkingOption?.locations);

        setSteps(curr.map((option: any, index: any) => (
            {
                title: generateTitleFromKey(option), // Use the generateTitleFromKey function
                isActive: index == 0 ? true : false,
                isCompleted: false,
                selectedSlots: [],
                location_code: option
            }
        )))
    }, [])

    useEffect(() => {
        if (parkingSlots && steps.length > 0) {
            (setSteps(steps.map((step: any) => step.location_code === parkingSlots[0].location_code ? ({
                ...step,
                isActive: true,
            }) : step)))
        }
    }, [parkingSlots])

    const onConfirm = async (selectedSlots: SelectedSlot[]) => {
        // if (selectedSlots.length === 0) return;
        const currentBasementKey = parkingSlots[0].location_code;
        // Add the selected slots to the allSelectedSlots state
        const newSelectedSlots = selectedSlots.map(slot => ({
            car_parking_slot_number: slot.car_parking_slot_number,
            car_parking_code: slot.car_parking_code,
            location_code: parkingSlots[0].location_code,
        }));

        setSteps(steps.map((step: any) => step.location_code === parkingSlots[0].location_code ? {
            ...step,
            isActive: true,
            isCompleted: true,
            selectedSlots: [...newSelectedSlots]
        } : step))

        setSelectedSlotsByBasement(prev => ({
            ...prev,
            [currentBasementKey]: selectedSlots.map(slot => ({
                car_parking_slot_number: slot.car_parking_slot_number,
                car_parking_code: slot.car_parking_code,
                location_code: currentBasementKey,
            })),
        }));

        setAllSelectedSlots(prev => [...prev, ...newSelectedSlots]);
        
        // Clear selected slots for the next location
        setSelectedSlotsState([]);
        
        setIsConfirm(false); // Close the confirmation popup

        const locationsLength = Object.keys(selectedParkingOption?.locations).length;
        if (currentLocationIndex + 1 < locationsLength) {
            // Increment the current location index
            setCurrentLocationIndex(prevIndex => {
                const newIndex = prevIndex + 1; // Calculate the new index
                
                return newIndex; // Return the new index
            });

            // Use the new index directly to get the next location key
            const nextLocationKey = Object.keys(selectedParkingOption?.locations)[currentLocationIndex + 1]; // Use currentLocationIndex + 1
            setBasementKey(nextLocationKey);
            await fetchNextParkingSlots(nextLocationKey);
        } else {
            // If all locations are completed, update the slots
            const allSelectedSlots: SelectedSlot[] = Object.values(selectedSlotsByBasement).flat();

            setAllSelectedSlots(allSelectedSlots);
            // Check if allSelectedSlots is populated correctly
            // Call the update API
            const success = await updateSlots(allSelectedSlots); // Pass the latest state to updateSlots
            if (success) {
                toast.success("All slots reserved successfully!");
                const dataToPass = {
                    allSelectedSlots,
                    parkingLocation: {
                        project_name: parkingLocation.project_name,
                        tower_name: parkingLocation.tower_name,
                        tower_id: parkingLocation.tower_id,
                        parking_location_name: parkingLocation.parking_location_name,
                        project_id: parkingLocation.project_id,
                        floor_no: parkingLocation.floor_no,
                        unit_no: parkingLocation.unit_no,
                        cust_unit_id: parkingLocation.cust_unit_id,
                        project_address: parkingLocation.project_address,
                        project_city: parkingLocation.project_city,
                        project_state: parkingLocation.project_state
                    },
                    selectedParkingOption: selectedParkingOption
                };

                setSuccessData(dataToPass);
            } else {
                toast.error("Failed to reserve slots. Please try again.");
            }
        }
    };

    const fetchNextParkingSlots = async (locationCode: string) => {
        try {
            const slotsResponse = await Api.get("crm_get_parking_slots", {
                project_id: parkingLocation.project_id,
                tower_id: parkingLocation.tower_id,
                parking_location_code: locationCode,
            });

            if (!slotsResponse.status) {
                toast.error("Failed to fetch parking slots: " + slotsResponse.message);
                return;
            }

            const locationResponse = await Api.get("crm_get_parking_location_list", {
                project_id: parkingLocation.project_id,
                tower_id: parkingLocation.tower_id,
            });

            if (!locationResponse.status) {
                toast.error("Failed to fetch parking locations: " + locationResponse.message);
                return;
            }

            const parkingLocations = locationResponse.data;
            const selectedParkingLocation = parkingLocations.find((location: { parking_location_code: string; }) => location.parking_location_code === locationCode);
            if (!selectedParkingLocation) {
                toast.error("Selected parking location not found.");
                return;
            }
            setParkingLocationName(selectedParkingLocation.parking_location_name);
            setParkingSlots(slotsResponse.data);
            setLocationUrl(selectedParkingLocation.location_url);
        } catch (error) {
            console.error("Error during API calls:", error);
            toast.error("An error occurred while fetching data.");
        }
    };


    const updateSlotStatus = async (slotsToUpdate: any[]) => {
        try {
            const response = await Api.post("crm_get_parking_update", {
                parking_slots: slotsToUpdate // Pass the slots array here
            });

            // Check if the response was successful
            if (response.status) {
                return response; // Return the response if the update was successful
            } else {
                console.error("Failed to update slots:", response.message);
                return false; // Return false if the update failed
            }
        } catch (error) {
            console.error("Error updating slots:", error);
            return false; // Return false in case of an error
        }
    };


    const updateSlots = async (allSelectedSlots: any[]) => {
        const currentDate = new Date().toISOString().split('T')[0];

        // Prepare the slots to update in the specified format
        const parkingSlots = allSelectedSlots.map(slot => ({
            project_code: parkingLocation.project_code,
            tower_code: parkingLocation.tower_code,
            project_id: parkingLocation.project_id,
            tower_id: parkingLocation.tower_id,
            location_code: slot.location_code,
            car_parking_slot_number: slot.car_parking_slot_number,
            car_parking_code: slot.car_parking_code,
            cust_unit_id: parkingLocation.cust_unit_id,
            booked_by: userInfo.user_login_name,
            booked_date: currentDate,
            cancelled_by: null,
            cancelled_date: null,
            cancelled_reason: null,
            last_modified_by: userInfo.user_login_name,
            last_modified_at: currentDate,
            parking_slot_status: "booked_by_customer",
        }));

        console.log("Prepared slots for API:", JSON.stringify({ parking_slots: parkingSlots }, null, 2));

        // Ensure parkingSlots is an array
        if (!Array.isArray(parkingSlots) || parkingSlots.length === 0) {
            console.error("Invalid parkingSlots array:", parkingSlots);
            return {
                success: false,
                message: "Please provide parking slots as an array",
                data: { parking_slots: [] }
            };
        }

        try {
            // Call the updateSlotStatus function with the prepared slots
            const updateResponse = await updateSlotStatus(parkingSlots);

            // Check if the update was successful
            if (!updateResponse) {
                return {
                    success: false,
                    message: "Failed to update slots",
                    data: { parking_slots: parkingSlots }
                };
            }

            // If successful, return a success message
            return {
                success: true,
                message: "Slots updated successfully",
                data: updateResponse.data // Include any relevant data returned from updateSlotStatus
            };
        } catch (error) {
            console.error("Error updating slots:", error);
            return {
                success: false,
                message: "An error occurred while updating slots.",
                data: { parking_slots: parkingSlots }
            };
        }
    };

    const renderParkingSlots = () => {
        if (!parkingSlots || parkingSlots.length === 0) {
            return <p>No parking slots available for this location.</p>;
        }
    
        const currentBasementKey = parkingSlots[0].location_code; // Get the current basement key
    
        return parkingSlots.map((slot, index) => {
            const status = slot.parking_slot_status as 'booked_by_customer' | 'available' | 'reserved';
            const isSelected = selectedSlotsByBasement[currentBasementKey]?.some(selected => selected.car_parking_code === slot.car_parking_code); // Check if the slot is selected for the current basement
    
            return (
                <button
                    key={slot.car_parking_slot_number || `slot-${index}`}
                    onClick={() => {
                        if (status === 'available') {
                            if (isSelected) {
                                // Deselect the slot
                                setSelectedSlotsByBasement(prev => {
                                    const updatedSlots = prev[currentBasementKey].filter(selected => selected.car_parking_code !== slot.car_parking_code);
                                    
                                    // Update selectedSlotsState to remove the deselected slot
                                    setSelectedSlotsState(prevSlots => prevSlots.filter(selected => selected.car_parking_code !== slot.car_parking_code)); // Update selectedSlotsState
    
                                    return {
                                        ...prev,
                                        [currentBasementKey]: updatedSlots,
                                    };
                                });
                            } else {
                                // Select the slot
                                setSelectedSlotsByBasement(prev => {
                                    const currentSelectedSlots = prev[currentBasementKey] || [];
                                    if (currentSelectedSlots.length < selectedParkingOption?.locations[currentBasementKey]?.no_of_parkings) {
                                        setSelectedSlotsState(prevSlots => [...prevSlots, { car_parking_slot_number: slot.car_parking_slot_number, car_parking_code: slot.car_parking_code, location_code: slot.location_code }]); // Update selectedSlotsState
                                        return {
                                            ...prev,
                                            [currentBasementKey]: [...currentSelectedSlots, { car_parking_slot_number: slot.car_parking_slot_number, car_parking_code: slot.car_parking_code, location_code: slot.location_code }],
                                        };
                                    } else {
                                        // If the limit is reached, replace the first selected slot
                                        const updatedSlots = [...currentSelectedSlots.slice(1), { car_parking_slot_number: slot.car_parking_slot_number, car_parking_code: slot.car_parking_code, location_code: slot.location_code }];
                                        setSelectedSlotsState(prevSlots => [...prevSlots.slice(1), { car_parking_slot_number: slot.car_parking_slot_number, car_parking_code: slot.car_parking_code, location_code: slot.location_code }]); // Update selectedSlotsState
                                        return {
                                            ...prev,
                                            [currentBasementKey]: updatedSlots,
                                        };
                                    }
                                });
                            }
                        }
                    }}
                    className={`slot-button tw-mt-1 ${isSelected ? 'light-green-slots' : status === 'reserved' ? 'red-slots color-red-white' : status === 'booked_by_customer' ? 'orange-slots color-orange-white' : 'green-slots color-green-white'}`}
                    title={status === 'booked_by_customer' ? `${slot.full_name || 'N/A'} - ${slot.unit_no || 'N/A'} - ${slot.customer_number || 'N/A'}` : `${slot.location_desc || ''} - ${slot.car_parking_slot_number || ''}`}
                >
                    {slot.car_parking_slot_number || `Slot ${index + 1}`}
                </button>
            );
        });
    };

    const handleStepClick = (index: number) => {
        // Update the current location index
        setCurrentLocationIndex(index);

        // Get the current location key based on the index
        const currentLocationKey = Object.keys(selectedParkingOption?.locations)[index];

        if (currentLocationKey) {
            // Set the basement key for the selected location
            setBasementKey(currentLocationKey);

            // Fetch slots for the selected location
            fetchNextParkingSlots(currentLocationKey);

            // Set selected slots based on the clicked step
            const selectedSlotsForStep = selectedParkingOption.locations[currentLocationKey]?.selectedSlots || [];
            setSelectedSlotsState(selectedSlotsForStep); // Update selected slots state
        }
    };
    return (
        <div className="booking-container tw-flex">
            <div className="stepper-container tw-w-1/4 tw-p-4 tw-m-8"style={{marginTop : '4rem'}}>
                <VerticalStepper
                    steps={steps} // Pass the selectedParkingOption prop
                    currentLocationIndex={currentLocationIndex} // Pass the currentLocationIndex prop
                    onStepClick={handleStepClick} // Pass the click handler
                    selectedSlots={allSelectedSlots}
                    setSteps={setSteps}
                />
            </div>
            <div className="book-slots-container tw-w-3/4 tw-p-4">
                {successData ? (
                    <CarParkingSuccessPage data={successData} /> // Pass the success data as props
                ) : (
                    <div className='car-parking-booking-page tw-flex'>
                        <div className='tw-w-full'>
                            <div className='tw-flex tw-justify-between tw-items-center tw-mb-4'></div>
                            <div className='right-section'>
                                <div className="section-container lg:tw-p-4">
                                    <p className='text-pri-all tw-text-2xl tw-font-bold'>{parkingLocationName}</p>
                                    <p className='text-pri-all tw-font-bold'>
                                        Select your Parking Slot for {parkingLocation.project_name}, {parkingLocation.tower_name}, {`${parkingLocation?.floor_no || ''}${parkingLocation?.unit_no || ''}`}, {parkingLocationName}
                                    </p>
                                    <p className='fs14'>The parking slot grid provided below is for slot selection purposes only. Please review the parking floor plan to understand the actual layout before finalising your parking slot.</p>
                                    <div className=''>
                                        <p className='text-pri-all tw-font-semibold tw-my-4'>Floor Plan</p>
                                        <div onClick={() => setIsImgPopUp(true)} className="img-section tw-cursor-pointer">
                                            <img src={location_url} alt="Basement Floor Plan" />
                                        </div>
                                        <div className="tw-flex tw-justify-between tw-items-center">
                                            <p className='text-pri-all tw-mb-4'>Allocated slots - {selectedSlotsState.length}</p>
                                            <div className='tw-flex tw-gap-4'>
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
                                        </div>
                                        <div className='tw-grid gap-1 tw-grid-cols-12'>
                                            {renderParkingSlots()}
                                        </div>
                                    </div>
                                </div>
                                {isImgPopUp && (
                                    <BasementSelectedPopup
                                        isImgPopUp={isImgPopUp}
                                        setIsImgPopUp={setIsImgPopUp}
                                        location_url={locationUrl}
                                        parkingLocation={parkingLocation}
                                        parkingLocationName={parkingLocationName}
                                    />
                                )}
                            </div>
                            
                            {isConfirm && (
                                <SlotBookingPopup
                                    selectedParkingOptions={selectedParkingOption}
                                    selectedSlots={selectedSlotsByBasement[basementKey]}
                                    onConfirm={onConfirm}
                                    onCancel={() => setIsConfirm(false)}
                                    isUnreserving={false}
                                    projectName={parkingLocation.project_name}
                                    towerName={parkingLocation.tower_name}
                                    parkingLocationName={parkingLocationName}
                                    parkingLocation={parkingLocation}
                                />
                            )}
                            <div className="tw-mt-4 tw-flex tw-justify-between">
                                <button
                                    onClick={() => {
                                        setSelectedSlotsState([]); 
                                        if (currentLocationIndex === 0) {
                                            navigate(-1); // Navigate back to the previous page if on the first location
                                        } else {
                                            setCurrentLocationIndex(prevIndex => {
                                                const newIndex = Math.max(prevIndex - 1, 0);
                                                console.log("Current Location Index before decrement:", prevIndex);
                                                console.log("Current Location Index after decrement:", newIndex);
                                                return newIndex;
                                            });
                                        }
                                    }}
                                    className="tw-bg-black tw-text-white tw-py-2 tw-px-4 tw-rounded"
                                >
                                    Back
                                </button>
                                {(selectedSlotsState.length === selectedParkingOption?.locations[basementKey]?.no_of_parkings ||
                                    (selectedSlotsByBasement[basementKey]?.length === selectedParkingOption?.locations[basementKey]?.no_of_parkings)) && (
                                        <button
                                            onClick={() => setIsConfirm(true)}
                                            className="tw-bg-black tw-text-white tw-py-2 tw-px-4 tw-rounded"
                                        >
                                            Continue
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookSlotsPageComponent;
