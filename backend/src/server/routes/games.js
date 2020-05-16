const Router = require('koa-router')
const queries = require('../../../db/queries/games')

const router = new Router()
const BASE_URL = `/api/v1/games`

/**
   * @swagger
   * /games:
   *   get:
   *     summary: Fetch all games
   *     tags:
   *      - Games
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: list of all Games
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               type: array
   *               items:
   *                 $ref: '#/definitions/Game'
   */
router.get(BASE_URL, async (ctx) => {
  try {
    const games = await queries.getAllGames()
    ctx.body = {
      status: 'success',
      data: games
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
   * /games:
   *   post:
   *     summary: Create new Game
   *     tags:
   *      - Games
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: body
   *        name: game
   *        description: The game to be created
   *        schema: 
   *          allOf: 
   *           - $ref: '#/definitions/Game'
   *     responses:
   *       200:
   *         description: updated Game
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               $ref: '#/definitions/Game'
   *       424: 
   *         $ref: '#/responses/NonSuccess'
   */
  router.post(BASE_URL, async (ctx) => {
    try {
      let req = ctx.request.body
      const games = await queries.createGame(req)
      if (games.length > 0) {
        ctx.body = {
          status: 'success',
          data: games[0]
        }
      } else {
        ctx.status = 424
        ctx.body = {
          status: 'error',
          message: 'Unable to create game'
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
   * /games/{gameId}:
   *   get:
   *     summary: Fetch single game
   *     tags:
   *      - Games
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: gameId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of game to fetch
   *     responses:
   *       200:
   *         description: Single Game
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               $ref: '#/definitions/Game'
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const id = ctx.params.id
    const games = await queries.getGameById(id)
    if (games.length > 0) {
      ctx.body = {
        status: 'success',
        data: games[0]
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: `GameID: ${id} not found`
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
   * /games/{gameId}:
   *   put:
   *     summary: Update single game
   *     tags:
   *      - Games
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: gameId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of game to fetch
   *      - in: body
   *        name: game
   *        description: The game to be updated
   *        schema: 
   *          allOf: 
   *           - $ref: '#/definitions/Game'
   *     responses:
   *       200:
   *         description: updated Game
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               $ref: '#/definitions/Game'
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const id = ctx.params.id
    let req = ctx.request.body
    const games = await queries.updateGame(id, req)
    if (games.length > 0) {
      ctx.body = {
        status: 'success',
        data: games[0]
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: `GameID: ${id} not found`
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
   * /games/{gameId}:
   *   delete:
   *     summary: Delete single game
   *     tags:
   *      - Games
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: gameId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of game to delete
   *     responses:
   *       200:
   *         description: Single Game
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               $ref: '#/definitions/Game'
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const id = ctx.params.id
    const games = await queries.deleteGameById(id)
    if (games.length > 0) {
      ctx.body = {
        status: 'success',
        data: games[0]
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: `GameID: ${id} not found`
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
   * /games/weeks/{weekId}:
   *   get:
   *     summary: Fetch all games for week
   *     tags:
   *      - Games
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: weekId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of week to fetch games for
   *     responses:
   *       200:
   *         description: List of Games
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               type: array
   *               items:
   *                 $ref: '#/definitions/Game'
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
  router.get(`${BASE_URL}/weeks/:id`, async (ctx) => {
    try {
      const id = ctx.params.id
      const games = await queries.getGamesByWeek(id)
      if (games.length > 0) {
        ctx.body = {
          status: 'success',
          data: games[0]
        }
      } else {
        ctx.status = 404
        ctx.body = {
          status: 'error',
          message: `WeekID: ${id} not found`
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

module.exports = router