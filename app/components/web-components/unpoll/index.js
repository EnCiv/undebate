'use strict'

import React, { useState } from 'react'
import injectSheet from 'react-jss'
import ToggleCheckMark from '../../toggle-check-mark'
import Icon from '../../lib/icon'
import Input from '../../lib/input'
import cx from 'classnames'
import { AuthForm } from '../../auth-form'

const ShowCheckMarks = (n, size = '2') => {
  var marks = []
  for (let i = 0; i < n; i++)
    marks.push(<Icon className={'fa-check-square-o'} icon={'fa-check-square-o'} size={size} key={i} />)
  return marks
}

const PreInject = props => {
  const { classes, question, answers, maxVotes = 2, user, round = 0 } = props
  const [voteObj, setVoteObj] = useState(
    answers.reduce((voteObj, answer) => ((voteObj[answer._id] = false), voteObj), {})
  )
  const [errMsg, setErrMsg] = useState('')
  const [inputQuestion, setInputQuestion] = useState('')
  const [authRequired, setAuthRequired] = useState(false)
  const [userInfo, setUserInfo] = useState({ userId: (user && user.id) || '' })

  const voteCount = voteObj => Object.values(voteObj).reduce((voteCount, val) => (val ? ++voteCount : voteCount), 0)

  function emitInputAndVotes() {
    console.info({ voteObj, inputQuestion })
    window.socket.emit('input and votes', voteObj, round, inputQuestion, question._id)
  }

  function submitInputAndVotes() {
    if (userInfo.userId) {
      emitInputAndVotes()
    } else setAuthRequired(true)
  }

  const toggleVoteId = _id => {
    var newObj = Object.assign({}, voteObj, { [_id]: !voteObj[_id] })
    if (voteCount(newObj) > maxVotes) {
      setErrMsg('max votes is ' + maxVotes)
    } else {
      if (errMsg) setErrMsg('')
      setVoteObj(newObj)
    }
  }

  const onUserLogin = info => {
    setUserInfo(info)
    setAuthRequired(false)
    emitInputAndVotes()
  }

  return (
    <div className={classes.outer}>
      <div className={classes.title}>Hello World, Meet Unpoll</div>
      <div className={classes.question}>{question.description}</div>
      <div className={classes.maxVotes}>
        <span>{`Vote up to ${maxVotes} times: `}</span>
        {ShowCheckMarks(maxVotes - voteCount(voteObj), '1')}
      </div>
      <div className={classes.answerList}>
        {answers.map(answer => (
          <div className={classes.answer} key={answer._id}>
            <div className={classes.answerText}>{answer.description}</div>
            <ToggleCheckMark
              className={classes.answerMark}
              agreed={voteObj[answer._id]}
              toggleAgreed={() => toggleVoteId(answer._id)}
              name={`vote-${answer._id}`}
            />
          </div>
        ))}
        <div className={classes.answer} key={'input'}></div>
        <div className={classes.answerText}>
          <Input
            onChange={e => {
              setInputQuestion(e.value)
              voteObj.input || toggleVoteId('input')
            }}
          />
          <ToggleCheckMark
            className={classes.answerMark}
            agreed={voteObj.input}
            toggleAgreed={() => toggleVoteId('input')}
            name={`vote-input`}
          />
        </div>
      </div>
      <div className={classes.errMsg}>{errMsg}</div>
      <div className={classes.submit} key={'input'}>
        <button onClick={submitInputAndVotes}>Submit</button>
      </div>
      <div className={cx(classes.login, authRequired && classes.loginRequired)}>
        <AuthForm onChange={onUserLogin} />
      </div>
    </div>
  )
}

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
  errMsg: {
    textAlign: 'center',
    color: 'red',
  },
  maxVotes: {
    textAlign: 'center',
  },
  submit: {
    textAlign: 'center',
  },
  login: {
    textAlign: 'center',
    display: 'none',
  },
  loginRequired: {
    display: 'block',
  },
}

const Unpoll = injectSheet(styles)(PreInject)
export default Unpoll
