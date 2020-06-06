const knex = require('../connection')
const tableNames = require('../../common/tableNames')

function createUser(user) {
  return knex(tableNames.user)
    .insert(user)
    .returning(['id', 'name', 'email', 'last_login'])
}

async function deleteUser(id) {
  await knex(tableNames.user_league)
  .update('deleted_at', knex.fn.now())
  .where({ id: parseInt(id) })

  return knex(tableNames.user)
    .update('deleted_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning(['id', 'name', 'email', 'last_login', 'deleted_at'])
}


function getAllUsers() {
  return knex
    .select('id', 'name', 'email', 'last_login')
    .from(tableNames.user)
    .whereNull('deleted_at')
}

function getUserById(id) {
  return knex
    .select('id', 'name', 'email', 'last_login')
    .from(tableNames.user)
    .where({ id: parseInt(id) })
}

function updateUser(id, user) {
  return knex(tableNames.user)
    .update(user)
    .update('updated_at', knex.fn.now())
    .where({ id: parseInt(id) })
    .returning(['id', 'name', 'email', 'last_login'])
}

module.exports = {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser
}