import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import UserTxn from './components/userTxn/userTxn';



function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login  />} />
        <Route path="/dashboard" exact element={<Dashboard />} />
        <Route path="/userTxn" exact element={<UserTxn /> } />
      </Routes>
    </>
  )
}

export default App
