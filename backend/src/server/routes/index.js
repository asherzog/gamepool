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
 *   Error:
 *     type: object
 *     properties: 
 *       status: 
 *         type: integer
 *       message: 
 *         type: string
 */

module.exports = router;  