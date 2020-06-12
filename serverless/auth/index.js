const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userQueries = require('../db/queries/users')
const { handleError } = require('../common')

async function login(req) {
  const user = await userQueries.getUserByEmail(req.email)
  if (user.length) {
    const valid = await bcrypt.compare(req.password, user[0].password)
    if (valid) {
      return signToken(user[0].id)
    }
  }
  return null
}

function signToken(id) {
  return jwt.sign({ id }, process.env.API_KEY, {
    expiresIn: 86400 // expires in 24 hours
  })
}

exports.login = async (event) => {
  try {
    const result = await login(JSON.parse(event.body))
    if (result) {
      return {
        statusCode: 200,
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
      return {
        statusCode: 201,
        body: JSON.stringify(signToken(result[0].id))
      }
    } else {
      return handleError('err: ', 400, 'Unable to register user')
    }
  } catch (e) {
    console.log(e)
    return handleError(e, 400, 'Username taken')
  }
}