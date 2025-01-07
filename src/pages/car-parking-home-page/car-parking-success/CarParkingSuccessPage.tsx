// src/pages/car-parking-home-page/car-parking-success/CarParkingSuccessPage.tsx
import "./CarParkingSuccessPage.scss";
import correctIcon from './../../../../src/assets/Images/correct.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

interface SelectedSlot {
    car_parking_slot_number: string;
    car_parking_code: string;
    location_code: string;
}

interface ParkingLocation {
    project_name: string;
    tower_name: string;
    tower_id: string;
    parking_location_name: string;
    project_id: string;
    floor_no: string;
    unit_no: string;
    cust_unit_id: string;
    project_address: string;
    project_city: string;
    project_state: string;
}

interface CarParkingSuccessPageProps {
    data: {
        [x: string]: any;
        allSelectedSlots: SelectedSlot[];
        parkingLocation: ParkingLocation;
        selectedParkingOption: any; // Adjust this type as needed
    };
}

const CarParkingSuccessPage: React.FC<CarParkingSuccessPageProps> = ({ data }) => {
    const navigate = useNavigate();

    const handleDoneClick = () => {
        navigate('/crm/admin/managecarparking'); // Adjust the path as necessary
    };
  
    // Concatenate the slot numbers for display
    const concatenatedSlotNumbers = data.allSelectedSlots
        .map(slot => slot.car_parking_slot_number)
        .join(", ");

    // Format the parking locations for display
    const formatParkingLocations = () => {
        const locations = Object.keys(data.selectedParkingOption.locations);
        
        if (locations.length === 0) return ''; // Handle case with no locations
        if (locations.length === 1) return `Basement ${locations[0].replace('ZB', '')}`; // Handle case with one location
    
        // Create formatted locations
        const formattedLocations = locations.map((key, index) => {
            const locationNumber = key.replace('ZB', '');
            return index === 0 ? `Basement ${locationNumber}` : locationNumber; // Only add "Basement" for the first location
        });
    
        // Handle case with two or more locations
        const lastLocation = formattedLocations.pop(); // Remove the last location
        return `${formattedLocations.join(',')} & ${lastLocation}`; // Join the rest with commas and add the last with an ampersand
    };
    

    return (
        <div className='car-parking-success-page tw-flex '>
            <div className="content-container tw-w-full " style={{ padding: '5rem',marginTop : '4rem'}}>
                <div style={{ padding: '3rem', marginTop : '0px'}}>
                    <div className='tw-w-8 tw-mx-auto'>
                        <img src={correctIcon} alt="Success" className='tw-w-15 tw-h-12'/>
                    </div>
                    <p className='text-pri-all tw-text-center tw-font-bold tw-my-6'style={{fontSize : '1.08rem'}}>
                        Car parking slots for {data.parkingLocation.project_name}, {data.parkingLocation.tower_name}, {data.parkingLocation.floor_no + data.parkingLocation.unit_no}, {formatParkingLocations()} successfully booked.
                    </p>
                    <div className="section-container pd2" style={{ padding: '2rem'}}>
                        <div className='tw-flex tw-items-center tw-justify-between'>
                            <div className='text-pri-all tw-font-bold'>Car parking slot booking</div>
                            <div className='status' style={{ padding: '3px', backgroundColor: '#00BD35', color: 'white', borderRadius: '0.5rem', width: '93px' }}>Completed</div>
                        </div>
                        <hr className='tw-my-4' />
                        <div>
                        <div className='tw-font-bold fs14 text-pri-all'>{data.parkingLocation?.project_name}, {data.parkingLocation?.tower_name}, {data.parkingLocation.floor_no + data.parkingLocation.unit_no}</div>
                            <div className='tw-flex tw-gap-1 tw-items-center'>
                                <LocationOnIcon />
                                <div className='fs13'>
                                    {data.parkingLocation.project_city}, {data.parkingLocation.project_state}
                                </div>
                            </div>
                        </div>
                        <div className='tw-mt-4 tw-flex tw-items-center tw-justify-between'>
                            <div className='tw-flex tw-gap-1'>
                                <DirectionsCarFilledIcon />
                                <div>
                                    <div className='fs13'>Car parking</div>
                                    <div className='text-pri-all fs13 tw-font-bold'>{data.allSelectedSlots.length}</div>
                                </div>
                            </div>
                            <div className='tw-flex tw-gap-1'>
                                <div>
                                    <div className='fs13'>Slots Booked</div>
                                    <div className='text-pri-all fs13 tw-font-bold'>{concatenatedSlotNumbers}</div>
                                </div>
                            </div>
                            <div className='tw-flex tw-gap-1'>
                                <div><img src={'/images/clarity-building.png'} alt='' /></div>
                                <div>
                                    <div className='fs13'>Block/Tower</div>
                                    <div className='text-pri-all fs13 tw-font-bold'>{data.parkingLocation.tower_name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button 
                        variant="outlined" 
                        sx={{ 
                            color: 'black', 
                            borderColor: 'black', 
                            width: '84px', 
                            height: '36px', 
                            borderRadius: '8px', 
                            fontWeight: 'bold', 
                            marginLeft: '17rem', 
                            marginTop: '1rem' 
                        }} 
                        onClick={handleDoneClick}
                    >
                        <p style={{ textTransform: 'none' }}>Done</p>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CarParkingSuccessPage;