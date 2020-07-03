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
})

const word = ({ isLit, children }) => {
  const classes = useStyles()
  const { word, litWord } = classes
  return <span className={isLit ? cx(word, litWord) : word}>{children}</span>
}

const Transcription = ({ transcriptionJson }) => {
  const classes = useStyles()
  const { transcription } = classes
  //let words = transcriptionJson.map(w)
  console.log(transcriptionJson)
  return <div className={transcription}>hello</div>
}

export default Transcription
