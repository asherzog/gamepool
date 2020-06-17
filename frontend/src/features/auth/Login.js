import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Lock from '@material-ui/icons/Lock'

import { connect, useDispatch, useSelector } from 'react-redux'
import { loginUser } from './authSlice'

const mapDispatch = { loginUser }

const useStyles = makeStyles(theme => ({
  divider: {
    margin: '1.25rem 0 0.4rem'
  },
  xs8: {
    width: '66%',
  },
}))

function App() {
  const loading = useSelector(state => state.auth.loading)
  const authError = useSelector(state => state.auth.error)
  const { errors, register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const classes = useStyles()

  const onSubmit = data => dispatch(loginUser(data))

  return (
    <Container maxWidth="sm">
      <Paper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} direction="column" justify="center" alignItems="center">
            <h1>GamePool</h1>
            <Grid item className={classes.xs8}>
              <TextField
                  id="email"
                  inputRef={register({ required: true })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  label="Email"
                  fullWidth
                  name="email"
                  error={!!errors.email}
                  helperText={errors.email && 'Required'}
                />
            </Grid>
            <Grid item className={classes.xs8}>
              <TextField
                id="password"
                inputRef={register({ required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  )
                }}
                label="Password"
                fullWidth
                type="password"
                name="password"
                error={!!errors.password || !!authError}
                helperText={errors.password ? 'Required' : authError ? authError : null}
              />
            </Grid>
            <Grid item xs={12}>
              <Button disabled={loading} fullWidth type="submit" variant="outlined" aria-label="login" color="primary" >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Grid>
          </Grid>
          <Divider variant="middle" className={classes.divider} />
          <Grid container spacing={3} direction="column" justify="center" alignItems="center">
            <Grid item>
              <p>New User? <a href="/">register</a></p>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  ) 
}

export default connect(
  null,
  mapDispatch
)(App)