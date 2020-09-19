'use strict'

import React from 'react'
import ViewerRecorderLogic from './viewer-camera-logic'
import injectSheet from 'react-jss'
import cx from 'classnames'
import SocialShareBtn from '../../lib/socialShareBtn'

import TimeFormat from 'hh-mm-ss'
import cloneDeep from 'lodash/cloneDeep'
import getYouTubeID from 'get-youtube-id'

const ResolutionToFontSizeTable = require('../../../../resolution-to-font-size-table').default

const TransitionTime = 500
const TopMargin = 0
const IntroTransition = 'none'
const HDRatio = 1080 / 1920 //0.5625
const ShadowBox = 10

import IconPrevSpeaker from '../../../svgr/prev-speaker-icon'
import IconPrevSection from '../../../svgr/prev-section-icon'
import IconPlay from '../../../svgr/play-icon'
import IconPause from '../../../svgr/pause-icon'
import IconStop from '../../../svgr/stop-icon'
import IconSkipSpeaker from '../../../svgr/next-speaker-icon'
import IconNextSection from '../../../svgr/next-section-icon'
import IconRedo from '../../../svgr/redo-icon'
import IconFinishRecording from '../../../svgr/finish-speaking-icon'
import IconRecording from '../../../svgr/icon-recording'
import ConversationHeader from '../../conversation-header'

import ReactCameraRecorder from '../../react-camera-recorder'
import ReactMicMeter from '../../react-mic-meter'

import Modal from '../Modal'
import Icon from '../../lib/icon'

import Agenda from '../../agenda-nav'

