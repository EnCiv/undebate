'use strict;'
//import through2 from 'through2'
import { auto_quality, placeholder_image } from './cloudinary-urls'
import ss from '@sap_oss/node-socketio-stream'

/**
 *
 * createParticipant uploads the video blobs that were collected, and then creates a new Iota for the participant
 *
 * @param {*} props the props obj of a parent react component with parentId, subject, description, and bp_info
 * @param {*} human an object with speakingBlobs[], listeningBlob which are the video recordings of the human speaking
 * @param {*} userId the Mongo ObjectID of the user as a string
 * @param {*} name the string name of the user
 * @param {*} progressFunc a function to call with project updates. Its passed an object with progress: as string, and uploadComplete a bool
 *
 */

function allThere(array, length) {
  return array.length === length && array.every(i => typeof i !== 'undefined')
}

// webpack might include process.browser but if it doesn't the pipe opertion below needs process.nextTick
if (typeof window !== 'undefined') {
  if (typeof process === 'undefined') window.process = {}
  if (!process.nextTick)
    window.process.nextTick = (...args) => {
      const func = args.shift()
      setTimeout(() => func.apply(null, args))
    }
}
//const onAnyListener = (eventName, ...args) => console.info("onAny", eventName, ...args)
//let onAnySet = 0

export default function createParticipant(props, human, userId, name, progressFunc, listeningRound, listeningSeat) {
  try {
    var transferred = 0
    var totalSize = 0
    var participant = { speaking: [], name: name }
    var uploadQueue = []

    //if (!onAnySet++) window.socket.onAny(onAnyListener)

    let adjustedSpeakingBlobs = human.speakingBlobs.slice() // make a copy so we don't mutate the original
    if (listeningSeat === 'speaking') {
      if (typeof adjustedSpeakingBlobs[listeningRound] !== 'undefined')
        logger.error("createParticpant didn't expect blob for listening in speakingBlobs")
      adjustedSpeakingBlobs.splice(listeningRound, 1) // if listening is in the speaking seat - skip that round
    }
    function updateProgress(length) {
      transferred += length
      var percentComplete = Math.round((transferred / totalSize) * 100) + '%'
      progressFunc && progressFunc({ progress: percentComplete, uploadComplete: false, uploadStarted: true, uploadError: false })
    }

    function upload(blob, seat, round) {
      let streamStarted = false
      var file_name = userId + '-' + round + '-' + seat + new Date().toISOString().replace(/[^A-Z0-9]/gi, '') + '.mp4' // mp4 was put here to get around something with Apple - check in future
      console.info('connected?', socket.connected)
      // socketIo-streams does not seem to be passing call backs (undefined is received)
      // so we are using a socket io event to send the response back
      const responseUrl = url => {
        // responses don't necessarily come in order
        if (url) {
          logger.trace('url', url)
          url = auto_quality(url)
          if (seat === 'speaking') {
            // what if the come out of order -- to be determined
            participant.speaking[round] = url // specify the round because the order is not assures - don't use push
          } else participant.listening = url
        } else {
          logger.error('createParticipant.stream-upload-video failed', file_name)
        }
        if (
          allThere(participant.speaking, adjustedSpeakingBlobs.length) &&
          !!human.listeningBlob === !!participant.listening
        ) {
          // have all of the pieces been uploaded
          logger.trace('creat participant', participant)
          var pIota = {
            //participant iota
            parentId: props.parentId || (props._id && props._id.toString()), // a viewer with a human has no parentId, but a recorder has the viewer as it's parentId
            subject: 'Participant:' + props.subject,
            description: 'A participant in the following discussion:' + props.description,
            component: {
              component: 'MergeParticipants',
              participant: participant,
            },
          }
          if (props.bp_info) {
            // don't cause the property to exist in the Iota if there is none.
            pIota.component.participant.bp_info = Object.assign({}, props.bp_info) // make a copy cause we are going to delete stuff
            delete pIota.component.participant.bp_info.campaign_email
            delete pIota.component.participant.bp_info.personal_email
            if (props.bp_info.candidate_name) pIota.component.participant.name = props.bp_info.candidate_name
          }
          window.socket.emit('create-participant', pIota, result => {
            logger.trace('createParticipant participant created', result)
          })
        }
      }

      var stream = ss.createStream()
      stream.on('error', err => {
        if (window.socket.disconnected) window.socket.open() // some problems with the pipe would cause the stream to disconnect. It's fixed but lets leave this here.
        logger.error('createParticipant.upload socket stream error:', err.message || err)
        progressFunc && progressFunc({ progress: `There was an error uploading: ${err.message || err}`, uploadComplete: false, uploadStarted: false, uploadError: true })
        uploadQueue = [] // empty the upload queue so we exit and try again
      })
      stream.on('end', () => {
        var uploadArgs
        if ((uploadArgs = uploadQueue.shift())) {
          return upload(...uploadArgs)
        } else {
          progressFunc && progressFunc({ progress: 'complete.', uploadComplete: true, uploadStarted: true, uploadError: false })
          logger.info('createParticipant upload after login complete')
        }
      })
      //var ssSocket = ss(window.socket)
      //use this for debugging
      //ssSocket._oldEmit = ssSocket.emit
      //ssSocket.emit = ((...args) => (console.info("emit", ...args), ssSocket._oldEmit(...args)))
      ssSocket.on("error", err => logger.error("ssSocket got error:", err.message || error))

      var bstream = ss.createBlobReadStream(blob, { highWaterMark: 1024 * 200 }) // high hiwWaterMark to increase upload speed
      bstream.on('error', err => {
        logger.error('createParticipant.upload blob stream error:', err.message || err)
        progressFunc && progressFunc({ progress: `There was an error uploading: ${err.message || err}`, uploadComplete: false, uploadStarted: false, uploadError: true })
      })
      /*
      let newPipe = bstream.pipe(
        through2((chunk, enc, cb) => {
          setTimeout(() => updateProgress(chunk.length, 100)) // don't slow down the pipe
          cb(null, chunk) // 'this' becomes this of the react component rather than this of through2 - so pass the data back in the callback
        })
      )
      newPipe.pipe(stream)*/
      bstream.on('data', chunk => {
        console.info('chunk', chunk.length);
        setTimeout(() => updateProgress(chunk.length))
        if (!streamStarted) {
          console.info('starting stream')
          ssSocket.emit('stream-upload-video', stream, { name: file_name, size: blob.size }, responseUrl)
          streamStarted = true
        }
      })
      bstream.pipe(stream); console.info("pipe started")
      //setTimeout(() => { console.info("stream upload start after", socket.connected, parseInt(process.env.STREAM_DELAY || '5000')); ssSocket.emit('stream-upload-video', stream, { name: file_name, size: blob.size }, responseUrl); console.info("stream upload sent") }, parseInt(process.env.STREAM_DELAY || '5000'))
    }

    logger.info('createParticipant.onUserUpload')
    logger.trace('createParticipant.onUserUpload', props)

    for (let round = 0; round < adjustedSpeakingBlobs.length; round++) {
      totalSize += adjustedSpeakingBlobs[round].size
      uploadQueue.push([adjustedSpeakingBlobs[round], 'speaking', round])
    }
    if (human.listeningBlob) {
      uploadQueue.push([human.listeningBlob, 'listening', 0])
      totalSize += human.listeningBlob.size
    }

    let uploadArgs
    progressFunc && progressFunc({ progress: `${totalSize} to upload`, uploadComplete: false, uploadStarted: true, uploadError: false })
    if ((uploadArgs = uploadQueue.shift())) {
      upload(...uploadArgs)
    }
  }
  catch (error) {
    if (window.socket.disconnected) window.socket.open()
    logger.error("creatParticipant caught error", error.message || error)
    // then continue
  }
}
