'use strict'

import React from 'react'
//import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import injectSheet from 'react-jss'
import cx from 'classnames'

import DebugOverlay from './debug-overlay'

const TransitionTime = 500
const TopMargin = '0vh'
const Font = '0.6vw'

const styles = {
  participant: {
    display: 'inline',
    '--width': '50vw',
    width: 'var(--width)',
    height: 'calc(var(--width) * 0.5625)',
    transition: `all ${TransitionTime}ms linear`,
    background: 'white',

    $$speaking: {},
    '&$nextUp': {
      '--width': '20vw',
    },
    '&$seat2, &$seat3, &$seat4': {
      '--width': '15vw',
    },
    '&$finishUp': {
      '--width': '1vw',
    },
    '&$begin': {
      background: '#62229f',
    },
  },
  box: {
    display: 'inline',
    'vertical-align': 'top',
    position: 'absolute',
    transition: 'all .5s linear',
  },
  outerBox: {
    display: 'block',
    width: '100vw',
    height: `calc((50vw + 15vw) * 0.5625 + 5vh + 1.5vh + ${TopMargin})`,
  },
  beginBox: {
    backgroundColor: '#f0f0f0e0',
    position: 'absolute',
    top: 0,
  },
  beginButton: {
    color: 'white',
    background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': `calc(2 * ${Font})`,
    padding: `calc(1 * ${Font})`,
  },
  hangUpButton: {
    width: '12vw',
    position: 'absolute',
    left: '25vw',
    color: 'white',
    background: 'linear-gradient(to bottom, #ff6745 0%,#ff5745 51%,#ff4745 100%)',
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': `calc(2 * ${Font})`,
    padding: `calc(${Font})`,
  },
  speaking: {
    left: 'calc(2.5vw + 20vw + 2.5vw)',
    top: `${TopMargin}`,
  },
  nextUp: {
    left: '2.5vw',
    top: `calc( (50vw - 20vw) * 0.5625 + ${TopMargin})`,
  },
  seat2: {
    left: 'calc(1.25vw)',
    top: `calc(50vw * 0.5625 + 5vh + ${TopMargin})`,
  },
  seat3: {
    left: 'calc(1.25vw + 15vw + 1.25vw)',
    top: `calc(50vw * 0.5625 + 5vh + ${TopMargin})`,
  },
  seat4: {
    left: 'calc(1.25vw + 15vw + 1.25vw + 15vw + 1.25vw)',
    top: `calc(50vw * 0.5625 + 5vh + ${TopMargin})`,
  },
  finishUp: {
    left: 'calc(100vw / 2)',
    top: `calc(((50vw + 15vw) * 0.5625 + 5vh + 1.5vw + ${TopMargin}) / 2)`,
  },
  finishButton: {
    width: '12vw',
    position: 'absolute',
    right: '25vw',
    color: 'white',
    background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': `calc(2 * ${Font})`,
    padding: `calc(${Font})`,
    '&:disabled': {
      'text-decoration': 'none',
      background: 'lightgray',
    },
  },
  talkative: {
    background: 'yellow',
  },
  videoFoot: {
    'text-align': 'center',
    color: '#404',
    'font-weight': '600',
  },
  agenda: {
    position: 'absolute',
    top: `${TopMargin}`,
    left: 'calc(2.5vw + 20vw + 2.5vw + 50vw + 2.5vw)',
    height: 'calc(25vw * 0.5625)',
    'font-weight': '600',
    'font-size': '125%',
    width: '15vw',
    display: 'table',
    transition: 'all .5s linear',
    '&$finishUp': {
      left: 'calc(100vw / 2)',
      top: `calc(((25vw + 15vw) * 0.5625 + 5vh + 1.5vw + ${TopMargin}) / 2)`,
      height: '1vh',
      'font-size': '1%',
    },
  },
  innerAgenda: {
    'vertical-align': 'middle',
    display: 'table-cell',
  },
  agendaItem: {
    'font-weight': '200',
  },
  thanks: {
    'font-size': '200%',
    'font-weight': '600',
  },
  begin: {},
  join: {
    'margin-right': '1em',
    'button&': {
      'margin-left': '1em',
      'padding-top': '0.5em',
      'padding-bottom': '0.5em',
      '&:disabled': {
        'text-decoration': 'none',
        background: 'lightgray',
      },
    },
    'a&': {
      'margin-right': '0.25em',
    },
    'i&': {
      'margin-right': 0,
    },
  },
  subOpening: {
    'font-size': '0.56vw',
    'font-weight': '100',
    lineHeight: '200%',
    'margin-bottom': '2em',
  },
  opening: {
    'font-size': '1vw',
    'font-weight': '600',
    lineHeight: '2vw',
  },
}

