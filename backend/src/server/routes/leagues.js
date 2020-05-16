const Router = require('koa-router')
const queries = require('../../../db/queries/leagues')
const leagueUserQueries = require('../../../db/queries/leagueUsers')

const router = new Router({prefix: `/api/v1/leagues`})

/**
   * @swagger
   * /leagues:
   *   get:
   *     summary: Fetch all leagues
   *     tags:
   *      - Leagues
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: list of all leagues
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               type: array
   *               items:
   *                 $ref: '#/definitions/League'
   */
router.get('/', async (ctx) => {
  try {
    const leagues = await queries.getAllLeagues()
    ctx.body = {
      status: 'success',
      data: leagues
    }
  } catch (err) {
    console.log(err)
  }
})

/**
   * @swagger
   * /leagues:
   *   post:
   *     summary: Create a new league
   *     consumes:
   *      - application/json
   *     parameters:
   *      - in: body
   *        name: league
   *        description: The league to create
   *        schema: 
   *          allOf: 
   *           - $ref: '#/definitions/League'
   *          type: object
   *          example:
   *            name: "my league"
   *            user_id: 3
   *          required: 
   *           - name
   *           - user_id
   *          properties: 
   *            user_id: 
   *              type: integer
   *     tags:
   *      - Leagues
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: created new league
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               allOf: 
   *                 - $ref: '#/definitions/League'
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties: 
   *                       user_id: 
   *                         type: integer
   *                         example: 3
   *                       user_name: 
   *                         type: string
   *                         example: Andy
   *                       email: 
   *                         type: string
   *                         example: user@user.com
   *                       is_admin: 
   *                         type: boolean
   *                         example: true
   *       424:
   *         $ref: '#/responses/NonSuccess' 
   */
