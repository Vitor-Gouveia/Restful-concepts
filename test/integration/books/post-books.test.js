const supertest = require('supertest')
const sinon = require('sinon')

const { server } = require('../../../lib/server')
const { books } = require('../../../lib/clients/database')

let app
const sandbox = sinon.createSandbox()

describe('POST /books', () => {
  before(async () => {
    app = await server.start()
  })

  after(async () => {
    await server.stop()
    sandbox.restore()
  })

  afterEach(() => sandbox.restore())

  it('Should return 400 on wrong request body', async () => {
    await supertest(app)
      .post('/books')
      .expect(400)
  })

  it('Should return 200', async () => {
    sandbox.stub(books, 'findOne').onFirstCall().returns(null)
    sandbox.stub(books, 'insertOne').returns([])

    await supertest(app)
      .post('/books')
      .send({
        title: 'Minu',
        pages: 200,
        author: 'Minu'
      })
      .expect(200)
  })

  it('Should return 400 when book already exists', async () => {
    sandbox.stub(books, 'findOne').onFirstCall().returns({
      _id: '1',
      title: 'Minu',
      pages: 200,
      author: 'Minu'
    })
    sandbox.stub(books, 'insertOne').returns([])

    await supertest(app)
      .post('/books')
      .send({
        title: 'Minu',
        pages: 200,
        author: 'Minu'
      })
      .expect(400)
  })
})
