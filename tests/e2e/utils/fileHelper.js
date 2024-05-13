const { getWebDavUrl, makeApiRequest, getAuthHeaders } = require('./apiHelper')

let userDetails = []

const uploadFileWithContent = async (fileName, user, data) => {
  const url = getWebDavUrl(user, fileName)
  const response = await makeApiRequest('PUT', url, getAuthHeaders(user), data)
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
  userDetails = []
}

module.exports = { uploadFileWithContent, cleanupResources }
