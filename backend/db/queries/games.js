const knex = require('../connection')
const tableNames = require('../../src/constants/tableNames')

function createGame(game) {
  return knex(tableNames.game)
    .insert(game)
    .returning('*')
}

function getAllGames() {
  return knex
    .select('*')
    .from(tableNames.game)
    .whereNull('deleted_at')
}

function getGameById(id) {
  return knex
    .select('*')
    .from(tableNames.game)
    .where({ id: parseInt(id) })
}

function getGamesByWeek(id) {
  return knex
    .select('*')
    .from(tableNames.game)
    .where({ season_week: id })
}

function updateGame(id, game) {
  return knex(tableNames.game)
    .update(game)
    .update('updated_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning('*')
}

function deleteGameById(id) {
  return knex(tableNames.game)
    .update('deleted_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning('*')
}

module.exports = {
  createGame,
  deleteGameById,
  getAllGames,
  getGameById,
  getGamesByWeek,
  updateGame
}