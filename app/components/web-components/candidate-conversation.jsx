'use strict'

import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'
import Join from '../join'
import Input from '../lib/input'
import SocialShareBtn from '../lib/socialShareBtn'
import Icon from '../lib/icon'
import AgendaTranscript from '../agenda-transcript'
import AgendaNav from '../agenda-nav'

import TimeFormat from 'hh-mm-ss'
import cloneDeep from 'lodash/cloneDeep'
import getYouTubeID from 'get-youtube-id'
import Preamble from '../preamble'

const TransitionTime = 500
const TopMargin = 0
const IntroTransition = 'all 5s ease'
const HDRatio = 1080 / 1920 //0.5625
const ShadowBox = 10

import IconPrevSpeaker from '../../svgr/icon-prev-speaker'
import IconPrevSection from '../../svgr/icon-prev-session'
import IconPlay from '../../svgr/icon-play'
import IconPause from '../../svgr/icon-pause'
import IconSkipSpeaker from '../../svgr/icon-skip-speaker'
import IconNextSection from '../../svgr/icon-skip-session'
import IconRedo from '../../svgr/icon-redo'
import IconFinishRecording from '../../svgr/icon-finish-recording'
import IconRecording from '../../svgr/icon-recording'

import ConversationHeader from '../conversation-header'

import ReactCameraRecorder from '../react-camera-recorder'
import supportsVideoType from '../lib/supports-video-type'

import { auto_quality, placeholder_image } from '../lib/cloudinary-urls'
import createParticipant from '../lib/create-participant'
import BeginButton from '../begin-button'
import DonateButton from '../donate-button'

function promiseSleep(time) {
  return new Promise((ok, ko) => setTimeout(ok, time))
}

// this is where we should use a theme but for now

const styles = {
  scrollableIframe: {},
  wrapper: {
    width: '100vw',
    height: '100vh',
    '&$scrollableIframe': {
      height: 'auto',
    },
  },
  innerWrapper: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'white', //"#F2F2F1",
    backgroundSize: 'cover',
    overflow: 'hidden',
    fontFamily: "'Libre Franklin','Montserrat', sans-serif",
    '&$scrollableIframe': {
      height: 'auto',
    },
  },
  innerImageOverlay: {
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage:
      'url(https://res.cloudinary.com/hf6mryjpf/image/upload/v1572029099/experienced-candidate-conversations-960x492_mworw9.png)',
    opacity: 0.1,
    backgroundSize: 'cover',
    overflow: 'hidden',
    fontFamily: "`Libre Franklin`, 'Montserrat', sans-serif",
    transition: `all ${TransitionTime}ms linear`,
    '&$scrollableIframe': {
      height: 'auto',
    },
    '&$intro': {
      opacity: 0,
    },
  },
  participant: {
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    '&$stylesSet': {
      transition: `all ${TransitionTime}ms linear`,
    },
    '&$begin': {
      transition: `${IntroTransition}`,
    },
  },
  participantBackground: {
    display: 'block',
    position: 'relative',
    textAlign: 'center',
    backgroundColor: 'white', //'#dbdfe0',  // this color is taken to match the the background image if you change the image, you should re-evaluate this color
    '&$stylesSet': {
      transition: `all ${TransitionTime}ms linear`,
    },
    '&$begin': {
      transition: `${IntroTransition}`,
    },
  },
  box: {
    display: 'inline',
    'vertical-align': 'top',
    position: 'absolute',
    // 'box-shadow': `${ShadowBox}px ${ShadowBox}px ${ShadowBox}px gray`,
    '&$stylesSet': {
      transition: `all ${TransitionTime}ms linear`,
    },
    '&$begin': {
      transition: `${IntroTransition}`,
    },
  },
  introTitle: {
    display: 'table-row',
    verticalAlign: 'top',
    fontSize: '133%',
    height: 'fit-content',
    width: '100%',
    '&$intro': {
      top: '-100vh',
    },
    '& h1': {
      paddingTop: '0.5em',
      margin: 0,
      textAlign: 'center',
    },
  },
  introBox: {
    display: 'table-row',
    verticalAlign: 'middle',
    '&$intro': {
      top: '-100vh',
    },
  },
  introInner: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  outerBox: {
    display: 'block',
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    '&$scrollableIframe': {
      height: 'auto',
      minHeight: '100vh',
    },
  },
  beginBox: {
    position: 'absolute',
    top: 0,
  },
  introPane: {
    position: 'absolute',
    left: '25vw',
    top: 0,
    width: '50%',
    height: '100%',
    display: 'table',
    '&$begin': {
      transition: `${IntroTransition}`,
    },
    '&$intro': {
      top: '100vh',
    },
  },
  beginButton: {
    color: 'white',
    opacity: '0.8',
    //background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': '2rem',
    padding: '2rem',
    'margin-top': '2rem',
    cursor: 'pointer',
    pointerEvents: 'auto',
  },
  hangUpButton: {
    width: '12vw',
    position: 'absolute',
    left: '85vw',
    bottom: '5vh',
    '& button': {
      height: '5.5rem',
      color: 'white',
      background: 'linear-gradient(to bottom, #ff6745 0%,#ff5745 51%,#ff4745 100%)',
      'border-radius': '7px',
      'border-width': '2px',
      'border-color': 'white',
      'font-size': '1.25em',
      padding: '1em',
      height: '100%',
      whiteSpace: 'no-wrap',
    },
  },
  hangUpButtonReally: {
    display: 'inline-block',
    position: 'absolute',
    left: 0,
    height: 'auto',
    bottom: '12vh',
    backgroundColor: 'white',
    color: 'red',
    borderRadius: '7px',
    borderWidth: '2px',
    borderColor: 'black',
    borderStyle: 'solid',
    padding: '0.5rem',
  },
  hangUpButtonReallyClose: {
    top: 0,
    right: 0,
    position: 'absolute',
    marginRight: '0.2rem',
    cursor: 'pointer',
  },
  finishButton: {
    width: '12vw',
    position: 'absolute',
    right: '25vw',
    top: '68vh',
    color: 'white',
    background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': '1.25em',
    padding: '1em',
    '&:disabled': {
      'text-decoration': 'none',
      background: 'lightgray',
    },
  },
  rerecordButton: {
    width: '12vw',
    position: 'absolute',
    left: '25vw',
    top: '68vh',
    color: 'white',
    background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': '1.25em',
    padding: '1em',
    '&:disabled': {
      'text-decoration': 'none',
      background: 'lightgray',
    },
  },
  talkative: {
    background: 'yellow',
  },
  title: {
    position: 'absolute',
    width: '100%',
    bottom: '0',
    'text-align': 'center',
    color: 'white',
    'font-weight': 'normal',
    'font-size': '2rem',
    'padding-top': '0.25rem',
    'padding-bottom': '0.25rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
    lineHeight: '3rem',
    '&span': {
      verticalAlign: 'middle',
    },
    '&$finishUp': {
      'font-size': '1%',
    },
    '&$stylesSet': {
      transition: `all ${TransitionTime}ms linear`,
    },
    '&$title-speaking': {
      bottom: 'calc( var( --speaking-height) - 3.5rem)',
    },
  },
  agenda: {
    position: 'absolute',
    '&$finishUp': {
      left: '50vw',
      top: '50vh',
      height: '1vh',
      width: '1vw',
      'font-size': '1%',
    },
    '&$stylesSet': {
      transition: `all ${TransitionTime}ms linear`,
    },
    '&$begin': {
      transition: `${IntroTransition}`,
    },
    '&$intro': {
      top: `calc( -1 * 25vw *  ${HDRatio} -${TopMargin})`,
      left: '100vw',
    },
  },
  thanks: {
    'font-size': '200%',
    'font-weight': '600',
    '&$scrollableIframe': {
      display: 'block',
      paddingTop: '0.5em',
      paddingBottom: '0.5em',
    },
  },
  'thanks-link': {
    'font-size': '150%',
  },
  begin: {
    transition: `${IntroTransition}`,
  },

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
  name: {
    fontSize: '1.25em',
  },
  counting: {},
  countdown: {
    display: 'none',
    position: 'absolute',
    color: 'yellow',
    fontSize: '2em',
    left: 'calc( 50vw - 1em)',
    top: '10vh',
    transition: '0.5s all linear',
    background: 'rgba(0,0,0,0)',
    '&$counting': {
      display: 'block',
    },
    '&$talkative': {
      left: 'calc( 50vw - 1em)',
      fontSize: '4em',
      background: 'rgba(128,128,128,0.7)',
    },
  },
  buttonBar: {
    //display: "table",
    opacity: '0.6',
    textAlign: 'center',
    position: 'absolute',
    width: '50vw',
    left: '25vw',
    top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
    height: '3.5vh',
    overflow: 'hidden',
    'text-overflow': 'clip',
    '& button': {
      display: 'inline-block',
      verticalAlign: 'top',
      height: '100%',
      width: '100%',
      fontSize: 'inherit',
      textAlign: 'center',
      '-webkit-appearance': 'none',
      // 'border-radius': "1px",
      backgroundColor: 'rgba(0, 0, 0, 0)',
      overflow: 'hidden',
      textOverflow: 'clip',
    },
  },
  recorderButtonBar: {
    //display: "table",
    position: 'absolute',
    width: '50vw',
    left: '25vw',
    top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
    height: '3.5vh',
    overflow: 'hidden',
    'text-overflow': 'clip',
    '& button': {
      display: 'inline-block',
      verticalAlign: 'middle',
      height: '100%',
      width: '100%',
      fontSize: 'inherit',
      textAlign: 'center',
      '-webkit-appearance': 'none',
      'border-radius': '1px',
      //'backgroundColor': 'lightgray',
      overflow: 'hidden',
      textOverflow: 'clip',
      color: 'white',
      background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
      'border-radius': '7px',
      'border-width': '2px',
      'border-color': 'white',
      'font-size': '1.25em',
      //'padding': '1em',
      '&:disabled': {
        'text-decoration': 'none',
        background: 'lightgray',
      },
    },
    '& div': {
      display: 'inline-block',
      verticalAlign: 'top',
      height: '100%',
      width: '100%',
      '-webkit-appearance': 'none',
      background: 'transparent',
    },
  },
  intro: {},
  note: {
    position: 'absolute',
    'background-color': 'lightyellow',
    top: 'calc( 50vh - (25vw / 2) )', // yes vh - vw because the box is square
    padding: '1em',
    width: '25vw',
    height: '25vw', // yes vw because it's supose to be square
    'box-shadow': `${ShadowBox}px ${ShadowBox}px ${ShadowBox}px grey`,
    //transform: 'rotate(-2deg)',
    //'font-family': 'Comic Sans MS',
    left: 'calc( 50vw - (25vw / 2))',
    'font-weight': '600',
    'font-size': '125%',
    display: 'table',
    transition: 'all .5s linear',
    '&$finishUp': {
      left: 'calc(100vw / 2)',
      top: `calc(((50vw + 15vw) *  ${HDRatio} + 5vh + 1.5vw + ${TopMargin}) / 2)`,
      height: '1vh',
      width: '1vw',
      'font-size': '1%',
    },
    '&$begin': {
      transition: `${IntroTransition}`,
    },
    '&$intro': {
      top: `calc( -100vh)`,
      left: '100vw',
    },
  },
  finishUp: {},
  stylesSet: {},
  stalledOverlay: {
    position: 'absolute',
    top: 0,
    display: 'none',
    backgroundColor: 'rgba(255,255,255,0.8)',
    '&$stalledNow': {
      display: 'table',
    },
    '& $stalledBox': {
      display: 'table-cell',
      verticalAlign: 'middle',
      textAlign: 'center',
    },
  },
  stalledNow: {},
  stalledBox: {},
  'title-speaking': {},
  'next-election-div': {
    top: 0,
    position: 'absolute',
    right: 0,
    height: '100vh',
    display: 'table',
    '&$portrait': {
      height: '98%',
    },
  },
  'previous-election-div': {
    top: 0,
    position: 'absolute',
    left: 0,
    height: '100vh',
    display: 'table',
    '&$portrait': {
      height: '98%',
    },
  },
  'election-inner-div': {
    display: 'table-cell',
    verticalAlign: 'middle',
    '&$portrait': {
      verticalAlign: 'bottom',
    },
  },
  'election-icon': {
    display: 'inline-block',
    verticalAlign: 'middle',
    cursor: 'pointer',
    pointerEvents: 'auto',
    border: 'none',
    background: 'transparent',
    padding: 0,
    '&$portrait': {
      verticalAlign: 'bottom',
    },
  },
  portrait: {},
}