router.post('/', async (ctx) => {
  try {
    // TODO: Validate request 
    let { name } = ctx.request.body
    const league = await queries.createLeague({name})
    if (league.length) {
      let league_id =  league[0].id
      let user_id = ctx.request.body.user_id
      await leagueUserQueries.createLeagueUser({
        user_id,
        league_id,
        is_admin: true,
        is_creator: true
      })
      const users = await leagueUserQueries.getAllLeagueUsers(league_id)
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: {...league[0], users}
      }
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Unable to post new league'
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
   * /leagues/{leagueId}:
   *   get:
   *     summary: Fetch single league
   *     tags:
   *      - Leagues
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: leagueId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of league to fetch
   *     responses:
   *       200:
   *         description: single league
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               allOf: 
   *                 - $ref: '#/definitions/League'
   *               properties:
   *                 deleted_at: 
   *                   type: string
   *                   format: date-time
   *                 updated_at: 
   *                   type: string
   *                   format: date-time
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties: 
   *                       user_id: 
   *                         type: integer
   *                         example: 3
   *                       user_name: 
   *                         type: string
   *                         example: Andy
   *                       email: 
   *                         type: string
   *                         example: user@user.com
   *                       is_admin: 
   *                         type: boolean
   *                         example: true
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
router.get('/:id', async (ctx) => {
  try {
    const id = ctx.params.id
    const league = await queries.getLeagueById(id)
    const users = await leagueUserQueries.getAllLeagueUsers(id)
    if (league.length) {
      ctx.body = {
        status: 'success',
        data: {...league[0], users}
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: `leagueID: ${ctx.params.id} not found`
      }
    }
  } catch (err) {
    console.log(err)
  }
})

/**
   * @swagger
   * /leagues/{id}:
   *   put:
   *     summary: Update a league
   *     consumes:
   *      - application/json
   *     parameters:
   *      - in: path
   *        name: leagueId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of league to fetch users for
   *      - in: body
   *        name: league
   *        description: The league to update
   *        schema: 
   *          allOf: 
   *           - $ref: '#/definitions/League'
   *          type: object
   *          example:
   *            name: "my league"
   *            user_id: 3
   *          required: 
   *           - name
   *           - user_id
   *          properties: 
   *            user_id: 
   *              type: integer
   *     tags:
   *      - Leagues
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: updated league
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               allOf: 
   *                 - $ref: '#/definitions/League'
   *               properties:
   *                 updated_at: 
   *                   type: string
   *                   format: date-time
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties: 
   *                       user_id: 
   *                         type: integer
   *                         example: 3
   *                       user_name: 
   *                         type: string
   *                         example: Andy
   *                       email: 
   *                         type: string
   *                         example: user@user.com
   *                       is_admin: 
   *                         type: boolean
   *                         example: true
   *       404:
   *         $ref: '#/responses/NotFound' 
   */
router.put('/:id', async (ctx) => {
  try {
    // TODO: Validate request
    const id = ctx.params.id 
    let req = ctx.request.body
    
    const league = await queries.updateLeague(id, req)
    const users = await leagueUserQueries.getAllLeagueUsers(league_id)
    if (league.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: {...league[0], users}
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: `leagueID: ${id} not found`
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
   * /leagues/{leagueId}:
   *   delete:
   *     summary: delete a league
   *     tags:
   *      - Leagues
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: leagueId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of league to delete
   *     responses:
   *       200:
   *         description: deleted league
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               allOf: 
   *                 - $ref: '#/definitions/League'
   *               properties:
   *                 deleted_at: 
   *                   type: string
   *                   format: date-time
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties: 
   *                       id: 
   *                         type: integer
   *                         example: 3
   *                       user_id: 
   *                         type: integer
   *                         example: 1
   *                       league_id: 
   *                         type: integer
   *                         example: 3
   *                       is_admin: 
   *                         type: boolean
   *                         example: true
   *                       is_creator: 
   *                         type: boolean
   *                         example: false
   *                       deleted_at: 
   *                         type: string
   *                         format: date-time
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
router.delete('/:id', async (ctx) => {
  try {
    const id = ctx.params.id 
    const league = await queries.deleteLeague(id)
    const users = await leagueUserQueries.deleteAllLeagueUsers(id)
    if (league.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: {...league[0], users}
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: `leagueID: ${id} not found`
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
   * /leagues/{leagueId}/users:
   *   get:
   *     summary: Fetch single league's users
   *     tags:
   *      - Leagues
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: leagueId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of league to fetch users for
   *     responses:
   *       200:
   *         description: single league's users
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               type: array
   *               items:
   *                 type: object
   *                 properties: 
   *                   user_id: 
   *                     type: integer
   *                     example: 3
   *                   user_name: 
   *                     type: string
   *                     example: Andy
   *                   email: 
   *                     type: string
   *                     example: user@user.com
   *                   is_admin: 
   *                     type: boolean
   *                     example: true
   *       404: 
   *         $ref: '#/responses/NotFound'
   */
router.get('/:id/users', async (ctx) => {
  try {
    const id = ctx.params.id
    const users = await leagueUserQueries.getAllLeagueUsers(id)
    ctx.body = {
      status: 'success',
      data: users
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
   * /leagues/{leagueId}/users:
   *   post:
   *     summary: Add user to league
   *     tags:
   *      - Leagues
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: leagueId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of league to add user to
   *      - in: body
   *        name: user
   *        description: The user to add
   *        schema: 
   *          type: object
   *          example:
   *            is_admin: false
   *            user_id: 3
   *          required: 
   *           - user_id
   *          properties: 
   *            user_id: 
   *              type: integer
   *            is_admin: 
   *              type: boolean
   *     responses:
   *       201:
   *         description: user added to league
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               allOf: 
   *                 - $ref: '#/definitions/League'
   *               properties:
   *                 deleted_at: 
   *                   type: string
   *                   format: date-time
   *                 updated_at: 
   *                   type: string
   *                   format: date-time
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties: 
   *                       user_id: 
   *                         type: integer
   *                         example: 3
   *                       user_name: 
   *                         type: string
   *                         example: Andy
   *                       email: 
   *                         type: string
   *                         example: user@user.com
   *                       is_admin: 
   *                         type: boolean
   *                         example: true
   *       424: 
   *         $ref: '#/responses/NonSuccess'
   */
router.post('/:id/users', async (ctx) => {
  try {
    // TODO: Validate request 
    const league_id = ctx.params.id
    let user_id = ctx.request.body.user_id
    const league = await queries.getLeagueById(league_id)
    const user = await leagueUserQueries.createLeagueUser({
      user_id,
      league_id,
      is_admin: !!ctx.request.body.is_admin
    })
    if (user.length && league.length) {
      const users = await leagueUserQueries.getAllLeagueUsers(league_id)
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: {...league[0], users}
      }
    } else { 
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Unable to post new league user'
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
   * /leagues/{leagueId}/users/{userId}:
   *   delete:
   *     summary: Remove user from league
   *     tags:
   *      - Leagues
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: leagueId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of league to add user to
   *      - in: path
   *        name: userId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of user to remove
   *     responses:
   *       201:
   *         description: user removed from league
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               allOf: 
   *                 - $ref: '#/definitions/League'
   *               properties:
   *                 deleted_at: 
   *                   type: string
   *                   format: date-time
   *                 updated_at: 
   *                   type: string
   *                   format: date-time
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties: 
   *                       user_id: 
   *                         type: integer
   *                         example: 3
   *                       user_name: 
   *                         type: string
   *                         example: Andy
   *                       email: 
   *                         type: string
   *                         example: user@user.com
   *                       is_admin: 
   *                         type: boolean
   *                         example: true
   *       424: 
   *         $ref: '#/responses/NonSuccess'
   */
  router.delete('/:id/users/:user_id', async (ctx) => {
    try {
      // TODO: Validate request 
      const league_id = ctx.params.id
      const user_id = ctx.params.user_id
      const league = await queries.getLeagueById(league_id)
      const user = await leagueUserQueries.deleteUserFromLeague(league_id, user_id)
      if (user.length && league.length) {
        const users = await leagueUserQueries.getAllLeagueUsers(league_id)
        ctx.status = 201;
        ctx.body = {
          status: 'success',
          data: {...league[0], users}
        }
      } else { 
        ctx.status = 424;
        ctx.body = {
          status: 'error',
          message: 'Unable to remove league user'
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
   * /leagues/users/{userId}:
   *   get:
   *     summary: Fetch all leagues for a user
   *     tags:
   *      - Leagues
   *     produces:
   *      - application/json
   *     parameters: 
   *      - in: path
   *        name: userId
   *        schema: 
   *          type: integer
   *          required: true
   *          description: Id of user to fetch leagues for
   *     responses:
   *       200:
   *         description: single user's leagues
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data: 
   *               type: array
   *               items:
   *                 $ref: '#/definitions/League'
   */
router.get('/users/:id', async (ctx) => {
  try {
    const id = ctx.params.id
    const leagues = await queries.getAllLeaguesForUser(id)
    ctx.body = {
      status: 'success',
      data: leagues
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