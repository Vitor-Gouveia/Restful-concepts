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
    if (!(key in configurations)) {
      throw new Error('Environment variable not set!')
    }

    const value = configurations[key]

    if (!value) {
      throw new Error('Using empty envorinment variable!')
    }

    return value
  }
}

module.exports = {
  config
}
