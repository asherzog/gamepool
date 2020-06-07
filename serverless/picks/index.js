const queries = require('../db/queries/picks')
const teamQueries = require('../db/queries/teams')
const gameQueries = require('../db/queries/games')
const { handleError } = require('../common')

exports.getAll = async () => {
  try {
    const result = await queries.getAllPicks()
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.getSingle = async (event) => {
  try {
    const { id } = event.pathParameters
    const result = await queries.getPickById(id)
    if (result.length > 0) {
      const winner = await teamQueries.getTeamById(result[0].team_id)
      const game = await gameQueries.getGameById(result[0].game_id)
      return {
        statusCode: 200,
        body: JSON.stringify({...result[0], winner: winner[0], game: game[0]})
      }
    } else {
      return handleError('err: ', 404, `PickId: ${id}, not found` )
    }
  } catch (e) {
    return handleError(e)
  }
}


exports.create = async (event) => {
  try {
    // TODO: Validate request 
    let req = JSON.parse(event.body)
    const result = await queries.createPick(req)
    if (result.length) {
      return {
        statusCode: 201,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 424, 'Unable to create pick')
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.update = async (event) => {
  try {
    // TODO: Validate request 
    let req = JSON.parse(event.body)
    const { id } = event.pathParameters
    const result = await queries.updatePick(id, req)
    if (result.length) {
      return {
        statusCode: 201,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 404, `PickId: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.delete = async (event) => {
  try {
    const { id } = event.pathParameters
    const result = await queries.deletePickById(id)
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 404, `PickId: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.getAllForWeek = async (event) => {
  try {
    // TODO: req validations
    const { id } = event.pathParameters
    const leagueId = event.headers['x-league-id']
    const userId = event.headers['x-user-id']
    const result = await queries.getPicksByWeek(leagueId, id, userId) 
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } else {
      return handleError('err: ', 404, `WeekId: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}