'use strict;'
import React, { useContext, useEffect, createContext, useState } from 'react'
import { createUseStyles } from 'react-jss'

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
  micIndex,
  switchMic,
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
  const [{ sourceAudioContext, sourceMicrophone, sourceAnalyser, scriptNode }, setAudioContext] = useState({
    sourceAudioContext: null,
    sourceMicrophone: null,
    scriptNode: null,
    sourceAnalyser: null,
  })
  const [changeMic, setChangeMic] = useState(false)
  const { averageVolume, setAverageVolume } = useAverageVolume()
  const audioOnly = { audio: { ...calcConstraints.audio, noiseSuppression: true } }

  const micValues = async () => {
    console.log('getting new mic Values for mic', micIndex)
    const stream = await navigator.mediaDevices.getUserMedia(audioOnly)
    console.log(stream)
    try {
      if (sourceAudioContext) {
        console.log('disconnecting microphone')
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
      javascriptNode.connect(audioContext.destination)
      javascriptNode.onaudioprocess = () => {
        //console.log('onaudioprocess')
        let array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        let values = 0

        let length = array.length
        for (let i = 0; i < length; i++) {
          values += array[i]
        }

        let average = values / length
        //averageVolume = average
        setAverageVolume(average)

        //console.log(Math.round(average))
        // colorPids(average);
      }
      setAudioContext({
        sourceAudioContext: audioContext,
        sourceMicrophone: microphone,
        scriptNode: javascriptNode,
        sourceAnalyser: analyser,
      })
    } catch (error) {
      logger.error('micValues caught error:', error)
    }
  }

  useEffect(() => {
    micValues()
  }, [micIndex, audioinputs])

  return typeof micIndex !== 'undefined' ? (
    <div
      style={{
        zIndex: 10,
        margin: '1em',
        padding: '.1em',
        cursor: 'pointer',
        pointerEvents: 'auto',
        position: 'absolute',
        bottom: '1em',
      }}
      title={audioinputs[micIndex] && audioinputs[micIndex].label}
    >
      {!changeMic ? (
        <button
          style={{
            border: '1px solid #808080',
            borderRadius: '3px',
            color: 'black',

            backgroundImage: `linear-gradient(to right, #ffffff ${(averageVolume / 2) *
              100}%, #ffffff ${(averageVolume / 2) * 100}%, #fbae9e ${(1 - averageVolume / 2) * 100}%)`,
            backgroundColor: `${averageVolume === 0 ? 'red' : null}`,
            //backgroundImage: `linear-gradient(to right, #fbae9e 0%, #fbae9e 0%, #ffffff ${(1 - averageVolume / 70) *
            //100}%)`,
          }}
          onClick={() => setChangeMic(true)}
        >
          Change Mic?
        </button>
      ) : (
        <select
          value={micIndex}
          onChange={event => {
            switchMic(event.target.value)
            setChangeMic(false)
          }}
        >
          {audioinputs.length > 0
            ? audioinputs.slice(1).map((input, index) => (
                <option value={index + 1} key={index + 1}>
                  {input.label}
                </option>
              ))
            : null}
        </select>
      )}
    </div>
  ) : (
    <></>
  )
}
//<input type="range" min="0" max="70" value={averageVolume} className="slider" style={{ pointerEvents: 'none' }} />
