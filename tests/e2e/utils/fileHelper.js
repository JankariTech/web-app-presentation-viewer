const fs = require('fs')
const path = require('path')
const { getWebDavUrl, makeApiRequest, getAuthHeaders } = require('./apiHelper')
const config = require('../config')

const userDetails = []

const readLocalFileContent = (fileName) => {
  const filePath = path.join(config.assets, fileName)
  return fs.readFileSync(filePath, 'utf8')
}

const uploadFile = async (fileName, user) => {
  const url = getWebDavUrl(user, fileName)
  const content = readLocalFileContent(fileName)
  const response = await makeApiRequest('PUT', url, getAuthHeaders(user), content)
  userDetails.push({ user, fileName })
  return response
}

const deleteResource = (user, resource) => {
  const url = getWebDavUrl(user, resource)
  return makeApiRequest('DELETE', url, getAuthHeaders(user))
}

const cleanupResources = async () => {
  for (const userDetail of userDetails) {
    await deleteResource(userDetail.user, userDetail.fileName)
  }
  userDetails.length = 0
}

module.exports = { uploadFile, cleanupResources }
