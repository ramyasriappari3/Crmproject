import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { IconButton } from "@mui/material";
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { ThemeProvider } from '@mui/material/styles';
import theme from './themeConfig';

function SnackbarCloseButton({ snackbarKey }: any) {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)}>
      <CloseSharpIcon fontSize="small" />
    </IconButton>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={3} action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}>
      <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </Provider>
    </SnackbarProvider>
  </ThemeProvider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();