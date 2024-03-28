module.exports = {
  default: {
    require: ['tests/e2e/**/*.js'],
    retry: process.env.RETRY || 0,
    format: ['@cucumber/pretty-formatter']
  }
}
