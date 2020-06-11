import Iota from '../../models/iota'
import serverEvents from './index'
import speech from '@google-cloud/speech'
import https from 'https'
import fs from 'fs'

async function notifyOfNewRecording(participantIota) {
  participantIota._id = Iota.ObjectID()
  participantIota.subject = 'Speech to text for: ' + participantIota.subject
  participantIota.description = 'Transcription for: ' + participantIota.description
  participantIota.component.component = 'Transcription'
  participantIota.component.transcription = []
  let speakingFile = participantIota.component.participant.speaking[1]
  let convertedFile = speakingFile.replace('.mp4', '.wav')
  let chunkedFile = fs.createWriteStream('chunkedFile.wav', 'base64')
  let request = https.get(convertedFile, function(resp) {
    logger.info('Status code is:' + Object.getOwnPropertyNames(resp))
    resp.pipe(chunkedFile)
    chunkedFile.on('finish', function() {
      const chunkedFile2 = fs.readFileSync('chunkedFile.wav')
      let audioString = chunkedFile2.toString('base64')
      main(audioString).catch(console.error)
    })
  })
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
    let transcribeData = response.results[0].alternatives[0]

    participantIota.component.transcription.push(transcribeData)

    //the two lines below will be executed after looping
    delete participantIota.component.participant
    await Iota.insertOne(participantIota)
  }
}
serverEvents.on(serverEvents.eNames.ParticipantCreated, notifyOfNewRecording)
