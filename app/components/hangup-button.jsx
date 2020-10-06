'use strict;'
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import IconDeleteRecording from '../svgr/delete-recording'

function valueOf(valOrFunc) {
  return typeof valOrFunc === 'function' ? valOrFunc() : valOrFunc
}

export default function HangupButton({ style, className, title, disabled, onClick, interrogateIf, question }) {
  const classes = useStyles()
  const [showPopUp, setShowPopUp] = useState(false)
  const interrogate = () => {
    if (!interrogateIf || (interrogateIf && showPopUp)) return onClick && onClick()
    else setShowPopUp(true)
  }

  return (
    <div
      className={className}
      style={Object.assign(
        {},
        {
          display: 'inline-block',
          height: '100%',
          textAlign: 'center',
        },
        style
      )}
      title={valueOf(title)}
    >
      <div style={{ width: '100%', height: '100%' }} onClick={interrogate}>
        <IconDeleteRecording
          width="100%"
          height="100%"
          className={cx(classes.iconButton, valueOf(disabled) && classes.iconButtonDisabled)}
        />
      </div>
      {interrogateIf && showPopUp ? (
        <div className={classes['hangUpButtonReally']}>
          {question ||
            'You have recorded video, did you really want to exit and delete it, rather than finish this and post it?'}
          <div className={classes['hangUpButtonReallyClose']} onClick={() => setShowPopUp(false)}>
            x
          </div>
        </div>
      ) : null}
    </div>
  )
}

const useStyles = createUseStyles({
  iconButton: {
    pointer: 'cursor',
    display: 'inline-block',
    verticalAlign: 'top',
    height: '100%',
    width: '100%',
    fontSize: 'inherit',
    textAlign: 'center',
    '-webkit-appearance': 'none',
    // 'border-radius': "1px",
    backgroundColor: 'rgba(0, 0, 0, 0)',
    overflow: 'hidden',
    textOverflow: 'clip',
    color: 'white',
    pointerEvents: 'auto',
    '& rect': {
      stroke: '#000',
      fill: '#000',
    },
    '& rect:hover': {
      fill: '	#565656',
    },
    '& circle:hover': {
      fill: '	#565656',
    },
  },
  iconButtonDisabled: {
    cursor: 'no-drop',
    '& rect': {
      stroke: '#878686',
      fill: '#878686',
    },
    '& circle': {
      stroke: '#878686',
      fill: '#878686',
    },
  },
  hangUpButtonReally: {
    cursor: 'pointer',
    display: 'inline-block',
    position: 'absolute',
    right: '1rem',
    width: '200%',
    height: 'auto',
    bottom: '100%',
    backgroundColor: 'white',
    color: 'red',
    borderRadius: '7px',
    borderWidth: '2px',
    borderColor: 'black',
    borderStyle: 'solid',
    padding: '0.5rem',
  },
  hangUpButtonReallyClose: {
    top: 0,
    right: 0,
    position: 'absolute',
    marginRight: '0.2rem',
    cursor: 'pointer',
    pointerEvents: 'auto',
  },
})
