'use strict'
import React from 'react'
import supportsVideoType from '../../lib/supports-video-type'
import { auto_quality, placeholder_image } from '../../lib/cloudinary-urls'

/*********************

methods:

About the state
    seat
    getTimeLimit
    speakingNow
    listening
    seatOfParticipant
    isRecordingSpeaking


nextMediaState
requestPermission

User Interaction Buttons
    allPause
    allStop
    allPlay
    prevSection
    prevSpeaker
    nextSection
    nextSpeaker
    autoNextSpeaker
    finishedSpeaking
    rerecordPlaceHolderButton
    rerecordButton

Events
    onIntroEnd
    videoError

Properties:
    camera
    rerecord
    numRounds
    numParticipants

state:
    round
    moderatorReadyToStart
    begin
    allPaused
    isRecording


Usage:
  class ViewerRecorderRender extends ViewerRecorderLogic{
    constructor(props){
      super(props
        ...)
    }
    ...
    render(){
      ...
    }
  }

 this really helps explain round and seatOffset, example of  4 participants.  time increases as you go down.
     round  seatOffset
        0      0  Moderator is speaking
        0      3  First participant is speaking
        0      2  Second participant is speaking
        0      1  Third participant is speaking
        1      0  Moderator is speaking
        1      3  First participant is speaking
        1      2  Second participant is speaking
        1      1  Third participant is speaking
        2      0  Moderator is speaking
   
*******************/

const TransitionTime = 500
const HDRatio = 1080 / 1920 //0.5625

export default class ViewerRecorderLogic extends React.Component {
  requestPermissionElements = []

