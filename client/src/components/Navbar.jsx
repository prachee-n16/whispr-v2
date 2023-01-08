import { useContext, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../theme'
import { Box, Toolbar, Typography } from '@mui/material';
import { MoreVertRounded, DeleteRounded, EditRounded, TranslateRounded, SendRounded, ListItem } from '@mui/icons-material';
import { ListItemIcon, Menu, MenuItem, Divider } from '@mui/material'
import { db } from '../services/firebase';
import { collection, where, query, getDocs, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore"
import { useEffect } from 'react';

const Navbar = ({ selectedChannel }) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const [chatTitle, setChatTitle] = useState(null)
    const [channelAnchorEl, setChannelAnchorEl] = useState(null);

    const handleDelete = async () => {
        const channelRef = doc(db, "channels", selectedChannel)
        await deleteDoc(channelRef)
        setChannelAnchorEl(null)
    };

    const getChatTitle = async () => {
        if (selectedChannel) {
            var channelQuery = query(
                collection(db, "channels"),
                where("id", "==", selectedChannel),
            );
            const channelQuerySnapshot = await getDocs(channelQuery);
            channelQuerySnapshot.forEach((doc) => {
                setChatTitle(doc.data().channel_name)
            })
        }
    }

    useEffect(() => {
        getChatTitle()
    }, [selectedChannel])


    return (
        <Box sx={{ pl: 10 }}>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Box sx={{ width: 250 }}></Box>
                    <Typography sx={{ mt: 2 }} variant='h6'>{chatTitle} </Typography>
                    {selectedChannel && <Box>
                        <IconButton onClick={() => setChannelAnchorEl(true)} disableFocusRipple={true} size="small" sx={{ mt: 2 }}><MoreVertRounded size="small" fontSize="16px" /></IconButton>
                        <Menu
                            anchorReference="anchorPosition"
                            keepMounted
                            open={Boolean(channelAnchorEl)}
                            onClose={() => setChannelAnchorEl(false)}
                            anchorPosition={{ top: 10, left: 540 }}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <DeleteRounded />
                                </ListItemIcon>
                                Delete Channel
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <EditRounded />
                                </ListItemIcon>
                                Update Channel
                            </MenuItem>
                        </Menu>
                    </Box>
                    }
                    <Box flexGrow={1}></Box>
                    <IconButton size="large" edge="end" onClick={colorMode.toggleColorMode} color="inherit" disableFocusRipple={true} disableRipple={true}>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize="large" /> : <Brightness4Icon fontSize="large" />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar