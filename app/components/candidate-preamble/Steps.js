'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'

const useStyles = createUseStyles({
  Steps: {
    display: 'flex',
    flexDirection: 'column',
  },
  step: {
    border: '1px solid gray',
  },
})
function Steps({}) {
  const classes = useStyles()

  return (
    <ul className={classes.Steps}>
      <li className={classes.step}>
        <div>
          {' '}
          <h3>Record</h3>
          <p>
            When you start recording, an onscreen moderator will ask a series of questions, and you{"'"}ll be prompted
            to record your answers.
          </p>
        </div>
      </li>
      <li className={classes.step}>
        <div>
          {' '}
          <h3>Record</h3>
          <p>
            When you start recording, an onscreen moderator will ask a series of questions, and you{"'"}ll be prompted
            to record your answers.
          </p>
        </div>
      </li>
    </ul>
  )
}
export default Steps
