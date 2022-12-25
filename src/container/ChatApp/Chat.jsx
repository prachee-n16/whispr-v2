import React, { useEffect, useState } from 'react'
import { auth } from '../../services/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/system';
import { Button, InputLabel, TextField, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
const App = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [selectedChannel, setSelectedChannel] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user])
  return (
    <Box>
      <Navbar />
      <Sidebar selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel} />
    </Box>
  )
}

export default App