const Knex = require('knex')
const tableNames = require('../../common/tableNames')


function addDefaultColumns(table) {
  table.timestamps(false, true)
  table.dateTime('deleted_at')
}

function createReference(table, column, refTable) {
  table.integer(column).unsigned().references('id').inTable(refTable).onDelete('cascade')
}

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('name', 50).notNullable()
      table.string('password', 127).notNullable()
      table.dateTime('last_login')
      addDefaultColumns(table)
    }),
    knex.schema.createTable(tableNames.league, (table) => {
      table.increments().notNullable()
      table.string('name', 50).notNullable()
      addDefaultColumns(table)
    }),
    knex.schema.createTable(tableNames.team, (table) => {
      table.increments().notNullable()
      table.string('name', 50).notNullable().unique()
      table.string('location', 50).notNullable()
      table.string('logo_url', 2000)
      addDefaultColumns(table)
    })
  ])
  
  await knex.schema.createTable(tableNames.game, (table) => {
    table.increments().notNullable()
    table.integer('home_score')
    table.integer('away_score')
    table.string('season_week', 50).notNullable()
    table.dateTime('game_time').notNullable()
    createReference(table, 'home_id', tableNames.team)
    createReference(table, 'away_id', tableNames.team)
    createReference(table, 'winning_id', tableNames.team)
    addDefaultColumns(table)
  })

  await knex.schema.createTable(tableNames.user_league, (table) => {
    table.increments().notNullable()
    createReference(table, 'league_id', tableNames.league)
    createReference(table, 'user_id', tableNames.user)
    table.boolean('is_admin').notNullable().defaultTo(false)
    table.boolean('is_creator').notNullable().defaultTo(false)
    addDefaultColumns(table)
  })

  await knex.schema.createTable(tableNames.pick, (table) => {
    table.increments().notNullable()
    table.integer('home_score')
    table.integer('away_score')
    createReference(table, 'league_id', tableNames.league)
    createReference(table, 'user_id', tableNames.user)
    createReference(table, 'game_id', tableNames.game)
    createReference(table, 'team_id', tableNames.team)
    addDefaultColumns(table)
  })
}

exports.down = async (knex) => {
  await Promise.all([
    tableNames.pick,
    tableNames.user_league,
    tableNames.game,
    tableNames.user,
    tableNames.league,
    tableNames.team
  ].map(name => knex.schema.dropTableIfExists(name)))
}
