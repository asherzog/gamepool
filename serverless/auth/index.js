const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cookie = require('cookie')
const userQueries = require('../db/queries/users')
const { defaultHeaders, handleError } = require('../common')

async function login(req) {
  const user = await userQueries.getUserByEmail(req.email)
  if (user.length) {
    const valid = await bcrypt.compare(req.password, user[0].password)
    if (valid) {
      const { id, email, firstName, lastName, last_login } = user[0]
      return { 
        user: { id, email, firstName, lastName, lastLogin: last_login },
        token: signToken(id) }
    }
  }
  return null
}

function signToken(id) {
  return jwt.sign({ id }, process.env.API_KEY, {
    expiresIn: 86400 // expires in 24 hours
  })
}

function setCookie(jwt) {
  return cookie.serialize('gid', jwt, {
    // httpOnly: true,
    maxAge: 86400,
    path: '/'
  })
}

exports.login = async (event) => {
  try {
    const result = await login(JSON.parse(event.body))
    if (result) {
      return {
        statusCode: 200,
        headers: {...defaultHeaders, 'Set-Cookie': setCookie(result.token) },
        body: JSON.stringify(result)
      }
    }
    return handleError('err: ', 401, `Incorrect email or password` )
  } catch (e) {
    return handleError(e)
  }
}


exports.register = async (event) => {
  try {
    // TODO: Validate request 
    let req = JSON.parse(event.body)
    let postObj = {
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      password: await bcrypt.hash(req.password, 12)
    }
  
    const result = await userQueries.createUser(postObj)
    if (result.length) {
      const { id, email, firstName, lastName, last_login } = result[0]
      const token = signToken(id)
      return {
        statusCode: 201,
        headers: {...defaultHeaders, 'Set-Cookie': setCookie(token) },
        body: JSON.stringify({ 
          user: { id, email, firstName, lastName, lastLogin: last_login },
          token
        })
      }
    } else {
      return handleError('err: ', 400, 'Unable to register user')
    }
  } catch (e) {
    console.log(e)
    return handleError(e, 400, 'Username taken')
  }
}

exports.me = async (event) => {
  try {
    const id = event.requestContext.authorizer.principalId
    const result = await userQueries.getUserById(id)
    if (result.length) {
      return {
        statusCode: 200,
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 400, 'Unauthorized')
    }
  } catch (e) {
    console.log(e)
    return handleError(e, 400, 'Unauthorized')
  }
}