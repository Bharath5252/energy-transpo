import React from 'react'
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/dashboard" exact element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
