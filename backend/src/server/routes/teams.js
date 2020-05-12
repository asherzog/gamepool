const Router = require('koa-router')
const queries = require('../../../db/queries/teams')

const router = new Router()
const BASE_URL = `/api/v1/teams`

/**
   * @swagger
   * /teams:
   *   get:
   *     summary: Fetch all teams
   *     tags:
   *      - Teams
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: list of all teams
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               type: array
   *               items:
   *                 $ref: '#/definitions/Team'
   */
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

/**
   * @swagger
   * /teams/{teamId}:
   *   get:
   *     summary: Fetch single team
   *     tags:
   *      - Teams
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: teamId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of team to fetch
   *     responses:
   *       200:
   *         description: single team
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               allOf: 
   *                 - $ref: '#/definitions/Team'
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
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