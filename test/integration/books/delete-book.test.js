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

describe('DELETE /books/:id', () => {
  before(async () => {
    app = await server.start()
  })

  after(async () => {
    await server.stop()
    sandbox.restore()
  })

  afterEach(() => sandbox.restore())

  it("Should not be able to delete book that doesn't exist", async () => {
    const bookFixture = getBookFixture()

    sandbox.stub(books, 'findOne').onFirstCall().returns(null)

    const { body } = await supertest(app)
      .delete(`/books/${bookFixture._id}`)
      .expect(400)

    assert.deepEqual(body, {
      ok: false,
      message: 'Não existe um livro com esse ID'
    })
  })

  it('Should return 200', async () => {
    const bookFixture = getBookFixture()

    sandbox.stub(books, 'findOne').onFirstCall().returns(bookFixture)
    sandbox.stub(books, 'findOneAndDelete').callsFake(({ _id }) => {
      assert.equal(_id.toString(), bookFixture._id)
    })

    const { body } = await supertest(app)
      .delete(`/books/${bookFixture._id}`)
      .expect(200)

    assert.deepEqual(body, {
      ok: true
    })
  })
})
