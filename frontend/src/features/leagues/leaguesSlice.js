import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit'
import leagueApi from './leagueApi'
import { handleThunkErr } from '../../utils'

export const fetchAllLeagues = createAsyncThunk('leagues/fetchAll', async (data, { rejectWithValue }) => {
  try {
    const response = await leagueApi.fetchAll(data)
    return response.data
  } catch (err) {
    return handleThunkErr(err, rejectWithValue)
  }
})

export const fetchLeague = createAsyncThunk('leagues/fetchOne', async (data, { rejectWithValue }) => {
  try {
    const response = await leagueApi.fetchOne(data)
    return response.data
  } catch (err) {
    return handleThunkErr(err, rejectWithValue)
  }
})

export const createLeague = createAsyncThunk('leagues/create', async (data, { rejectWithValue }) => {
  try {
    const response = await leagueApi.create(data)
    return response.data
  } catch (err) {
    return handleThunkErr(err, rejectWithValue)
  }
})

export const joinLeague = createAsyncThunk('leagues/create', async (data, { rejectWithValue }) => {
  try {
    const response = await leagueApi.join(data)
    return response.data
  } catch (err) {
    return handleThunkErr(err, rejectWithValue)
  }
})

const setPending = (state) => {
  state.loading = true
  state.error = null
  state.current = {}
}

const setRejected = (state, action) => {
  state.loading = false
  if (action.payload) {
  // If a rejected action has a payload, it means that it was returned with rejectWithValue
    state.error = action.payload.error
  } else {
    state.error = action.error
  }
}

export const slice = createSlice({
  name: 'leagues',
  initialState: {
    error: null,
    loading: false, 
    leagues: [],
    current: {}
  },
  reducers: {},
  extraReducers: {
    [fetchAllLeagues.pending]: (state) => setPending(state),
    [fetchAllLeagues.rejected]: (state, action) => setRejected(state, action),
    [fetchAllLeagues.fulfilled]: (state, action) => { 
      state.leagues = action.payload 
      state.loading = false
    },
    [createLeague.pending]: (state) => setPending(state),
    [createLeague.rejected]: (state, action) => setRejected(state, action),
    [createLeague.fulfilled]: (state, action) => { 
      state.leagues.push(action.payload)
      state.loading = false
    },
    [joinLeague.pending]: (state) => setPending(state),
    [joinLeague.rejected]: (state, action) => setRejected(state, action),
    [joinLeague.fulfilled]: (state, action) => { 
      state.leagues.push(action.payload)
      state.loading = false
    },
    [fetchLeague.pending]: (state) => setPending(state),
    [fetchLeague.rejected]: (state, action) => setRejected(state, action),
    [fetchLeague.fulfilled]: (state, action) => { 
      state.current = action.payload
      state.loading = false
    }
  }
})

const reducer = slice.reducer
export default reducer