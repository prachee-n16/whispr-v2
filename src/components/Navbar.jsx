import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import { auth } from '../services/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../theme'
import { Box, Toolbar, Typography } from '@mui/material';

const Navbar = ({chatTitle = undefined, open, setOpen}) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <Box sx={{ flexGrow: 1, pl: 4 }}>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography>{chatTitle}</Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <IconButton size="large" edge="end" onClick={colorMode.toggleColorMode} color="inherit" disableFocusRipple={true} disableRipple={true}>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize="large" /> : <Brightness4Icon fontSize="large" />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar