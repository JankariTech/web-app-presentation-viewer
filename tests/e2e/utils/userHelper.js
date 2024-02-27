const config = require('../config')

const getUserCredentials = (user) => {
  if (user === 'admin') {
    return { username: config.adminUser, password: config.adminPassword }
  } else {
    throw new Error('user not found!')
  }
}

module.exports = { getUserCredentials }
