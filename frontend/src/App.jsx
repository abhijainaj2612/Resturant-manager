import { useState } from 'react'
import {Routes, Route} from "react-router-dom";
import Home from './components/Home';
import Admin from './components/Admin';
import Login from './components/Login';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App
