const bcrypt = require('bcrypt')
const Router = require('koa-router')
const queries = require('../../../db/queries/users')
const leagueUserQueries = require('../../../db/queries/leagueUsers')

const router = new Router()
const BASE_URL = `/api/v1/users`

/**
   * @swagger
   * /users:
   *   get:
   *     summary: Fetch all users
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: list of all users
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               type: array
   *               items:
   *                 $ref: '#/definitions/User'
   */
router.get(BASE_URL, async (ctx) => {
  try {
    const users = await queries.getAllUsers()
    ctx.body = {
      status: 'success',
      data: users
    }
  } catch (err) {
    console.log(err)
  }
})

/**
   * @swagger
   * /users/{userId}:
   *   get:
   *     summary: Fetch single user
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: userId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of user to fetch
   *     responses:
   *       200:
   *         description: single user
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               $ref: '#/definitions/User'
   *       404:
   *         $ref: '#/responses/NotFound'
   */
router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const id = ctx.params.id
    const user = await queries.getUserById(id)
    if (user.length) {
      ctx.body = {
        status: 'success',
        data: user[0]
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: `userID: ${id} not found`
      }
    }
  } catch (err) {
    console.log(err)
  }
})

/**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     consumes:
   *      - application/json
   *     parameters:
   *      - in: body
   *        name: user
   *        description: The user to create
   *        schema: 
   *          allOf: 
   *           - $ref: '#/definitions/User'
   *          type: object
   *          example:
   *            name: user
   *            email: user@user.com
   *            password: myP4ssWord
   *            user_league: 4
   *          required: 
   *           - name
   *           - email
   *           - password
   *          properties: 
   *            password: 
   *              type: string
   *              format: password
   *            user_league: 
   *              type: integer
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: created new user
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               $ref: '#/definitions/User'
   */
router.post(`${BASE_URL}`, async (ctx) => {
  try {
    // TODO: Validate request 
    let req = ctx.request.body 
    let postObj = {
      name: req.name,
      email: req.email,
      password: await bcrypt.hash(req.password, 12)
    }

    const user = await queries.createUser(postObj)
    if (user.length) {
      if (req.league_id) {
        try {
          await leagueUserQueries.createLeagueUser({
            user_id: user[0].id,
            league_id: req.league_id,
            is_admin: !!req.is_admin
          })
        } catch (err) {
          throw err
        }
      }
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: user[0]
      }
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Unable to post new user'
      }
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

/**
   * @swagger
   * /users/{userId}:
   *   put:
   *     summary: Update a user
   *     consumes:
   *      - application/json
   *     parameters:
   *      - in: path
   *        name: userId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of user to fetch
   *      - in: body
   *        name: user
   *        description: The user to create
   *        schema: 
   *          allOf: 
   *           - $ref: '#/definitions/User'
   *          type: object
   *          example:
   *            name: user
   *            email: user@user.com
   *            password: myP4ssWord
   *            user_league: 4
   *          properties: 
   *            password: 
   *              type: string
   *              format: password
   *            user_league: 
   *              type: integer
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: updated user
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               allOf: 
   *                - $ref: '#/definitions/User'
   *               properties:
   *                  updated_at:
   *                    type: string
   *                    format: date-time
   */
router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    // TODO: Validate request
    const id = ctx.params.id 
    let req = ctx.request.body 
    if (req.password) {
      req.password = await bcrypt.hash(req.password, 12)
    }

    const user = await queries.updateUser(id, req)
    if (user.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: user[0]
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: `userID: ${id} not found`
      }
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

/**
   * @swagger
   * /users/{userId}:
   *   delete:
   *     summary: soft delete a user
   *     consumes:
   *      - application/json
   *     parameters:
   *      - in: path
   *        name: userId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of user to delete
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: deleted user
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               allOf: 
   *                - $ref: '#/definitions/User'
   *               properties:
   *                  deleted_at:
   *                    type: string
   *                    format: date-time
   */
router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const id = ctx.params.id 
    const user = await queries.deleteUser(id)
    if (user.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: user[0]
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: `userID: ${id} not found`
      }
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})


module.exports = router