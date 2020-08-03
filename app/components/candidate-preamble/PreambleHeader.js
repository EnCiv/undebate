'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'
import StartRecordingButton from './StartRecordingButton'

const useStyles = createUseStyles({
  'Preamble-inner': {
    marginTop: '6vh',
    // need to have someting here for portrait mode - but don't record in portrait mode for now.
  },
  portrait: {
    marginTop: '20vh',
  },
})
function PreambleHeader({ isPortrait, bp_info, onClickStartRecording }) {
  return (
    <div>
      <h2>
        Welcome{' '}
        {bp_info && bp_info.candidate_name ? (
          <span style={{ fontSize: '150%', fontWeight: 'bold' }}>{bp_info.candidate_name}</span>
        ) : (
          ''
        )}
        !
      </h2>
      <h3>
        Thanks for recording a Candidate Conversation. Recording should be done in one session, and takes about 15
        minutes.
      </h3>
      <StartRecordingButton onClick={onClickStartRecording} />
    </div>
  )
}
export default PreambleHeader
