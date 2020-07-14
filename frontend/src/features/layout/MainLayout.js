import React, { useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { connect, useDispatch, useSelector } from 'react-redux'
import { fetchAllLeagues } from '../leagues/leaguesSlice'
import { logout } from '../auth/authSlice'
import { stringToColor } from '../../utils'
import AccountCircle from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import LinearProgress from '@material-ui/core/LinearProgress'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

const mapDispatch = { fetchAllLeagues, logout }

const drawerWidth = 210
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    }
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    background: '#dde3f0'
  },
  account: {
    marginRight: 5
  },
  grw: {
    flexGrow: 1
  },
  title: {
    cursor: 'pointer'
  },
  smIcon: {
    height: theme.spacing(3.75),
    width: theme.spacing(3.75)
  }
}))

const MainLayout = ({ window }) => {
  const user = useSelector(state => state.auth.user)
  const leagues = useSelector(state => state.leagues.leagues)
  const loading = useSelector(state => state.leagues.loading)
  const navigate = useNavigate()
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (user.id) {
      dispatch(fetchAllLeagues(user.id))
    }
  }, [dispatch, user.id])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const container = window !== undefined ? () => window().document.body : undefined

  const renderDefaults = () => {
    return (
      <div>
        <ListItem button onClick={() => navigate(`/leagues/create`)}>
          <ListItemAvatar>
            <Avatar className={classes.smIcon} style={{backgroundColor: '#007494'}}><AddIcon /></Avatar>
          </ListItemAvatar>
          <ListItemText primary='New League' />
        </ListItem>
        <ListItem button onClick={() => navigate(`/leagues/join`)}>
          <ListItemAvatar>
            <Avatar className={classes.smIcon} style={{backgroundColor: '#007494'}}><GroupAddIcon /></Avatar>
          </ListItemAvatar>
          <ListItemText primary='Join League' />
        </ListItem>
      </div>
    )
  }

  const renderLeagues = () => {
    if (loading) {
      return (
        <div>
         <span>Loading...</span>
          <LinearProgress color="secondary" />
        </div>
      )
    } else if (leagues.length === 0) {
      return renderDefaults()
    } else {
      return (
        <div>
          <Typography 
            align='center' 
            variant='h6' 
            className={classes.title}
            onClick={() => navigate('/leagues')}>
              Leagues
          </Typography>
          {leagues.map((league) => (
            <ListItem button key={league.id} onClick={() => navigate(`/leagues/${league.id}`)}>
              <ListItemAvatar>
                <Avatar className={classes.smIcon} style={{backgroundColor: stringToColor(league.name)}}>{league.name[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={league.name} />
            </ListItem>
          ))}
          <Divider />
          {renderDefaults()}
        </div>
      )
    }
  }

  const accountIcon = (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle className={classes.account} />
        {user.firstName}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open} 
        onClose={handleClose} >
        <MenuItem onClick={handleClose}>My Account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  )

  const drawer = ( 
    <div className={classes.drawerContainer}>
      <List>
        {renderLeagues()}
      </List>
    </div>
  )

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h4' className={classes.title} onClick={() => navigate('/')}>
            GamePool
          </Typography>
          <span className={classes.grw} />
          {accountIcon}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="leagues">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  )
}

export default connect(null, mapDispatch)(MainLayout)
