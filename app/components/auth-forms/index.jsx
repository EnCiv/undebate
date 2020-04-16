import React, { useState, useEffect } from 'react'
import injectSheet from 'react-jss'
import superagent from 'superagent'
import isEmail from 'is-email'
import Icon from '../lib/icon'
import { FormInput } from './formInput'
import { JoinForm } from './joinForm'
import { LoginForm } from './loginForm'
const Temp = props => {
  const [hasAgreed, setHasAgreed] = useState(false)
  const [onLogin, setOnLogin] = useState(false)
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [isDisabled, setIsDisabled] = useState(true)
  const [infoMessage, setInfoMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [formValidationErrors, setFormValidationErrors] = useState([])
  const handleTabSwitch = bool => setOnLogin(bool)
  const { email, password, confirmPassword } = formValues
  useEffect(() => {
    if (!onLogin) {
      if (email && password && confirmPassword && password === confirmPassword && hasAgreed) {
        if (!isEmail(email)) {
          setIsDisabled(true)
        } else {
          setIsDisabled(false)
        }
      } else {
        setIsDisabled(true)
      }
    }
    if (onLogin) {
      if (isEmail(email) && password) {
        return setIsDisabled(false)
      }
      return setIsDisabled(true)
    }
  }, [formValues, hasAgreed, formValidationErrors, onLogin])
  const handleChange = e => setFormValues({ ...formValues, [e.target.name]: e.target.value })
  const emailBlurMsg = 'email address is not valid'
  const passwordBlurMsg = 'Passwords do not match'

  const handleOnBlur = (message, isEmailBlur = false) => {
    const index = formValidationErrors.indexOf(message)
    const condition = isEmailBlur
      ? email && !isEmail(email)
      : password && confirmPassword && password !== confirmPassword
    if (condition) {
      // prevents from adding duplicate message
      if (index < 0) {
        return setFormValidationErrors([message, ...formValidationErrors])
      }
      return
    }
    const filteredValidations = formValidationErrors.filter((msg, i) => i !== index)
    return setFormValidationErrors(filteredValidations)
  }
  const handleSignUp = e => {
    e.preventDefault()
    if (isDisabled) return
    setFormValidationErrors([])
    setInfoMessage('Signing you up...')
    const { email, password } = formValues
    const userInfo = { email, password }
    superagent
      .post('/sign/up')
      .send(userInfo)
      .end((err, res) => {
        if (err) {
          console.log(err)
        }
        setInfoMessage(null)
        console.log(res)
        switch (res.status) {
          case 401:
            setFormValidationErrors(['This email is already take'])
            break
          case 200:
            setInfoMessage('Welcome aboard!')
            if (props.onChange) {
              authenticateSocketIo(() => props.onChange({ userId: JSON.parse(res.text).id }))
            } else {
              setTimeout(() => (location.href = props.newLocation ? props.newLocation : window.location.pathname))
            }
            break
          default:
            setFormValidationErrors([
              'The email and password you entered did not match our records. Please double-check and try again.',
            ])
            break
        }
      })
  }
  const handleLogin = e => {
    e.preventDefault()
    if (isDisabled) return
    setInfoMessage('Logging you in...')
    const { email, password } = formValues
    const userInfo = Object.assign({}, props.userInfo, { email, password })
    superagent
      .post('/sign/in')
      .send(userInfo)
      .end((err, res) => {
        setInfoMessage(null)
        if (err) logger.error('Join.login error', err)
        switch (res.status) {
          case 200:
            setInfoMessage('Welcome back')
            if (props.onChange) {
              authenticateSocketIo(() => props.onChange({ userId: JSON.parse(res.text).id }))
            } else {
              setTimeout(() => (location.href = props.newLocation ? props.newLocation : window.location.pathname), 800)
            }
            break
          default:
            setFormValidationErrors([
              'The email and password you entered did not match our records. Please double-check and try again.',
            ])
            break
        }
      })
  }
  const authenticateSocketIo = cb => {
    // after joining or loging in the socket needs to reconnect to get the authentication cookie in the header so it can be authenticated. Many api calls require the user to be authenticated
    if (typeof window !== 'undefined' && window.socket) {
      var reconnectFailed = setTimeout(() => {
        logger.error('Join.authenticateSocketIo timed out')
        cb()
      }, 10 * 1000)
      const onConnect = () => {
        clearTimeout(reconnectFailed)
        window.socket.removeListener('connect', onConnect)
        cb()
      }
      const onDisconnect = reason => {
        if (reason !== 'io client disconnect')
          logger.info('Join.authenticate unexpected disconnect reason:', reason, '... Continuing')
        window.socket.removeListener('disconnect', onDisconnect)
        window.socket.open()
      }
      window.socket.on('connect', onConnect)
      window.socket.on('disconnect', onDisconnect)
      window.socket.close()
    } else cb()
  }
  const { classes } = props
  if (successMessage) {
    return <span>{successMessage}</span>
  }
  return (
    <div className={props.classes.authFormWrapper}>
      <div className={classes.tabs}>
        <div className={!onLogin ? classes.activeTab : classes.nonActiveTab} onClick={() => handleTabSwitch(false)}>
          Join
        </div>
        <div className={onLogin ? classes.activeTab : classes.nonActiveTab} onClick={() => handleTabSwitch(true)}>
          Login
        </div>
      </div>
      <form>
        {onLogin ? (
          <LoginForm
            formValidationErrors={formValidationErrors}
            handleOnBlur={handleOnBlur}
            handleChange={handleChange}
            handleLogin={handleLogin}
            formValues={formValues}
            infoMessage={infoMessage}
            isDisabled={isDisabled}
            classes={classes}
          />
        ) : (
          <JoinForm
            handleOnBlur={handleOnBlur}
            handleChange={handleChange}
            handleSignUp={handleSignUp}
            hasAgreed={hasAgreed}
            setHasAgreed={setHasAgreed}
            isDisabled={isDisabled}
            classes={classes}
            formValidationErrors={formValidationErrors}
            infoMessage={infoMessage}
            formValues={formValues}
          />
        )}
      </form>
    </div>
  )
}
const styles = {
  authFormWrapper: {
    border: '0.5px solid black',
    padding: '3rem',
    '& form': {},
    '& label': {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '3rem',
    },
  },
  tabs: {
    display: ' flex',
    width: '100%',
    pointerEvents: 'auto',
    cursor: 'pointer',
  },
  activeTab: {
    backgroundColor: '#E5E5E5',
    width: '50%',
  },
  nonActiveTab: {
    backgroundColor: 'white',
    width: '50%',
  },
  hide: {
    display: 'none',
  },
  disable: {
    backgroundColor: '#D3D3D3',
  },
  activeBtn: {
    backgroundColor: '#00FF7F',
    cursor: 'pointer',
  },
  formValidationErrors: {
    color: 'red',
  },
}
export const AuthForm = injectSheet(styles)(Temp)
export default injectSheet(styles)(AuthForm)
