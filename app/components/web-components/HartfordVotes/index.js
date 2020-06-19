import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import HartfordLandingHeader from './HartfordLandingHeader'
import HartfordCandidatesConversations from './HartfordCandidatesConversations'
import HartfordLandingMenu from './HartfordLandingMenu'
import { ModeProvider } from './phone-portrait-context'

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

const HartfordLanding = () => {
  return (
    <>
      <HartfordLandingHeader key="hartford-header" />
      <HartfordCandidatesConversations key="hartford-candidate-conversations" />
    </>
  )
}

const HartfordVotes = () => {
  const classes = useStyles()

  return (
    <hartford-dom key="hartfordLanding">
      <ModeProvider>
        <div className={classes.landingPage}>
          <HartfordLandingMenu key="hartford-menu" />
          <HartfordLanding />
        </div>
      </ModeProvider>
    </hartford-dom>
  )
}

export default HartfordVotes
