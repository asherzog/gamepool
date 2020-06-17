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
      return { id: user[0].id, token: signToken(user[0].id) }
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
    maxAge: 60 * 60 * 24 * 7, // 1 week
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
    return handleError('err: ', 401, `User not authenticated` )
  } catch (e) {
    return handleError(e)
  }
}


exports.register = async (event) => {
  try {
    // TODO: Validate request 
    let req = JSON.parse(event.body)
    let postObj = {
      name: req.name,
      email: req.email,
      password: await bcrypt.hash(req.password, 12)
    }
  
    const result = await userQueries.createUser(postObj)
    if (result.length) {
      const jwt = signToken(result[0].id)
      return {
        statusCode: 201,
        headers: {...defaultHeaders, 'Set-Cookie': setCookie(jwt) },
        body: JSON.stringify({id: result[0].id, token: jwt })
      }
    } else {
      return handleError('err: ', 400, 'Unable to register user')
    }
  } catch (e) {
    console.log(e)
    return handleError(e, 400, 'Username taken')
  }
}