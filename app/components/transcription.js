import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

function getSeconds(wordTimeObj) {
  return parseFloat(wordTimeObj.seconds + '.' + wordTimeObj.nanos)
}

const windowSeconds = 0
const defaultFontSize = 1.75

function withinTime(wordObj, currentTime) {
  let startTime = getSeconds(wordObj.startTime)
  let endTime = getSeconds(wordObj.endTime)
  return currentTime >= startTime - windowSeconds && currentTime <= endTime + windowSeconds
}

const Transcription = ({ transcript, element }) => {
  const classes = useStyles()
  const { transcription } = classes
  const [currentTime, setCurrentTime] = useState(0)
  const outerRef = useRef(null)
  const [fontSize, setFontSize] = useState(defaultFontSize)

  useEffect(() => {
    var timer
    const onPlay = e => {
      if (!timer) timer = setInterval(() => setCurrentTime(element.currentTime), 100) // in case it gets called more than once don't set multiple timers
      setCurrentTime(element.currentTime)
    }
    element && element.addEventListener('play', onPlay)
    if (element && element.currentTime > 0) {
      //it's already started playing when this got called
      onPlay({})
    }
    return () => {
      clearInterval(timer)
      element.removeEventListener('play', onPlay)
    }
  }, [transcript, element])

  useLayoutEffect(() => {
    // when we swtich to a new transcript, after we have shrunk the fontSize for the previous transcription, when we need go back to the default font size because the new one may fit. But then we need to shrink if it doesn't
    if (fontSize != defaultFontSize) setFontSize(defaultFontSize)
  }, [transcript])

  useLayoutEffect(() => {
    if (fontSize != defaultFontSize) return // the transcript has changed but the fontSize has not been reset yet
    const rect = outerRef.current.getBoundingClientRect()
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    if (rect.bottom > vh) {
      setFontSize(defaultFontSize * ((vh - rect.top) / rect.height))
    }
  }, [transcript, fontSize])

  return (
    <div className={transcription} ref={outerRef} style={{ fontSize: fontSize + 'rem' }}>
      {transcript &&
        transcript.words &&
        transcript.words.map(wordObj => (
          <div
            className={cx(
              classes.word,
              withinTime(wordObj, currentTime) && classes.litWord,
              wordObj.word.slice(-1) === '.' && classes.sentenceEnd
            )}
          >
            {wordObj.word}
          </div>
        ))}
    </div>
  )
}

export default Transcription

const useStyles = createUseStyles({
  transcription: {
    textAlign: 'justify',
  },
  word: {
    color: '#333333',
    padding: '0.1em',
    fontWeight: 'normal',
    display: 'inline-block',
  },
  litWord: {
    backgroundColor: 'yellow',
    color: 'black',
  },
  sentenceEnd: {
    paddingRight: '0.25em',
  },
})
