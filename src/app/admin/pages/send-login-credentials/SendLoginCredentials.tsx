import React from 'react';
import { Dialog, DialogContent, Checkbox, FormControlLabel, TextField, Button,DialogActions } from '@mui/material';
import './SendLoginCredentials.scss';

const SendLoginCredentials = () => {
 

  return (
    <Dialog open={true} onClose={() => {}}>
      <div className='tw-flex tw-justify-between tw-m-4' >
							<h3 className='tw-font-bold'>Send login credentials</h3>
							<img src="/images/cross-icon.svg" className="tw-cursor-pointer"/>
              </div>
      <DialogContent>
        <p className="text-sm mb-4">
          You can choose your preferred medium from the list below to send login credentials to the applicant.
        </p>
        <div className="flex gap-4 mb-4">
          <FormControlLabel control={<Checkbox defaultChecked />} label="SMS" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Email" />
        </div>
        
       <div>
       <div className='text_field_top'>
        <span>Phone Number</span>
       <TextField sx={{ mt: 3 }}
          margin='normal'
          required
          className="mb-4"
          fullWidth
          defaultValue="+91 9873493509"
          variant="outlined"
        />
       </div>
       <br>
       </br>
        <div>
        Email Address
        <TextField sx={{ mt: 3 }}
          className="mb-4"
          fullWidth
          defaultValue="Kaylee_Lemke@gmail.com"
          variant="outlined"
        />
        </div>
        <br>
        </br>
        <div>
        write a message
        <TextField
          sx={{ mt: 3 }}
          className="message"
          fullWidth
          placeholder="Max 24 characters"
          variant="outlined"
          multiline
          rows={2} 
        />
        </div>
       </div>
       <div>
       <DialogActions>
  <Button variant="outlined" sx={{ color: 'black', borderColor: 'black' }}>
    Close
  </Button>
  <Button variant="contained" sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: 'darkgray' } }}>
    Send login credentials
  </Button>
</DialogActions>
       </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendLoginCredentials;
