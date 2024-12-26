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


function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login  />} />
        <Route path="/signup" exact element={<SignUp/>} />
        <Route path="/dashboard" exact element={<Dashboard />} />
        <Route path="/vehicle" exact element={<Vehicle />} />
        <Route path="/userTxn" exact element={<UserTxn /> } />
        <Route path="/tranactions" exact element={<NewTransaction />} />
        <Route path="/transactions/current" exact element={<CurrentTransactions />} />
        <Route path="/transactions/past" exact element={<PastTransactions />} />
      </Routes>
    </>
  )
}

export default App
