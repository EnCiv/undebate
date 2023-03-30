'use strict;'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { AuthForm } from 'civil-client' // pull components for the client out from the repo, so that server side stuff is not pulled into the client
import createParticipant from '../../components/lib/create-participant'
import SurveyForm from './survey-form'
import Input from '../../components/lib/input'
import cx from 'classnames'

export const Ending = props => {
  const { closing = { thanks: 'Thank You' }, participants = {}, bp_info = {}, user, dispatch, ccState } = props
  const classes = useStyles()
  const [newUser, neverSetNewUser] = useState(!user) // if there is no user at the beginning, then this is a new user - which should persist throughout the existence of this component
  const [newUserInfo, setNewUserInfo] = useState({ userId: undefined, firstName: undefined, lastName: undefined })
  const [progressObj, setProgressObj] = useState({ progress: '', uploadComplete: false, uploadStarted: false, uploadError: false })
  const { progress, uploadComplete, uploadStarted, uploadError } = progressObj
  const [inputName, setInputName] = useState('')
  const thanks = () => <span className={classes['thanks']}>{closing.thanks}</span>

  const reviewButton = () =>
    participants.human &&
    !uploadComplete && (
      <div className={classes.reviewIt}>
        <button
          className={classes.beginButton}
          onClick={
            () => dispatch({ type: dispatch.TYPES.ReviewIt })
          }
        >
          Review It
        </button>
      </div>
    )

  const onUserLogin = info => {
    logger.info('ending.onUserLogin')
    logger.trace('ending.onUserLogin', info)
    const { userId, firstName, lastName } = info
    setNewUserInfo({ userId: userId, firstName, lastName })
  }

  const onUserUpload = () => {
    logger.info('ending.onUserUpload')
    logger.trace('ending.onUserUpload', props)  // do not log props ccState has Blobs in it and trying to send them through socket.io causes the websocket to disconnect -- or uncomment this if you want to test with the error
    console.info("onUserUpload props length", JSON.stringify(props).length)
    const userId = (user && user.id) || newUserInfo.userId
    createParticipant(props, ccState.participants.human, userId, inputName, setProgressObj)
  }

  const authForm = () =>
    participants.human &&
    !uploadComplete &&
    newUser &&
    !newUserInfo.userId && (
      <>
        <div style={{ textAlign: 'center' }}>
          <span>Join and your recorded videos will be uploaded and shared</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AuthForm
            userInfo={{
              name: inputName || bp_info.candidate_name,
              firstName: newUserInfo.firstName || bp_info.first_name,
              lastName: newUserInfo.lastName || bp_info.last_name,
            }}
            onChange={onUserLogin}
          />
        </div>
      </>
    )

  const nameInput = () =>
    !bp_info.candidate_name &&
    (newUserInfo.userId || user) && (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          Name Shown with Video
          <Input
            className={classes['name']}
            block
            medium
            required
            placeholder="Your Name Tag"
            name="name"
            defaultValue={
              inputName ||
              (newUserInfo.firstName && newUserInfo.lastName && newUserInfo.firstName + ' ' + newUserInfo.lastName)
            }
            onChange={e => setInputName(e.value)}
          />
        </label>
        <span>This will be shown under your video</span>
      </div>
    )

  const postButton = () =>
    participants.human &&
    !uploadComplete && (
      <>
        <div>
          <button disabled={uploadStarted || (newUser && !newUserInfo.userId)} className={classes['beginButton']} onClick={onUserUpload}>
            Post
          </button>
        </div>
        {progress && <div className={cx(uploadError && classes['error'])}>{'uploading: ' + progress}</div>}
      </>
    )

  return (
    <div className={classes['outerBox']} key="ending">
      <div style={{ width: '100%', height: '100%', display: 'table' }}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
          {thanks()}
          {reviewButton()}
          {authForm()}
          {nameInput()}
          {postButton()}
          {closing.iframe && (!participants.human || (participants.human && uploadComplete)) && (
            <SurveyForm {...props} />
          )}
        </div>
      </div>
    </div>
  )
}
export default Ending

export const HungUp = props => {
  const { closing } = props
  const classes = useStyles()
  return (
    <div className={classes.outerBox}>
      <div style={{ width: '100%', height: '100%', display: 'table' }}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
          <span className={classes.thanks}>{closing.thanks}</span>
          <SurveyForm {...props} />
        </div>
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  outerBox: {
    display: 'block',
    width: '100vw',
    boxSizing: 'border-box',
    height: 'auto',
    minHeight: '100vh',
  },
  thanks: {
    'font-size': '200%',
    'font-weight': '600',
    display: 'block',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
  },
  reviewIt: {
    marginBottom: '2em',
  },
  beginButton: {
    cursor: 'pointer',
    color: 'white',
    background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': '1.25em',
    padding: '1em',
    'margin-top': '1em',
    '&:disabled': {
      'text-decoration': 'none',
      background: 'lightgray',
    },
  },
  name: {
    fontSize: '1.25em',
    width: '11em',
    height: '1em',
    textAlign: 'center',
  },
  error: {
    color: 'red'
  }
})