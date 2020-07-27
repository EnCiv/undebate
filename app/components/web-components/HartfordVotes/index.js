import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import HartfordLandingHeader from './HartfordLandingHeader'
import HartfordCandidatesConversations from './HartfordCandidatesConversations'
import HartfordLandingMenu from './HartfordLandingMenu'
import { ModeProvider } from './phone-portrait-context'
import { AddressProvider } from './user-address-context'
import FindDistrict from './FindDistrict'
import CandidateQuestions from './CandidateQuestions'

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

  return (
    <hartford-dom key="hartfordLanding">
      <ModeProvider>
        <AddressProvider>
          <div className={classes.landingPage}>
            <HartfordLandingMenu key="hartford-menu" />
            <HartfordLanding viewers={viewers} />
          </div>
        </AddressProvider>
      </ModeProvider>
    </hartford-dom>
  )
}

export default HartfordVotes