const participants = {
  moderator: {
    speaking: [
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641226/undebate-short-m1.mp4',
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641208/undebate-short-m2.mp4',
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641208/undebate-short-m4.mp4',
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641207/undebate-short-m6.mp4',
    ],
    listening: 'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565643095/undebate-short-ms.mp4',
    agenda: [
      ['Who you are', 'Where you are', 'Your political party or belief'],
      ['Should we do something about political polarization', 'Why or Why Not'],
      ['What did you think?'],
    ],
  },
  audience1: {
    speaking: [
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w1.mp4',
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w2.mp4',
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w3.mp4',
    ],
    listening: 'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641303/undebate-short-ws.mp4',
  },
  human: {},
  audience2: {
    speaking: [
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565640905/undebate-short-a1.mp4',
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565640905/undebate-short-a2.mp4',
      'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565640905/undebate-short-a3.mp4',
    ],
    listening: 'https://res.cloudinary.com/hf6mryjpf/video/upload/v1565640905/undebate-short-as.mp4',
  },
}

const seating = ['speaking', 'nextUp', 'seat2', 'seat3']
const seatToName = {
  speaking: 'Speaking',
  nextUp: 'Next Up',
  seat2: 'Seat #2',
  seat3: 'Seat #3',
  seat4: 'Seat #4',
}

class AskWebRTC extends React.Component {
  render() {
    return <RASPAskWebRTC {...this.props} />
  }
}

