'use strict'

import Iota from '../models/iota'
import Transcribe from '../models/transcribe'
import serverEvents from '../server/events'

export default async function createParticipant(obj, cb) {
  if (!this.synuser) cb() // if no user do nothing
  obj.userId = this.synuser.id
  try {
    var result = await Iota.create(obj)
    var result2 = await Transcribe.create(obj)
    cb(result)
    cb(result2)
    serverEvents.emit(serverEvents.eNames.ParticipantCreated, result)
    serverEvents.emit(serverEvents.eNames.RecordingCreated, result2)
  } catch (err) {
    logger.error('createParticipant error:', err)
  }
}
