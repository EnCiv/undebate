'use strict;'
import React, { useReducer, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import WrappedCandidatePreamble from './candidate-preamble'
import { Ending, HungUp } from './ending'
import CanNotRecordHere from './can-not-record-here'
import ViewerRecorder from './viewer-recorder'
import Precheck from './precheck'
import useMicCameraConstraints from './mic-camera-constraints'

const pages = {
  CandidatePreamble: WrappedCandidatePreamble,
  Ending: Ending,
  CanNotRecordHere: CanNotRecordHere,
  ViewerRecorder: ViewerRecorder,
  HungUp: HungUp,
  Precheck: Precheck,
}

function reducer(state, action) {
  switch (action.type) {
    case 'HangUp':
      return { ...state, pageToShow: 'HungUp' }
    case 'CanNotRecordHere':
      return { ...state, pageToShow: 'CanNotRecordHere' }
    case 'ReviewIt':
      return { ...state, pageToShow: 'ViewerRecorder', reviewing: true }
    case 'Next':
      switch (state.pageToShow) {
        case 'CandidatePreamble':
          return { ...state, pageToShow: 'Precheck' }
        case 'Precheck':
          return { ...state, pageToShow: 'ViewerRecorder' }
        case 'HungUp':
        case 'Ending':
        case 'CanNotRecordHere':
          return state
        case 'ViewerRecorder':
          return { ...state, pageToShow: 'Ending' }
      }
    default:
      throw new Error()
  }
}

function CcWrapper(props) {
  const classes = useStyles()
  const [ccState, dispatch] = useReducer(reducer, {
    pageToShow: props.participants.human ? 'CandidatePreamble' : 'ViewerRecorder',
    reviewing: false, // true then ViewerRecorder is in review mode rather than record mode
    participants: {}, // this is written directly by ViewerRecorder to preserve stored video, and computed video url, referenced by Ending to upload the videos
  })
  const Page = pages[ccState.pageToShow]
  const [micCameraConstraintsState, micCameraConstraintsDispatch] = useMicCameraConstraints()
  return (
    <div className={cx(classes['wrapper'], ccState.pageToShow !== 'ViewerRecorder' && classes['scrollable'])}>
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
