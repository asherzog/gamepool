const bcrypt = require('bcrypt')
const queries = require('../db/queries/users')
const leagueQueries = require('../db/queries/leagues')
const { handleError } = require('../common')

exports.getAll = async () => {
  try {
    const result = await queries.getAllUsers()
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
    const result = await queries.getUserById(id)
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 404, `User: ${id}, not found` )
    }
  } catch (e) {
    return handleError(e)
  }
}


exports.create = async (event) => {
  try {
    // TODO: Validate request 
    let req = JSON.parse(event.body)
    let postObj = {
      name: req.name,
      email: req.email,
      password: await bcrypt.hash(req.password, 12)
    }
  
    const result = await queries.createUser(postObj)
    if (result.length) {
      if (req.league_id) {
        try {
          await leagueUserQueries.createLeagueUser({
            user_id: result[0].id,
            league_id: req.league_id,
            is_admin: !!req.is_admin
          })
        } catch (err) {
          throw err
        }
      }
      return {
        statusCode: 201,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 400, 'Unable to create user')
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
    if (req.password) {
      req.password = await bcrypt.hash(req.password, 12)
    }
  
    const result = await queries.updateUser(id, req)
    if (result.length) {
      return {
        statusCode: 201,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 404, `UserId: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.delete = async (event) => {
  try {
    const { id } = event.pathParameters
    const result = await queries.deleteUser(id)
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 404, `UserId: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}