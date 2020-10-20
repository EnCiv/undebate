'use strict'

/**
 * This function will render a div, with it's children, and adjust the fontSize of the div so that it's bottom doesn't go below bottom
 *
 * ref = the useRef of the element that needs to fit
 * startFontSize = is the fontSize to start with. It should be a number of rem's.  If this font fits, no change is made. If it's too big, the iteration process begins
 * bottom = the bottom px measure not to go below  - as in clientBoundingRect().bottom of the ref you don't want to go below
 * dependents = and array [] of variables that should trigger a recalculation if they change
 *
 */
import React, { useState, useLayoutEffect, useRef } from 'react'

export default function FitFontToBottom({ className, style = {}, startFontSize, bottom, dependents, children }) {
  const ref = useRef(null)
  const [fontSize, setFontSize] = useState(startFontSize)
  const [fontResolved, setFontResolved] = useState(false)
  const [highFontSize, setHighFontSize] = useState(startFontSize)
  const [lowFontSize, setLowFontSize] = useState(0)

  useLayoutEffect(() => {
    // when we switch to a new transcript, after we have shrunk the fontSize for the previous transcription, when we need go back to the default font size because the new one may fit. But then we need to shrink if it doesn't
    if (fontResolved) {
      setFontSize(startFontSize)
      setLowFontSize(0)
      setHighFontSize(startFontSize)
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
      if (fontSize >= startFontSize || Math.abs(highFontSize - lowFontSize) < 0.01) setFontResolved(true)
      else {
        setLowFontSize(fontSize)
        setFontSize((highFontSize - fontSize) / 2 + fontSize)
      }
    }
  }, [...dependents, fontSize, fontResolved, highFontSize, lowFontSize])

  return (
    <div className={className} style={{ ...style, fontSize: fontSize + 'rem' }} ref={ref}>
      {children}
    </div>
  )
}
