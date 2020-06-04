import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import HartfordLandingHeader from './HartfordLandingHeader'
import HartfordCandidatesConversations from './HartfordCandidatesConversations'
import HartfordLandingMenu from './HartfordLandingMenu'

const useStyles = createUseStyles({
  landingPage: {
    fontFamily: 'Libre Franklin',
    fontSize: '1.5rem',
    wordSpacing: '0.3em',
    letterSpacing: '0.01em',
    width: '100vw',
    textAlign: 'center',
  },
})

const HartfordVotes = () => {
  const classes = useStyles()
  return (
    <div className={classes.landingPage}>
      <HartfordLandingMenu />
      <HartfordLandingHeader />
      <HartfordCandidatesConversations />
    </div>
  )
}

export default HartfordVotes
