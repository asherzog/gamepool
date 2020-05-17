const knex = require('../connection')
const tableNames = require('../../src/constants/tableNames')

function createPick(pick) {
  return knex(tableNames.pick)
    .insert(pick)
    .returning('*')
}

function getAllPicks() {
  return knex
    .select('*')
    .from(tableNames.pick)
    .whereNull('deleted_at')
}

function getPickById(id) {
  return knex
    .select('*')
    .from(tableNames.pick)
    .where({ id: parseInt(id) })
}

function getPicksByWeek(id) {
  return knex
    .select('*')
    .from(tableNames.pick)
    .where({ season_week: id })
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