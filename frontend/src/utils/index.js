export const handleThunkErr = (err, rejectWithValue) => {
  if (!err.response) {
    return rejectWithValue(JSON.stringify(err))
  }
  return rejectWithValue(err.response.data)
}