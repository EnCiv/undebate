import Iota from '../../models/iota'
import serverEvents from './index'
import speech from '@google-cloud/speech'
import superagent from 'superagent'
import fetch from 'node-fetch'
const { Readable } = require('stream')
import wavFileInfo from 'wav-file-info'

// transcribe the participantIota, transcriber is not a parameter passed by the event, but it is included here
// because we export this so it can also be used by other tools
//
export function transcribeParticipantIota(participantIota, transcriber = streamTranscribe) {
  return new Promise(async (ok, ko) => {
    var transcriptionIota = {
      parentId: participantIota.parentId,
      subject: 'Speech to text for: ' + participantIota.subject,
      description: 'Transcription for: ' + participantIota.description,
      component: {
        component: 'Transcription',
        participantId: participantIota._id.toString(),
        transcriptions: [],
      },
    }
    try {
      transcriptionIota.component.transcriptions = await transcribeSpeakingList(
        participantIota.component.participant.speaking,
        transcriber
      )
    } catch (err) {
      logger.error('translateParticipantIota new recording caught error', speakingFile, err)
      return ko(err)
    }
    try {
      await Iota.create(JSON.parse(JSON.stringify(transcriptionIota))) // parse.stringify to remove properties that start with $ that are undefined but make Mongo mad
      ok(transcriptionIota)
    } catch (err) {
      logger.error('translateParticipantIota Iota.create caught error', err)
      return ko(err)
    }
  })
}
//
// transcribe a list of videos of the candidate speaking
// exported so it can also be used by tools
//
export function transcribeSpeakingList(speaking, transcriber = streamTranscribe) {
  return new Promise(async (ok, ko) => {
    var transcriptions = []
    for await (const speakingFile of speaking) {
      try {
        let convertedFile = speakingFile.replace('.mp4', '.wav').replace('/upload/', '/upload/fl_mono/') // some files might have 2 chanel audio which messes up transcription
        const transcribeData = await transcriber(convertedFile)
        transcriptions.push(transcribeData)
      } catch (err) {
        logger.error('transcribeSpeakingList caught error', speakingFile, err)
        ko(err)
      }
    }
    ok(transcriptions)
  })
}

/**
 * convert a buffer into a stream
 */
function bufferToStream(buffer) {
  const readableInstanceStream = new Readable({
    read() {
      this.push(buffer)
      this.push(null)
    },
  })
  return readableInstanceStream
}

/**
 *
 * using google streaming recognize - this should work for recordings up to 5 minutes in length (haven't tested the max length)
 *
 */
function streamTranscribe(url) {
  return new Promise(async (ok, ko) => {
    try {
      const client = new speech.SpeechClient({
        credentials: {
          client_email: process.env.TRANSCRIPTION_CLIENT_EMAIL,
          private_key: process.env.TRANSCRIPTION_PRIVATE_KEY.replace(/\\n/gm, '\n'),
        },
        projectId: process.env.TRANSCRIPTION_PROJECT_ID,
      })

      var res = await fetch(url)
      // we need to read in the whole file in order to get the sample_rate so we can set that in the config for google
      const aBuffer = await res.buffer()
      const waveInfo = wavFileInfo.infoFromBuffer(aBuffer)

      if (waveInfo.header.bits_per_sample !== 16 || waveInfo.header.audio_format !== 1)
        return ko('streamTranslate of', url, 'unsupported format', waveInfo)

      const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: waveInfo.header.sample_rate,
        languageCode: 'en-US',
        enableWordTimeOffsets: true,
        enableAutomaticPunctuation: true,
      }

      const request = {
        config,
        interimResults: false, // If you want interim results, set this to true
      }
      var aBufferStream = bufferToStream(aBuffer)
      var transcriptObj = {
        confidence: 1,
        transcript: '',
        words: [],
      }
      const recognizeStream = client
        .streamingRecognize(request)
        .on('error', err => {
          console.error('error recognizing stream', err)
          ko(err)
        })
        .on('data', data => {
          // for larger wav files, google will return data multiple times. We just keep concatenating the new data to the properties of the object to be returned
          const partial = data.results[0].alternatives[0]
          transcriptObj.confidence = Math.min(transcriptObj.confidence, partial.confidence) // lowest confidence
          transcriptObj.transcript = transcriptObj.transcript + partial.transcript // add new transcription to the end of last. Google seems to already have a trailing space on the end.
          transcriptObj.words = transcriptObj.words.concat(partial.words) // keep adding word (objects) to the array of words
        })
        .on('end', () => {
          ok(transcriptObj)
        })
      aBufferStream.pipe(recognizeStream).on('error', err => {
        console.error('error piping from fetch', err), ko(err)
      })
    } catch (error) {
      logger.error('caught error in streamTranslate', url, error)
      ko(error)
    }
  })
}

/*
 * this will work, but fails if the recording is 60 seconds or more (60 seconds fails, seems like it fails at 55seconds)
 * google does not seem to require the sampleRateHertz in the config - so it is not specified.
 * has not been tested lately
 *
 */
function googleRecognize(url) {
  return new Promise(async (ok, ko) => {
    let convertedFile = url.replace('.mp4', '.wav')
    const resp = await superagent.get(convertedFile)
    const audioString = resp.body.toString('base64')

    const client = new speech.SpeechClient({
      credentials: {
        client_email: process.env.TRANSCRIPTION_CLIENT_EMAIL,
        private_key: process.env.TRANSCRIPTION_PRIVATE_KEY.replace(/\\n/gm, '\n'),
      },
      projectId: process.env.TRANSCRIPTION_PROJECT_ID,
    })
    const config = {
      encoding: 'LINEAR16',
      languageCode: 'en-US',
      enableWordTimeOffsets: true,
      enableAutomaticPunctuation: true,
    }
    const audio = {
      content: audioString,
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
      logger.error('googleRecognize missing data from google speech to text api', response)
      return ko('googleRecognize missing data from google speech to text api')
    }
    let transcribeData = response.results[0].alternatives[0]
    ok(transcribeData)
  })
}

if (
  ['TRANSCRIPTION_CLIENT_EMAIL', 'TRANSCRIPTION_PRIVATE_KEY', 'TRANSCRIPTION_PROJECT_ID'].reduce((allExist, name) => {
    if (!process.env[name]) {
      logger.error('env ', name, 'not set. Transcription not enabled')
      return false
    } else return allExist
  }, true)
) {
  serverEvents.on(serverEvents.eNames.ParticipantCreated, transcribeParticipantIota)
}