  constructor(props) {
    super(props)

    this.getCamera = this.getCamera.bind(this)
    this.requestPermission = this.requestPermission.bind(this)

    if (typeof window !== 'undefined') {
      if (!supportsVideoType('webm')) {
        if (supportsVideoType('mp4')) this.forceMP4 = true
        else {
          this.canNotRecordHere = true
          props.dispatch({ type: 'CanNotRecordHere' })
        }
      }
      if (props.participants.human) {
        if (typeof MediaRecorder === 'undefined') {
          this.canNotRecordHere = true
          props.dispatch({ type: 'CanNotRecordHere' })
        }
      }
    }
    var loadYoutube = false
    if (!this.canNotRecordHere) {
      Object.keys(this.props.participants).forEach(participant => {
        let youtube = false
        if (
          participant !== 'human' &&
          this.props.participants[participant].listening &&
          this.props.participants[participant].listening.match(/youtu\.be|youtube\.com/)
        ) {
          // the whole participant is marked youtube if listening is youtube
          youtube = true
          loadYoutube = true
        } else if (this.forceMP4 && participant !== 'human' && this.props.participants[participant].listening) {
          this.props.participants[participant].listening = this.props.participants[participant].listening.replace(
            /\.webm$/gi,
            '.mp4'
          )
          this.props.participants[participant].speaking = this.props.participants[participant].speaking.map(url =>
            url.replace(/\.webm$/gi, '.mp4')
          )
        }
        if (!props.ccState.participants[participant]) {
          props.ccState.participants[participant] = {
            speakingObjectURLs: [],
            speakingImmediate: [],
            listeningObjectURL: null,
            listeningImmediate: false,
            placeholderUrl:
              (participant !== 'human' &&
                !youtube &&
                (this.props.participants[participant].listening || this.props.participants[participant].speaking[0]) &&
                placeholder_image(
                  this.props.participants[participant].listening || this.props.participants[participant].speaking[0]
                )) ||
              '',
            youtube,
            element: React.createRef(),
          }
          if (participant === 'human') {
            props.ccState.participants.human.speakingBlobs = []
          }
        }
      })
    } else {
      // non need to do anything --this.props.ccState.participants = {}
    }
    this.numParticipants = Object.keys(this.props.participants).length
    this.numRounds =
      (this.props.participants.moderator &&
        this.props.participants.moderator.speaking &&
        this.props.participants.moderator.speaking.length) ||
      (this.props.agenda && this.props.agenda.length) ||
      0
    this.seating = ['speaking', 'nextUp']
    this.seatToName = { speaking: 'Speaking', nextUp: 'Next Up' }
    for (let i = 2; i < this.numParticipants; i++) {
      this.seating.push('seat' + i)
      this.seatToName['seat' + i] = 'Seat ' + i
    }
    if (typeof window !== 'undefined' && loadYoutube) {
      window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this)
      var tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      var firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }
  }

  state = {
    seatOffset: 0,
    round: 0,
    moderatorReadyToStart: !this.props.participants.moderator, // if no moderators, no need to wait
    begin: false,
    allPaused: true, // so the play button shows
    isRecording: false,
    countDown: 0,
    warmup: false,
  }

  /***
   * Methods about the current state
   *
   */

  getTimeLimit() {
    const { timeLimits } = this.props.participants.moderator ? this.props.participants.moderator : this.props
    const { round } = this.state
    if (timeLimits && typeof timeLimits[round] === 'number') return timeLimits[round]
    return 60
  }

  seat(i, seatOffset) {
    if (this.state.finishUp) return 'finishUp'
    if (typeof seatOffset === 'undefined') seatOffset = this.state.seatOffset
    return this.seating[(seatOffset + i) % this.numParticipants]
  }

  isRecording() {
    return this.isRecordingPlaceHolder() || this.isRecordingSpeaking()
  }

  isRecordingPlaceHolder() {
    const { participants } = this.props
    const { round } = this.state
    const { reviewing } = this.props.ccState
    if (participants.human) {
      const { listeningRound, listeningSeat } = this.listening()
      if (listeningRound === round && listeningSeat === this.seatOfParticipant('human')) {
        const reviewingAndNotReRecording = reviewing && !this.rerecord
        if (!reviewingAndNotReRecording) return true
      }
    }
    return false
  }

  isRecordingSpeaking() {
    return this.speakingNow() === 'human'
  }

  listening() {
    const listeningRound =
      this.props.participants.human.listening && typeof this.props.participants.human.listening.round !== 'undefined'
        ? this.props.participants.human.listening.round
        : Infinity // 0 is a valid round
    const listeningSeat =
      (this.props.participants.human.listening && this.props.participants.human.listening.seat) || 'seat2'
    return { listeningRound, listeningSeat }
  }

  seatOfParticipant(participant) {
    return this.seat(Object.keys(this.props.participants).indexOf(participant))
  }

  getCamera(ref) {
    if (ref)
      // in olden days ref might be null
      this.camera = ref
  }

  componentDidMount() {
    // first load the moderator's speaking part and the listening part for all the participants;
    if (this.canNotRecordHere) return // no reason to go further
    Object.keys(this.props.participants).forEach(participant => {
      if (participant === 'human') return
      this.preFetchObjectURL(participant, participant === 'moderator', 0)
    })
    if (this.props.participants.moderator && this.props.participants.moderator.listening)
      this.preFetchObjectURL('moderator', false, 0) // then load the moderator's listening parts
    for (let i = 0; i < this.numRounds; i++) {
      // then load the rest of the speaking parts
      Object.keys(this.props.participants).forEach(participant => {
        if (participant === 'moderator' && i === 0) return // moderator's first speaking part was loaded first
        if (participant === 'human') return
        if (this.props.participants[participant].speaking[i]) this.preFetchObjectURL(participant, true, i)
      })
    }
    if (this.props.participants.human) this.beginButton() // there use to be a button click that started this -but  now we just go after being mounted
  }

  /****************************************************************************************************************
    Youtube videos can be speaking segments. But the logo that keeps poping up makes them un pleasant.
    This code is here in case we want to evaluate it agian

   ***************************************************************************************************************/
  onYouTubeIframeAPIReady() {
    const seatStyle = this.state.seatStyle
    const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    Object.keys(this.props.ccState.participants).forEach((participant, i) => {
      if (this.props.ccState.participants[participant].youtube) {
        const videoId = getYouTubeID(this.props.participants[participant].listening)
        logger.trace('Undebate.onYouTubeIframeAPIReady new player for:', participant, videoId)
        try {
          this.props.ccState.participants[participant].youtubePlayer = new YT.Player('youtube-' + participant, {
            width: (parseFloat(seatStyle[this.seat(i)].width) * innerWidth) / 100,
            height: (parseFloat(seatStyle[this.seat(i)].width) * HDRatio * innerWidth) / 100,
            style: { fontSize: '8px' },
            videoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              enablejsapi: 1,
              fs: 0,
              loop: 1,
              playlist: videoId, // needed so loop will work
              modestbranding: 1,
              branding: 0,
              playsinline: 1,
              rel: 0,
              origin: window.location.host,
              showinfo: 0,
            },
            events: {
              onReady: this.onYouTubePlayerReady.bind(this, participant),
              onStateChange: this.onYouTubePlayerStateChange.bind(this, participant),
              onError: e => {
                logger.error('Undebate.onYouTubeIframeAPIReady onError', participant, e.data)
              },
            },
          })
          logger.trace('Undebate.onYouTubeIframeAPIReady new Player completed')
        } catch (error) {
          logger.error('Undebate.onYouTubeIframeAPIReady caught error on new YT.Player', error.name, error.message)
        }
      }
    })
  }

  onYouTubePlayerReady(participant, event) {
    let iframe = document.getElementById('youtube-' + participant)
    iframe.style.width = 'inherit' // after youtube has loaded, go and find the iframe and set these so that it will grow and shrink like we want
    iframe.style.height = 'inherit'

    event.target.mute()
    let playerState = event.target.getPlayerState()
    logger.trace('onYouTubePlayerReady', participant, event.data, playerState)
    if (playerState === YT.PlayerState.CUED) event.target.playVideo()
  }

  onYouTubePlayerStateChange(participant, event) {
    logger.trace('onYouTubePlayerStateChange', participant, event.data)
    let chair = this.seatOfParticipant(participant)
    if (event.data === YT.PlayerState.ENDED) {
      if (chair === 'speaking') this.autoNextSpeaker()
      else this.props.ccState.participants[participant].youtubePlayer.seekTo(0, false)
    }
  }

  // for the given seatOffset and round, fetch the object, or start the media
  nextMediaState(part) {
    logger.trace(`nextMediaState part:${part}`)
    //if (part === 'human') return;
    // humans won't get here
    const { round } = this.state
    const { reviewing } = this.props.ccState

    let speaking = this.seatOfParticipant(part) === 'speaking'

    var objectURL
    if (speaking) {
      if (part === 'human') {
        if (
          this.props.ccState.participants.human &&
          this.props.ccState.participants.human.speakingObjectURLs[round] &&
          !this.rerecord
        ) {
          objectURL = this.props.ccState.participants.human.speakingObjectURLs[round]
        } else {
          objectURL = 'cameraStream' // set it to something - but this.cameraStream should really be used
        }
      } else if (!(objectURL = this.props.ccState.participants[part].speakingObjectURLs[round])) {
        this.props.ccState.participants[part].speakingImmediate[round] = true
        this.stallWatch(part)
        logger.error('Undebate.nextMediaState need to do something about stallWatch with preFetch')
      }
    } else {
      if (part === 'human' && (!reviewing || (reviewing && this.rerecord))) objectURL = 'cameraStream'
      //set it to something - but this.cameraStream should really be used
      else if (!(objectURL = this.props.ccState.participants[part].listeningObjectURL))
        if (this.props.participants[part].listening) {
          // listeningObject hasn't loaded yet
          this.props.ccState.participants[part].listeningImmediate = true
        } else {
          // there is no listening object
          return this.playObjectURL(part, '', speaking, reviewing) // part is listening, but theres no video, for stopping of the currently playing video so the placeholder image can take over
        }
    }
    if (objectURL) this.playObjectURL(part, objectURL, speaking, reviewing)
  }

  /*****************************************************************************************************************************
   * Prefetch Video
   *
   * Prefect video is for slow links where you can't play it in real time, or where you might want to load it now and watch it later.
   * But we haven't used this in a while so it may have issues.  The logic remains, and the code remains for future implementation
   *
   ***************************************************************************************************************************/

  prefetchRetries = {}
  preFetchList = []
  preFetchQueue = 0

  setExternalObjectURL(part, speaking, round) {
    if (speaking)
      this.props.ccState.participants[part].speakingObjectURLs[round] = this.props.participants[part].speaking[round]
    else {
      this.props.ccState.participants[part].listeningObjectURL = this.props.participants[part].listening
    }
    if (round == 0 && part === 'moderator') {
      this.setState({ moderatorReadyToStart: true })
    }
  }

  preFetchObjectURL(part, speaking, round) {
    if (!this.props.participants[part]) return // part may not exist in this debate

    if (true /*window.env!=='production' || this.props.ccState.participants[part].youtube */) {
      // in development, don'e prefetch the videos because they won't be cached by the browser and you'll end up consuming a lot of extra cloudinary bandwith, on youtube we can't prefetch
      logger.trace("undebate.preFetchObjectURl - in development we don't prefetch", part, speaking, round)
      this.setExternalObjectURL(part, speaking, round)
      return
    } else {
      let queued = this.preFetchQueue || 0
      if (queued > 1) {
        return this.preFetchList.push([part, speaking, round])
      } else {
        this.preFetchQueue = queued + 1
        this.preFetchHandler(part, speaking, round)
      }
      this.setState({ preFetchQueue: this.preFetchQueue + this.preFetchList.length })
    }
  }

  preFetchHandler(part, speaking, round) {
    const shiftPreFetchList = () => {
      if (this.preFetchList.length) {
        setTimeout(() => this.preFetchList.length && this.preFetchHandler(...this.preFetchList.shift()))
      }
    }
    const url = speaking
      ? this.props.participants[part].speaking[round] || this.props.participants[part].listening
      : this.props.participants[part].listening
    logger.trace('preFetchObjectURL', 'part:', part, 'url:', url, 'speaking:', speaking, 'round:', round)
    fetch(url)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(async blob => {
        logger.trace(
          'Undebate.preFetchObjectURL fetch completed:',
          'part:',
          part,
          'url:',
          url,
          'speaking:',
          speaking,
          'round:',
          round,
          'size:',
          blob.size,
          'type:',
          blob.type
        )
        this.preFetchQueue = Math.max(this.preFetchQueue - 1, 0)
        this.setState({ preFetchQueue: this.preFetchQueue + this.preFetchQueue + this.preFetchList.length })
        var objectURL = URL.createObjectURL(blob)
        //await promiseSleep(part==='moderator' && 2000 || 0);
        if (speaking) {
          this.props.ccState.participants[part].speakingObjectURLs[round] = objectURL
          if (this.props.ccState.participants[part].speakingImmediate[round]) {
            this.playObjectURL(part, objectURL, speaking, false)
            this.props.ccState.participants[part].speakingImmediate[round] = false
          }
        } else {
          this.props.ccState.participants[part].listeningObjectURL = objectURL
          if (this.props.ccState.participants[part].listeningImmediate) {
            this.playObjectURL(part, objectURL, speaking, false)
            this.props.ccState.participants[part].listeningImmediate = false
          }
        }
        shiftPreFetchList()
        if (round == 0 && part === 'moderator') {
          logger.trace('moderatorReadyToStart')
          this.setState({ moderatorReadyToStart: true })
        }
      })
      .catch(err => {
        logger.error('Undebate.preFetchObjectURL fetch caught error', part, speaking, round, url, err.name, err.message)
        this.preFetchQueue = Math.max(this.preFetchQueue - 1, 0)
        this.setState({ preFetchQueue: this.preFetchQueue + this.preFetchQueue + this.preFetchList.length })
        let retries = this.prefetchRetries[part + speaking + round] || 0
        if (retries < 3) {
          logger.trace('Undebate.preFetchObjectURL retrying', retries, part, speaking, round, url)
          this.prefetchRetries[part + speaking + round] = retries + 1
          this.preFetchList.push([part, speaking, round])
        } else {
          logger.error('Undebate.preFetchObjectURL retries exceeded, using external link', part, speaking, round, url)
          this.setExternalObjectURL(part, speaking, round)
        }
        shiftPreFetchList()
      })
  }

  async playObjectURL(part, objectURL, speaking, reviewing) {
    if (!this.props.ccState.participants[part].element.current && !this.props.ccState.participants[part].youtubePlayer)
      return // we don't have a space for this participant
    logger.trace('playObjectURL part:', part, 'objectURL:', objectURL, speaking, reviewing)
    if (this.props.ccState.participants[part].youtubePlayer) {
      this.props.ccState.participants[part].youtubePlayer.loadVideoById({ videoId: getYouTubeID(objectURL) })
      let chair = this.seatOfParticipant(part)
      if (chair !== 'speaking') this.props.ccState.participants[part].youtubePlayer.mute()
      else this.props.ccState.participants[part].youtubePlayer.unMute()
      if (this.props.ccState.participants[part].youtubePlayer.getPlayerState() !== YT.PlayerState.PLAYING)
        this.props.ccState.participants[part].youtubePlayer.playVideo()
    } else {
      let element = this.props.ccState.participants[part].element.current
      if (element.src === objectURL) {
        return // don't change it.
      }
      //element.src=null;
      if (part === 'human' && !speaking && !reviewing) {
        // human is not speaking
        if (element.srcObject === this.cameraStream) {
          if (element.muted && element.loop) return
          element.muted = true
          element.loop = true
        } else {
          element.src = ''
          element.muted = true
          element.loop = true
          element.srcObject = this.cameraStream // objectURL should be camera
        }
        return // not need to play - source is a stream
      } else if (part === 'human' && !speaking && reviewing) {
        if (objectURL === 'cameraStream') {
          // rerecord while reviewing
          element.src = ''
          element.muted = true
          element.loop = true
          element.srcObject = this.cameraStream // objectURL should be camera
        } else {
          element.srcObject = null
          element.src = objectURL
          element.muted = true
          element.loop = true
        }
      } else if (
        part === 'human' &&
        speaking &&
        (!this.props.ccState.participants.human.speakingObjectURLs[this.state.round] || this.rerecord)
      ) {
        // human is speaking (not playing back what was spoken)
        element.src = ''
        element.srcObject = this.cameraStream // objectURL should be camera
        element.muted = true
        element.loop = false
        return // no need to play source is a stream
      } else if (
        part === 'human' &&
        speaking &&
        this.props.ccState.participants.human.speakingObjectURLs[this.state.round]
      ) {
        // human is playing back what was spoken
        element.srcObject = null
        element.src = objectURL
        element.muted = false
        element.loop = false
      } else if (speaking) {
        element.src = objectURL
        element.muted = false
        element.loop = false
      } else {
        if (element.src === objectURL && element.muted && element.loop) return
        if (!objectURL) {
          if (!element.paused) element.pause()
          element.removeAttribute('src') // can't set the src to "", but you can remove src which will set it to ""
        } else {
          element.src = objectURL
          element.muted = true
          element.loop = true
        }
      }
      if (!objectURL) return // if nothing (no listening video) don't try to play it.
      try {
        // we have to stallWatch before we play because play might not return right away for lack of data
        let stallWatchPlayed
        if (speaking) stallWatchPlayed = this.stallWatch(part)
        await element.play()
        if (stallWatchPlayed) stallWatchPlayed()
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          this.requestPermissionElements.push(element)
          if (!this.state.requestPermission) this.setState({ requestPermission: true })
        } else if (err.name === 'AbortError') {
          return
          /*if (element.loop && element.autoplay && element.muted) return // safari generates this error but plays anyway - chome does not generate an error
          this.requestPermissionElements.push(element)
          if (!this.state.requestPermission) this.setState({ requestPermission: true })*/
        } else {
          logger.error('Undebate.playObjectURL caught error', err.name, err)
        }
      }
    }
  }

  async requestPermission(e) {
    // the click event is passed but not used
    var element
    function playFunc(e) {
      e.play()
        .then(result => logger.trace('requestPermission played', e.src, result))
        .catch(err => {
          logger.error('requestPermission caught error', err.name, err.message)
          if (err.name === 'NotAllowedError') {
            this.requestPermissionElements.push(e) // put it back to try again
            if (!this.state.requestPermission) this.setState({ requestPermission: true })
          } else
            logger.error(
              'requestPermission caught error on play after requesting permission. element:',
              element,
              'err:',
              err.name,
              err.message
            )
        })
    }
    while ((element = this.requestPermissionElements.shift())) {
      playFunc(element)
    }
    this.setState({ requestPermission: false, stalled: false })
  }

  allPause() {
    if (!this.state.begin) {
      this.beginButton()
    } else if (this.state.warmup) {
      // do nothing
    } else if (!this.state.allPaused) {
      this.ensurePaused()
    } else {
      this.allPlay()
      if (this.rerecord) this.resumeRecording()
      this.setState({ allPaused: false })
    }
  }

  ensurePaused() {
    Object.keys(this.props.ccState.participants).forEach(participant => {
      if (this.props.ccState.participants[participant].element.current)
        this.props.ccState.participants[participant].element.current.pause()
      if (this.props.ccState.participants[participant].youtubePlayer)
        this.props.ccState.participants[participant].youtubePlayer.pauseVideo()
    })
    if (this.state.isRecording) this.pauseRecording()
    if (!this.state.allPaused) this.setState({ allPaused: true })
  }

  allStop() {
    Object.keys(this.props.ccState.participants).forEach(participant => {
      if (this.props.ccState.participants[participant].element.current) {
        this.props.ccState.participants[participant].element.current.pause()
        this.props.ccState.participants[participant].element.current.removeAttribute('src')
      }
    })
  }

  allPlay() {
    Object.keys(this.props.ccState.participants).forEach(async participant => {
      if (this.props.ccState.participants[participant].youtubePlayer) {
        if (this.props.ccState.participants[participant].youtubePlayer.getPlayerState() !== YT.PlayerState.PLAYING)
          this.props.ccState.participants[participant].youtubePlayer.playVideo()
      } else if (this.props.ccState.participants[participant].element.current) {
        if (
          this.props.ccState.participants[participant].element.current.src &&
          this.props.ccState.participants[participant].element.current.paused
        ) {
          // if no src it's just a placeholder - don't play it
          try {
            await this.props.ccState.participants[participant].element.current.play()
          } catch (err) {
            if (err.name === 'NotAllowedError') {
              this.requestPermissionElements.push(element)
              this.setState({ requestPermission: true })
            } else if (err.name === 'AbortError') {
              this.requestPermissionElements.push(element)
              this.setState({ requestPermission: true })
            } else {
              logger.error('undebate.play() for ', participant, 'caught error', err)
            }
          }
        }
      }
    })
  }

  prevSection() {
    var { seatOffset, round } = this.state
    logger.info('Undebate.prevSection', seatOffset, round)
    seatOffset = 0
    round -= 1
    if (round < 0) round = 0
    this.stopRecording(false)
    this.newOrder(seatOffset, round)
  }

  prevSpeaker() {
    var { seatOffset, round } = this.state
    logger.info('Undebate.prevSpeaker', seatOffset, round)
    if (this.numParticipants === 1) {
      round -= 1
      if (round < 0) round = 0
    } else {
      if (seatOffset === 0) {
        // if it is the moderator speaking
        if (round === 0);
        else {
          // can't go before the moderator on the first round
          // go to the last position of the previous round
          seatOffset = 1
          round -= 1
        }
      } else if (seatOffset >= this.numParticipants - 1) {
        // if the FIRST participant is speaking
        seatOffset = 0
      } else seatOffset += 1
    }
    this.stopRecording(false)
    this.newOrder(seatOffset, round)
  }

  nextSection() {
    var { seatOffset, round } = this.state
    logger.info('Undebate.nextSection', seatOffset, round)
    if (this.numParticipants === 1) {
      round += 1
      if (round >= this.numRounds) return this.finished()
    } else {
      round += 1
      seatOffset = 0
      if (round >= this.numRounds) return this.finished()
    }
    this.stopRecording(false)
    this.newOrder(seatOffset, round)
  }

  nextSpeaker() {
    var { seatOffset, round } = this.state
    logger.info('Undebate.nextSpeaker', seatOffset, round)
    if (this.numParticipants === 1) {
      round += 1
      if (round >= this.numRounds) return this.finished()
    } else {
      seatOffset -= 1
      if (seatOffset === 0) round += 1 // back to the moderator, switch to the next round
      if (seatOffset < 0) {
        if (round + 1 < this.numRounds) seatOffset = this.numParticipants - 1
        // moderator just finished, he moves to the back of the order
        else return this.finished()
      }
    }
    this.stopRecording(false)
    this.newOrder(seatOffset, round)
  }

  autoNextSpeaker() {
    var { seatOffset, round } = this.state
    logger.trace('Undebate.autoNextSpeaker', seatOffset, round)
    if (this.numParticipants === 1) {
      round += 1
      if (round >= this.numRounds) return this.finished()
    } else {
      seatOffset -= 1
      if (seatOffset === 0) round += 1 // back to the moderator, switch to the next round
      if (seatOffset < 0) {
        if (round + 1 < this.numRounds) seatOffset = this.numParticipants - 1
        // moderator just finished, he moves to the back of the order
        else return this.finished()
      }
    }
    this.stopRecording(false)
    this.newOrder(seatOffset, round)
  }

  finishedSpeaking() {
    // this is different than nextSpeaker to avoid the race condition that one might hit the finished speaking button just after the timeout and things have already advanced
    logger.info('Undebate.finishedSpeaking')
    if (this.seatOfParticipant('human') === 'speaking') return this.autoNextSpeaker()
  }

  // return the property of this.props.participants who is speaking now
  speakingNow() {
    const participantList = Object.keys(this.props.participants)
    return this.state.seatOffset ? participantList[participantList.length - this.state.seatOffset] : participantList[0]
  }

  rerecordPlaceHolderButton() {
    logger.info('Undebate.rerecordPlaceHolderButton')
    this.pauseRecording() // it might be recording when the user hits rerecord
    this.rerecord = true // this is not in state - because newOrder needs to see this value now, and setstate won't change it if we call that here, until after this sequece of functions returns
    this.resumeRecording()
    let speakingNow = this.speakingNow()
    if (speakingNow !== 'human')
      // if you are rerecording the placeholder while watching someone else, we want that to start over
      this.props.ccState.participants[speakingNow].element.current.currentTime = 0
  }

  rerecordButton() {
    logger.info('Undebate.rerecordButton')
    this.pauseRecording() // it might be recording when the user hits rerecord
    this.rerecord = true // this is not in state - because newOrder needs to see this value now, and setstate won't change it if we call that here, until after this sequece of functions returns
    this.resumeRecording()
  }

  pauseRecording() {
    this.stopRecording() // true=>rerecord
  }

  resumeRecording() {
    const { seatOffset, round } = this.state
    this.newOrder(seatOffset, round)
  }

  startRecording(cb, visible = false) {
    this.camera.startRecording(cb)
    if (visible) this.setState({ isRecording: true })
    this.preventPortraitRecording()
  }

  stopRecording() {
    this.rerecord = false
    this.stopCountDown()
    this.camera && this.camera.stopRecording(true) // true=don't generate error messages if called when not recording
    this.setState({ isRecording: false })
  }

  newOrder(seatOffset, round) {
    const { participants } = this.props

    this.clearStallWatch()
    var followup = []
    Object.keys(participants).forEach((participant, i) => {
      let oldChair = this.seat(i)
      let newChair = this.seat(i, seatOffset)
      logger.trace('rotateOrder', round, seatOffset, participant, oldChair, newChair)

      if (participant === 'human') {
        const timeLimit = this.getTimeLimit()
        const { listeningRound, listeningSeat } = this.listening()
        if (oldChair === 'speaking' && newChair === 'speaking' && this.rerecord) {
          // the user is initiating a rerecord
        } else if (
          oldChair === 'speaking' &&
          (!this.props.ccState.participants.human.speakingObjectURLs[this.state.round] || this.rerecord)
        ) {
          // the oldChair and the old round
          //this.rerecord = false
          //this.stopRecording()
        } else if (oldChair === listeningSeat && this.state.round === listeningRound && !this.props.ccState.reviewing) {
          // the oldChair and the old round
          //this.rerecord = false
          //this.stopRecording()
        }
        // then see if it needs to be turned on - both might happen at the same transition
        followup.push(() => this.nextMediaState(participant))
        followup.push(() => this.maybeEnableRecording(newChair, listeningSeat, round, listeningRound, timeLimit))
      } else if (oldChair === 'speaking' || newChair === 'speaking' || this.state.allPaused) {
        // will be speaking or need to start media again
        followup.push(() => this.nextMediaState(participant))
      } else {
        logger.trace('participant continue looping', participant)
      }
    })
    logger.trace('rotateOrder: ', seatOffset)

    this.setState({ seatOffset, round, talkative: false, allPaused: false }, () => {
      while (followup.length) followup.shift()()
    })
  }

  ensureNotRecording(oldChair, newChair, listeningSeat, listeningRound) {
    if (oldChair === 'speaking' && newChair === 'speaking' && this.rerecord) {
      // the user is initiating a rerecord
    } else if (
      oldChair === 'speaking' &&
      (!this.props.ccState.participants.human.speakingObjectURLs[this.state.round] || this.rerecord)
    ) {
      // the oldChair and the old round
      this.rerecord = false
      this.stopRecording()
    } else if (oldChair === listeningSeat && this.state.round === listeningRound) {
      // the oldChair and the old round
      this.stopRecording()
    }
  }

  maybeEnableRecording(newChair, listeningSeat, round, listeningRound, timeLimit) {
    if (!timeLimit) return
    if (this.isRecordingPlaceHolder()) {
      this.recordFromSpeakersSeat(listeningSeat, timeLimit, round)
    } else if (newChair === 'speaking') {
      if (this.rerecord) {
        this.recordWithWarmup(timeLimit, round)
      } else if (!this.props.ccState.participants.human.speakingObjectURLs[round]) {
        this.recordWithCountdown(timeLimit, round, TransitionTime)
      }
    }
  }

  saveRecordingToParticipants(speaking, round, blobs) {
    logger.trace('saveRecordingToParticipants (locally)', speaking, round)
    if (!blobs.length) return logger.error('saveRecordingToParticipants found no blobs', blobs)
    logger.trace(
      'save Recorded Blobs: ',
      blobs.length,
      blobs.length && blobs[0].type,
      blobs.reduce((acc, blob) => acc + blob.size || 0, 0)
    )
    const blob = new Blob(blobs, { type: blobs[0].type }) // use the type from the blob because it might be different than the type we asked for - eg safari gives your video/mp4 no matter what
    if (!speaking) {
      this.props.ccState.participants.human.listeningBlob = blob
      this.props.ccState.participants.human.listeningObjectURL = URL.createObjectURL(blob)
    } else {
      this.props.ccState.participants.human.speakingBlobs[round] = blob
      this.props.ccState.participants.human.speakingObjectURLs[round] = URL.createObjectURL(blob)
    }
  }

  recordWithCountdown(timeLimit, round, delay) {
    if (!timeLimit) return
    this.startCountDown(timeLimit, () => this.autoNextSpeaker(), delay)
    this.startTalkativeTimeout(timeLimit * 0.75)
    this.startRecording(blobs => this.saveRecordingToParticipants(true, round, blobs), true)
  }

  recordWithWarmup(timeLimit, round) {
    if (!timeLimit) return
    const warmupSeconds = 3
    this.warmupCountDown(warmupSeconds, () => this.recordWithCountdown(timeLimit, round, 0))
  }

  recordFromSpeakersSeat(listeningSeat, timeLimit, round) {
    if (!timeLimit) return
    if (listeningSeat === 'speaking') {
      // recording the listening segment from the speakers seat
      this.startCountDown(timeLimit, () => this.autoNextSpeaker(), TransitionTime)
    }
    this.startRecording(blobs => this.saveRecordingToParticipants(false, round, blobs))
  }

  async getCameraMedia() {
    if (this.props.participants.human) {
      // if we have a human in this debate then we are using the camera
      try {
        await this.camera.getCameraStream()
        const { listeningRound, listeningSeat } = this.listening()
        logger.trace('getUserMedia() got stream:', this.cameraStream)
        //it will be set by nextMediaState this.human.current.src = stream;
        Object.keys(this.props.participants).forEach(part => this.nextMediaState(part))
        // special case where human is in seat2 initially - because seat2 is where we record their silence
        if (listeningRound === 0 && this.seatOfParticipant('human') === listeningSeat)
          this.startRecording(blobs => this.saveRecordingToParticipants(false, 0, blobs)) // listening is not speaking
      } catch (e) {
        logger.error('getCameraMedia', e.name, e.message)
      }
    } else {
      // if we don't have a human - kick off the players
      Object.keys(this.props.participants).forEach(part => this.nextMediaState(part))
    }
  }

  finished() {
    logger.info('Undebate.finished')
    this.clearStallWatch()
    this.allStop()
    setTimeout(() => {
      this.camera && this.camera.releaseCamera()
      this.setState({ done: true })
      this.props.dispatch({ type: 'Next' })
    }, 1.5 * TransitionTime)
    return this.setState({ finishUp: true })
  }

  startCountDown(seconds, finishFunc, startDelay = TransitionTime) {
    // startDelay is used to allow the moving windows to move into position before recording starts, but when rerecording there is no need
    const counter = sec => {
      if (sec > 0) {
        this.countdownTimeout = setTimeout(() => counter(sec - 1), 1000)
        this.setState({ warmup: false, countDown: sec })
      } else {
        this.countdownTimeout = 0
        finishFunc && setTimeout(finishFunc) // called after timeout to avoid setState collisions
        if (this.state.countDown !== 0) this.setState({ warmup: false, countDown: 0 })
      }
    }

    if (this.countdownTimeout) clearTimeout(this.countdownTimeout)
    this.countdownTimeout = setTimeout(() => counter(seconds), startDelay) // can't call setState from here because it will collide with the setstate of the parent event handler
  }

  stopCountDown() {
    if (this.countdownTimeout) {
      clearTimeout(this.countdownTimeout)
      this.countdownTimeout = 0
    }
    if (this.talkativeTimeout) {
      clearTimeout(this.talkativeTimeout)
      this.talkativeTimeout = 0
    }
    this.setState({ warmup: false })
  }

  startTalkativeTimeout(seconds) {
    if (this.talkativeTimeout) clearTimeout(this.talkativeTimeout)
    this.talkativeTimeout = setTimeout(() => this.setState({ talkative: true }), seconds * 1000)
  }

  warmupCountDown(seconds, finishFunc) {
    // for warmUp it should be 3..2..1..60...59
    const stopAt = 1
    const counter = sec => {
      if (sec > stopAt) {
        this.countdownTimeout = setTimeout(() => counter(sec - 1), 1000)
        this.setState({ warmup: true, countDown: sec })
      } else {
        this.countdownTimeout = 0
        this.setState({ warmup: true, countDown: sec })
        setTimeout(finishFunc, 1000) // do the finish on the next tick
      }
    }
    if (this.countdownTimeout) clearTimeout(this.countdownTimeout) // if users clicks again on the redo button within the coundown time
    counter(seconds)
  }

  onIntroEnd() {
    this.setState({ begin: true }, () => {
      this.getCameraMedia()
    })
  }

  videoError(participant, e) {
    logger.error('Undebate.videoError ' + e.target.error.code + '; details: ' + e.target.error.message, participant)
    if (
      e.target.error.code === e.target.error.MEDIA_ERR_DECODE &&
      e.target.error.message.startsWith('PIPELINE_ERROR_DECODE')
    ) {
      // there is something wrong with the video we are trying to play
      if (this.seatOfParticipant(participant) === 'speaking') {
        this.autoNextSpeaker() // skip to the next speaker
        logger.error(
          'Undebate.videoError on speaker, skipping',
          e.target.error.message,
          this.props.ccState.participants[participant].element.current.src
        )
      } else {
        logger.error(
          'Undebate.videoError on listener, ignoring',
          e.target.error.message,
          this.props.ccState.participants[participant].element.current.src
        )
      }
    } else {
      let chair = this.seatOfParticipant(participant)
      if (chair === 'speaking') this.autoNextSpeaker() // if error is on who's speaking skip to next speaker, else ignore the error
    }
  }

  // we have to check on the speaker's video periodically to see if it's stalled by checking if the currentTime is increasing
  // the video.stalled event just doesn't respond to all the situations, and it doesn't tell you when the stall has ended
  stallWatch(speaker) {
    if (this.props.ccState.participants[speaker].youtube) return

    if (this.props.ccState.participants[speaker].speakingImmediate[this.state.round] && this.stallWatchTimeout)
      // was called because preFetch hadn't completed when it was time to play
      return

    if (this.stallWatchTimeout) {
      logger.error('Undebate.stallWatch called but timeout already set', this.stallWatchTimeout)
    }

    const element = this.props.ccState.participants[speaker].element.current
    var lastTime = -1
    var tickCount = 0

    const calcWaitingPercent = () => {
      if (element.duration !== Infinity) return Math.round((element.buffered.end(0) / element.duration) * 100)
      // webm files don't have duration information
      else
        return Math.round(
          (Math.max(0, element.buffered.end(0) - element.buffered.start(0) - element.currentTime) / 15) * 100
        ) // get 15 seonds of data
    }

    const stallWatchPlayed = () => {
      // this is called after the player has started
      if (this.state.stalled) {
        if (element.readyState === 4 || element.buffered.end(0) - element.currentTime > 15) {
          logger.trace('Undebate.stallWatch.stallWatchPlayed unstalled', speaker)
          this.setState({ stalled: false, waitingPercent: 0 })
        } else {
          element.pause()
          logger.trace('Undebate.stallWatch.stallWatchPlayed paused', speaker)
          this.setState({ waitingPercent: calcWaitingPercent() })
        }
      }
    }

    const updater = () => {
      if (this.state.allPaused) return (this.stallWatchTimeout = setTimeout(updater, 250))
      let currentTime = element.currentTime
      if (element.readyState > 1) {
        // wait for the Meta Data to be ready
        let duration = element.duration || Infinity // it might be Infinity, it might be NAN if the Meta Data hasn't loaded yet
        if (currentTime === Infinity) {
          logger.error('Undebate.stallWatch CurrentTime is Infinity') // it might be - so just come back again later
          this.stallWatchTimeout = setTimeout(updater, 250)
        } else if (currentTime >= duration) {
          if (this.state.stalled) {
            logger.trace('Undebate.stallWatch unstalling on end', speaker)
            this.setState({ stalled: false, waitPercent: 0 })
          }
          this.stallWatchTimeout = false
          return // don't set the timeout again.
        } else if (currentTime === lastTime) {
          tickCount++
          if (tickCount < 3) {
            this.stallWatchTimeout = setTimeout(updater, 250)
          } else if (this.state.stalled !== speaker) {
            element.pause()
            logger.trace('Undebate.stallWatch stalled', speaker)
            this.setState({ stalled: speaker })
            this.stallWatchTimeout = setTimeout(updater, 250)
          } else {
            if (element.readyState === 4) {
              // HAVE_ENOUGH_DATA
              element
                .play()
                .then(() => {
                  this.stallWatchTimeout = setTimeout(updater, 250) // don't call updater again until play has completed - it might take longer than 250mS
                  this.setState({ stalled: false, waitingPercent: 0 })
                })
                .catch(err => {
                  logger.error('Undebate.stallWatch.updater caught error on play', err.name, err.message)
                })
            } else {
              this.setState({ waitingPercent: calcWaitingPercent() })
              this.stallWatchTimeout = setTimeout(updater, 250)
            }
          }
        } else {
          lastTime = currentTime
          tickCount = 0
          if (this.state.stalled === speaker) {
            // it was stalled and now its moved forward, but we don't want it to stall again too soon
            if (element.readyState === 4 || element.buffered.end(0) - currentTime > 15) {
              logger.trace('Undebate.stallWatch unstalled', speaker)
              this.setState({ stalled: false, waitingPercent: 0 })
            } else {
              this.setState({ waitingPercent: calcWaitingPercent() })
            }
          }
          this.stallWatchTimeout = setTimeout(updater, 250)
        }
      } else {
        // the play can take a long time to start - if it does through up the warning
        if (currentTime === lastTime) {
          tickCount++
          if (tickCount < 3) {
            // don't do anything yet
          } else if (!this.state.stalled) this.setState({ stalled: speaker, waitingPercent: 0 })
        } else {
          if (this.state.stalled) this.setState({ stalled: false, waitingPercent: 0 })
          lastTime = currentTime
          tickCount = 0
        }
        this.stallWatchTimeout = setTimeout(updater, 250) // come back later
      }
    }
    this.stallWatchTimeout = setTimeout(updater, 750) // intially
    return stallWatchPlayed
  }

  clearStallWatch() {
    if (this.stallWatchTimeout) clearTimeout(this.stallWatchTimeout)
    this.stallWatchTimeout = false
    if (this.state.stalled) this.setState({ stalled: false, waitingPercent: 0 })
  }
}
