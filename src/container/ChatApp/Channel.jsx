import { Divider, TextField, Typography, IconButton, Avatar, Modal, Button } from '@mui/material'
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'primary.main',
    color: 'secondary.main',
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column"
};


const Channel = ({ selectedChannel }) => {
    const [messages, setMessages] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [channelId, setChannelId] = useState('');
    const channelQuery = query(
        collection(db, "channels"),
        where("id", "==", selectedChannel),
    );
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteMessageTarget, setDeleteMessageTarget] = useState(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [updateMessageTarget, setUpdateMessageTarget] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [updatedMessage, setUpdatedMessage]  = useState(null);

    const handleClick = (index, event) => {
        setAnchorEl({ [index]: event.currentTarget });
    };
    const handleDelete = async () => {
        var index = deleteMessageTarget.index;
        var selected_Message = messages[index].id
        var new_messages = messages.filter((message) => message.id !== selected_Message)
        const channelRef = doc(db, "channels", channelId)
        await setDoc(channelRef, {
            messages: new_messages
        }, { merge: true })
        setMessages(new_messages)
        setAnchorEl(null);
        setOpenDeleteModal(false)
        setDeleteMessageTarget(null);
    };

    const handleUpdate = async () => {
        var index = updateMessageTarget.index;
        var selected_Message = messages[index].id
        var new_messages = messages.filter((message) => {
            if (message.id === selected_Message) {
                message.message = updatedMessage
            }
            return message
        })
        const channelRef = doc(db, "channels", channelId)
        await setDoc(channelRef, {
            messages: new_messages
        }, { merge: true })
        setMessages(new_messages)
        setAnchorEl(null);
        setOpenUpdateModal(false)
        setUpdateMessageTarget(null);
        setUpdatedMessage(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
            created_at: new Date(),
            message: newMessage,
            user: auth.currentUser?.displayName,
            id
        }])
        setNewMessage('');
    };

    const handleOnChange = e => {
        setNewMessage(e.target.value);
    }
    const handleUpdateChange = e => {
        setUpdatedMessage(e.target.value);
    }

    const openDeleteModalfn = (index, event) => {
        setAnchorEl(null)
        setOpenDeleteModal(true);
        setDeleteMessageTarget({ index, event });
    }
    const openUpdateModalfn = (index, event) => {
        setAnchorEl(null)
        setOpenUpdateModal(true);
        setUpdateMessageTarget({ index, event });
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
                {messages?.map((message, index) => (
                    <Box display="flex" key={message.id} sx={{ direction: 'row', p: 2 }}>
                        {message.user && <Avatar variant="rounded" key={message.id + "Avatar"} sx={{ width: 24, height: 24 }} {...stringAvatar(message.user)} />}
                        <Box key={message.id + "Message"}>
                            <Typography sx={{ backgroundColor: 'secondary.main', color: 'primary.main', p: 2, mx: 2, borderRadius: '10px' }}>
                                {message.message}
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton key={message.id + "More.."} onClick={(e) => handleClick(index, e)} sx={{ alignSelf: 'center', mx: 1, borderRadius: '5px', height: '32px', width: '32px' }} ><MoreVertRoundedIcon /></IconButton>
                        <Menu
                            anchorEl={anchorEl && anchorEl[index]}
                            keepMounted
                            open={Boolean(anchorEl && anchorEl[index])}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <MenuItem onClick={(e) => openDeleteModalfn(index, e)}>
                                <ListItemIcon>
                                    <DeleteRoundedIcon />
                                </ListItemIcon>
                                Delete
                            </MenuItem>
                            <MenuItem onClick={(e) => openUpdateModalfn(index, e)}>
                                <ListItemIcon>
                                    <EditRoundedIcon />
                                </ListItemIcon>
                                Update
                            </MenuItem>
                        </Menu>
                    </Box>
                ))}
            </Box>
            <Modal
                open={openDeleteModal}
                onClose={() => {
                    setOpenDeleteModal(false)
                    setDeleteMessageTarget(null);
                    setAnchorEl(null)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Delete message
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        Are you sure you want to delete this message?
                        {<br />}
                    </Typography>
                    <Typography variant="caption" sx={{ width: 500, color: 'primary.main', bgcolor: 'secondary.main', p: 2, mt: 1, borderRadius: '5px' }}>
                        {deleteMessageTarget && messages[deleteMessageTarget.index].message}
                    </Typography>
                    <Box sx={{ flexDirection: "row" }}>
                        <Button onClick={() => handleDelete()} variant="contained" color="error" sx={{ width: '100px', textTransform: 'capitalize', px: 2, py: 1, mt: 2, mr: 2 }} >
                            DELETE
                        </Button>
                        <Button variant="contained" onClick={() => {
                            setOpenDeleteModal(false)
                            setDeleteMessageTarget(null);
                            setAnchorEl(null)
                            }} 
                            sx={{ width: '100px', textTransform: 'capitalize', px: 2, py: 1, mt: 2 }} 
                        >
                            CANCEL
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={openUpdateModal}
                onClose={() => {
                    setOpenUpdateModal(false)
                    setUpdateMessageTarget(null);
                    setUpdatedMessage(null);
                    setAnchorEl(null)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit message
                    </Typography>
                    <TextField 
                        onChange={handleUpdateChange} 
                        value={updatedMessage} 
                        variant="outlined" 
                        color="secondary" 
                        placeholder={updateMessageTarget && messages[updateMessageTarget.index].message}
                        focused
                        sx={{my: 2}}
                    />
                    <Box sx={{ flexDirection: "row" }}>
                        <Button  onClick={() => {handleUpdate()}} variant="contained" color="error" sx={{ width: '100px', textTransform: 'capitalize', px: 2, py: 1, mt: 2, mr: 2 }} >
                            UPDATE
                        </Button>
                        <Button variant="contained" onClick={() => {
                            setOpenUpdateModal(false)
                            setUpdateMessageTarget(null);
                            setUpdatedMessage(null);
                            setAnchorEl(null)
                            }} 
                            sx={{ width: '100px', textTransform: 'capitalize', px: 2, py: 1, mt: 2 }} 
                        >
                            CANCEL
                        </Button>
                    </Box>
                </Box>
            </Modal>
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