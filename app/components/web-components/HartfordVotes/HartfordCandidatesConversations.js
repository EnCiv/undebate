import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'

const styles = {
  candidatesConversations: {
    width: '100vw',
    textAlign: 'center',
    backgroundColor: 'blue',
    height: '500px',
  },
}

let HartfordCandidatesConversations = ({ classes }) => {
  return (
    <>
      <main className={classes.candidatesConversations}></main>
    </>
  )
}
HartfordCandidatesConversations = injectSheet(styles)(HartfordCandidatesConversations)
export default HartfordCandidatesConversations
