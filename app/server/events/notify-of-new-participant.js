'use strict'

import Iota from '../../models/iota'
import serverEvents from './index.js'

import sendEmail from '../util/send-email'
import Config from '../../../public.json'

if (!process.env.NOTIFY_OF_NEW_PARTICIPANT_TO) {
  console.error('NOTIFY_OF_NEW_PARTICIPANT_TO not set in env')
}

async function notifyOfNewParticipant(iota) {
  const viewer = await Iota.findOne({ _id: Iota.ObjectID(iota.parentId) })

  let request = {
    from: Config.sendEmailFrom,
    to:
      iota.component &&
      iota.component.participant &&
      iota.component.participant.bp_info &&
      iota.component.participant.bp_info.candidate_stage_result_id
        ? process.env.NOTIFY_OF_NEW_PARTICIPANT_TO || 'davidfridley@enciv.org'
        : 'davidfridley@enciv.org',
    subject: 'New Participant Recording',
    text: `New recording from ${iota.component.participant.name} running for ${iota.subject}. View it at ${
      process.env.HOSTNAME === 'localhost' ? 'http' : 'https'
    }://${process.env.HOSTNAME}${viewer && viewer.path}\n\nbp_info=${JSON.stringify(
      iota && iota.component && iota.component.participant && iota.component.participant.bp_info,
      null,
      '\t'
    )}`,
  }

  logger.info('notifyOfNewParticipant', request)
  sendEmail(request).catch(error => cb({ error: error.message })) // no then because we we have nothing to do but send it out
}

serverEvents.on(serverEvents.eNames.ParticipantCreated, notifyOfNewParticipant)