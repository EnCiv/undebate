import Transcribe from '../../models/transcribe'
import serverEvents from './index'
import speech from '@google-cloud/speech'
import https from 'https'
import fs from 'fs'

async function notifyOfNewRecording(transcribe) {
  logger.info('~~~~~~~~~~~~~~~~', transcribe)
  const piece = await Transcribe.findOne({ _id: Transcribe.ObjectID(transcribe._id) })
  let bite = piece.component.participant.speaking[1]
  let conv = bite.replace('.mp4', '.wav')
  let file = fs.createWriteStream('file.wav', 'base64')
  let request = https.get(conv, function(resp) {
    logger.info('Status code is:' + Object.getOwnPropertyNames(resp))
    resp.pipe(file)
    file.on('finish', function() {
      const file2 = fs.readFileSync('/Users/ep/Documents/kaggle/encv/undebate/file.wav')
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
    /*const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        logger.info(`Transcription: ${transcription}`);
        let info = response.results
            .map(result => result.alternatives[0].words)*/
    let info2 = JSON.stringify(response.results[0].alternatives[0])
    logger.info('info2', info2)
    await Transcribe.updateOne({ _id: Transcribe.ObjectID(transcribe._id) }, { $set: { words: info2 } })
  }
}
serverEvents.on(serverEvents.eNames.RecordingCreated, notifyOfNewRecording)
