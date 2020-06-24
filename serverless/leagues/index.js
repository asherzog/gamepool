const bcrypt = require('bcryptjs')
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
    const user_id = event.requestContext.authorizer.principalId
    const { id } = event.pathParameters
    const league_id = Buffer.from(id, 'base64').toString('utf-8').split('lid=')[1]
    if (!league_id) return handleError('err: ', 404, `Invalid league identifier` )
    const result = await queries.getLeagueById(league_id)
    const users = await leagueUserQueries.getAllLeagueUsers(league_id)
    const isMember = users.some(user => user.uid === user_id)
    if (!isMember) return handleError('err: ', 400, `UnAuthorized` )
    if (result.length) {
      let league = result[0]
      let res = {
        id,
        name: league.name,
        scoring: league.scoring, 
        seasonFee: league.seasonFee,
        weekFee: league.weekFee,
        updatedAt: league.updated_at,
        createdAt: league.created_at,
        deletedAt: league.deleted_at,
        users 
      }
      return {
        statusCode: 200,
        body: JSON.stringify(res)
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
    let user_id = event.requestContext.authorizer.principalId
    let postObj = {
      name: req.name,
      password: await bcrypt.hash(req.password, 12),
      scoring: req.scoring,
      seasonFee: req.seasonFee,
      weekFee: req.weekFee
    }
    const league = await queries.createLeague(postObj)
    if (league.length) {
      let league_id =  league[0].id
      let hashedId = Buffer.from(`lid=${league.id}`).toString('base64')
      await leagueUserQueries.createLeagueUser({
        user_id,
        league_id,
        is_admin: true,
        is_creator: true
      })
      const users = await leagueUserQueries.getAllLeagueUsers(league_id)
      let res = {id: hashedId, ...league[0]}
      console.log(res)
      return {
        statusCode: 201,
        body: JSON.stringify({...res, users})
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
    //TODO: validations
    let req = JSON.parse(event.body)
    let user_id = event.requestContext.authorizer.principalId
    const hash_id = event.pathParameters.id
    const league_id = Buffer.from(hash_id, 'base64').toString('utf-8').split('lid=')[1]
    if (!league_id) return handleError('err: ', 404, `Invalid league identifier or password` )
    const result = await queries.getLeagueById(league_id)
    if (result.length) {
      const league = result[0]
      const valid = await bcrypt.compare(req.password, league.password)
      if (!valid) {
        return handleError('err: ', 404, `Invalid league identifier or password` )
      }
      await leagueUserQueries.createLeagueUser({
        user_id,
        league_id,
        is_admin: !!req.is_admin
      })
      const users = await leagueUserQueries.getAllLeagueUsers(league_id)
      let res = {
        id: hash_id,
        name: league.name,
        scoring: league.scoring, 
        seasonFee: league.seasonFee,
        weekFee: league.weekFee,
        updatedAt: league.updated_at,
        createdAt: league.created_at,
        deletedAt: league.deleted_at,
        users 
      }
      return {
        statusCode: 200,
        body: JSON.stringify(res)
      }
    } else {
      return handleError('err: ', 404, `Invalid league identifier or password` )
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
    const obscured = result.map(league => {
      league.id = Buffer.from(`lid=${league.id}`).toString('base64')
      return league
    })
    return {
      statusCode: 200,
      body: JSON.stringify(obscured)
    }
  } catch (e) {
    return handleError(e)
  }
}