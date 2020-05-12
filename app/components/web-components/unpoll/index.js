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
    const { classes, question } = this.props

    return (
      <div className={classes.outer}>
        <div className={classes.title}>Hello World, Meet Unpoll</div>
        <div className={classes.question}>{question}</div>
      </div>
    )
  }
}

const Unpoll = injectSheet(styles)(PreInject)
export default Unpoll
