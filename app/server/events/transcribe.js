import Iota from '../../models/iota'
import serverEvents from './index'
import speech from '@google-cloud/speech'
import https from 'https'
import fs from 'fs'
import superagent from 'superagent'

function googleRecognize(audioBytes) {
  return new Promise(async (ok, ko) => {
    const client = new speech.SpeechClient({
      credentials: {
        client_email: process.env.GOOGLE_APPLICATION_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_APPLICATION_PRIVATE_KEY.replace(/\\n/gm, '\n'),
      },
      projectId: process.env.GOOGLE_APPLICATION_PROJECT_ID,
    })
    const audio = {
      content: audioBytes,
    }
    const config = {
      encoding: 'LINEAR16',
      languageCode: 'en-US',
      enableWordTimeOffsets: true,
    }
    const request = {
      audio: audio,
      config: config,
    }
    const [response] = await client.recognize(request)
    let transcribeData = response.results[0].alternatives[0]
    ok(transcribeData)
  })
}

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
    try {
      let convertedFile = speakingFile.replace('.mp4', '.wav')
      const resp = await superagent.get(convertedFile)
      let audioString = resp.body.toString('base64')
      const transcribeData = await googleRecognize(audioString)
      transcriptionIota.component.transcriptions.push(transcribeData)
    } catch (err) {
      logger.error('notify of new recording caught error', speakingFile, err)
    }
  }

  await Iota.insertOne(transcriptionIota)
}
serverEvents.on(serverEvents.eNames.ParticipantCreated, notifyOfNewRecording)
