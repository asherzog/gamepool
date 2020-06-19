import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import logo from './logo.svg'
import './App.css'
import Container from '@material-ui/core/Container'
import { connect, useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getLoggedInUser, logout } from './features/auth/authSlice'
import { Button } from '@material-ui/core'

const mapDispatch = { getLoggedInUser, logout }

const Home = () => {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const req = () => {
    dispatch(getLoggedInUser())
  }
  const logoutUser = () => {
    return dispatch(logout())
  }
  return (
    <Container maxWidth="sm" className="App">
      <Button  
        fullWidth
        aria-label="login" 
        color="primary" 
        onClick={() => logoutUser()}>
        logout
      </Button>
      <img src={logo} className="App-logo" alt="logo" />
      <Button  
        fullWidth
        variant="outlined" 
        aria-label="login" 
        color="primary" 
        onClick={() => req()}>
        Fetch
      </Button>
      <div><pre>{JSON.stringify(user, undefined, 2)}</pre></div>
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
    <section>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <WithAuth>
          <Route path="/" element={<Home />} />
        </WithAuth>
      </Routes>
    </section>
)}

connect(null, mapDispatch)(Home)
export default connect(null, null)(App)
