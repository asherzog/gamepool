const queries = require('../db/queries/teams')
const { defaultHeaders, handleError } = require('../common')

exports.getAll = async () => {
  try {
    const result = await queries.getAllTeams()
    return {
      statusCode: 200,
      headers: {...defaultHeaders},
      body: JSON.stringify(result)
    }
  } catch (e) {
    return handleError(e)
  }
}

exports.getSingle = async (event) => {
  try {
    const { id } = event.pathParameters
    const result = await queries.getTeamById(id)
    if (result.length) {
      return {
        statusCode: 200,
        headers: {...defaultHeaders},
        body: JSON.stringify(result[0])
      }
    } else {
      return handleError('err: ', 404, `Team: ${id}, not found`)
    }
  } catch (e) {
    return handleError(e)
  }
}