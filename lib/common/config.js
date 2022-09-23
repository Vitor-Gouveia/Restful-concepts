require('dotenv-safe/config')

const configurations = {
  register (configurationName = '') {
    this[configurationName.toLowerCase()] = process.env[configurationName]
  }
}

configurations.register('PORT')
configurations.register('NODE_ENV')
configurations.register('REDIS_URL')
configurations.register('MONGO_URI')

const config = {
  get (key) {
    const value = configurations[key]

    if (!value) {
      throw new Error('Using undefined envorinment variable!')
    }

    return value
  }
}

module.exports = {
  config
}
