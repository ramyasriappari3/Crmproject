// src/components/AdminPortal.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const AdminPortal = () => {
    return (
        <Container
            maxWidth="sm"
            style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography variant="h4" component="h1" sx={{ color: "#25272D" }}>
                Welcome to Admin Portal
            </Typography>
        </Container>
    );
};

export default AdminPortal;