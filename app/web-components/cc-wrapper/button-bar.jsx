'use strict;'
import React from 'react'
import { createUseStyles } from 'react-jss'

import IconPrevSpeaker from '../../svgr/prev-speaker-icon'
import IconPrevSection from '../../svgr/prev-section-icon'
import IconPlay from '../../svgr/play-icon'
import IconPause from '../../svgr/pause-icon'
import IconStop from '../../svgr/stop-icon'
import IconSkipSpeaker from '../../svgr/next-speaker-icon'
import IconNextSection from '../../svgr/next-section-icon'
import IconRedo from '../../svgr/redo-icon'
import IconFinishRecording from '../../svgr/finish-speaking-icon'
import IconRecording from '../../svgr/icon-recording'

const buttonWidthInDiv = '80%'
const buttonHeightInDiv = buttonWidthInDiv

export default function ButtonBar(props) {
  const classes = useStyles()
  const { style, buttonLogic, allPaused, isRecording } = props

  const renderButtons = {
    rerecord: {
      name: className => <IconRedo width={buttonWidthInDiv} height={buttonHeightInDiv} className={className} />,
      title: () => 'Re-record',
    },
    prevSection: {
      name: className => <IconPrevSection width={buttonWidthInDiv} height={buttonHeightInDiv} className={className} />,
      title: () => 'Previous Question',
    },
    prevSpeaker: {
      name: className => <IconPrevSpeaker width={buttonWidthInDiv} height={buttonHeightInDiv} className={className} />,
      title: () => 'Previous Speaker',
    },
    allPause: {
      name: className =>
        isRecording ? (
          <IconStop width={buttonWidthInDiv} height={buttonHeightInDiv} className={className} />
        ) : allPaused ? (
          <IconPlay width={buttonWidthInDiv} height={buttonHeightInDiv} className={className} />
        ) : (
          <IconPause width={buttonWidthInDiv} height={buttonHeightInDiv} className={className} />
        ),
      title: () => (isRecording ? 'Stop' : allPaused ? 'Play' : 'Pause'),
    },
    nextSpeaker: {
      name: className => <IconSkipSpeaker width={buttonWidthInDiv} height={buttonHeightInDiv} className={className} />,
      title: () => 'Next Speaker',
    },
    nextSection: {
      name: className => <IconNextSection width={buttonWidthInDiv} height={buttonHeightInDiv} className={className} />,
      title: () => 'Next Question',
    },
    finishedSpeaking: {
      name: className => (
        <IconFinishRecording width={buttonWidthInDiv} height={buttonHeightInDiv} className={className} />
      ),
      title: () => 'Done Speaking',
    },
  }

  const buttons = Object.keys(buttonLogic).reduce(
    (obj, key) => ((obj[key] = Object.assign({}, buttonLogic[key], renderButtons[key])), obj),
    {}
  )

  const width = 100 / Object.keys(buttons).length + '%'
  return (
    <div style={style} className={classes['buttonBar']} key="buttonBar">
      {Object.values(buttons).map((button, i) => (
        <div
          style={{
            width,
            display: 'inline-block',
            height: '100%',
            textAlign: 'center',
          }}
          title={button.title && button.title()}
          key={(button.title && button.title()) || 'empty' + i}
        >
          <div onClick={button.disabled && button.disabled() ? null : button.func}>
            {button.name &&
              (button.disabled && button.disabled()
                ? button.name(classes.iconButtonDisabled)
                : button.name(classes.iconButton))}
          </div>
        </div>
      ))}
    </div>
  )
}

const useStyles = createUseStyles({
  buttonBar: {
    //display: "table",
    textAlign: 'center',
    overflow: 'hidden',
    'text-overflow': 'clip',
    '& button': {
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
    },
  },
  iconButton: {
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
    '&:hover': {
      cursor: 'pointer',
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
})
