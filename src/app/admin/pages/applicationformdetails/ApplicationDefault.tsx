import React from 'react';
import { Modal, Box, Typography, FormControlLabel, Checkbox, Button } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import saleable_icon from './../../../../assets/Images/seleable_icon.png';
import unit_icon from './../../../../assets/Images/unit_icon.png';
import car_icon from './../../../../assets/Images/car.png';

function ApplicationDefault() {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => setOpen(false);

    return (
        <div>
            <Modal open={true} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: '500px',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        overflow: 'hidden',
                    }}
                >
                    <div className='tw-flex tw-justify-between tw-mb-4'>
                        <h3 className='tw-font-bold tw-text-black'>Verify the application</h3>
                        <img src="/images/cross-icon.svg" className="tw-cursor-pointer" onClick={handleClose} alt="Close" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <p  className='tw-text-black'>Apartment</p>
                        <p className='tw-font-bold tw-text-black'>1304, Tower 3, My Home Sayuk</p>
                        <p style={{ color: '#656C7B' }}><LocationOnOutlinedIcon />Tellapur, Hyderabad</p>
                    </div>
                    <div className='tw-flex tw-justify-between tw-my-4'>
                        <div className='tw-mr-4'>
                            <p className='lite'><img src={saleable_icon} alt="saleable icon" /> Saleable Area <ErrorOutlineIcon /></p>
                            <p className='tw-font-bold tw-text-black'>1926 SFT</p>
                        </div>
                        <div className='tw-mr-4'>
                            <p  className='lite'><img src={unit_icon} alt="unit icon" /> Unit type</p>
                            <p  className='tw-font-bold tw-text-black'>3 BHK</p>
                        </div>
                        <div>
                            <p className='lite'><img src={car_icon} alt="car icon" /> Car parking</p>
                            <p  className='tw-font-bold tw-text-black'>2</p>
                        </div>
                    </div>
                    <p><ExploreOutlinedIcon /> Facing</p>
                    <p className='tw-font-bold tw-ml-7 tw-text-black'>East</p>
                    <FormControlLabel
                        control={<Checkbox />}
                        label={<p style={{ fontWeight: 'bold' ,color: 'black'}}>Kyc Verification</p>}
                    />
                    <p className='tw-ml-7 tw-text-black'>Kyc Verification has been successfully completed</p>
                    <Box sx={{ backgroundColor: '#F3F5F6', borderRadius: '1rem', padding: '1rem', mt: 2 }}>
                        <p className='tw-font-bold tw-text-black tw-ml-2'>Emerson George</p>
                        <div className='tw-flex tw-justify-between'>
                            <p className='tw-ml-2 tw-text-black'>PAN card</p>
                            <p className='tw-text-black'>GHY3456788</p>
                            <p className='tw-text-blue-500'>View</p>
                        </div>
                        <div className='tw-flex tw-justify-between tw-mt-2'>
                            <p className='tw-ml-2 tw-text-black'>Aadhar card</p>
                            <p className='tw-text-black'>4576892492097</p>
                            <p className='tw-text-blue-500'>View</p>
                        </div>
                    </Box>
                    <FormControlLabel
                        control={<Checkbox />}
                        label={<p style={{ fontWeight: 'bold',color: 'black' }}>Booking form</p>}
                    />
                    <p className='tw-ml-8 tw-text-black'>Booking form has been successfully completed</p>
                    <Box sx={{ backgroundColor: '#F3F5F6', borderRadius: '1rem', padding: '1rem', mt: 2 }}>
                        <p className='tw-font-bold tw-ml-2 tw-text-black'>Booking form</p>
                        <div className='tw-flex tw-justify-between tw-mt-2'>
                            <p className='tw-ml-2 tw-text-black'>Submitted on</p>
                            <p className='tw-text-black'>Sep 19, 2024</p>
                        </div>
                    </Box>
                    <div className='tw-mt-4 tw-flex tw-justify-end'style={{marginTop:'5rem', marginRight: '3rem'}}>
                        <Button style={{ backgroundColor: '#000000', color: '#FFFFFF', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', marginRight: '1rem' }}>
                            Complete verification
                        </Button>
                        <Button style={{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #000000', borderRadius: '5px', padding: '9px 30px', cursor: 'pointer' }} onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default ApplicationDefault;
