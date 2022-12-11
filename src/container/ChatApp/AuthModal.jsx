import React, { useEffect, useState } from 'react'
import { auth, signInWithGoogle, signInWithEmailAndPassword, registerWithEmailAndPassword } from '../../services/firebase'; import { useAuthState } from "react-firebase-hooks/auth";
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/system';
import { Button, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthModal = ({ open = false, setOpen }) => {
    const [user, loading, error] = useAuthState(auth);
    // Login or Sign Up Form
    // Login = True, Sign Up = False
    const [authMode, setAuthMode] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // TO-DO Set up form validation
    return (
        <Dialog
            fullWidth={true}
            maxWidth={'xs'}
            open={open}
            onClose={(event, reason) => {
                setOpen(false)
            }}
        >
            <DialogTitle>
                <Typography component={'span'} display="flex" justifyContent={"center"} variant="h4" sx={{ m: 4, fontWeight: '700' }}>
                    whispr.
                    <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', top: 2, right: 2 }}>
                        <CloseRoundedIcon />
                    </IconButton>
                </Typography>

            </DialogTitle>

            <Box display="flex" justifyContent={"center"}>
                <Button variant={authMode ? "contained" : "outlined"} color="secondary" onClick={() => setAuthMode(true)} sx={{ width: '8rem', textTransform: 'capitalize', borderRadius: '0' }}>Login</Button>
                <Button variant={authMode ? "outlined" : "contained"} color="secondary" onClick={() => setAuthMode(false)} sx={{ width: '8rem', textTransform: 'capitalize', borderRadius: '0' }}>SignUp</Button>
            </Box>
            {authMode ?
                <div id="loginForm">
                    <Box sx={{ border: '1px solid', borderColor: 'secondary', m: 3, p: 2 }}>
                        <Typography fontWeight={600} fontSize={'12px'}>Email Address:</Typography>
                        <TextField value={email} onChange={(e) => setEmail(e.target.value)} type="email" size={"small"} color="secondary" fullWidth variant="outlined" sx={{ mt: 1, mb: 3 }}></TextField>
                        <Typography fontWeight={600} fontSize={'12px'}>Password:</Typography>
                        <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} size={"small"} color="secondary" fullWidth variant="outlined" sx={{ mt: 1, mb: 3 }}></TextField>
                        <Button fullWidth variant={"contained"} color="secondary" sx={{ textTransform: "capitalize" }} onClick={() => signInWithEmailAndPassword(email, password)}>Login</Button>
                    </Box>
                    <Box sx={{ m: 1, p: 2 }}>
                        <Button fullWidth variant={"outlined"} color="secondary" sx={{ textTransform: "capitalize", borderRadius: 0 }} onClick={signInWithGoogle}>Login with Google Account</Button>
                    </Box>
                </div>
                :
                <div id="signInForm">
                    <Box sx={{ border: '1px solid', borderColor: 'secondary', m: 3, p: 2 }}>
                        <Typography fontWeight={600} fontSize={'12px'}>Email Address:</Typography>
                        <TextField value={email} onChange={(e) => setEmail(e.target.value)} type="email" required size={"small"} color="secondary" fullWidth variant="outlined" sx={{ mt: 1, mb: 3 }}></TextField>
                        <Typography fontWeight={600} fontSize={'12px'}>Password:</Typography>
                        <TextField variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} type="password" size={"small"} color="secondary" fullWidth sx={{ mt: 1, mb: 3 }}></TextField>
                        <Button type="submit" fullWidth variant={"contained"} color="secondary" sx={{ textTransform: "capitalize" }} onClick={() => registerWithEmailAndPassword(email, password)} >Sign In</Button>
                    </Box>
                    <Box sx={{ m: 1, p: 2 }}>
                        <Button type="submit" fullWidth variant={"outlined"} color="secondary" sx={{ textTransform: "capitalize", borderRadius: 0 }} onClick={signInWithGoogle}>Sign In with Google Account</Button>
                    </Box>
                </div>
            }
        </Dialog>
    )
}

export default AuthModal