import React from 'react'
import isEmail from 'is-email'

import { FormInput } from './formInput'
import { AuthBtn } from './authBtn'
import { AgreementTerms } from './agreementTerms'

export const LoginForm = ({
  handleChange,
  formValues,
  handleOnBlur,
  handleLogin,
  isDisabled,
  classes,
  formValidationErrors,
  infoMessage,
  validationMessages,
  setInfoMessage,
  setFormValidationErrors,
  setHasAgreed,
  hasAgreed,
  loginErrors,
}) => {
  const { email, password } = formValues
  const { emailBlurMsg, passwordBlurMsg } = validationMessages
  const handleEmailBlur = email && !isEmail(email)

  const sendResetPassword = () => {
    setInfoMessage('One momnet...')
    window.socket.emit('send password', email, window.location.pathname, response => {
      if (response.error) {
        let { error } = response

        if (error === 'User not found') {
          error = 'Email not found'
        }
        setFormValidationErrors(error)
      } else {
        setInfoMessage('Message sent! Please check your inbox')
      }
    })
  }

  return (
    <>
      <FormInput
        labelName="EMAIL ADDRESS"
        handleChange={handleChange}
        name="email"
        value={email}
        handleBlur={() => handleOnBlur(emailBlurMsg, handleEmailBlur)}
        placeholder="email@address.com"
      />
      <FormInput labelName="PASSWORD" name="password" value={password} handleChange={handleChange} type="password" />
      <div style={{ marginTop: '2rem' }}>
        <AuthBtn classes={isDisabled ? classes.disable : classes.activeBtn} handleClick={handleLogin} btnName="Login" />
      </div>
      {infoMessage && <span>{infoMessage}</span>}
      {loginErrors && <span className={classes.formValidationErrors}>{loginErrors}</span>}
    </>
  )
}
