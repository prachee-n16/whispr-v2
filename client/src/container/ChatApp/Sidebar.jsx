import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Avatar, ListItemIcon, TextField, IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { logout, db } from '../../services/firebase';
import { auth } from '../../services/firebase';
import { collection, where, query, getDocs,addDoc, setDoc, doc } from "firebase/firestore"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { stringAvatar } from '../../services/utils';
import { v1 as uuidv1 } from 'uuid';
import { useAuthState } from "react-firebase-hooks/auth";
import { MoreVertRounded, DeleteRounded, EditRounded, TranslateRounded, SendRounded } from '@mui/icons-material';

const drawerWidth = 300;

export default function Sidebar({ selectedChannel, setSelectedChannel }) {
    const userId = auth.currentUser?.uid || '';
    const [docId, setDocId] = useState(null)

    const name = auth.currentUser?.displayName;
    const [channels, setChannels] = useState([])
    const [isNewChannelRequired, setIsNewChannelRequired] = useState(false)
    const [channelName, setChannelName] = useState('')

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
            setDocId(doc.id)
            channelIDs = doc.data().channels;
        });

        channelIDs?.map(async (channel) => {
            const channelQuery = query(collection(db, "channels"), where("id", "==", channel.id));
            const channelQuerySnapshot = await getDocs(channelQuery);
            channelQuerySnapshot.forEach((doc) => {
                setChannels((prev) => [...prev, { name: doc.data().channel_name, id: doc.data().id }])
            });
        })
    }

    const handleOnSubmit = async e => {
        e.preventDefault();
        setIsNewChannelRequired(false)
        var id = uuidv1();

        const userRef = doc(db, "users", docId)
        await setDoc(userRef, {
            channels: [...channels, {name: channelName, id}]
          }, {merge: true});

        await addDoc(collection(db, "channels"), {
            id,
            channel_name: channelName,
            messages: []
        });
        await getUserChannels()
        setChannelName('')
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
                <Box display={'flex'} sx={{ justifyContent: 'space-between' }} width={drawerWidth} variant='subtitle2'>
                    <Typography sx={{ mx: 2, mt: 2, mb: 1, fontWeight: 700, fontSize: 12 }}>
                        DIRECT MESSAGES
                    </Typography>
                    <IconButton onClick={() => setIsNewChannelRequired(true)} sx={{ borderRadius: '5px', px: 1, py: 1, m: 1 }}>
                        <AddRoundedIcon fontSize='small' />
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
                    { isNewChannelRequired &&
                    <form onSubmit={handleOnSubmit}>
                        <ListItem sx={{ p: 0, m: 0, border: '1px solid black' }}>
                            <TextField onChange={(e) => setChannelName(e.target.value)} value={channelName} autoFocus onBlur={() => setIsNewChannelRequired(false)} fullWidth sx={{ p: 2, border: 0 }} variant="standard"
                                InputProps={{
                                    disableUnderline: true
                                }} />
                        </ListItem>
                    </form>
                    }
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