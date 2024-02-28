const axios = require('axios')
const https = require('https')
const fs = require('fs')
const path = require('path')

const { config } = require('../config')
const { getUserCredentials } = require('../utils/getUserCredentials')
const baseOcisUrl = config.baseOcisUrl
const userDetails = []

const makeApiRequest = async (method, url, headers, data) => {
  try {
    await axios({
      method,
      url,
      headers,
      data,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
  } catch (error) {
    const errorMessage = `API request failed: ${method} ${url} - Headers: ${JSON.stringify(
      headers
    )} - Data: ${JSON.stringify(data)} - Error: ${error.message}`
    throw new Error(errorMessage)
  }
}

const getAuthHeaders = (user) => {
  try {
    const { username, password } = getUserCredentials(user)
    const headers = {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    }
    return headers
  } catch (error) {
    throw new Error(error.message)
  }
}

const getWebDavUrl = (user, fileName) => {
  return `${baseOcisUrl}/dav/files/${user}/${fileName}`
}

const uploadFile = async (fileName, user) => {
  const fileUploadUrl = getWebDavUrl(user, fileName)
  const filePath = path.join(config.assets, fileName)
  const fileContent = fs.readFileSync(filePath, 'utf8')
  await makeApiRequest('PUT', fileUploadUrl, getAuthHeaders(user), fileContent)
  userDetails.push({ user, fileName })
}

const deleteFile = async () => {
  for (const userDetail of userDetails) {
    const fileDeleteUrl = getWebDavUrl(userDetail.user, userDetail.fileName)
    await makeApiRequest('DELETE', fileDeleteUrl, getAuthHeaders(userDetail.user), null)
  }
}

module.exports = {
  makeApiRequest,
  uploadFile,
  deleteFile,
  getUserCredentials
}
