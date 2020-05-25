const knex = require('../connection')
const tableNames = require('../../src/constants/tableNames')
const teamQueries = require('./teams')

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

async function getGameById(id) {
  let home, away
  const game = await knex
    .select('*')
    .from(tableNames.game)
    .where({ id: parseInt(id) })
    if (game.length) {
      home = await teamQueries.getTeamById(game[0].home_id)
      away = await teamQueries.getTeamById(game[0].away_id)
    }
    return [{...game[0], home: home[0], away: away[0]}]
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