class RASPAskWebRTC extends React.Component {
  requestPermissionElements = []
  uploadQueue = []
  preFetchList = []
  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      if (window.env === 'development') this.rotateButton = true
    } else {
      if (process.env.NODE_ENV === 'development') this.rotateButton = true
    }
    //this.createDefaults();
    this.human = React.createRef()
    this.moderator = React.createRef()
    this.audience1 = React.createRef()
    this.audience2 = React.createRef()
    this.audience3 = React.createRef()
    this.debugOverlayRef = React.createRef()
    this.fixupLeft = this.fixupLeft.bind(this)
    this.requestPermission = this.requestPermission.bind(this)
    if (typeof window !== 'undefined') window.onresize = this.onResize.bind(this)
    this.participants = {}
    Object.keys(participants).forEach(participant => {
      if (participant === 'human') this.participants[participant] = {}
      this.participants[participant] = {
        speakingObjectURLs: [],
        speakingImmediate: [],
        listeningObjectURL: null,
        listeningImmediate: false,
      }
    })
  }

  debugOverlay(str) {
    if (this.debugOverlayRef.current) this.debugOverlayRef.current.info(str)
  }

  state = {
    errorMsg: '',
    seatOffset: 0,
    round: 0,
  }

  componentDidMount() {
    if (window.MediaSource && participants.human) {
      this.mediaSource = new MediaSource()
      this.mediaSource.addEventListener('sourceopen', this.getCamera.bind(this), false)
    }

    // first load the moderator's speaking part and the listening part for all the participants;
    Object.keys(participants).forEach(participant => {
      if (participant === 'human') return
      this.preFetchObjectURL(participant, participant === 'moderator', 0)
    })
    this.preFetchObjectURL('moderator', false, 0) // then load the moderator's listening parts
    let i
    for (i = 0; i < participants.moderator.speaking.length; i++) {
      // then load the rest of the speaking parts
      Object.keys(participants).forEach(participant => {
        if (participant === 'moderator' && i === 0) return // moderator's first speaking part was loaded first
        if (participant === 'human') return
        if (participants[participant].speaking[i]) this.preFetchObjectURL(participant, true, i)
      })
    }
  }

  componentWillUnmount() {
    this.stopRecording()
    this.releaseCamera()
  }

  onResize() {
    this.forceUpdate(() => {
      setTimeout(() => {
        // We have to wait out the transition all time
        let left = this.topRef.getBoundingClientRect().x
        if (!left) return
        left = parseFloat(this.state.left) - left
        this.setState({ left: left + 'px' })
      }, TransitionTime)
    })
  }

  // force it all the way to the left
  fixupLeft(e) {
    if (e) {
      this.topRef = e
      let left = e.getBoundingClientRect().x
      this.setState({ left: -left + 'px' })
    }
  }

  releaseCamera() {
    if (this.stream && this.stream.getTracks) {
      var tracks = this.stream.getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  getCamera(event) {
    console.log('MediaSource opened')
    this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"')
    console.log('Source buffer: ', sourceBuffer)
  }

  async getCameraMedia() {
    if (participants.human) {
      // if we have a human in this debate
      const constraints = {
        audio: {
          echoCancellation: { exact: true },
        },
        video: {
          width: 1280,
          height: 720,
        },
      }
      console.log('Using media constraints:', constraints)
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        console.log('getUserMedia() got stream:', stream)
        this.stream = stream
        this.human.current.srcObject = stream
        Object.keys(participants).forEach(part => this.nextMediaState(part))
      } catch (e) {
        console.error('navigator.getUserMedia error:', e)
      }
    } else {
      // if we don't have a human - kick off the players
      Object.keys(participants).forEach(part => this.nextMediaState(part))
    }
  }

  startRecording() {
    this.debugOverlay(`startRecording`)
    this.recordedBlobs = []
    if (!this.mediaRecorder) {
      if (typeof MediaRecorder === 'undefined') {
        this.debugOverlay(`MediaRecorder not supported`)
        this.setState({ noMediaRecorder: true })
        return
      } else {
        this.debugOverlay(`MediaRecorder exists`)
      }
      let options = { mimeType: 'video/webm;codecs=vp9' }
      try {
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not Supported`)
          this.debugOverlay(`${options.mimeType} is not Supported`)
          options = { mimeType: 'video/webm;codecs=vp8' }
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`)
            this.debugOverlay(`${options.mimeType} is not Supported`)
            options = { mimeType: 'video/webm' }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              console.error(`${options.mimeType} is not Supported`)
              this.debugOverlay(`${options.mimeType} is not Supported`)
              options = { mimeType: '' }
            }
          }
        }
      } catch (err) {
        this.debugOverlay(`MediaRecorder.isTypeSupported ${options.mimeType} caught error`)
      }
      this.debugOverlay(`startRecording before try options.mimeType: ${options.mimeType}`)
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, options)
        this.debugOverlay(`startRecording succeeded`)
      } catch (e) {
        console.error('Exception while creating MediaRecorder:', e)
        this.debugOverlay(`Exception while creating MediaRecorder: ${e.toString()}`)
        return
      }

      console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options)

      this.mediaRecorder.onstop = event => {
        console.log('Recorder stopped: ', event)
        this.downloadRecording()
      }
    }
    this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this)
    this.mediaRecorder.start(10) // collect 10ms of data
    console.log('MediaRecorder started', this.mediaRecorder)
    this.debugOverlay(`startRecording started`)
  }

  handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data)
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
      console.log('Recorded Blobs: ', this.recordedBlobs)
    }
  }

  downloadRecording() {
    const blob = new Blob(this.recordedBlobs, { type: 'video/webm' })
    const { seatOffset, round } = this.state
    let oldSeatOffset = seatOffset + (1 % Object.keys(participants).length)
    let seat = this.seat(Object.keys(participants).indexOf('human'), oldSeatOffset)

    if (this.props.user) {
      return this.upload(blob, seat, round, this.props.user.id)
    } else {
      this.uploadQueue.push([blob, seat, round])
    }
  }

  // for the given seatOffset and round, fetch the object, or start the media
  nextMediaState(part) {
    this.debugOverlay(`nextMediaState part:${part}`)
    if (part === 'human') return
    // humans won't get here
    var { round } = this.state

    let speaking = this.seat(Object.keys(participants).indexOf(part)) === 'speaking'

    var objectURL
    if (speaking) {
      if (!(objectURL = this.participants[part].speakingObjectURLs[round]))
        this.participants[part].speakingImmediate[round] = true
    } else {
      if (!(objectURL = this.participants[part].listeningObjectURL)) this.participants[part].listeningImmediate = true
    }
    if (objectURL) this.playObjectURL(part, objectURL, speaking)
  }

  preFetchObjectURL(part, speaking, round) {
    if (!participants[part]) return // part may not exist in this debate
    if (this.preFetchList.length) {
      return this.preFetchList.push([part, speaking, round])
    }
    const url = speaking
      ? participants[part].speaking[round] || participants[part].listening
      : participants[part].listening
    console.info('preFetchObjectURL', part, url, speaking, round)
    this.debugOverlay(`preFetchObjectURL part:${part} url:${url} speaking:${speaking} round:${round}`)
    fetch(url)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(async blob => {
        var objectURL = URL.createObjectURL(blob)
        if (speaking) {
          this.participants[part].speakingObjectURLs[round] = objectURL
          if (this.participants[part].speakingImmediate[round]) {
            this.playObjectURL(part, objectURL, speaking)
            this.participants[part].speakingImmediate[round] = false
          }
        } else {
          this.participants[part].listeningObjectURL = objectURL
          if (this.participants[part].listeningImmediate) {
            this.playObjectURL(part, objectURL, speaking)
            this.participants[part].listeningImmediate = false
          }
        }
        var args
        if ((args = this.preFetchList.shift())) {
          return this.preFetchObjectURL(...args)
        }
      })
      .catch(err => {
        this.debugOverlay(`pre fetch caught error: ${err.toString()}`)
        logger.error('AskWebRTC.preFecthObjectURL fetch caught error', url, err)
        var args
        if ((args = this.preFetchList.shift())) {
          return this.preFetchObjectURL(...args)
        }
      })
  }

  async playObjectURL(part, objectURL, speaking) {
    this.debugOverlay(`playObjectURL part:${part} objectURL:${objectURL}`)
    let element = this[part].current
    element.src = null
    element.srcObject = null
    element.src = objectURL
    try {
      await element.play()
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        this.requestPermissionElements.push(element)
        this.setState({ requestPermission: true })
      } else if (err.name === 'AbortError') {
        this.requestPermissionElements.push(element)
        this.setState({ requestPermission: true })
      } else {
        this.debugOverlay(`play caught error: ${err.toString()}`)
        logger.error('AskWebRTC.startPlayback caught error', err.name)
      }
    }
  }

  async requestPermission(e) {
    try {
      var element
      while ((element = this.requestPermissionElements.shift())) element.play()
      this.setState({ requestPermission: false })
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        this.setState({ requestPermission: true })
      } else {
        this.debugOverlay(`requestPermission caught error: ${err.toString()}}`)
        logger.error('AskWebRTC.startPlayback caught error', err.name)
      }
    }
  }

  seat(i, seatOffset) {
    if (this.state.finishUp) return 'finishUp'
    if (typeof seatOffset === 'undefined') seatOffset = this.state.seatOffset
    return seating[(seatOffset + i) % seating.length]
  }

  rotateOrder() {
    var { seatOffset, round } = this.state
    if (this.recordTimeout) {
      clearTimeout(this.recordTimeout)
      this.recordTimeout = 0
    }
    if (this.talkativeTimeout) {
      clearTimeout(this.talkativeTimeout)
      this.talkativeTimeout = 0
    }
    seatOffset -= 1
    var followup = []
    if (seatOffset === 0) round += 1 // back to the moderator, switch to the next round
    if (seatOffset < 0) {
      if (participants.moderator.speaking[round + 1]) seatOffset = seating.length - 1
      // moderator just finished, he moves to the back of the order
      else return this.hangup()
    }
    Object.keys(participants).forEach((participant, i) => {
      let oldChair = this.seat(i)
      let newChair = this.seat(i, seatOffset)
      var element = this[participant].current
      console.info('rotateOrder', participant, seatOffset, element.muted, element.loop)
      if (participant === 'human') {
        if (newChair === 'seat2') {
          if (round === 0) return this.startRecording()
        } else if (oldChair === 'seat2') {
          if (round === 0) return this.stopRecording()
        } else if (newChair === 'speaking') {
          this.talkativeTimeout = setTimeout(() => this.setState({ talkative: true }), 3 * 60 * 1000)
          this.recordTimeout = setTimeout(() => this.rotateOrder(), 5 * 60 * 1000)
          return this.startRecording()
        } else if (oldChair === 'speaking') return this.stopRecording()
      } else if (oldChair === 'speaking' || newChair === 'speaking') {
        // will be speaking
        followup.push(() => this.nextMediaState(participant))
      } else {
        console.info('participant continue looping', participant, element.loop)
      }
    })
    this.debugOverlay(`rotateOrder: ${seatOffset}\n`)
    this.setState({ seatOffset, round, talkative: false }, () => {
      let func
      while ((func = followup.shift())) func()
    })
  }

  hangup() {
    setTimeout(() => {
      this.releaseCamera()
      this.setState({ done: true })
    }, 1.5 * TransitionTime)
    return this.setState({ finishUp: true })
  }

  upload(blob, seat, round, userId) {
    var stream = ss.createStream()
    stream.on('error', err => logger.error('AskWebRTC.upload socket stream error:', err))

    var name = userId + '-' + round + '-' + seat + '.mp4'

    ss(window.socket).emit('stream-upload-video', stream, { name, size: blob.size })

    var bstream = ss.createBlobReadStream(blob, { highWaterMark: 1024 * 200 }).pipe(stream) // high hiwWaterMark to increase upload speed
    bstream.on('error', err => logger.error('AskWebRTC.upload blob stream error:', err))
    stream.on('end', () => {
      var uploadArgs
      if ((uploadArgs = this.uploadQueue.shift())) {
        this.setState({ progress: `uploading. ${this.uploadQueue.length} segments to go` })
        return this.upload(...uploadArgs)
      } else {
        this.setState({ progress: 'uploading. complete.', uploadComplete: true })
        console.info('upload after login complete')
      }
    })
    setTimeout(() => console.info('stream:', stream, 'bstream:', bstream), 1000)
  }

  onUserLogin(info) {
    console.info('onUserLogin', info)
    const { userId } = info
    this.uploadQueue.forEach(args => {
      args.push(userId)
    })
    var uploadArgs
    if ((uploadArgs = this.uploadQueue.shift())) {
      this.upload(...uploadArgs)
    }
    this.setState({ progress: `uploading. ${this.uploadQueue.length} segments to go` })
  }

  render() {
    const { user, parent, className, classes } = this.props
    const { finishUp, done, begin, requestPermission } = this.state

    const beginOverlay = () =>
      !begin && (
        <div className={cx(classes['outerBox'], classes['beginBox'])}>
          <div className={cx(className, classes['box'], classes['speaking'])} key="begin-banner">
            <div className={cx(className, classes['participant'], classes['speaking'])}>
              <div style={{ width: '50vw', height: 'calc(50vw * 0.5625)' }}>
                <div style={{ width: '100%', height: '100%', display: 'table' }}>
                  <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div>
                      <span className={classes['opening']}>
                        <p>You are about to experience a new kind of web conference</p>
                        <p style={{ color: 'darkviolet', fontSize: '90%' }}>
                          For productive, large scale, dialog and deliberation
                        </p>
                        <p>This test experience will connect you with several people by video, in a new way.</p>
                        <p style={{ color: 'darkviolet', fontSize: '90%' }}>The topic of the discussion is:</p>
                        <p style={{ fontSize: '110%' }}>Can We Bridge the Political Divide?</p>
                      </span>
                    </div>
                    <div>
                      <span className={classes['subOpening']}>
                        You will be placed in Seat #3. Your video will be stored locally, but not actually shared with
                        anyone unless you agree, at the end. This discussion takes about 7 minutes
                      </span>
                    </div>
                    <div>
                      <button
                        className={classes['beginButton']}
                        onClick={() => this.setState({ begin: true }, () => this.getCameraMedia())}
                      >
                        Begin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes['videoFoot']}>
              <span>{'Seat 3'}</span>
            </div>
          </div>
        </div>
      )

    const permissionOverlay = () =>
      requestPermission && (
        <div className={cx(classes['outerBox'], classes['beginBox'])}>
          <div style={{ width: '100%', height: '100%', display: 'table' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
              <div>
                <span className={classes['thanks']}>The browser wants your permission to continue</span>
              </div>
              <div>
                <button className={classes['beginButton']} onClick={this.requestPermission}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )

    if (done) {
      return (
        <section
          id="syn-ask-webrtc"
          key="began"
          style={{ position: 'relative', left: this.state.left, width: '100vw' }}
          ref={this.fixupLeft}
        >
          <div className={classes['outerBox']}>
            <div style={{ width: '100%', height: '100%', display: 'table' }}>
              <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
                <span className={classes['thanks']}>Thank You</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span>Join and your recorded videos will be uploaded and shared</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div>Join Form goes here</div>
            {this.state.progress && <span>{'uploading: ' + this.state.progress}</span>}
            {this.state.uploadComplete && <span>Upload Complete</span>}
          </div>
        </section>
      )
    }

    let humanSpeaking = false

    var videoBox = (participant, i) => {
      let chair = this.seat(i)
      if (participant === 'human' && this.seat(i) === 'speaking') humanSpeaking = true
      return (
        <div className={cx(className, classes['box'], classes[this.seat(i)])} key={participant}>
          <video
            className={cx(className, classes['participant'], classes[this.seat(i)], !begin && classes['begin'])}
            ref={this[participant]}
            playsInline
            autoPlay
            controls={false}
            muted={participant === 'human' || chair !== 'speaking'}
            loop={participant !== 'human' && chair !== 'speaking'}
            onEnded={this.rotateOrder.bind(this)}
            key={participant + '-video'}
          ></video>
          <div className={classes['videoFoot']}>
            <span>{!finishUp && seatToName[this.seat(i)]}</span>
          </div>
        </div>
      )
    }

    var agenda = () => {
      return (
        <div className={cx(classes['agenda'], finishUp && classes['finishUp'])} key={'agenda' + this.state.round}>
          <div className={classes['innerAgenda']}>
            <span>Questions</span>
            <ol className={classes['agendaItem']}>
              {participants.moderator.agenda[this.state.round] &&
                participants.moderator.agenda[this.state.round].map((item, i) => <li key={item + i}>{item}</li>)}
            </ol>
          </div>
        </div>
      )
    }

    return (
      <section
        id="syn-ask-webrtc"
        key="began"
        style={{ position: 'relative', left: this.state.left, width: '100vw' }}
        ref={this.fixupLeft}
      >
        <DebugOverlay ref={this.debugOverlayRef} />
        <div className={classes['outerBox']}>
          {Object.keys(participants).map(videoBox)}
          {agenda()}
        </div>
        {beginOverlay()}
        {permissionOverlay()}
        <div style={{ height: '5.5rem' }}>
          <button
            disabled={!humanSpeaking}
            className={cx(classes['finishButton'], this.state.talkative && classes['talkative'])}
            onClick={this.rotateOrder.bind(this)}
            key="finish"
          >
            Finished Speaking
          </button>
          <button className={classes['hangUpButton']} onClick={this.hangup.bind(this)} key="hangup">
            Hang Up
          </button>
          {this.rotateButton && (
            <button onClick={this.rotateOrder.bind(this)} key="rotate">
              Rotate
            </button>
          )}
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          <span>{this.state.errorMsg}</span>
        </div>
      </section>
    )
  }
}

export default injectSheet(styles)(AskWebRTC)
