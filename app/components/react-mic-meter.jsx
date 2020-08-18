'use strict;'
import React, { useContext, useEffect, createContext, useState } from 'react'
import { createUseStyles } from 'react-jss'

//export let averageVolume = 0

const defaultValue = {
  averageVolume: 0,
}

const AppAudioContext = createContext(defaultValue)
export const AppAudioProvider = ({ children, value }) => {
  let [averageVolume, setAverageVolume] = useState(value ? value.averageVolume : 0)
  const store = {
    averageVolume: [averageVolume, setAverageVolume],
  }
  return <AppAudioContext.Provider value={store}>{children}</AppAudioContext.Provider>
}

export const useAverageVolume = () => {
  const {
    averageVolume: [averageVolume, setAverageVolume],
  } = useContext(AppAudioContext)
  return { averageVolume, setAverageVolume }
}

export const ChangeMic = ({
  audioinputs,
  getCameraStream,
  micIndex,
  nextMic,
  calcConstraints = {
    audio: {
      echoCancellation: { exact: true },
    },
    video: {
      width: 640,
      height: 360,
    },
  },
}) => {
  // can use a context to add average values to then output them here.
  //const [volume, setVol] = useState(0)
  const { averageVolume, setAverageVolume } = useAverageVolume()
  //async function micValues(constraints) {
  const audioOnly = { audio: { ...calcConstraints.audio, noiseSuppression: true } }

  //console.log('avgVol', averageVolume)
  useEffect(async () => {
    //setVol(avgVol)
    console.log('useEffect...')
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
        //console.log('onaudioprocess')
        var array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        var values = 0

        var length = array.length
        for (var i = 0; i < length; i++) {
          values += array[i]
        }

        var average = values / length
        //averageVolume = average
        setAverageVolume(average)

        //console.log(Math.round(average))
        // colorPids(average);
      }
    } catch (error) {
      logger.error('micValues caught error:', error)
    }
    //}
    try {
      //micValues(calcConstraints)
    } catch (error) {
      console.log(error)
    }
  }, [])
  return typeof micIndex !== 'undefined' && getCameraStream ? (
    <div
      style={{
        zIndex: 10,
        margin: '1em',
        border: '1px solid #808080',
        borderRadius: '3px',
        padding: '.1em',
        cursor: 'pointer',
        pointerEvents: 'auto',
        position: 'absolute',
        bottom: '1em',
      }}
      title={audioinputs[micIndex] && audioinputs[micIndex].label}
      onClick={nextMic}
    >
      {audioinputs.length > 0 ? audioinputs.map(input => <div>{input.label}</div>) : 'hello'}
      {averageVolume}
    </div>
  ) : (
    <></>
  )
}
