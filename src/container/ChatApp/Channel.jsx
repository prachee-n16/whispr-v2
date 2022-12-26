import { Divider, TextField, Typography, IconButton, Avatar } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { db } from '../../services/firebase';
import { collection, where, query, getDocs, setDoc, doc } from "firebase/firestore"
import { formatRelative } from 'date-fns';
import { auth } from '../../services/firebase';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { v1 as uuidv1 } from 'uuid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const Channel = ({ selectedChannel }) => {
    const [messages, setMessages] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [channelId, setChannelId] = useState('');
    const channelQuery = query(
        collection(db, "channels"),
        where("id", "==", selectedChannel),

    );

    const getMessages = async () => {
        const channelQuerySnapshot = await getDocs(channelQuery);
        channelQuerySnapshot.forEach((doc) => {
            setMessages(doc.data().messages)
            setChannelId(doc.id);
        })
    }

    useEffect(() => { getMessages() }, [selectedChannel])

    // For when we add dates
    const formatDate = date => {
        let formattedDate = '';
        if (date) {
            // Convert the date in words relative to the current date
            formattedDate = formatRelative(date, new Date());
            // Uppercase the first letter
            formattedDate =
                formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }
        return formattedDate;
    };

    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    const handleOnSubmit = async e => {
        e.preventDefault();
        const channelRef = doc(db, "channels", channelId)
        var id = uuidv1();
        await setDoc(channelRef, {
            messages: [...messages, {
                created_at: new Date(),
                message: newMessage,
                user: auth.currentUser?.displayName,
                id,
            }]
        }, { merge: true })
        setMessages((prev) => [...prev, {
            message: newMessage,
            user: auth.currentUser?.displayName,
        }])
        setNewMessage('');
    };

    const handleOnChange = e => {
        setNewMessage(e.target.value);
    }

    return (
        <Box sx={{ width: '100%', pr: '100px' }}>
            {/* HEADER */}
            <Box>
                <Typography variant="h3" align="center">
                    Welcome back!
                </Typography>
                <Typography variant="body2" align="center">
                    This is the beginning of this chat.
                </Typography>
            </Box>
            <Divider sx={{ pt: 2 }} variant={'fullWidth'} />
            <Box>
                {/* MESSAGES */}
                {messages?.map((message) => (
                    <Box display="flex" key={message.id} sx={{ direction: 'row', p: 2 }}>
                        {message.user && <Avatar variant="rounded" key={message.id+"Avatar"} sx={{ width: 24, height: 24 }} {...stringAvatar(message.user)} />}
                        <Box key={message.id+"Message"}>
                            <Typography sx={{ backgroundColor: 'secondary.main', color: 'primary.main', p: 2, mx: 2, borderRadius: '10px' }}>
                                {message.message}
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton key={message.id+"More.."} sx={{ alignSelf: 'center', mx: 1, borderRadius: '5px', height: '32px', width: '32px' }} ><MoreVertRoundedIcon /></IconButton>
                        
                    </Box>
                ))}
            </Box>
            {/* INPUT SECTION */}
            <form onSubmit={handleOnSubmit}>
                <TextField
                    sx={{
                        position: 'absolute',
                        width: '75%',
                        margin: 'auto',
                        bottom: '20px',
                        right: '40px',
                    }}
                    value={newMessage}
                    onChange={handleOnChange}
                    justify="end"
                    autoComplete={'false'}
                    variant="outlined"
                    color="secondary"
                    focused
                    InputProps={{
                        endAdornment:
                            <IconButton
                                type="submit"
                                disableFocusRipple
                                color={'secondary'}
                                sx={{ borderRadius: '5px' }}
                            >
                                <SendRoundedIcon />
                            </IconButton>
                    }} />
            </form>
        </Box>
    )
}

export default Channel