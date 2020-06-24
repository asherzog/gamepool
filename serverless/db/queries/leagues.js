const knex = require('../connection')
const tableNames = require('../../common/tableNames')

function createLeague(league) {
  return knex(tableNames.league)
    .insert(league)
    .returning(['id', 'name', 'scoring', 'seasonFee', 'weekFee', 'created_at'])
}

function deleteLeague(id) {
  return knex(tableNames.league)
    .update('deleted_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning(['id', 'name', 'created_at', 'deleted_at'])
}


function getAllLeagues() {
  return knex
    .select('id', 'name', 'created_at')
    .from(tableNames.league)
    .whereNull('deleted_at')
}

function getAllLeaguesForUser(id) {
  return knex
    .select(
      'league.id',
      'league.name', 
      'league.scoring', 
      'league.seasonFee', 
      'league.weekFee', 
      'league.created_at', 
      'league.updated_at', 
      'user_league.user_id', 
      'user_league.is_admin', 
      'user_league.is_creator' 
    )
    .from(tableNames.league)
    .innerJoin(tableNames.user_league, 'league.id', 'user_league.league_id')
    .where({ user_id: parseInt(id) })
    .whereNull('user_league.deleted_at')
}

function getLeagueById(id) {
  return knex
    .select('id', 'name', 'password', 'scoring', 'seasonFee', 'weekFee', 'created_at', 'deleted_at', 'updated_at')
    .from(tableNames.league)
    .where({ id: parseInt(id) })
}

function updateLeague(id, league) {
  return knex(tableNames.league)
    .update(league)
    .update('updated_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning(['id', 'name', 'scoring', 'seasonFee', 'weekFee', 'created_at', 'updated_at'])
}

module.exports = {
  createLeague,
  deleteLeague,
  getAllLeagues,
  getAllLeaguesForUser,
  getLeagueById,
  updateLeague
}