export const API_URL = "http://localhost:3000/dev"

export const handleThunkErr = (err, rejectWithValue) => {
  if (!err.response) {
    return rejectWithValue(JSON.stringify(err))
  }
  return rejectWithValue(err.response.data)
}

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 4) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}