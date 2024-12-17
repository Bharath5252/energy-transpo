import React from 'react'
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from './components/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
