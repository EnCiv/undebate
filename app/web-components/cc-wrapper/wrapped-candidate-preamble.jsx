'use strict;'
import React, { useReducer, useMemo } from 'react'
import CandidatePreamble from '../../components/candidate-preamble'

// don't want to rewire Candidate Preamble yet so here's a wrapper for now
const WrappedCandidatePreamble = props => {
  const { subject, bp_info = {}, participants, instructionLink, logo, dispatch } = props
  return (
    <CandidatePreamble
      subject={subject}
      bp_info={bp_info}
      agreed={false}
      onClick={() => {
        logger.info('CcWrapped preambleAgreed true')
        dispatch({ type: dispatch.TYPES.Next })
      }}
      candidate_questions={participants.moderator.agenda}
      instructionLink={instructionLink}
      timeLimits={participants.moderator.timeLimits}
      logo={logo}
    />
  )
}

export default WrappedCandidatePreamble
