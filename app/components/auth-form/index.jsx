import React, { useState, useEffect } from 'react'
import injectSheet from 'react-jss'
import superagent from 'superagent'
import isEmail from 'is-email'
import { FormInput } from './formInput'
import { JoinForm } from './joinForm'
import { LoginForm } from './loginForm'
import { Tabs } from './tabs/Tabs'
const PreInject = props => {
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
  const [formValidationErrors, setFormValidationErrors] = useState([])
  const [loginErrors, setLoginErrors] = useState(null)
  const emailBlurMsg = 'email address is not valid'
  const passwordBlurMsg = 'Passwords do not match'
  const validationMessages = { emailBlurMsg, passwordBlurMsg }
  const { email, password, confirmPassword, firstName, lastName } = formValues
  useEffect(() => {
    if (!onLogin) {
      if (email && password && confirmPassword && password === confirmPassword && hasAgreed && firstName && lastName) {
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
      if (email && password) {
        return setIsDisabled(false)
      }
      return setIsDisabled(true)
    }
  }, [formValues, hasAgreed, formValidationErrors, onLogin])
  const handleChange = e => setFormValues({ ...formValues, [e.target.name]: e.target.value })

  const handleTabSwitch = bool => setOnLogin(bool)

  const handleOnBlur = (message, condition) => {
    const index = formValidationErrors.indexOf(message)
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
    e.stopPropagation()
    if (isDisabled) {
      if (confirmPassword.length === 0) {
        if (!formValidationErrors.includes('please confirm password')) {
          setFormValidationErrors(['please confirm password', ...formValidationErrors])
        }
      }
      if (!hasAgreed) {
        if (!formValidationErrors.includes('must agree to terms')) {
          setFormValidationErrors([...formValidationErrors, 'must agree to terms'])
        }
      }
      if (confirmPassword && hasAgreed) {
        const index = formValidationErrors.indexOf('please confirm password')
        const index2 = formValidationErrors.indexOf('must agree to terms')
        setFormValidationErrors(formValidationErrors.filter((msg, i) => i !== index || index2))
      }
      return
    }
    setFormValidationErrors([])
    setInfoMessage('Signing you up...')
    const { email, password } = formValues
    const userInfo = { email, password, firstName, lastName }
    superagent
      .post('/sign/up')
      .send(userInfo)
      .end((err, res) => {
        if (err) {
          logger.error('Join.signup error', err)
        }
        setInfoMessage(null)

        switch (res.status) {
          case 401:
            setFormValidationErrors(['This email is already taken'])
            break
          case 200:
            setInfoMessage('Welcome aboard!')
            if (props.onChange) {
              authenticateSocketIo(() => props.onChange({ userId: JSON.parse(res.text).id, firstName, lastName }))
            } else {
              setTimeout(() => (location.href = props.newLocation ? props.newLocation : window.location.pathname))
            }
            break
          default:
            setFormValidationErrors(['Unknown error'])
            break
        }
      })
  }
  const handleLogin = e => {
    e.preventDefault()
    if (isDisabled) return
    setLoginErrors(null)
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
          case 429:
            setLoginErrors(['Too many attempts logging in, try again in 24 hrs'])
            break
          case 200:
            setInfoMessage('Welcome back')
            if (props.onChange) {
              authenticateSocketIo(() => props.onChange({ userId: JSON.parse(res.text).id }))
            } else {
              setTimeout(() => (location.href = props.newLocation ? props.newLocation : window.location.pathname), 800)
            }
            break
          default:
            setLoginErrors([
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
  return (
    <div className={props.classes.authFormWrapper}>
      <Tabs classes={classes} onLogin={onLogin} handleTabSwitch={handleTabSwitch} />
      <form onSubmit={onLogin ? handleLogin : handleSignUp}>
        {onLogin ? (
          <LoginForm
            handleLogin={handleLogin}
            hasAgreed={hasAgreed}
            setHasAgreed={setHasAgreed}
            setInfoMessage={setInfoMessage}
            setFormValidationErrors={setFormValidationErrors}
            formValidationErrors={formValidationErrors}
            handleOnBlur={handleOnBlur}
            handleChange={handleChange}
            formValues={formValues}
            infoMessage={infoMessage}
            isDisabled={isDisabled}
            classes={classes}
            validationMessages={validationMessages}
            loginErrors={loginErrors}
          />
        ) : (
          <JoinForm
            handleSignUp={handleSignUp}
            hasAgreed={hasAgreed}
            setHasAgreed={setHasAgreed}
            formValidationErrors={formValidationErrors}
            handleOnBlur={handleOnBlur}
            handleChange={handleChange}
            formValues={formValues}
            infoMessage={infoMessage}
            isDisabled={isDisabled}
            classes={classes}
            validationMessages={validationMessages}
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
    display: 'flex',
    flexDirection: 'column',
    width: '30rem',
    maxWidth: '30rem',
    minHeight: '42rem',
    fontSize: 'inherit',
    '& form': {},
    '& label': {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '3rem',
      fontSize: 'inherit',
    },
  },
  tabs: {
    display: ' flex',
    width: '100%',
    pointerEvents: 'auto',
    cursor: 'pointer',
    color: '#18397D',
    fontWeight: '900',
    fontSize: '2rem',
  },
  activeTab: {
    backgroundColor: 'white',
    width: '50%',
  },
  nonActiveTab: {
    backgroundColor: '#E5E5E5',
    width: '50%',
  },
  hide: {
    display: 'none',
  },
  disable: {
    backgroundColor: '#D3D3D3',
    float: 'right',
    width: '9rem',
    height: '3rem',
    fontSize: '1.5rem',
    fontWeight: '600',
    fontSize: 'inherit',
  },
  activeBtn: {
    backgroundColor: '#E5A650',
    cursor: 'pointer',
    float: 'right',
    width: '9rem',
    height: '3rem',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  agreementWrapper: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#18397D',
    marginTop: '1rem',
    '& span': {
      marginLeft: '0.5rem',
      fontWeight: '800',
    },
  },
  formValidationErrors: {
    color: 'red',
    width: '100%',
  },
}
export const AuthForm = injectSheet(styles)(PreInject)
