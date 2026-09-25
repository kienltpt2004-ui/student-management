import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Subjects from './pages/Subject'
import Classes from './pages/Class'
import Attendance from './pages/Attendance'
import Exams from './pages/Exams'
import Results from './pages/Results'

function Protected() {
  return localStorage.getItem('sms_token') ? <Layout/> : <Navigate to="/login" replace/>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route element={<Protected/>}>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/students" element={<Students/>}/>
        <Route path="/teachers" element={<Teachers/>}/>
        <Route path="/subjects" element={<Subjects/>}/>
        <Route path="/classes" element={<Classes />} />
        <Route path="/attendance" element={<Attendance/>}/>
        <Route path="/exams" element={<Exams/>}/>
        <Route path="/results" element={<Results/>}/>
      </Route>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}
