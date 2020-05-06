const Router = require('koa-router')
const queries = require('../../../db/queries/leagueUsers')

const router = new Router()
const BASE_URL = `/api/v1/leagueUsers`

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const users = await queries.getAllLeagueUsers(ctx.params.id)
    ctx.body = {
      status: 'success',
      data: users
    }
  } catch (err) {
    console.log(err)
  }
})

// router.get(`${BASE_URL}/:id`, async (ctx) => {
//   try {
//     const user = await queries.getLeagueUserById(ctx.params.id)
//     if (user.length) {
//       ctx.body = {
//         status: 'success',
//         data: user[0]
//       }
//     } else {
//       ctx.status = 404
//       ctx.body = {
//         status: 'error',
//         message: `userID: ${ctx.params.id} not found`
//       }
//     }
//   } catch (err) {
//     console.log(err)
//   }
// })

router.post(`${BASE_URL}`, async (ctx) => {
  try {
    // TODO: Validate request 
    let req = ctx.request.body
    
    const user = await queries.createLeagueUser(req)
    if (user.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: user[0]
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

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    // TODO: Validate request
    const id = ctx.params.id 
    let req = ctx.request.body
    
    const user = await queries.updateLeagueUser(id, req)
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
    const user = await queries.deleteLeagueUser(id)
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