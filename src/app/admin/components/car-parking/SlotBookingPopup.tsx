import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import './SlotBookingPopup.scss';
import userSessionInfo from '../../util/userSessionInfo';

interface SelectedSlot {
    car_parking_slot_number: string;
    car_parking_code: string;
    location_code?: string;
}
interface ParkingLocation {
    unit_no: string;
    floor_no: string
}

interface SlotBookingPopupProps {
    selectedParkingOptions?: any;
    selectedSlots: SelectedSlot[];
    onConfirm?: (selectedSlots: SelectedSlot[], selectedParkingOption: any) => Promise<void>;
    onCancel: () => void;
    isUnreserving: boolean;
    projectName: string;
    towerName: string;
    parkingLocationName: string;
    parkingLocation?: ParkingLocation;
}

const SlotBookingPopup: React.FC<SlotBookingPopupProps> = ({
    selectedParkingOptions,
    selectedSlots,
    onConfirm,
    onCancel,
    isUnreserving,
    projectName,
    towerName,
    parkingLocationName,
    parkingLocation
}) => {

    const userInfo = userSessionInfo.logUserInfo();
    const handleConfirm = async () => {
        if (onConfirm) {
            await onConfirm(selectedSlots, selectedParkingOptions);
        }
    };

    <h2>{isUnreserving ? 'Unreserve Slots' : 'Reserve Slots'}</h2>

    const capitalizeEachWord = (str: string) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: 24,
                zIndex: 1000,
                width: '500px',  // Adjusted width
                height: '36%', // Adjusted height
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontWeight: 'bold', fontSize: '20px', color: 'black', paddingLeft: '5px' }}>
                    {userInfo.user_type_id === "internal"
                        ? 'Confirm the Slot Selection'
                        : isUnreserving
                            ? 'Unreserve Slots'
                            : 'Reserve Slots'}
                </Typography>
                <Button onClick={onCancel} sx={{ minWidth: '40px' }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: 'black' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Button>
            </Box>
            <Typography sx={{ marginBottom: '10px', paddingLeft: '5px' }}>
                {userInfo.user_type_id === "internal"
                    ? `Are you sure you want to confirm the ${selectedSlots.length > 1 ? 'slots' : 'slot'}`
                    : `Are you sure you want to ${isUnreserving ? 'unreserve' : 'reserve'} the ${selectedSlots.length > 1 ? 'slots' : 'slot'}`
                }
            </Typography>
            <Typography sx={{ marginBottom: '10px', paddingLeft: '5px' }}>
                selection of <strong>{selectedSlots.map(slot => slot.car_parking_slot_number).join(', ')}</strong> for {userInfo.user_type_id === "internal" ? `${parkingLocation?.floor_no}${parkingLocation?.unit_no}, ` : ''}{capitalizeEachWord(towerName)},
            </Typography>
            <Typography sx={{ paddingLeft: '5px' }}>
                {capitalizeEachWord(projectName)}, {capitalizeEachWord(parkingLocationName)}
            </Typography>
            <Box marginTop="auto" marginLeft="28%" display="flex" justifyContent="space-between">
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    sx={{
                        padding: '10px 20px',
                        borderRadius: '15px', // More rounded corners
                        borderColor: 'black', // Dark border color
                        color: 'black', // Black text color
                        fontWeight: 'bold', // Bold text
                        '&:hover': {
                            backgroundColor: 'white', // Keep the background black on hover
                            opacity: 0.8, // Optional: Slightly reduce opacity for a hover effect
                            borderColor: 'black',
                            borderRadius: '15px'
                        }
                    }}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    sx={{
                        padding: '10px 20px',
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '15px', // More rounded corners
                        '&:hover': {
                            backgroundColor: 'black', // Keep the background black on hover
                            opacity: 0.8 // Optional: Slightly reduce opacity for a hover effect
                        }
                    }}
                >
                    {isUnreserving ? 'Unreserve' : 'Confirm & Continue'}
                </Button>
            </Box>
        </Box>
    );
};

export default SlotBookingPopup;
