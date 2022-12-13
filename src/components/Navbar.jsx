import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import { logout } from '../services/firebase';
import { auth } from '../services/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../theme'
import { Box, Toolbar, Tooltip, Typography } from '@mui/material';
import Face2RoundedIcon from '@mui/icons-material/Face2Rounded';
import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';

const Navbar = ({chatTitle = undefined, open, setOpen}) => {
    const [user, loading, error] = useAuthState(auth);
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