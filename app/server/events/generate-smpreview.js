'use strict'

const serverEvents = require('./index.js')
const { callSocketApi } = require('socket-api')

async function generateSMPreview(iota) {
  callSocketApi('generate_smpreview', iota)
}

if (
  ['SOCKET_API_KEY', 'SOCKET_API_URL'].reduce((allExist, name) => {
    if (!process.env[name]) {
      logger.error('env ', name, 'not set. Real-time social preview generation not enabled')
      return false
    } else return allExist
  }, true)
) {
  serverEvents.on(serverEvents.eNames.ParticipantCreated, generateSMPreview)
  logger.info('Real-time social preview generation enabled')
}
