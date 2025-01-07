import React, { useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SentApplication() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/crm/customerslist');
  }

  useEffect(()=>{
    const element: HTMLElement | null = document.getElementById('send-verification-submit-btn') as HTMLElement;
    element.style.display = 'none';
  },[])

  return (
     
      <div className=" md:tw-p-6 tw-bg-white no-hover" style={{width : '680px',height : '430px',borderRadius: '16px'}}>
         <Box
            sx={{
             
              padding: '100px',
              borderRadius: "8px",
              textAlign: "center",
              height: "935px",
              marginTop : '10px',
              position : 'fixed'
              
            }}
          >
          <CheckCircleIcon style={{ color: '#00BD35', fontSize: 60 }}/>
        <Typography variant="h6" component="div" gutterBottom style={{ fontWeight: 'bold',color: '#25272D' }}>
          Application send successfully
        </Typography>

       <div>
       <Typography variant="body2" gutterBottom>
         The applicant will notified via mail and sms for the application
        <p className='tw-mb-5'>form verification.</p>
        </Typography>
       </div>
        <Button variant="outlined" sx={{ color: 'black', borderColor: 'black',width : '84px',height : '36px',borderRadius : '8px',fontWeight : 'bold'}} onClick={handleNavigate}>
          <p style={{textTransform: 'none'}}>Done</p>
        </Button>

          
          </Box>
      </div>
  );
}

export default SentApplication;