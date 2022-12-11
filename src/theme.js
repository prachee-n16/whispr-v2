import { createContext, useMemo, useState } from "react";
import { createTheme, responsiveFontSizes } from '@mui/material';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const Theme = () => {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    let theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? { primary: { main: '#FFFFFF' }, secondary: { main: '#121212' } }
                        : { primary: { main: '#121212' }, secondary: { main: '#FFFFFF' } }
                    )
                },
                typography: {
                    fontFamily: 'Inter, sans-serif',
                    h1: {
                        fontWeight: 600
                    }
                }
            }),
        [mode],
    );

    //theme = responsiveFontSizes(theme);

    return (
        {colorMode, theme}
    )
}