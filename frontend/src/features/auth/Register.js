import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import { useNavigate } from 'react-router-dom'

import { connect, useDispatch, useSelector } from 'react-redux'
import { registerUser } from './authSlice'

const mapDispatch = { registerUser }

const useStyles = makeStyles(theme => ({
  divider: {
    margin: '1.25rem 0 0.4rem'
  },
  xs8: {
    width: '66%',
  },
}))

function Register() {
  const loading = useSelector(state => state.auth.loading)
  const authError = useSelector(state => state.auth.error)
  const { errors, register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const classes = useStyles()
  const navigate = useNavigate()

  const onSubmit = async data => {
    let res = await dispatch(registerUser(data))
    if (!res.error) {
      navigate('/')
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} direction="column" justify="center" alignItems="center">
            <h1>GamePool</h1>
            <h3>New User Sign Up</h3>
            <Grid item className={classes.xs8}>
              <TextField
                  id="firstName"
                  inputRef={register({ required: true })}
                  label="First Name"
                  fullWidth
                  name="firstName"
                  error={!!errors.firstName}
                  helperText={errors.firstName && 'Required'}
                />
              <TextField
                id="lastName"
                inputRef={register({ required: true })}
                label="Last Name"
                fullWidth
                name="lastName"
                error={!!errors.lastName}
                helperText={errors.lastName && 'Required'}
              />
              <TextField
                id="email"
                inputRef={register({ required: true })}
                label="Email"
                fullWidth
                name="email"
                error={!!errors.email}
                helperText={errors.email && 'Required'}
              />
              <TextField
                id="password"
                inputRef={register({ required: true })}
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
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
          <Divider variant="middle" className={classes.divider} />
          <Grid container spacing={3} direction="column" justify="center" alignItems="center">
            <Grid item>
              <p>Already a User? <a href="/login">sign in</a></p>
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
)(Register)