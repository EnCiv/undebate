'use strict;'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'

const ReactMicMeter = ({
  style,
  constraints = {
    audio: {
      echoCancellation: { exact: true },
    },
  },
}) => {
  // can use a context to add average values to then output them here.
  //const [volume, setVol] = useState(0)
  const [{ sourceAudioContext, sourceMicrophone, sourceAnalyser, scriptNode }, setAudioContext] = useState({
    sourceAudioContext: null,
    sourceMicrophone: null,
    scriptNode: null,
    sourceAnalyser: null,
  })
  const [averageVolume, setAverageVolume] = useState(0)
  const audioOnly = { audio: { ...constraints.audio, noiseSuppression: true } }
  const [reactThis, neverSetReactThis] = useState({
    interval: undefined,
  })

  const startAnalyzer = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(audioOnly)
    console.log(stream)
    try {
      if (sourceAudioContext) {
        await sourceMicrophone.disconnect(sourceAnalyser)
        await sourceAnalyser.disconnect(scriptNode)
        await scriptNode.disconnect(sourceAudioContext.destination)
      }
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

      analyser.smoothingTimeConstant = 0.8
      analyser.fftSize = 1024

      microphone.connect(analyser)
      analyser.connect(javascriptNode)
      let sum = 0
      let length = 0
      let max = 100
      javascriptNode.connect(audioContext.destination)
      javascriptNode.onaudioprocess = () => {
        let array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        sum += array.reduce((sum, val) => sum + val, 0)
        length += array.length
      }

      setAudioContext({
        sourceAudioContext: audioContext,
        sourceMicrophone: microphone,
        scriptNode: javascriptNode,
        sourceAnalyser: analyser,
      })
      if (!reactThis.interval)
        reactThis.interval = setInterval(() => {
          // the analyzer gets data very often and we don't want to overload the CPU with rerenders
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
        }, 100)
    } catch (error) {
      logger.error('micValues caught error:', error)
    }
  }

  useEffect(() => {
    startAnalyzer()
    return () => {
      if (reactThis.interval) {
        clearInterval(reactThis.interval)
        reactThis.interval = undefined
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
        width: '100%',
        height: '100%',
      }}
    >
      <p style={{ height: '100%', width: averageVolume + '%', backgroundColor: 'green', margin: 0, padding: 0 }}></p>
    </div>
  )
}
export default ReactMicMeter
