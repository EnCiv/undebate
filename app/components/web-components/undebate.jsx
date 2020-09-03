'use strict'

import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'
import Join from '../join'
import Input from '../lib/input'
import SocialShareBtn from '../lib/socialShareBtn'
import { AuthForm } from '../auth-form/index'

import TimeFormat from 'hh-mm-ss'
import cloneDeep from 'lodash/cloneDeep'
import getYouTubeID from 'get-youtube-id'
import CandidatePreamble from '../candidate-preamble'
import Config from '../../../public.json'

const ResolutionToFontSizeTable = require('../../../resolution-to-font-size-table').default

const TransitionTime = 500
const TopMargin = 0
const IntroTransition = 'all 5s ease'
const HDRatio = 1080 / 1920 //0.5625
const ShadowBox = 10

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'

import IconPrevSpeaker from '../../svgr/icon-prev-speaker'
import IconPrevSection from '../../svgr/icon-prev-session'
import IconPlay from '../../svgr/icon-play'
import IconPause from '../../svgr/icon-pause'
import IconStop from '../../svgr/icon-stop'
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
import Modal from './Modal'
import Icon from '../lib/icon'

function promiseSleep(time) {
  return new Promise((ok, ko) => setTimeout(ok, time))
}

const styles = {
  conversationTopic: {
    fontSize: '150%',
    fontWeight: 'bold',
    position: 'absolute',
    top: '0',
    left: '0',
    marginTop: '0px',
    //'transition': "all 5s ease"
  },
  conversationTopicContent: {
    width: '100vw',
    textAlign: 'center',
    margin: '1rem 0 1rem 0',
  },
  logo: {
    marginRight: '0.2rem',
    marginTop: '0.2rem',
    height: '6vh',
    float: 'right',
  },
  scrollableIframe: {},
  wrapper: {
    width: '100vw',
    height: '100vh',
    '&$scrollableIframe': {
      height: 'auto',
    },
    pointerEvents: 'none', // warning - nothing is going to get clicked on unless it sets pointer-events to auto
    // now turn on pointer events for all these things
    '& button': {
      pointerEvents: 'auto',
    },
    '& i': {
      pointerEvents: 'auto',
    },
    '& img': {
      pointerEvents: 'auto',
    },
    '& svg': {
      pointerEvents: 'auto',
    },
    '& input': {
      pointerEvents: 'auto',
    },
    '& a': {
      pointerEvents: 'auto',
    },
  },
  innerWrapper: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url(/assets/images/marble_table_top.png)',
    backgroundSize: 'cover',
    overflow: 'hidden',
    fontFamily: "'Montserrat', sans-serif",
    '&$scrollableIframe': {
      height: 'auto',
      pointerEvents: 'all',
      '& button': {
        cursor: 'pointer',
      },
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
    fontFamily: "'Montserrat', sans-serif",
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
    backgroundColor: '#dbdfe0', // this color is taken to match the the background image if you change the image, you should re-evaluate this color
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
    'box-shadow': `${ShadowBox}px ${ShadowBox}px ${ShadowBox}px gray`,
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
    cursor: 'pointer',
    color: 'white',
    background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': '1.25em',
    padding: '1em',
    'margin-top': '1em',
    '&:disabled': {
      'text-decoration': 'none',
      background: 'lightgray',
    },
  },
  hangUpButton: {
    width: '12vw',
    position: 'absolute',
    left: '85vw',
    bottom: '5vh',
    '& button': {
      cursor: 'pointer',
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
    cursor: 'pointer',
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
    pointerEvents: 'auto',
  },
  finishButton: {
    cursor: 'pointer',
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
  talkative: {
    background: 'yellow',
  },
  warmup: {},
  videoFoot: {
    'text-align': 'center',
    color: '#404',
    'font-weight': '600',
    'font-size': '100%',
    'background-color': 'white',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
    '&$finishUp': {
      'font-size': '1%',
    },
    '&$stylesSet': {
      transition: `all ${TransitionTime}ms linear`,
    },
  },
  agenda: {
    position: 'absolute',
    'background-color': 'white',
    padding: '1em',
    'box-shadow': `${ShadowBox}px ${ShadowBox}px ${ShadowBox}px grey`,
    'box-sizing': 'border-box',
    //transform: 'rotate(-2deg)',
    //'font-family': 'Comic Sans MS',
    'font-weight': '600',
    display: 'table',
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
  innerAgenda: {
    'vertical-align': 'middle',
    display: 'table-cell',
  },
  agendaTitle: {
    'font-size': '125%',
  },
  agendaItem: {
    'font-weight': '200',
    'list-style-type': 'none',
    'padding-left': '1em',
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
    fontSize: '1.25rem',
    'button&': {
      fontSize: '2rem',
      cursor: 'pointer',
      'margin-left': '1em',

      padding: '1em',
      'border-radius': '.25em',
      border: 'white solid 1px',
      '&:disabled': {
        'text-decoration': 'none',
        background: 'lightgray',
        cursor: 'default',
      },
    },
    'button[name=Join]&': {
      backgroundColor: '#00ff7f',
    },
    'a&': {
      'margin-right': '0.25em',
    },
    'i&': {
      'margin-right': 0,
    },
    'input&': {
      fontsize: '2rem',
    },
  },
  name: {
    fontSize: '1.25em',
    width: '11em',
    height: '1em',
    textAlign: 'center',
  },

  subOpening: {
    //'font-size': "0.84rem",
    'font-weight': '100',
    lineHeight: '150%',
    'margin-bottom': '1rem',
  },
  opening: {
    //'font-size': "1.5rem",
    //'font-weight': '600',
    lineHeight: '150%',
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
    '&$warmup': {
      color: 'lime',
    },
  },
  buttonBar: {
    //display: "table",
    textAlign: 'center',
    position: 'absolute',
    width: '50vw',
    left: '25vw',
    top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
    height: '3.5vh',
    overflow: 'hidden',
    'text-overflow': 'clip',
    '& button': {
      pointer: 'cursor',
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
    cursor: 'pointer',
    position: 'absolute',
    width: '50vw',
    left: '25vw',
    top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
    height: '3.5vh',
    overflow: 'hidden',
    'text-overflow': 'clip',
    border: 'none',
    backgroundColor: 'transparent',
    '& button': {
      cursor: 'pointer',
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
        cursor: 'default',
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
    top: 'calc( ( 100vh - min( 50vw, 50vh)) / 2 )',
    padding: '1em',
    width: 'calc( min(50vw, 50vh) )',
    height: 'calc( min(50vw, 50vh) )',
    'box-shadow': `${ShadowBox}px ${ShadowBox}px ${ShadowBox}px grey`,
    left: 'calc( ( 100vw - min( 50vw, 50vh)) / 2 )',
    'font-weight': '600',
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
  'enciv-logo': {
    padding: '.25em',
    marginRight: '.25em',
    height: '3.5vh',
    float: 'right',
    paddingTop: '.3em',
  },
  instructionLink: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1rem 0 0 1rem',
  },
  instructionIcon: {
    fontSize: '3rem',
    color: 'gray',
  },
  recordingPlaceholderBar: {
    position: 'absolute',
    width: '100%',
    top: 0,
    textAlign: 'center',
    '& button': {
      display: 'inline-block',
      border: '1px solid gray',
      padding: '.5rem',
      backgroundColor: 'lightgreen',
      fontSize: '2rem',
      fontWeight: 'bolder',
    },
  },
  reviewing: {
    '& button': {
      background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
    },
  },
  reviewIt: {
    marginBottom: '2em',
  },
}

class Undebate extends React.Component {
  static onYouTubeIframeAPIReadyList = []
  retries = {}
  requestPermissionElements = []
  preFetchList = []
  youtubePlayers = []
  uploadStarted = false
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
    if (typeof window !== 'undefined') this.calcFontSize()
    else {
      // we need to calculate the position of everything if rendered on the server, based on some size.
      let width, height
      if (this.props.browserConfig.type === 'bot') {
        // running on a bot
        width = 1200 //Facebook image post size: 1200 x 900
        height = 900
        let fontSize = this.estimateFontSize(width, height)
        let calculatedStyles = this.calculateStyles(width, height, height, fontSize)
        Object.assign(this.state, calculatedStyles, { fontSize })
      }
    }
    this.noOverlay = true
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
    allPaused: true, // so the play button shows
    warmup: false,
    isRecording: false,
    isPortraitPhoneRecording: false,

    seatStyle: {
      speaking: {
        left: 'calc(2.5vw + 20vw + 2.5vw)',
        top: `${TopMargin}`,
        width: '50vw',
      },
      nextUp: {
        left: '2.5vw',
        top: `calc( (50vw - 20vw) *  ${HDRatio} + ${TopMargin})`,
        width: '20vw',
      },
      seat2: {
        left: 'calc(1.25vw)',
        top: `calc(50vw *  ${HDRatio} + 5vh + ${TopMargin})`,
        width: '15vw',
      },
      seat3: {
        left: 'calc(1.25vw + 15vw + 1.25vw)',
        top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
        width: '15vw',
      },
      seat4: {
        left: 'calc(1.25vw + 15vw + 1.25vw + 15vw + 1.25vw)',
        top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
        width: '15vw',
      },
      seat5: {
        left: 'calc(3 * (1.25vw + 15vw) + 1.25vw)',
        top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
        width: '15vw',
      },
      seat6: {
        left: 'calc(4 * (1.25vw + 15vw) + 1.25vw)',
        top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
        width: '15vw',
      },
      seat7: {
        left: 'calc(5 * (1.25vw + 15vw) + 1.25vw)',
        top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
        width: '15vw',
      },
      finishUp: {
        left: 'calc(100vw / 2)',
        top: `calc(((50vw + 15vw) *  ${HDRatio} + 5vh + 1.5vw + ${TopMargin}) / 2)`,
        width: '1vw',
      },
    },

    conversationTopic: {
      top: `${TopMargin}`,
    },

    agendaStyle: {
      top: '8vh',
      width: '17.5vw',
      height: '17.5vw',
      left: 'calc(2.5vw + 20vw + 2.5vw + 50vw + 2.5vw)',
    },

    buttonBarStyle: {
      width: '50vw',
      left: '25vw',
      top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
      height: '3.5vh',
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
      conversationTopic: {
        top: '-32vw',
      },
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
        logger.trace('Undebate.onYouTubeIframeAPIReady new player for:', participant, videoId)
        try {
          this.participants[participant].youtubePlayer = new YT.Player('youtube-' + participant, {
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
  calcFontSize() {
    let body = document.getElementsByTagName('body')[0]
    let key =
      Math.max(window.screen.width, window.screen.height) +
      'x' +
      Math.min(window.screen.width, window.screen.height) +
      'x' +
      window.devicePixelRatio
    let newFontSize = 0
    if (typeof ResolutionToFontSizeTable[key] === 'number') {
      newFontSize = ResolutionToFontSizeTable[key]
    } else {
      logger.trace('Undebate.calcFontSize not found', this.props.browserConfig.type, key, navigator.userAgent)
    }

    if (!newFontSize) {
      const fontSize = parseFloat(getComputedStyle(body).fontSize)
      let width = window.innerWidth
      let height = window.innerHeight
      newFontSize = this.estimateFontSize(width, height)
    }
    body.style.fontSize = newFontSize + 'px'
    return newFontSize
  }

  estimateFontSize(width, height) {
    let newFontSize
    if (width / height > 1) {
      newFontSize = height / 42 //lines vertically - determined experimentally
      logger.trace('Undebate FontSize:', width, height, newFontSize)
    } else {
      newFontSize = height / 64 // lines vertically - determined experimentally
      logger.trace('Undebate FontSize:', width, height, newFontSize)
    }
    return newFontSize
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
      const fontSize = this.calcFontSize()
      let calculatedStyles = this.calculateStyles(width, height, maxerHeight, fontSize)
      this.setState({ left: -x + 'px', fontSize, ...calculatedStyles })
    }
    this.preventPortraitRecording()
  }

  calculateStyles(width, height, maxerHeight, fontSize) {
    var seatStyle = cloneDeep(this.state.seatStyle)
    var agendaStyle = cloneDeep(this.state.agendaStyle)
    var buttonBarStyle = cloneDeep(this.state.buttonBarStyle)
    var recorderButtonBarStyle = cloneDeep(this.state.recorderButtonBarStyle)
    var introSeatStyle = cloneDeep(this.state.introSeatStyle)
    var introStyle = cloneDeep(this.state.introStyle)
    var conversationTopicStyle = cloneDeep(this.state.conversationTopicStyle)
    if (width / height > 0.8) {
      // landscape mode
      if (width / height > 1.8) {
        // it's very long and short like a note 8

        const speakingWidthRatio = (height * 0.4) / HDRatio / width
        const nextUpWidthRatio = speakingWidthRatio * 0.5
        const seatWidthRatio = speakingWidthRatio * 0.5
        const verticalSeatSpaceRatio = 0.025
        const horizontalSeatSpaceRatio = 0.025
        const navBarHeightRatio = 0.11

        const verticalSeatSpace = Math.max(verticalSeatSpaceRatio * height, 2.5 * fontSize)
        const horizontalSeatSpace = horizontalSeatSpaceRatio * width

        seatStyle.speaking.left = ((1 - speakingWidthRatio) * width) / 2 /// centered
        seatStyle.speaking.top = navBarHeightRatio * height // TopMargin;
        seatStyle.speaking.width = speakingWidthRatio * 100 + 'vw'
        introSeatStyle.speaking = { top: -(speakingWidthRatio * HDRatio * width + verticalSeatSpace + ShadowBox) }

        seatStyle.nextUp.top =
          speakingWidthRatio * HDRatio * width - nextUpWidthRatio * HDRatio * width - verticalSeatSpace
        seatStyle.nextUp.width = nextUpWidthRatio * 100 + 'vw'
        seatStyle.nextUp.left = (seatStyle.speaking.left - nextUpWidthRatio * width) / 2 // depends on width
        introSeatStyle.nextUp = { left: -(seatStyle.nextUp.left + nextUpWidthRatio * width + ShadowBox) }

        let seat = 2

        let seatTop = seatStyle.nextUp.top + nextUpWidthRatio * HDRatio * width + verticalSeatSpace
        let seatVerticalPitch = seatWidthRatio * HDRatio * width + verticalSeatSpace
        let seatLeft = seatStyle.nextUp.left //Math.min(seatStyle.nextUp.left, horizontalSeatSpace)

        // down the left side
        while (seatTop + seatVerticalPitch < height && seat <= 7) {
          seatStyle['seat' + seat].top = seatTop
          seatStyle['seat' + seat].left = seatLeft
          seatStyle['seat' + seat].width = seatWidthRatio * 100 + 'vw'
          introSeatStyle['seat' + seat] = { left: -(seatWidthRatio * width + horizontalSeatSpace + ShadowBox) }
          seatTop += seatVerticalPitch
          seat++
        }

        seatTop = height - seatWidthRatio * HDRatio * width - verticalSeatSpace
        seatLeft += seatWidthRatio * width + horizontalSeatSpace
        let seatHorizontalPitch = seatWidthRatio * width + horizontalSeatSpace
        // across the bottom
        let i = 0 // for calcula`ting the intro
        while (seat <= 7) {
          // some will go off the screen
          seatStyle['seat' + seat].top = seatTop
          seatStyle['seat' + seat].left = seatLeft
          seatStyle['seat' + seat].width = seatWidthRatio * 100 + 'vw'
          introSeatStyle['seat' + seat] = {
            top: maxerHeight + i * (seatWidthRatio * HDRatio * width + verticalSeatSpace),
          } // along the bottom, each seat is further away as you move to the right
          seatLeft += seatHorizontalPitch
          seat++
          i++
        }

        seatStyle.finishUp.left = 0.5 * width
        seatStyle.finishUp.top = 0.5 * height
        seatStyle.finishUp.width = '1vw'

        agendaStyle.top = navBarHeightRatio * height //speakingWidthRatio * HDRatio * width * 0.10;
        agendaStyle.left = seatStyle.speaking.left + speakingWidthRatio * width + 2 * horizontalSeatSpace // 2 because it's rotated
        //agendaStyle.height=speakingWidthRatio * HDRatio * width * 0.8;

        agendaStyle.width = Math.max(speakingWidthRatio * HDRatio * width * 0.8, 20 * fontSize)
        if (agendaStyle.left + agendaStyle.width > width)
          agendaStyle.width = width - agendaStyle.left - 2 * horizontalSeatSpace
        agendaStyle.height = agendaStyle.width

        introSeatStyle['agenda'] = { top: -(agendaStyle.top + agendaStyle.height + ShadowBox), left: width }

        buttonBarStyle.left = seatStyle.speaking.left + speakingWidthRatio * width * 0.25
        buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1.1
        buttonBarStyle.width = seatStyle.nextUp.width
        buttonBarStyle.height = Math.max(0.05 * height, 4 * fontSize)

        recorderButtonBarStyle.left = seatStyle.speaking.left
        recorderButtonBarStyle.top = buttonBarStyle.top + buttonBarStyle.height * 1.25
        recorderButtonBarStyle.width = seatStyle.speaking.width
        recorderButtonBarStyle.height = buttonBarStyle.height

        introStyle.introLeft.width = 'auto'
        introStyle.introLeft.height = '25vh'
        introStyle.introLeft.top = (100 - 25) / 2 + 'vh' // center vertically
        introSeatStyle.introLeft.left = '-50vw'

        introStyle.introRight.width = 'auto'
        introStyle.introRight.height = '25vh'
        introSeatStyle.introRight.right = '-50vw'
        introStyle.introRight.top = (100 - 25) / 2 + 'vh' // center vertically
      } else {
        const speakingWidthRatio = 0.5
        const nextUpWidthRatio = 0.2
        const seatWidthRatio = 0.2
        const verticalSeatSpaceRatio = 0.05
        const horizontalSeatSpaceRatio = 0.0125
        const navBarHeightRatio = 0.08

        const verticalSeatSpace = Math.max(verticalSeatSpaceRatio * height, 3 * fontSize)
        const horizontalSeatSpace = Math.max(horizontalSeatSpaceRatio * width, fontSize)

        seatStyle.speaking.left = ((2.5 + 20 + 2.5) / 100) * width
        seatStyle.speaking.top = navBarHeightRatio * height //TopMargin;
        seatStyle.speaking.width = speakingWidthRatio * 100 + 'vw'
        introSeatStyle.speaking = { top: -(speakingWidthRatio * HDRatio * width + verticalSeatSpace + ShadowBox) }

        seatStyle.nextUp.left = horizontalSeatSpace //(2.5 /100) * width;
        seatStyle.nextUp.top = TopMargin + speakingWidthRatio * HDRatio * width - nextUpWidthRatio * HDRatio * width
        seatStyle.nextUp.width = nextUpWidthRatio * 100 + 'vw'
        introSeatStyle.nextUp = { left: -(seatStyle.nextUp.left + nextUpWidthRatio * width + ShadowBox) }

        let seat = 2
        let seatTop = seatStyle.nextUp.top + nextUpWidthRatio * HDRatio * width + verticalSeatSpace
        let seatLeft = horizontalSeatSpace
        let seatHorizontalPitch = seatWidthRatio * width + horizontalSeatSpace
        let seatVerticalPitch = seatWidthRatio * HDRatio * width + verticalSeatSpace

        // down the left side
        while (seatTop + seatVerticalPitch < height && seat <= 7) {
          seatStyle['seat' + seat].top = seatTop
          seatStyle['seat' + seat].left = seatLeft
          seatStyle['seat' + seat].width = seatWidthRatio * 100 + 'vw'
          introSeatStyle['seat' + seat] = { left: -(seatWidthRatio * width + horizontalSeatSpace + ShadowBox) }
          seatTop += seatVerticalPitch
          seat++
        }

        seatTop = height - seatWidthRatio * HDRatio * width - verticalSeatSpace
        seatLeft += seatHorizontalPitch

        // across the bottom
        let i = 0 // for calculating the intro
        while (seat <= this.numParticipants - 1) {
          // some will go off the screen
          seatStyle['seat' + seat].top = seatTop
          seatStyle['seat' + seat].left = seatLeft
          seatStyle['seat' + seat].width = seatWidthRatio * 100 + 'vw'
          introSeatStyle['seat' + seat] = {
            top: maxerHeight + i * (seatWidthRatio * HDRatio * width + verticalSeatSpace),
          } // along the bottom, each seat is further away as you move to the right
          seatLeft += seatHorizontalPitch
          seat++
          i++
        }

        seatStyle.finishUp.left = 0.5 * width
        seatStyle.finishUp.top = ((0.5 + 0.15) * width * HDRatio + (0.05 + 0.015) * height + TopMargin) / 2
        seatStyle.finishUp.width = '1vw'

        agendaStyle.top = 0.08 * height
        agendaStyle.left = seatStyle.speaking.left + speakingWidthRatio * width + horizontalSeatSpace
        agendaStyle.width = Math.max(0.175 * width, 20 * fontSize)
        if (agendaStyle.left + agendaStyle.width > width)
          agendaStyle.width = width - agendaStyle.left - 2 * horizontalSeatSpace
        agendaStyle.height = Math.max(0.175 * width, 20 * fontSize)
        introSeatStyle['agenda'] = { top: -(agendaStyle.top + agendaStyle.height + ShadowBox), left: width }

        buttonBarStyle.width = speakingWidthRatio * 50 + 'vw'
        buttonBarStyle.left = seatStyle.speaking.left + speakingWidthRatio * width * 0.25
        // buttonBarStyle.top= speakingWidthRatio * HDRatio * width;
        if (width / height < 0.87) {
          buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1.18
        } else if (width / height < 1) {
          buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1.13
        } else if (width / height < 1.2) {
          buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1.08
        } else if (width / height < 1.4) {
          buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1.04
        } else if (width / height < 1.6) {
          buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1
        } else {
          buttonBarStyle.top = speakingWidthRatio * HDRatio * width
        }
        buttonBarStyle.height = Math.max(0.035 * height, 4 * fontSize)

        recorderButtonBarStyle.left = seatStyle.speaking.left
        recorderButtonBarStyle.top = buttonBarStyle.top + buttonBarStyle.height * 1.25
        recorderButtonBarStyle.width = seatStyle.speaking.width
        recorderButtonBarStyle.height = buttonBarStyle.height

        introStyle.introLeft.width = 'auto'
        introStyle.introLeft.height = '50vh'
        introSeatStyle.introLeft.left = '-50vw'

        introStyle.introRight.width = 'auto'
        introStyle.introRight.height = '50vh'
        introSeatStyle.introRight.right = '-50vw'
      }
    } else {
      // portrait mode
      const speakingWidthRatio = 0.95
      const nextUpWidthRatio = 0.25
      const seatWidthRatio = 0.25
      const verticalSeatSpaceRatio = 0.05
      const horizontalSeatSpaceRatio = 0.025
      const navBarHeightRatio = 0.11

      const verticalSeatSpace = Math.max(verticalSeatSpaceRatio * height, 3 * fontSize)
      const horizontalSeatSpace = Math.max(horizontalSeatSpaceRatio * width, fontSize)

      seatStyle.speaking.left = ((1 - speakingWidthRatio) * width) / 2 /// centered
      seatStyle.speaking.top = navBarHeightRatio * height //TopMargin;
      seatStyle.speaking.width = speakingWidthRatio * 100 + 'vw'
      introSeatStyle.speaking = { top: -(speakingWidthRatio * HDRatio * width + verticalSeatSpace + ShadowBox) }

      seatStyle.nextUp.left = horizontalSeatSpace
      seatStyle.nextUp.top = speakingWidthRatio * HDRatio * width + verticalSeatSpace + navBarHeightRatio * height
      seatStyle.nextUp.width = nextUpWidthRatio * 100 + 'vw'
      introSeatStyle.nextUp = { left: -(nextUpWidthRatio * width + horizontalSeatSpace + ShadowBox) }

      let seat = 2

      let seatTop = seatStyle.nextUp.top + nextUpWidthRatio * HDRatio * width + verticalSeatSpace
      let seatVerticalPitch = seatWidthRatio * HDRatio * width + verticalSeatSpace

      // down the left side
      while (seatTop + seatVerticalPitch < height && seat <= 7) {
        seatStyle['seat' + seat].top = seatTop
        seatStyle['seat' + seat].left = horizontalSeatSpace
        seatStyle['seat' + seat].width = seatWidthRatio * 100 + 'vw'
        introSeatStyle['seat' + seat] = { left: -(seatWidthRatio * width + horizontalSeatSpace + ShadowBox) }
        seatTop += seatVerticalPitch
        seat++
      }

      seatTop = height - seatWidthRatio * HDRatio * width - verticalSeatSpace
      let seatLeft = horizontalSeatSpace + seatWidthRatio * width + horizontalSeatSpace
      let seatHorizontalPitch = seatWidthRatio * width + horizontalSeatSpace
      // across the bottom
      let i = 0 // for calculating the intro
      while (seat <= this.numParticipants - 1) {
        // some will go off the screen
        seatStyle['seat' + seat].top = seatTop
        seatStyle['seat' + seat].left = seatLeft
        seatStyle['seat' + seat].width = seatWidthRatio * 100 + 'vw'
        introSeatStyle['seat' + seat] = {
          top: maxerHeight + i * (seatWidthRatio * HDRatio * width + verticalSeatSpace),
        } // along the bottom, each seat is further away as you move to the right
        seatLeft += seatHorizontalPitch
        seat++
        i++
      }

      seatStyle.finishUp.left = 0.5 * width
      seatStyle.finishUp.top = 0.5 * height
      seatStyle.finishUp.width = '1vw'

      agendaStyle.top = seatStyle.nextUp.top
      agendaStyle.left = horizontalSeatSpace + nextUpWidthRatio * width + 2 * horizontalSeatSpace
      agendaStyle.width =
        agendaStyle.left + fontSize * 20 + 2 * horizontalSeatSpace <= width
          ? fontSize * 20
          : width - agendaStyle.left - 2 * horizontalSeatSpace // don't go too wide
      agendaStyle.height = agendaStyle.width //fontSize * 20;
      introSeatStyle['agenda'] = { top: -(agendaStyle.top + agendaStyle.height + ShadowBox), left: width }

      buttonBarStyle.left = seatStyle.speaking.left + speakingWidthRatio * width * 0.25
      buttonBarStyle.top = speakingWidthRatio * HDRatio * width + verticalSeatSpace * 1.2 //agendaStyle.top+agendaStyle.height+2*verticalSeatSpace;  // extra vertical space because the Agenda is rotated
      buttonBarStyle.width = speakingWidthRatio * 50 + 'vw'
      buttonBarStyle.height = '5vh'

      recorderButtonBarStyle.left = buttonBarStyle.left
      recorderButtonBarStyle.top = buttonBarStyle.top + buttonBarStyle.height * 1.25
      recorderButtonBarStyle.width = buttonBarStyle.width
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
      conversationTopicStyle,
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
    const { round, reviewing } = this.state

    let speaking = this.seatOfParticipant(part) === 'speaking'

    var objectURL
    if (speaking) {
      if (part === 'human') {
        if (this.participants.human && this.participants.human.speakingObjectURLs[round] && !this.rerecord) {
          objectURL = this.participants.human.speakingObjectURLs[round]
        } else {
          objectURL = 'cameraStream' // set it to something - but this.cameraStream should really be used
        }
      } else if (!(objectURL = this.participants[part].speakingObjectURLs[round])) {
        this.participants[part].speakingImmediate[round] = true
        this.stallWatch(part)
        logger.error('Undebate.nextMediaState need to do something about stallWatch with preFetch')
      }
    } else {
      if (part === 'human' && (!reviewing || (reviewing && this.rerecord))) objectURL = 'cameraStream'
      //set it to something - but this.cameraStream should really be used
      else if (!(objectURL = this.participants[part].listeningObjectURL))
        if (this.props.participants[part].listening) {
          // listeningObject hasn't loaded yet
          this.participants[part].listeningImmediate = true
        } else {
          // there is no listening object
          return this.playObjectURL(part, '', speaking, reviewing) // part is listening, but theres no video, for stopping of the currently playing video so the placeholder image can take over
        }
    }
    if (objectURL) this.playObjectURL(part, objectURL, speaking, reviewing)
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
          this.participants[part].speakingObjectURLs[round] = objectURL
          if (this.participants[part].speakingImmediate[round]) {
            this.playObjectURL(part, objectURL, speaking, false)
            this.participants[part].speakingImmediate[round] = false
          }
        } else {
          this.participants[part].listeningObjectURL = objectURL
          if (this.participants[part].listeningImmediate) {
            this.playObjectURL(part, objectURL, speaking, false)
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
        logger.error('Undebate.preFetchObjectURL fetch caught error', part, speaking, round, url, err.name, err.message)
        this.preFetchQueue = Math.max(this.preFetchQueue - 1, 0)
        this.setState({ preFetchQueue: this.preFetchQueue + this.preFetchQueue + this.preFetchList.length })
        let retries = this.retries[part + speaking + round] || 0
        if (retries < 3) {
          logger.trace('Undebate.preFetchObjectURL retrying', retries, part, speaking, round, url)
          this.retries[part + speaking + round] = retries + 1
          this.preFetchList.push([part, speaking, round])
        } else {
          logger.error('Undebate.preFetchObjectURL retries exceeded, using external link', part, speaking, round, url)
          this.setExternalObjectURL(part, speaking, round)
        }
        shiftPreFetchList()
      })
  }

  async playObjectURL(part, objectURL, speaking, reviewing) {
    if (!this.participants[part].element.current && !this.participants[part].youtubePlayer) return // we don't have a space for this participant
    logger.trace('playObjectURL part:', part, 'objectURL:', objectURL, speaking, reviewing)
    if (this.participants[part].youtubePlayer) {
      this.participants[part].youtubePlayer.loadVideoById({ videoId: getYouTubeID(objectURL) })
      let chair = this.seatOfParticipant(part)
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
        (!this.participants.human.speakingObjectURLs[this.state.round] || this.rerecord)
      ) {
        // human is speaking (not playing back what was spoken)
        element.src = ''
        element.srcObject = this.cameraStream // objectURL should be camera
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
        logger.error('Undebate.playAudioObject caught error', err.name, err)
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
      name: () => <IconPrevSection width="60%" height="60%" />,
      func: this.prevSection,
      title: () => 'Previous Question',
    },
    {
      name: () => <IconPrevSpeaker width="60%" height="60%" />,
      func: this.prevSpeaker,
      title: () => 'Previous Speaker',
    },
    {
      name: () =>
        this.state.isRecording ? (
          <IconStop width="75%" height="75%" />
        ) : this.state.allPaused ? (
          <IconPlay width="75%" height="75%" />
        ) : (
          <IconPause width="75%" height="75%" />
        ),
      func: this.allPause,
      title: () => (this.state.isRecording ? 'Stop' : this.state.allPaused ? 'Play' : 'Pause'),
    },
    {
      name: () => <IconSkipSpeaker width="60%" height="60%" />,
      func: this.nextSpeaker,
      title: () => 'Next Speaker',
    },
    {
      name: () => <IconNextSection width="60%" height="60%" />,
      func: this.nextSection,
      title: () => 'Next Question',
      disabled: () => this.participants.human && !this.participants.human.speakingObjectURLs[this.state.round],
    },
  ]

  recorderButtons = [
    {
      name: () => 'Redo',
      func: this.rerecordButton,
      title: () => 'Re-record',
      disabled: () => this.speakingNow() !== 'human' || this.state.warmup,
    },
    { name: () => 'key1', func: null, title: () => '' }, // keyN because react keys have to have unigue names
    { name: () => 'key2', func: null, title: () => '' },
    { name: () => 'key3', func: null, title: () => '' },
    {
      name: () => 'Finished Speaking',
      func: this.finishedSpeaking,
      title: () => 'Done Speaking',
      disabled: () => this.speakingNow() !== 'human' || (this.state.reviewing && !this.rerecord),
    },
  ]

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
    Object.keys(this.participants).forEach(participant => {
      if (this.participants[participant].element.current) this.participants[participant].element.current.pause()
      if (this.participants[participant].youtubePlayer) this.participants[participant].youtubePlayer.pauseVideo()
    })
    if (this.state.isRecording) this.pauseRecording()
    if (!this.state.allPaused) this.setState({ allPaused: true })
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
              logger.error('undebate.play() for ', participant, 'caught error', err)
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
      if (!this.props.participants.moderator.speaking[round]) return this.finished()
    } else {
      round += 1
      seatOffset = 0
      if (!this.props.participants.moderator.speaking[round]) return this.finished()
    }
    this.stopRecording(false)
    this.newOrder(seatOffset, round)
  }

  nextSpeaker() {
    var { seatOffset, round } = this.state
    logger.info('Undebate.nextSpeaker', seatOffset, round)
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
    this.stopRecording(false)
    this.newOrder(seatOffset, round)
  }

  autoNextSpeaker() {
    var { seatOffset, round } = this.state
    logger.trace('Undebate.autoNextSpeaker', seatOffset, round)
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
      this.participants[speakingNow].element.current.currentTime = 0
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

  newOrder(seatOffset, round) {
    const { participants } = this.props

    this.clearStallWatch()
    var followup = []
    Object.keys(participants).forEach((participant, i) => {
      let oldChair = this.seat(i)
      let newChair = this.seat(i, seatOffset)
      logger.trace('rotateOrder', round, seatOffset, participant, oldChair, newChair)

      if (participant === 'human') {
        const { timeLimits } = participants.moderator
        const timeLimit = (timeLimits && timeLimits[round]) || 60
        const { listeningRound, listeningSeat } = this.listening()
        if (oldChair === 'speaking' && newChair === 'speaking' && this.rerecord) {
          // the user is initiating a rerecord
        } else if (
          oldChair === 'speaking' &&
          (!this.participants.human.speakingObjectURLs[this.state.round] || this.rerecord)
        ) {
          // the oldChair and the old round
          //this.rerecord = false
          //this.stopRecording()
        } else if (oldChair === listeningSeat && this.state.round === listeningRound && !this.state.reviewing) {
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
      if (this.audioSets.transition) {
        this.playAudioObject('audio', this.audioSets.transition)
      }
      while (followup.length) followup.shift()()
    })
  }

  ensureNotRecording(oldChair, newChair, listeningSeat, listeningRound) {
    if (oldChair === 'speaking' && newChair === 'speaking' && this.rerecord) {
      // the user is initiating a rerecord
    } else if (
      oldChair === 'speaking' &&
      (!this.participants.human.speakingObjectURLs[this.state.round] || this.rerecord)
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
    if (this.isRecordingPlaceHolder()) {
      this.recordFromSpeakersSeat(listeningSeat, timeLimit, round)
    } else if (newChair === 'speaking') {
      if (this.rerecord) {
        this.recordWithWarmup(timeLimit, round)
      } else if (!this.participants.human.speakingObjectURLs[round]) {
        this.recordWithCountdown(timeLimit, round, TransitionTime)
      }
    }
  }

  recordWithCountdown(timeLimit, round, delay) {
    this.startCountDown(timeLimit, () => this.autoNextSpeaker(), delay)
    this.startTalkativeTimeout(timeLimit * 0.75)
    this.startRecording(blobs => this.saveRecordingToParticipants(true, round, blobs), true)
  }

  recordWithWarmup(timeLimit, round) {
    const warmupSeconds = 3
    this.warmupCountDown(warmupSeconds, () => this.recordWithCountdown(timeLimit, round, 0))
  }

  recordFromSpeakersSeat(listeningSeat, timeLimit, round) {
    if (listeningSeat === 'speaking') {
      // recording the listening segment from the speakers seat
      this.startCountDown(timeLimit, () => this.autoNextSpeaker(), TransitionTime)
    }
    this.startRecording(blobs => this.saveRecordingToParticipants(false, round, blobs))
  }

  finished() {
    logger.info('Undebate.finished')
    this.clearStallWatch()
    this.allStop()
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
    logger.info('Undebate.reallyHangup')
    this.camera && this.camera.releaseCamera()
    this.allStop()
    return this.setState({ hungUp: true, done: true })
  }

  onUserLogin(info) {
    logger.info('Undebate.onUserLogin')
    logger.trace('onUserLogin', info)
    const { userId, firstName, lastName } = info
    this.setState({ newUserId: userId, firstName, lastName })
  }

  onUserUpload() {
    if (this.uploadStarted) return
    // prevent double uploads - the users might double click the upload button
    else this.uploadStarted = true
    logger.info('Undebate.onUserUpload')
    logger.trace('onUserUpload', this.props)
    const userId = (this.props.user && this.props.user.id) || this.state.newUserId
    createParticipant(this.props, this.participants.human, userId, this.state.name, progressObj =>
      this.setState(progressObj)
    )
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
    this.audio.current.onended = undefined
    this.setState({ begin: true }, () => {
      this.getCameraMedia()
    })
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
          this.participants[participant].element.current.src
        )
      } else {
        logger.error(
          'Undebate.videoError on listener, ignoring',
          e.target.error.message,
          this.participants[participant].element.current.src
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
    if (this.participants[speaker].youtube) return

    if (this.participants[speaker].speakingImmediate[this.state.round] && this.stallWatchTimeout)
      // was called because preFetch hadn't completed when it was time to play
      return

    if (this.stallWatchTimeout) {
      logger.error('Undebate.stallWatch called but timeout already set', this.stallWatchTimeout)
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

  keyHandler(e) {
    if (e) {
      if (
        this.participants.human &&
        this.seatOfParticipant('human') === 'speaking' &&
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
    logger.info('Undebate.beginButton')
    if (!this.noOverlay && this.audioSets && this.audioSets.intro) {
      this.setState({ intro: true, stylesSet: true, allPaused: false }, () => {
        this.playAudioObject('audio', this.audioSets.intro, this.onIntroEnd.bind(this))
      })
    } else this.setState({ intro: true, stylesSet: true, allPaused: false }, () => this.onIntroEnd())
  }

  preventPortraitRecording = () => {
    if (this.props.browserConfig.type !== 'phone') return // nothing to do here if not a phone
    const { isPortraitPhoneRecording } = this.state
    const portraitMode = typeof window !== 'undefined' && window.innerWidth < window.innerHeight
    if (isPortraitPhoneRecording && !portraitMode) {
      if (this.isRecordingSpeaking()) {
        this.setState({ isPortraitPhoneRecording: false }, () => this.rerecordButton())
      } else if (this.isRecordingPlaceHolder()) {
        const speakingNow = this.speakingNow()
        if (speakingNow !== 'human') this.participants[speakingNow].element.current.currentTime = 0 // rewind the speaker
        this.setState({ isPortraitPhoneRecording: false }, () =>
          setTimeout(() => {
            this.allPlay()
            setTimeout(() => this.rerecordButton(), 1000)
          }, TransitionTime)
        ) // wait for the user to settle before starting to record the place holder video
      }
    } else if (!isPortraitPhoneRecording && portraitMode) {
      if (this.isRecordingSpeaking()) {
        this.ensurePaused()
        this.setState({ isPortraitPhoneRecording: true })
      } else if (this.isRecordingPlaceHolder()) {
        this.ensurePaused()
        this.setState({ isPortraitPhoneRecording: true })
      }
    }
  }

  isRecording() {
    return this.isRecordingPlaceHolder() || this.isRecordingSpeaking()
  }

  isRecordingPlaceHolder() {
    const { participants } = this.props
    const { round, reviewing } = this.state
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

  render() {
    const {
      className,
      classes,
      opening = {},
      closing = { thanks: 'Thank You' },
      bp_info = {},
      instructionLink,
      subject,
      browserConfig,
      participants,
      user,
      hangupButton = {},
      logo,
      path,
    } = this.props
    const {
      round,
      finishUp,
      done,
      begin,
      requestPermission,
      talkative,
      warmup,
      moderatorReadyToStart,
      intro,
      seatStyle,
      agendaStyle,
      buttonBarStyle,
      recorderButtonBarStyle,
      introSeatStyle,
      introStyle,
      stylesSet,
      conversationTopicStyle,
      isRecording,
      isPortraitPhoneRecording,
      reviewing,
      uploadComplete,
      hungUp,
      preFetchQueue,
      name,
      firstName,
      lastName,
      newUserId,
      progress,
      fontSize,
      stalled,
      waitingPercent,
      totalSize_before_hangup,
      countDown,
      errorMsg,
      left,
      preambleAgreed,
    } = this.state

    const getIntroStyle = name =>
      Object.assign({}, stylesSet && { transition: IntroTransition }, introStyle[name], intro && introSeatStyle[name])
    const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const humanSpeaking = this.speakingNow() === 'human'
    const ifShowPreamble = this.participants.human && !opening.noPreamble && !intro && !begin && !done
    const scrollableIframe = (done && participants.human) || ifShowPreamble
    const bot = browserConfig.type === 'bot'
    const noOverlay = this.noOverlay

    if (this.canNotRecordHere) {
      return (
        <div className={cx(classes['outerBox'], classes['beginBox'])}>
          <ConversationHeader subject={subject} bp_info={bp_info} logo={logo} />
          <div className={classes['note']}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
              <p style={{ fontSize: '150%' }}>Recording video from this device or browser is not yet supported.</p>
              <p>Please come back to this link from a Windows 10 PC or a Mac using the Chrome browser.</p>
            </div>
          </div>
        </div>
      )
    }
    const recordingPlaceholderBar = () => {
      if (participants.human) {
        const { listeningRound, listeningSeat } = this.listening()
        if (listeningRound === round && listeningSeat === this.seatOfParticipant('human')) {
          const reviewingAndNotReRecording = reviewing && !this.rerecord
          return (
            <div
              title={'Look into the camera as your placeholder video is being recorded'}
              className={cx(classes.recordingPlaceholderBar, reviewingAndNotReRecording && classes.reviewing)}
            >
              <button onClick={() => this.rerecordPlaceHolderButton()}>
                {reviewingAndNotReRecording ? 'Rerecord Placeholder' : 'Recording Placeholder'}
              </button>
            </div>
          )
        }
      }
      return null
    }

    const surveyForm = () =>
      (closing.iframe && (!this.participants.human || (this.participants.human && (uploadComplete || hungUp))) && (
        <iframe
          src={closing.iframe.src}
          width={Math.min(closing.iframe.width, innerWidth)}
          height={closing.iframe.height}
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          style={{ pointerEvents: 'all' }}
        >
          Loading...
        </iframe>
      )) ||
      (closing.link && (!this.participants.human || (this.participants.human && (uploadComplete || hungUp))) && (
        <div className={classes['thanks-link']}>
          <a href={closing.link.url} target={closing.link.target || '_self'}>
            {closing.link.name}
          </a>
        </div>
      ))
    //! ===============================   beginOverlay   ===============================
    const beginOverlay = () =>
      !begin &&
      !done && (
        <div className={cx(classes['outerBox'], classes['beginBox'])}>
          {noOverlay || opening.noPreamble ? (
            <div style={{ width: '100%', height: '100%', display: 'table' }}>
              <div title="Begin" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
                <button
                  style={{ marginTop: '25vh' }}
                  className={classes['beginButton']}
                  onClick={this.beginButton}
                  data-testid="begin-button"
                >
                  Begin
                </button>
              </div>
            </div>
          ) : (
            <>
              <img style={getIntroStyle('introRight')} src="/assets/images/female_hands_mug.png" />
              <img style={getIntroStyle('introLeft')} src="/assets/images/male_hands_mug.png" />
              <img style={getIntroStyle('introTopLeft')} src="/assets/images/left_flowers.png" />
              <img style={getIntroStyle('introTopRight')} src="/assets/images/right_flowers.png" />
              <div
                className={cx(
                  className,
                  classes['introPane'],
                  stylesSet && !begin && classes['begin'],
                  intro && classes['intro']
                )}
                key="begin-banner"
              >
                <div className={cx(className, classes['introTitle'])}>
                  <h1>Candidate Conversations</h1>
                  <p style={{ textAlign: 'center', marginTop: '1em', marginBottom: 0 }}>
                    <img
                      src="https://ballotpedia.org/wiki/skins/Ballotpedia/images/bp-logo.svg"
                      style={{ width: 'auto', height: '4vh' }}
                    />
                  </p>
                  <p style={{ textAlign: 'center', margin: 0 }}>
                    <img
                      src="https://enciv.org/wp-content/uploads/2019/01/enciv-logo.png"
                      style={{ width: 'auto', height: '5vh' }}
                    />
                  </p>
                </div>
                <div className={cx(className, classes['introBox'])}>
                  <div className={cx(className, classes['introInner'])}>
                    <div style={{ textAlign: 'center' }}>
                      <div>
                        <span className={classes['opening']}>
                          <p>{ReactHtmlParser(opening.line1)}</p>
                          <p style={{ color: 'darkviolet', fontSize: '90%' }}>{ReactHtmlParser(opening.line2)}</p>
                          <p>{ReactHtmlParser(opening.line3)}</p>
                          <p style={{ color: 'darkviolet', fontSize: '90%' }}>{ReactHtmlParser(opening.line4)}</p>
                          <p style={{ fontSize: '150%' }}>{ReactHtmlParser(opening.bigLine)}</p>
                        </span>
                      </div>
                      <div>
                        <span className={classes['subOpening']}>{ReactHtmlParser(opening.subLine)}</span>
                      </div>
                      <div>
                        <button className={classes['beginButton']} onClick={this.beginButton}>
                          Begin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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
                  {preFetchQueue}
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

    const thanks = () => (
      <span className={cx(classes['thanks'], scrollableIframe && classes['scrollableIframe'])}>{closing.thanks}</span>
    )

    const reviewButton = () =>
      this.participants.human &&
      !uploadComplete && (
        <div className={classes.reviewIt}>
          <button
            className={classes['beginButton']}
            onClick={() =>
              this.setState(
                {
                  intro: true,
                  stylesSet: true,
                  allPaused: false,
                  round: 0,
                  seatOffset: 0,
                  done: 0,
                  finishUp: 0,
                  reviewing: 1,
                },
                () => this.onIntroEnd()
              )
            }
          >
            Review It
          </button>
        </div>
      )

    const nameInput = () =>
      !bp_info.candidate_name &&
      (newUserId || user) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            Name Shown with Video
            <Input
              className={classes['name']}
              block
              medium
              required
              placeholder="Your Name Tag"
              ref="name"
              name="name"
              defaultValue={name || (firstName && lastName && firstName + ' ' + lastName)}
              onChange={e => this.setState({ name: e.value })}
            />
          </label>
          <span>This will be shown under your video</span>
        </div>
      )

    const postButton = () =>
      this.participants.human &&
      !uploadComplete && (
        <>
          <div>
            <button
              disabled={this.newUser && !newUserId}
              className={classes['beginButton']}
              onClick={this.onUserUpload.bind(this)}
            >
              Post
            </button>
          </div>
          {progress && <div>{'uploading: ' + progress}</div>}
        </>
      )

    const authForm = () =>
      this.participants.human &&
      !uploadComplete &&
      this.newUser &&
      !newUserId && (
        <>
          <div style={{ textAlign: 'center' }}>
            <span>Join and your recorded videos will be uploaded and shared</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AuthForm
              userInfo={{
                name: name || bp_info.candidate_name,
                firstName: firstName || bp_info.first_name,
                lastName: lastName || bp_info.last_name,
              }}
              onChange={this.onUserLogin.bind(this)}
            />
          </div>
        </>
      )

    const ending = () =>
      done &&
      !hungUp && (
        <>
          <div className={cx(classes['outerBox'], scrollableIframe && classes['scrollableIframe'])} key="ending">
            <div style={{ width: '100%', height: '100%', display: 'table' }}>
              <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
                {thanks()}
                {reviewButton()}
                {authForm()}
                {nameInput()}
                {postButton()}
                {surveyForm()}
              </div>
            </div>
          </div>
        </>
      )

    const renderHungUp = () =>
      hungUp && (
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

    var videoBox = (participant, i, seatStyle) => {
      if (!this.participants[participant].element) return null // we don't have room for this participant
      let chair = this.seat(i)
      const style =
        noOverlay || bot || intro ? seatStyle[chair] : Object.assign({}, seatStyle[chair], introSeatStyle[chair])
      let participant_name
      if (participant === 'human') {
        if (bp_info.candidate_name) participant_name = bp_info.candidate_name
        else if (name) participant_name = name
        else if (firstName || lastName) participant_name = firstName + ' ' + lastName
      } else participant_name = participants[participant].name
      /*src={"https://www.youtube.com/embed/"+getYouTubeID(this.participants[participant].listeningObjectURL)+"?enablejsapi=1&autoplay=1&loop=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0"}*/
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
          {this.seat(i) === 'speaking' && !participants.human ? (
            <SocialShareBtn
              metaData={{
                path: path,
                subject: subject,
              }}
              fontSize={fontSize}
            />
          ) : null}
          <div
            style={{
              width: seatStyle[this.seat(i)].width,
              height: parseFloat(seatStyle[this.seat(i)].width) * HDRatio + 'vw',
            }}
            className={cx(
              className,
              classes['participantBackground'],
              stylesSet && classes['stylesSet'],
              stylesSet && !intro && classes['intro'],
              stylesSet && !begin && classes['begin']
            )}
          >
            <img
              style={{
                transition: `all ${TransitionTime}ms linear`,
                height: parseFloat(seatStyle[this.seat(i)].width) * HDRatio + 'vw',
              }}
              height={(parseFloat(seatStyle['speaking'].width) * HDRatio * innerWidth) / 100}
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
              style={{
                fontSize: '8px',
                width: seatStyle[this.seat(i)].width,
                height: parseFloat(seatStyle[this.seat(i)].width) * HDRatio + 'vw',
              }}
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
                onEnded={this.autoNextSpeaker.bind(this)}
                onError={this.videoError.bind(this, participant)}
                style={{
                  width: seatStyle[this.seat(i)].width,
                  height: parseFloat(seatStyle[this.seat(i)].width) * HDRatio + 'vw',
                }}
                key={participant + '-video'}
                data-testid={participant + '-video'}
                participant={participant}
                chair={chair}
              ></video>
              <div
                className={cx(classes['stalledOverlay'], stalled === participant && classes['stalledNow'])}
                style={{
                  width: (parseFloat(seatStyle[this.seat(i)].width) * innerWidth) / 100,
                  height: (parseFloat(seatStyle[this.seat(i)].width) * HDRatio * innerWidth) / 100,
                }}
              >
                <div className={classes['stalledBox']}>
                  <p>Hmmmm... the Internet is slow here</p>
                  <p>{`${participants[participant].name} will be with us shortly`}</p>
                  <p>{`${waitingPercent}% complete`}</p>
                </div>
              </div>
            </>
          )}
          <div className={cx(classes['videoFoot'], stylesSet && classes['stylesSet'], finishUp && classes['finishUp'])}>
            <span>{!finishUp && this.seatToName[this.seat(i)] + ': '}</span>
            <span>{participant_name}</span>
          </div>
        </div>
      )
    }

    var agenda = agendaStyle => {
      const style = finishUp
        ? {}
        : noOverlay || bot || intro
        ? agendaStyle
        : Object.assign({}, agendaStyle, introSeatStyle['agenda'])
      return (
        <div
          style={style}
          className={cx(
            classes['agenda'],
            stylesSet && classes['stylesSet'],
            finishUp && classes['finishUp'],
            begin && classes['begin'],
            !intro && classes['intro']
          )}
          key={'agenda' + round + agendaStyle.left}
        >
          <div className={classes['innerAgenda']}>
            {participants.moderator.agenda[round] && (
              <>
                <span className={classes['agendaTitle']}>Agenda</span>
                <ul className={classes['agendaItem']}>
                  {participants.moderator.agenda[round] &&
                    participants.moderator.agenda[round].map((item, i) => <li key={item + i}>{item}</li>)}
                </ul>
              </>
            )}
          </div>
        </div>
      )
    }

    const buttonBar = buttonBarStyle =>
      (bot || ((noOverlay || (begin && intro)) && !finishUp && !done)) && (
        <div style={buttonBarStyle} className={classes['buttonBar']} key="buttonBar">
          {this.buttons.map(button => (
            <div
              style={{ width: 100 / this.buttons.length + '%', display: 'inline-block', height: '100%' }}
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
              key={button.title() || button.name}
              title={button.title()}
            >
              {button.func ? (
                <button disabled={button.disabled && button.disabled()} onClick={button.func.bind(this)}>
                  {button.name()}
                </button>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      )

    const renderHangupButton = () =>
      !ifShowPreamble &&
      !hungUp &&
      this.participants.human && (
        <div className={classes['hangUpButton']}>
          <button
            onClick={this.hangup}
            key="hangup"
            title={hangupButton.title || 'Stop recording and delete all video stored in the browser.'}
          >
            {hangupButton.name || 'Hang Up'}
          </button>
          {totalSize_before_hangup && !uploadComplete ? (
            <div className={classes['hangUpButtonReally']}>
              {hangupButton.question ||
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

    const conversationTopic = topicStyle => {
      return (
        <>
          {instructionLink && (
            <div className={classes['instructionLink']}>
              <a target="#" href={instructionLink}>
                <i
                  className={cx('far', 'fa-question-circle', classes['instructionIcon'])}
                  onClick={() => {
                    this.ensurePaused()
                    let win = window.open(instructionLink, '_blank')
                    win.focus()
                  }}
                />
              </a>
            </div>
          )}
          <div style={topicStyle} className={classes['conversationTopic']}>
            <p className={classes['conversationTopicContent']}>{subject}</p>
          </div>
          <a target="#" href="https://www.EnCiv.org">
            <img className={classes['enciv-logo']} src="https://enciv.org/wp-content/uploads/2019/01/enciv-logo.png" />
          </a>
          {logo === 'undebate' ? (
            <a target="#" href="https://enciv.org/undebate">
              <img
                className={classes['logo']}
                src="https://res.cloudinary.com/hf6mryjpf/image/upload/c_scale,h_100/v1585602937/Undebate_Logo.png"
              />
            </a>
          ) : logo === 'none' ? (
            false
          ) : logo === 'CandidateConversations' || typeof logo === 'undefined' ? (
            <a target="#" href="https://ballotpedia.org/Candidate_Conversations">
              <img
                className={classes['logo']}
                src="https://res.cloudinary.com/hf6mryjpf/image/upload/v1578591434/assets/Candidate_Conversations_logo-stacked_300_res.png"
              />
            </a>
          ) : (
            false
          )}
        </>
      )
    }

    var main = () =>
      !done && (
        <>
          {conversationTopic(conversationTopicStyle)}
          <div className={classes['outerBox']}>
            {Object.keys(participants).map((participant, i) => videoBox(participant, i, seatStyle))}
            {agenda(agendaStyle)}
          </div>
          <div
            className={cx(
              classes['countdown'],
              humanSpeaking &&
                (this.rerecord || !this.participants.human.speakingObjectURLs[round]) &&
                classes['counting'],
              talkative && classes['talkative'],
              warmup && classes['warmup']
            )}
          >
            {(warmup ? '-' : '') + TimeFormat.fromS(Math.round(countDown), 'mm:ss')}
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <span>{errorMsg}</span>
          </div>
        </>
      )

    return (
      <div
        style={{ fontSize: fontSize }}
        className={cx(classes['wrapper'], scrollableIframe && classes['scrollableIframe'])}
      >
        {isPortraitPhoneRecording ? (
          <Modal
            render={() => (
              <>
                <div>
                  <Icon style={{ padding: '15% 0' }} icon={'redo'} flip={'horizontal'}></Icon>
                </div>
                Recording will start from the top after switching to landscape orientation
              </>
            )}
          ></Modal>
        ) : null}
        {participants.human && (
          <ReactCameraRecorder
            ref={this.getCamera}
            onCanNotRecordHere={status => (this.canNotRecordHere = status)}
            onCameraStream={stream => (this.cameraStream = stream)}
            onCameraChange={() => this.nextMediaState('human')}
            constraints={{
              audio: {
                echoCancellation: { exact: true },
              },
              video: {
                width: 640,
                height: 360,
              },
            }}
          />
        )}
        <section
          id="syn-ask-webrtc"
          key="began"
          className={cx(classes['innerWrapper'], scrollableIframe && classes['scrollableIframe'])}
          style={{ left: left }}
          ref={this.calculatePositionAndStyle}
        >
          <audio ref={this.audio} playsInline controls={false} onEnded={this.audioEnd} key="audio"></audio>
          {main()}
          {((this.participants.human && (preambleAgreed || opening.noPreamble)) || !this.participants.human) &&
            !bot &&
            beginOverlay()}
          {ifShowPreamble && (
            <CandidatePreamble
              subject={subject}
              bp_info={bp_info}
              agreed={preambleAgreed}
              classes={classes}
              onClick={() => {
                logger.info('Undebate preambleAgreed true')
                this.setState({ preambleAgreed: true })
                noOverlay && this.beginButton()
              }}
              candidate_questions={participants.moderator.agenda}
              instructionLink={instructionLink}
              timeLimits={participants.moderator.timeLimits}
            />
          )}
          {ending()}
          {((this.participants.human && (preambleAgreed || opening.noPreamble)) || !this.participants.human) &&
            buttonBar(buttonBarStyle)}
          {recorderButtonBar(recorderButtonBarStyle)}
          {permissionOverlay()}
          {waitingOnModeratorOverlay()}
          {renderHangupButton()}
          {renderHungUp()}
          {recordingPlaceholderBar()}
        </section>
      </div>
    )
  }
}

export default injectSheet(styles)(Undebate)
