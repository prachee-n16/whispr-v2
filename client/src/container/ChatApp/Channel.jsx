import React, { useEffect, useState } from 'react'
import { stringAvatar, style } from '../../services/utils';

// FIREBASE
import { db, auth } from '../../services/firebase';
import { collection, where, query, getDocs, setDoc, doc } from "firebase/firestore"
import { v1 as uuidv1 } from 'uuid';

// MUI Imports
import { ListItemIcon, Menu, MenuItem, Box, Divider, TextField, Typography, IconButton, Avatar, Modal, Button, Select } from '@mui/material'
import { MoreVertRounded, DeleteRounded, EditRounded, TranslateRounded, SendRounded, ListItem } from '@mui/icons-material';

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
    const [messageAnchorEl, setMessageAnchorEl] = useState(null);
    const [updatedMessage, setUpdatedMessage] = useState(null);

    const [translateMessageAnchorEl, setTranslateMessageAnchorEl] = useState(null)
    const [translateLanguage, setTranslateLanguage] = useState(null);
    const [languages, setLanguages] = useState(null)

    const handleClick = (index, event) => {
        setMessageAnchorEl({ [index]: event.currentTarget });
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
        setMessageAnchorEl(null);
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
        setMessageAnchorEl(null);
        setOpenUpdateModal(false)
        setUpdateMessageTarget(null);
        setUpdatedMessage(null);
    };

    const handleClose = () => {
        setMessageAnchorEl(null);
    };

    const getLanguages = async () => {
        const data = await fetch('http://localhost:5000/language', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return data.json()
    }

    const getMessages = async () => {
        const channelQuerySnapshot = await getDocs(channelQuery);
        channelQuerySnapshot.forEach((doc) => {
            setMessages(doc.data().messages)
            setChannelId(doc.id);
        })
    }

    useEffect(() => { getMessages() }, [selectedChannel])

    const translateMessage = async () => {
        const translateParams = {
            text: newMessage,
            source: 'en',
            target: translateLanguage.code
        }

        const data = await fetch('http://localhost:5000/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                translateParams: translateParams
            })
        })

        return data.json()
    }
    const handleOnSubmit = async e => {
        e.preventDefault();
        const channelRef = doc(db, "channels", channelId)
        var id = uuidv1();
        
        const translatedMessage = await translateMessage()
        await setDoc(channelRef, {
            messages: [...messages, {
                created_at: new Date(),
                ln: translateLanguage ? translateLanguage : 'en',
                message: translateLanguage ? translatedMessage.message.result.translations[0].translation : newMessage,
                user: auth.currentUser?.displayName,
                id,
            }]
        }, { merge: true })
        setMessages((prev) => [...prev, {
            created_at: new Date(),
            ln: translateLanguage ? translateLanguage : 'en',
            message: translateLanguage ? translatedMessage.message.result.translations[0].translation : newMessage,
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
        setMessageAnchorEl(null)
        setOpenDeleteModal(true);
        setDeleteMessageTarget({ index, event });
    }
    const openUpdateModalfn = (index, event) => {
        setMessageAnchorEl(null)
        setOpenUpdateModal(true);
        setUpdateMessageTarget({ index, event });
    }

    const onLanguageIconClick = (event) => {
        setTranslateMessageAnchorEl(event.currentTarget)
    }

    useEffect(() => {
        (async function () {
            const languageList = await getLanguages()
            setLanguages(languageList.languages.result.languages)
        })()
    }, [translateMessageAnchorEl])


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
            {/* MESSAGES */}
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
                        <IconButton key={message.id + "More.."} onClick={(e) => handleClick(index, e)} sx={{ alignSelf: 'center', mx: 1, borderRadius: '5px', height: '32px', width: '32px' }} ><MoreVertRounded /></IconButton>
                        <Menu
                            anchorEl={messageAnchorEl && messageAnchorEl[index]}
                            keepMounted
                            open={Boolean(messageAnchorEl && messageAnchorEl[index])}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <MenuItem onClick={(e) => openDeleteModalfn(index, e)}>
                                <ListItemIcon>
                                    <DeleteRounded />
                                </ListItemIcon>
                                Delete
                            </MenuItem>
                            <MenuItem onClick={(e) => openUpdateModalfn(index, e)}>
                                <ListItemIcon>
                                    <EditRounded />
                                </ListItemIcon>
                                Update
                            </MenuItem>
                        </Menu>
                    </Box>
                ))}
            </Box>
            {/* DELETE MESSAGE MODAL */}
            <Modal
                open={openDeleteModal}
                onClose={() => {
                    setOpenDeleteModal(false)
                    setDeleteMessageTarget(null);
                    setMessageAnchorEl(null)
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
                            setMessageAnchorEl(null)
                        }}
                            sx={{ width: '100px', textTransform: 'capitalize', px: 2, py: 1, mt: 2 }}
                        >
                            CANCEL
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* UPDATE MESSAGE MODAL */}
            <Modal
                open={openUpdateModal}
                onClose={() => {
                    setOpenUpdateModal(false)
                    setUpdateMessageTarget(null);
                    setUpdatedMessage(null);
                    setMessageAnchorEl(null)
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
                        sx={{ my: 2 }}
                    />
                    <Box sx={{ flexDirection: "row" }}>
                        <Button onClick={() => { handleUpdate() }} variant="contained" color="error" sx={{ width: '100px', textTransform: 'capitalize', px: 2, py: 1, mt: 2, mr: 2 }} >
                            UPDATE
                        </Button>
                        <Button variant="contained" onClick={() => {
                            setOpenUpdateModal(false)
                            setUpdateMessageTarget(null);
                            setUpdatedMessage(null);
                            setMessageAnchorEl(null)
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
                    disabled={!selectedChannel}
                    label={translateLanguage && translateLanguage.name}
                    value={newMessage}
                    onChange={handleOnChange}
                    justify="end"
                    autoComplete={'false'}
                    variant="outlined"
                    color="secondary"
                    focused
                    InputProps={{
                        startAdornment:
                            <>
                                <IconButton
                                    disabled={!selectedChannel}
                                    type="button"
                                    disableFocusRipple
                                    color={'secondary'}
                                    sx={{ borderRadius: '5px' }}
                                    htmlFor="language-select"
                                    onClick={onLanguageIconClick}
                                >
                                    <TranslateRounded />
                                </IconButton>
                                <Menu
                                    anchorEl={translateMessageAnchorEl}
                                    keepMounted
                                    open={Boolean(translateMessageAnchorEl)}
                                    onClose={() => setTranslateMessageAnchorEl(null)}
                                    onBlur={() => setTranslateMessageAnchorEl(null)}
                                    sx={{
                                        width: 350
                                    }}
                                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                >
                                    {languages
                                        ? languages.map((language) =>
                                            language.supported_as_source && language.supported_as_target &&
                                            <MenuItem onClick={() => setTranslateLanguage({code: language.language, name: language.language_name})} sx={{display: 'flex',justifyContent: 'space-between' }} key={language.language}>
                                                <>
                                                    {language.language_name}
                                                    <Typography variant="caption" color="gray">
                                                        {language.native_language_name}
                                                    </Typography>
                                                </>
                                            </MenuItem>
                                        )
                                        :
                                        <MenuItem onClick={() => setTranslateMessageAnchorEl(null)}>
                                            Server Error
                                        </MenuItem>
                                    }

                                </Menu>
                            </>,
                        endAdornment:
                            <IconButton
                                disabled={!selectedChannel}
                                type="submit"
                                disableFocusRipple
                                color={'secondary'}
                                sx={{ borderRadius: '5px' }}
                            >
                                <SendRounded />
                            </IconButton>
                    }} />
                
            </form>
        </Box>
    )
}

export default Channel