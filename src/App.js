import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login  />} />
        <Route path="/dashboard" exact element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
