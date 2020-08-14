'use strict'

import serverEvents from './index.js'
import socketAPIClient from 'socket-api/client'

async function generateSMPreview(iota) {
  socketAPIClient('generate_smpreview', iota)
}

if (
  ['SOCKET_API_KEY', 'SOCKET_API_URL'].reduce((allExist, name) => {
    if (!process.env[name]) {
      logger.error('env ', name, 'not set. Real-time smpreview generation not enabled.')
      return false
    } else return allExist
  }, true)
) {
  serverEvents.on(serverEvents.eNames.ParticipantCreated, generateSMPreview)
}
