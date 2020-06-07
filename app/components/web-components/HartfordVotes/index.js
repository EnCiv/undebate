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
    fontSize: '1.5rem',
    wordSpacing: '0.3em',
    letterSpacing: '0.01em',
    boxSizing: 'border-box',
    '& *': {
      boxSizing: 'border-box',
    },
    width: '100vw',
    textAlign: 'center',
  },
})

const HartfordVotes = () => {
  const classes = useStyles()

  return (
    <hartford-dom key="hartfordLanding">
      <ModeProvider>
        <div className={classes.landingPage}>
          <HartfordLandingMenu key="hartford-menu" />
          <HartfordLandingHeader key="hartford-header" />
          <HartfordCandidatesConversations key="hartford-candidate-conversations" />
        </div>
      </ModeProvider>
    </hartford-dom>
  )
}

export default HartfordVotes
