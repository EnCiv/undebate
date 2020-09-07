'use strict;'
import React, { useReducer, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import CandidatePreamble from '../../candidate-preamble'
import { Ending, HungUp } from './ending'
import CanNotRecordHere from './can-not-record-here'
import ViewerRecorder from './viewer-recorder'

const useStyles = createUseStyles({
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
  scrollable: {},
})

function reducer(state, action) {
  switch (action.type) {
    case 'HangUp':
      return { ...state, pageToShow: 'HungUp' }
    case 'Done':
      return { ...state, pageToShow: 'Ending' }
    case 'CanNotRecordHere':
      return { ...state, pageToShow: 'CanNotRecordHere' }
    case 'PreambleAgreed':
      return { ...state, pageToShow: 'ViewerRecorder' }
    case 'ReviewIt':
      return { ...state, pageToShow: 'ViewerRecorder' }
    default:
      throw new Error()
  }
}
// don't want to rewire Candidate Preamble yet so here's a wrapper for now
const WrappedCandidatePreamble = props => {
  const { subject, bp_info = {}, participants, instructionLink, dispatch } = props
  return (
    <CandidatePreamble
      subject={subject}
      bp_info={bp_info}
      agreed={false}
      onClick={() => {
        logger.info('CcWrapped preambleAgreed true')
        dispatch({ type: 'PreambleAgreed' })
      }}
      candidate_questions={participants.moderator.agenda}
      instructionLink={instructionLink}
      timeLimits={participants.moderator.timeLimits}
    />
  )
}

const pages = {
  CandidatePreamble: WrappedCandidatePreamble,
  Ending: Ending,
  CanNotRecordHere: CanNotRecordHere,
  ViewerRecorder: ViewerRecorder,
  HungUp: HungUp,
}

function CcWrapper(props) {
  const classes = useStyles()
  const [ccState, dispatch] = useReducer(reducer, {
    pageToShow: props.participants.human ? 'CandidatePreamble' : 'ViewerRecorder',
    participants: {}, // this is written directly by ViewerRecorder to preserve it's state
  })
  const Page = pages[ccState.pageToShow]
  return (
    <div className={cx(classes['wrapper'], ccState.pageToShow !== 'ViewerRecorder' && classes['scrollable'])}>
      <Page {...props} dispatch={dispatch} ccState={ccState} />
    </div>
  )
}

export default CcWrapper
