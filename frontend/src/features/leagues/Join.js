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
import { joinLeague } from './leaguesSlice'

const mapDispatch = { joinLeague }

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: 40,
    marginRight: 40
  },
  divider: {
    margin: '1.25rem 0 0.4rem'
  },
  xs8: {
    width: '66%',
  },
}))

function Join() {
  const loading = useSelector(state => state.leagues.loading)
  const authError = useSelector(state => state.leagues.error)
  const { errors, register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const classes = useStyles()
  const navigate = useNavigate()

  const onSubmit = async data => {
    let res = await dispatch(joinLeague(data))
    if (!res.error) {
      navigate('/leagues')
    }
  }
  
  return (
    <Container maxWidth="sm">
      <Paper className={classes.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} direction="column" justify="center" alignItems="center">
            <h1>GamePool</h1>
            <h3>Join A League</h3>
            <Grid item className={classes.xs8}>
              <TextField
                id="id"
                inputRef={register({ required: true })}
                label="League Identifier"
                fullWidth
                name="id"
                error={!!errors.id}
                helperText={errors.id && 'Required'}
              />
            </Grid>
            <Grid item className={classes.xs8}>
              <TextField
                id="password"
                type="password"
                inputRef={register({ required: true })}
                label="League Password"
                fullWidth
                name="password"
                error={!!errors.password || !!authError}
                helperText={errors.password ? 'Required' : authError ? authError : null}
              />
            </Grid>
            <Grid item xs={12}>
              <Button disabled={loading} fullWidth type="submit" variant="outlined" aria-label="join" color="primary" >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
          <Divider variant="middle" className={classes.divider} />
          <Grid container spacing={3} direction="column" justify="center" alignItems="center">
            <Grid item>
              <p>Need a new league? <a href="/leagues/create">create one</a></p>
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
)(Join)