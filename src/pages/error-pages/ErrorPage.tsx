import { Typography } from '@mui/material';
import "./ErrorPage.scss";


const ErrorPage = () => {
    return (
        <div className="error-page-section">
            <div className="text-section">
                <Typography variant="h1" color="initial">
                    404
                </Typography>
                <Typography variant="h4" color="initial">
                    We are sorry, but the page you requested was not found
                </Typography>
            </div>
        </div>
    );
};

export default ErrorPage;
