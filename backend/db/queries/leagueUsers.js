const knex = require('../connection')
const tableNames = require('../../src/constants/tableNames')

async function createLeagueUser(user) {
  const { user_id, league_id } = user
  // check if user is already assigned to league
  const fetchedUser = await knex
  .select('id', 'league_id', 'user_id', 'is_admin', 'is_creator')
  .from(tableNames.user_league)
  .where({ user_id, league_id })  

  if (fetchedUser.length) return fetchedUser

  return knex(tableNames.user_league)
    .insert(user)
    .returning(['id', 'league_id', 'user_id', 'is_admin', 'is_creator'])
}

function deleteLeagueUser(id) {
  return knex(tableNames.user_league)
    .update('deleted_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning(['id', 'league_id', 'user_id', 'is_admin', 'is_creator', 'deleted_at'])
}

function deleteUserFromLeague(league_id, user_id) {
  return knex(tableNames.user_league)
    .update('deleted_at', knex.fn.now())
    .where({ league_id: parseInt(league_id), user_id: parseInt(user_id) })
    .returning(['id', 'league_id', 'user_id', 'is_admin', 'is_creator', 'deleted_at'])
}

function deleteAllLeagueUsers(id) {
  return knex(tableNames.user_league)
    .update('deleted_at', knex.fn.now())
    .where({ league_id: parseInt(id) })
    .returning(['id', 'league_id', 'user_id', 'is_admin', 'is_creator', 'deleted_at'])
}

function getAllLeagueUsers(id) {
  return knex
    .select(
      'user.id as user_id',
      'user.name as user_name', 
      'user.email',
      'user_league.is_admin'
    )
    .from(tableNames.user)
    .innerJoin(tableNames.user_league, 'user.id', 'user_league.user_id')
    .innerJoin(tableNames.league, 'league.id', 'user_league.league_id')
    .where({ league_id: parseInt(id) })
    .whereNull('user_league.deleted_at')
}

function getLeagueUserById(id) {
  return knex
    .select('id', 'league_id', 'user_id', 'is_admin', 'is_creator')
    .from(tableNames.user_league)
    .where({ id: parseInt(id) })
}

function updateLeagueUser(id, user) {
  return knex(tableNames.user_league)
    .update(user)
    .update('updated_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning(['id', 'league_id', 'user_id', 'is_admin', 'is_creator'])
}

module.exports = {
  createLeagueUser,
  deleteLeagueUser,
  deleteAllLeagueUsers,
  deleteUserFromLeague,
  getAllLeagueUsers,
  getLeagueUserById,
  updateLeagueUser
}