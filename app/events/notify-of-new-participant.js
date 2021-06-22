'use strict'

import { Iota, serverEvents } from 'civil-server'

import sendEmail from 'nodemailerstart'
import Config from '../../public.json'

var SibApiV3Sdk = require('sib-api-v3-sdk')

export default async function notifyOfNewParticipant(iota) {
  const viewer = await Iota.findOne({ _id: Iota.ObjectID(iota.parentId) })

  let viewer_url = `${process.env.HOSTNAME === 'localhost:3011' ? 'http' : 'https'}://${process.env.HOSTNAME}${viewer &&
    viewer.path}`
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
    text: `New recording from ${iota.component.participant.name} running for ${
      iota.subject
    }. View it at ${viewer_url}\n\nbp_info=${JSON.stringify(
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
    viewer.bp_info &&
    viewer.bp_info.election_source
  ) {
    let message = {
      from: Config.sendEmailFrom,
      to: iota.component.participant.bp_info.candidate_emails[0],
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

  if (
    iota.component &&
    iota.component.participant &&
    iota.component.participant.bp_info &&
    ((iota.component.participant.bp_info.candidate_emails && iota.component.participant.bp_info.candidate_emails[0]) ||
      (iota.component.participant.bp_info.person_emails && iota.component.participant.bp_info.person_emails[0])) &&
    iota.component.participant.bp_info.candidate_stage_result_id
  ) {
    let email =
      (iota.component.participant.bp_info.candidate_emails && iota.component.participant.bp_info.candidate_emails[0]) ||
      iota.component.participant.bp_info.person_emails[0]
    var sendSmtpEmail = {
      to: [
        {
          email: email,
          name: iota.component.participant.bp_info.candidate_name,
        },
      ],
      templateId: parseInt(process.env.SENDINBLUE_TEMPLATE_ID),
      params: {
        viewer_url: viewer_url,
        ...iota.component.participant.bp_info,
      },
    }
    if (process.env.SENDINBLUE_BCC) {
      // add a bcc option so we can know it's really working
      // could be "First Last <example.email.com>"" or just "example.email.com"
      let parts = process.env.SENDINBLUE_BCC.split('<')
      var bcc = {}
      if (parts.length > 1) {
        bcc.name = parts[0].trim()
        bcc.email = parts[1].split('>')[0].trim()
      } else {
        bcc.email = parts[0].trim()
      }
      sendSmtpEmail.bcc = [bcc]
    }
    delete sendSmtpEmail.params.candidate_emails
    delete sendSmtpEmail.params.person_emails
    logger.info('notifyOfNewParticipant:SibSMTPApi', sendSmtpEmail)
    SibSMTPApi.sendTransacEmail(sendSmtpEmail).then(
      function(data) {
        logger.trace('Sendinblue API called successfully. Returned data: ', data)
      },
      function(error) {
        logger.error('Sendingblue API caught error:', error)
      }
    )
  }
}
if (
  ['SENDINBLUE_API_KEY', 'SENDINBLUE_TEMPLATE_ID', 'NOTIFY_OF_NEW_PARTICIPANT_TO'].reduce((allExist, name) => {
    if (!process.env[name]) {
      logger.error('env ', name, 'not set. Notification of New Participants not enabled')
      return false
    } else return allExist
  }, true)
) {
  // initialize the sending blue keys
  SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY
  var SibSMTPApi = new SibApiV3Sdk.SMTPApi()
  // register for the events
  serverEvents.on(serverEvents.eNames.ParticipantCreated, notifyOfNewParticipant)
}
