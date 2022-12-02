const { logger } = require('../../logger')

// make this scalable
const healthCheckRoutes = (router) => {
  const healthCheck = (_, response) => {
    logger.log('API ALIVE')

    return response.json({
      alive: true,
      timestamp: new Date().getTime()
    })
  }

  router.get('/', healthCheck)
  router.get('/health-check', healthCheck)
}

module.exports = {
  healthCheckRoutes
}
