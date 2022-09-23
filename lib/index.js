const { Server } = require('./server/index.js')
const { Redis } = require('./clients/cache/redis')
const { Mongo } = require('./clients/database/mongo')

const redis = new Redis()
const mongo = new Mongo()
const server = new Server({
  context: {
    redis,
    mongo
  }
})

process.on('SIGTERM', shutdown)
  .on('SIGINT', shutdown)
  .on('SIGHUP', shutdown)
  .on('uncaughtException', (err) => {
    console.error('uncaughtException caught the error: ', err)
    throw err
  })
  .on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection at: Promise ${promise} reason: ${err}`)
    throw err
  })
  .on('exit', (code) => {
    console.log(`Node process exit with code: ${code}`)
  })

;(async () => {
  try {
    await redis.start()
    await mongo.start()

    await server.start()
    console.log('[APP] initialized SUCCESSFULLY \n')
  } catch (error) {
    console.error('[APP] initialization failed:', error.message)
    throw error
  }
})()

async function shutdown () {
  console.log('Gracefully shutdown in progress')

  await redis.stop()
  await mongo.stop()
  await server.stop()

  process.exit(0)
}
