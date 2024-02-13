/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login"
import Consolas from "./Pages/Consolas";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { SelectedOptionsProvider } from "./Components/Context/SelectedOptionsProvider";



function App() {
  return (
    <Router>
    <SelectedOptionsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </SelectedOptionsProvider>
  </Router>
  );
}

export default App;
