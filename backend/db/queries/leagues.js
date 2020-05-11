const knex = require('../connection')
const tableNames = require('../../src/constants/tableNames')

function createLeague(league) {
  return knex(tableNames.league)
    .insert(league)
    .returning(['id', 'name', 'created_at'])
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

function getLeagueById(id) {
  return knex
    .select('id', 'name', 'created_at', 'deleted_at', 'updated_at')
    .from(tableNames.league)
    .where({ id: parseInt(id) })
}

function updateLeague(id, league) {
  return knex(tableNames.league)
    .update(league)
    .update('updated_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning(['id', 'name', 'created_at', 'updated_at'])
}

module.exports = {
  createLeague,
  deleteLeague,
  getAllLeagues,
  getLeagueById,
  updateLeague
}