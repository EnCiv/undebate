import React from 'react'
import Icon from '../lib/icon'
import { FormInput } from './formInput'

export const JoinForm = ({
  handleOnBlur,
  handleChange,
  handleSignUp,
  setHasAgreed,
  hasAgreed,
  isDisabled,
  classes,
  formValidationErrors,
  infoMessage,
  formValues,
  validationMessages,
}) => {
  const { email, firstName, lastName, password, confirmPassword } = formValues
  const { emailBlurMsg, passwordBlurMsg } = validationMessages

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FormInput labelName="FIRST NAME" handleChange={handleChange} name="firstName" value={firstName} width="45%" />
        <FormInput labelName="LAST NAME" handleChange={handleChange} name="lastName" value={lastName} width="45%" />
      </div>
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
      <FormInput
        labelName="CONFIRM PASSWORD"
        name="confirmPassword"
        value={confirmPassword}
        handleChange={handleChange}
        type="password"
        handleBlur={() => handleOnBlur(passwordBlurMsg)}
      />
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Icon
          onClick={() => setHasAgreed(!hasAgreed)}
          className={hasAgreed ? 'fa-check-square-o' : 'fa-square-o'}
          icon={hasAgreed ? 'fa-check-square-o' : 'fa-square-o'}
          size="2"
          name="agree"
        />
        <span>I agree to the </span>
        <a href="https://enciv.org/terms/" target="_blank">
          Terms of Service
        </a>
      </div>
      <button name="Join" className={isDisabled ? classes.disable : classes.activeBtn} onClick={e => handleSignUp(e)}>
        {'Join'}
      </button>
      {!!formValidationErrors.length && <span className={classes.formValidationErrors}>{formValidationErrors[0]}</span>}
      {infoMessage && <span>{infoMessage}</span>}
    </>
  )
}
