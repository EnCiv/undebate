import React from 'react'
import { FormInput } from './formInput'

const emailBlurMsg = 'email address is not valid'
const passwordBlurMsg = 'Passwords do not match'

export const LoginForm = ({
  handleChange,
  formValues,
  handleOnBlur,
  handleLogin,
  isDisabled,
  classes,
  formValidationErrors,
  infoMessage,
}) => {
  const { email, password } = formValues
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
      <button name="login" className={isDisabled ? classes.disable : classes.activeBtn} onClick={e => handleLogin(e)}>
        {'Login'}
      </button>
      {!!formValidationErrors.length && <span className={classes.formValidationErrors}>{formValidationErrors[0]}</span>}
      {infoMessage && <span>{infoMessage}</span>}
    </>
  )
}
