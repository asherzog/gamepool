import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const columns = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'wins', label: 'Wins', minWidth: 100 },
  { id: 'total', label: 'Total', minWidth: 100 },
]

const useStyles = makeStyles({
  root: {
    background: '#f2f6fc',
    width: '60%',
  },
  container: {
    // maxHeight: 440,
  },
  link: {
    cursor: 'pointer'
  }
})

export default function Standings() {
  const classes = useStyles()
  const currentLeague = useSelector(state => state.leagues.current)
  const navigate = useNavigate()

  let users = currentLeague.users || []
  users = users.slice().sort((a,b) =>  Number(b.wins) - Number(a.wins))
  const renderBody = () => {
    if (users.length > 0) {
      return users.map((row) => {
        return (
          <TableRow hover key={row.uid} onClick={() => navigate(`/users/${row.uid}`)} className={classes.link}>
            {columns.map((column) => {
              if (column.id === 'name') {
                return <TableCell key={column.id} align='center'>{`${row.firstName} ${row.lastName[0].toUpperCase()}`}</TableCell>
              }
              if (column.id === 'total') {
                return <TableCell key={column.id} align='center'>{`$${(row.wins || 1) * currentLeague.seasonFee}`}</TableCell>
              }
              return <TableCell key={column.id} align='center'>{row[column.id] || 0}</TableCell>
            })}
          </TableRow>
        )
      })
    } else {
      return null
    }
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align='center'>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderBody()}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
