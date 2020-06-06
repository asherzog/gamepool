const knex = require('../connection')
const tableNames = require('../../common/tableNames')

function getAllTeams() {
  return knex
    .select('id', 'name', 'location', 'logo_url')
    .from(tableNames.team)
}

function getTeamById(id) {
  return knex
    .select('id', 'name', 'location', 'logo_url')
    .from(tableNames.team)
    .where({ id: parseInt(id) })
}

module.exports = {
  getAllTeams,
  getTeamById
}