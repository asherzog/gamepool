const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  info: {
    title: 'GamePool',
    version: '1.0.0',
    description: 'GamePool API',
  },
  basePath: '/api/v1' 
}

module.exports = swaggerJSDoc({swaggerDefinition, apis: ['./src/server/routes/*.js']})