const axios = require('axios')
const parsePgConnStr = require('pg-connection-string').parse

module.exports = {
  getPgConfig: async () => {
    try {
      const herokuApiKey = process.env.API_KEY
      const herokuPostgresId = process.env.PG_ID
      const herokuApi = axios.create({
        baseURL: 'https://api.heroku.com/',
        headers: {
          'Authorization': `Bearer ${herokuApiKey}`,
          'Accept': 'application/vnd.heroku+json; version=3'
        }
      })

      const herokuRes = await herokuApi.get(`addons/${herokuPostgresId}/config`);
      const pgConnStr = herokuRes.data[0].value;

      // Use connection string from Heroku API response as a base. Overwrite "max"
      // and "ssl".
      const pgConfig = {
        ...parsePgConnStr(pgConnStr),
        ...{
          max: 1,
          ssl: { rejectUnauthorized: false }
        }
      }
      return pgConfig
    } catch (e) {
      throw e
    }
  },
  handleError: (e, status = null, msg = null) => {
    console.log(e)
    return {
      statusCode: status || 500,
      body: JSON.stringify({
        error: msg || e.message
      })
    }
  }
}