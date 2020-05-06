const bcrypt = require('bcrypt')
const Router = require('koa-router')
const queries = require('../../../db/queries/users')
const leagueUserQueries = require('../../../db/queries/leagueUsers')

const router = new Router()
const BASE_URL = `/api/v1/users`

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