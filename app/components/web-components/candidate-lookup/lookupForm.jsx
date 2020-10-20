import React from 'react'
import { FormInput } from './formInput'
import { LookupBtn } from './lookupBtn'

export const LookupForm = ({ isDisabled, classes, formValues, handleChange, handleSendLink }) => {
  const { email, name, message } = formValues
  return (
    <>
      <FormInput
        labelName="Name"
        name="name"
        placeholder="Full Name"
        handleChange={handleChange}
        value={name}
        type="name"
      />
      <FormInput
        labelName="Email Address"
        name="email"
        placeholder="email@address.com"
        handleChange={handleChange}
        value={email}
        type="email"
      />
      <div style={{ marginTop: '2rem' }}>
        <LookupBtn
          btnName="Send me Link"
          classes={isDisabled ? classes.disable : classes.activeBtn}
          handleClick={handleSendLink}
        />
      </div>
      <h3>{message}</h3>
    </>
  )
}
