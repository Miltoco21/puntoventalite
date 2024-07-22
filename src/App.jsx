/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ProtectedRoute from "./Components/ProtectedRoute"
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { SelectedOptionsProvider } from "./Components/Context/SelectedOptionsProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const [userData, setUserData] = useState(null);

  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SelectedOptionsProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login setUserData={setUserData} />} />
            <Route 
              path="/home" 
              element={<ProtectedRoute element={<Home />} />} 
            />
          </Routes>
        </SelectedOptionsProvider>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
