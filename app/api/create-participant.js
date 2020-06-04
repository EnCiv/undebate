'use strict'

import Iota from '../models/iota'
import serverEvents from '../server/events'

export default async function createParticipant(obj, cb) {
  if (!this.synuser) cb() // if no user do nothing
  obj.userId = this.synuser.id
  try {
    var result = await Iota.create(obj)
    cb(result)
    serverEvents.emit(serverEvents.eNames.ParticipantCreated, result)
  } catch (err) {
    logger.error('createParticipant error:', err)
  }
}
