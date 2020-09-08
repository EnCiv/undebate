'use strict;'
import React, { useReducer, useEffect } from 'react'
import cloneDeep from 'lodash/cloneDeep'

function calcNextIndex(state, inputs, index) {
  if (typeof state[index] === 'undefined') return undefined
  if (state[inputs].length <= 1) return undefined //<=1 because we don't show button if only one choice
  let indexVal = state[index] || 0
  if (++indexVal >= state[inputs].length) indexVal = 0
  return indexVal
}

function calculateConstraints(state) {
  let constraints = cloneDeep(state.constraints)
  if (typeof state.cameraIndex !== 'undefined') {
    if (state.videoinputs[state.cameraIndex].deviceId)
      constraints.video.deviceId = state.videoinputs[state.cameraIndex].deviceId
    else if (state.videoinputs[state.cameraIndex].groupId)
      constraints.video.groupId = state.videoinputs[state.cameraIndex].groupId
    else logger.error('video device has no device or group id', state.videoinputs[state.cameraIndex])
  }
  if (typeof state.micIndex !== 'undefined') {
    if (state.audioinputs[state.micIndex].deviceId)
      constraints.audio.deviceId = state.audioinputs[state.micIndex].deviceId
    else if (state.audioinputs[state.micIndex].groupId)
      constraints.audio.groupId = state.audioinputs[state.micIndex].groupId
    else logger.error('audio device has no device or group id', state.audioinputs[state.micIndex])
  }
  return { ...state, constraints }
}

function reducer(state, action) {
  switch (action.type) {
    case 'NextMic': {
      const micIndex = calcNextIndex(state, 'audioinputs', 'micIndex')
      return calculateConstraints({ ...state, micIndex })
    }
    case 'NextCamera': {
      const cameraIndex = calcNextIndex(state, 'videoinputs', 'cameraIndex')
      return calculateConstraints({ ...state, cameraIndex })
    }
    case 'UpdateDevices': {
      const { micIndex, cameraIndex, audioinputs, videoinputs, constraints } = action
      return { ...state, micIndex, cameraIndex, audioinputs, videoinputs, constraints }
    }
    default:
      throw new Error()
  }
}

export default function useMicCameraConstraints(
  constraints = {
    audio: {
      echoCancellation: { exact: true },
    },
    video: {
      width: 640,
      height: 360,
    },
  }
) {
  const [state, dispatch] = useReducer(reducer, {
    audioinputs: [],
    videoinputs: [],
    mixIndex: undefined,
    cameraIndex: undefined,
    constraints,
  })
  const updateDevices = devices => {
    let micIndex
    let cameraIndex
    const videoinputs = devices.reduce((acc, device) => (device.kind === 'videoinput' && acc.push(device), acc), [])
    if (videoinputs.length > 1) cameraIndex = 0 //>1 because we don't show button if only one choice
    const audioinputs = devices.reduce((acc, device) => (device.kind === 'audioinput' && acc.push(device), acc), [])
    if (audioinputs.length > 1) micIndex = 0 //>1 because we don't show button if only one choice
    logger.info('InputDeviceManager.updateDevices', JSON.stringify(devices, null, 2))
    // calculate constraints
    dispatch({
      type: 'UpdateDevices',
      ...calculateConstraints({ audioinputs, videoinputs, micIndex, cameraIndex, constraints }),
    })
  }
  const onDeviceChange = () => navigator.mediaDevices.enumerateDevices().then(updateDevices)
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      // the values for inputDevices need to be set asynchronously because mediaDevices.enumerateDevices returns a promise
      navigator.mediaDevices.enumerateDevices().then(updateDevices)
      //register an event listener such that update devices is called when a new device is plugged in or another decice gets removed.
      navigator.mediaDevices.addEventListener('devicechange', onDeviceChange)
      return () => navigator.mediaDevices.removeEventListener('devicechange', onDeviceChange)
    }
  }, [])
  return [state, dispatch]
}
