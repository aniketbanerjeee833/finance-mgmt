import React from 'react'
import Dashboard from './Pages/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Pdf from './Pages/Pdf'

export default function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pdf" element={<Pdf/>} />
      </Routes>
    </BrowserRouter>
  )

}
