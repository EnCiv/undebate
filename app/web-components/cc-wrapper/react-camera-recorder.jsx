'use strict;'
import React, { useImperativeHandle, useEffect, useState, useMemo } from 'react'
import supportsVideoType from '../../components/lib/supports-video-type'

/***
 *
 * Allows you to grab the camera, direct video to a stream, and record the video into a blob.
 * It handles the case where you stop one recording andd start another one right away - while come provessing may still be taking place on the previous recording.
 * It does work on Safari 13.0.5+ as well as chrome and firefox
 *
 * Usage:
 *
 *           <ReactCameraRecorder
 *            ref={this.getCamera}
 *            onCanNotRecordHere={status => (this.canNotRecordHere = status)}
 *            onCameraStream={stream => (this.cameraStream = stream)}
 *            onCameraChange={() => this.nextMediaState('human')}
 *            constraints={{ // constraints as defined by https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 *              audio: {
 *                echoCancellation: { exact: true },
 *              },
 *              video: {
 *                width: 640,
 *                height: 360,
 *              },
 *            }}
 *         />
 *
 * <ReactCameraRecorder ref={(ref)=>ref && this.camera=ref} />
 *
 * await this.camera.getCameraStream()
 *
 * this.camera.startRecording((blob)=>{ after recording, save the blobs somewhere }); // start recording
 *
 * this.camera.stopRecording(); // stop recording and cause the call back passed to startRecording to be called
 *
 * this.camera.releaseCamera(); // when you are done using the camera, let it go
 *
 *
 */

const WebRTCMediaRecordPeriod = 100

