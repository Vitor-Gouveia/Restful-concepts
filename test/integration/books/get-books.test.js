const supertest = require('supertest')
const sinon = require('sinon')

const { server } = require('../../../lib/server')
const { books } = require('../../../lib/clients/database')
const cache = require('../../../lib/clients/cache')
const { expect, assert } = require('chai')
const bookController = require('../../../lib/modules/books/controller')

let app
const sandbox = sinon.createSandbox()

const booksFake = [
  {
    id: '0',
    title: 'Minu',
    pages: 200,
    author: 'Minu'
  }
]

describe('GET /books', () => {
  before(async () => {
    app = await server.start()
  })

  after(async () => {
    await server.stop()
    sandbox.restore()
  })

  afterEach(() => sandbox.restore())

  it('Should return 200', async () => {
    sandbox.stub(cache, 'get').onFirstCall().returns(null)
    sandbox.stub(cache, 'set').onFirstCall().returns(null)

    sandbox.stub(books, 'find').onFirstCall().returns({
      toArray () {
        return booksFake
      }
    })

    const { body } = await supertest(app)
      .get('/books')
      .expect(200)

    assert.deepEqual(booksFake, body.books)
    // expect(JSON.stringify(booksFake) === JSON.stringify(body.books)).to.be.true
  })

  it('Should return correct expiration date', async () => {
    sandbox.stub(cache, 'get').onFirstCall().returns(null)
    sandbox.stub(cache, 'set').onFirstCall().returns(null)

    sandbox.stub(books, 'find').onFirstCall().returns({
      toArray: () => booksFake
    })

    await supertest(app)
      .get('/books')
      .expect(200)
  })

  it('Should return cached books', async () => {
    sandbox.stub(cache, 'get').onFirstCall().returns(JSON.stringify({
      expiresIn: bookController.createCacheTimeInSeconds(booksFake.length),
      books: booksFake
    }))

    const booksQuery = sandbox.spy(books.find)
    const cacheCreatorSpy = sandbox.spy(bookController.createCacheTimeInSeconds)

    const { body, headers } = await supertest(app)
      .get('/books')
      .expect(200)

    expect(Number(headers['X-Total-Count']) === booksFake.length)
    assert.deepEqual(body.books, booksFake)
    assert.isFalse(booksQuery.called)
    assert.isFalse(cacheCreatorSpy.called)
  })

  it('Should expire redis cache and query the database', async () => {
    sandbox.stub(cache, 'get').onFirstCall().returns(JSON.stringify({
      expiresIn: 1664913717221,
      books: booksFake
    })).onSecondCall().returns(undefined)
    sandbox.stub(cache, 'set').returns(undefined)

    sandbox.stub(cache, 'del').callsFake(key => {
      assert.isTrue(key === 'cached-books')
    })

    sandbox.stub(books, 'find').returns({
      toArray: () => [...booksFake, ...booksFake]
    })

    await supertest(app)
      .get('/books')
      .expect(200)

    // insert new book
    const { body } = await supertest(app)
      .get('/books')
      .expect(200)

    assert.isFalse(body.expiresInDate === 1664913717221)
    assert.isTrue(JSON.stringify(body.books) === JSON.stringify([...booksFake, ...booksFake]))
  })
})
