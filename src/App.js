import { Route, Routes } from "react-router-dom"
import Landing from "./container/Landing";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default App;