class ViewerRecorder extends ViewerRecorderLogic {
  constructor(props) {
    super(props)
    if (this.canNotRecordHere) return // don't render anything if can't record
    //this.createDefaults();
    this.calculatePositionAndStyle = this.calculatePositionAndStyle.bind(this)
    this.beginButton = this.beginButton.bind(this)
    this.keyHandler = this.keyHandler.bind(this)
    this.hangup = this.hangup.bind(this)
    this.reallyHangup = this.reallyHangup.bind(this)
    if (typeof window !== 'undefined') window.onresize = this.onResize.bind(this)

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

    // there is already a state from the parent component, don't clobber it, but add to it
    Object.assign(this.state, {
      stylesSet: false,
      intro: false,
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

      agendaStyle: {
        top: '8vh',
        width: '17.5vw',
        height: '17.5vw',
        left: 'calc(2.5vw + 20vw + 2.5vw + 50vw + 2.5vw)',
      },

      buttonBarStyle: {
        //width: '50vw',
        //left: '25vw',
        //top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
        bottom: '5vh',
        height: '10vh',
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
    })
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
    const titleHeight = 3 * fontSize
    if (width / height > 0.8) {
      // landscape mode
      if (width / height > 1.8) {
        // it's very long and short like a note 8

        const speakingWidthRatio = (height * 0.4) / HDRatio / width
        const nextUpWidthRatio = speakingWidthRatio * 0.5
        const seatWidthRatio = speakingWidthRatio * 0.5
        const verticalSeatSpaceRatio = 0.025
        const horizontalSeatSpaceRatio = 0.025
        const navBarHeightRatio = 0.06

        const verticalSeatSpace = Math.max(verticalSeatSpaceRatio * height, titleHeight)
        const horizontalSeatSpace = horizontalSeatSpaceRatio * width

        seatStyle.speaking.left = ((1 - speakingWidthRatio) * width) / 2 /// centered
        seatStyle.speaking.top = navBarHeightRatio * height // TopMargin;
        seatStyle.speaking.width = speakingWidthRatio * 100 + 'vw'

        seatStyle.nextUp.top =
          speakingWidthRatio * HDRatio * width - nextUpWidthRatio * HDRatio * width - verticalSeatSpace
        seatStyle.nextUp.width = nextUpWidthRatio * 100 + 'vw'
        seatStyle.nextUp.left = (seatStyle.speaking.left - nextUpWidthRatio * width) / 2 // depends on width

        let seat = 2

        let seatTop = seatStyle.nextUp.top + nextUpWidthRatio * HDRatio * width + verticalSeatSpace
        let seatVerticalPitch = seatWidthRatio * HDRatio * width + verticalSeatSpace
        let seatLeft = seatStyle.nextUp.left //Math.min(seatStyle.nextUp.left, horizontalSeatSpace)

        // down the left side
        while (seatTop + seatVerticalPitch < height && seat <= 7) {
          seatStyle['seat' + seat].top = seatTop
          seatStyle['seat' + seat].left = seatLeft
          seatStyle['seat' + seat].width = seatWidthRatio * 100 + 'vw'
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
          seatLeft += seatHorizontalPitch
          seat++
          i++
        }

        if (!this.props.participants.moderator) {
          // this is a hack - but if we are doing the precheck with only a human - finishup should go to seat2
          seatStyle.finishUp.left = seatStyle['seat2'].left
          seatStyle.finishUp.top = seatStyle['seat2'].top
          seatStyle.finishUp.width = seatStyle['seat2'].width
        } else {
          seatStyle.finishUp.left = 0.5 * width
          seatStyle.finishUp.top = 0.5 * height
          seatStyle.finishUp.width = '1vw'
        }

        agendaStyle.top = seatStyle.nextUp.top //speakingWidthRatio * HDRatio * width * 0.10;
        agendaStyle.left = seatStyle.speaking.left + speakingWidthRatio * width + 2 * horizontalSeatSpace // 2 because it's rotated
        //agendaStyle.height=speakingWidthRatio * HDRatio * width * 0.8;

        agendaStyle.width = Math.max(speakingWidthRatio * HDRatio * width * 0.8, 20 * fontSize)
        if (agendaStyle.left + agendaStyle.width > width)
          agendaStyle.width = width - agendaStyle.left - 2 * horizontalSeatSpace
        agendaStyle.height = agendaStyle.width

        buttonBarStyle.left = seatStyle.speaking.left
        // buttonBarStyle.width = seatStyle.nextUp.width
        buttonBarStyle.width = seatStyle.speaking.width
        // buttonBarStyle.height = Math.max(0.05 * height, 4 * fontSize) + 20

        recorderButtonBarStyle.left = seatStyle.speaking.left
        recorderButtonBarStyle.top = buttonBarStyle.top + buttonBarStyle.height * 1.25 + titleHeight
        recorderButtonBarStyle.width = seatStyle.speaking.width
        recorderButtonBarStyle.height = buttonBarStyle.height
      } else {
        const speakingWidthRatio = 0.5
        const nextUpWidthRatio = 0.2
        const seatWidthRatio = 0.2
        const verticalSeatSpaceRatio = 0.05
        const horizontalSeatSpaceRatio = 0.0125
        const navBarHeightRatio = 0.08

        const verticalSeatSpace = Math.max(verticalSeatSpaceRatio * height, titleHeight)
        const horizontalSeatSpace = Math.max(horizontalSeatSpaceRatio * width, fontSize)

        seatStyle.speaking.left = ((2.5 + 20 + 2.5) / 100) * width
        seatStyle.speaking.top = navBarHeightRatio * height //TopMargin;
        seatStyle.speaking.width = speakingWidthRatio * 100 + 'vw'

        seatStyle.nextUp.left = horizontalSeatSpace //(2.5 /100) * width;
        seatStyle.nextUp.top = TopMargin + speakingWidthRatio * HDRatio * width - nextUpWidthRatio * HDRatio * width
        seatStyle.nextUp.width = nextUpWidthRatio * 100 + 'vw'

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
          seatLeft += seatHorizontalPitch
          seat++
          i++
        }

        if (!this.props.participants.moderator) {
          // this is a hack - but if we are doing the precheck with only a human - finishup should go to seat2
          seatStyle.finishUp.left = seatStyle['seat2'].left
          seatStyle.finishUp.top = seatStyle['seat2'].top
          seatStyle.finishUp.width = seatStyle['seat2'].width
        } else {
          seatStyle.finishUp.left = 0.5 * width
          seatStyle.finishUp.top = ((0.5 + 0.15) * width * HDRatio + (0.05 + 0.015) * height + TopMargin) / 2
          seatStyle.finishUp.width = '1vw'
        }

        agendaStyle.top = 0.08 * height
        agendaStyle.left = seatStyle.speaking.left + speakingWidthRatio * width + horizontalSeatSpace
        agendaStyle.width = Math.max(0.175 * width, 20 * fontSize)
        if (agendaStyle.left + agendaStyle.width > width)
          agendaStyle.width = width - agendaStyle.left - 2 * horizontalSeatSpace
        agendaStyle.height = Math.max(0.175 * width, 20 * fontSize)

        buttonBarStyle.width = seatStyle.speaking.width
        buttonBarStyle.left = seatStyle.speaking.left
        // buttonBarStyle.top = speakingWidthRatio * HDRatio * width
        // if (width / height < 0.87) {
        //   buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1.18
        // } else if (width / height < 1) {
        //   buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1.13
        // } else if (width / height < 1.2) {
        //   buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1.08
        // } else if (width / height < 1.4) {
        //   buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1.04
        // } else if (width / height < 1.6) {
        //   buttonBarStyle.top = speakingWidthRatio * HDRatio * width * 1
        // } else {
        //   buttonBarStyle.top = speakingWidthRatio * HDRatio * width
        // }
        // buttonBarStyle.height = Math.max(0.035 * height, 4 * fontSize)

        recorderButtonBarStyle.left = seatStyle.speaking.left
        recorderButtonBarStyle.top = buttonBarStyle.top + buttonBarStyle.height * 1.25 + titleHeight
        recorderButtonBarStyle.width = seatStyle.speaking.width
        recorderButtonBarStyle.height = buttonBarStyle.height
      }
    } else {
      // portrait mode
      const speakingWidthRatio = 0.95
      const nextUpWidthRatio = 0.25
      const seatWidthRatio = 0.25
      const verticalSeatSpaceRatio = 0.05
      const horizontalSeatSpaceRatio = 0.025
      const navBarHeightRatio = 0.11

      const verticalSeatSpace = Math.max(verticalSeatSpaceRatio * height, titleHeight)
      const horizontalSeatSpace = Math.max(horizontalSeatSpaceRatio * width, fontSize)

      seatStyle.speaking.left = ((1 - speakingWidthRatio) * width) / 2 /// centered
      seatStyle.speaking.top = navBarHeightRatio * height //TopMargin;
      seatStyle.speaking.width = speakingWidthRatio * 100 + 'vw'

      seatStyle.nextUp.left = horizontalSeatSpace
      seatStyle.nextUp.top = speakingWidthRatio * HDRatio * width + verticalSeatSpace + navBarHeightRatio * height
      seatStyle.nextUp.width = nextUpWidthRatio * 100 + 'vw'

      let seat = 2

      let seatTop = seatStyle.nextUp.top + nextUpWidthRatio * HDRatio * width + verticalSeatSpace
      let seatVerticalPitch = seatWidthRatio * HDRatio * width + verticalSeatSpace

      // down the left side
      while (seatTop + seatVerticalPitch < height && seat <= 7) {
        seatStyle['seat' + seat].top = seatTop
        seatStyle['seat' + seat].left = horizontalSeatSpace
        seatStyle['seat' + seat].width = seatWidthRatio * 100 + 'vw'
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
        seatLeft += seatHorizontalPitch
        seat++
        i++
      }

      if (!this.props.participants.moderator) {
        // this is a hack - but if we are doing the precheck with only a human - finishup should go to seat2
        seatStyle.finishUp.left = seatStyle['seat2'].left
        seatStyle.finishUp.top = seatStyle['seat2'].top
        seatStyle.finishUp.width = seatStyle['seat2'].width
      } else {
        seatStyle.finishUp.left = 0.5 * width
        seatStyle.finishUp.top = 0.5 * height
        seatStyle.finishUp.width = '1vw'
      }
      agendaStyle.top = seatStyle.nextUp.top
      agendaStyle.left = horizontalSeatSpace + nextUpWidthRatio * width + 2 * horizontalSeatSpace
      agendaStyle.width =
        agendaStyle.left + fontSize * 20 + 2 * horizontalSeatSpace <= width
          ? fontSize * 20
          : width - agendaStyle.left - 2 * horizontalSeatSpace // don't go too wide
      agendaStyle.height = agendaStyle.width - 30 //fontSize * 20;

      buttonBarStyle.left = 15
      // buttonBarStyle.top = speakingWidthRatio * HDRatio * width + verticalSeatSpace * 1.2 //agendaStyle.top+agendaStyle.height+2*verticalSeatSpace;  // extra vertical space because the Agenda is rotated
      buttonBarStyle.width = speakingWidthRatio * 80 + 'vw'
      // buttonBarStyle.height = '5vh'

      recorderButtonBarStyle.left = buttonBarStyle.left
      recorderButtonBarStyle.top = buttonBarStyle.top + buttonBarStyle.height * 1.25 + titleHeight
      recorderButtonBarStyle.width = buttonBarStyle.width
      recorderButtonBarStyle.height = buttonBarStyle.height
    }
    return {
      seatStyle,
      agendaStyle,
      buttonBarStyle,
      recorderButtonBarStyle,
    }
  }

