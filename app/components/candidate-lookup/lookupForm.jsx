import React from 'react'
import { FormInput } from './formInput'
import { LookupBtn } from './lookupBtn'

export const LookupForm = ({ isDisabled, classes, formValues, handleChange, handleLogin }) => {
  const { email, name } = formValues
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
          handleClick={handleLogin}
        />
      </div>
      <h3>{email}</h3>
      <h2>{name}</h2>
    </>
  )
}
