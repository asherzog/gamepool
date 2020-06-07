const queries = require('../db/queries/leagues')
const leagueUserQueries = require('../db/queries/leagueUsers')
const { handleError } = require('../common')

exports.getAll = async () => {
  try {
    const result = await queries.getAllLeagues()
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
    const result = await queries.getLeagueById(id)
    const users = await leagueUserQueries.getAllLeagueUsers(id)
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({...result[0], users})
      }
    } else {
      return handleError('err: ', 404, `League: ${id}, not found` )
    }
  } catch (e) {
    return handleError(e)
  }
}


exports.create = async (event) => {
  try {
    // TODO: Validate request
    let req = JSON.parse(event.body)
    const league = await queries.createLeague({name: req.name})
    if (league.length) {
      let league_id =  league[0].id
      let user_id = req.user_id
      await leagueUserQueries.createLeagueUser({
        user_id,
        league_id,
        is_admin: true,
        is_creator: true
      })
      const users = await leagueUserQueries.getAllLeagueUsers(league_id)
      return {
        statusCode: 201,
        body: JSON.stringify({...league[0], users})
      }
    } else {
      return handleError('err: ', 400, 'Unable to create league')
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
    const result = await queries.updateLeague(id, req)
    const users = await leagueUserQueries.getAllLeagueUsers(id)
    if (result.length) {
      return {
        statusCode: 201,
        body: JSON.stringify({...result[0], users})
      }
    } else {
      return handleError('err: ', 404, `League: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.delete = async (event) => {
  try {
    const { id } = event.pathParameters
    const result = await queries.deleteLeague(id)
    const users = await leagueUserQueries.deleteAllLeagueUsers(id)
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({...result[0], users})
      }
    } else {
      return handleError('err: ', 404, `LeagueId: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.getAllUsers = async (event) => {
  try {
    const { id } = event.pathParameters
    const result = await leagueUserQueries.getAllLeagueUsers(id)
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } else {
      return handleError('err: ', 404, `League: ${id}, not found` )
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.createUser = async (event) => {
  try {
    let req = JSON.parse(event.body)
    let user_id = req.user_id
    const league_id = event.pathParameters.id
    const result = await queries.getLeagueById(league_id)
    const user = await leagueUserQueries.createLeagueUser({
      user_id,
      league_id,
      is_admin: !!req.is_admin
    })
    if (result.length && user.length) {
      const users = await leagueUserQueries.getAllLeagueUsers(league_id)
      return {
        statusCode: 200,
        body: JSON.stringify({...result[0], users})
      }
    } else {
      return handleError('err: ', 404, `Unable to create new league user` )
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.deleteUser = async (event) => {
  try {
    let user_id = event.pathParameters.uid
    const league_id = event.pathParameters.id
    const result = await queries.getLeagueById(league_id)
    const user = await leagueUserQueries.deleteUserFromLeague(league_id, user_id)    
    if (result.length && user.length) {
      const users = await leagueUserQueries.getAllLeagueUsers(league_id)
      return {
        statusCode: 200,
        body: JSON.stringify({...result[0], users})
      }
    } else {
      return handleError('err: ', 404, `Unable to remove league user` )
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.getAllForUser = async (event) => {
  try {
    const { id } = event.pathParameters
    const result = await queries.getAllLeaguesForUser(id)  
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (e) {
    return handleError(e)
  }
}