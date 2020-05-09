'use strict'

import React, { useState } from 'react'
import injectSheet from 'react-jss'
import ToggleCheckMark from '../../toggle-check-mark'

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
  answerList: {
    textAlign: 'center',
  },
  answer: {},
  answerText: {
    display: 'inline-block',
  },
  answerMark: {
    display: 'inline-block',
  },
}

const PreInject = props => {
  const { classes, question, answers } = props
  const [voteObj, setVoteObj] = useState({})

  return (
    <div className={classes.outer}>
      <div className={classes.title}>Hello World, Meet Unpoll</div>
      <div className={classes.question}>{question}</div>
      <div className={classes.answerList}>
        {answers.map(answer => (
          <div className={classes.answer}>
            <div className={classes.answerText}>{answer.description}</div>
            <ToggleCheckMark
              className={classes.answerMark}
              agreed={voteObj[answer._id]}
              toggleAgreed={() => setVoteObj(((voteObj[answer._id] = !voteObj[answer._id]), voteObj))}
              name={`vote-${answer._id}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const Unpoll = injectSheet(styles)(PreInject)
export default Unpoll