const ReactCameraRecorder = React.forwardRef((props, ref) => {
  const [startRecorderState, neverSetStartRecorderState] = useState({ state: 'READY', cb: undefined }) // //"BLOCK", "QUEUED" - never call the setter, we  use the same object through the life of this component and set it in realtime

  const [canNotRecordHere, setCanNotRecordHere] = useState(() => {
    if (typeof window !== 'undefined') {
      if (typeof MediaRecorder === 'undefined' || (!supportsVideoType('webm') && !supportsVideoType('mp4'))) {
        logger.error('ReactCameraRecorder can not record here')
        if (props.onCanNotRecordHere) props.onCanNotRecordHere(true)
        return true
      } else return false
    }
  })

  // the properties in reactThis are changed in realtime by events that are associated to an instance of this
  // the useState setter is not used here because that doesn't change the value of the state  until sometime after the event has been processed, just before render
  // and changes to these properties are not intended to cause a rerender
  // it's like setting this.property of a React Class component
  // reactThis will be the same 'object' throught the life of this instance of the component (as long as neverSetReactThis is never used)

  const [reactThis, neverSetReactThis] = useState({
    cameraStream: undefined, // the current cameraStream. It needs to be release when done
    stopRecording: undefined, // the function to call to stop recording.  It changes with each call to startRecording
  })

  const releaseCamera = () => {
    if (reactThis.cameraStream && reactThis.cameraStream.getTracks) {
      var tracks = reactThis.cameraStream.getTracks()
      tracks.forEach(track => track.stop())
    }
    reactThis.cameraStream = null
  }

  // called by parent to turn on the camera and get the video in a stream - but doesn't start recording yet
  // it's up to the parent to render the video from the stream if and wherever it wants

  const getCameraStream = () => {
    if (canNotRecordHere) return Promise.reject(new Error('can not record here'))
    else {
      if (reactThis.cameraStream) {
        logger.error('ReactCameraRecorder camera is already streaming')
        Promise.resolve(reactThis.cameraStream)
      } else {
        return new Promise((ok, ko) => {
          getCameraStreamFromCalculatedConstraints(ok, ko)
        })
      }
    }
  }

  // warning if navigator.mediaDevices.getUserMedia is called a second time - without releaseing the stream
  // there will be an "notreadableerror could not start video source" - after a delay
  // also consider that if the user changed the camera selection, that will cause getCameraStreamFromCalulatedConstraints to be called again

  const getCameraStreamFromCalculatedConstraints = async (ok, ko) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(props.constraints)
      logger.trace('getUserMedia() got stream:', stream)
      reactThis.cameraStream = stream
      let audioTracks = stream.getAudioTracks()
      audioTracks.forEach((track, i) =>
        logger.info(
          'ReactCameraRecorder.getCameraStreamFromCalculatedConstraints audioTrack[',
          i,
          ']:',
          track.valueOf(), // doesn't show up in logger unless you get valueOf
          track.getSettings()
        )
      )
      if (props.onCameraStream) props.onCameraStream(stream)
      ok && ok(stream)
    } catch (e) {
      setCanNotRecordHere(true)
      logger.error('navigator.getUserMedia error:', e.name, e.message)
      if (props.onCanNotRecordHere) props.onCanNotRecordHere(true)
      ko && ko(e)
    }
  }

  // called by parent to start the recording
  const startRecording = cb => {
    if (canNotRecordHere) {
      logger.error('ReactCameraRecorder startRecording called but can not record here')
      return cb([]) // return no length of blobs
    }
    logger.trace(`startRecording`)
    // it's possible that the startRecording to be called before stopRecording events have not been processed so we need to queue
    if (startRecorderState.state !== 'READY') {
      if (startRecorderState.state === 'QUEUED')
        logger.error('Undebate.startRecording queueing but', startRecorderState, 'already queued')
      startRecorderState.state = 'QUEUED'
      startRecorderState.cb = cb
      logger.trace('startRecording BLOCKED. Waiting for stop')
      return
    }

    var recordedBlobs = []
    var mediaRecorder

    const handleDataAvailable = event => event.data && event.data.size > 0 && recordedBlobs.push(event.data)
    const stopRecording = () => {
      logger.trace('Undebate.stopRecording', mediaRecorder && mediaRecorder.state)
      reactThis.stopRecording = noError =>
        !noError && logger.error('stopRecording called after it has already been stopped')
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        startRecorderState.state = 'BLOCK' // need to block startRecording calls until the onStop even is received.
        startRecorderState.cb = undefined
        mediaRecorder.stop()
        if (recordedBlobs.length)
          logger.trace(
            'Recorded Blobs: ',
            recordedBlobs.length && recordedBlobs[0].type,
            recordedBlobs.length,
            recordedBlobs.reduce((acc, blob) => acc + blob.size || 0, 0)
          )
        else logger.trace('no recorded blobs yet') // apple safari will not have anything at this point
      }
    }
    reactThis.stopRecording = stopRecording // the parent will call stopRecording - it needs to stop the on with this recorderBlobs and mediaRecorder

    // It's necessary to create a new mediaRecorder every time for Safari - safari won't stop and start again.  Chrome stops and starts just fine.
    let options = { mimeType: 'video/webm;codecs=vp9,opus' }
    try {
      if (!MediaRecorder.isTypeSupported) {
        // Safari doesn't have this yet
        options = { mimeType: 'video/mp4' } //safari only supports mp4
        logger.warn('Undebate.startRecording MediaRecorder.isTypeSupported not suppored (by safari), using:', options)
      } else {
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          logger.trace('startRecording', options.mimeType, 'is not Supported, trying vp8')
          options = { mimeType: 'video/webm;codecs=vp8,opus' }
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            logger.trace('startRecording', options.mimeType, 'is not Supported, trying webm')
            options = { mimeType: 'video/webm' }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              logger.error('startRecording', options.mimeType, 'is not Supported, no video supported')
              options = { mimeType: '' }
            }
          }
        }
      }
    } catch (err) {
      logger.error(`MediaRecorder.isTypeSupported`, options.mimeType, `caught error`)
    }
    try {
      mediaRecorder = new MediaRecorder(reactThis.cameraStream, options)
      logger.trace('Undebate.startRecording succeeded MediaRecorder.mimeType', mediaRecorder.mimeType)
    } catch (e) {
      logger.error('Exception while creating MediaRecorder:', e.name, e.message)
      return
    }
    logger.trace('Created MediaRecorder', mediaRecorder, 'with options', options)
    if (mediaRecorder.state !== 'inactive') {
      logger.error('mediaRecorder.state not inactive before start', mediaRecorder.state)
    }
    mediaRecorder.onstop = event => {
      // replace the onstop handler each time, because the saveRecording parameters change
      logger.trace('Recorder stopped: ', event, mediaRecorder.state)
      cb(recordedBlobs)
      if (startRecorderState.state === 'QUEUED') {
        const { cb } = startRecorderState
        startRecorderState.state = 'READY'
        startRecorderState.cb = undefined
        startRecording(cb)
      } else if (startRecorderState.state === 'BLOCK') {
        startRecorderState.state = 'READY'
        startRecorderState.cb = undefined
      }
    }
    mediaRecorder.ondataavailable = handleDataAvailable
    try {
      mediaRecorder.start(WebRTCMediaRecordPeriod) // collect data for a period of time  but it's not guaranteed to be that short and in some cases is only called at the end
      logger.trace('MediaRecorder started', mediaRecorder)
    } catch (err) {
      logger.error('mediaRecorder.start caught error:', err)
      setCanNotRecordHere(true)
      if (props.onCanNotRecordHere) props.onCanNotRecordHere(true)
      throw new Error(
        'mediaRecorder.start caught error: ' + err.message + '\nThis browser does not support recording video'
      )
    }
  }

  // the properties below are methods that the parent component can access
  useImperativeHandle(ref, () => ({
    getCameraStream,
    startRecording,
    stopRecording: () => reactThis.stopRecording && reactThis.stopRecording(),
    releaseCamera,
  }))

  // if a camera or mic index changes, get the new stream - but don't do it initially only do this on index changes after the camera is streaming
  useEffect(() => {
    if (reactThis.cameraStream) {
      releaseCamera()
      getCameraStreamFromCalculatedConstraints(props.onCameraChange)
    }
  }, [props.constraints])
  return () => { releaseCamera() } // if unmounting release the camera
})

export default ReactCameraRecorder
