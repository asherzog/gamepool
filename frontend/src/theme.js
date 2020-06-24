import { red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'
// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#007494',
      light: '#007494',
      dark: '#21a1c4',
    },
    secondary: {
      main: '#b5ecfb',
      light: '#007494',
      dark: '#21a1c4',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f0f4fc',
    },
    text: {
      primary: '#2e3c40'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(',')
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: '#fff', // 5d737e
      },
    },
    MuiButton: {
      root: {
        margin: '5px',
      },
    },
  },
});
export default theme;