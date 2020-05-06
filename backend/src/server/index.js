const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const helmet = require("koa-helmet")
const morgan = require('koa-morgan')
const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')
const teamRoutes = require('./routes/teams')
const leagueRoutes = require('./routes/leagues')
const leagueUserRoutes = require('./routes/leagueUsers')

const app = new Koa()
const PORT = process.env.PORT || 3000;

app.use(bodyParser())
app.use(helmet())
app.use(morgan('tiny'))

// routes
app.use(indexRoutes.routes())
app.use(userRoutes.routes())
app.use(teamRoutes.routes())
app.use(leagueRoutes.routes())
app.use(leagueUserRoutes.routes())

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = server