import React, { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

function getSeconds(wordTimeObj) {
  return parseFloat(wordTimeObj.seconds + '.' + wordTimeObj.nanos)
}

function withinSentence(sentence, currentTime) {
  return currentTime >= sentence.startTime && currentTime <= sentence.endTime
}

function emptySentence() {
  return { startTime: 0, endTime: 0, words: [] }
}

const endPunctuation = ['.', '?', '!']

function timedStringsToSentences(timedStrings) {
  if (!timedStrings || !timedStrings.length) return [emptySentence()]
  return timedStrings.map(timedString => ({
    startTime: timedString.startTime,
    endTime: timedString.endTime,
    words: timedString.string.split(' ').map(w => ({
      word: w,
      startTime: timedString.startTime,
      endTime: timedString.endTime,
    })),
  }))
}

function getSentences(transcript, language) {
  if (!transcript) return [emptySentence()]
  if (transcript.languages && language && transcript.languages[language]) {
    return timedStringsToSentences(transcript.languages[language].timedStrings)
  } else if (transcript.words) {
    return transcript.words.reduce(
      (sentences, wordObj, idx, src) => {
        const lastSentence = sentences[sentences.length - 1]
        const endTime = getSeconds(wordObj.endTime)
        if (!lastSentence.startTime) lastSentence.startTime = getSeconds(wordObj.startTime)
        if (lastSentence.endTime < endTime) lastSentence.endTime = endTime
        lastSentence.words.push(wordObj)
        if (endPunctuation.includes(wordObj.word.slice(-1)) && idx < src.length - 1)
          // don't start a new sentence if this is the last word
          sentences.push(emptySentence())
        return sentences
      },
      [emptySentence()]
    )
  } else return [emptySentence()]
}

function ActiveWordDiv({ classes, wordObj, highlighted, bottom, setBottom }) {
  const ref = useRef(null)

  if (ref.current && highlighted) {
    let newBottom = ref.current.offsetTop + ref.current.offsetHeight
    if (newBottom > bottom) {
      setBottom(newBottom) // this is not a setState which can't be used to set state of another (parent) component while rendering
    }
  }
  return (
    <div
      ref={ref}
      className={cx(
        classes.word,
        highlighted && classes.litWord,
        endPunctuation.includes(wordObj.word.slice(-1)) && classes.sentenceEnd
      )}
    >
      {wordObj.word}
    </div>
  )
}

const showSentences = (classes, sentences, bottom, setBottom, currentTime) => {
  return sentences.reduce((wordDivs, sentence) => {
    sentence.words.forEach(wordObj =>
      wordDivs.push(
        <ActiveWordDiv
          classes={classes}
          highlighted={withinSentence(sentence, currentTime)}
          wordObj={wordObj}
          bottom={bottom}
          setBottom={setBottom}
        />
      )
    )
    return wordDivs
  }, [])
}

function AutoScroll({ sentences, currentTime }) {
  const classes = useStyles()
  const { transcription } = classes
  const ref = useRef()
  const [height, setHeight] = useState(0)
  const [rect, neverSetRect] = useState({ bottom: 0 })
  const [top, setTop] = useState(0)
  const bottom = rect.bottom
  const setBottom = bottom => (rect.bottom = bottom) // this won't cause a rerender

  useLayoutEffect(() => {
    let agendaContainerHeight = ref.current.offsetHeight // the height of the Agenda object
    if (height !== agendaContainerHeight) setHeight(agendaContainerHeight)
  }, [sentences, currentTime]) // the parent height may change, we should check evertime something changes

  // scroll the div up as the text as the bottom gets bigger
  useLayoutEffect(() => {
    if (bottom > top + height) setTop(bottom - height)
  }, [bottom, height])

  // reset the start
  useLayoutEffect(() => {
    setBottom(0)
    setTop(0)
  }, [sentences])

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '100%' }} ref={ref}>
      <div className={transcription} style={{ top: -top + 'px', transition: 'top 0.5s linear', position: 'absolute' }}>
        <div style={{ position: 'relative' }}>{showSentences(classes, sentences, bottom, setBottom, currentTime)}</div>
      </div>
    </div>
  )
}

const Transcription = ({ transcript, element, language }) => {
  const [currentTime, setCurrentTime] = useState(0)
  const sentences = useMemo(() => getSentences(transcript, language), [transcript, language])

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
      setCurrentTime(0)
    }
  }, [transcript, element])

  return <AutoScroll sentences={sentences} currentTime={currentTime}></AutoScroll>
}

export default Transcription

const useStyles = createUseStyles({
  transcription: {
    textAlign: 'justify',
    fontSize: '2rem',
    padding: '1rem',
    paddingTop: 0,
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
