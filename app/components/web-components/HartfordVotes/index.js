import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'
import HartfordLandingHeader from './HartfordLandingHeader'
import HartfordCandidatesConversations from './HartfordCandidatesConversations'
import HartfordLandingMenu from './HartfordLandingMenu'

const styles = {
  landingPage: {
    fontFamily: 'Libre Franklin',
    fontSize: '1.5rem',
    wordSpacing: '0.3em',
    letterSpacing: '0.05em',
    width: '100vw',
    textAlign: 'center',
    height: '200vh',
  },
}

let HartfordVotes = ({ classes }) => {
  return (
    <div className={classes.landingPage}>
      <HartfordLandingMenu />
      <HartfordLandingHeader />
      <HartfordCandidatesConversations />
    </div>
  )
}

HartfordVotes = injectSheet(styles)(HartfordVotes)
export default HartfordVotes
