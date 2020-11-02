'use strict;'
import React, { useEffect, useState } from 'react'

const MicMeterRefreshIntervalMS = 100 // milliseconds

const ReactMicMeter = ({
  style = {},
  color = 'green',
  constraints = {
    audio: {
      echoCancellation: { exact: true },
    },
  },
}) => {
  const [averageVolume, setAverageVolume] = useState(0)
  const audioOnly = { audio: { ...constraints.audio, noiseSuppression: true } }
  const [thisHook, neverSetThisHook] = useState({
    interval: undefined,
    audioContext: undefined,
    analyser: undefined,
    microphone: undefined,
    javascriptNode: undefined,
  })

  const startMeter = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(audioOnly)
    try {
      thisHook.audioContext = new AudioContext()
      thisHook.analyser = thisHook.audioContext.createAnalyser()
      thisHook.microphone = thisHook.audioContext.createMediaStreamSource(stream)
      thisHook.javascriptNode = thisHook.audioContext.createScriptProcessor(2048, 1, 1)

      thisHook.analyser.smoothingTimeConstant = 0.8
      thisHook.analyser.fftSize = 1024

      thisHook.microphone.connect(thisHook.analyser)
      thisHook.analyser.connect(thisHook.javascriptNode)
      let sum = 0
      let length = 0
      let max = 100
      thisHook.javascriptNode.connect(thisHook.audioContext.destination)
      thisHook.javascriptNode.onaudioprocess = () => {
        if (!thisHook.analyser) return // cleanup happened but there was still more events in the queue
        let array = new Uint8Array(thisHook.analyser.frequencyBinCount)
        thisHook.analyser.getByteFrequencyData(array)
        sum += array.reduce((sum, val) => sum + val, 0)
        length += array.length
      }
      const readMeter = () => {
        // the analyser gets data very often and we don't want to overload the CPU with rerenders
        let average = sum / length
        // mostly the average is below 100 but when you make a loud noise it may jump up
        // probably this is some interaction with the automatic gain control - but in our meter - we don't want it jumping out of the box
        // so we scale it down based on the max average value if over 100
        if (average > max) {
          max = average
        }
        average = (average / max) * 100
        sum = 0
        length = 0
        setAverageVolume(average)
      }
      if (!thisHook.interval) thisHook.interval = setInterval(readMeter, MicMeterRefreshIntervalMS)
    } catch (error) {
      logger.error('micValues caught error:', error)
    }
  }

  useEffect(() => {
    startMeter()
    return () => {
      if (thisHook.audioContext) {
        try {
          thisHook.microphone.disconnect(thisHook.analyser)
          thisHook.analyser.disconnect(thisHook.javascriptNode)
          thisHook.javascriptNode.disconnect(thisHook.audioContext.destination)
          // make sure these are freed up
          thisHook.audioContext = undefined
          thisHook.analyser = undefined
          thisHook.microphone = undefined
          thisHook.javascriptNode = undefined
        } catch (err) {
          logger.info('React Mic Meter caught error on cleanup, ignoring', err)
        }
      }
      if (thisHook.interval) {
        clearInterval(thisHook.interval)
        thisHook.interval = undefined
      }
    }
  }, [constraints])

  return (
    <div
      style={{
        border: '1px solid #808080',
        borderRadius: '3px',
        color: 'black',
        backgroundColor: 'white',
        ...style,
        width: '100%',
        height: '100%',
      }}
    >
      <p style={{ height: '100%', width: averageVolume + '%', backgroundColor: color, margin: 0, padding: 0 }}></p>
    </div>
  )
}
export default ReactMicMeter
