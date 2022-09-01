import 'dotenv-safe/config'

const configurations = {
  port: process.env.PORT,
  env: process.env.NODE_ENV
}

export const config = {
  get (key) {
    return configurations[key]
  }
}
