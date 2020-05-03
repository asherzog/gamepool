const bcrypt = require('bcrypt')
const crypto = require('crypto')
const Knex = require('knex')
const tableNames = require('../../src/constants/tableNames')
const teams = require('../../src/constants/teams')

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
      return knex(name).del()
    }, Promise.resolve())

  const password = crypto.randomBytes(15).toString('hex')

  const user = {
    email: 'andy@null.computer',
    name: 'Andy',
    password : await bcrypt.hash(password, 12)
  }

  const [createdUser] = await knex(tableNames.user).insert(user).returning('*')

  console.log(`user created: `, {
    password}, createdUser);
  
  await knex(tableNames.team).insert(teams).returning('*')
};
