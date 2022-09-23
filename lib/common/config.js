require('dotenv-safe/config')

const configurations = {
  port: process.env.PORT || 3333,
  env: process.env.NODE_ENV || 'production'
}

const config = {
  get (key) {
    return configurations[key]
  }
}

module.exports = {
  config
}
