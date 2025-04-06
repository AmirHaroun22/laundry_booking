import React from "react";
import {Navigate, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Booking from "./components/Booking";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Booking />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
