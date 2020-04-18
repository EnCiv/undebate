import React from 'react'
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
}) => {
  const { email, password } = formValues
  const { emailBlurMsg, passwordBlurMsg } = validationMessages

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
        handleBlur={() => handleOnBlur(emailBlurMsg, true)}
        placeholder="email@address.com"
      />
      <FormInput
        labelName="PASSWORD"
        name="password"
        value={password}
        handleChange={handleChange}
        handleBlur={() => handleOnBlur(passwordBlurMsg)}
        type="password"
      />
      <AgreementTerms setHasAgreed={setHasAgreed} hasAgreed={hasAgreed} classes={classes.agreementWrapper} />
      <div style={{ marginTop: '1rem' }}>
        <AuthBtn classes={isDisabled ? classes.disable : classes.activeBtn} handleClick={handleLogin} btnName="Login" />
      </div>
      {!!formValidationErrors.length && <span className={classes.formValidationErrors}>{formValidationErrors[0]}</span>}
      {infoMessage && <span>{infoMessage}</span>}
    </>
  )
}
