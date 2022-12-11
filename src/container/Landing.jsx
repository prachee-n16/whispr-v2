
import React, { useState, useEffect } from 'react'
import { auth } from '../services/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import AuthModal from './ChatApp/AuthModal';
const Landing = () => {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setOpen(false);
            navigate('/app');
        }
    }, [user])
    return (
        <Box >
            <Navbar open={open} setOpen={setOpen} />
            <Box
                height="80vh"
                sx={{ pl: 7, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
                <Typography variant="h1">whispr.</Typography>
                <Typography variant="h6">
                    We provide in-app translation features that enables for real-time multilingual communication.
                </Typography>
                <Button
                    color="secondary"
                    variant="contained"
                    endIcon={<NavigateNextRoundedIcon />}
                    sx={{
                        textTransform: 'capitalize',
                        width: '10rem',
                        mt: 4,
                        borderRadius: '10px'
                    }}
                    onClick={user ? () => navigate('/app') : () => setOpen(true)}
                >
                    App
                </Button>
            </Box>
            <AuthModal open={open} setOpen={setOpen} />
        </Box>
    )
}

export default Landing