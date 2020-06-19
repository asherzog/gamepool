const axios = require('axios').default
const API_URL = "http://localhost:3000/dev"

const authApi = {
  async login(data) {
    return await axios({
      url: `${API_URL}/auth/login`,
      method: 'post',
      withCredentials: true,
      data
    })
  },
  async register(data) {
    return await axios({
      url: `${API_URL}/auth/register`,
      method: 'post',
      withCredentials: true,
      data
    })
  },
  async getLoggedInUser() {
    return await axios({
      url: `${API_URL}/auth/me`,
      method: 'get',
      withCredentials: true
    })
  }
}

export default authApi
