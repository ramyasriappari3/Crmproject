import React from 'react';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {ListItemIcon } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Box from '@mui/material/Box';
import { Dialog } from '@mui/material';
import viepayment_image from "./../../../../assets/Images/viewpayment_image.png";




export default function TransactionReceipt() {
  return (
    <div>
     <Dialog open={true} onClose={() => {}}>
    <div className='tw-flex tw-justify-between tw-m-6' >
                          <h3 className='tw-font-bold'>Payment Proof</h3>
                          <img src="/images/cross-icon.svg" className="tw-cursor-pointer"/>
          </div>

          <div className='tw-flex tw-justify-between'>
        <div className='tw-ml-2'>
          <p>
            15 April 2024
          </p>
          <Typography variant="h6" gutterBottom>
           <p className='tw-font-bold tw-text-black'> ₹385,945.31</p>
          </Typography>
        </div>
        <div >
         <p className='tw-mr-5'>  UTR / Cheque No.</p>
         <p className='tw-ml-12 tw-text-black '>FGT56789</p>
          
        </div>
      </div>
          <Box
      sx={{
        padding: '50px',
        borderRadius: '8px',
        textAlign: 'center',
        height: '875px',
        width : '580px',
        backgroundColor :'#EAECEF'
      }}
    >
      <div>     
    
      <img src={viepayment_image} alt="viewpayment image" />
    
     
    </div>
    </Box>
    </Dialog>
   </div>
  );
}