class CandidateConversation extends React.Component {
  render() {
    return <RASPUndebate {...this.props} />
  }
}

class RASPUndebate extends React.Component {
  static onYouTubeIframeAPIReadyList = []
  retries = {}
  requestPermissionElements = []
  preFetchList = []
  youtubePlayers = []
  rerecord = false
  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      this.startTime = Date.now()
      if (window.env === 'development') this.rotateButton = true
    } else {
      if (process.env.NODE_ENV === 'development') this.rotateButton = true
    }
    //this.createDefaults();
    this.audio = React.createRef()
    this.getCamera = this.getCamera.bind(this)
    this.audioEnd = this.audioEnd.bind(this)
    this.calculatePositionAndStyle = this.calculatePositionAndStyle.bind(this)
    this.requestPermission = this.requestPermission.bind(this)
    this.beginButton = this.beginButton.bind(this)
    this.keyHandler = this.keyHandler.bind(this)
    this.hangup = this.hangup.bind(this)
    this.reallyHangup = this.reallyHangup.bind(this)
    if (typeof window !== 'undefined') window.onresize = this.onResize.bind(this)
    this.participants = {}
    if (typeof window !== 'undefined') {
      if (!supportsVideoType('webm')) {
        if (supportsVideoType('mp4')) this.forceMP4 = true
        else this.canNotRecordHere = true
      }
      if (props.participants.human) {
        if (typeof MediaRecorder === 'undefined') this.canNotRecordHere = true
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
        this.participants[participant] = {
          speakingObjectURLs: [],
          speakingImmediate: [],
          listeningObjectURL: null,
          listeningImmediate: false,
          placeholderUrl:
            (participant !== 'human' &&
              !youtube &&
              placeholder_image(
                this.props.participants[participant].listening || this.props.participants[participant].speaking[0]
              )) ||
            '',
          youtube,
          element: React.createRef(),
        }
        if (participant === 'human') {
          this.participants.human.speakingBlobs = []
        }
      })
    } else {
      this.participants = {}
    }
    this.numParticipants = Object.keys(this.props.participants).length
    this.seating = ['speaking', 'nextUp']
    this.seatToName = { speaking: 'Speaking', nextUp: 'Next Up' }
    for (let i = 2; i < this.numParticipants; i++) {
      this.seating.push('seat' + i)
      this.seatToName['seat' + i] = 'Seat ' + i
    }
    this.audioSets = {}
    this.newUser = !this.props.user // if there is no user at the beginning, then this is a new user - which should be precistant throughout the existence of this component
    if (typeof window !== 'undefined' && window.screen && window.screen.lockOrientation)
      window.screen.lockOrientation('landscape')
    if (typeof window !== 'undefined' && loadYoutube) {
      window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this)
      var tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      var firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }
    let fontSize, width, height

    if (this.props.browserConfig.type === 'bot') {
      // running on a bot
      width = 1200 //Facebook image post size: 1200 x 900
      height = 900
    } else {
      width = 1920
      height = 1080
    }
    // this is what we would do on the server, and it's what we need to do on the browser the first time
    fontSize = this.estimateFontSize(width, height)
    // we need to calculate the position of everything if/or as if rendered on the server. Then in componentDidMount we can calculate based on the real size.  This is because react.hydrate needs to be able to match the serverside and the browser side
    let calculatedStyles = this.calculateStyles(width, height, height, fontSize)
    Object.assign(this.state, calculatedStyles, { fontSize })

    this.nextSection = this.nextSection.bind(this)
    this.prevSection = this.prevSection.bind(this)
    this.autoNextSpeaker = this.autoNextSpeaker.bind(this)
  }

  state = {
    errorMsg: '',
    seatOffset: 0,
    round: 0,
    countDown: 0,
    moderatorReadyToStart: false,
    stylesSet: false,
    intro: false,
    begin: false,

    seatStyle: {
      speaking: {},
      nextUp: {},
      finishUp: {},
    },

    agendaStyle: {},
    buttonBarStyle: {
      width: '50vw',
      left: '25vw',
      top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
      height: 'auto',
      position: 'absolute',
      overflow: 'hidden',
      textOverflow: 'clip',
      cursor: 'pointer',
    },

    recorderButtonBarStyle: {
      width: '50vw',
      left: '25vw',
      top: `calc(50vw *  ${HDRatio} + 3.5vh + 3.5vh + 1.75vh)`,
      height: '3.5vh',
      position: 'absolute',
      overflow: 'hidden',
      textOverflow: 'clip',
    },

    introSeatStyle: {
      speaking: {
        top: `-30vw`,
      },
      nextUp: {
        left: '-20vw',
      },
      seat2: {
        left: '-20vw',
      },
      seat3: {
        top: '100vw',
      },
      seat4: {
        top: '130vw',
      },
      seat5: {
        top: '150vw',
      },
      seat6: {
        top: '170vw',
      },
      seat7: {
        top: '190vw',
      },
      finishUp: {},

      agenda: {
        top: `calc( -1 * 25vw *  ${HDRatio} -${TopMargin})`,
        left: '100vw',
      },
      introLeft: {
        left: '-50vw',
      },
      introRight: {
        right: '-50vw',
      },
      introTopLeft: {
        top: '-50vh',
      },
      introTopRight: {
        top: '-50vh',
      },
    },

    introStyle: {
      introLeft: {
        //transition: `${IntroTransition}`,
        position: 'absolute',
        left: '0vw',
        top: '25vh',
        width: 'auto',
        height: '50vh',
      },
      introRight: {
        //transition: `${IntroTransition}`,
        position: 'absolute',
        right: '0vw',
        top: '25vh',
        width: 'auto',
        height: '50vh',
      },
      introTopLeft: {
        //transition: `${IntroTransition}`,
        position: 'absolute',
        left: '5vw',
        top: '0vh',
        width: '20vw',
        height: 'auto',
      },
      introTopRight: {
        //transition: `${IntroTransition}`,
        position: 'absolute',
        left: '70vw',
        top: '0vh',
        width: '20vw',
        height: 'auto',
      },
    },
  }

  getCamera(ref) {
    if (ref)
      // in olden days ref might be null
      this.camera = ref
  }

  componentDidMount() {
    if (this.startTime) {
      this.loadTime = Date.now() - this.startTime
      logger.trace('loadTime', this.loadTime)
      if (this.loadTime > 1000) this.setState({ slowInternet: true })
    }

    // first load the moderator's speaking part and the listening part for all the participants;
    if (this.canNotRecordHere) return // no reason to go further
    Object.keys(this.props.participants).forEach(participant => {
      if (participant === 'human') return
      this.preFetchObjectURL(participant, participant === 'moderator', 0)
    })
    this.preFetchObjectURL('moderator', false, 0) // then load the moderator's listening parts
    if (this.props.audio) this.preFetchAudio(this.props.audio)
    for (let i = 0; i < this.props.participants.moderator.speaking.length; i++) {
      // then load the rest of the speaking parts
      Object.keys(this.props.participants).forEach(participant => {
        if (participant === 'moderator' && i === 0) return // moderator's first speaking part was loaded first
        if (participant === 'human') return
        if (this.props.participants[participant].speaking[i]) this.preFetchObjectURL(participant, true, i)
      })
    }
  }

  onYouTubeIframeAPIReady() {
    const seatStyle = this.state.seatStyle
    const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    Object.keys(this.participants).forEach((participant, i) => {
      if (this.participants[participant].youtube) {
        const videoId = getYouTubeID(this.props.participants[participant].listening)
        logger.trace('CandidateConversation.onYouTubeIframeAPIReady new player for:', participant, videoId)
        try {
          this.participants[participant].youtubePlayer = new YT.Player('youtube-' + participant, {
            width: pxSeatStyleWidth(this.seat(i)),
            height: pxSeatStyleWidth(this.seat(i)) * HDRatio,
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
                logger.error('CandidateConversation.onYouTubeIframeAPIReady onError', participant, e.data)
              },
            },
          })
          logger.trace('CandidateConversation.onYouTubeIframeAPIReady new Player completed')
        } catch (error) {
          logger.error(
            'CandidateConversation.onYouTubeIframeAPIReady caught error on new YT.Player',
            error.name,
            error.message
          )
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
    let chair = this.seat(Object.keys(this.props.participants).indexOf(participant))
    if (event.data === YT.PlayerState.ENDED) {
      if (chair === 'speaking') this.autoNextSpeaker()
      else this.participants[participant].youtubePlayer.seekTo(0, false)
    }
  }

  componentWillUnmount() {
    if (this.keyEventListener) window.removeEventListener('keydown', this.keyHandler)
  }

  onResize() {
    setTimeout(this.calculatePositionAndStyle, TransitionTime) // have to wait out the transitions
  }

  // take control of the damn font size - set it in the body
  calcFontSize(width, height) {
    if (typeof window !== 'undefined')
      return parseFloat(getComputedStyle(document.getElementsByTagName('html')[0]).fontSize)
    else return this.estimateFontSize(width, height)
  }

  estimateFontSize(width, height) {
    return Math.max(width, height) * 0.01
  }

  // unlike traditional HTML, we calculate based on screen/viewport size so that everything fits on screen - like on a TV screen
  calculatePositionAndStyle(e) {
    if (e) this.topRef = e
    if (this.topRef) {
      if (!this.keyEventListener) {
        window.addEventListener('keydown', this.keyHandler)
        this.keyEventListener = true
      }

      let { x } = this.topRef.getBoundingClientRect()
      let height = window.innerHeight // on iOS the height of bounding Rect is larger than what's shown because of the address bar
      let width = window.innerWidth
      let maxerHeight = Math.max(height, window.screen.height) // this looks at the screen heigh which is different than the window/viewport - especially on desktop, and sometimes on smartphone
      const fontSize = this.calcFontSize(width, height)
      let calculatedStyles = this.calculateStyles(width, height, maxerHeight, fontSize)
      this.setState({ left: -x + 'px', fontSize, ...calculatedStyles })
    }
  }

  calculateStyles(width, height, maxerHeight, fontSize) {
    var seatStyle = cloneDeep(this.state.seatStyle)
    var agendaStyle = cloneDeep(this.state.agendaStyle)
    var buttonBarStyle = cloneDeep(this.state.buttonBarStyle)
    var recorderButtonBarStyle = cloneDeep(this.state.recorderButtonBarStyle)
    var introSeatStyle = cloneDeep(this.state.introSeatStyle)
    var introStyle = cloneDeep(this.state.introStyle)
    const titleHeight = 0 // the title is overlain the video window
    const innerTitleHeight = 3.5 * fontSize // title is 3.5rem high, it overlays the video window at the bottom
    var portraitMode = false
    if (width / height > 1) {
      let speakingWidthRatio = 0.65
      const speakingHeight = () => speakingWidthRatio * width * HDRatio
      let seatWidthRatio = 0.25
      const seatHeight = () => seatWidthRatio * width * HDRatio
      const navBarHeight = 0.06 * height
      const agendaMaxWidth = 32 * fontSize
      const vGap = fontSize
      const hGap = fontSize
      const numOfParticipants = Object.keys(this.props.participants).length - 1 // without the speaker

      let calcHeight = navBarHeight + vGap + seatHeight() + titleHeight + vGap + speakingHeight() + titleHeight + vGap
      if (calcHeight > height) {
        // if the window is really wide - squish the video height so it still fits
        let heightForVideo = height - navBarHeight - vGap - /*titleHeight -*/ vGap - vGap
        let calcHeightForVideo = seatHeight() + speakingHeight()
        seatWidthRatio = (seatWidthRatio * heightForVideo) / calcHeightForVideo
        speakingWidthRatio = (speakingWidthRatio * heightForVideo) / calcHeightForVideo
      }

      // seatStyle.speaking.left centers the speaker box and the agenda
      seatStyle.speaking.left =
        (width - speakingWidthRatio * width - titleHeight * (1 / HDRatio) - agendaMaxWidth - hGap) / 2
      seatStyle.speaking.width = speakingWidthRatio * width + titleHeight * (1 / HDRatio)
      seatStyle.speaking.top = navBarHeight + vGap + width * seatWidthRatio * HDRatio + vGap
      seatStyle.speaking['--speaking-height'] = speakingHeight() + 'px' // tell child div's what the speaking-height is
      introSeatStyle.speaking = { top: -(speakingWidthRatio * HDRatio * width + vGap + ShadowBox) }

      seatStyle.nextUp.left = hGap
      seatStyle.nextUp.top = navBarHeight + vGap
      seatStyle.nextUp.width = seatWidthRatio * width
      introSeatStyle.nextUp = { left: -(seatStyle.nextUp.left + seatWidthRatio * width + ShadowBox) }

      let seat = 2
      let seatTop = seatStyle.nextUp.top
      let seatLeft = hGap
      let seatHorizontalPitch = seatWidthRatio * width + hGap

      seatLeft += seatHorizontalPitch // skip over the nextUp

      if (numOfParticipants * (seatWidthRatio * width) + numOfParticipants * hGap < width) {
        seatLeft += (width - numOfParticipants * (seatWidthRatio * width) - (numOfParticipants - 1) * hGap) / 2 - hGap // centers all the seats without the nextUp speaker
        seatStyle.nextUp.left =
          (width - numOfParticipants * (seatWidthRatio * width) - (numOfParticipants - 1) * hGap) / 2 // offsets the nextUp from the left
      }

      // across the bottom
      let i = 0 // for calculating the intro
      while (seat <= this.numParticipants - 1) {
        // -1 because one is speaking
        // some will go off the screen
        if (!seatStyle['seat' + seat]) seatStyle['seat' + seat] = {}
        seatStyle['seat' + seat].top = seatTop
        seatStyle['seat' + seat].left = seatLeft
        seatStyle['seat' + seat].width = seatWidthRatio * width
        introSeatStyle['seat' + seat] = { top: maxerHeight + i * (seatWidthRatio * HDRatio * width + vGap) } // along the bottom, each seat is further away as you move to the right
        seatLeft += seatHorizontalPitch
        seat++
        i++
      }

      seatStyle.finishUp.left = 0.5 * width
      seatStyle.finishUp.top = ((0.5 + 0.15) * width * HDRatio + (0.05 + 0.015) * height + TopMargin) / 2
      seatStyle.finishUp.width = 0.1 * width

      agendaStyle.top = seatStyle.speaking.top
      agendaStyle.left = seatStyle.speaking.left + seatStyle.speaking.width + hGap
      agendaStyle.width = agendaMaxWidth //Math.min(width - agendaStyle.left - hGap, agendaMaxWidth)
      agendaStyle.height = seatStyle.speaking.width * HDRatio

      buttonBarStyle.width = seatStyle.speaking.width * 0.6
      buttonBarStyle.left = seatStyle.speaking.left + seatStyle.speaking.width * 0.2 // center it
      buttonBarStyle.top =
        fontSize +
        seatStyle.speaking.top +
        seatStyle.speaking.width * HDRatio -
        (buttonBarStyle.width / this.buttons.length) * 0.75 - // there are 5 buttons and they are essentially square
        2 * vGap
      recorderButtonBarStyle.left = seatStyle.speaking.left
      recorderButtonBarStyle.top = seatStyle.speaking.top + seatStyle.speaking.width * HDRatio + vGap
      recorderButtonBarStyle.width = seatStyle.speaking.width
      recorderButtonBarStyle.height = buttonBarStyle.height

      introStyle.introLeft.width = 'auto'
      introStyle.introLeft.height = '50vh'
      introSeatStyle.introLeft.left = '-50vw'

      introStyle.introRight.width = 'auto'
      introStyle.introRight.height = '50vh'
      introSeatStyle.introRight.right = '-50vw'
    } else {
      // portrait mode
      portraitMode = true
      const hGap = fontSize
      const vGap = fontSize
      let speakerLeftEdge = hGap
      let speakerRightEdge = hGap
      let speakingWidthRatio = (width - 2 * hGap) / width // as wide as the screen less gaps on edges
      const speakingWidth = () => speakingWidthRatio * width
      const speakingHeight = () => speakingWidthRatio * width * HDRatio
      const seatHorizontalPitch = () => seatWidthRatio * width + hGap
      let seatWidthRatio = 0.4
      const seatWidth = () => seatWidthRatio * width
      const seatHeight = () => seatWidthRatio * width * HDRatio
      const navBarHeight = 0.09 * height + 3 * fontSize + 2 * fontSize
      let rows = 2
      let seat = 1
      let rowLeftEdge = hGap

      const maxAgendaHeight = fontSize * 20
      const numOfParticipants = Object.keys(this.props.participants).length - 1 // without the speaker/moderator

      if (numOfParticipants * seatHorizontalPitch() - hGap <= width) rows = 1

      let calcHeight =
        navBarHeight +
        maxAgendaHeight +
        rows * seatHeight() +
        (rows + 1) * titleHeight +
        (rows + 2) * vGap +
        speakingHeight()
      if (calcHeight > height) {
        // if calcHeight is taller than height - squish the video height so it still fits
        let heightForVideo = height - navBarHeight - 6 * vGap - 3 * titleHeight - maxAgendaHeight
        let calcHeightForVideo = 2 * seatHeight() + speakingHeight()
        seatWidthRatio = (seatWidthRatio * heightForVideo) / calcHeightForVideo
        speakingWidthRatio = (speakingWidthRatio * heightForVideo) / calcHeightForVideo
        speakerRightEdge = speakerLeftEdge = (width - speakingWidth()) / 2 // it will be thiner than the width, so center it
      }

      // check on number of rows again - the size has shrunk so it might fit now.
      if (numOfParticipants * seatHorizontalPitch() <= width) rows = 1
      else {
        // if 2 rows, put nextup on the second row
        seat++
        seatStyle.nextUp.left = speakerLeftEdge
        seatStyle.nextUp.top = navBarHeight + vGap + (rows - 1) * (seatHeight() + titleHeight + vGap)
        seatStyle.nextUp.width = seatWidth()
        introSeatStyle.nextUp = { left: -(seatStyle.nextUp.left + seatWidth() + ShadowBox) }
      }

      let seatLeft = speakerLeftEdge

      let seatTop = navBarHeight + vGap
      //if (rows == 1) leftEdge += seatHorizontalPitch() // don't overwrite the nextup window if it's all on one line

      // across the bottom
      let i = 0 // for calculating the intro

      // figure out where to start the top line of participants
      let topLineParticipants = numOfParticipants % 2 ? (numOfParticipants + 1) / 2 : numOfParticipants / 2
      if (rows === 2 && numOfParticipants == 3) topLineParticipants = 1
      let topLineWidth = (rows === 1 ? numOfParticipants : topLineParticipants) * seatHorizontalPitch() - hGap
      if (topLineWidth <= width)
        // all the participants on the top line will fit
        seatLeft = (width - topLineWidth) / 2
      //if (topLineWidth + hGap > width)
      // un-center the topline if it is wider than the viewport
      else {
        seatLeft = hGap
        seatStyle.nextUp.left = hGap
      }
      // draw first row of seats across the top
      while (seat <= 1 + topLineParticipants) {
        let seatName = seat === 1 ? 'nextUp' : 'seat' + seat
        // one for the nextUp that's already placed
        // more seats across the top than the bottom
        // some will go off the screen
        if (!seatStyle[seatName]) seatStyle['seat' + seat] = {}
        seatStyle[seatName].top = seatTop //+ seatWidthRatio * width * HDRatio + titleHeight + hGap
        seatStyle[seatName].left = seatLeft
        seatStyle[seatName].width = seatWidth()
        introSeatStyle[seatName] = { top: maxerHeight + i * seatHorizontalPitch() } // along the bottom, each seat is further away as you move to the right
        seatLeft += seatHorizontalPitch()
        seat++
        i++
      }

      if (rows > 1) {
        if (seat === numOfParticipants && speakerLeftEdge + seatWidth() + hGap + seatWidth() + speakerRightEdge < width)
          // there's just one left and there would be space on the right, so put it on the right side of the bottom row
          seatLeft = width - seatWidth() - speakerRightEdge
        // put it on the right side
        else if ((numOfParticipants - seat + 2) * seatHorizontalPitch() + -vGap < width) {
          // if all of them would fit within width so center it
          let secondRowLeftEdge = (seatStyle['nextUp'].left =
            (width - ((numOfParticipants - seat + 2) * seatHorizontalPitch() - vGap)) / 2) // fixup the start of the nextup seat
          seatLeft = (numOfParticipants - seat + 1) * seatHorizontalPitch() + secondRowLeftEdge
        }
        // its wider than the display so line it up after the nextup window
        else seatLeft = (numOfParticipants - seat + 1) * seatHorizontalPitch() + seatStyle.nextUp.left

        while (seat <= numOfParticipants) {
          // some will go off the screen
          if (!seatStyle['seat' + seat]) seatStyle['seat' + seat] = {}
          seatStyle['seat' + seat].top = seatTop + seatWidthRatio * width * HDRatio + titleHeight + hGap
          seatStyle['seat' + seat].left = seatLeft
          seatStyle['seat' + seat].width = seatWidthRatio * width + titleHeight * (1 / HDRatio)
          introSeatStyle['seat' + seat] = { top: maxerHeight + i * (seatWidthRatio * HDRatio * width + vGap) } // along the bottom, each seat is further away as you move to the right
          seatLeft -= seatHorizontalPitch()
          seat++
          i++
        }
      }

      seatStyle.speaking.left = speakerLeftEdge
      seatStyle.speaking.top = navBarHeight + vGap + rows * (seatHeight() + titleHeight + vGap)
      seatStyle.speaking.width = speakingWidth()
      seatStyle.speaking['--speaking-height'] = speakingHeight() + 'px' // tell child div's what the speaking-height is
      introSeatStyle.speaking = { top: -(speakingWidthRatio * HDRatio * width + vGap + ShadowBox) }

      seatStyle.finishUp.left = 0.5 * width
      seatStyle.finishUp.top = 0.5 * height
      seatStyle.finishUp.width = 0.01 * width

      agendaStyle.top = seatStyle.speaking.top + seatStyle.speaking.width * HDRatio + vGap
      agendaStyle.left = seatStyle.speaking.left
      agendaStyle.width = seatStyle.speaking.width
      agendaStyle.height = Math.max(maxAgendaHeight, height - agendaStyle.top - vGap)

      introSeatStyle['agenda'] = { top: -(agendaStyle.top + agendaStyle.height + ShadowBox), left: width }

      buttonBarStyle.width = seatStyle.speaking.width * 0.6
      buttonBarStyle.left = seatStyle.speaking.left + seatStyle.speaking.width * 0.2 // center it
      buttonBarStyle.top =
        seatStyle.speaking.top +
        seatStyle.speaking.width * HDRatio -
        (buttonBarStyle.width / this.buttons.length) * 0.75 - // there are 5 buttons and they are essentially square
        1 * vGap
      recorderButtonBarStyle.left = seatStyle.speaking.left
      recorderButtonBarStyle.top = seatStyle.speaking.top + seatStyle.speaking.width * HDRatio + vGap
      recorderButtonBarStyle.width = seatStyle.speaking.width
      recorderButtonBarStyle.height = buttonBarStyle.height

      introStyle.introLeft.width = '25vw'
      introStyle.introLeft.height = 'auto'
      introSeatStyle.introLeft.left = '-50vw'

      introStyle.introRight.width = '25vw'
      introStyle.introRight.height = 'auto'
      introSeatStyle.introRight.right = '-50vw'
    }
    return {
      seatStyle,
      agendaStyle,
      buttonBarStyle,
      recorderButtonBarStyle,
      introSeatStyle,
      introStyle,
      titleHeight,
      portraitMode,
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
      this.participants.human.listeningBlob = blob
      this.participants.human.listeningObjectURL = URL.createObjectURL(blob)
    } else {
      this.participants.human.speakingBlobs[round] = blob
      this.participants.human.speakingObjectURLs[round] = URL.createObjectURL(blob)
    }
  }

  // for the given seatOffset and round, fetch the object, or start the media
  nextMediaState(part) {
    logger.trace(`nextMediaState part:${part}`)
    //if (part === 'human') return;
    // humans won't get here
    var { round } = this.state

    let speaking = this.seat(Object.keys(this.props.participants).indexOf(part)) === 'speaking'

    var objectURL
    if (speaking) {
      if (part === 'human') {
        if (this.participants.human && this.participants.human.speakingObjectURLs[round] && !this.rerecord) {
          objectURL = this.participants.human.speakingObjectURLs[round]
        } else {
          objectURL = 'cameraStream' // set it to something - but this.camera.cameraStream should really be used
        }
      } else if (!(objectURL = this.participants[part].speakingObjectURLs[round])) {
        this.participants[part].speakingImmediate[round] = true
        this.stallWatch(part)
        logger.error('CandidateConversation.nextMediaState need to do something about stallWatch with preFetch')
      }
    } else {
      if (part === 'human') objectURL = 'cameraStream'
      //set it to something - but this.camera.cameraStream should really be used
      else if (!(objectURL = this.participants[part].listeningObjectURL))
        if (this.props.participants[part].listening) {
          // listeningObject hasn't loaded yet
          this.participants[part].listeningImmediate = true
        } else {
          // there is no listening object
          return this.playObjectURL(part, '', speaking) // part is listening, but theres no video, for stopping of the currently playing video so the placeholder image can take over
        }
    }
    if (objectURL) this.playObjectURL(part, objectURL, speaking)
  }

  preFetchAudio(sets) {
    Object.keys(sets).forEach(set => {
      sets[set].url &&
        fetch(sets[set].url)
          .then(res => res.blob())
          .then(blob => {
            var objectURL = URL.createObjectURL(blob)
            this.audioSets[set] = Object.assign({}, sets[set], { objectURL })
          })
          .catch(err => {
            logger.error('preFetchAudio', sets[set].url, err.name, e.message)
          })
    })
  }

  audioEnd(e) {
    return
  }

  preFetchQueue = 0

  setExternalObjectURL(part, speaking, round) {
    if (speaking) this.participants[part].speakingObjectURLs[round] = this.props.participants[part].speaking[round]
    else {
      this.participants[part].listeningObjectURL = this.props.participants[part].listening
    }
    if (round == 0 && part === 'moderator') {
      this.setState({ moderatorReadyToStart: true })
    }
  }

  preFetchObjectURL(part, speaking, round) {
    if (!this.props.participants[part]) return // part may not exist in this debate

    if (true /*window.env!=='production' || this.participants[part].youtube */) {
      // in development, don'e prefetch the videos because they won't be cached by the browser and you'll end up consuming a lot of extra cloudinary bandwith, on youtube we can't prefetch
      logger.trace("CandidateConversation.preFetchObjectURl - in development we don't prefetch", part, speaking, round)
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
          'CandidateConversation.preFetchObjectURL fetch completed:',
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
        shiftPreFetchList()
        if (round == 0 && part === 'moderator') {
          logger.trace('moderatorReadyToStart')
          this.setState({ moderatorReadyToStart: true })
        }
      })
      .catch(err => {
        logger.error(
          'CandidateConversation.preFetchObjectURL fetch caught error',
          part,
          speaking,
          round,
          url,
          err.name,
          err.message
        )
        this.preFetchQueue = Math.max(this.preFetchQueue - 1, 0)
        this.setState({ preFetchQueue: this.preFetchQueue + this.preFetchQueue + this.preFetchList.length })
        let retries = this.retries[part + speaking + round] || 0
        if (retries < 3) {
          logger.trace('CandidateConversation.preFetchObjectURL retrying', retries, part, speaking, round, url)
          this.retries[part + speaking + round] = retries + 1
          this.preFetchList.push([part, speaking, round])
        } else {
          logger.error(
            'CandidateConversation.preFetchObjectURL retries exceeded, using external link',
            part,
            speaking,
            round,
            url
          )
          this.setExternalObjectURL(part, speaking, round)
        }
        shiftPreFetchList()
      })
  }

  async playObjectURL(part, objectURL, speaking) {
    if (!this.participants[part].element.current && !this.participants[part].youtubePlayer) return // we don't have a space for this participant
    logger.trace('playObjectURL part:', part, 'objectURL:', objectURL)
    if (this.participants[part].youtubePlayer) {
      this.participants[part].youtubePlayer.loadVideoById({ videoId: getYouTubeID(objectURL) })
      let chair = this.seat(Object.keys(this.props.participants).indexOf(part))
      if (chair !== 'speaking') this.participants[part].youtubePlayer.mute()
      else this.participants[part].youtubePlayer.unMute()
      if (this.participants[part].youtubePlayer.getPlayerState() !== YT.PlayerState.PLAYING)
        this.participants[part].youtubePlayer.playVideo()
    } else {
      let element = this.participants[part].element.current
      if (element.src === objectURL) {
        return // don't change it.
      }
      //element.src=null;
      if (part === 'human' && !speaking) {
        // human is not speaking
        if (element.srcObject === this.camera.cameraStream) {
          if (element.muted && element.loop) return
          element.muted = true
          element.loop = true
        } else {
          element.src = ''
          element.muted = true
          element.loop = true
          element.srcObject = this.camera.cameraStream // objectURL should be camera
        }
        return // not need to play - source is a stream
      } else if (
        part === 'human' &&
        speaking &&
        (!this.participants.human.speakingObjectURLs[this.state.round] || this.rerecord)
      ) {
        // human is speaking (not playing back what was spoken)
        element.src = ''
        element.srcObject = this.camera.cameraStream // objectURL should be camera
        element.muted = true
        element.loop = false
        return // no need to play source is a stream
      } else if (part === 'human' && speaking && this.participants.human.speakingObjectURLs[this.state.round]) {
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
          if (element.loop && element.autoplay && element.muted) return // safari generates this error but plays anyway - chome does not generate an error
          this.requestPermissionElements.push(element)
          if (!this.state.requestPermission) this.setState({ requestPermission: true })
        } else {
          logger.error('CandidateConversation.playObjectURL caught error', err.name, err)
        }
      }
    }
  }

  async playAudioObject(part, obj, onended) {
    if (!this.audio.current) return // we don't have a space for this participant
    logger.trace('playAudioObject part:', part, 'obj:', obj)
    let element = this.audio.current
    element.src = ''
    element.src = obj.objectURL
    element.volume = obj.volume || 1 // default is 1, some objects may set volume others not
    element.onended = onended
    try {
      await element.play()
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        logger.trace('playAudioObject caught NotAllowedError', part, obj, err)
        this.requestPermissionElements.push(element)
        if (!this.state.requestPermission) this.setState({ requestPermission: true })
      } else if (err.name === 'AbortError') {
        logger.trace('playAudioObject caught AbortError', part, obj, err)
        this.requestPermissionElements.push(element)
        if (!this.state.requestPermission) this.setState({ requestPermission: true })
      } else {
        logger.error('CandidateConversation.playAudioObject caught error', err.name, err)
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

  seat(i, seatOffset) {
    if (this.state.finishUp) return 'finishUp'
    if (typeof seatOffset === 'undefined') seatOffset = this.state.seatOffset
    return this.seating[(seatOffset + i) % this.numParticipants]
  }

  buttons = [
    {
      name: () => <IconPrevSection width="60%" height="auto" />,
      func: this.prevSection,
      title: () => 'Previous Question',
    },
    {
      name: () => <IconPrevSpeaker width="60%" height="auto" />,
      func: this.prevSpeaker,
      title: () => 'Previous Speaker',
    },
    {
      name: () =>
        this.state.allPaused ? <IconPlay width="75%" height="auto" /> : <IconPause width="75%" height="75%" />,
      func: this.allPause,
      title: () => (this.state.isRecording ? 'Stop' : this.state.allPaused ? 'Play' : 'Pause'),
    },
    { name: () => <IconSkipSpeaker width="60%" height="auto" />, func: this.nextSpeaker, title: () => 'Next Speaker' },
    {
      name: () => <IconNextSection width="60%" height="auto" />,
      func: this.nextSection,
      title: () => 'Next Question',
      disabled: () => this.participants.human && !this.participants.human.speakingObjectURLs[this.state.round],
    },
  ]

  recorderButtons = [
    { name: () => 'Redo', func: this.rerecordButton, title: () => 'Re-record' },
    { name: () => 'key1', func: null, title: () => '' }, // keyN because react keys have to have unigue names
    { name: () => 'key2', func: null, title: () => '' },
    { name: () => 'key3', func: null, title: () => '' },
    { name: () => 'Finished Speaking', func: this.finishedSpeaking, title: () => 'Done Speaking' },
  ]

  allPause() {
    if (!this.state.begin) {
      this.beginButton()
    } else if (!this.state.allPaused) {
      Object.keys(this.participants).forEach(participant => {
        if (this.participants[participant].element.current) this.participants[participant].element.current.pause()
        if (this.participants[participant].youtubePlayer) this.participants[participant].youtubePlayer.pauseVideo()
      })
      this.setState({ allPaused: true })
    } else {
      this.allPlay()
      this.setState({ allPaused: false })
    }
  }

  allStop() {
    Object.keys(this.participants).forEach(participant => {
      if (this.participants[participant].element.current) {
        this.participants[participant].element.current.pause()
        this.participants[participant].element.current.removeAttribute('src')
      }
    })
    if (this.audio && this.audio.current) {
      this.audio.current.pause()
      this.audio.current.removeAttribute('src')
    }
  }

  allPlay() {
    Object.keys(this.participants).forEach(async participant => {
      if (this.participants[participant].youtubePlayer) {
        if (this.participants[participant].youtubePlayer.getPlayerState() !== YT.PlayerState.PLAYING)
          this.participants[participant].youtubePlayer.playVideo()
      } else if (this.participants[participant].element.current) {
        if (
          this.participants[participant].element.current.src &&
          this.participants[participant].element.current.paused
        ) {
          // if no src it's just a placeholder - don't play it
          try {
            await this.participants[participant].element.current.play()
          } catch (err) {
            if (err.name === 'NotAllowedError') {
              this.requestPermissionElements.push(element)
              this.setState({ requestPermission: true })
            } else if (err.name === 'AbortError') {
              this.requestPermissionElements.push(element)
              this.setState({ requestPermission: true })
            } else {
              logger.error('CandidateConversation.play() for ', participant, 'caught error', err)
            }
          }
        }
      }
    })
  }

  /** this really helps explain round and seatOffset, example of  4 participants.  time increases as you go down.
   *  round  seatOffset
   *     0      0  Moderator is speaking
   *     0      3  First participant is speaking
   *     0      2  Second participant is speaking
   *     0      1  Third participant is speaking
   *     1      0  Moderator is speaking
   *     1      3  First participant is speaking
   *     1      2  Second participant is speaking
   *     1      1  Third participant is speaking
   *     2      0  Moderator is speaking
   */

  prevSection() {
    var { seatOffset, round } = this.state
    logger.info('CandidateConversation.prevSection', seatOffset, round)
    seatOffset = 0
    round -= 1
    if (round < 0) round = 0
    this.newOrder(seatOffset, round)
  }

  prevSpeaker() {
    var { seatOffset, round } = this.state
    logger.info('CandidateConversation.prevSpeaker', seatOffset, round)
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
    this.newOrder(seatOffset, round)
  }

  nextSection() {
    var { seatOffset, round } = this.state
    logger.info('CandidateConversation.nextSection', seatOffset, round)
    if (this.numParticipants === 1) {
      round += 1
      if (!this.props.participants.moderator.speaking[round]) return this.finished()
    } else {
      round += 1
      seatOffset = 0
      if (!this.props.participants.moderator.speaking[round]) return this.finished()
    }
    this.newOrder(seatOffset, round)
  }

  nextSpeaker() {
    var { seatOffset, round } = this.state
    logger.info('CandidateConversation.nextSpeaker', seatOffset, round)
    if (this.numParticipants === 1) {
      round += 1
      if (!this.props.participants.moderator.speaking[round]) return this.finished()
    } else {
      seatOffset -= 1
      if (seatOffset === 0) round += 1 // back to the moderator, switch to the next round
      if (seatOffset < 0) {
        if (this.props.participants.moderator.speaking[round + 1]) seatOffset = this.numParticipants - 1
        // moderator just finished, he moves to the back of the order
        else return this.finished()
      }
    }
    this.newOrder(seatOffset, round)
  }

  autoNextSpeaker() {
    var { seatOffset, round } = this.state
    logger.trace('CandidateConversation.autoNextSpeaker', seatOffset, round)
    if (this.numParticipants === 1) {
      round += 1
      if (!this.props.participants.moderator.speaking[round]) return this.finished()
    } else {
      seatOffset -= 1
      if (seatOffset === 0) round += 1 // back to the moderator, switch to the next round
      if (seatOffset < 0) {
        if (this.props.participants.moderator.speaking[round + 1]) seatOffset = this.numParticipants - 1
        // moderator just finished, he moves to the back of the order
        else return this.finished()
      }
    }
    this.newOrder(seatOffset, round)
  }

  finishedSpeaking() {
    // this is different than nextSpeaker to avoid the race condition that one might hit the finished speaking button just after the timeout and things have already advanced
    logger.info('CandidateConversation.finishedSpeaking')
    if (this.seat(Object.keys(this.props.participants).indexOf('human')) === 'speaking') return this.autoNextSpeaker()
  }

  // return the property of this.props.participants who is speaking now
  speakingNow() {
    const participantList = Object.keys(this.props.participants)
    return this.state.seatOffset ? participantList[participantList.length - this.state.seatOffset] : participantList[0]
  }

  rerecordButton() {
    logger.info('CandidateConversation.rerecordButton')
    this.camera && this.camera.stopRecording() // it might be recording when the user hit's rerecord
    this.rerecord = true
    const { seatOffset, round } = this.state
    this.newOrder(seatOffset, round)
  }

  newOrder(seatOffset, round) {
    this.clearStallWatch()
    this.stopCountDown()
    if (this.talkativeTimeout) {
      clearTimeout(this.talkativeTimeout)
      this.talkativeTimeout = 0
    }
    var followup = []
    Object.keys(this.props.participants).forEach((participant, i) => {
      let oldChair = this.seat(i)
      let newChair = this.seat(i, seatOffset)
      logger.trace('rotateOrder', round, seatOffset, participant, oldChair, newChair)
      if (participant === 'human') {
        const listeningRound =
          (this.props.participants.human.listening && this.props.participants.human.listening.round) || Infinity
        const listeningSeat =
          (this.props.participants.human.listening && this.props.participants.human.listening.seat) || 'seat2'
        // first see if recording needs to be turned off (do this first)
        if (oldChair === 'speaking' && newChair === 'speaking' && this.rerecord) {
          // the user is initiating a rerecord
        } else if (
          oldChair === 'speaking' &&
          (!this.participants.human.speakingObjectURLs[this.state.round] || this.rerecord)
        ) {
          // the oldChair and the old round
          this.rerecord = false
          this.camera && this.camera.stopRecording()
        } else if (oldChair === listeningSeat && this.state.round === listeningRound) {
          // the oldChair and the old round
          this.camera && this.camera.stopRecording()
        }
        // then see if it needs to be turned on - both might happen at the same transition
        if (newChair === listeningSeat && round === listeningRound) {
          followup.push(() => {
            if (listeningSeat === 'speaking') {
              // recording the listening segment from the speakers seat
              let limit =
                (this.props.participants.moderator.timeLimits && this.props.participants.moderator.timeLimits[round]) ||
                60
              this.startCountDown(limit, () => this.autoNextSpeaker())
            }
            this.nextMediaState(participant)
            this.camera.startRecording(blobs => this.saveRecordingToParticipants(false, round, blobs))
          })
        } else if (newChair === 'speaking') {
          if (this.participants.human.speakingObjectURLs[round] && !this.rerecord) {
            followup.push(() => this.nextMediaState(participant))
          } else {
            followup.push(() => {
              let limit =
                (this.props.participants.moderator.timeLimits && this.props.participants.moderator.timeLimits[round]) ||
                60
              this.startCountDown(limit, () => this.autoNextSpeaker())
              this.talkativeTimeout = setTimeout(() => this.setState({ talkative: true }), limit * 0.75 * 1000)
              this.nextMediaState(participant)
              this.camera.startRecording(blobs => this.saveRecordingToParticipants(true, round, blobs))
            })
          }
        } else {
          // human just watching
          followup.push(() => this.nextMediaState(participant))
        }
      } else if (oldChair === 'speaking' || newChair === 'speaking' || this.state.allPaused) {
        // will be speaking or need to start media again
        followup.push(() => this.nextMediaState(participant))
      } else {
        logger.trace('participant continue looping', participant)
      }
    })
    logger.trace('rotateOrder: ', seatOffset)

    this.setState({ seatOffset, round, talkative: false, allPaused: false }, () => {
      if (this.audioSets.transition) {
        this.playAudioObject('audio', this.audioSets.transition)
      }
      while (followup.length) followup.shift()()
    })
  }

  finished() {
    logger.info('CandidateConversation.finished')
    this.audioSets && this.audioSets.ending && this.playAudioObject('audio', this.audioSets.ending)
    setTimeout(() => {
      this.camera && this.camera.releaseCamera()
      this.setState({ done: true })
    }, 1.5 * TransitionTime)
    return this.setState({ finishUp: true })
  }

  hangup() {
    if (!this.state.totalSize_before_hangup) {
      let totalSize = 0
      for (let round = 0; round < this.participants.human.speakingBlobs.length; round++) {
        totalSize +=
          (this.participants.human.speakingBlobs[round] && this.participants.human.speakingBlobs[round].size) || 0
      }
      if (this.participants.human.listeningBlob) {
        totalSize += this.participants.human.listeningBlob.size
      }
      if (totalSize > 0) {
        return this.setState({ totalSize_before_hangup: totalSize })
      }
    }
    this.reallyHangup()
  }

  reallyHangup() {
    logger.info('CandidateConversation.reallyHangup')
    this.camera && this.camera.releaseCamera()
    this.allStop()
    return this.setState({ hungUp: true, done: true })
  }

  onUserLogin(info) {
    logger.info('CandidateConversation.onUserLogin')
    logger.trace('onUserLogin', info)
    const { userId } = info
    this.setState({ newUserId: userId })
  }

  onUserUpload() {
    logger.info('CandidateConversation.onUserUpload')
    logger.trace('onUserUpload', this.props)
    const userId = (this.props.user && this.props.user.id) || this.state.newUserId
    createParticipant(this.props, this.participants.human, userId, this.state.name, progressObj =>
      this.setState(progressObj)
    )
  }

  startCountDown(seconds, finishFunc) {
    if (this.recordTimeout) clearTimeout(this.recordTimeout)
    const counter = sec => {
      if (sec > 0) {
        this.recordTimeout = setTimeout(() => counter(sec - 1), 1000)
        this.setState({ countDown: sec - 1 })
      } else {
        this.recordTimeout = 0
        finishFunc && setTimeout(finishFunc) // called after timeout to avoid setState collisions
        if (this.state.countDown !== 0) this.setState({ countDown: 0 })
      }
    }
    this.recordTimeout = setTimeout(() => counter(seconds), TransitionTime) // can't call setState from here because it will collide with the setstate of the parent event handler
  }

  stopCountDown() {
    if (this.recordTimeout) {
      clearTimeout(this.recordTimeout)
      this.recordTimeout = 0
    }
    if (this.setState.countDown > 0) this.setState({ countDown: 0 })
  }

  onIntroEnd() {
    this.audio.current.onended = undefined
    this.setState({ begin: true }, () => {
      this.getCameraMedia()
    })
  }

  async getCameraMedia() {
    if (this.props.participants.human) {
      // if we have a human in this debate
      const constraints = {
        audio: {
          echoCancellation: { exact: true },
        },
        video: {
          width: 640,
          height: 360,
        },
      }
      logger.trace('Using media constraints:', constraints)

      try {
        await this.camera.getCameraStream(constraints)
        const listeningRound =
          (this.props.participants.human.listening && this.props.participants.human.listening.round) || Infinity
        const listeningSeat =
          (this.props.participants.human.listening && this.props.participants.human.listening.seat) || 'seat2'
        logger.trace('getUserMedia() got stream:', this.camera.cameraStream)
        //it will be set by nextMediaState this.human.current.src = stream;
        Object.keys(this.props.participants).forEach(part => this.nextMediaState(part))
        // special case where human is in seat2 initially - because seat2 is where we record their silence
        if (listeningRound === 0 && this.seat(Object.keys(this.props.participants).indexOf('human')) === listeningSeat)
          this.camera.startRecording(blobs => this.saveRecordingToParticipants(false, 0, blobs)) // listening is not speaking
      } catch (e) {
        logger.error('getCameraMedia', e.name, e.message)
      }
    } else {
      // if we don't have a human - kick off the players
      Object.keys(this.props.participants).forEach(part => this.nextMediaState(part))
    }
  }

  videoError(participant, e) {
    logger.error(
      'CandidateConversation.videoError ' + e.target.error.code + '; details: ' + e.target.error.message,
      participant
    )
    if (
      e.target.error.code === e.target.error.MEDIA_ERR_DECODE &&
      e.target.error.message.startsWith('PIPELINE_ERROR_DECODE')
    ) {
      // there is something wrong with the video we are trying to play
      if (this.seat(Object.keys(this.props.participants).indexOf(participant)) === 'speaking') {
        this.autoNextSpeaker() // skip to the next speaker
        logger.error(
          'CandidateConversation.videoError on speaker, skipping',
          e.target.error.message,
          this.participants[participant].element.current.src
        )
      } else {
        logger.error(
          'CandidateConversation.videoError on listener, ignoring',
          e.target.error.message,
          this.participants[participant].element.current.src
        )
      }
    } else {
      let chair = this.seat(Object.keys(this.props.participants).indexOf(participant))
      if (chair === 'speaking') this.autoNextSpeaker() // if error is on who's speaking skip to next speaker, else ignore the error
    }
  }

  // we have to check on the speaker's video periodically to see if it's stalled by checking if the currentTime is increasing
  // the video.stalled event just doesn't respond to all the situations, and it doesn't tell you when the stall has ended
  stallWatch(speaker) {
    if (this.participants[speaker].youtube) return

    if (this.participants[speaker].speakingImmediate[this.state.round] && this.stallWatchTimeout)
      // was called because preFetch hadn't completed when it was time to play
      return

    if (this.stallWatchTimeout) {
      logger.error('CandidateConversation.stallWatch called but timeout already set', this.stallWatchTimeout)
    }

    const element = this.participants[speaker].element.current
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
          logger.trace('CandidateConversation.stallWatch.stallWatchPlayed unstalled', speaker)
          this.setState({ stalled: false, waitingPercent: 0 })
        } else {
          element.pause()
          logger.trace('CandidateConversation.stallWatch.stallWatchPlayed paused', speaker)
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
          logger.error('CandidateConversation.stallWatch CurrentTime is Infinity') // it might be - so just come back again later
          this.stallWatchTimeout = setTimeout(updater, 250)
        } else if (currentTime >= duration) {
          if (this.state.stalled) {
            logger.trace('CandidateConversation.stallWatch unstalling on end', speaker)
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
            logger.trace('CandidateConversation.stallWatch stalled', speaker)
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
                  logger.error('CandidateConversation.stallWatch.updater caught error on play', err.name, err.message)
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
              logger.trace('CandidateConversation.stallWatch unstalled', speaker)
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

  keyHandler(e) {
    if (e) {
      if (
        this.participants.human &&
        this.seat(Object.keys(this.props.participants).indexOf('human')) === 'speaking' &&
        e.keyCode === 32 &&
        !this.state.done
      ) {
        // don't consume it if not human speaking
        e.preventDefault()
        this.finishedSpeaking()
      }
    }
  }

  beginButton(e) {
    logger.info('CandidateConversation.beginButton')
    if (this.audioSets && this.audioSets.intro) {
      this.setState({ intro: true, stylesSet: true }, () => {
        this.playAudioObject('audio', this.audioSets.intro, this.onIntroEnd.bind(this))
      })
    } else this.setState({ intro: true, stylesSet: true }, () => this.onIntroEnd())
  }

  render() {
    const { className, classes, opening = {}, closing = { thanks: 'Thank You' }, logo, donateButton } = this.props
    const {
      round,
      finishUp,
      done,
      begin,
      requestPermission,
      talkative,
      moderatorReadyToStart,
      intro,
      seatStyle,
      agendaStyle,
      buttonBarStyle,
      recorderButtonBarStyle,
      introSeatStyle,
      introStyle,
      stylesSet,
      titleHeight,
      portraitMode,
    } = this.state

    const getIntroStyle = name =>
      Object.assign({}, stylesSet && { transition: IntroTransition }, introStyle[name], intro && introSeatStyle[name])
    const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920

    //const scrollableIframe=done && !this.state.hungUp && closing.iframe && (!this.participants.human || (this.participants.human && this.state.uploadComplete));
    const scrollableIframe =
      (done &&
        !this.state.hungUp &&
        closing.iframe &&
        (!this.participants.human || (this.participants.human && this.state.uploadComplete))) ||
      (done && this.state.hungUp && closing.iframe && this.participants.human)

    const bot = this.props.browserConfig.type === 'bot'
    const noOverlay = true
    const Agenda = Object.keys(this.props.participants).some(
      participant => this.props.participants[participant].transcriptions
    )
      ? AgendaTranscript
      : AgendaNav

    if (this.canNotRecordHere || (this.camera && this.camera.canNotRecordHere)) {
      return (
        <div className={cx(classes['outerBox'], classes['beginBox'])}>
          <img style={getIntroStyle('introRight')} src="/assets/images/female_hands_mug.png" />
          <img style={getIntroStyle('introLeft')} src="/assets/images/male_hands_mug.png" />
          <img style={getIntroStyle('introTopLeft')} src="/assets/images/left_flowers.png" />
          <img style={getIntroStyle('introTopRight')} src="/assets/images/right_flowers.png" />
          <div className={classes['note']}>
            <div style={{ width: '100%', height: '100%', display: 'table' }}>
              <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
                <p style={{ fontSize: '150%' }}>We're still building this.</p>
                <p>Recording is not supported by this browser yet. Please try Chrome for now.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    const surveyForm = () =>
      (closing.iframe &&
        (!this.participants.human || (this.participants.human && (this.state.uploadComplete || this.state.hungUp))) && (
          <>
            <iframe
              src={closing.iframe.src}
              width={Math.min(closing.iframe.width, innerWidth)}
              height={closing.iframe.height}
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
            >
              Loading...
            </iframe>
            <span className={cx(classes['thanks'], scrollableIframe && classes['scrollableIframe'])}>
              <p>{closing.thanks}</p>
              <DonateButton
                url={
                  logo === 'undebate'
                    ? 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=H7XBVF5U2C9NJ&source=url'
                    : 'https://ballotpedia.org/Donate:_Candidate_Conversations'
                }
                {...donateButton}
              />
            </span>
          </>
        )) ||
      (closing.link &&
        (!this.participants.human || (this.participants.human && (this.state.uploadComplete || this.state.hungUp))) && (
          <div className={classes['thanks-link']}>
            <a href={closing.link.url} target={closing.link.target || '_self'}>
              {closing.link.name}
            </a>
          </div>
        ))

    const beginOverlay = () =>
      !begin &&
      !done && (
        <div className={cx(classes['outerBox'], classes['beginBox'])}>
          <div style={{ width: '100%', height: '100%', display: 'table' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
              <BeginButton onClick={this.beginButton} {...this.props.beginButton} />
            </div>
          </div>
          {/*<div style={{ width: '100%', height: '100%', display: 'table' }} >
                        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                        <button className={classes['beginButton']} onClick={this.beginButton}>Begin</button>
                        </div>
                    </div>*/}
        </div>
      )

    const waitingOnModeratorOverlay = () =>
      begin &&
      !moderatorReadyToStart && (
        <div className={cx(classes['outerBox'], classes['beginBox'])}>
          <div style={{ width: '100%', height: '100%', display: 'table', backgroundColor: 'rgba(255,255,255,0.8)' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
              <div>
                <span className={cx(classes['thanks'], scrollableIframe && classes['scrollableIframe'])}>
                  Waiting for the video to download before we begin.
                </span>
              </div>
              <div>
                <span className={cx(classes['thanks'], scrollableIframe && classes['scrollableIframe'])}>
                  {this.state.preFetchQueue}
                </span>
              </div>
            </div>
          </div>
        </div>
      )

    const permissionOverlay = () =>
      requestPermission && (
        <div className={cx(classes['outerBox'], classes['beginBox'])}>
          <div style={{ width: '100%', height: '100%', display: 'table', backgroundColor: 'rgba(255,255,255,0.5)' }}>
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

    const ending = () =>
      done &&
      !this.state.hungUp && (
        <React.Fragment>
          <div className={cx(classes['outerBox'], scrollableIframe && classes['scrollableIframe'])} key="ending">
            <div style={{ width: '100%', height: '100%', display: 'table' }}>
              <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
                <div className={cx(classes['thanks'], scrollableIframe && classes['scrollableIframe'])}>
                  <p>{closing.thanks}</p>
                  <DonateButton
                    url={
                      logo === 'undebate'
                        ? 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=H7XBVF5U2C9NJ&source=url'
                        : 'https://ballotpedia.org/Donate:_Candidate_Conversations'
                    }
                    {...donateButton}
                  />
                </div>
                {surveyForm()}
                {this.participants.human && !this.state.uploadComplete && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      {!this.props.bp_info || !this.props.bp_info.candidate_name ? (
                        <div>
                          <label>
                            Name
                            <Input
                              className={this.props.classes['name']}
                              block
                              medium
                              required
                              placeholder="Name"
                              ref="name"
                              name="name"
                              onChange={e => this.setState({ name: e.value })}
                            />
                          </label>
                          <span>This will be shown with your video</span>
                        </div>
                      ) : null}
                      {!this.newUser || this.state.newUserId ? (
                        <div>
                          <button className={classes['beginButton']} onClick={this.onUserUpload.bind(this)}>
                            Post
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ textAlign: 'center' }}>
                            <span>Join and your recorded videos will be uploaded and shared</span>
                          </div>
                          <div>
                            <Join
                              className={this.props.classes['join']}
                              userInfo={{ name: this.state.name }}
                              onChange={this.onUserLogin.bind(this)}
                            ></Join>
                          </div>
                        </>
                      )}
                      {this.state.progress && <div>{'uploading: ' + this.state.progress}</div>}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )

    const hungUp = () =>
      this.state.hungUp && (
        <div className={cx(classes['outerBox'], scrollableIframe && classes['scrollableIframe'])} key="hungUp">
          <div style={{ width: '100%', height: '100%', display: 'table' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
              <span className={cx(classes['thanks'], scrollableIframe && classes['scrollableIframe'])}>
                {closing.thanks}
              </span>
              {surveyForm()}
            </div>
          </div>
        </div>
      )

    let humanSpeaking = false

    function pxSeatStyleWidth(seat) {
      let width = seatStyle[seat].width
      if (typeof width === 'number') return width
      if (width.endsWith('vw')) return (parseFloat(width) * innerWidth) / 100
      return parseFloat(width)
    }

    var videoBox = (participant, i, seatStyle) => {
      if (!this.participants[participant].element) return null // we don't have room for this participant
      let chair = this.seat(i)
      let videoWidth = pxSeatStyleWidth(this.seat(i))
      let videoHeight = pxSeatStyleWidth(this.seat(i)) * HDRatio
      const speaking = this.seat(i) === 'speaking'
      if (participant === 'human' && speaking) humanSpeaking = true
      const style = seatStyle[chair] //noOverlay || bot || intro ? seatStyle[chair] : Object.assign({},seatStyle[chair],introSeatStyle[chair])
      let participant_name
      if (participant === 'human' && this.props.bp_info && this.props.bp_info.candidate_name)
        participant_name = this.props.bp_info.candidate_name
      else participant_name = this.props.participants[participant].name
      /*src={"https://www.youtube.com/embed/"+getYouTubeID(this.participants[participant].listeningObjectURL)+"?enablejsapi=1&autoplay=1&loop=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0"}*/
      // if (this.seat(i) === 'speaking') {
      // const titleStyle = this.state.titleSpeakerStyle
      // } else {
      // }

      return (
        <div
          style={style}
          className={cx(
            className,
            classes['box'],
            stylesSet && classes['stylesSet'],
            stylesSet && !intro && classes['intro'],
            stylesSet && !begin && classes['begin']
          )}
          key={participant}
        >
          {this.seat(i) === 'speaking' ? (
            <SocialShareBtn
              metaData={{
                path: this.props.path,
                subject: this.props.subject,
              }}
            />
          ) : null}
          <div
            style={{ width: videoWidth, height: videoHeight }}
            className={cx(
              className,
              classes['participantBackground'],
              stylesSet && classes['stylesSet'],
              stylesSet && !intro && classes['intro'],
              stylesSet && !begin && classes['begin']
            )}
          >
            <img
              style={{ transition: `all ${TransitionTime}ms linear`, height: videoHeight }}
              height={pxSeatStyleWidth('speaking') * HDRatio}
              width="auto"
              src={(this.participants[participant] && this.participants[participant].placeholderUrl) || undefined}
            ></img>
          </div>
          {bot ? null : participant !== 'human' && this.participants[participant].youtube ? (
            <div
              className={cx(
                className,
                classes['participant'],
                stylesSet && classes['stylesSet'],
                stylesSet && !intro && classes['intro'],
                stylesSet && !begin && classes['begin']
              )}
              style={{ fontSize: '8px', width: videoWidth, height: videoHeight }}
            >
              <div id={'youtube-' + participant} style={{ fontSize: '8px' }}></div>
            </div>
          ) : (
            <>
              <video
                className={cx(
                  className,
                  classes['participant'],
                  stylesSet && classes['stylesSet'],
                  stylesSet && !intro && classes['intro'],
                  stylesSet && !begin && classes['begin']
                )}
                ref={this.participants[participant].element}
                playsInline
                autoPlay={!bot}
                controls={false}
                onEnded={this.autoNextSpeaker}
                onError={this.videoError.bind(this, participant)}
                style={{ width: videoWidth, height: videoHeight }}
                key={participant + '-video'}
              ></video>
              <div
                className={cx(classes['stalledOverlay'], this.state.stalled === participant && classes['stalledNow'])}
                style={{ width: videoWidth, height: videoHeight }}
              >
                <div className={classes['stalledBox']}>
                  <p>Hmmmm... the Internet is slow here</p>
                  <p>{`${this.props.participants[participant].name} will be with us shortly`}</p>
                  <p>{`${this.state.waitingPercent}% complete`}</p>
                </div>
              </div>

              <div
                className={cx(
                  classes['title'],
                  speaking && classes['title-speaking'],
                  stylesSet && classes['stylesSet'],
                  finishUp && classes['finishUp']
                )}
              >
                <span>{participant_name}</span>
              </div>
            </>
          )}
        </div>
      )
    }

    const buttonBar = buttonBarStyle =>
      (bot || ((noOverlay || (begin && intro)) && !finishUp && !done)) && (
        <div style={buttonBarStyle} className={classes['buttonBar']} key="buttonBar">
          {this.buttons.map(button => (
            <div
              style={{ width: 100 / this.buttons.length + '%', display: 'inline-block', height: 'auto' }}
              title={button.title()}
              key={button.title()}
            >
              <div disabled={button.disabled && button.disabled()} onClick={button.func.bind(this)}>
                {button.name()}
              </div>
            </div>
          ))}
        </div>
      )

    const recorderButtonBar = recorderButtonBarStyle =>
      this.participants.human &&
      begin &&
      intro &&
      !finishUp &&
      !done && (
        <div style={recorderButtonBarStyle} className={classes['recorderButtonBar']} key="recorderButtonBar">
          {this.recorderButtons.map(button => (
            <div
              style={{ width: 100 / this.recorderButtons.length + '%', display: 'inline-block', height: '100%' }}
              key={button.title()}
              title={button.title()}
            >
              {button.func ? (
                <button disabled={!humanSpeaking} onClick={button.func.bind(this)}>
                  {button.name()}
                </button>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      )

    const hangupButton = () =>
      !this.state.hungUp &&
      this.participants.human && (
        <div className={classes['hangUpButton']}>
          <button
            onClick={this.hangup}
            key="hangup"
            title={
              (this.props.hangupButton && this.props.hangupButton.title) ||
              'Stop recording and delete all video stored in the browser.'
            }
          >
            {(this.props.hangupButton && this.props.hangupButton.name) || 'Hang Up'}
          </button>
          {this.state.totalSize_before_hangup && !this.state.uploadComplete ? (
            <div className={classes['hangUpButtonReally']}>
              {(this.props.hangupButton && this.props.hangupButton.question) ||
                'You have recorded video, did you really want to exit and delete it, rather than finish this and post it?'}
              <div
                className={classes['hangUpButtonReallyClose']}
                onClick={() => this.setState({ totalSize_before_hangup: 0 })}
              >
                x
              </div>
            </div>
          ) : null}
        </div>
      )

    const nextElection = () =>
      this.props.bp_info &&
      this.props.bp_info.nextElection && (
        <div className={cx(classes['next-election-div'], portraitMode && classes['portrait'])}>
          <div className={cx(classes['election-inner-div'], portraitMode && classes['portrait'])} title="Next Office">
            <button
              className={cx(classes['election-icon'], portraitMode && classes['portrait'])}
              onClick={() => (window.location = this.props.bp_info.nextElection)}
            >
              <Icon icon="chevron-right" size="4" name="next-section" />
            </button>
          </div>
        </div>
      )

    const previousElection = () =>
      this.props.bp_info &&
      this.props.bp_info.prevElection && (
        <div className={cx(classes['previous-election-div'], portraitMode && classes['portrait'])}>
          <div
            className={cx(classes['election-inner-div'], portraitMode && classes['portrait'])}
            title="Previous Office"
          >
            <button
              className={cx(classes['election-icon'], portraitMode && classes['portrait'])}
              onClick={() => (window.location = this.props.bp_info.prevElection)}
            >
              <Icon icon="chevron-left" size="4" name="previous-election" />
            </button>
          </div>
        </div>
      )
    var main = () =>
      !done && (
        <div>
          <ConversationHeader subject={this.props.subject} bp_info={this.props.bp_info} logo={logo} />
          <div className={classes['outerBox']}>
            {Object.keys(this.props.participants).map((participant, i) => videoBox(participant, i, seatStyle))}
            <Agenda
              className={cx(
                classes['agenda'],
                stylesSet && classes['stylesSet'],
                finishUp && classes['finishUp'],
                begin && classes['begin'],
                !intro && classes['intro']
              )}
              style={agendaStyle}
              agendaItem={this.props.participants.moderator.agenda[round]}
              transcript={
                this.props.participants[this.speakingNow()].transcriptions &&
                this.props.participants[this.speakingNow()].transcriptions[round]
              }
              element={this.participants[this.speakingNow()].element.current}
              prevSection={this.prevSection}
              nextSection={this.nextSection}
            />
          </div>
          <div
            className={cx(
              classes['countdown'],
              humanSpeaking &&
                (this.rerecord || !this.participants.human.speakingObjectURLs[round]) &&
                classes['counting'],
              talkative && classes['talkative']
            )}
          >
            {TimeFormat.fromS(Math.round(this.state.countDown), 'mm:ss')}
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <span>{this.state.errorMsg}</span>
          </div>
        </div>
      )

    return (
      <div className={cx(classes['wrapper'], scrollableIframe && classes['scrollableIframe'])}>
        {this.props.participants.human && <ReactCameraRecorder ref={this.getCamera} />}
        <section
          id="syn-ask-webrtc"
          key="began"
          className={cx(classes['innerWrapper'], scrollableIframe && classes['scrollableIframe'])}
          style={{ left: this.state.left }}
          ref={this.calculatePositionAndStyle}
        >
          <audio ref={this.audio} playsInline controls={false} onEnded={this.audioEnd} key="audio"></audio>
          {main()}
          {this.participants.human && !intro && !begin && !done && (
            <Preamble
              agreed={this.state.preambleAgreed}
              onClick={() => {
                logger.info('CandidateConversation preambleAgreed true')
                this.setState({ preambleAgreed: true })
                noOverlay && this.beginButton()
              }}
            />
          )}
          {ending()}
          {((this.participants.human && this.state.preambleAgreed) || !this.participants.human) &&
            buttonBar(buttonBarStyle)}
          {recorderButtonBar(recorderButtonBarStyle)}
          {((this.participants.human && this.state.preambleAgreed) || !this.participants.human) &&
            !bot &&
            beginOverlay()}
          {permissionOverlay()}
          {waitingOnModeratorOverlay()}
          {hangupButton()}
          {hungUp()}
          {nextElection()}
          {previousElection()}
        </section>
      </div>
    )
  }
}

export default injectSheet(styles)(CandidateConversation)
