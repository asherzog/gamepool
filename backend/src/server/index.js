const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')
const teamRoutes = require('./routes/teams')

const app = new Koa()
const PORT = process.env.PORT || 3000;

app.use(bodyParser())

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(indexRoutes.routes())
app.use(userRoutes.routes())
app.use(teamRoutes.routes())

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = server