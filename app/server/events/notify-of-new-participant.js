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

  if (
    iota.component &&
    iota.component.participant &&
    iota.component.participant.bp_info &&
    iota.component.participant.bp_info.candidate_emails &&
    viewer.bp_info.election_source &&
    viewer.bp_info.election_source === 'UniversityOfCaliforniaLosAngeles.UndergraduateStudentsAssociation'
  ) {
    let message = {
      from: Config.sendEmailFrom,
      to: iota.component.participant.bp_info.candidate_emails[0],
      cc: process.env.UCLA_USA_EMAIL,
      subject: 'Candidate Conversation for:' + iota.component.participant.bp_info.office,
      text: `Welcome ${
        iota.component.participant.bp_info.candidate_name
      },\n\nYour Candidate Conversation has been uploaded and you can review it here:\n\n${
        process.env.HOSTNAME === 'localhost' ? 'http' : 'https'
      }://${process.env.HOSTNAME}${viewer &&
        viewer.path}\n\nAfter you review it, if you need to re-record it you can go back to the recorder link that was previously sent to you and do it over.\n\nGood Luck\n\nEnCiv.org`,
    }
    logger.info('notifyOfNewParticipant:election_source', viewer.bp_info.election_source, message)
    sendEmail(message).catch(error => cb({ error: error.message })) // no then because we we have nothing to do but send it out
  }
}

serverEvents.on(serverEvents.eNames.ParticipantCreated, notifyOfNewParticipant)
