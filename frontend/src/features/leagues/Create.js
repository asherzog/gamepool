import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import { useNavigate } from 'react-router-dom'

import { connect, useDispatch, useSelector } from 'react-redux'
import { createLeague } from './leaguesSlice'

const mapDispatch = { createLeague }

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

function Create() {
  const loading = useSelector(state => state.leagues.loading)
  const authError = useSelector(state => state.leagues.error)
  const { errors, control, register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const classes = useStyles()
  const navigate = useNavigate()

  const onSubmit = async data => {
    let res = await dispatch(createLeague(data))
    if (!res.error) {
      navigate('/leagues')
    }
  }

  const scoringOptions = [
    {
      value: 'TIE',
      label: 'Tie Breaker Game Only'
    },
    {
      value: 'ALL',
      label: 'Always (closest score only)'
    },
    {
      value: 'NEVER',
      label: 'Never (split ties)'
    }
  ]

  return (
    <Container maxWidth="sm">
      <Paper className={classes.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} direction="column" justify="center" alignItems="center">
            <h1>GamePool</h1>
            <h3>Create A League</h3>
            <Grid item className={classes.xs8}>
              <TextField
                id="name"
                inputRef={register({ required: true })}
                label="League Name"
                fullWidth
                name="name"
                error={!!errors.name}
                helperText={errors.name && 'Required'}
              />
            </Grid>
            <Grid item className={classes.xs8}>
              <TextField
                id="password"
                inputRef={register({ required: true })}
                label="League Password"
                fullWidth
                name="password"
                error={!!errors.password || !!authError}
                helperText={errors.password ? 'Required' : authError ? authError : null}
              />
            </Grid>
            <Grid item className={classes.xs8}>
              <Controller
                as={<TextField select />}
                control={control}
                fullWidth
                id="scoring"
                label="Users predict score"
                rules={{ required: true }}
                onChange={([selected]) => selected}
                name="scoring"
                defaultValue={scoringOptions[0].value} >
                  {scoringOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Controller>
            </Grid>
            <Grid item className={classes.xs8}>
              <TextField
                id="seasonFee"
                type='number'
                inputRef={register({ required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                  onKeyPress: ((e) => {
                    if (e.key === '.') { // only allow whole amounts
                      e.preventDefault()
                    }
                  })
                }}
                label="Season Starting Fee"
                fullWidth
                name="seasonFee"
                error={!!errors.seasonFee}
                helperText={errors.seasonFee && 'Required'}
              />
            </Grid>
            <Grid item className={classes.xs8}>
              <TextField
                id="weekFee"
                type='number'
                inputRef={register({ required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                  onKeyPress: ((e) => {
                    if (e.key === '.') { // only allow whole amounts
                      e.preventDefault()
                    }
                  })
                }}
                label="Weekly Fee"
                fullWidth
                name="weekFee"
                error={!!errors.weekFee}
                helperText={errors.weekFee && 'Required'}
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
              <p>Already know of a league? <a href="/leagues/join">join existing</a></p>
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
)(Create)