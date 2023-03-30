'use strict;'
import React, { useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import WrappedCandidatePreamble from './wrapped-candidate-preamble'
import { Ending, HungUp } from './ending'
import CanNotRecordHere from './can-not-record-here'
import ViewerRecorder from './viewer-recorder'
import Precheck from './precheck'
import useMicCameraConstraints from './mic-camera-constraints'
import DynamicFontSizeHelmet from '../../components/dynamic-font-size-helmet'

const pages = {
  CandidatePreamble: WrappedCandidatePreamble,
  Ending: Ending,
  CanNotRecordHere: CanNotRecordHere,
  ViewerRecorder: ViewerRecorder,
  HungUp: HungUp,
  Precheck: Precheck,
}

const PTS = Object.keys(pages).reduce((PTS, k) => ((PTS[k] = k), PTS), {}) //

// through an error if someone tries to get a property that isn't defined
const throwIfUndefined = {
  get: function (obj, prop) {
    if (prop in obj) return obj[prop]
    throw Error('undefined action TYPE: ' + prop)
  },
}

const TYPES = new Proxy(
  {
    HangUp: 'HangUp',
    CanNotRecordHere: 'CanNotRecordHere',
    ReviewIt: 'ReviewIt',
    Next: 'Next',
  },
  throwIfUndefined
)

function reducer(state, action) {
  switch (action.type) {
    case TYPES.HangUp:
      return { ...state, pageToShow: PTS.HungUp }
    case TYPES.CanNotRecordHere:
      return { ...state, pageToShow: PTS.CanNotRecordHere }
    case TYPES.ReviewIt:
      return { ...state, pageToShow: PTS.ViewerRecorder, reviewing: true }
    case TYPES.Next:
      switch (state.pageToShow) {
        case PTS.CandidatePreamble:
          return { ...state, pageToShow: PTS.Precheck }
        case PTS.Precheck:
          return { ...state, pageToShow: PTS.ViewerRecorder }
        case PTS.HungUp:
        case PTS.Ending:
        case PTS.CanNotRecordHere:
          return state
        case PTS.ViewerRecorder:
          return { ...state, pageToShow: PTS.Ending }
      }
    default:
      throw new Error()
  }
}

function CcWrapper(props) {
  // this is for debugging - we are having a problem with socket disconnects
  if (typeof window != 'undefined') {
    window.socket.on('error', err => console.error("CcWrapper got error on socket", Date.now() - start, err.message || err))
    window.socket.on('disconnect', err => console.error("CcWrapper got disconnect on socket", Date.now() - start, err.message || err))
  }
  const classes = useStyles()
  const [ccState, dispatch] = useReducer(reducer, {
    pageToShow: props.participants.human ? PTS.CandidatePreamble : PTS.ViewerRecorder,
    reviewing: false, // true then ViewerRecorder is in review mode rather than record mode
    participants: {}, // this is written directly by ViewerRecorder to preserve stored video, and computed video url, referenced by Ending to upload the videos
  })
  dispatch.TYPES = TYPES // pass the TYPES to the children - they can't be imported from here because this includes the children
  const Page = pages[ccState.pageToShow]
  const [micCameraConstraintsState, micCameraConstraintsDispatch] = useMicCameraConstraints({
    audio: {
      echoCancellation: { exact: true },
    },
    video: {
      width: { exact: 640 },
      height: { exact: 360 },
    },
  })
  return (
    <div className={cx(classes['wrapper'], ccState.pageToShow !== PTS.ViewerRecorder && classes['scrollable'])}>
      <DynamicFontSizeHelmet />
      <Page
        {...props}
        dispatch={dispatch}
        ccState={ccState}
        micCameraConstraintsState={micCameraConstraintsState}
        micCameraConstraintsDispatch={micCameraConstraintsDispatch}
      />
    </div>
  )
}

const useStyles = createUseStyles({
  wrapper: {
    width: '100vw',
    height: '100vh',
    '&$scrollableIframe': {
      height: 'auto',
    },
    /*
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
    },*/
  },
  scrollable: {},
})

export default CcWrapper
