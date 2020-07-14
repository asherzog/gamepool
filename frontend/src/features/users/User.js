import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { useSelector } from 'react-redux'

const useStyles = makeStyles({
  root: {
    marginTop: 35
  },
})

export default function User() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      Hello from user
    </div>
  )
}
