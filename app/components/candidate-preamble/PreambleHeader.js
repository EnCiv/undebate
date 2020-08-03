'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'
import StartRecordingButton from './StartRecordingButton'

const useStyles = createUseStyles({
  container: {
    '&>*': {
      marginTop: '3em',
      marginBottom: '3em',
    },
    '&>h2': {
      fontSize: '5rem',
      marginTop: '1.5em',
      marginBottom: '1.5em',
    },
  },
  portrait: {
    //use this later
  },
})
function PreambleHeader({ isPortrait, bp_info, onClickStartRecording }) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <h2>Welcome{bp_info && bp_info.candidate_name ? <span>{' ' + bp_info.candidate_name}</span> : ''}!</h2>
      <h3>
        Thanks for recording a Candidate Conversation. Recording should be done in one session, and takes about 15
        minutes.
      </h3>
      <StartRecordingButton onClick={onClickStartRecording} />
    </div>
  )
}
export default PreambleHeader
