const axios = require('axios')
const https = require('https')
const config = require('../config')
const { getUserCredentials } = require('./userHelper')

const makeApiRequest = async (method, url, headers, data) => {
  try {
    const response = await axios({
      method,
      url,
      headers,
      data,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
    return response
  } catch (error) {
    const errorMessage = `API request failed: ${error.message}\nURL: ${url}\nMETHOD: ${method}\nHEADERS: ${JSON.stringify(
      headers
    )}`
    throw new Error(errorMessage)
  }
}

const getAuthHeaders = (user) => {
  const { username, password } = getUserCredentials(user)
  const headers = {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  }
  return headers
}

const getWebDavUrl = (user, fileName) => {
  return `${config.baseOcisUrl}/dav/files/${user}/${fileName}`
}

module.exports = {
  makeApiRequest,
  getWebDavUrl,
  getAuthHeaders
}
