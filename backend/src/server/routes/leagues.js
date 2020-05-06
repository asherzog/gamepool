const Router = require('koa-router')
const queries = require('../../../db/queries/leagues')
const leagueUserQueries = require('../../../db/queries/leagueUsers')

const router = new Router({prefix: `/api/v1/leagues`})

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

router.get('/:id/users', async (ctx) => {
  try {
    const id = ctx.params.id
    const users = await leagueUserQueries.getAllLeagueUsers(id)
    if (users.length) {
      ctx.body = {
        status: 'success',
        data: users
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
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: league[0]
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

router.post('/:id/users', async (ctx) => {
  try {
    // TODO: Validate request 
    const league_id = ctx.params.id
    let user_id = ctx.request.body.user_id
    const user = await leagueUserQueries.createLeagueUser({
      user_id,
      league_id,
      is_admin: !!ctx.request.body.is_admin
    })
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

router.put('/:id', async (ctx) => {
  try {
    // TODO: Validate request
    const id = ctx.params.id 
    let req = ctx.request.body
    
    const league = await queries.updateLeague(id, req)
    if (league.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: league[0]
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

router.delete('/:id', async (ctx) => {
  try {
    const id = ctx.params.id 
    const league = await queries.deleteLeague(id)
    if (league.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: league[0]
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

module.exports = router