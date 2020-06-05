import Iota from '../../models/iota'
import serverEvents from './index'
import speech from '@google-cloud/speech'
import https from 'https'
import fs from 'fs'
// add insert
async function notifyOfNewRecording(participantIota) {
  participantIota._id = Iota.ObjectID()
  participantIota.subject = 'Speech to text for: ' + participantIota.subject
  participantIota.description = 'Transcription for: ' + participantIota.description
  participantIota.component.component = 'Transcription'
  participantIota.component.transcription = []
  logger.info('~~~~~~~~~~~~~~~~', participantIota)
  let bite = participantIota.component.participant.speaking[1]
  let conv = bite.replace('.mp4', '.wav')
  let file = fs.createWriteStream('file.wav', 'base64')
  let request = https.get(conv, function(resp) {
    logger.info('Status code is:' + Object.getOwnPropertyNames(resp))
    resp.pipe(file)
    file.on('finish', function() {
      const file2 = fs.readFileSync('file.wav')
      let audioBase = file2.toString('base64')
      main(audioBase).catch(console.error)
    })
  })
  logger.info('~~~~~~~~', conv)
  async function main(audioByte) {
    const client = new speech.SpeechClient()
    const audio = {
      content: audioByte,
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
    let info2 = response.results[0].alternatives[0]
    logger.info('info2', info2)

    participantIota.component.transcription.push(info2)
    logger.info('testing push', participantIota)
    //the two lines below will be executed after looping
    delete participantIota.component.participant
    await Iota.insertOne(participantIota)
  }
}
serverEvents.on(serverEvents.eNames.ParticipantCreated, notifyOfNewRecording)
