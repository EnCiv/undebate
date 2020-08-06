import React from 'react'
import { createUseStyles } from 'react-jss'
import HartfordLandingHeader from './HartfordLandingHeader'
import HartfordCandidatesConversations from './HartfordCandidatesConversations'
import HartfordLandingMenu from './HartfordLandingMenu'
import { ModeProvider } from './phone-portrait-context'
import { AddressProvider } from './user-address-context'
import FindDistrict from './FindDistrict'
import CandidateQuestions from './CandidateQuestions'
import Modal from '../../Modal'

const useStyles = createUseStyles({
  landingPage: {
    fontFamily: 'Libre Franklin',
    '& button, & a': {
      fontFamily: 'Libre Franklin, SemiBold',
      fontWeight: 300,
    },
    '& h1, & h2, & h3, & h4': {
      fontFamily: 'Libre Franklin, Bold',
    },
    fontSize: '10px',
    wordSpacing: '0.3em',
    letterSpacing: '0.01em',
    boxSizing: 'border-box',
    '@media (min-width: 1250px) and (min-height: 1000px)': { fontSize: '16px' },

    '& *': {
      boxSizing: 'border-box',
    },
    width: '100vw',
    textAlign: 'center',
  },
})

const HartfordLanding = ({ viewers }) => {
  return (
    <>
      <HartfordLandingHeader key="hartford-header" />
      <FindDistrict />
      <HartfordCandidatesConversations viewers={viewers} key="hartford-candidate-conversations" />
      <CandidateQuestions />
    </>
  )
}

const HartfordVotes = ({ viewers }) => {
  const classes = useStyles()
  const distressSignal = (
    <div style={{ fontSize: '2.6em' }}>
      If you do not receive your absentee ballots on time, you can either:
      <ol>
        <li>
          {' '}
          visit the Hartford Town Clerk{"'"}s Office where you can receive your Absentee Ballot and Cast your vote at
          the same time. M -F 8:15am-5pm or Saturday 9-am-1pm;
        </li>{' '}
        <li>
          or go to any of the polling places listed below on August 11 (this list is being sent to you in a separate
          email - add the list here AND replace the info on the Polling Places in the FAQ with the list)
        </li>
      </ol>
      <p>
        And, be sure to visit this site in the Fall, where we invite you to Meet the local Candidates in the November
        election with video interviews and more.{' '}
      </p>
    </div>
  )
  return (
    <hartford-dom key="hartfordLanding">
      <ModeProvider>
        <AddressProvider value={{ tab: 3 }}>
          <div className={classes.landingPage}>
            <HartfordLandingMenu key="hartford-menu" />
            <Modal
              buttonText={'important election information'}
              open={true}
              modalId={'visitor_info_hartford'}
              render={() => distressSignal}
            />
            <HartfordLanding viewers={viewers} />
          </div>
        </AddressProvider>
      </ModeProvider>
    </hartford-dom>
  )
}

export default HartfordVotes
