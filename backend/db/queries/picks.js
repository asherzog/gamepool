const knex = require('../connection')
const tableNames = require('../../src/constants/tableNames')

async function createPick(pick) {
  // check if user has already made pick
  const userPick = await knex
    .select('*')
    .from(tableNames.pick)
    .where({
      user_id: pick.user_id, 
      game_id: pick.game_id, 
      league_id: pick.league_id
    })
    .whereNull('deleted_at')
  
  if (userPick.length) {  
    // update pick instead of create
    return updatePick(userPick[0].id, pick)
  }

  return knex(tableNames.pick)
    .insert(pick)
    .returning('*')
}

function getAllPicks() {
  return knex
    .select(
      'pick.id',
      'pick.league_id',
      'pick.user_id',
      'pick.team_id',
      'game.id as game_id',
      'game.home_id',
      'game.away_id',
      'game.home_score',
      'game.away_score',
      'game.season_week',
      'homeTeam.name as home_name',
      'homeTeam.location as home_location',
      'homeTeam.logo_url as home_logo',
      'awayTeam.name as away_name',
      'awayTeam.location as away_location',
      'awayTeam.logo_url as away_logo'
    )
    .from(tableNames.pick)
    .innerJoin(tableNames.game, 'pick.game_id', 'game.id')
    .innerJoin(`${tableNames.team} AS homeTeam`, 'homeTeam.id','game.home_id')
    .innerJoin(`${tableNames.team} AS awayTeam`, 'awayTeam.id','game.away_id')
    .whereNull('game.deleted_at')
    .whereNull('pick.deleted_at')
}

function getPickById(id) {
  return knex
    .select(
      'pick.id',
      'pick.league_id',
      'pick.user_id',
      'pick.team_id',
      'game.id as game_id',
      'game.home_id',
      'game.away_id',
      'game.home_score',
      'game.away_score',
      'game.season_week',
      'homeTeam.name as home_name',
      'homeTeam.location as home_location',
      'homeTeam.logo_url as home_logo',
      'awayTeam.name as away_name',
      'awayTeam.location as away_location',
      'awayTeam.logo_url as away_logo'
    )
    .from(tableNames.pick)
    .innerJoin(tableNames.game, 'pick.game_id', 'game.id')
    .innerJoin(`${tableNames.team} AS homeTeam`, 'homeTeam.id','game.home_id')
    .innerJoin(`${tableNames.team} AS awayTeam`, 'awayTeam.id','game.away_id')
    .where({ 'pick.id': id})
}

function getPicksByWeek(leagueId, weekId, userId = null) {
  return knex
    .select(
      'pick.id',
      'pick.league_id',
      'pick.user_id',
      'pick.team_id',
      'game.id as game_id',
      'game.home_id',
      'game.away_id',
      'game.home_score',
      'game.away_score',
      'game.season_week',
      'homeTeam.name as home_name',
      'homeTeam.location as home_location',
      'homeTeam.logo_url as home_logo',
      'awayTeam.name as away_name',
      'awayTeam.location as away_location',
      'awayTeam.logo_url as away_logo'
    )
    .from(tableNames.pick)
    .innerJoin(tableNames.game, 'pick.game_id', 'game.id')
    .innerJoin(`${tableNames.team} AS homeTeam`, 'homeTeam.id','game.home_id')
    .innerJoin(`${tableNames.team} AS awayTeam`, 'awayTeam.id','game.away_id')
    .where({ 'pick.league_id': leagueId, 'game.season_week': weekId })
    .where(function() {
      if (userId != null) {
        this.where('pick.user_id', '=', userId)
      }
    })
    .whereNull('game.deleted_at') 
    .whereNull('pick.deleted_at')
}

function updatePick(id, pick) {
  return knex(tableNames.pick)
    .update(pick)
    .update('updated_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning('*')
}

function deletePickById(id) {
  return knex(tableNames.pick)
    .update('deleted_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning('*')
}

module.exports = {
  createPick,
  deletePickById,
  getAllPicks,
  getPickById,
  getPicksByWeek,
  updatePick
}