'use strict'

import { Iota, serverEvents } from 'civil-server'

serverEvents.eNameAdd('ParticipantCreated')

export default async function createParticipant(obj, cb) {
  try {
    if (!this.synuser) {
      cb() // if no user do nothing
      return
    }
    obj.userId = this.synuser.id
    var result = await Iota.create(obj)
    cb(result)
    serverEvents.emit(serverEvents.eNames.ParticipantCreated, result)
  } catch (err) {
    logger.error('createParticipant error:', err)
  }
}
