'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'

const useStyles = createUseStyles({
  questionList: {
    listStyleType: 'upper-alpha',
    marginTop: 0,
    marginBottom: 0,
    padding: '0',
    paddingLeft: '2em',
    '& li': {
      paddingTop: '0.4em',
    },
  },
  questionListInner: {
    listStyleType: 'none',
    paddingLeft: '0',
    '& li:last-child': {
      paddingBottom: '0',
    },
  },
  questionListInnerHeadless: {
    listStyleType: 'none',
    paddingLeft: '0',
    paddingTop: '0',
    '& li:first-child': {
      paddingTop: '0',
    },
    '& li:last-child': {
      paddingBottom: '0',
    },
  },
})
function Agenda({ candidate_questions, timeLimits }) {
  const classes = useStyles()
  const makeQuestions = (className, questions, keyIndex = 'mq') => {
    return (
      <ul className={className}>
        {questions.map((question, index) =>
          typeof question === 'string' ? (
            <li key={keyIndex + '-' + index}>{question}</li>
          ) : question.length === 1 ? (
            <li key={keyIndex + '-' + index}>
              <strong>[ {timeLimits[index]} seconds ]</strong> {question[0]}
            </li>
          ) : question[0][0] >= '0' && question[0][0] <= '9' ? (
            <li>
              <strong>[ {timeLimits[index]} seconds ]</strong>
              {makeQuestions(classes.questionListInnerHeadless, question, keyIndex + index)}
            </li>
          ) : (
            <li>
              <strong>[ {timeLimits[index]} seconds ]</strong> {question[0]}
              {makeQuestions(classes.questionListInner, question.slice(1), keyIndex + index)}
            </li>
          )
        )}
      </ul>
    )
  }
  return (
    <>
      <h2 style={{ marginBottom: '0.5rem' }}>Stuff for Candidates</h2>
      {makeQuestions(
        classes.questionList,
        candidate_questions && candidate_questions.slice(0, -1)
      ) /* the last thing in the list is the moderators closing remarks*/}
    </>
  )
}

export default Agenda
