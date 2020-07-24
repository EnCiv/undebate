'use strict;'
import React from 'react'
import supportsVideoType from './lib/supports-video-type'
import cloneDeep from 'lodash/cloneDeep'

/***
 *
 * Allows you to grab the camera, direct video to a stream, and record the video into a blob.
 * It handles the case where you stop one recording andd start another one right away - while come provessing may still be taking place on the previous recording.
 * It does work on Safari 13.0.5+ as well as chrome and firefox
 *
 * Usage:
 *
 * <ReactCameraRecorder ref={(ref)=>ref && this.camera=ref} />
 *
 * await this.camera.getCameraStream(constraints)  // constraints as defined by https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 *
 * element.srcObject=this.camera.cameraStream; //assign the camera stream to a video element for playback
 *
 * this.camera.startRecording((blob)=>{ after recording, save the blobs somewhere }); // start recording
 *
 * this.camera.stopRecording(); // stop recording and cause the call back passed to startRecording to be called
 *
 * this.this.camera.canNotRecordHere // if true you can't record video and things won't do anything
 *
 * this.camera.releaseCamera(); // when you are done using the camera, let it go
 *
 *
 */

const WebRTCMediaRecordPeriod = 100

export default class ReactCameraRecorder extends React.Component {
  state = {}
  audioinputs = []
  videoinputs = []
  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      if (typeof MediaRecorder === 'undefined' || (!supportsVideoType('webm') && !supportsVideoType('mp4'))) {
        this.canNotRecordHere = true
        logger.error('ReactCameraRecorder can not record here')
      }
    }
    this.startRecorderState = { state: 'READY' } //"BLOCK", "QUEUED"
    this.stopRecording = noError => !noError && logger.error('stopRecording called before startRecording')
    if (typeof navigator !== 'undefined') {
      var newState = {}
      navigator.mediaDevices.enumerateDevices().then(devices => {
        this.videoinputs = devices.reduce((acc, device) => (device.kind === 'videoinput' && acc.push(device), acc), [])
        if (this.videoinputs.length > 1) newState.cameraIndex = 0
        this.audioinputs = devices.reduce((acc, device) => (device.kind === 'audioinput' && acc.push(device), acc), [])
        if (this.audioinputs.length > 1) newState.micIndex = 0
        if (Object.keys(newState).length) this.setState(newState)
        logger.info('reactCameraRecorder devices', JSON.stringify(devices, null, 2))
      })
    }
    this.nextCamera = this.nextCamera.bind(this)
    this.nextMic = this.nextMic.bind(this)
  }

  releaseCamera() {
    if (this.cameraStream && this.cameraStream.getTracks) {
      var tracks = this.cameraStream.getTracks()
      tracks.forEach(track => track.stop())
    }
    this.cameraStream = null
  }

  getCamera(event) {
    if (!this.canNotRecordHere) {
      logger.trace('MediaSource opened')
      this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"')
      logger.trace('Source buffer: ', sourceBuffer)
    }
  }

  // called by parent to turn on the camera and get the video in a stream - but doesn't start recording yet
  // it's up to the parent to render the video from the stream if and wherever it wants
  getCameraStream(
    constraints = {
      audio: {
        echoCancellation: { exact: true },
      },
      video: {
        width: 640,
        height: 360,
      },
    },
    cameraStreamUpdater
  ) {
    this.constraints = cloneDeep(constraints)
    this.cameraStreamUpdater = cameraStreamUpdater
    if (this.canNotRecordHere) return Promise.reject(new Error('can not record here'))
    else {
      this.setState({ getCameraStream: true })
      return new Promise((ok, ko) => {
        this.getCameraStreamFromCalculatedConstraints(ok, ko)
      })
    }
  }

  async getCameraStreamFromCalculatedConstraints(ok, ko) {
    let calcConstraints = cloneDeep(this.constraints)
    if (typeof this.state.cameraIndex !== 'undefined') {
      if (this.videoinputs[this.state.cameraIndex].deviceId)
        calcConstraints.video.deviceId = this.videoinputs[this.state.cameraIndex].deviceId
      else if (this.videoinputs[this.state.cameraIndex].groupId)
        calcConstraints.video.groupId = this.videoinputs[this.state.cameraIndex].groupId
      else logger.error('video device has no device or group id', this.videoinputs[this.state.micIndex])
    }
    if (typeof this.state.micIndex !== 'undefined') {
      if (this.audioinputs[this.state.micIndex].deviceId)
        calcConstraints.audio.deviceId = this.audioinputs[this.state.micIndex].deviceId
      else if (this.audioinputs[this.state.micIndex].groupId)
        calcConstraints.audio.groupId = this.audioinputs[this.state.micIndex].groupId
      else logger.error('audio device has no device or group id', this.audioinputs[this.state.micIndex])
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(calcConstraints)
      logger.trace('getUserMedia() got stream:', stream)
      this.cameraStream = stream
      ok && ok(stream)
    } catch (e) {
      logger.error('navigator.getUserMedia error:', e.name, e.message)
      ko && ko(e)
    }
  }

  // called by parent to start the recording
  startRecording(cb) {
    if (this.canNotRecordHere) {
      logger.error('ReactCameraRecorder startRecording called but can not record here')
      return cb([]) // return no length of blobs
    }
    logger.trace(`startRecording`)
    // it's possible that the startRecording to be called before stopRecording events have not been processed so we need to queue
    if (this.startRecorderState.state !== 'READY') {
      if (this.startRecorderState.state === 'QUEUED')
        logger.error('Undebate.startRecording queueing but', this.startRecorderState, 'already queued')
      this.startRecorderState = { state: 'QUEUED', cb }
      logger.trace('startRecording BLOCKED. Waiting for stop')
      return
    }

    var recordedBlobs = []
    var mediaRecorder

    const handleDataAvailable = event => event.data && event.data.size > 0 && recordedBlobs.push(event.data)
    const stopRecording = () => {
      logger.trace('Undebate.stopRecording', this.mediaRecorder && this.mediaRecorder.state)
      this.stopRecording = noError => !noError && logger.error('stopRecording called after it has already been stopped')
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        this.startRecorderState = { state: 'BLOCK' } // need to block startRecording calls until the onStop even is received.
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
    this.stopRecording = stopRecording // the parent will call stopRecording - it needs to stop the on with this recorderBlobs and mediaRecorder

    // It's necessary to create a new mediaRecorder every time for Safari - safari won't stop and start again.  Chrome stops and starts just fine.
    let options = { mimeType: 'video/webm;codecs=vp9' }
    try {
      if (!MediaRecorder.isTypeSupported) {
        // Safari doesn't have this yet
        options = { mimeType: 'video/mp4' } //safari only supports mp4
        logger.warn('Undebate.startRecording MediaRecorder.isTypeSupported not suppored (by safari), using:', options)
      } else {
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          logger.trace('startRecording', options.mimeType, 'is not Supported, trying vp8')
          options = { mimeType: 'video/webm;codecs=vp8' }
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
      mediaRecorder = new MediaRecorder(this.cameraStream, options)
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
      if (this.startRecorderState.state === 'QUEUED') {
        const { cb } = this.startRecorderState
        this.startRecorderState = { state: 'READY' }
        this.startRecording(cb)
      } else if (this.startRecorderState.state === 'BLOCK') this.startRecorderState = { state: 'READY' }
    }
    mediaRecorder.ondataavailable = handleDataAvailable
    try {
      mediaRecorder.start(WebRTCMediaRecordPeriod) // collect data for a period of time  but it's not guaranteed to be that short and in some cases is only called at the end
      logger.trace('MediaRecorder started', this.mediaRecorder)
    } catch (err) {
      logger.error('mediaRecorder.start caught error:', err)
      this.canNotRecordHere = true
      throw new Error(
        'mediaRecorder.start caught error: ' + err.message + '\nThis browser does not support recording video'
      )
    }
  }

  componentDidMount() {
    if (!this.canNotRecordHere) {
      if (window.MediaSource) {
        this.mediaSource = new MediaSource()
        this.mediaSource.addEventListener('sourceopen', this.getCamera.bind(this), false) // when you request the camera, the browser asks the user for permission, if you get it, then getCamera will be called. But you may never get it.
      } else this.canNotRecordHere = true
    }
  }

  componentWillUnmount() {
    this.stopRecording(true)
    this.releaseCamera()
  }

  nextCamera(e) {
    this.releaseCamera()
    let cameraIndex = this.state.cameraIndex || 0
    if (++cameraIndex >= this.videoinputs.length) cameraIndex = 0
    this.setState({ cameraIndex }, () => {
      this.getCameraStreamFromCalculatedConstraints(this.cameraStreamUpdater)
    })
  }

  nextMic(e) {
    this.releaseCamera()
    let micIndex = this.state.micIndex || 0
    if (++micIndex >= this.audioinputs.length) micIndex = 0
    this.setState({ micIndex }, () => {
      this.getCameraStreamFromCalculatedConstraints(this.cameraStreamUpdater)
    })
  }

  render() {
    return (
      <>
        {typeof this.state.cameraIndex !== 'undefined' && this.state.getCameraStream && (
          <div
            style={{
              zIndex: 10,
              margin: '1em',
              border: '1px solid #808080',
              borderRadius: '3px',
              padding: '.1em',
              cursor: 'pointer',
              pointerEvents: 'auto',
              position: 'absolute',
              bottom: '3em',
            }}
            title={this.videoinputs[this.state.cameraIndex] && this.videoinputs[this.state.cameraIndex].label}
            onClick={this.nextCamera}
          >
            Change Camera
          </div>
        )}
        {typeof this.state.micIndex !== 'undefined' && this.state.getCameraStream && (
          <div
            style={{
              zIndex: 10,
              margin: '1em',
              border: '1px solid #808080',
              borderRadius: '3px',
              padding: '.1em',
              cursor: 'pointer',
              pointerEvents: 'auto',
              position: 'absolute',
              bottom: '1em',
            }}
            title={this.audioinputs[this.state.micIndex] && this.audioinputs[this.state.micIndex].label}
            onClick={this.nextMic}
          >
            Change Mic
          </div>
        )}
      </>
    )
  }
}
