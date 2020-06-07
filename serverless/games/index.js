const queries = require('../db/queries/games')
const teamQueries = require('../db/queries/teams')
const { handleError } = require('../common')

exports.getAll = async () => {
  try {
    const result = await queries.getAllGames()
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
    const result = await queries.getGameById(id)
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 404, `Game: ${id}, not found` )
    }
  } catch (e) {
    return handleError(e)
  }
}


exports.create = async (event) => {
  try {
    // TODO: Validate request 
    let req = JSON.parse(event.body)
    const result = await queries.createGame(req)
    if (result.length) {
      return {
        statusCode: 201,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 424, 'Unable to create game')
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
    const result = await queries.updateGame(id, req)
    if (result.length) {
      return {
        statusCode: 201,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 404, `GameId: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.delete = async (event) => {
  try {
    const { id } = event.pathParameters
    const result = await queries.deleteGameById(id)
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 404, `GameId: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.getAllForWeek = async (event) => {
  try {
    const { id } = event.pathParameters
    const result = await queries.getGamesByWeek(id)
    if (result.length > 0) {
      const mappedGames = await Promise.all(result.map(async game => {
        let home = await teamQueries.getTeamById(game.home_id)
        let away = await teamQueries.getTeamById(game.away_id)
        return {...game, home, away}
      }))  
      return {
        statusCode: 200,
        body: JSON.stringify(mappedGames)
      }
    } else {
      return handleError('err: ', 404, `WeekId: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}