const queries = require('../db/queries/users')

exports.getAll = async () => {
  try {
    const result = await queries.getAllUsers()
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message,
      })
    }
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
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `User: ${id}, not found` 
        })
      }
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message,
      })
    }
  }
}