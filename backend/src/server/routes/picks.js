const Router = require('koa-router')
const queries = require('../../../db/queries/picks')
const teamQueries = require('../../../db/queries/teams')
const gameQueries = require('../../../db/queries/games')

const router = new Router()
const BASE_URL = `/api/v1/picks`

/**
   * @swagger
   * /picks:
   *   get:
   *     summary: Fetch all picks
   *     tags:
   *      - Picks
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: list of all Picks
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               type: array
   *               items:
   *                 $ref: '#/definitions/Pick'
   */
router.get(BASE_URL, async (ctx) => {
  try {
    const picks = await queries.getAllPicks()
    ctx.body = {
      status: 'success',
      data: picks
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }
})

/**
   * @swagger
   * /picks:
   *   post:
   *     summary: Create new Pick
   *     tags:
   *      - Picks
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: body
   *        name: pick
   *        description: The pick to be created
   *        schema: 
   *          allOf: 
   *           - $ref: '#/definitions/Pick'
   *     responses:
   *       200:
   *         description: new Pick
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               $ref: '#/definitions/Pick'
   *       424: 
   *         $ref: '#/responses/NonSuccess'
   */
  router.post(BASE_URL, async (ctx) => {
    try {
      let req = ctx.request.body
      const pick = await queries.createPick(req)
      if (pick.length > 0) {
        ctx.body = {
          status: 'success',
          data: pick[0]
        }
      } else {
        ctx.status = 424
        ctx.body = {
          status: 'error',
          message: 'Unable to create pick'
        }
      }
    } catch (err) {
      console.log(err)
      ctx.status = 400
      ctx.body = {
        status: 'error',
        message: err.message || 'Sorry, an error has occurred.'
      }
    }
  })

/**
   * @swagger
   * /picks/{pickId}:
   *   get:
   *     summary: Fetch single pick
   *     tags:
   *      - Picks
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: pickId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of pick to fetch
   *     responses:
   *       200:
   *         description: Single pick
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               allOf:
   *                - $ref: '#/definitions/Pick'
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const id = ctx.params.id
    const pick = await queries.getPickById(id)
    if (pick.length > 0) {
      const winner = await teamQueries.getTeamById(pick[0].team_id)
      const game = await gameQueries.getGameById(pick[0].game_id)
      ctx.body = {
        status: 'success',
        data: {...pick[0], winner: winner[0], game: game[0]}
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: `PickID: ${id} not found`
      }
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }
})

/**
   * @swagger
   * /picks/{pickId}:
   *   put:
   *     summary: Update single pick
   *     tags:
   *      - Picks
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: pickId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of pick to fetch
   *      - in: body
   *        name: pick
   *        description: The pick to be updated
   *        schema: 
   *          allOf: 
   *           - $ref: '#/definitions/Pick'
   *     responses:
   *       200:
   *         description: updated Pick
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               $ref: '#/definitions/Pick'
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const id = ctx.params.id
    let req = ctx.request.body
    const pick = await queries.updatePick(id, req)
    if (pick.length > 0) {
      ctx.body = {
        status: 'success',
        data: pick[0]
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: `PickID: ${id} not found`
      }
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }
})

/**
   * @swagger
   * /picks/{pickId}:
   *   delete:
   *     summary: Delete single pick
   *     tags:
   *      - Picks
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: pickId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of pick to delete
   *     responses:
   *       200:
   *         description: Single Pick
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               $ref: '#/definitions/Pick'
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const id = ctx.params.id
    const pick = await queries.deletePickById(id)
    if (pick.length > 0) {
      ctx.body = {
        status: 'success',
        data: pick[0]
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: `PickID: ${id} not found`
      }
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }
})

/**
   * @swagger
   * /picks/weeks/{weekId}:
   *   get:
   *     summary: Fetch all picks for week
   *     tags:
   *      - Picks
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: header
   *        name: X-League-ID
   *        description: league id to get picks for
   *        required: true
   *        type: string
   *      - in: header
   *        name: X-User-ID
   *        description: user id to get picks for
   *        required: false
   *        type: string
   *      - in: path
   *        name: weekId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of week to fetch picks for
   *     responses:
   *       200:
   *         description: List of Picks
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               type: array
   *               items:
   *                 allOf:
   *                  - $ref: '#/definitions/Pick'
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
  router.get(`${BASE_URL}/weeks/:id`, async (ctx) => {
    try {
      const weekId = ctx.params.id
      const leagueId = ctx.headers['x-league-id']
      const userId = ctx.headers['x-user-id']
      const picks = await queries.getPicksByWeek(leagueId, weekId, userId)   
      ctx.body = {
        status: 'success',  
        data: picks
      }
    } catch (err) {
      console.log(err)
      ctx.status = 400
      ctx.body = {
        status: 'error',
        message: err.message || 'Sorry, an error has occurred.'
      }
    }
  })

module.exports = router