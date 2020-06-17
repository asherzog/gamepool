import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import Login from './features/auth/Login'
import theme from './theme'
import * as serviceWorker from './serviceWorker'
import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer
})

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Login />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root'),
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();