const supertest = require('supertest')

const { server } = require('../../lib/server')

let app

describe('/health-check', () => {
  before(async () => {
    app = await server.start()
  })

  after(async () => {
    await server.stop()
  })

  it('Should return 200 in GET method', async () => {
    await supertest(app)
      .get('/health-check')
      .expect(200)
  })
})
