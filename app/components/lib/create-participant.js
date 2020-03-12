'use strict;'
import through2 from 'through2'
import { auto_quality, placeholder_image } from './cloudinary-urls'
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

export default function createParticipant(props, human, userId, name, progressFunc) {
  var transferred = 0
  var totalSize = 0
  var participant = { speaking: [], name: name }
  var uploadQueue = []

  function updateProgress(chunk) {
    transferred += chunk.length
    var percentComplete = Math.round((transferred / totalSize) * 100) + '%'
    progressFunc && progressFunc({ progress: percentComplete, uploadComplete: false })
  }

  function upload(blob, seat, round) {
    var file_name = userId + '-' + round + '-' + seat + new Date().toISOString().replace(/[^A-Z0-9]/gi, '') + '.mp4' // mp4 was put here to get around something with Apple - check in future

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
        logger.error('upload video failed', file_name)
      }
      if (
        participant.speaking.length === human.speakingBlobs.length &&
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
        window.socket.emit('create participant', pIota, result => {
          logger.trace('participant created', result)
        })
      }
    }

    var stream = ss.createStream()
    stream.on('error', err => {
      logger.error('AskWebRTC.upload socket stream error:', err)
    })

    ss(window.socket).emit('upload video', stream, { name: file_name, size: blob.size }, responseUrl)

    var bstream = ss
      .createBlobReadStream(blob, { highWaterMark: 1024 * 200 })
      .pipe(
        through2((chunk, enc, cb) => {
          updateProgress(chunk)
          cb(null, chunk) // 'this' becomes this of the react component rather than this of through2 - so pass the data back in the callback
        })
      )
      .pipe(stream) // high hiwWaterMark to increase upload speed

    bstream.on('error', err => {
      logger.error('AskWebRTC.upload blob stream error:', err)
    })
    stream.on('end', () => {
      var uploadArgs
      if ((uploadArgs = uploadQueue.shift())) {
        return upload(...uploadArgs)
      } else {
        progressFunc && progressFunc({ progress: 'complete.', uploadComplete: true })
        logger.trace('upload after login complete')
      }
    })
  }

  logger.info('Undebate.onUserUpload')
  logger.trace('onUserUpload', props)

  for (let round = 0; round < human.speakingBlobs.length; round++) {
    totalSize += human.speakingBlobs[round].size
    uploadQueue.push([human.speakingBlobs[round], 'speaking', round])
  }
  if (human.listeningBlob) {
    uploadQueue.push([human.listeningBlob, 'listening', 0])
    totalSize += human.listeningBlob.size
  }

  let uploadArgs
  if ((uploadArgs = uploadQueue.shift())) {
    upload(...uploadArgs)
  }
  progressFunc && progressFunc({ progress: `${totalSize} to upload`, uploadComplete: false })
}
