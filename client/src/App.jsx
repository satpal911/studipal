import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Courses from './pages/Courses'
import About from './pages/About'
import Register from './pages/Register'
import Login from './pages/Login'
import MentorLogin from './pages/MentorLogin'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import MentorDashboard from './pages/MentorDashboard'
import Dashboard from './pages/userDashboard'
import LandingPage from './pages/LandingPage'
import Contact from './pages/Contact'

const App = () => {
  return (
    <div>
      <Navbar />  
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/register" element={<Register />} />     
        <Route path="/user/login" element={<Login />} />
        <Route path="/mentor/login" element={<MentorLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route path="/admin/mentor/register" element={<MentorRegister />} />     */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
