const supertest = require('supertest')
const sinon = require('sinon')

const { server } = require('../../../lib/server')
const { books } = require('../../../lib/clients/database')
const { assert } = require('chai')

const getBookFixture = (params = {}) => ({
  _id: '633733b3d6eb2b21b9c9ed1a',
  title: 'Minu',
  pages: 200,
  author: 'Minu',
  ...params
})

let app
const sandbox = sinon.createSandbox()

describe('GET /books/:id', () => {
  before(async () => {
    app = await server.start()
  })

  after(async () => {
    await server.stop()
    sandbox.restore()
  })

  afterEach(() => sandbox.restore())

  it("Should not delete a book that doesn't exist", async () => {
    const bookFixture = getBookFixture()
    sandbox.stub(books, 'findOne').onFirstCall().returns(null)

    const { body } = await supertest(app)
      .get(`/books/${bookFixture._id}`)
      .expect(400)

    assert.equal(body.ok, false)
    assert.equal(body.message, 'Não existe um livro com esse ID')
  })

  it('Should return 200', async () => {
    const bookFixture = getBookFixture()

    sandbox.stub(books, 'findOne').onFirstCall().returns(bookFixture)

    const { body } = await supertest(app)
      .get(`/books/${bookFixture._id}`)
      .expect(200)

    assert.deepEqual(body, bookFixture)
  })
})
