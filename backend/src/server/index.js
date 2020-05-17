const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const helmet = require("koa-helmet")
const morgan = require('koa-morgan')
const koaSwagger = require('koa2-swagger-ui')

const swaggerDef = require('./swaggerDef')
const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')
const teamRoutes = require('./routes/teams')
const leagueRoutes = require('./routes/leagues')
const gameRoutes = require('./routes/games')
const pickRoutes = require('./routes/picks')

const app = new Koa()
const PORT = process.env.PORT || 3000;

app.use(bodyParser())
app.use(helmet()) // add OWASP headers
app.use(morgan('tiny')) // logging level

// Add Swagger UI from swagger spec (jsdoc comments)
app.use(
  koaSwagger({
    routePrefix: '/api/v1/swagger',
    swaggerOptions: { 
      spec: swaggerDef,
    },
  }),
)

// routes
app.use(indexRoutes.routes())
app.use(userRoutes.routes())
app.use(teamRoutes.routes())
app.use(leagueRoutes.routes())
app.use(gameRoutes.routes())
app.use(pickRoutes.routes())

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = server