import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit'
import authApi from './authApi'

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const response = await authApi.login(creds)
    return response.data
  } catch (err) {
    if (!err.response) {
      return rejectWithValue(JSON.stringify(err))
    }
    return rejectWithValue(err.response.data)
  }
})

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.register(data)
    return response.data
  } catch (err) {
    if (!err.response) {
      return rejectWithValue(JSON.stringify(err))
    }
    return rejectWithValue(err.response.data)
  }
})

export const getLoggedInUser = createAsyncThunk('auth/me', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.getLoggedInUser()
    return response.data
  } catch (err) {
    if (!err.response) {
      return rejectWithValue(JSON.stringify(err))
    }
    return rejectWithValue(err.response.data)
  }
})

const setPending = (state) => {
  state.loading = true
  state.error = null
}

const setFulfilled = (state, action) => {
  state.token = action.payload.token
  state.loading = false
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
  name: 'auth',
  initialState: {
    error: null,
    loading: false, 
    token: ''
  },
  reducers: {
    addToken(state, action) {
      state.token = action.payload
    }
  },
  extraReducers: {
    [loginUser.pending]: (state) => setPending(state),
    [loginUser.fulfilled]: (state, action) => setFulfilled(state, action),
    [loginUser.rejected]: (state, action) => setRejected(state, action),
    [registerUser.pending]: (state) => setPending(state),
    [registerUser.fulfilled]: (state, action) => setFulfilled(state, action),
    [registerUser.rejected]: (state, action) => setRejected(state, action),
    [getLoggedInUser.pending]: (state, action) => {console.log(action)},
    [getLoggedInUser.fulfilled]: (state, action) => {console.log(action)},
    [getLoggedInUser.rejected]: (state, action) => {console.log(action)}
  }
})

const reducer = slice.reducer
export default reducer

export const { addToken } = slice.actions