'use strict;'
import React from 'react'
import { createUseStyles } from 'react-jss'

export default async function micValues(constraints) {
  const audioOnly = { audio: { ...constraints.audio, noiseSuppression: true } }

  const stream = await navigator.mediaDevices.getUserMedia(audioOnly)
  try {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

    analyser.smoothingTimeConstant = 0.8
    analyser.fftSize = 1024

    microphone.connect(analyser)
    analyser.connect(javascriptNode)
    javascriptNode.connect(audioContext.destination)
    javascriptNode.onaudioprocess = () => {
      var array = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(array)
      var values = 0

      var length = array.length
      for (var i = 0; i < length; i++) {
        values += array[i]
      }

      var average = values / length

      console.log(Math.round(average))
      // colorPids(average);
    }
  } catch (error) {
    logger.error('micValues caught error:', error)
  }
}
