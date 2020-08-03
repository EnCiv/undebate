'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'
import OrangeButton from '../OrangeButton'

const useStyles = createUseStyles({
  buttonStyles: {
    '& button, & a': {
      border: 'none !important',
      borderRadius: '0.2em',
      fontSize: '2rem',
      paddingLeft: '2em !important',
      paddingRight: '2em !important',
    },
  },
})

function StartRecordingButton({ isPortrait, bp_info, onClick }) {
  const classes = useStyles()

  return (
    <div className={classes.buttonStyles}>
      <OrangeButton onClick={onClick}> Start Recording</OrangeButton>
    </div>
  )
}
export default StartRecordingButton
