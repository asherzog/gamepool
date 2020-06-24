const bcrypt = require('bcrypt')
const crypto = require('crypto')
const Knex = require('knex')
const tableNames = require('../../common/tableNames')
const teams = require('../../common/teams')

const orderedTables = [
  tableNames.pick,
  tableNames.game,
  tableNames.user_league,
  tableNames.user,
  tableNames.league,
  tableNames.team
]

/**
 * @param {Knex} knex
 */
exports.seed = async (knex) => {
  await orderedTables
    .reduce(async (promise, name) => {
      await promise
      // restart all sequences with the fresh seeds
      await knex(name).del()
      return knex.raw(`ALTER SEQUENCE ${name}_id_seq RESTART WITH 1`) 
    }, Promise.resolve())
  
  // create first user
  const password = crypto.randomBytes(15).toString('hex')
  const user = {
    email: 'andy@null.computer',
    firstName: 'Andy',
    lastName: 'dev',
    password : await bcrypt.hash(password, 12)
  }
  const [createdUser] = await knex(tableNames.user).insert(user).returning('*')
  console.log(`user created: `, {
    password}, createdUser)
  
  // create all the teams
  await knex(tableNames.team).insert(teams).returning('*')
  
  // create first game
  const game = { 
    home_id: 12,
    away_id: 27,
    game_time: new Date(),
    season_week: '20-5'
  }
  await knex(tableNames.game).insert(game).returning('*')

  // create first league
  const league = {
    name: "test league",
    password: await bcrypt.hash("testing", 12),
    scoring: "TIE",
    seasonFee: 10,
    weekFee: 0
  }
  const user_league = {user_id: 1, league_id: 1}
  await knex(tableNames.league).insert(league).returning('*')
  await knex(tableNames.user_league).insert(user_league).returning('*')

  // create first pick
  const pick = {
    league_id: 1,
    user_id: 1,
    game_id: 1,
    team_id: 12,
    home_score: 27,
    away_score: 14
  }
  await knex(tableNames.pick).insert(pick).returning('*')
}
