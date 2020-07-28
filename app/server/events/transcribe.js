import Iota from '../../models/iota'
import serverEvents from './index'
import cloudinary from 'cloudinary'
import https from 'https'
import fs from 'fs'
import superagent from 'superagent'
/*
function googleRecognize(audioBytes) {
  return new Promise(async (ok, ko) => {
    const client = new speech.SpeechClient({
      credentials: {
        client_email: process.env.TRANSCRIPTION_CLIENT_EMAIL,
        private_key: process.env.TRANSCRIPTION_PRIVATE_KEY.replace(/\\n/gm, '\n'),
      },
      projectId: process.env.TRANSCRIPTION_PROJECT_ID,
    })
    const audio = {
      content: audioBytes,
    }
    const config = {
      encoding: 'LINEAR16',
      languageCode: 'en-US',
      enableWordTimeOffsets: true,
    }
    const transcribeRequest = {
      audio: audio,
      config: config,
    }
    const [operation] = await client.longRunningRecognize(transcribeRequest)
    const [response] = await operation.promise()
    if (
      !response.results ||
      !response.results[0] ||
      !response.results[0].alternatives ||
      !response.results[0].alternatives[0]
    ) {
      logger.error('missing data from google speech to text api', response)
      ko()
    }
    let transcribeData = response.results[0].alternatives[0]
    ok(transcribeData)
  })
}
*/
async function notifyOfNewRecording(participantIota) {
  const transcriptionIota = {
    parentId: participantIota.parentId,
    subject: 'Speech to text for: ' + participantIota.subject,
    description: 'Transcription for: ' + participantIota.description,
    component: {
      component: 'Transcription',
      participantId: participantIota._id.toString(),
      transcriptions: [],
    },
  }
  for await (const speakingFile of participantIota.component.participant.speaking) {
    var re = /v(\d*)\//
    var id = speakingFile.match(re)
    var new_id = parseInt(id[1]) + 1
    var new_route = 'v' + new_id.toString() + '/'
    let convertedFile = speakingFile
      .replace('.mp4', '.transcript')
      .replace('video', 'raw')
      .replace(re, new_route, 1)
      .replace('q_auto/', '')
    logger.info(convertedFile)
    superagent
      .get(convertedFile)
      .then(res => {
        let data = ''
        res.on('data', chunk => {
          data += chunk
        })
        res.on('end', async () => {
          logger.info(JSON.parse(data))
        })
      })
      .catch(err => console.log('Error: ' + err))
    //logger.info(JSON.stringify(resp))
    //logger.info(resp.body.toString())

    /*
    cloudinary.v2.uploader.upload(speakingFile, {
      resource_type: 'video',
      raw_convert: 'google_speech',
      notification_url: '/hook',
    },
      function (error, result) { logger.info(JSON.stringify(result.info.raw_convert), error) })
    /*let convertedFile = speakingFile.replace('.mp4', '.wav')
    const resp = await superagent.get(convertedFile)
    let audioString = resp.body.toString('base64')
    const transcribeData = await googleRecognize(audioString)
    transcriptionIota.component.transcriptions.push(transcribeData)*/
  }
  /*try {
    await Iota.create(JSON.parse(JSON.stringify(transcriptionIota)))
  } catch (err) {
    logger.error('notify of mongo insert caught error', err)
  }*/
}
if (
  ['TRANSCRIPTION_CLIENT_EMAIL', 'TRANSCRIPTION_PRIVATE_KEY', 'TRANSCRIPTION_PROJECT_ID'].reduce((allExist, name) => {
    if (!process.env[name]) {
      logger.error('env ', name, 'not set. Transcription not enabled')
      return false
    } else return allExist
  }, true)
) {
  serverEvents.on(serverEvents.eNames.ParticipantCreated, notifyOfNewRecording)
}
