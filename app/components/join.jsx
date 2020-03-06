'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import superagent from 'superagent'
import Icon from './lib/icon'
import Input from './lib/input'
import isEmail from 'is-email'

class Join extends React.Component {
  constructor(props) {
    super(props)
    this.state = { validationError: null, successMessage: null, info: null, joinActive: false, loginActive: false }
  }

  onPasswordBlur(e) {
    let password = this.refs.password.value
    let confirm = this.refs.confirm.value
    if (password && confirm && password !== confirm)
      this.setState({ validationError: 'Passwords do not match', info: null })
    else this.setState({ validationError: null })
  }

  onBlurEmail(e) {
    let email = this.refs.email.value
    if (email && !isEmail(email)) this.setState({ validationError: 'email address is not valid', info: null })
    else this.setState({ validationError: null })
  }

  authenticateSocketIo(cb) {
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

  signup() {
    let email = this.refs.email.value,
      password = this.refs.password.value,
      confirm = this.refs.confirm.value,
      agree = ReactDOM.findDOMNode(this.refs.agree)

    this.setState({ validationError: null, info: 'Logging you in...' })

    if (password !== confirm) {
      this.setState({ validationError: 'Passwords do not match', info: null })

      return
    }

    if (!agree.classList.contains('fa-check-square-o')) {
      this.setState({ validationError: 'Please agree to our terms of service', info: null })

      return
    }

    if (!email) {
      this.setState({ validationError: 'email is missing', info: null })
      return
    }

    if (!isEmail(email)) {
      this.setState({ validationError: 'email not valid', info: null })
      return
    }

    window.onbeforeunload = null // stop the popup about navigating away

    var userInfo = Object.assign({}, this.props.userInfo, { email, password })

    superagent
      .post('/sign/up')
      .send(userInfo)
      .end((err, res) => {
        if (err) logger.error('Join.signup error', err)
        switch (res.status) {
          case 401:
            this.setState({ validationError: 'This email address is already taken', info: null })
            break

          case 200:
            this.setState({ validationError: null, successMessage: 'Welcome aboard!', info: null })
            if (this.props.onChange)
              this.authenticateSocketIo(() => this.props.onChange({ userId: JSON.parse(res.text).id }))
            else
              setTimeout(
                () => (location.href = this.props.newLocation ? this.props.newLocation : window.location.pathname),
                800
              )
            break

          default:
            this.setState({ validationError: 'Unknown error', info: null })
            break
        }
      })
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  skip() {
    let agree = ReactDOM.findDOMNode(this.refs.agree)

    this.setState({ validationError: null, info: 'Creating temporary account...' })

    if (!agree.classList.contains('fa-check-square-o')) {
      this.setState({ validationError: 'Please agree to our terms of service', info: null })
      return
    }

    window.onbeforeunload = null // stop the popup about navigating away

    var userInfo = Object.assign({}, this.props.userInfo)

    let password = ''
    let length = Math.floor(Math.random() * 9) + 8 // the lenght will be between 8 and 16 characters
    for (; length > 0; length--) {
      password += String.fromCharCode(65 + Math.floor(Math.random() * 26)) // any character between A and Z
    }
    userInfo.password = password

    superagent
      .post('/tempid')
      .send(userInfo)
      .end((err, res) => {
        if (err) logger.error('Join.skip error', err)
        switch (res.status) {
          case 401:
            this.setState({ validationError: 'This email address is already taken', info: null })
            break

          case 200:
            this.setState({ validationError: null, successMessage: 'Welcome aboard!', info: null })
            if (this.props.onChange)
              this.authenticateSocketIo(() => this.props.onChange({ userId: JSON.parse(res.text).id }))
            else
              setTimeout(
                () => (location.href = this.props.newLocation ? this.props.newLocation : window.location.pathname),
                800
              )
            break

          default:
            this.setState({
              validationError: 'unexpected error: ' + '(' + res.status + ') ' + (err || 'Unknown'),
              info: null,
            })
            break
        }
      })
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  login() {
    this.setState({ validationError: null, info: 'Logging you in...' })

    let email = this.refs.email.value,
      password = this.refs.password.value

    window.onbeforeunload = null // stop the popup about navigating away

    var userInfo = Object.assign({}, this.props.userInfo, { email, password }) // include any new user Info
    superagent
      .post('/sign/in')
      .send(userInfo)
      .end((err, res) => {
        if (err) logger.error('Join.login error', err)
        var errorMsg = ''
        switch (res.status) {
          case 404:
            errorMsg = "Email / Password Don't Match" // email not found but don't say that to the user
            break

          case 401:
            errorMsg = "Email / Password Don't Match" // Wrong Password but dont say that to the users
            break

          case 200:
            this.setState({ validationError: null, info: null, successMessage: 'Welcome back' })
            if (this.props.onChange)
              this.authenticateSocketIo(() => this.props.onChange({ userId: JSON.parse(res.text).id }))
            else
              setTimeout(
                () => (location.href = this.props.newLocation ? this.props.newLocation : window.location.pathname),
                800
              ) //'/page/profile'
            return

          default:
            errorMsg = 'Unknown error'
            break
        }
        this.setState({ validationError: errorMsg, info: null })
      })
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  agree() {
    let box = ReactDOM.findDOMNode(this.refs.agree)

    if (box.classList.contains('fa-square-o')) {
      box.classList.remove('fa-square-o')
      box.classList.add('fa-check-square-o')
    } else {
      box.classList.add('fa-square-o')
      box.classList.remove('fa-check-square-o')
    }

    this.onChangeActive()
  }

  stopPropagation(e) {
    e.stopPropagation()
  }

  onChangeActive() {
    let email = this.refs.email.value,
      password = this.refs.password.value,
      confirm = this.refs.confirm.value,
      agree = ReactDOM.findDOMNode(this.refs.agree).classList.contains('fa-check-square-o') // true if the box is checked

    if (!this.state.loginActive && email && isEmail(email) && password && !confirm) this.setState({ loginActive: true })
    if (this.state.loginActive && (!email || !isEmail(email) || !password || confirm))
      this.setState({ loginActive: false })
    if (!this.state.joinActive && email && isEmail(email) && password && confirm && password == confirm && agree)
      this.setState({ joinActive: true })
    if (this.state.joinActive && (!email || !isEmail(email) || !password || !confirm || password != confirm || !agree))
      this.setState({ joinActive: false })
  }

  sendResetPassword() {
    this.setState({ validationError: null, info: 'One moment...' })

    let email = this.refs.email.value

    window.socket.emit('send password', email, window.location.pathname, response => {
      if (response.error) {
        let { error } = response

        if (error === 'User not found') {
          error = 'Email not found'
        }

        this.setState({ info: null, validationError: error })
      } else {
        this.setState({ info: null, successMessage: 'Message sent! Please check your inbox' })
      }
    })
  }

  render() {
    const className = this.props.className
    const { info, successMessage, validationError } = this.state
    return (
      <React.Fragment>
        {!successMessage && (
          <React.Fragment>
            <button className={className} onClick={this.login.bind(this)} disabled={!this.state.loginActive}>
              Login
            </button>
            <Input
              className={className}
              type="email"
              block
              autoFocus
              medium
              required
              placeholder="Email"
              ref="email"
              name="email"
              onChange={this.onChangeActive.bind(this)}
              onBlur={this.onBlurEmail.bind(this)}
            />
            <Input
              className={className}
              type="password"
              required
              placeholder="Password"
              ref="password"
              medium
              name="password"
              onChange={this.onChangeActive.bind(this)}
              onBlur={this.onPasswordBlur.bind(this)}
            />
            <Input
              className={className}
              type="password"
              required
              placeholder="Confirm password"
              ref="confirm"
              medium
              name="confirm"
              onChange={this.onChangeActive.bind(this)}
              onBlur={this.onPasswordBlur.bind(this)}
            />
            <a className={className} href="#" onClick={this.agree.bind(this)}>
              <Icon className={className} icon="square-o" size="2" ref="agree" name="agree" />
            </a>
            <span className={className}>I agree to the </span>
            <a className={className} href="https://enciv.org/terms/" target="_blank">
              Terms of Service
            </a>
            <button className={className} onClick={this.signup.bind(this)} disabled={!this.state.joinActive}>
              Join
            </button>

            {info && <span className={className}>{info}</span>}
            {validationError && (
              <span className={className} style={{ color: 'red' }}>
                {validationError}
              </span>
            )}
          </React.Fragment>
        )}
        {successMessage && <span className={className}>{successMessage}</span>}
      </React.Fragment>
    )
  }
}

export default Join
