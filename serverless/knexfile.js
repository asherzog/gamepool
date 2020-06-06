const { getPgConfig } = require('./common')

module.exports = {
  development: {
    client: 'pg',
    connection: async () => {
      return await getPgConfig()
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
}
