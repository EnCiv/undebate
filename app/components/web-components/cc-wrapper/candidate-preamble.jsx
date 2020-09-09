'use strict;'
import React, { useReducer, useMemo } from 'react'
import CandidatePreamble from '../../candidate-preamble'

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
        dispatch({ type: 'Next' })
      }}
      candidate_questions={participants.moderator.agenda}
      instructionLink={instructionLink}
      timeLimits={participants.moderator.timeLimits}
    />
  )
}

export default WrappedCandidatePreamble
