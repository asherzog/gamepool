import React, { useEffect } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import Leagues from './features/leagues/Leagues'
import Create from './features/leagues/Create'
import Join from './features/leagues/Join'
import logo from './logo.svg'
import MainLayout from './features/layout/MainLayout'
import './App.css'
import Container from '@material-ui/core/Container'
import { connect, useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getLoggedInUser } from './features/auth/authSlice'

const mapDispatch = { getLoggedInUser }

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: 35
  }
}))

const Home = () => {
  const user = useSelector(state => state.auth.user)
  return (
    <Container maxWidth="lg">
      <img src={logo} className="App-logo" alt="logo" />
      <div><pre>{JSON.stringify(user, undefined, 2)}</pre></div>
    </Container>
  )
}

function App() {
  const location = useLocation()
  const token = useSelector(state => state.auth.token)
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const classes = useStyles()

  const WithAuth = ({path, element, ...rest}) => {
    if (!token) {
      axios.defaults.headers.common['Authorization'] = null;
      return <Navigate to={'/login'} state={location} />
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return user.id ? <Route path={path} element={element} {...rest} /> : null
  }

  useEffect(() => {
    if (token && !user.id) {
      dispatch(getLoggedInUser())
    }
  }, [dispatch, token, user.id])

  return (
    <div>
      {location.pathname.includes('/login') || location.pathname.includes('/register') ?
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes> :
        <div className={classes.root}>
          <MainLayout />
        <Routes>
          <WithAuth path="/" element={<Home />} />
          <WithAuth path="/leagues" element={<Leagues />} />
          <WithAuth path="/leagues/create" element={<Create />} />
          <WithAuth path="/leagues/join" element={<Join />} />
          <WithAuth path="/leagues/:id" element={<Leagues />} />
        </Routes>
        </div>
      }
    </div>
)}

connect(null, mapDispatch)(Home)
export default connect(null, mapDispatch)(App)
