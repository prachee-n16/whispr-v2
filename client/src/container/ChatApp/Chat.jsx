import React, { useEffect, useState } from 'react'
import { auth } from '../../services/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { Box } from '@mui/system';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Channel from './Channel'

const App = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [selectedChannel, setSelectedChannel] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user])

  return (
    <Box>
      <Navbar />
      <Box sx={{display: 'flex', direction: 'row'}} >
        <Sidebar selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel} />
        <Channel selectedChannel={selectedChannel} />
      </Box>
    </Box>
  )
}

export default App