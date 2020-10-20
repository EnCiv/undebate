'use strict'

/**
 * this function will return a fontSize.  It will iterate through hi-low gueses of the font size, until it comes to one where the bottom of ref is not below bottom.
 *
 * ref = the useRef of the element that needs to fit
 * minFontSize = if the calculated fontSize is bigger than minFontSize and the ref's bottom is less than bottom, the iteration is done.
 * bottom = the bottom px measure not to go below  - as in clientBoundingRect().bottom of the ref you don't want to go below
 * dependents = and array [] of variables that should trigger a recalculation if they change
 *
 */
import React, { useState, useLayoutEffect } from 'react'

export default function fitFontToRef(ref, minFontSize, bottom, dependents) {
  const [fontSize, setFontSize] = useState(minFontSize)
  const [fontResolved, setFontResolved] = useState(false)
  const [highFontSize, setHighFontSize] = useState(minFontSize)
  const [lowFontSize, setLowFontSize] = useState(0)

  useLayoutEffect(() => {
    // when we switch to a new transcript, after we have shrunk the fontSize for the previous transcription, when we need go back to the default font size because the new one may fit. But then we need to shrink if it doesn't
    if (fontResolved) {
      setFontSize(minFontSize)
      setLowFontSize(0)
      setHighFontSize(minFontSize)
      setFontResolved(false)
    }
  }, dependents)

  useLayoutEffect(() => {
    if (fontResolved) return // the transcript has changed but the fontSize has not been reset yet
    const rect = ref.current.getBoundingClientRect()
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    if (rect.bottom > bottom) {
      setHighFontSize(fontSize)
      setFontSize((fontSize - lowFontSize) / 2 + lowFontSize)
    } else {
      if (fontSize >= minFontSize || Math.abs(highFontSize - lowFontSize) < 0.01) setFontResolved(true)
      else {
        setLowFontSize(fontSize)
        setFontSize((highFontSize - fontSize) / 2 + fontSize)
      }
    }
  }, [...dependents, fontSize, fontResolved, highFontSize, lowFontSize])

  return fontSize
}
