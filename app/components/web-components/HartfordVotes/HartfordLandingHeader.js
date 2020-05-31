import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'

const styles = {
  header: {
    width: '100vw',
    backgroundColor: 'pink',
    height: '100vh',
    padding: '1em 1em',
  },
  pageTitle: {
    textAlign: 'left',
  },
  subTitle: {
    textAlign: 'right',
  },
}

let HartfordLandingHeader = ({ classes }) => {
  return (
    <header className={classes.header}>
      <h1 className={classes.pageTitle}>
        Hartford Votes ~ Vota Coalition CT State Senator and state Representative Candidates
      </h1>
      <h2 className={classes.subTitle}>Connecticut State SEnators and State Representatives for the Hartford area</h2>
    </header>
  )
}

HartfordLandingHeader = injectSheet(styles)(HartfordLandingHeader)
export default HartfordLandingHeader
