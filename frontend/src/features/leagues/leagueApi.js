import { API_URL } from '../../utils'
const axios = require('axios').default

const leagueApi = {
  async fetchAll(id) {
    return await axios({
      url: `${API_URL}/leagues/users/${id}`,
      method: 'get',
      withCredentials: true
    })
  },
  async fetchOne(id) {
    return await axios({
      url: `${API_URL}/leagues/${id}`,
      method: 'get',
      withCredentials: true
    })
  },
  async create(data) {
    return await axios({
      url: `${API_URL}/leagues`,
      method: 'post',
      withCredentials: true,
      data
    })
  },
  async join(data) {
    return await axios({
      url: `${API_URL}/leagues/${data.id}/users`,
      method: 'post',
      withCredentials: true,
      data
    })
  }
}

export default leagueApi
