import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import UserTxn from './components/userTxn/userTxn';

import CurrentTransactions from './components/Transactions/CurrentTransactions';
import PastTransactions from './components/Transactions/PastTransactions';
import NewTransaction from './components/Transactions/NewTransaction';
import SignUp from './components/Login/SignUp';
import Vehicle from './components/Vehicle Dashboard/Vehicle';
import SnackbarComp from './components/Reusables/CustomSnackbar';
import Profile from './components/Profile/Profile';
import VehicleInventory from './components/Vehicle Dashboard/VehicleInventory';
import AddVehicle from './components/Vehicle Dashboard/AddVehicle';
import Posts from './components/Transactions/Posts';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Login  />} />
        <Route path="/login" exact element={<Login  />} />
        <Route path="/signup" exact element={<SignUp/>} />
        <Route path="/home" exact element={<Home />} />
        <Route path="/profile" exact element={<Profile />} />
        <Route path="/vehicleDashboard" exact element={<Vehicle />} />
        <Route path="/vehicleDashboard/add" exact element={<AddVehicle />} />
        <Route path="/vehicleDashboard/inventory" exact element={<VehicleInventory/>} />
        <Route path="/userTxn" exact element={<UserTxn /> } />
        <Route path="/dashboard" exact element={<Dashboard />} />
        <Route path="/transactions" exact element={<NewTransaction />} />
        <Route path="/transactions/current" exact element={<CurrentTransactions />} />
        <Route path="/transactions/post" exact element={<Posts />} />
        <Route path="/transactions/past" exact element={<PastTransactions />} />
      </Routes>
      <SnackbarComp />
    </>
  )
}

export default App
