import React from 'react';
import { Dialog, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function AssignTask() {
  return (
   <div>
     <Dialog open={true} onClose={() => {}}>
    <div className='tw-flex tw-justify-between tw-m-6' >
                          <h3 className='tw-font-bold'>Assign new task</h3>
                          <img src="/images/cross-icon.svg" className="tw-cursor-pointer"/>
          </div>
          <Box
      sx={{
        padding: '50px',
        borderRadius: '8px',
        textAlign: 'center',
        height: '1079px',
        width : '432px'
      }}
    >
      <CheckCircleIcon style={{ color: '#00BD35', fontSize: 60 }} />
      <p className='tw-font-bold tw-mb-4 tw-mt-3'>
        The task has been assigned successfully
      </p>
      <Typography variant="body2" gutterBottom>
        The customer will be notified via SMS, WhatsApp, 
        <p>and email regarding the task.</p>
      </Typography>

      <Button variant="outlined" sx={{ color: 'black', borderColor: 'black', borderRadius : '0.5rem',marginTop : '2rem'}}>
  <p className='tw-font-bold'style={{textTransform: 'none'}}>Done</p>
  </Button>
    </Box>
            </Dialog>
   </div>
  );
}

export default AssignTask;
