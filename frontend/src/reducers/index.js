import { combineReducers } from 'redux'
import authReducer from '../features/auth/authSlice'
import leaguesReducer from '../features/leagues/leaguesSlice'

export default combineReducers({
  auth: authReducer,
  leagues: leaguesReducer
})
