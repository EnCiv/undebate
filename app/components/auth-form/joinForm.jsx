import React from 'react'
import isEmail from 'is-email'

import { FormInput } from './formInput'
import { AuthBtn } from './authBtn'
import { AgreementTerms } from './agreementTerms'

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
  const handlePasswordBlur = password && confirmPassword && password !== confirmPassword
  const handleEmailBlur = email && !isEmail(email)
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
        handleBlur={() => handleOnBlur(emailBlurMsg, handleEmailBlur)}
        placeholder="email@address.com"
      />
      <FormInput
        labelName="PASSWORD"
        name="password"
        value={password}
        handleChange={handleChange}
        handleBlur={() => handleOnBlur(passwordBlurMsg, handlePasswordBlur)}
        type="password"
      />
      <FormInput
        labelName="CONFIRM PASSWORD"
        name="confirmPassword"
        value={confirmPassword}
        handleChange={handleChange}
        type="password"
        handleBlur={() => handleOnBlur(passwordBlurMsg, handlePasswordBlur)}
      />
      <AgreementTerms setHasAgreed={setHasAgreed} hasAgreed={hasAgreed} classes={classes.agreementWrapper} />
      <AuthBtn classes={isDisabled ? classes.disable : classes.activeBtn} handleClick={handleSignUp} btnName="Join" />
      {!!formValidationErrors.length && <span className={classes.formValidationErrors}>{formValidationErrors[0]}</span>}
      {infoMessage && <span>{infoMessage}</span>}
    </>
  )
}
