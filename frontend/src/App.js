import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import logo from './logo.svg'
import './App.css'
import Container from '@material-ui/core/Container'
import { connect, useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getLoggedInUser } from './features/auth/authSlice'
import { Button } from '@material-ui/core'

const mapDispatch = { getLoggedInUser }

const Home = () => {
  const dispatch = useDispatch()
  const req = () => {
    dispatch(getLoggedInUser())
  }

  return (
    <Container maxWidth="sm" className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Button  
        fullWidth
        variant="outlined" 
        aria-label="login" 
        color="primary" 
        onClick={() => req()}>
        Fetch
      </Button>
    </Container>
  )
}

function App() {
  const token = useSelector(state => state.auth.token)
  const WithAuth = ({ children }) => {
    if (!token) {
      axios.defaults.headers.common['Authorization'] = null;
      return <Navigate to={'/login'} />
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return children
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <WithAuth>
        <Route path="/" element={<Home />} />
      </WithAuth>
    </Routes>
)}

connect(null, mapDispatch)(Home)
export default connect(null, null)(App)
