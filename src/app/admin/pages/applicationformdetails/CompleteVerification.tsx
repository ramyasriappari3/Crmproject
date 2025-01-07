import React from 'react';
import { Dialog, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
function CompleteVerification() {
  return (
   <div>
     <Dialog open={true} onClose={() => {}}>
    <div className='tw-flex tw-justify-between tw-m-6' >
                          <h3 className='tw-font-bold' >Verify the application</h3>
                          <img src="/images/cross-icon.svg" className="tw-cursor-pointer"/>
          </div>
          <Box
      sx={{
        padding: '50px',
        borderRadius: '8px',
        textAlign: 'center',
        height: '935px',
        
      }}
    >
      <CheckCircleIcon style={{ color: '#00BD35', fontSize: 60 }} />
      <p className='tw-font-bold'> 
      Application verification has been completed
      </p>
      <Typography variant="body2" gutterBottom>
      The booking &customer details can be viewed under manager 
        <p>customers tab. </p>
      </Typography>

      <Button variant="outlined" sx={{ color: 'black', borderColor: 'black', marginTop: '2rem', borderRadius : '0.5rem', fontWeight : 'bold'}}>
    Done
  </Button>
    </Box>
      </Dialog>
   </div>
  );
}

export default CompleteVerification;
