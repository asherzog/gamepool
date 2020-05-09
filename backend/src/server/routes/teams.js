const Router = require('koa-router')
const queries = require('../../../db/queries/teams')

const router = new Router()
const BASE_URL = `/api/v1/teams`

router.get(BASE_URL, async (ctx) => {
  try {
    const teams = await queries.getAllTeams()
    ctx.body = {
      status: 'success',
      data: teams
    }
  } catch (err) {
    console.log(err)
  }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const team = await queries.getTeamById(ctx.params.id)
    if (team.length) {
      ctx.body = {
        status: 'success',
        data: team[0]
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: `teamID: ${ctx.params.id} not found`
      }
    }
  } catch (err) {
    console.log(err)
  }
})

module.exports = router