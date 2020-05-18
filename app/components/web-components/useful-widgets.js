import React, { useState, useEffect } from 'react'
export const DownCounter = ({ seconds, doAfter, doFirst }) => {
  let [timeRemaining, setTimer] = useState(seconds)
  if (seconds === timeRemaining && typeof doFirst === 'function') doFirst()

  if (timeRemaining === seconds) {
    let oneSecInterval = setInterval(() => {
      setTimer(--timeRemaining)
      console.log(timeRemaining)
      if (timeRemaining === 0) return clearInterval(oneSecInterval)
    }, 1000)
  }

  useEffect(() => {
    if (timeRemaining === 0) {
      typeof doAfter === 'function' && doAfter()
      console.log('doAfter')
    }

    console.count('useEffect')
  }, [timeRemaining])

  const numberAnimation = `
  @keyframes shrinknum{
    0%{ 
      font-size:1.3em;
      font-weight:400;
      color: red;

    }
    75%{
      font-size:1em;
      font-weight:600;
      color: black;
    }
    100%{
      color: #FFFFFF;
    }
  }
  `
  const blinkingAnimation = `
  @keyframes blinknum{
    0%{ 
      font-weight:400;
      color: red;

    }
    100%{
      font-weight:600;
      color: #FFFFF;
    }
  }
  `
  const countDown = {
    animationDuration: '1s',
    animationIterationCount: seconds + 1,
    animationName: 'shrinknum',
    animationTimingFunction: 'cubic-bezier(0.1, -0.6, 0.2, 0)',
    verticalAlign: 'bottom',
  }

  const countDownDone = {
    animationDuration: '0.8s',
    animationIterationCount: 'infinite',
    animationName: 'blinknum',
    animationTimingFunction: 'cubic-bezier(0.1, -0.6, 0.2, 0)',
    verticalAlign: 'bottom',
  }
  let animationChoice = timeRemaining === 0 ? countDownDone : countDown
  return (
    <>
      <style children={timeRemaining === 0 ? blinkingAnimation : numberAnimation} />
      <span
        className="counter"
        style={{
          ...animationChoice,
        }}
      >
        {timeRemaining}
      </span>
    </>
  )
}