  buttons = [
    {
      name: props => <IconRedo width="60%" height="60%" className={props} />,
      func: this.rerecordButton,
      title: () => 'Re-record',
      disabled: () => this.speakingNow() !== 'human' || this.state.warmup,
    },
    {
      name: props => <IconPrevSection width="60%" height="60%" className={props} />,
      func: this.prevSection,
      title: () => 'Previous Question',
    },
    {
      name: props => <IconPrevSpeaker width="60%" height="60%" className={props} />,
      func: this.prevSpeaker,
      title: () => 'Previous Speaker',
    },
    {
      name: props =>
        this.state.isRecording ? (
          <IconStop width="60%" height="60%" className={props} />
        ) : this.state.allPaused ? (
          <IconPlay width="60%" height="60%" className={props} />
        ) : (
          <IconPause width="60%" height="60%" className={props} />
        ),
      func: this.allPause,
      title: () => (this.state.isRecording ? 'Stop' : this.state.allPaused ? 'Play' : 'Pause'),
    },
    {
      name: props => <IconSkipSpeaker width="60%" height="60%" className={props} />,
      func: this.nextSpeaker,
      title: () => 'Next Speaker',
    },
    {
      name: props => <IconNextSection width="60%" height="60%" className={props} />,
      func: this.nextSection,
      title: () => 'Next Question',
      disabled: () =>
        this.props.ccState.participants.human &&
        !this.props.ccState.participants.human.speakingObjectURLs[this.state.round],
    },
    {
      name: props => <IconFinishRecording width="60%" height="60%" className={props} />,
      func: this.finishedSpeaking,
      title: () => 'Done Speaking',
      disabled: () => this.speakingNow() !== 'human' || (this.props.ccState.reviewing && !this.rerecord),
    },
  ]

