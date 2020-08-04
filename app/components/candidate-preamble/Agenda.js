'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'

const useStyles = createUseStyles({
  container: {
    border: '1px solid grey',
    marginTop: '4em',
    //Questions for Candidates
    '& h2': {
      fontSize: '2em',
      fontWeight: 700,
    },
    '& h3': {
      fontSize: '1.33em',
      color: '#646464',
      fontWeight: 500,
    },
  },
  questionList: {
    textAlign: 'left',
    listStyleType: 'upper-alpha',
    listStylePosition: 'outside',

    marginTop: 0,
    marginBottom: 0,
    padding: '0',
    paddingLeft: '2em',
    color: '#3E3E3E',
    fontSize: '1.5em',
    fontWeight: '700',
    '& li': {
      paddingLeft: '1em',
      '& strong': {
        fontSize: '.75em',
        color: '#646464',
      },
      paddingTop: '0.4em',
    },
  },
  questionListInner: {
    listStyleType: 'none',
    lineHeight: '2',
    paddingLeft: '0',
    color: '#646464',
    fontWeight: 600,
    fontSize: '.75em',
    '& li:not(:last-child):after': {
      content: '";"',
    },
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
  console.log(candidate_questions)

  const makeQuestions = (className, questions, keyIndex = 'mq') => {
    return (
      <ul className={className}>
        {questions.map((question, index) =>
          typeof question === 'string' ? (
            <li key={keyIndex + '-' + index}>{question}</li>
          ) : question.length === 1 ? (
            <li key={keyIndex + '-' + index}>
              {question[0]}
              <strong> ( {timeLimits[index]} seconds )</strong>
            </li>
          ) : question[0][0] >= '0' && question[0][0] <= '9' ? (
            <li>
              {makeQuestions(classes.questionListInnerHeadless, question, keyIndex + index)}
              <strong> ( {timeLimits[index]} seconds )</strong>
            </li>
          ) : (
            <li>
              {question[0]}
              <strong> ( {timeLimits[index]} seconds )</strong>
              {makeQuestions(classes.questionListInner, question.slice(1), keyIndex + index)}
            </li>
          )
        )}
      </ul>
    )
  }

  return (
    <div className={classes.container}>
      <h2>Questions for Candidates</h2>
      <h3>Here{"'"}s what you can expect:</h3>
      {makeQuestions(
        classes.questionList,
        candidate_questions && candidate_questions.slice(0, -1)
      ) /* the last thing in the list is the moderators closing remarks*/}
    </div>
  )
}

export default Agenda
