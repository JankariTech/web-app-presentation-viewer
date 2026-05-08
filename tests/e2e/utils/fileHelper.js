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
  const content = readLocalFileContent(fileName.split('/').pop())
  const response = await makeApiRequest('PUT', url, getAuthHeaders(user), content)
  const parentFolder = fileName.split('/')[0]
  const folderExists = userDetails.some(
    (userDetail) => userDetail.user === user && userDetail.resource === parentFolder
  )
  if (!folderExists) {
    userDetails.push({ user, resource: fileName })
  }
  return response
}

const deleteResource = (user, resource) => {
  const url = getWebDavUrl(user, resource)
  return makeApiRequest('DELETE', url, getAuthHeaders(user))
}

const cleanupResources = async () => {
  for (const userDetail of userDetails) {
    await deleteResource(userDetail.user, userDetail.resource)
  }
  userDetails.length = 0
}

const createFolder = async (user, folder) => {
  const url = `${config.baseUrl}/dav/files/${user}/${folder}`
  const response = await makeApiRequest('MKCOL', url, getAuthHeaders(user))
  if (response.status !== 201) {
    throw new Error(`Failed to create folder ${folder}.\nStatus: ${response.status}`)
  }
  userDetails.push({ user, resource: folder })
}

module.exports = { uploadFile, cleanupResources, createFolder }
