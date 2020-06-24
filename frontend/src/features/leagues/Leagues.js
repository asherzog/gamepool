import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { connect, useDispatch, useSelector } from 'react-redux'
import { fetchAllLeagues, fetchLeague } from './leaguesSlice'

const mapDispatch = { fetchAllLeagues, fetchLeague }

const useStyles = makeStyles(theme => ({
  divider: {
    margin: '1.25rem 0 0.4rem'
  },
  xs8: {
    width: '66%',
  },
}))


function Leagues() {
  const loading = useSelector(state => state.leagues.loading)
  const error = useSelector(state => state.leagues.error)
  const leagues = useSelector(state => state.leagues.leagues)
  const currentLeague = useSelector(state => state.leagues.current)
  const dispatch = useDispatch()
  const classes = useStyles()
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    if (params.id) {
      dispatch(fetchLeague(params.id))
    }
  }, [params.id, dispatch])

  const renderLeagues = (leagues) => {
    if (leagues.length > 0) {
      return (
        <div>
          <Link to="/leagues/join">join a league</Link> or <Link to="/leagues/create">create your own</Link>
          {leagues.map((l, i) => {
            return <div onClick={() => navigate(l.id)} key={i}><pre>{JSON.stringify(l, undefined, 2)}</pre></div>
          })}
        </div>
      )
    } else {
      return (
        <div>
          <p>You don't have any Leagues yet, <Link to="/leagues/join">join a league</Link> or <Link to="/leagues/create">create your own</Link> now!</p>
        </div>
      )
    }
  }

  const renderLeague = (currentLeague) => {
    return <div><pre>{JSON.stringify(currentLeague, undefined, 2)}</pre></div>
  }

  return (
    <Container maxWidth="lg">
      <h1>Leagues:</h1>
      {loading ? 
        <CircularProgress size={54} /> : 
      error ? 
        `ERR: ${error}` :
      params.id ? 
        renderLeague(currentLeague) : 
      renderLeagues(leagues)}
    </Container>
  ) 
}

export default connect(
  null,
  mapDispatch
)(Leagues)