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
      throw err
    }
    return rejectWithValue(err.response.data)
  }
})

export const slice = createSlice({
  name: 'auth',
  initialState: {
    error: null,
    loading: false, 
    token: ''
  },
  reducers: {},
  extraReducers: {
    [loginUser.pending]: (state) => {
      state.loading = true
      state.error = null
    },
    [loginUser.fulfilled]: (state, action) => {
      state.token = action.payload.token
      state.loading = false
    },
    [loginUser.rejected]: (state, action) => {
      console.log(action)
      state.loading = false
      if (action.payload) {
        // If a rejected action has a payload, it means that it was returned with rejectWithValue
        state.error = action.payload.error
      } else {
        state.error = action.error
      }
    }
  }
})

const reducer = slice.reducer
export default reducer