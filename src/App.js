import { Route, Routes } from "react-router-dom"
import Landing from "./container/Landing";
import { ThemeProvider } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { ColorModeContext, Theme } from './theme'
import Chat from './container/ChatApp/Chat'
function App() {
  
  const {colorMode, theme} = Theme();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" exact element={<Landing />} />
          <Route path="/app" exact element={<Chat />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
