module.exports = {
  default: {
    require: ['tests/e2e/**/*.js'],
    retry: parseInt(process.env.RETRY, 10) || 0,
    format: ['@cucumber/pretty-formatter']
  }
}