  recorderButtons = [
    {
      name: props => <IconRedo width="100%" height="100%" className={props} />,
      func: this.rerecordButton,
      title: () => 'Re-record',
      disabled: () => this.speakingNow() !== 'human' || this.state.warmup || !this.getTimeLimit(),
    },
    { name: () => 'key1', func: null, title: () => '' }, // keyN because react keys have to have unigue names
    { name: () => 'key2', func: null, title: () => '' },
    { name: () => 'key3', func: null, title: () => '' },
    {
      name: props => <IconFinishRecording width="100%" height="100%" className={props} />,
      func: this.finishedSpeaking,
      title: () => 'Done Speaking',
      disabled: () => this.speakingNow() !== 'human' || (this.props.ccState.reviewing && !this.rerecord),
    },
  ]
  hangup() {
    if (!this.state.totalSize_before_hangup) {
      let totalSize = 0
      for (let round = 0; round < this.props.ccState.participants.human.speakingBlobs.length; round++) {
        totalSize +=
          (this.props.ccState.participants.human.speakingBlobs[round] &&
            this.props.ccState.participants.human.speakingBlobs[round].size) ||
          0
      }
      if (this.props.ccState.participants.human.listeningBlob) {
        totalSize += this.props.ccState.participants.human.listeningBlob.size
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
    this.setState({ hungUp: true, done: true })
    return this.props.dispatch({ type: this.props.dispatch.TYPES.HangUp })
    //return this.setState({ hungUp: true, done: true })
  }

  keyHandler(e) {
    if (e) {
      if (
        this.props.ccState.participants.human &&
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

  componentWillUnmount() {
    if (this.keyEventListener) window.removeEventListener('keydown', this.keyHandler)
  }

  beginButton(e) {
    logger.info('Undebate.beginButton')
    this.setState({ intro: true, stylesSet: true, allPaused: false }, () => this.onIntroEnd())
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
        if (speakingNow !== 'human') this.props.ccState.participants[speakingNow].element.current.currentTime = 0 // rewind the speaker
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

  render() {
    if (this.canNotRecordHere) return null
    const {
      className,
      classes,
      opening = {},
      bp_info = {},
      instructionLink,
      subject,
      browserConfig,
      participants,
      user,
      hangupButton = {},
      logo,
      path,
      ccState,
      micCameraConstraintsState,
      micCameraConstraintsDispatch,
      showMicCamera,
    } = this.props
    const {
      round, // from logic
      moderatorReadyToStart, // from logic
      begin, // from logic
      finishUp, // from logic
      done, // from logic
      allPaused, // from logic
      isRecording,
      requestPermission,
      talkative,
      warmup,
      intro,
      seatStyle,
      agendaStyle,
      buttonBarStyle,
      recorderButtonBarStyle,
      stylesSet,
      isPortraitPhoneRecording,
      hungUp,
      preFetchQueue,
      name,
      firstName,
      lastName,
      fontSize,
      stalled,
      waitingPercent,
      totalSize_before_hangup,
      countDown,
      left,
    } = this.state

    const { reviewing } = ccState

    const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const humanSpeaking = this.speakingNow() === 'human'
    const ifShowPreamble = this.props.ccState.participants.human && !opening.noPreamble && !intro && !begin && !done
    const bot = browserConfig.type === 'bot'

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

    const waitingOnModeratorOverlay = () =>
      begin &&
      !moderatorReadyToStart && (
        <div className={cx(classes['outerBox'], classes['beginBox'])}>
          <div style={{ width: '100%', height: '100%', display: 'table', backgroundColor: 'rgba(255,255,255,0.8)' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
              <div>
                <span className={classes['thanks']}>Waiting for the video to download before we begin.</span>
              </div>
              <div>
                <span className={classes['thanks']}>{preFetchQueue}</span>
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

    var videoBox = (participant, i, seatStyle) => {
      if (!this.props.ccState.participants[participant].element) return null // we don't have room for this participant
      let chair = this.seat(i)
      const style = seatStyle[chair]
      let participant_name
      if (participant === 'human') {
        if (bp_info.candidate_name) participant_name = bp_info.candidate_name
        else if (name) participant_name = name
        else if (firstName || lastName) participant_name = firstName + ' ' + lastName
      } else participant_name = participants[participant].name
      /*src={"https://www.youtube.com/embed/"+getYouTubeID(this.props.ccState.participants[participant].listeningObjectURL)+"?enablejsapi=1&autoplay=1&loop=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0"}*/
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
              src={
                (this.props.ccState.participants[participant] &&
                  this.props.ccState.participants[participant].placeholderUrl) ||
                undefined
              }
            ></img>
          </div>
          {bot ? null : participant !== 'human' && this.props.ccState.participants[participant].youtube ? (
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
                ref={this.props.ccState.participants[participant].element}
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
            <span>{this.seatToName[this.seat(i)] + ': '}</span>
            <span>{participant_name}</span>
          </div>
        </div>
      )
    }

    const buttonBar = buttonBarStyle =>
      (bot || (begin && intro && !finishUp && !done)) && (
        <div style={buttonBarStyle} className={classes['']} key="buttonBar">
          {this.buttons.map(button => (
            <div
              style={{
                width: 100 / this.buttons.length + '%',
                display: 'inline-block',
                height: '100%',
                textAlign: 'center',
              }}
              title={button.title()}
              key={button.title()}
            >
              <div onClick={button.func.bind(this)}>
                {button.disabled && button.disabled()
                  ? button.name(classes.iconButtonDisabled)
                  : button.name(classes.iconButton)}
              </div>
            </div>
          ))}
        </div>
      )

    const recorderButtonBar = recorderButtonBarStyle =>
      this.props.ccState.participants.human &&
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
                <div disabled={button.disabled && button.disabled()} onClick={button.func.bind(this)}>
                  {button.name(classes.iconButton)}
                </div>
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
      this.props.ccState.participants.human && (
        <div className={classes['hangUpButton']}>
          <button
            onClick={this.hangup}
            key="hangup"
            title={hangupButton.title || 'Stop recording and delete all video stored in the browser.'}
          >
            {hangupButton.name || 'Hang Up'}
          </button>
          {totalSize_before_hangup ? (
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

    const micButton = () =>
      showMicCamera &&
      participants.human &&
      typeof micCameraConstraintsState.micIndex !== 'undefined' && (
        <div
          style={{
            zIndex: 10,
            position: 'absolute',
            bottom: '1em',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              marginLeft: '1em',
              border: '1px solid #808080',
              borderRadius: '3px',
              padding: '.1em',
              cursor: 'pointer',
              pointerEvents: 'auto',
              verticalAlign: 'text-bottom',
            }}
            title={
              micCameraConstraintsState.audioinputs[micCameraConstraintsState.micIndex] &&
              micCameraConstraintsState.audioinputs[micCameraConstraintsState.micIndex].label
            }
            onClick={() => micCameraConstraintsDispatch({ type: micCameraConstraintsDispatch.TYPES.NextMic })}
          >
            Change Mic
          </div>
          <div style={{ display: 'inline-block', width: '10vw', height: '1.5em', verticalAlign: 'text-bottom' }}>
            <ReactMicMeter
              constraints={micCameraConstraintsState.constraints}
              color={'green'}
              style={{ backgroundColor: 'white' }}
            />
          </div>
        </div>
      )

    const cameraButton = () =>
      showMicCamera &&
      participants.human &&
      typeof micCameraConstraintsState.cameraIndex !== 'undefined' && (
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
          title={
            micCameraConstraintsState.videoinputs[micCameraConstraintsState.cameraIndex] &&
            micCameraConstraintsState.videoinputs[micCameraConstraintsState.cameraIndex].label
          }
          onClick={() => micCameraConstraintsDispatch({ type: micCameraConstraintsDispatch.TYPES.NextCamera })}
        >
          Change Camera
        </div>
      )

    var videos = () =>
      !done && (
        <>
          <ConversationHeader subject={subject} bp_info={bp_info} logo={logo} />
          <div className={classes['outerBox']}>
            {Object.keys(participants).map((participant, i) => videoBox(participant, i, seatStyle))}
            <Agenda
              className={cx(
                classes['agenda'],
                stylesSet && classes['stylesSet'],
                finishUp && classes['finishUp'],
                begin && classes['begin'],
                !intro && classes['intro']
              )}
              style={agendaStyle}
              agendaItem={
                (participants.moderator && participants.moderator.agenda && participants.moderator.agenda[round]) ||
                (this.props.agenda && this.props.agenda[round])
              }
              prevSection={this.prevSection.bind(this)}
              nextSection={this.nextSection.bind(this)}
            />
          </div>
          <div
            className={cx(
              classes['countdown'],
              humanSpeaking &&
                this.getTimeLimit() &&
                (this.rerecord || !this.props.ccState.participants.human.speakingObjectURLs[round]) &&
                classes['counting'],
              talkative && classes['talkative'],
              warmup && classes['warmup']
            )}
          >
            {(warmup ? '-' : '') + TimeFormat.fromS(Math.round(countDown), 'mm:ss')}
          </div>
        </>
      )

    return (
      <div style={{ fontSize: fontSize }} className={classes['wrapper']}>
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
          <>
            <ReactCameraRecorder
              ref={this.getCamera}
              onCanNotRecordHere={status => (
                props.dispatch({ type: props.dispatch.TYPES.CanNotRecordHere }), (this.canNotRecordHere = status)
              )}
              onCameraStream={stream => (this.cameraStream = stream)}
              onCameraChange={() => this.nextMediaState('human')}
              constraints={micCameraConstraintsState.constraints}
            />
            {cameraButton()}
            {micButton()}
          </>
        )}
        <section
          id="syn-ask-webrtc"
          key="began"
          className={classes['innerWrapper']}
          style={{ left: left }}
          ref={this.calculatePositionAndStyle}
        >
          {videos()}
          {buttonBar(buttonBarStyle)}
          {/*recorderButtonBar(recorderButtonBarStyle)*/}
          {permissionOverlay()}
          {waitingOnModeratorOverlay()}
          {renderHangupButton()}
          {recordingPlaceholderBar()}
        </section>
      </div>
    )
  }
}

const styles = {
  innerWrapper: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    //backgroundImage: 'url(/assets/images/marble_table_top.png)',
    //backgroundSize: 'cover',
    backgroundColor: 'white',
    overflow: 'hidden',
    fontFamily: "'Montserrat', sans-serif",
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
    backgroundColor: 'white', // this color is taken to match the the background image if you change the image, you should re-evaluate this color
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
  outerBox: {
    display: 'block',
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
  },
  beginBox: {
    position: 'absolute',
    top: 0,
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
    color: 'white',
    'font-weight': 'normal',
    'font-size': '2rem',
    'padding-top': '0.25rem',
    'padding-bottom': '0.25rem',
    'line-height': '3rem',
    'background-color': 'black',
    color: 'white',
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
      //transition: `${IntroTransition}`,
    },
    '&$intro': {
      top: `calc( -1 * 25vw *  ${HDRatio} -${TopMargin})`,
      left: '100vw',
    },
  },
  thanks: {
    'font-size': '200%',
    'font-weight': '600',
  },
  begin: {
    transition: `${IntroTransition}`,
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
  iconButton: {
    color: 'white',
    pointerEvents: 'auto',
    '& rect': {
      stroke: '#000',
      fill: '#000',
    },
    '& rect:hover': {
      fill: '	#565656',
    },
    '& circle:hover': {
      fill: '	#565656',
    },
  },
  iconButtonDisabled: {
    cursor: 'no-drop',
    '& rect': {
      stroke: '#878686',
      fill: '#878686',
    },
    '& circle': {
      stroke: '#878686',
      fill: '#878686',
    },
  },
  buttonBar: {
    //display: "table",
    textAlign: 'center',
    position: 'absolute',
    width: '35vw',
    left: '25vw',
    //top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
    height: '10vh',
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
}

export default injectSheet(styles)(ViewerRecorder)
