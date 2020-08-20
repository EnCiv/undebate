'use strict'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'
import ConversationHeader from '../conversation-header'
import Agenda from './Agenda'
import Steps from './Steps'
import StartRecordingButton from './StartRecordingButton'
import PreambleHeader from './PreambleHeader'

/**
 * 
 * candidate_questions might look like this:
candidate_questions=[
    [
        "Introductions",
        "1- Name",
        "2- City and State",
        "3- One word to describe yourself",
        "4- What office are you running for?"
    ],
    [
        "What do you love about where you live?"
    ],
    [
        "What inspired you to run for office?"
    ],
    [
        "If elected, what will be your top 3 priorities?"
    ],
    [
        "Thank you!"
    ]
  ]
 */

const useStyles = createUseStyles({
  Preamble: {
    fontFamily: '"Libre Franklin"',
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    padding: 0,
    textOverflow: 'clip',
    boxSizing: 'border-box',
    transition: 'all 0.5s linear',
    backgroundColor: 'white', //'#F4F4F4',
    '&$agreed': {
      left: '-100vw',
    },
  },
  PreambleList: {
    paddingTop: '0.4em',
    paddingLeft: '2em',
    '& li': {
      paddingBottom: '0.4em',
    },
  },
  agreed: {},
  center: {
    textAlign: 'center',
  },
  'Preamble-inner': {
    height: '94vh',
    display: 'relative',
    overflow: 'auto',
    marginTop: '6vh',
    // need to have someting here for portrait mode - but don't record in portrait mode for now.
  },
  'Preamble-inner-content': {
    padding: '0 1.5em 1.5em',
    maxWidth: '50em',
    marginLeft: 'auto',
    marginRight: 'auto',
    //steps area title
    '&>h3': {
      fontSize: '2em',
      fontWeight: 600,
      margin: 0,
      padding: '1.5em',
    },
    // need to have someting here for portrait mode - but don't record in portrait mode for now.
  },
  portrait: {
    marginTop: '20vh',
    height: '80vh',
  },
  tips: {
    //tips for success
    border: '1px solid grey',
    marginTop: '3em',
    color: '#3E3E3E',

    '& ul': {
      textAlign: 'left',
      marginRight: 'auto',
      marginLeft: 'auto',
      padding: '0 2em',
      maxWidth: 'max-content',
      fontSize: '1em',
      fontWeight: '500',
    },
    '& h3': {
      fontSize: '2em',
      fontWeight: '700',
    },
    //use a deskop or...
    '& p': {
      fontSize: '1em',
      fontWeight: '500',
    },
  },
})

function CandidatePreamble({ onClick, agreed, bp_info, subject, candidate_questions, instructionLink, timeLimits }) {
  const classes = useStyles()
  const [isPortrait, togglePortrait] = useState(false)
  //bp_info.candidate_name = 'person'

  let preamble = (
    <div className={cx(classes['Preamble'], agreed && classes['agreed'])}>
      <ConversationHeader
        subject={subject}
        bp_info={bp_info}
        handleOrientationChange={choice => togglePortrait(choice)}
      />
      <div className={cx(classes['Preamble-inner'], isPortrait ? classes['portrait'] : undefined)}>
        <PreambleHeader onClickStartRecording={onClick} isPortrait={isPortrait} bp_info={bp_info} />
        <div className={classes['Preamble-inner-content']}>
          <h3>Recording is Easy</h3>
          <Steps />
          <StartRecordingButton onClick={onClick} />
          <Agenda candidate_questions={candidate_questions} timeLimits={timeLimits} />
          <StartRecordingButton onClick={onClick} />
          <div className={classes.tips}>
            <h3>Tips for Success</h3>
            <ul>
              <li>Use a desktop or laptop camera, not a phone.</li>
              <li>Place the camera so you are looking slightly upward.</li>
              <li>Use a lamp or window to ensure your face is well lit.</li>
              <li>Look directly into the camera, not your computer screen, while recording.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
  //return typeof document === 'object' ? createPortal(preamble, document.getElementById('synapp')) : preamble
  return preamble
}

export default CandidatePreamble
