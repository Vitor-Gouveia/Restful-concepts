import 'dotenv-safe/config'

const configurations = {
  port: process.env.PORT || 3333,
  env: process.env.NODE_ENV || 'production'
}

export const config = {
  get (key) {
    return configurations[key]
  }
}
