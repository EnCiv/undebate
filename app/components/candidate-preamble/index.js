'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'
import ConversationHeader from '../conversation-header'
import Agenda from './Agenda'
import Steps from './Steps'

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

function CandidatePreamble({ onClick, agreed, bp_info, subject, candidate_questions, instructionLink, timeLimits }) {
  const classes = useStyles()
  const [isPortrait, togglePortrait] = useState(false)

  return (
    <div className={cx(classes['Preamble'], agreed && classes['agreed'])}>
      <ConversationHeader
        subject={subject}
        bp_info={bp_info}
        handleOrientationChange={choice => togglePortrait(choice)}
      />
      <div className={cx(classes['Preamble-inner'], isPortrait ? classes['portrait'] : undefined)}>
        <h2>
          Welcome{' '}
          {bp_info && bp_info.candidate_name ? (
            <span style={{ fontSize: '150%', fontWeight: 'bold' }}>{bp_info.candidate_name}</span>
          ) : (
            ''
          )}
        </h2>
        <Steps />
        <Agenda candidate_questions={candidate_questions} timeLimits={timeLimits} />
        <div className={classes['center']}>
          <Button onClick={onClick}>Next</Button>
        </div>
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  Preamble: {
    fontSize: '1.33rem',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    paddingTop: '1em',
    paddingLeft: '3em',
    paddingRight: '3em',
    overflow: 'hidden',
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
    marginTop: '6vh',
    // need to have someting here for portrait mode - but don't record in portrait mode for now.
  },
  portrait: {
    marginTop: '20vh',
  },
})

export default CandidatePreamble

//<p>
//Undebate and EnCiv are teaming up to create a better way for candidates to be heard, and voters to learn about
//their candidates.
//</p>
//<p>
//You are invited to engage in an application that will include you, as part of a publicly available online
//video conversation.
//</p>
//<ul className={classes.PreambleList}>
//<li>
//During the conversation, you will be asked questions, and your video will be recorded and stored on your
//computer.
//</li>
//<li>
//At the end of the conversation, you will be asked to review and accept EnCiv's{' '}
//<a href="https://enciv.org/terms" target="_blank">
//terms of service
//</a>{' '}
//and create an account.
//</li>
//<li>
//Then, hitting the <b>Post</b> button will upload the recorded video and make it public.
//</li>
//<li>
//Or, hitting the <b>Hang Up</b> button or closing this window any time before hitting the <b>Post</b> button
//will cause any recordings to be discarded.
//</li>
//{instructionLink && (
//<li>
//You can continue and each step will be explained one at a time, or you can review written instructions{' '}
//<a target="#" href={instructionLink}>
//here
//</a>
//</li>
//)}
//</ul>
