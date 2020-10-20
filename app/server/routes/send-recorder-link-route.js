'use strict'
/**
 * There are 3 new enviroment variables that need to be created:
 * export SENDINBLUE_TEMPLATE_ID_CANDIDATE="1"   template that will be sent when once recording link is found
 * export SENDINBLUE_TEMPLATE_ID_MANAGER="2"    template that will be sent to email manager(David) in case there is more than one link is found
 * export SENDINBLUE_TEMPLATE_ID_SEND_BP_INFO="3"  template in case we cannot find the email in the database
 * export EMAIL_MANAGER="epg323@gmail.com"
 *
 * for dev we dont send the link to the candidate, we send it to ourselves
 */
import Iota from '../../models/iota'

var SibApiV3Sdk = require('sib-api-v3-sdk')

async function FetchLink({ name, email }) {
  let sendto
  if (process.env.NODE_ENV === 'development') {
    sendto = process.env.EMAIL_MANAGER
  } else {
    sendto = email
  }

  try {
    const participant = await Iota.find({
      $or: [
        {
          'bp_info.candidate_emails': {
            $elemMatch: {
              $eq: email,
            },
          },
        },
        {
          'bp_info.person_emails': {
            $elemMatch: {
              $eq: email,
            },
          },
        },
      ],
    })
    logger.info('Fetched the following link(s)', participant[0].path)
    let uri = Array.isArray(participant[0].path) ? participant[0].path : [participant[0].path]
    let viewer_url = `${process.env.HOSTNAME === 'localhost:3011' ? 'http' : 'https'}://${process.env.HOSTNAME}${uri}`
    let firstname = name.split(' ')[0]
    let sendLink = {
      to: [
        {
          email: sendto,
          name: name,
        },
      ],
      templateId: parseInt(process.env.SENDINBLUE_TEMPLATE_ID_CANDIDATE),
      params: {
        recorder_link: viewer_url,
        firstname: firstname,
      },
    }
    let ManagerPick = {
      to: [
        {
          email: sendto,
          name: name,
        },
      ],
      templateId: parseInt(process.env.SENDINBLUE_TEMPLATE_ID_MANAGER),
      params: {
        recorder_link: viewer_url,
        name: name,
      },
    }
    let EmailPicker = uri.length === 1 ? sendLink : ManagerPick
    SibSMTPApi.sendTransacEmail(EmailPicker).then(
      function(data) {
        logger.trace('Sendinblue API called successfully. Returned data: ', data)
      },
      function(error) {
        logger.error('Sendingblue API caught error:', error)
      }
    )
  } catch (err) {
    logger.info('here it is', sendto)
    let firstname = name.split(' ')[0]
    let sendBpInfo = {
      to: [
        {
          email: sendto,
          name: name,
        },
      ],
      templateId: parseInt(process.env.SENDINBLUE_TEMPLATE_ID_SEND_BP_INFO),
      params: {
        firstname: firstname,
      },
    }
    SibSMTPApi.sendTransacEmail(sendBpInfo).then(
      function(data) {
        logger.trace('Sendinblue API called successfully. Returned data: ', data)
      },
      function(error) {
        logger.error('Sendingblue API caught error:', error)
      }
    )
    logger.error('could not find the email in the database', err)
  }
}

SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY
var SibSMTPApi = new SibApiV3Sdk.SMTPApi()

function sendLinkRoute(req, res, next) {
  try {
    logger.info('####this is the link route#####', req.body)
    FetchLink(req.body)
    res.statusCode = 200
    res.json({ message: 'successful, email is being sent' })
  } catch (error) {
    next(error)
  }
}

export default sendLinkRoute
