const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx) => {
  // redirect root to swagger docs
  ctx.status = 301
  ctx.redirect('/api/v1/swagger')
})

router.get('/ping', async (ctx) => {
  ctx.body = 'pong'
})

/**
 * @swagger
 *  responses:
 *    NotFound:
 *      description: The specified resource was not found
 *      schema:
 *        $ref: '#/definitions/Error'
 *    NonSuccess:
 *      description: The specified action could not be completed
 *      schema:
 *        $ref: '#/definitions/Error'
 */

/**
 * @swagger
 * definitions:
 *   Game:
 *     type: object
 *     properties:
 *       id: 
 *         type: integer
 *         example: 2
 *       home_id:
 *         type: integer
 *         example: 12
 *       away_id:
 *         type: integer
 *         example: 14
 *       winning_id: 
 *          type: integer
 *          example: 12
 *       home_score:
 *          type: integer
 *          example: 24
 *       away_score:
 *          type: integer
 *          example: 10
 *       game_time: 
 *          type: string
 *          format: date-time
 *       season_week:
 *          type: string
 *          example: 20-5
 *   Pick:
 *     type: object
 *     properties:
 *       id: 
 *         type: integer
 *         example: 1
 *       league_id:
 *         type: integer
 *         example: 1
 *       user_id:
 *         type: integer
 *         example: 1
 *       game_id: 
 *          type: integer
 *          example: 1
 *       team_id: 
 *          type: integer
 *          example: 12
 *       home_score:
 *          type: integer
 *          example: 24
 *       away_score:
 *          type: integer
 *          example: 10
 *   League:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: "my league"
 *       id: 
 *         type: integer
 *         example: 5
 *       created_at: 
 *         type: string
 *         format: date-time
 *   User:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: user
 *       email:
 *         type: string
 *         example: user@user.com
 *       id: 
 *         type: integer
 *         example: 5
 *       last_login: 
 *         type: string
 *         format: date-time
 *   Team:
 *     type: object
 *     properties:
 *       id: 
 *         type: integer
 *         example: 12
 *       name:
 *         type: string
 *         example: Packers
 *       location:
 *         type: string 
 *         example: Green Bay
 *       logo_url:
 *         type: string
 *         example: https://example.com
 *   Error:
 *     type: object
 *     properties: 
 *       status: 
 *         type: integer
 *       message: 
 *         type: string
 */

module.exports = router;  