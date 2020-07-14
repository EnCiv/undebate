import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  litWord: {
    color: 'pink',
  },
  word: {
    color: '#333333',
  },
  transcription: {},
  word: {
    padding: '0.1em',
    fontWeight: 'normal',
    display: 'inline-block',
  },
})

const word = ({ isLit, children }) => {
  const classes = useStyles()
  const { word, litWord } = classes
  return <span className={isLit ? cx(word, litWord) : word}>{children}</span>
}

const Transcription = ({ round, transcriptions }) => {
  const classes = useStyles()
  const { transcription } = classes
  console.log(transcriptions)
  return (
    <div className={transcription}>
      {transcriptions &&
        transcriptions[round] &&
        transcriptions[round].words &&
        transcriptions[round].words.map(wordObj => <div className={classes.word}>{wordObj.word}</div>)}
    </div>
  )
}

export default Transcription
