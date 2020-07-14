const bcrypt = require('bcrypt')
const crypto = require('crypto')
const Knex = require('knex')
const tableNames = require('../../common/tableNames')
const teams = require('../../common/teams')
const { team } = require('../../common/tableNames')

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
  let user = {
    email: 'andy@null.computer',
    firstName: 'Andy',
    lastName: 'dev',
    password : await bcrypt.hash(password, 12)
  }
  const [createdUser] = await knex(tableNames.user).insert(user).returning('*')
  user.email = 'test@test.com'
  user.firstName = 'dude'
  const [createdUser2] = await knex(tableNames.user).insert(user).returning('*')
  console.log(`user created: `, {
    password}, createdUser)
  
  // create all the teams
  await knex(tableNames.team).insert(teams).returning('*')
  
  // create first game
  const game = { 
    home_id: 12,
    away_id: 27,
    winning_id: 12,
    game_time: new Date(),
    season_week: '20-5'
  }
  const game2 = { 
    home_id: 12,
    away_id: 24,
    winning_id: 12,
    game_time: new Date(),
    season_week: '20-4'
  }
  const game3 = { 
    home_id: 12,
    away_id: 3,
    winning_id: 12,
    game_time: new Date(),
    season_week: '20-3'
  }
  await knex(tableNames.game).insert(game).returning('*')
  await knex(tableNames.game).insert(game2).returning('*')
  await knex(tableNames.game).insert(game3).returning('*')

  // create first league
  const league = {
    name: "test league",
    password: await bcrypt.hash("testing", 12),
    scoring: "TIE",
    seasonFee: 10,
    weekFee: 0
  }
  let user_league = {user_id: 1, league_id: 1}
  await knex(tableNames.league).insert(league).returning('*')
  await knex(tableNames.user_league).insert(user_league).returning('*')
  user_league.user_id = 2
  await knex(tableNames.user_league).insert(user_league).returning('*')

  // create first pick
  let pick = {
    league_id: 1,
    user_id: 1,
    game_id: 1,
    team_id: 12,
    home_score: 27,
    away_score: 14
  }
  let pick2 = {
    league_id: 1,
    user_id: 1,
    game_id: 1,
    team_id: 12,
    home_score: 45,
    away_score: 10
  }
  let pick3 = {
    league_id: 1,
    user_id: 1,
    game_id: 1,
    team_id: 3,
    home_score: 30,
    away_score: 14
  }
  await knex(tableNames.pick).insert(pick).returning('*')
  await knex(tableNames.pick).insert(pick2).returning('*')
  await knex(tableNames.pick).insert(pick3).returning('*')
  pick3.team_id = 12
  pick.user_id = 2
  pick2.user_id = 2
  pick3.user_id = 2
  await knex(tableNames.pick).insert(pick).returning('*')
  await knex(tableNames.pick).insert(pick2).returning('*')
  await knex(tableNames.pick).insert(pick3).returning('*')
}

