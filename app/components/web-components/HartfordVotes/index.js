import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'
import HartfordLandingHeader from './HartfordLandingHeader'
import HartfordCandidatesConversations from './HartfordCandidatesConversations'

const styles = {
  landingPage: {
    width: '100vw',
    textAlign: 'center',
    height: '200vh',
  },
}

let HartfordVotes = ({ classes }) => {
  return (
    <div className={classes.landingPage}>
      <HartfordLandingHeader />
      <HartfordCandidatesConversations />
    </div>
  )
}

HartfordVotes = injectSheet(styles)(HartfordVotes)
export default HartfordVotes
