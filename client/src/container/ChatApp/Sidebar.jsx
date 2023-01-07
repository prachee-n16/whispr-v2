import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Avatar, IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { logout, db } from '../../services/firebase';
import { auth } from '../../services/firebase';
import { collection, where, query, getDocs } from "firebase/firestore"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { stringAvatar } from '../../services/utils';

const drawerWidth = 300;

export default function Sidebar({selectedChannel, setSelectedChannel}) {
    const userId = auth.currentUser?.uid || '';
    const name = auth.currentUser?.displayName;
    const [channels, setChannels] = useState([])

    async function getUserChannels() {
        setChannels([])
        // Create reference for user database
        const userRef = collection(db, "users");
        // Create a query against user collection for available groups
        const userQuery = query(userRef, where("uid", "==", userId));
        var channelIDs = null;
        // Execute query
        const userQuerySnapshot = await getDocs(userQuery);
        // Only one user will be returned
        userQuerySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            channelIDs = doc.data().channels;
        });

        channelIDs?.map(async (channel) => {
            const channelQuery = query(collection(db, "channels"), where("id", "==", channel));
            const channelQuerySnapshot = await getDocs(channelQuery);
            channelQuerySnapshot.forEach((doc) => {
                setChannels((prev) => [...prev, { name: doc.data().channel_name, id: doc.data().id }])
            });
        })
    }

    useEffect(() => {
        getUserChannels();
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar variant="dense" disableGutters={true} sx={{ px: 2, py: 2 }}>
                    {/* Needs to be config driven */}
                    {name && <Avatar onClick={logout} variant="rounded" sx={{ width: '16px', height: '16px', }} {...stringAvatar(name)} />}
                    <Typography variant="h6" sx={{ ml: 1 }}>{name}</Typography>
                </Toolbar>
                <Box display={'flex'} sx={{justifyContent: 'space-between'}}width={drawerWidth} variant='subtitle2'>
                    <Typography sx={{mx: 2, mt:2, mb: 1, fontWeight: 700, fontSize: 12}}>
                        DIRECT MESSAGES
                    </Typography>
                    <IconButton sx={{borderRadius: '5px', px: 1, py: 1, m: 1}}>
                        <AddRoundedIcon fontSize='small'/>
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    {channels && channels?.map((channel) => (
                        <ListItem onClick={() => setSelectedChannel(channel.id)} key={channel.id} disablePadding>
                            <ListItemButton
                                autoFocus={channels[0].id === channel.id}
                                selected={channel.id === selectedChannel}
                                disabled={channel.id === selectedChannel}
                                divider={true}
                                >
                                <ListItemText primary={channel.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
            </Box>
        </Box>
    );
}