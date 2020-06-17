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
  }
}

export default authApi
