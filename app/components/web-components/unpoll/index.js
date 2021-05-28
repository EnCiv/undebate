'use strict'

import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  outer: {
    margin: '2em',
  },
  title: {
    color: 'black',
    fontSize: '2rem',
    textAlign: 'center',
  },
  question: {
    color: 'black',
    fontSize: '1.5rem',
    textAlign: 'center',
  },
}

class PreInject extends React.Component {
  render() {
    const { classes, description, subject } = this.props

    return (
      <div className={classes.outer}>
        <div className={classes.title}>{subject}</div>
        <div className={classes.question}>{description}</div>
      </div>
    )
  }
}

const Unpoll = injectSheet(styles)(PreInject)
export default Unpoll
