//success error warning
import {Snackbar, SnackbarContent} from '@mui/material';
enum snackbarType {
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info'
}
function alertMsgInfo(msgType:string = "success"): any{
    return { variant: msgType, preventDuplicate: true, autoHideDuration: 1000, anchorOrigin: { vertical: "top", horizontal: "right" } };
}
function setEnqueueSnackbarMsg(message = ""){
     return {
        preventDuplicate: false, 
        autoHideDuration: 1000, 
        anchorOrigin: { vertical: "bottom", horizontal: "center" } ,
        content: (key:any, message: string) => (
          <SnackbarContent sx={{backgroundColor: 'white', color: "black"}} message={message}/>
        ),
    };
}

const  getEnqueueSnackbar= {snackbarType, alertMsgInfo, setEnqueueSnackbarMsg};
export default getEnqueueSnackbar;