'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'
import StartRecordingButton from './StartRecordingButton'

const useStyles = createUseStyles({
  container: {
    padding: '1px 2em',
    color: 'white',
    backgroundColor: 'black',
    backgroundPosition: 'center center',
    backgroundImage:
      'url("https://res.cloudinary.com/hf6mryjpf/image/upload/h_200/q_auto/v1596687676/assets/Group_29.png")',
    '@media only screen and (min-width: 1800px)': {
      backgroundImage:
        'url("https://res.cloudinary.com/hf6mryjpf/image/upload/h_400/q_auto/v1596687676/assets/Group_29.png")',
    },
    backgroundSize: 'cover',
    '&>*+*': {
      marginTop: '3em',
      marginBottom: '3em',
    },
    //subtitle
    '&>h3': {
      fontSize: '1.33em',
      fontWeight: '400',
      letterSpacing: '0.005em',
    },
    //title
    '&>h2': {
      fontSize: '2.66em',
      fontWeight: '600',
      letterSpacing: '.025em',
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
        Recording your candidate conversation should be done in one session, and takes about 15 minutes. Let{"'"}s get
        started.
      </h3>
      <StartRecordingButton onClick={onClickStartRecording} />
    </div>
  )
}
export default PreambleHeader
