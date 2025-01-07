import React from 'react';
import { Dialog, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ApplicationSuccess() {
    return (
        <div>
            <Dialog open={true} onClose={() => { }}>
                <div className='tw-flex tw-justify-between tw-m-4' >
                    <h3 className='tw-font-bold'>Verify the application</h3>
                    <img src="/images/cross-icon.svg" className="tw-cursor-pointer" />
                </div>
                <Box
                    sx={{
                        padding: '50px',
                        borderRadius: '8px',
                        textAlign: 'center',
                    }}
                >
                    <CheckCircleIcon style={{ color: '#00BD35', fontSize: 40 }} />
                    <Typography variant="h6" component="div" gutterBottom style={{ fontWeight: 'bold' }}>
                        Application verification has been completed
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        The booking &customer details can be viewed under manager
                        <p className='tw-mb-3'>customers tab.</p>
                    </Typography>

                    <Button variant="outlined" sx={{ color: 'black', borderColor: 'black', borderRadius: '0.6rem', width: '5rem' }}>
                        Done
                    </Button>
                </Box>
            </Dialog>
        </div>
    );
}

export default ApplicationSuccess;
