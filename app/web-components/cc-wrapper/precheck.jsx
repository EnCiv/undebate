'use strict;'

import React from 'react'
import ViewerRecorder from './viewer-recorder'

const agenda = [
  [
    'Check List',
    '1. Check Microphone: Does the green bar move when you talk',
    '2. Check Lighting: Is your face well light from light in front of you',
    '3. Is your camera at eye level',
    '4. Are your head and shoulders in view',
    '5. Click Next Section when ready',
  ],
]
const timeLimits = [0]
const participants = {
  human: {},
}

function Precheck(props) {
  return (
    <ViewerRecorder
      {...props}
      buttons={['', '', '', '', '', 'nextSection', '']}
      participants={participants}
      agenda={agenda}
      timeLimits={timeLimits}
      showMicCamera={true}
    />
  )
}

export default Precheck
